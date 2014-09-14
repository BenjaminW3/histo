//-----------------------------------------------------------------------------
//! This is executed after everything has been loaded.
//-----------------------------------------------------------------------------
window.addEventListener('load', function ()
{
    var srcImgElement = document.getElementById('SrcImg');										//!< The HTML source image element.
	
    var srcImgHistCanvasElement = document.getElementById('SrcImgHistCanvas');					//!< The HTML canvas element for the histogram.
	
    var histTypeElement = document.getElementById('tab3HistTypeSelect');						//!< The HTML histogram type selection element.
	
    var transformedImgCanvasElement = document.getElementById('tab3TransformedImgCanvas');		//!< The HTML canvas element for the transformed image.
    var transformedImgCanvasCtx = transformedImgCanvasElement.getContext('2d');					//!< The HTML canvas context for the transformed image.
    var transformedImgHistCanvasElement = document.getElementById('tab3TransformedImgHistCanvas');	//!< The HTML canvas element for the transformed image histogram.
    //var targetCanvasCtx = transformedImgHistCanvasElement.getContext('2d');									//!< The HTML canvas context for the transformed image histogram.

    var srcImgExtendedImageData = new ExtendedImageData();
    var srcImgHistRenderer = new HistogrammRenderer(srcImgExtendedImageData, srcImgHistCanvasElement, '2d', histTypeElement);
    var pointOperator = new PointOperatorInverse();
    var transformedImgExtendedImageData = new ExtendedImageData();
    var transformedImgHistRenderer = new HistogrammRenderer(transformedImgExtendedImageData, transformedImgHistCanvasElement, '2d', histTypeElement);

    //-----------------------------------------------------------------------------
    //! 
    //-----------------------------------------------------------------------------
    var OnSrcImgChanged = function() {
		// Clear the class before retrieving the size because the thumb class limits the size.
		var bClassListContainsThumb = srcImgElement.classList.contains('thumb');
		if(bClassListContainsThumb) {
			srcImgElement.classList.remove('thumb');
		}
		
		srcImgExtendedImageData.loadFromImageElement(srcImgElement);
        srcImgHistRenderer.setSourceExtendedImageData(srcImgExtendedImageData);
		
		// Reset the thumb class.
		if(bClassListContainsThumb) {
			srcImgElement.classList.add('thumb');
		}
		
        RedrawSrcImgHists();
		
		RecalcTransformedImg();
	}
    //-----------------------------------------------------------------------------
    //! 
    //-----------------------------------------------------------------------------
    var RecalcTransformedImg = function() {
		// Resize the transformed image to match the source image size and copy the original data.
			// Clear the class before retrieving the size because the thumb class limits the size.
			var bClassListContainsThumb = srcImgElement.classList.contains('thumb');
			if(bClassListContainsThumb) {
				srcImgElement.classList.remove('thumb');
			}
			
			// Draw the transformed image data onto the target canvas.
			transformedImgCanvasElement.width = srcImgElement.width;
			transformedImgCanvasElement.height = srcImgElement.height;
			
			transformedImgCanvasCtx.putImageData(srcImgExtendedImageData.getImageData(), 0,0);
			
			// Reset the thumb class.
			if(bClassListContainsThumb) {
				srcImgElement.classList.add('thumb');
			}
		
		// Get the data of the source image (copied onto the target).
		var transformData = transformedImgCanvasCtx.getImageData(0, 0, transformedImgCanvasElement.width, transformedImgCanvasElement.height);
		
		// Transform the data.
		pointOperator.transformImageData(transformData);
		
		// Draw the transformed image data onto the transformed image canvas.
		transformedImgCanvasCtx.putImageData(transformData, 0,0);
		
		// Load the extended image data from the transformed image canvas.
		transformedImgExtendedImageData.loadFromCanvasElement(transformedImgCanvasElement);
		
		// Redraw the transformed image histograms.
        RedrawTransformedImgHists();
    };
    //-----------------------------------------------------------------------------
    //! 
    //-----------------------------------------------------------------------------
    var RedrawSrcImgHists = function() {
		// Render source image histograms.
        srcImgHistRenderer.drawHist(true, false);
        srcImgHistRenderer.drawTransformationCurve(pointOperator);
    };
    //-----------------------------------------------------------------------------
    //! 
    //-----------------------------------------------------------------------------
    var RedrawTransformedImgHists = function() {
		// Render source image histograms.
        transformedImgHistRenderer.drawHist(true, false);
    };
    //-----------------------------------------------------------------------------
    //! 
    //-----------------------------------------------------------------------------
    var OnHistTypeChanged = function() {
		RedrawSrcImgHists();
		RedrawTransformedImgHists();
    };

	//-----------------------------------------------------------------------------
	//! Callback method which reacts on a changed histogram type.
	//-----------------------------------------------------------------------------
    histTypeElement.addEventListener('change', OnHistTypeChanged, false);

	//-----------------------------------------------------------------------------
	//! Callback method which reacts on a changed source image.
	//-----------------------------------------------------------------------------
	srcImgElement.addEventListener('load', OnSrcImgChanged, false);

	OnSrcImgChanged();
}, false);
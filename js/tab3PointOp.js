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
    var pointOp = new PointOperatorInverse();
    var transformedImgExtendedImageData = new ExtendedImageData();
    var transformedImgHistRenderer = new HistogrammRenderer(transformedImgExtendedImageData, transformedImgHistCanvasElement, '2d', histTypeElement);

    var reloadAndUpdateHist = function() {
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
		
        updateHist();
    };
    var updateHist = function() {
        srcImgHistRenderer.drawHist(true, false);
        srcImgHistRenderer.drawTransformationCurve(pointOp);
		
		// Copy the source image to the target canvas.
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
		
		// This version is more costly because it calculates the histogram data twice.
		/*// Load the extended image data from the canvas. 
		transformedImgExtendedImageData.loadFromCanvasElement(transformedImgCanvasElement);
		
		// Transform the data.
		pointOp.transformExtendedImageData(transformedImgExtendedImageData);
		
		// Draw the transformed image data onto the target canvas.
		transformedImgCanvasCtx.putImageData(transformedImgExtendedImageData.getImageData(), 0,0);*/
		
		var transformData = transformedImgCanvasCtx.getImageData(0, 0, srcImgElement.width, srcImgElement.height);
		
		// Transform the data.
		pointOp.transformImageData(transformData);
		
		// Draw the transformed image data onto the target canvas.
		transformedImgCanvasCtx.putImageData(transformData, 0,0);
		
		// Load the extended image data from the canvas.
		transformedImgExtendedImageData.loadFromCanvasElement(transformedImgCanvasElement);
		
        transformedImgHistRenderer.drawHist(true, false);
    };

	//-----------------------------------------------------------------------------
	//! Callback method which reacts on a changed histogram type.
	//-----------------------------------------------------------------------------
    histTypeElement.addEventListener('change', updateHist, false);

	//-----------------------------------------------------------------------------
	//! Callback method which reacts on a changed source image.
	//-----------------------------------------------------------------------------
	srcImgElement.addEventListener('load', reloadAndUpdateHist, false);

	reloadAndUpdateHist();
}, false);
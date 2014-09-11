//-----------------------------------------------------------------------------
//! This is executed after everything has been loaded.
//-----------------------------------------------------------------------------
window.addEventListener('load', function ()
{
    var sourceImgElement = document.getElementById('tab3SourceImage');							//!< The HTML source image element.
	
    var histCanvasElement = document.getElementById('tab3HistogramTargetCanvas');				//!< The HTML canvas element for the histogram.
    var histTypeElement = document.getElementById('tab3HistTypeSelect');						//!< The HTML histogram type selection element.
	
    var targetCanvasElement = document.getElementById('tab3TargetCanvas');						//!< The HTML canvas element for the target image.
    var targetCanvasCtx = targetCanvasElement.getContext('2d');									//!< The HTML canvas element context for the target image.

    var extendedImageData = new ExtendedImageData();
	extendedImageData.loadFromImageElement(sourceImgElement);
    var hist = new HistogrammRenderer(extendedImageData, histCanvasElement, '2d', histTypeElement);
    var pointOp = new PointOperatorInverse();
    /*var extendedTargetImageData = new ExtendedImageData();*/

    var reloadAndUpdateHist = function() {
		// Clear the class before retrieving the size because the thumb class limits the size.
		var bClassListContainsThumb = sourceImgElement.classList.contains('thumb');
		if(bClassListContainsThumb) {
			sourceImgElement.classList.remove('thumb');
		}
		
		extendedImageData.loadFromImageElement(sourceImgElement);
        hist.setSourceExtendedImageData(extendedImageData);
		
		// Reset the thumb class.
		if(bClassListContainsThumb) {
			sourceImgElement.classList.add('thumb');
		}
		
        updateHist();
    };
    var updateHist = function() {
        hist.drawHist(true, false);
        hist.drawTransformationCurve(pointOp);
		
		// Copy the source image to the target canvas.
			// Clear the class before retrieving the size because the thumb class limits the size.
			var bClassListContainsThumb = sourceImgElement.classList.contains('thumb');
			if(bClassListContainsThumb) {
				sourceImgElement.classList.remove('thumb');
			}
			
			// Draw the transformed image data onto the target canvas.
			targetCanvasElement.width = sourceImgElement.width;
			targetCanvasElement.height = sourceImgElement.height;
			targetCanvasCtx.putImageData(extendedImageData.getImageData(), 0,0);
			
			// Reset the thumb class.
			if(bClassListContainsThumb) {
				sourceImgElement.classList.add('thumb');
			}
		
		// This version is more costly because it calculates the histogram data twice.
		/*// Load the extended image data from the canvas. 
		extendedTargetImageData.loadFromCanvasElement(targetCanvasElement);
		
		// Transform the data.
		pointOp.transformExtendedImageData(extendedTargetImageData);
		
		// Draw the transformed image data onto the target canvas.
		targetCanvasCtx.putImageData(extendedTargetImageData.getImageData(), 0,0);*/
		
		var transformData = targetCanvasCtx.getImageData(0, 0, sourceImgElement.width, sourceImgElement.height);
		
		// Transform the data.
		pointOp.transformImageData(transformData);
		
		// Draw the transformed image data onto the target canvas.
		targetCanvasCtx.putImageData(transformData, 0,0);
    };

	//-----------------------------------------------------------------------------
	//! Callback method which reacts on a changed histogram type.
	//-----------------------------------------------------------------------------
    histTypeElement.addEventListener('change', updateHist, false);

	//-----------------------------------------------------------------------------
	//! Callback method which reacts on a changed source image.
	//-----------------------------------------------------------------------------
	sourceImgElement.addEventListener('load', reloadAndUpdateHist, false);

	updateHist();
}, false);
//-----------------------------------------------------------------------------
//! This is executed after everything has been loaded.
//-----------------------------------------------------------------------------
window.addEventListener('load', function ()
{
    var sourceImgElement = document.getElementById('tab1SourceImage');					//!< The HTML source image element.
    var sourceImgSelectorElement = document.getElementById('tab1SourceImgSelect');		//!< The HTML source image selection element.
	
    var histCanvasElement = document.getElementById('tab1HistogramTargetCanvas');		//!< The HTML canvas element for the histogram.
    var histTypeElement = document.getElementById('tab1HistTypeSelect');				//!< The HTML histogram type selection element.
	//var plotFill = document.getElementById('plotFill');

    var image = new Image(sourceImgElement);
    var hist = new Histogramm(image, histCanvasElement, '2d', histTypeElement);

    var reloadAndUpdateHist = function() {
		// Clear the class before retrieving the size because the thumb class limits the size.
		var bClassListContainsThumb = sourceImgElement.classList.contains('thumb');
		if(bClassListContainsThumb) {
			sourceImgElement.classList.remove('thumb');
		}
		
		image.loadFromSource(sourceImgElement);
        hist.setSourceImage(image);
		
		// Reset the thumb class.
		if(bClassListContainsThumb) {
			sourceImgElement.classList.add('thumb');
		}
		
        updateHist();
    };
    var updateHist = function() {
        hist.drawHist(true/*plotFill.checked*/, false);
    };

	//-----------------------------------------------------------------------------
	//! Callback method which reacts on a changed histogram type.
	//-----------------------------------------------------------------------------
    histTypeElement.addEventListener('change', updateHist, false);

	//-----------------------------------------------------------------------------
	//! Callback method which reacts on a change of the source image selection.
	//-----------------------------------------------------------------------------
	sourceImgSelectorElement.addEventListener('change', function () {sourceImgElement.src = this.value;}, false);
	
	//-----------------------------------------------------------------------------
	//! Callback method which reacts on a changed source image.
	//-----------------------------------------------------------------------------
	sourceImgElement.addEventListener('load', reloadAndUpdateHist, false);

	//plotFill.addEventListener('change', updateHist, false);

	updateHist();
}, false);
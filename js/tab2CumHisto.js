//-----------------------------------------------------------------------------
//! This is executed after everything has been loaded.
//-----------------------------------------------------------------------------
window.addEventListener('load', function ()
{
    var sourceImgElement = document.getElementById('tab2SourceImage');					//!< The HTML source image element.
    var sourceImgSelectorElement = document.getElementById('tab2SourceImgSelect');		//!< The HTML source image selection element.
	
    var histCanvasElement = document.getElementById('tab2HistogramTargetCanvas');		//!< The HTML canvas element for the histogram.
    var histTypeElement = document.getElementById('tab2HistTypeSelect');				//!< The HTML histogram type selection element.

    var hist = new Histogramm(sourceImgElement, histCanvasElement, '2d', histTypeElement);

    var reloadAndUpdateHist = function() {
		// Clear the class before retrieving the size because the thumb class limits the size.
		var bClassListContainsThumb = sourceImgElement.classList.contains('thumb');
		if(bClassListContainsThumb) {
			sourceImgElement.classList.remove('thumb');
		}
		
        hist.setSourceImageElement(sourceImgElement);
		
		// Reset the thumb class.
		if(bClassListContainsThumb) {
			sourceImgElement.classList.add('thumb');
		}
		
        updateHist();
    };
    var updateHist = function() {
        hist.drawHist('discreet', true);
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

	reloadAndUpdateHist();
}, false);
//-----------------------------------------------------------------------------
//! This is executed after everything has been loaded.
//-----------------------------------------------------------------------------
window.addEventListener('load', function ()
{
    var sourceImgElement = document.getElementById('myImg');					//!< The HTML source image element.
    var sourceImgSelectorElement = document.getElementById('imgSelector');		//!< The HTML source image selection element.
	
    var histCanvasElement = document.getElementById('histogram');				//!< The HTML canvas element for the histogram.
    var histTypeElement = document.getElementById('histType');					//!< The HTML histogram type selection element.
	//var plotStyle = document.getElementById('plotStyle');
	//var plotFill = document.getElementById('plotFill');

    var hist = new Histogramm(sourceImgElement, histCanvasElement, '2d', histTypeElement);

    var reloadAndUpdateHist = function() {
		// Clear the class before retrieving the size because the thumb class limits the size.
		sourceImgElement.className = '';
        hist.setSourceImageElement(sourceImgElement);
		// Reset the thumb class.
		sourceImgElement.className = 'thumb';
		
        updateHist();
    };
    var updateHist = function() {
        hist.drawHist('discreet', true/*plotStyle.value, plotFill.checked*/);
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

	//plotStyle.addEventListener('change', updateHist, false);
	//plotFill.addEventListener('change', updateHist, false);

	/*var initHistogram = function () 
	{
		// Plot defaults
		plotStyle.value = 'continuous';
		plotFill.checked = true;
		histType.value = 'brightness';
	};
	initHistogram();*/
	reloadAndUpdateHist();
	
}, false);
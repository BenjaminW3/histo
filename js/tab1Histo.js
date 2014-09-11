//-----------------------------------------------------------------------------
//! This is executed after everything has been loaded.
//-----------------------------------------------------------------------------
window.addEventListener('load', function ()
{
    var sourceImgElement = document.getElementById('tab1SourceImage');							//!< The HTML source image element.
    var sourceImgSelectElement = document.getElementById('tab1SourceImgSelect');				//!< The HTML source image selection element.
    var sourceImgSelectOptionUserUploadElement = document.getElementById('tab1SourceImgSelectOptionUserUpload');//!< The HTML source image user upload option element.
    var sourceImgInputElement = document.getElementById('tab1SourceImgInput');					//!< The HTML source image file input element.
    var sourceImgLabelElement = document.getElementById('tab1SourceImgLabel');					//!< The HTML source image label element.
	
    var histCanvasElement = document.getElementById('tab1HistogramTargetCanvas');				//!< The HTML canvas element for the histogram.
    var histTypeElement = document.getElementById('tab1HistTypeSelect');						//!< The HTML histogram type selection element.
	//var plotFill = document.getElementById('plotFill');

    var image = new ImageData(sourceImgElement);
    var hist = new Histogramm(image, histCanvasElement, '2d', histTypeElement);

    var reloadAndUpdateHist = function() {
		// Clear the class before retrieving the size because the thumb class limits the size.
		var bClassListContainsThumb = sourceImgElement.classList.contains('thumb');
		if(bClassListContainsThumb) {
			sourceImgElement.classList.remove('thumb');
		}
		
		image.loadFromSource(sourceImgElement);
        hist.setSourceImageData(image);
		
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
	sourceImgSelectElement.addEventListener('change', function () {
		if(this.value==='user_upload')
		{
			// Enable the file input and the drag and drop fields.
			sourceImgInputElement.style.visibility = 'visible';
			sourceImgElement.classList.add('drag_drop_area');
			if(Utils.supportsDragAndDrop()) {
				sourceImgLabelElement.style.visibility = 'visible';
				sourceImgElement.ondragover = function () { sourceImgElement.classList.add('drag_drop'); return false; };
				sourceImgElement.ondragend = function () { sourceImgElement.classList.remove('drag_drop'); return false; };
				sourceImgElement.ondrop = function (e) {
					sourceImgElement.classList.remove('drag_drop');
					e.preventDefault();
					Utils.uploadImageFile(sourceImgElement, e.dataTransfer.files[0]);
				}
			}
		}
		else{
			// Disable the file input and the drag and drop fields.
			sourceImgInputElement.style.visibility = 'hidden';
			sourceImgLabelElement.style.visibility = 'hidden';
			sourceImgElement.classList.remove('drag_drop_area');
			
			// Directly set the new image.
			sourceImgElement.src = this.value;
		}
	}, false);

	//-----------------------------------------------------------------------------
	//! Callback method which reacts on a changed source image file from the input field.
	//-----------------------------------------------------------------------------
	sourceImgInputElement.addEventListener('change', function () {Utils.uploadImageFile(sourceImgElement, this.files[0]);}, false);
	
	//-----------------------------------------------------------------------------
	//! Callback method which reacts on a changed source image.
	//-----------------------------------------------------------------------------
	sourceImgElement.addEventListener('load', reloadAndUpdateHist, false);
			
	//plotFill.addEventListener('change', updateHist, false);

	// Disable upload if not supported.
	if(!Utils.supportsFileReader()) {
		sourceImgSelectOptionUserUploadElement.disabled = true;
		sourceImgSelectOptionUserUploadElement.label += ' (not supoorted)';
	}
	
	updateHist();
}, false);
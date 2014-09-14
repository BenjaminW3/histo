//-----------------------------------------------------------------------------
//! This is executed after everything has been loaded.
//-----------------------------------------------------------------------------
window.addEventListener('load', function ()
{
    var srcImgElement = document.getElementById('tab2SrcImg');									//!< The HTML source image element.
    var srcImgSelectElement = document.getElementById('tab2SrcImgSelect');						//!< The HTML source image selection element.
    var srcImgSelectOptionUserUploadElement = document.getElementById('tab2SrcImgSelectOptionUserUpload');//!< The HTML source image user upload option element.
    var srcImgInputElement = document.getElementById('tab2SrcImgInput');						//!< The HTML source image file input element.
    var srcImgLabelElement = document.getElementById('tab2SrcImgLabel');						//!< The HTML source image label element.
	
    var srcImgHistCanvasElement = document.getElementById('tab2SrcImgHistCanvas');				//!< The HTML canvas element for the histogram.
    var srcImgCumHistCanvasElement = document.getElementById('tab2SrcImgCumHistCanvas');	//!< The HTML canvas element for the histogram.
	
    var histTypeElement = document.getElementById('tab2HistTypeSelect');						//!< The HTML histogram type selection element.

    var srcImgExtendedImageData = new ExtendedImageData();
    var srcImgHistRenderer = new HistogrammRenderer(srcImgExtendedImageData, srcImgHistCanvasElement, '2d', histTypeElement);
    var srcImgCumHistRenderer = new HistogrammRenderer(srcImgExtendedImageData, srcImgCumHistCanvasElement, '2d', histTypeElement);

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
        srcImgCumHistRenderer.setSourceExtendedImageData(srcImgExtendedImageData);
		
		// Reset the thumb class.
		if(bClassListContainsThumb) {
			srcImgElement.classList.add('thumb');
		}
		
        RedrawSrcImgHists();
    };
    //-----------------------------------------------------------------------------
    //! 
    //-----------------------------------------------------------------------------
    var RedrawSrcImgHists = function() {
		// Render source image histograms.
        srcImgHistRenderer.drawHist(true, false);
        srcImgCumHistRenderer.drawHist(true, true);
    };
    //-----------------------------------------------------------------------------
    //! 
    //-----------------------------------------------------------------------------
    var OnHistTypeChanged = function() {
        RedrawSrcImgHists();
    };

	//-----------------------------------------------------------------------------
	//! Callback method which reacts on a changed histogram type.
	//-----------------------------------------------------------------------------
    histTypeElement.addEventListener('change', OnHistTypeChanged, false);

	//-----------------------------------------------------------------------------
	//! Callback method which reacts on a change of the source image selection.
	//-----------------------------------------------------------------------------
	srcImgSelectElement.addEventListener('change', function () {
		if(this.value==='user_upload')
		{
			// Enable the file input and the drag and drop fields.
			srcImgInputElement.style.visibility = 'visible';
			srcImgElement.classList.add('drag_drop_area');
			if(Utils.supportsDragAndDrop()) {
				srcImgLabelElement.style.visibility = 'visible';
				srcImgElement.ondragover = function () { srcImgElement.classList.add('drag_drop'); return false; };
				srcImgElement.ondragend = function () { srcImgElement.classList.remove('drag_drop'); return false; };
				srcImgElement.ondrop = function (e) {
					srcImgElement.classList.remove('drag_drop');
					e.preventDefault();
					Utils.uploadImageFile(srcImgElement, e.dataTransfer.files[0]);
				}
			}
		}
		else{
			// Disable the file input and the drag and drop fields.
			srcImgInputElement.style.visibility = 'hidden';
			srcImgLabelElement.style.visibility = 'hidden';
			srcImgElement.classList.remove('drag_drop_area');
			
			// Directly set the new image.
			srcImgElement.src = this.value;
		}
	}, false);

	//-----------------------------------------------------------------------------
	//! Callback method which reacts on a changed source image file from the input field.
	//-----------------------------------------------------------------------------
	srcImgInputElement.addEventListener('change', function () {Utils.uploadImageFile(srcImgElement, this.files[0]);}, false);
	
	//-----------------------------------------------------------------------------
	//! Callback method which reacts on a changed source image.
	//-----------------------------------------------------------------------------
	srcImgElement.addEventListener('load', OnSrcImgChanged, false);

	// Disable upload if not supported.
	if(!Utils.supportsFileReader()) {
		srcImgSelectOptionUserUploadElement.disabled = true;
		srcImgSelectOptionUserUploadElement.label += ' (not supported)';
	}
	
	OnSrcImgChanged();
}, false);
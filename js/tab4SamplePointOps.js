//-----------------------------------------------------------------------------
//! This is executed after everything has been loaded.
//-----------------------------------------------------------------------------
window.addEventListener('load', function ()
{
    var srcImgElement = document.getElementById('tab4SrcImg');									//!< The HTML source image element.
    var srcImgSelectElement = document.getElementById('tab4SrcImgSelect');						//!< The HTML source image selection element.
    var srcImgSelectOptionUserUploadElement = document.getElementById('tab4SrcImgSelectOptionUserUpload');//!< The HTML source image user upload option element.
    var srcImgInputElement = document.getElementById('tab4SrcImgInput');						//!< The HTML source image file input element.
    var srcImgLabelElement = document.getElementById('tab4SrcImgLabel');						//!< The HTML source image label element.
    var srcImgHistCanvasElement = document.getElementById('tab4SrcImgHistCanvas');				//!< The HTML canvas element for the histogram.
    var srcImgCumHistCanvasElement = document.getElementById('tab4SrcImgCumHistCanvas');		//!< The HTML canvas element for the cumulative histogram.

    var transformedImgCanvasElement = document.getElementById('tab4TransformedImgCanvas');
    var transformedImgCanvasCtx = transformedImgCanvasElement.getContext('2d');					//!< The HTML canvas context for the transformed image.
    var transformedImgHistCanvasElement = document.getElementById('tab4TransformedImgHistCanvas');
    var transformedImgCumHistCanvasElement = document.getElementById('tab4TransformedImgCumHistCanvas');

    var histTypeElement = document.getElementById('tab4HistTypeSelect');						//!< The HTML histogram type selection element.
    var pointOperatorSettingsElement = document.getElementById('tab4PointOperatorSettingsDiv');
    var pointOperatorSettingsApplyElement = document.getElementById('tab4PointOperatorSettingsApply');
    var pointOperatorSelectElement = document.getElementById('tab4PointOperatorSelect');

    var pointOperatorDescriptionElement = document.getElementById('tab4PointOperatorDescription');
    var pointOperatorFormulaElement = document.getElementById('tab4PointOperatorFormula');

	var pointOperator = new PointOperatorInverse();
    pointOperator.writeDescription(pointOperatorDescriptionElement);
    pointOperator.writeFormula(pointOperatorFormulaElement);
	
    var srcImgExtendedImageData = new ExtendedImageData();
    var srcImgHistRenderer = new HistogrammRenderer(srcImgExtendedImageData, srcImgHistCanvasElement, '2d', histTypeElement);
    var srcImgCumHistRenderer = new HistogrammRenderer(srcImgExtendedImageData, srcImgCumHistCanvasElement, '2d', histTypeElement);

    var transformedImgExtendedImageData = new ExtendedImageData();
    var transformedImgHistRenderer = new HistogrammRenderer(transformedImgExtendedImageData, transformedImgHistCanvasElement, '2d', histTypeElement);
    var transformedImgCumHistRenderer = new HistogrammRenderer(transformedImgExtendedImageData, transformedImgCumHistCanvasElement, '2d', histTypeElement);

    //-----------------------------------------------------------------------------
    //! 
    //-----------------------------------------------------------------------------
    var OnSrcImgChanged = function() {
        // Clear the class before retrieving the size because the thumb class limits the size.
        var bClassListContainsThumb = srcImgElement.classList.contains('pointOperatorThumb');
        if(bClassListContainsThumb) {
            srcImgElement.classList.remove('pointOperatorThumb');
        }
		
		srcImgExtendedImageData.loadFromImageElement(srcImgElement);
        srcImgHistRenderer.setSourceExtendedImageData(srcImgExtendedImageData);
        srcImgCumHistRenderer.setSourceExtendedImageData(srcImgExtendedImageData);

        // Reset the thumb class.
        if(bClassListContainsThumb) {
            srcImgElement.classList.add('pointOperatorThumb');
        }

        RedrawSrcImgHists();
		
		RecalcTransformedImg();
    };
    //-----------------------------------------------------------------------------
    //! 
    //-----------------------------------------------------------------------------
    var RecalcTransformedImg = function() {
		// Resize the transformed image to match the source image size and copy the original data.
			// Clear the class before retrieving the size because the thumb class limits the size.
			var bClassListContainsThumb = srcImgElement.classList.contains('pointOperatorThumb');
			if(bClassListContainsThumb) {
				srcImgElement.classList.remove('pointOperatorThumb');
			}
			
			transformedImgCanvasElement.width = srcImgElement.width;
			transformedImgCanvasElement.height = srcImgElement.height;
			
			transformedImgCanvasCtx.putImageData(srcImgExtendedImageData.getImageData(), 0,0);
			
			// Reset the thumb class.
			if(bClassListContainsThumb) {
				srcImgElement.classList.add('pointOperatorThumb');
			}
		
		// Load the extended image data from the transformed image canvas.
		transformedImgExtendedImageData.loadFromCanvasElement(transformedImgCanvasElement);
		
		// Transform the data.
		pointOperator.transformExtendedImageData(transformedImgExtendedImageData);
		
		// Draw the transformed image data onto the transformed image canvas.
		transformedImgCanvasCtx.putImageData(transformedImgExtendedImageData.getImageData(), 0,0);
		
		// Render the transformed image histograms.
        transformedImgHistRenderer.setSourceExtendedImageData(transformedImgExtendedImageData);
        transformedImgCumHistRenderer.setSourceExtendedImageData(transformedImgExtendedImageData);
		
		// Redraw the transformed image histograms.
        RedrawTransformedImgHists();
    };
    //-----------------------------------------------------------------------------
    //! 
    //-----------------------------------------------------------------------------
    var RedrawSrcImgHists = function() {
		// Render source image histograms.
        RedrawSrcImgHist();
        srcImgCumHistRenderer.drawHist(true, true);
    };
    //-----------------------------------------------------------------------------
    //! 
    //-----------------------------------------------------------------------------
    var RedrawSrcImgHist = function() {
		// Render source image histogram.
        srcImgHistRenderer.drawHist(true, false);
        srcImgHistRenderer.drawTransformationCurve(pointOperator);
    };
    //-----------------------------------------------------------------------------
    //! 
    //-----------------------------------------------------------------------------
    var RedrawTransformedImgHists = function() {
		// Render source image histograms.
        transformedImgHistRenderer.drawHist(true, false);
        transformedImgCumHistRenderer.drawHist(true, true);
    };
    //-----------------------------------------------------------------------------
    //! 
    //-----------------------------------------------------------------------------
    var OnHistTypeChanged = function() {
        RedrawSrcImgHists();
        RedrawTransformedImgHists();
    };
    //-----------------------------------------------------------------------------
    //! Callback method which reacts on a changed source image.
    //-----------------------------------------------------------------------------
    var OnPointOperatorChanged = function() {
        if(this.value == 'negative') {
            pointOperator = new PointOperatorInverse();
        }else if(this.value == 'potency') {
            pointOperator = new PointOperatorPotency();
        }else if(this.value == 'logarithm') {
            pointOperator = new PointOperatorLogarithm();
        }else if(this.value == 'exponential') {
            pointOperator = new PointOperatorExponential();
        }else if(this.value == 'shift') {
            pointOperator = new PointOperatorHistoShift();
        }else if(this.value == 'limit') {
            pointOperator = new PointOperatorHistoLimitation();
        }else if(this.value == 'spread') {
            pointOperator = new PointOperatorHistoSpread();
        }else if(this.value == 'equal') {
            pointOperator = new PointOperatorHistoEqualization();
        }else if(this.value == 'hyperbol') {
            pointOperator = new PointOperatorHistoHyperbolization();
        }else if(this.value == 'quant') {
            pointOperator = new PointOperatorQuantization();
        }else if(this.value == 'threshhold') {
            pointOperator = new PointOperatorThreshold();
        }
		
		// Clean settings div
        pointOperatorSettingsElement.innerHTML = '';
		
		// Add current point operators settings to div.
		pointOperator.addPropertyInputElementsToElement(pointOperatorSettingsElement);
		
		// If there are no settings, dont show the apply button.
		if(pointOperatorSettingsElement.innerHTML == '')
		{
			pointOperatorSettingsApplyElement.style.display = 'none';
		}
		else
		{
			pointOperatorSettingsApplyElement.style.display = 'block';
		}

        // Write the description
        pointOperator.writeDescription(pointOperatorDescriptionElement);

        // Write the formula
        pointOperator.writeFormula(pointOperatorFormulaElement);

		// The transformation curve has to be updated.
		RedrawSrcImgHist();
		
		// Recalculate the transformed image.
		RecalcTransformedImg();
    };
    //-----------------------------------------------------------------------------
    //! Callback method which reacts on the point operator settings apply button.
    //-----------------------------------------------------------------------------
    var OnPointOperatorSettingsChanged = function() {
		// The transformation curve has to be updated.
		RedrawSrcImgHist();
		
		// Recalculate the transformed image.
		RecalcTransformedImg();
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

    //-----------------------------------------------------------------------------
    //! Callback method which reacts on a changed point operator.
    //-----------------------------------------------------------------------------
    pointOperatorSelectElement.addEventListener('change', OnPointOperatorChanged, false);
	
    //-----------------------------------------------------------------------------
    //! Callback method which reacts on the point operator settings apply button.
    //-----------------------------------------------------------------------------
    pointOperatorSettingsApplyElement.addEventListener('click', OnPointOperatorSettingsChanged, false);
	
    // Disable upload if not supported.
    if(!Utils.supportsFileReader()) {
        srcImgSelectOptionUserUploadElement.disabled = true;
        srcImgSelectOptionUserUploadElement.label += ' (not supported)';
    }

    OnSrcImgChanged();
}, false);

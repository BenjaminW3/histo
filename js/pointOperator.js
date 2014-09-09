

function PointOperator(_originalId, _manipulateId) {
    var transformedCanvas = document.getElementById(_manipulateId);
    var transformedCtx = transformedCanvas.getContext('2d');
    transformedCanvas.width = img.width;
    transformedCanvas.height = img.height;
    this.transformedData = transformedCtx.getImageData(0,0,transformedCanvas.width, transformedCanvas.height);

    this.sourceImgData = null;
}

/**
 * Set set intern image data
 */
PointOperator.prototype.setSourceImageElement = function(_sourceImageElement) {
    var sourceImgTempCanvas = document.createElement('canvas');			//!< An invisible canvas for copying the image into.
    sourceImgTempCanvas.width = _sourceImageElement.width;
    sourceImgTempCanvas.height = _sourceImageElement.height;
    var sourceImgTempCtx = sourceImgTempCanvas.getContext('2d');		//!< The context of the invisible canvas for copying the image into.
    sourceImgTempCtx.drawImage(_sourceImageElement, 0, 0);
    this.sourceImgData = sourceImgTempCtx.getImageData(0, 0, _sourceImageElement.width, _sourceImageElement.height).data;
};


PointOperator.prototype.updateTransformedCanvas = function () {
    transformedCtx.putImageData(transformedData,0,0);
};

/**
 * inverts the original img
 * @param int _G default= 255
 */
PointOperator.prototype.inverse = function (_G) {
    _G = typeof _G !== 'undefined' ? _G : 255;
    var data = origData.data;
    for(var i=0; i<data.length; i+=4) {
        this.transformedData.data[i] = _G - data[i];
    }
    this.updateTransformedCanvas();
};



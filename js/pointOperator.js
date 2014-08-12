

function PointOperator(_originalId, _manipulateId) {
    var img = document.getElementById(_originalId);
    var imgCtx = img.getContext('2d');
    this.origImgData = imgCtx.getImageData(0, 0, img.width, img.height);

    var transformedCanvas = document.getElementById(_manipulateId);
    var transformedCtx = transformedCanvas.getContext('2d');
    transformedCanvas.width = img.width;
    transformedCanvas.height = img.height;
    this.transformedData = transformedCtx.getImageData(0,0,transformedCanvas.width, transformedCanvas.height);
}


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



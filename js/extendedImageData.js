/**
 * Constructor.
 */
function ExtendedImageData() {
    this.channelHistogram = [[],[],[],[]];
    this.channelHistogramMax = [0,0,0,0];
    this.width = 0;
    this.height = 0;
    this.srcImgData = null;
    this.maxValues = [0,0,0];
    this.minValues = [255,255,255];
}

ExtendedImageData.prototype.updateMinMax = function(_r, _g, _b) {
    if(_r > this.maxValues[0]) {
        this.maxValues[0] = _r;
    }
    if(_g > this.maxValues[1]) {
        this.maxValues[1] = _g;
    }
    if(_b > this.maxValues[2]) {
        this.maxValues[2] = _b;
    }
    if(_r < this.minValues[0]) {
        this.minValues[0] = _r;
    }
    if(_g < this.minValues[1]) {
        this.minValues[1] = _g;
    }
    if(_b < this.minValues[2]) {
        this.minValues[2] = _b;
    }
};

ExtendedImageData.prototype.getMin = function(idx) {
    return this.minValues[idx];
};

ExtendedImageData.prototype.getMax = function(idx) {
    return this.maxValues[idx];
};

ExtendedImageData.prototype.getWidth = function() {
    return this.srcImgData.width;
}

ExtendedImageData.prototype.getHeight = function() {
    return this.srcImgData.height;
}

ExtendedImageData.prototype.getNumPixels = function() {
    return this.srcImgData.width * this.srcImgData.height;
}

ExtendedImageData.prototype.getChannelHistogramMax = function(_channelNo) {
    return this.channelHistogramMax[_channelNo];
}

ExtendedImageData.prototype.getImageData = function() {
    return this.srcImgData;
}



/**
 * Returns the channelcount array for histogram
 * @param _channelNo 0: luminance, 1: red, 2: green, 3: blue
 * @returns array of the channel or null if the channel number is invalid
 */
ExtendedImageData.prototype.getChannelHistogram = function(_channelNo) {
    if((_channelNo >= 0) && (_channelNo < 4)) {
        return this.channelHistogram[_channelNo];
    }
    return null;
}

/**
 *  Calculate channelvaluecount and maxCount for all channels
 */
ExtendedImageData.prototype.recalculateImageDataDependencies = function() {
	this.channelHistogram = [[],[],[],[]];
	this.channelHistogramMax = [0,0,0,0];

    var pixelStepWidth = 4; // 4 because the image data is always RGBA.

    for (var i = 0, n = this.srcImgData.data.length; i < n; i+= pixelStepWidth) {
        this.updateMinMax(this.srcImgData.data[i], this.srcImgData.data[i+1], this.srcImgData.data[i+2]);
        var pixel = [Utils.calcYFromRgb(this.srcImgData.data[i], this.srcImgData.data[i+1], this.srcImgData.data[i+2]), this.srcImgData.data[i], this.srcImgData.data[i+1], this.srcImgData.data[i+2]];

        for(var color = 0; color < 4; color++) {
            if(pixel[color] in this.channelHistogram[color]) {
                this.channelHistogram[color][pixel[color]]++;
            }else {
                this.channelHistogram[color][pixel[color]] = 1;
            }
            if(this.channelHistogram[color][pixel[color]] > this.channelHistogramMax[color]) {
                this.channelHistogramMax[color] = this.channelHistogram[color][pixel[color]];
            }
        }
    }
}
/**
 * Load Data from the given image.
 */
ExtendedImageData.prototype.loadFromImageElement = function(_srcImgElement) {
    var srcImgTempCanvas = document.createElement('canvas');			//!< An invisible canvas for copying the image into.
    srcImgTempCanvas.width = _srcImgElement.width;
    srcImgTempCanvas.height = _srcImgElement.height;
    var srcImgTempCtx = srcImgTempCanvas.getContext('2d');				//!< The context of the invisible canvas for copying the image into.

    // Draw the image data onto the invisible image context.
    srcImgTempCtx.drawImage(_srcImgElement, 0, 0);
	
	this.loadFromCanvasElement(srcImgTempCanvas);
};
/**
 * Load Data from the given image.
 */
ExtendedImageData.prototype.loadFromCanvasElement = function(_srcImgCanvas) {
    var srcImgCanvasContext = _srcImgCanvas.getContext('2d');			//!< The context of the invisible canvas for copying the image into.
	
    // Get the image data from the invisible image canvas context.
    // CHROME: If you get an error in the following line you are possibly running this site locally in google chrome. Its safety policy treats all local files as served by different domains and forbids some operations from a source different to the page itself.
    // Add --allow-file-access-from-files to chrome startup to circumvent this.
    this.srcImgData = srcImgCanvasContext.getImageData(0, 0, _srcImgCanvas.width, _srcImgCanvas.height);

    this.recalculateImageDataDependencies();
};
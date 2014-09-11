/**
 * Constructor.
 */
function PixelData(_r,_g,_b,_a) {
    this.r = _r;
    this.g = _g;
    this.b = _b;
    if(_a == undefined) _a = 255;
    this.a = _a;
    this.l = Utils.calcYFromRgb(_r, _g, _b); //luminance
}

PixelData.prototype.luminance = function() {
    return this.l;
};

PixelData.prototype.red = function() {
    return this.r;
};

PixelData.prototype.green = function() {
    return this.g;
};

PixelData.prototype.blue = function() {
    return this.b;
};

PixelData.prototype.alpha = function() {
    this.a;
};

PixelData.prototype.yrgba = function() {
    return {"luminance": this.l, "red": this.r, "green": this.g, "blue": this.b, "alpha": this.a};
};

/**
 * Constructor.
 */
function ExtendedImageData(_sourceImageElement) {
    this.channelValue = [[]];					//!< Two dimensional array with PixelData.
    this.channelHistogram = [[],[],[],[]];
    this.channelHistogramMax = [0,0,0,0];
    this.width = 0;
    this.height = 0;
    this.sourceImgData = null;
	
	this.loadFromSource(_sourceImageElement);
}

/**
 *
 * @param _x width coordinate
 * @param _y height coordinate
 * @returns object {luminance, red, green, blue, alpha} or null if its out of range
 */
ExtendedImageData.prototype.getPixelData = function(_x, _y) {
    if(_y < this.channelValue.length) {
        if(_x < this.channelValue[_y].length) {
            return this.channelValue[_y][_x].yrgba();
        }
    }
    return null;
};

ExtendedImageData.prototype.getWidth = function() {
    return this.sourceImgData.width;
}

ExtendedImageData.prototype.getHeight = function() {
    return this.sourceImgData.height;
}

ExtendedImageData.prototype.getNumPixels = function() {
    return this.sourceImgData.width * this.sourceImgData.height;
}

ExtendedImageData.prototype.getChannelHistogramMax = function(_channelNo) {
    return this.channelHistogramMax[_channelNo];
}

ExtendedImageData.prototype.getImageData = function() {
    return this.sourceImgData;
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
ExtendedImageData.prototype.reload = function() {
	this.channelHistogram = [[],[],[],[]];
	this.channelHistogramMax = [0,0,0,0];

    var pixelStepWidth = 4; // 4 because the image data is always RGBA.
    var x = 0;
    var y = 0;
    this.channelValue.push([]);
    for (var i = 0, n = this.sourceImgData.data.length; i < n; i+= pixelStepWidth) {
        var pixel = new PixelData(this.sourceImgData.data[i], this.sourceImgData.data[i+1], this.sourceImgData.data[i+2], this.sourceImgData.data[i+3]);
        var value = [pixel.luminance(), pixel.red(), pixel.green(), pixel.blue()];
        this.channelValue[y].push(pixel);

        for(var color = 0; color < 4; color++) {
            if(value[color] in this.channelHistogram[color]) {
                this.channelHistogram[color][value[color]]++;
            }else {
                this.channelHistogram[color][value[color]] = 1;
            }
            if(this.channelHistogram[color][value[color]] > this.channelHistogramMax[color]) {
                this.channelHistogramMax[color] = this.channelHistogram[color][value[color]];
            }
        }

        if(x == (this.width-1)) {
            x = 0;
            y++;
            this.channelValue.push([]);
        }else {
            x++;
        }
    }
}
/**
 * Load Data from the given image.
 */
ExtendedImageData.prototype.loadFromSource = function(_sourceImageElement) {
    var sourceImgTempCanvas = document.createElement('canvas');			//!< An invisible canvas for copying the image into.
    sourceImgTempCanvas.width = _sourceImageElement.width;
    sourceImgTempCanvas.height = _sourceImageElement.height;
    var sourceImgTempCtx = sourceImgTempCanvas.getContext('2d');		//!< The context of the invisible canvas for copying the image into.

    // Draw the image data onto the invisible image context.
    sourceImgTempCtx.drawImage(_sourceImageElement, 0, 0);
	
    // Get the image data from the invisible image canvas context.
    // CHROME: If you get an error in the following line you are possibly running this site locally in google chrome. Its safety policy treats all local files as served by different domains and forbids some operations from a source different to the page itself.
    // Add --allow-file-access-from-files to chrome startup to circumvent this.
    this.sourceImgData = sourceImgTempCtx.getImageData(0, 0, _sourceImageElement.width, _sourceImageElement.height);

    this.reload();
};
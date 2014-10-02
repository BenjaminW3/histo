function Utils() {}

/**
 * The luminance Y calculated from the RGB values.
 * @param _r red
 * @param _g green
 * @param _b blue
 * @returns luminance
 */
Utils.calcYFromRgb = function(_r, _g, _b) {
    return Math.round(0.299 * _r + 0.587 * _g + 0.114 * _b);
};

/**
 * Converts a RGB color to a YCbCr color.
 * @param _r red
 * @param _g green
 * @param _b blue
 */
Utils.rgbToYCbCr = function(_r, _g, _b) {
  return [	Math.round(( 0.299 * _r + 0.587 * _g  +  0.114 * _b) + 0),
			Math.round(( -0.169 * _r + -0.331 * _g +  0.500 * _b) + 128),
			Math.round(( 0.500 * _r + -0.419 * _g +  -0.081 * _b) + 128)];
}
/**
 * Converts a YCbCr color to a Rgb color.
 * @param _y The luminance.
 * @param _cb The blue chroma.
 * @param _cr The red chroma.
 */
Utils.yCbCrToRgb = function(_y, _cb, _cr) {
  return [	Math.round(1.0 * _y +  0 * (_cb-128)      +  1.4 * (_cr-128)),
			Math.round(1.0 * _y +  -0.343 * (_cb-128)  +  -0.711 * (_cr-128)),
			Math.round(1.0 * _y +  1.765 * (_cb-128)  +  0 * (_cr-128))];
}

/**
 * @returns If the browser supports drag and drop.
 */
Utils.supportsDragAndDrop = function() {
	return 'draggable' in document.createElement('span');
};

/**
 * @returns If the browser supports reading files from disk.
 */
Utils.supportsFileReader = function() {
	return typeof FileReader != 'undefined';
};

/**
 * Reads an image given by the user.
 */
Utils.uploadImageFile = function (_dstImgElement, file) {
	var acceptedTypes = {
	  'image/png': true,
	  'image/jpeg': true,
	  'image/gif': true
	};

	if (acceptedTypes[file.type] === true) {
		var reader = new FileReader();
		reader.onload = function (event) {
			_dstImgElement.src = event.target.result;
		};
		reader.readAsDataURL(file);
	}  else {
		alert("Unsupported image file type:" + file);
	}
};

/**
 * Logarithm with given base.
 */
Utils.log = function(x, base) {
    return Math.log(x) / Math.log(base);
}

/**
 * Clips the given value.
 */
Utils.clip = function(_val, _min, _max) {
    if(_val < _min) {
        return _min;
    }
    if(_val > _max) {
        return _max;
    }
	return _val;
};

/**
 * Normalizes the given 3 dimensional vector.
 */
Utils.normalizeVector3 = function(_v3){
	var length = Math.sqrt(_v3[0]*_v3[0] + _v3[1]*_v3[1] + _v3[2]*_v3[2]);
	var invLength = 1.0 / length;
    return [_v3[0]*invLength, _v3[1]*invLength, _v3[2]*invLength];
};

/**
 * Inheritance helper see: http://phrogz.net/JS/classes/OOPinJS2.html
 */
Function.prototype.inheritsFrom = function( parentClassOrObject ){
    if ( parentClassOrObject.constructor == Function )
    {
        //Normal Inheritance
        this.prototype = new parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject.prototype;
    }
    else
    {
        //Pure Virtual Inheritance
        this.prototype = parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject;
    }
    return this;
};
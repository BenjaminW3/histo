function Utils() {}

/**
 * The luminance Y calculated from the RGB values.
 * @param R float red
 * @param G float green
 * @param B float blue
 * @returns luminance
 */
Utils.calcYFromRgb = function(R, G, B) {
    return Math.round(0.299 * R + 0.587 * G + 0.114 * B);
};

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
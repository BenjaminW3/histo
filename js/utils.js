function Utils() {}

/**
 * return The luminance Y calculated from the RGB values.
 * @param R float red
 * @param G float green
 * @param B float blue
 * @returns luminance
 */
Utils.calcYFromRgb = function(R, G, B) {
    return Math.round(0.299 * R + 0.587 * G + 0.114 * B);
};

Utils.supportsDragAndDrop = function() {
	return 'draggable' in document.createElement('span');
};

Utils.supportsFileReader = function() {
	return typeof FileReader != 'undefined';
};

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
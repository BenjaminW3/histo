/**
 * Constructor.
 */
function PointOperator() {
}

/**
 * Transform the given image data.
 */
PointOperator.prototype.transformExtendedImageData = function (_extendedImageData) {
	transformImageData(_extendedImageData.getImageData());
};

/**
 * Transform the given image data.
 */
PointOperator.prototype.transformImageData = function (_imageData) {
    var pixelStepWidth = 4; // 4 because the image data is always RGBA.
    for (var i = 0, n = _imageData.data.length; i < n; i+= pixelStepWidth) {
		var transformedPixel = this.transformPixel(_imageData.data[i], _imageData.data[i+1], _imageData.data[i+2]);
		_imageData.data[i] = transformedPixel[0];
		_imageData.data[i+1] = transformedPixel[1];
		_imageData.data[i+2] = transformedPixel[2];
		//_imageData.data[i+3] = _imageData.data[i+3];	// Do not change alpha value!
    }
};

/**
 * Abstract method.
 */
PointOperator.prototype.transformPixel = function (_r, _g, _b) {
    alert('This is the abstract base class method. This has to be implemented by derieved classes!');
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
}



/**
 * Inverse color transformation.
 */
function PointOperatorInverse(){
}

PointOperatorInverse.inheritsFrom( PointOperator );

PointOperatorInverse.prototype.transformPixel = function(_r, _g, _b){
	return [255-_r, 255-_g, 255-_b];
}



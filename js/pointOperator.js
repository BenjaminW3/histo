/**
 * Constructor.
 */
function PointOperatorParameter(_sName, _sDescription, _inputAttributes) {
    this.sName = _sName;
    this.sDescription = _sDescription;
	
	// Create the surrounding label element.
    this.labelElement = document.createElement('label');
	this.labelElement.innerHTML += this.sName + ': ';
	
	// Create the input element.
    this.inputElement = document.createElement('input');
	for(var attribute in _inputAttributes)
	{
		this.inputElement.setAttribute(attribute, _inputAttributes[attribute]);
	}
	// Add the input element to the label.
	this.inputElement.appendChild(this.inputElement);
	
	// Add the description.
	this.labelElement.innerHTML += ' ' + this.sDescription;
}
PointOperatorParameter.prototype.value = function() {
    return this.inputElement.value;
};
PointOperatorParameter.prototype.addToElement = function(_parentElement) {
	_parentElement.appendChild(this.labelElement);
};

/**
 * Constructor.
 */
function PointOperator() {
	this.sDescription = 'No description available!';
	this.sFormulaHtml = 'No formula available!';	//!< This could be a html image element text ("<img src='...sdfsfg...'>") or just plain text.
	this.sParameters = { 
		/*'unnamed' : new PointOperatorParameter('not available', {'type' : 'number', 'defaultValue' : 0, 'min' : 0, 'max' : 255, 'step' : 1})*/
	};
}

/**
 * Transform the given image data.
 */
PointOperator.prototype.transformExtendedImageData = function (_extendedImageData) {
	this.transformImageData(_extendedImageData.getImageData());
	_extendedImageData.recalculateImageDataDependencies();
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
	this.sDescription = 'TODO';
	this.sFormulaHtml = 'TODO';
	this.sParameters = {};
}

PointOperatorInverse.inheritsFrom( PointOperator );

PointOperatorInverse.prototype.transformPixel = function(_r, _g, _b){
	return [255-_r, 255-_g, 255-_b];
}



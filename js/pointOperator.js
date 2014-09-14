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
	this.labelElement.appendChild(this.inputElement);
	
	// Add the description.
	this.labelElement.innerHTML += ' ' + this.sDescription;
}
PointOperatorParameter.prototype.value = function() {
    return this.inputElement.value;
};
PointOperatorParameter.prototype.addInputElementToElement = function(_parentElement) {
	_parentElement.appendChild(this.labelElement);
};

/**
 * Constructor.
 */
function PointOperator() {
	this.sDescription = 'No description available!';	//!< The desription of the point operator.
	this.sFormulaHtml = 'No formula available!';		//!< This could be a html image element text ("<img src='...sdfsfg...'>") or just plain text.
	this.sParameters = { 
		/*'unnamed' : new PointOperatorParameter('not available', {'type' : 'number', 'defaultValue' : 0, 'min' : 0, 'max' : 255, 'step' : 1})*/
	};													//!< The parameters of the point operator.
}

/**
 * Adds all the parameter input elements to the given element.
 */
PointOperator.prototype.addPropertyInputElementsToElement = function (_parentElement) {
	for(var param in this.sParameters)
	{
		//console.log(param);
		this.sParameters.param.addInputElementToElement(_parentElement);
	}
};
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
 * Inverse color transformation.
 */
function PointOperatorInverse(){
	this.sDescription = 'Bei der Negativtransformation wird eine Invertierung der Grauwerte eines Grauwertbildes durchgeführt. ' +
                        'Dies kann zur besseren Wahrnehmung feiner Strukturen führen, da das menschliche Auge feine Unterschiede ' +
                        'zwischen Grauwerten gut wahrnehmen kann.';
	this.sFormulaHtml = 'TODO';
    this.sParameters = {

    };
}

PointOperatorInverse.inheritsFrom( PointOperator );

PointOperatorInverse.prototype.transformPixel = function(_r, _g, _b){
	return [255-_r, 255-_g, 255-_b];
};

/**
 * Potency color transformation.
 */
function PointOperatorPotency(){
    this.sDescription = 'Die Potenztransformation, oder auch Gammakorrektur, ist eine monotone Transformation auf Basis einer Potenzfunktion. ' +
                        'Duch eine lineare Spreizung bei einem Teil der Grauwerte lässt sich die Helligkeit des Bildes verändern.';
    this.sFormulaHtml = 'TODO';
    this.sParameters = {
        'e' : new PointOperatorParameter('Exponent', 'BESCHREIBUNG', {'type' : 'number', 'defaultValue' : 1.1, 'min' : 0, 'max' : 5, 'step' : 0.1})
    };
}

PointOperatorPotency.inheritsFrom( PointOperator );

PointOperatorPotency.prototype.transformPixel = function(_r, _g, _b){
    var exp = this.sParameters.e.value();
    return [255 * (Math.pow((_r/255), exp )), 255 * (Math.pow((_g/255),  exp)), 255 * (Math.pow((_b/255), exp))];
};

/**
 * Logarithm color transformation.
 */
function PointOperatorLogarithm(){
    this.sDescription = 'TODO';
    this.sFormulaHtml = 'TODO';
    this.sParameters = {
        'e' : new PointOperatorParameter('Exponent', 'BESCHREIBUNG', {'type' : 'number', 'defaultValue' : 1.1, 'min' : 0, 'max' : 5, 'step' : 0.1})
    };
}

PointOperatorLogarithm.inheritsFrom( PointOperator );

PointOperatorLogarithm.prototype.transformPixel = function(_r, _g, _b){
    var exp = this.sParameters.e.value();
    return [255 * (Math.pow((_r/255), exp )), 255 * (Math.pow((_g/255),  exp)), 255 * (Math.pow((_b/255), exp))];
};

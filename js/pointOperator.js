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
		/*'unnamed' : new PointOperatorParameter('not available', {'type' : 'number', 'value' : 0, 'min' : 0, 'max' : 255, 'step' : 1})*/
	};													//!< The parameters of the point operator.
}

/**
 * Adds all the parameter input elements to the given element.
 */
PointOperator.prototype.addPropertyInputElementsToElement = function (_parentElement) {
	for(var param in this.sParameters)
	{
		this.sParameters[param].addInputElementToElement(_parentElement);
		_parentElement.innerHTML += "<br/>";
	}
	
	// DEBUG
	//this.sParameters.e.inputElement.value = "1.4";
};
/**
 * Transform the given image data.
 */
PointOperator.prototype.transformExtendedImageData = function (_extendedImageData) {
	var imageData = _extendedImageData.getImageData();
	
    var pixelStepWidth = 4; // 4 because the image data is always RGBA.
    for (var i = 0, n = imageData.data.length; i < n; i+= pixelStepWidth) {
		var transformedPixel = this.transformPixel(imageData.data[i], imageData.data[i+1], imageData.data[i+2], _extendedImageData);
		imageData.data[i] = transformedPixel[0];
		imageData.data[i+1] = transformedPixel[1];
		imageData.data[i+2] = transformedPixel[2];
		//imageData.data[i+3] = imageData.data[i+3];	// Do not change alpha value!
    }
	
	// The image has been changed so update the dependent data.
	_extendedImageData.recalculateImageDataDependencies();
};

/**
 * Abstract method.
 */
PointOperator.prototype.transformPixel = function (_r, _g, _b, _extendedImageData) {
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

PointOperatorInverse.prototype.transformPixel = function(_r, _g, _b, _extendedImageData){
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
        'e' : new PointOperatorParameter('Exponent', 'BESCHREIBUNG', {'type' : 'number', 'value' : 1.2, 'min' : 0, 'max' : 5, 'step' : 0.1})
    };
}

PointOperatorPotency.inheritsFrom( PointOperator );

PointOperatorPotency.prototype.transformPixel = function(_r, _g, _b, _extendedImageData){
    var exp = this.sParameters.e.value();
    return [255 * (Math.pow((_r/255), exp )), 255 * (Math.pow((_g/255),  exp)), 255 * (Math.pow((_b/255), exp))];
};



/**
 * Logarithm color transformation.
 */
function PointOperatorLogarithm(){
    this.sDescription = 'Die Logarithmustransformation ist eine monotone Transformation auf Basis des Logarithmus.' +
                        'Die oberen Grauwerte werden komprimiert, während kleine Grauwerte auf eine größere Grauwertspanne abgebildet werden.';
    this.sFormulaHtml = 'TODO';
    this.sParameters = {

    };
}

PointOperatorLogarithm.inheritsFrom( PointOperator );

PointOperatorLogarithm.prototype.transformPixel = function(_r, _g, _b, _extendedImageData){
    return [255 * (Utils.log2((_r+1)) / Utils.log2((255+1))), 255 * (Utils.log2((_g+1)) / Utils.log2((255+1))), 255 * (Utils.log2((_b+1)) / Utils.log2((255+1)))];
};



/**
 * Exponential color transformation.
 */
function PointOperatorExponential(){
    this.sDescription = 'Die Exponentialtransformation ist eine monotone Transformation auf Basis der Exponentialfunktion.' +
        'Die unteren Grauwerte werden komprimiert, während eine kleine Grauwertspanne im oberen Bereich auf eine größere Grauwertspanne im Ergebnisbild abgebildet wird.';
    this.sFormulaHtml = 'TODO';
    this.sParameters = {

    };
}

PointOperatorExponential.inheritsFrom( PointOperator );

PointOperatorExponential.prototype.transformPixel = function(_r, _g, _b, _extendedImageData){
    return [Math.pow((255+1),(_r/255)) -1, Math.pow((255+1),(_g/255)) -1, Math.pow((255+1),(_b/255)) -1];
};



/**
 * Histogram shift
 */
function PointOperatorHistoShift(){
    this.sDescription = 'Mit Hilfe der Histogrammverschiebung kann die Helligkeit eines Bildes reguliert werden.' +
                        'Alle Farbwerte eines Bildes werden um eine feste Konstante in den helleren oder dunkleren Bereich verschoben.';
    this.sFormulaHtml = 'TODO';
    this.sParameters = {
        'c' : new PointOperatorParameter('Konstante', 'BESCHREIBUNG', {'type' : 'number', 'value' : 50, 'min' : 0, 'max' : 255, 'step' : 1})
    };
}

PointOperatorHistoShift.inheritsFrom( PointOperator );

PointOperatorHistoShift.prototype.transformPixel = function(_r, _g, _b, _extendedImageData){
    var transR = _r + this.sParameters.c.value();
    var transG = _g + this.sParameters.c.value();
    var transB = _b + this.sParameters.c.value();
    if(transR < 0) {
        transR = 0;
    }else if(transR > 255) {
        transR = 255;
    }
    if(transG < 0) {
        transG = 0;
    }else if(transG > 255) {
        transG = 255;
    }
    if(transB < 0) {
        transB = 0;
    }else if(transB > 255) {
        transB = 255;
    }
    return [transR, transG, transB];
};



/**
 * Histogram limitation
 */
function PointOperatorHistoLimitation(){
    this.sDescription = 'Grauwerte ausserhalb eines bestimmten Bereiches werden abgeschnitten.';
    this.sFormulaHtml = 'TODO';
    this.sParameters = {
        'gmin' : new PointOperatorParameter('Untere Schranke', 'BESCHREIBUNG', {'type' : 'number', 'value' : 50, 'min' : 0, 'max' : 254, 'step' : 1}),
        'gmax' : new PointOperatorParameter('Obere Schranke', 'BESCHREIBUNG', {'type' : 'number', 'value' : 200, 'min' : 1, 'max' : 255, 'step' : 1})
    };
    /**
     * TODO: add constraint gmin < gmax!!!
     */
}

PointOperatorHistoLimitation.inheritsFrom( PointOperator );

PointOperatorHistoLimitation.prototype.clip = function(_x, _min, _max) {
    if(_min <= _x && _x <= _max) {
        return (255 * ((_x - _min) / (_max  - _min)));
    }
    if(0 <= _x && _x <= _min) {
        return 0;
    }
    if(_max <= _x && _x <= 255) {
        return 255;
    }
};

PointOperatorHistoLimitation.prototype.transformPixel = function(_r, _g, _b, _extendedImageData){
    var min = this.sParameters.gmin.value();
    var max = this.sParameters.gmax.value();
    return [this.clip(_r, min, max), this.clip(_g, min, max), this.clip(_b, min, max)];
};



/**
 * Histogram spreading / compression
 */
function PointOperatorHistoSpread(){
    this.sDescription = 'Histogrammspreizung wird häufig zur Kontrastverstärkung in kostrastarmen Bildern eingesetzt. ' +
                        'Dabei wird eine stückweiße lineare Transformation genutzt, die den gewählten Tonwertbereich auf den gesamten verfügbaren abbildet.';
    this.sFormulaHtml = 'TODO';
    this.sParameters = {
        'gmin' : new PointOperatorParameter('Untere Schranke', 'BESCHREIBUNG', {'type' : 'number', 'value' : 25, 'min' : 0, 'max' : 254, 'step' : 1}),
        'gmax' : new PointOperatorParameter('Obere Schranke', 'BESCHREIBUNG', {'type' : 'number', 'value' : 225, 'min' : 1, 'max' : 255, 'step' : 1})
    };
}

PointOperatorHistoSpread.inheritsFrom( PointOperator );

PointOperatorHistoSpread.prototype.transformPixel = function(_r, _g, _b, _extendedImageData){
    var diff = this.sParameters.gmax.value() - this.sParameters.gmin.value();
    return [(255* ((_r - this.sParameters.gmin.value()) / diff)),(255* ((_g - this.sParameters.gmin.value()) / diff)),(255* ((_b - this.sParameters.gmin.value()) / diff))];
};



/**
 * Histogram equalization
 * TODO!!! Need cummulative data: T(g) = [255 * H(g)]   -->H(g) ... kummulativ
 */
function PointOperatorHistoEqualization(){
    this.sDescription = 'Histogramequalisation ist ein wichtiges Verfahren zur Kontrastverbesserung. Es wird eine Gleichverteilung bei den Werten des Histogrammes berechnet ' +
                        'damit der gesamte zur Verfügung stehende Wertebereich optimal ausgenutzt werden kann.';
    this.sFormulaHtml = 'TODO';
    this.sParameters = {

    };
}

PointOperatorHistoEqualization.inheritsFrom( PointOperator );

PointOperatorHistoEqualization.prototype.transformPixel = function(_r, _g, _b, _extendedImageData) {
    return [0,0,0];
};



/**
 * Histogram equalization
 * TODO!!! Need cummulative data: T(g) = [255 * Math.pow(H(g), (1/alpha+1)]   -->H(g) ... kummulativ
 */
function PointOperatorHistoHyperbolization(){
    this.sDescription = 'Die Grauwerte werden dem subjektiven menschlichen Empfinden angepasst. ';
    this.sFormulaHtml = 'TODO';
    this.sParameters = {
        'alpha' : new PointOperatorParameter('Alpha (-x/3)', 'BESCHREIBUNG', {'type' : 'number', 'value' : 1, 'min' : 0, 'max' : 2, 'step' : 1})
    };
}

PointOperatorHistoHyperbolization.inheritsFrom( PointOperator );

PointOperatorHistoHyperbolization.prototype.transformPixel = function(_r, _g, _b, _extendedImageData) {
    /*
    var tAlpha = 0;
    if(this.sParameters.alpha.value() == 0) {
        tAlpha = 1;
    }else if(this.sParameters.alpha.value() == 1) {
        tAlpha = 1.5;   //1 / -1/3 + 1 = 1 / (2/3) = 3/2 = 1.5
    }else if(this.sParameters.alpha.value() == 2) {
        tAlpha = 3;
    }
    return [ (255*Math.pow(H(_r), tAlpha),(255*Math.pow(H(_g), tAlpha),(255*Math.pow(H(_b), tAlpha)];
    */
    return [0,0,0];
};



/**
 * Threshold
 */
function PointOperatorQuantization(){
    this.sDescription = 'Art von Binarisierung. ';
    this.sFormulaHtml = 'TODO';
    this.sParameters = {
        'threshold' : new PointOperatorParameter('Schwellwert', 'BESCHREIBUNG', {'type' : 'number', 'value' : 100, 'min' : 0, 'max' : 255, 'step' : 1})
    };
}

PointOperatorQuantization.inheritsFrom( PointOperator );

PointOperatorQuantization.prototype.transformPixel = function(_r, _g, _b, _extendedImageData) {
	// TODO
    return [0,0,0];
};



/**
 * Threshold
 */
function PointOperatorThreshold(){
    this.sDescription = 'Art von Binarisierung. ';
    this.sFormulaHtml = 'TODO';
    this.sParameters = {
        'threshold' : new PointOperatorParameter('Schwellwert', 'BESCHREIBUNG', {'type' : 'number', 'value' : 100, 'min' : 0, 'max' : 255, 'step' : 1})
    };
}

PointOperatorThreshold.inheritsFrom( PointOperator );

PointOperatorThreshold.prototype.transformPixel = function(_r, _g, _b, _extendedImageData) {
	// TODO
    return [0,0,0];
};

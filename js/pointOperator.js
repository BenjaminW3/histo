/**
 * Constructor.
 */
function PointOperatorParameter(_sName, _sDescription, _id, _inputAttributes) {
    this.sName = _sName;
    this.sDescription = _sDescription;
	this.id = _id;
	// Create the surrounding label element.
    this.labelElement = document.createElement('label');
	this.labelElement.innerHTML += this.sName + ': ';
	
	// Create the input element.
    this.inputElement = document.createElement('input');
    this.inputElement.setAttribute("id", _id);
	for(var attribute in _inputAttributes)
	{
		this.inputElement.setAttribute(attribute, _inputAttributes[attribute]);
	}

	// Add the input element to the label.
	this.labelElement.appendChild(this.inputElement);
	
	// Add the description.
	this.labelElement.innerHTML += ' ' + this.sDescription;
}
PointOperatorParameter.prototype.getValue = function() {
    return document.getElementById(this.id).valueAsNumber;
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
	this.aParameters = { 
		/*'unnamed' : new PointOperatorParameter('not available', 'inputElementId', {'type' : 'number', 'value' : 0, 'min' : 0, 'max' : 255, 'step' : 1})*/
	};													//!< The parameters of the point operator.
    this.extImageData = null;
}

/**
 * Writes the description of the operator to the div element
 */
PointOperator.prototype.writeDescription = function(_descriptionElement) {
    _descriptionElement.innerHTML = this.sDescription;
    _descriptionElement.innerHTML += "<br/>";
    _descriptionElement.innerHTML += this.sFormulaHtml;
};


/**
 * Adds all the parameter input elements to the given element.
 */
PointOperator.prototype.addPropertyInputElementsToElement = function (_parentElement) {
	for(var param in this.aParameters)
	{
		this.aParameters[param].addInputElementToElement(_parentElement);
		_parentElement.innerHTML += "<br/>";
	}
	
	// DEBUG
	//this.aParameters.e.inputElement.value = "1.4";
};
/**
 * Transform the given image data.
 */
PointOperator.prototype.transformExtendedImageData = function (_extendedImageData) {
    this.extImageData = _extendedImageData;
	var imageData = _extendedImageData.getImageData();
	
    var pixelStepWidth = 4; // 4 because the image data is always RGBA.
    for (var i = 0, n = imageData.data.length; i < n; i+= pixelStepWidth) {
        var transformedPixel = this.transformPixel(imageData.data[i], imageData.data[i+1], imageData.data[i+2]);
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
PointOperator.prototype.transformPixel = function (_r, _g, _b) {
    alert('This is the abstract base class method. This has to be implemented by derieved classes!');
};



/**
 * Inverse color transformation.
 */
function PointOperatorInverse(){
	this.sDescription = 'Bei der Negativtransformation wird eine Invertierung der Tonwerte eines Grauwertbildes durchgeführt. ' +
                        'Da das menschliche visuelle System feine Unterschiede zwischen Grauwerten in verschiedenen Helligkeitsbereichen unterschiedlich gut wahrnimmt, ' +
						'kann eine Negativtransformation zur besseren Wahrnehmung feiner Strukturen führen.';
	this.sFormulaHtml = '<img src="img/pointOpInv.png">';
    this.aParameters = {

    };
}

PointOperatorInverse.inheritsFrom( PointOperator );

PointOperatorInverse.prototype.transformPixel = function(_r, _g, _b, first){
	return [255-_r, 255-_g, 255-_b];
};



/**
 * Potency color transformation.
 */
function PointOperatorPotency(){
    this.sDescription = 'Die Potenztransformation, oder auch Gammakorrektur, ist eine monotone Transformation auf Basis einer Potenzfunktion. ' +
                        'Duch eine nichtlineare Spreizung bei einem Teil der Tonwerte und Stauchung bei einem anderen Teil der Tonwerte lässt sich die Helligkeit des Bildes verändern.';
    this.sFormulaHtml = '<img src="img/pointOpPot.png">';
    this.aParameters = {
        'e' : new PointOperatorParameter('γ', 'Exponent für die Transformation.', 'potInp', {'type' : 'number', 'value' : 1.3, 'min' : 0.0, 'max' : 5.0, 'step' : 0.1})
    };
}

PointOperatorPotency.inheritsFrom( PointOperator );

PointOperatorPotency.prototype.transformPixel = function(_r, _g, _b){
    var exp = this.aParameters.e.getValue();
    return [255 * (Math.pow((_r/255), exp )), 255 * (Math.pow((_g/255),  exp)), 255 * (Math.pow((_b/255), exp))];
};



/**
 * Logarithm color transformation.
 */
function PointOperatorLogarithm(){
    this.sDescription = 'Die Logarithmustransformation ist eine monotone Transformation auf Basis des Logarithmus.' +
                        'Die oberen Tonwerte werden komprimiert, während kleine Tonwerte auf eine größere Tonwertspanne abgebildet werden. Dadurch wird das Bild insgesamt aufgehellt.';
    this.sFormulaHtml = '<img src="img/pointOpLog.png">';
    this.aParameters = {
    };
}

PointOperatorLogarithm.inheritsFrom( PointOperator );

PointOperatorLogarithm.prototype.transformPixel = function(_r, _g, _b){
    return [255 * (Utils.log((_r+1),(255+1))), 255 * (Utils.log((_g+1),(255+1))), 255 * (Utils.log((_b+1),(255+1)))];
};



/**
 * Exponential color transformation.
 */
function PointOperatorExponential(){
    this.sDescription = 'Die Exponentialtransformation ist eine monotone Transformation auf Basis der Exponentialfunktion.' +
						'Die unteren Tonwerte werden komprimiert, während eine kleine Tonwertspanne im oberen Bereich auf eine größere Tonwertspanne im Ergebnisbild abgebildet wird. Dadurch wird das Bild insgesamt abgedunkelt.';
    this.sFormulaHtml = '<img src="img/pointOpExp.png">';
    this.aParameters = {

    };
}

PointOperatorExponential.inheritsFrom( PointOperator );

PointOperatorExponential.prototype.transformPixel = function(_r, _g, _b){
    return [Math.pow((255+1),(_r/255)) -1, Math.pow((255+1),(_g/255)) -1, Math.pow((255+1),(_b/255)) -1];
};



/**
 * Histogram shift
 */
function PointOperatorHistoShift(){
    this.sDescription = 'Mit Hilfe der Histogrammverschiebung kann die Helligkeit eines Bildes reguliert werden.' +
                        'Alle Farbwerte eines Bildes werden um eine feste Konstante in den helleren oder dunkleren Bereich verschoben.';
    this.sFormulaHtml = '<img src="img/pointOpShift.png">';
    this.aParameters = {
        'c' : new PointOperatorParameter('c', 'Konstante um die verschoben werden soll.', 'shiftInp', {'type' : 'number', 'value' : 35.0, 'min' : -255.0, 'max' : 255.0, 'step' : 1.0})
    };
}

PointOperatorHistoShift.inheritsFrom( PointOperator );

PointOperatorHistoShift.prototype.transformPixel = function(_r, _g, _b){
    var transR = _r + this.aParameters.c.getValue();
    var transG = _g + this.aParameters.c.getValue();
    var transB = _b + this.aParameters.c.getValue();
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
    this.sDescription = 'Grauwerte ausserhalb eines bestimmten Bereiches werden abgeschnitten und auf den Tonwert 0 oder G abgebildet.';
    this.sFormulaHtml = '<img src="img/pointOpLimit.png">';
    this.aParameters = {
        'min' : new PointOperatorParameter('gmin', 'Untere Schranke der einzubeziehenden Werte.',  'limLowInp', {'type' : 'number', 'value' : 20.0, 'min' : 0.0, 'max' : 254.0, 'step' : 1.0}),
        'max' : new PointOperatorParameter('gmax', 'Obere Schranke der einzubeziehenden Werte.',  'limHighInp', {'type' : 'number', 'value' : 210.0, 'min' : 1.0, 'max' : 255.0, 'step' : 1.0})
    };
    /**
     * TODO: add constraint min < max!!!
     */
}

PointOperatorHistoLimitation.inheritsFrom( PointOperator );

PointOperatorHistoLimitation.prototype.clipByLumTo = function(_r, _g, _b, _minLum, _maxLum, _minClipToCol, _maxClipToCol) {
	var lum = Utils.calcYFromRgb(_r, _g, _b);

    if(lum < _minLum) {
        return _minClipToCol;
    }
    if(lum > _maxLum) {
        return _maxClipToCol;
    }
	return [_r, _g, _b];
};

PointOperatorHistoLimitation.prototype.transformPixel = function(_r, _g, _b){
    var min = this.aParameters.min.getValue();
    var max = this.aParameters.max.getValue();
    return this.clipByLumTo(_r, _g, _b, min, max, [0,0,0], [255,255,255]);
};



/**
 * Histogram spreading / compression
 */
function PointOperatorHistoSpread(){
    this.sDescription = 'Histogrammspreizung wird häufig zur Kontrastverstärkung in kostrastarmen Bildern eingesetzt. ' +
                        'Dabei wird eine stückweiße lineare Transformation genutzt, die den gewählten Tonwertbereich auf den gesamten verfügbaren abbildet.';
    this.sFormulaHtml = '<img src="img/pointOpSpread.png">';
}

PointOperatorHistoSpread.inheritsFrom( PointOperatorHistoLimitation );

PointOperatorHistoSpread.prototype.spread = function(_r, _g, _b){
	var lum = Utils.calcYFromRgb(_r, _g, _b);
	
    var min = this.aParameters.min.getValue();
    var max = this.aParameters.max.getValue();
	var d = ((lum - min) / (max - min));
	
	// FIXME: Color. This should result in a linear transformation curve from [min,0] to [max,255]
    return [Utils.clip(_r+d*255,0,255), Utils.clip(_g+d*255,0,255), Utils.clip(_b+d*255,0,255)];
};

PointOperatorHistoSpread.prototype.transformPixel = function(_r, _g, _b){
    var min = this.aParameters.min.getValue();
    var max = this.aParameters.max.getValue();
	var clipped = this.clipByLumTo(_r, _g, _b, min, max, [0,0,0], [255,255,255]);
    return this.spread(clipped[0], clipped[1], clipped[2]);
};



/**
 * Histogram equalization
 * TODO: Cumulative should be normalized (wikipedia)
 */
function PointOperatorHistoEqualization(){
    this.sDescription = 'Histogramequalisation ist ein wichtiges Verfahren zur Kontrastverbesserung. Es wird eine Gleichverteilung bei den Werten des Histogrammes berechnet ' +
                        'damit der gesamte zur Verfügung stehende Wertebereich optimal ausgenutzt werden kann.';
    this.sFormulaHtml = '<img src="img/pointOpEqu.png">';
    this.aParameters = {

    };
}

PointOperatorHistoEqualization.inheritsFrom( PointOperator );

PointOperatorHistoEqualization.prototype.transformPixel = function(_r, _g, _b) {
    //console.log(this.extImageData)
    if(this.extImageData) {
        var cumR = this.extImageData.getCumulativeChannelHistogramValue(1, _r); //start with 1 cause 0 is grey
        var cumG = this.extImageData.getCumulativeChannelHistogramValue(2, _g);
        var cumB = this.extImageData.getCumulativeChannelHistogramValue(3, _b);

        return [255 * cumR, 255 * cumG, 255 * cumB];
    }else {
        return [0, 0, 0];
    }
};



/**
 * Histogram equalization
 */
function PointOperatorHistoHyperbolization(){
    this.sDescription = 'Die Tonwerte werden dem subjektiven menschlichen Empfinden angepasst. ';
    this.sFormulaHtml = '<img src="img/pointOpHyper.png">';
    this.aParameters = {
        'alpha' : new PointOperatorParameter('α (-x/3)', 'Exponent ', 'expInp', {'type' : 'number', 'value' : 1, 'min' : 0, 'max' : 2, 'step' : 1})
    };
}

PointOperatorHistoHyperbolization.inheritsFrom( PointOperator );

PointOperatorHistoHyperbolization.prototype.transformPixel = function(_r, _g, _b) {
    if(this.extImageData) {
        var cumR = this.extImageData.getCumulativeChannelHistogramValue(1, _r); //start with 1 cause 0 is grey
        var cumG = this.extImageData.getCumulativeChannelHistogramValue(2, _g);
        var cumB = this.extImageData.getCumulativeChannelHistogramValue(3, _b);

        var tAlpha = 0;
        if (this.aParameters.alpha.getValue() == 0) {
            tAlpha = 1;
        } else if (this.aParameters.alpha.getValue() == 1) {
            tAlpha = 1.5;   //1 / -1/3 + 1 = 1 / (2/3) = 3/2 = 1.5
        } else if (this.aParameters.alpha.getValue() == 2) {
            tAlpha = 3;
        }
        return [ (255 * Math.pow(cumR, tAlpha)), (255 * Math.pow(cumG, tAlpha)), (255 * Math.pow(cumB, tAlpha))];
    }else {
        return [0,0,0];
    }
};



/**
 * Quantization
 */
function PointOperatorQuantization(){
    this.sDescription = 'Begrenzt die Anzahl der möglichen Werte pro Farbkanal auf <i>2^b</i>.';
    this.sFormulaHtml = '<img src="img/pointOpQuant.png">';
    this.aParameters = {
        'bits' : new PointOperatorParameter('b', 'Anzahl der Bits pro Farbkanal.', 'quantInp', {'type' : 'number', 'value' : 2, 'min' : 1, 'max' : 8, 'step' : 1})
    };
}

PointOperatorQuantization.inheritsFrom( PointOperator );

PointOperatorQuantization.prototype.quantValue = function(_val, _bits) {
    var bitsShift = 8-_bits;
	var shifted = (_val >> bitsShift);
	var d = (shifted / (Math.pow(2,_bits)-1));
    return 255 * d;
};

PointOperatorQuantization.prototype.transformPixel = function(_r, _g, _b) {
    var bits = this.aParameters.bits.getValue();
    return [this.quantValue(_r, bits), this.quantValue(_g, bits), this.quantValue(_b, bits)];
};



/**
 * Threshold
 */
function PointOperatorThreshold(){
    this.sDescription = 'Jedes Pixel wird anhand seiner Helligkeit in eine der beiden Klassen, dargestellt durch schwarz und weiß, einsortiert.';
    this.sFormulaHtml = '<img src="img/pointOpThresh.png">';

    this.aParameters = {
        'threshold' : new PointOperatorParameter('Schwellwert', 'Schwellwert an dem Binarisiert werden soll.', 'threshInp', {'type' : 'number', 'value' : 100, 'min' : 0, 'max' : 255, 'step' : 1})
    };
}

PointOperatorThreshold.inheritsFrom( PointOperator );

PointOperatorThreshold.prototype.transformPixel = function(_r, _g, _b) {
	var t = this.aParameters.threshold.getValue();
	var lum = Utils.calcYFromRgb(_r, _g, _b);
    return (lum >= t) ? [255,255,255] : [0,0,0];
};

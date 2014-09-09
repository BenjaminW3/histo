/**
 * Constructor.
 */
function Histogramm(_sourceImageElement, targetCanvasElement, _context, _histTypeElement) {
    // The settings.
    this.histTypeElement = _histTypeElement;					//!< The HTML histogram type selection element.
    this.histType = this.histTypeElement.value;

    // The target data.
    this.targetCanvasElement = null;							//!< The target histogram HTML canvas element.
    this.targetContext = null;									//!< The target context of the histogram.

    this.image = new Image();
    this.image.loadFromSource(_sourceImageElement);
    this.setTargetCanvasElement(targetCanvasElement, _context);
}

/**
 * sets the padding of the histogramm
 * @param top
 * @param left
 * @param bottom
 * @param right
 */
Histogramm.prototype.setHistogrammPadding = function(top, left, bottom, right) {
    if(typeof(top)==='undefined') top = 30;
    if(typeof(left)==='undefined') left = 40;
    if(typeof(bottom)==='undefined') bottom = 30;
    if(typeof(right)==='undefined') right = 10;

    this.uiHistPaddingTopPx = top;														//!< The padding from the top.
    this.uiHistPaddingLeftPx = left;													//!< The padding of the x axis from the bottom.
    this.uiHistPaddingBottomPx = bottom;												//!< The padding of the y axis from the left.
    this.uiHistPaddingRightPx = right;													//!< The padding from the right.
    this.uiHistTopPx = this.uiHistPaddingTopPx;											//!< The distance of the top of the histogram from the top of the canvas.
    this.uiHistBottomPx = this.targetCanvasElement.height - this.uiHistPaddingBottomPx;	//!< The distance of the bottom of the histogram from the top of the canvas.
    this.uiHistHeightPx = this.uiHistBottomPx - this.uiHistTopPx;						//!< The height of the histogram on the canvas.
    this.uiHistLeftPx = this.uiHistPaddingLeftPx;										//!< The distance of the left of the histogram from the left of the canvas.
    this.uiHistRightPx = this.targetCanvasElement.width - this.uiHistPaddingRightPx;	//!< The distance of the right of the histogram from the left of the canvas.
    this.uiHistWidthPx = this.uiHistRightPx - this.uiHistLeftPx;						//!< The width of the histogram on the canvas.
};

/**
 * sets the target canvas and the context
 * @param _targetCanvasElement String id of the target canvas in the document
 * @param _context String context of the canvas (default = 2d)
 */
Histogramm.prototype.setTargetCanvasElement = function(_targetCanvasElement, _context) {
	this.targetCanvasElement = _targetCanvasElement;
    if(typeof(_context)==='undefined') _context = '2d';
    this.targetContext = this.targetCanvasElement.getContext(_context);
	// Set the histogram render sizes depending on the target canvas size.
    this.setHistogrammPadding(30,40,30,10);	
};

/**
 * Resets the internal image data from the data of the given image.
 */
Histogramm.prototype.setSourceImageElement = function(_sourceImageElement) {
    this.image.loadFromSource(_sourceImageElement);
};



/**
 * Draws the histogram axes.
 */
Histogramm.prototype.drawHistAxis = function() {
    this.targetContext.lineWidth = 2;
    this.targetContext.fillStyle = '#333';
    this.targetContext.strokeStyle = '#333';
    this.targetContext.font = 'italic 10pt sans-serif';
    this.targetContext.textAlign = "center";

    // Render the axes lines.
    this.targetContext.beginPath();
    this.targetContext.moveTo(this.uiHistLeftPx, this.uiHistTopPx);
    this.targetContext.lineTo(this.uiHistLeftPx, this.uiHistBottomPx);
    this.targetContext.lineTo(this.uiHistRightPx, this.uiHistBottomPx);
    this.targetContext.stroke();

    // Draw some x-axis values.
    var dataX = [
        0,
        50,
        100,
        150,
        200,
        255
    ];
    this.targetContext.textAlign = "center";
    for(var i = 0; i < dataX.length; i++)
    {
        this.targetContext.fillText(dataX[i], this.uiHistLeftPx + Math.round((dataX[i]/256) * this.uiHistWidthPx), this.uiHistBottomPx + 15);
    }

    // Draw x-axis name.
    this.targetContext.fillText("g", this.uiHistLeftPx + (this.uiHistWidthPx*0.5), this.uiHistBottomPx + 25);

    // Draw y-axis header.
    this.targetContext.fillText("h(g)", this.uiHistLeftPx, this.uiHistTopPx - 15);

    // Draw some y-axis values.
    this.targetContext.textAlign = "end";
    for(var i = 0; i < 5; i++)
    {
        var uiYAxisValue = Math.round(i * (this.uiMaxCountAllChannels/(5-1)));
        this.targetContext.fillText(uiYAxisValue, this.uiHistLeftPx - 5, this.uiHistBottomPx - Math.round(i * (this.uiHistHeightPx/(5-1))) + 5);	// +5 for centering because position is bottom of text.
    }
};


/**
 * Draws a channel of the histogram.
 * @param sType The type of the channel used for coloring.
 * @param auiValueCounts An Array of occurance counts of color values.
 * @param sStyle Either 'discreet' or 'continuous'.
 * @param bFill If the diagram should be filled or only dots.
 */
Histogramm.prototype.drawHistChannel = function(sType, auiValueCounts, sStyle, bFill) {

    console.log(sType);
    var ctxStyle;

    if (bFill || sStyle === 'discreet')
    {
        ctxStyle = 'fillStyle';
        this.targetContext.strokeStyle = '#000';
    }
    else
    {
        ctxStyle = 'strokeStyle';
    }

    // Select the color for the histogram channel.
    var colors = {
        'red':   		'#f00',
        'green': 		'#0f0',
        'blue':  		'#00f',
        'brightness':   '#000'
    };
    this.targetContext[ctxStyle] = colors[sType];

    if (sStyle === 'continuous')
    {
        this.targetContext.beginPath();
        this.targetContext.moveTo(this.uiHistLeftPx, this.uiHistBottomPx);
    }

    for (var x, y, i = 0; i < 256; i++)
    {
        if (!(i in auiValueCounts))
        {
            continue;
        }

        //console.log ("#i = " + auiValueCounts[i])
        var uiValueWidth = Math.ceil(this.uiHistWidthPx/256);
        var uiValueHeight = Math.round((auiValueCounts[i]/this.image.getMaxCountAllChannels()) * this.uiHistHeightPx);
        var uiValueX = this.uiHistLeftPx + Math.round((i/256) * this.uiHistWidthPx);
        var uiValueY = this.uiHistTopPx + this.uiHistHeightPx - uiValueHeight;

        if (sStyle === 'continuous')
        {
            this.targetContext.lineTo(x, this.targetCanvasElement.height - y);
        }
        else if (sStyle === 'discreet')
        {
            if (bFill)
            {
                this.targetContext.fillRect(uiValueX, uiValueY, uiValueWidth, uiValueHeight);
            }
            else
            {
                this.targetContext.fillRect(uiValueX, uiValueY, uiValueWidth, 2);
            }
        }
    }

    if (sStyle === 'continuous')
    {
        this.targetContext.lineTo(x, this.uiHistBottomPx);
        if (plotFill.checked)
        {
            this.targetContext.fill();
        }

        this.targetContext.stroke();
        this.targetContext.closePath();
    }
};

/**
 * Draws the whole histogram.
 * @param sStyle Either 'discreet' or 'continuous'.
 * @param bFill If the diagram should be filled or only dots.
 */
Histogramm.prototype.drawHist = function(sStyle, bFill) {
    console.log("into");
	// Recalculate the histogram data.
    if (this.image.getMaxCountAllChannels() == 0) {
        return;
    }

    this.histType = this.histTypeElement.value;
    var asChannelTypes = [this.histType];		//!< The types of the channels. By default there is only one channel with the given type.
    // Clear the canvas.
    this.targetContext.clearRect(0, 0, this.targetCanvasElement.width, this.targetCanvasElement.height);

    // Draw the axes.
    this.drawHistAxis();

    if (bFill /*&& this.aauiChannelValueCounts.length > 1*/)
    {
        this.targetContext.globalCompositeOperation = 'lighter';
    }

    // For RGB there are 3 channels.
    if (this.histType === 'rgb') {
        asChannelTypes = ['red', 'green', 'blue'];
        for (var i = 0; i < 3; i++) {
            //console.log("channel type "+ asChannelTypes[i] + " channelValueCount " + this.aauiChannelValueCounts[i]);
            this.drawHistChannel(asChannelTypes[i], this.image.getChannelCount(i+1), sStyle, bFill);
        }
    }else {
        var i = 0;
        if(this.histType === 'brightness') {
            i = 0;
        }else if(this.histType === 'red') {
            i = 1;
        }else if(this.histType === 'green') {
            i = 2;
        }else if(this.histType === 'blue') {
            i = 3;
        }
        console.log("index = " + i);
        this.drawHistChannel(asChannelTypes[0], this.image.getChannelCount(i), sStyle, bFill);
    }

    if (bFill/* && this.aauiChannelValueCounts.length > 1*/)
    {
        this.targetContext.globalCompositeOperation = 'source-over';
    }
};

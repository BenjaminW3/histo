/**
 * Constructor.
 */
function Histogramm(_sourceImageElement, targetCanvasElement, _context, _histTypeElement) {
	// The settings.
    this.histTypeElement = _histTypeElement;					//!< The HTML histogram type selection element.
    this.histType = this.histTypeElement.value;

	// The source data.
    this.sourceImgData = null;									//!< The source image as ARGB data.
	
	// The target data.
    this.targetCanvasElement = null;							//!< The target histogram HTML canvas element.
    this.targetContext = null;									//!< The target context of the histogram.
	
	// The histogram data.
    this.aauiChannelValueCounts = [[]];							//!< An array of arrays holding the counts for each channel. By default there is only one channel.
    this.uiMaxCountAllChannels = 0;								//!< The maximum number of occurrences of a value over all channels.

	this.setSourceImageElement(_sourceImageElement);
    this.setTargetCanvasElementElement(targetCanvasElement, _context);
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
Histogramm.prototype.setTargetCanvasElementElement = function(_targetCanvasElement, _context) {
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
    var sourceImgTempCanvas = document.createElement('canvas');			//!< An invisible canvas for copying the image into.
	sourceImgTempCanvas.width = _sourceImageElement.width;
	sourceImgTempCanvas.height = _sourceImageElement.height;
    var sourceImgTempCtx = sourceImgTempCanvas.getContext('2d');		//!< The context of the invisible canvas for copying the image into.
	
	// Draw the image data onto the invisible image context.
	sourceImgTempCtx.drawImage(_sourceImageElement, 0, 0);

	// Get the image data from the invisible image canvas context.
	// CHROME: If you get an error in the following line you are possibly running this site locally in google chrome. Its safety policy treats all local files as served by different domains and forbids some operations from a source different to the page itself.
	// Add --allow-file-access-from-files to chrome startup to circumvent this.
    this.sourceImgData = sourceImgTempCtx.getImageData(0, 0, _sourceImageElement.width, _sourceImageElement.height).data;
};



/**
 * Recalculates the histogram data.
 */
Histogramm.prototype.recalcHistData = function() {
	this.aauiChannelValueCounts = [[]];
    this.uiMaxCountAllChannels = 0;
    this.histType = this.histTypeElement.value;

    // For RGB there are 3 channels.
    if (this.histType === 'rgb')
    {
        this.aauiChannelValueCounts = [[], [], []];
    }

    var uiPixelStepWidth = 4; // 4 because the image data is always RGBA.

    // Loop over all pixels.
    for (var i = 0, n = this.sourceImgData.length; i < n; i+= uiPixelStepWidth)
    {
        var val;
        if (this.histType === 'brightness')
        {
            val = [Utils.calcYFromRgb(this.sourceImgData[i], this.sourceImgData[i+1], this.sourceImgData[i+2])];
        }
        else if (this.histType === 'rgb')
        {
            val = [this.sourceImgData[i], this.sourceImgData[i+1], this.sourceImgData[i+2]];
        }
        else if (this.histType === 'red')
        {
            val = [this.sourceImgData[i]];
        }
        else if (this.histType === 'green')
        {
            val = [this.sourceImgData[i+1]];
        }
        else if (this.histType === 'blue')
        {
            val = [this.sourceImgData[i+2]];
        }

        for (var y = 0, m = val.length; y < m; y++)
        {
            // Accumulate the number of occurrences of the values.
            if (val[y] in this.aauiChannelValueCounts[y])
            {
                this.aauiChannelValueCounts[y][val[y]]++;
            }
            else
            {
                this.aauiChannelValueCounts[y][val[y]] = 1;
            }

            // Get the maximum number of occurrences of a value to adjust the amplitude.
            if (this.aauiChannelValueCounts[y][val[y]] > this.uiMaxCountAllChannels)
            {
                this.uiMaxCountAllChannels = this.aauiChannelValueCounts[y][val[y]];
            }
        }
    }
}

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
        var uiValueHeight = Math.round((auiValueCounts[i]/this.uiMaxCountAllChannels) * this.uiHistHeightPx);
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
            histCtx.fill();
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
	// Recalculate the histogram data.
	this.recalcHistData();
	
    var asChannelTypes = [this.histType];		//!< The types of the channels. By default there is only one channel with the given type.

    // For RGB there are 3 channels.
    if (this.histType === 'rgb')
    {
        asChannelTypes = ['red', 'green', 'blue'];
    }

    if (this.uiMaxCountAllChannels === 0)
    {
        return;
    }

    // Clear the canvas.
    this.targetContext.clearRect(0, 0, this.targetCanvasElement.width, this.targetCanvasElement.height);

    // Draw the axes.
    this.drawHistAxis();

    if (bFill && this.aauiChannelValueCounts.length > 1)
    {
        this.targetContext.globalCompositeOperation = 'lighter';
    }

    // Draw the channels into the histogram.
    for (var i = 0, n = this.aauiChannelValueCounts.length; i < n; i++)
    {
        //console.log("channel type "+ asChannelTypes[i] + " channelValueCount " + this.aauiChannelValueCounts[i]);
        this.drawHistChannel(asChannelTypes[i], this.aauiChannelValueCounts[i], sStyle, bFill);
    }

    if (bFill && this.aauiChannelValueCounts.length > 1)
    {
        this.targetContext.globalCompositeOperation = 'source-over';
    }
};

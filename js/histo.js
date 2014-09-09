/**
 * Constructor.
 */
function Histogramm(_image, targetCanvasElement, _context, _histTypeElement) {
    // The settings.
    this.histTypeElement = _histTypeElement;					//!< The HTML histogram type selection element.
    this.histType = this.histTypeElement.value;

    // The target data.
    this.targetCanvasElement = null;							//!< The target histogram HTML canvas element.
    this.targetContext = null;									//!< The target context of the histogram.

	this.setSourceImage(_image);
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
    if(typeof(left)==='undefined') left = 50;
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
    this.setHistogrammPadding(30,50,30,10);	
};

/**
 * Sets the internal image.
 */
Histogramm.prototype.setSourceImage = function(_image) {
    this.image = _image;
};

/**
 * Draws the histogram axes.
 */
Histogramm.prototype.drawHistAxis = function(uiMaxValY) {
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
        var uiYAxisValue = Math.round(i * (uiMaxValY/(5-1)));
        this.targetContext.fillText(uiYAxisValue, this.uiHistLeftPx - 5, this.uiHistBottomPx - Math.round(i * (this.uiHistHeightPx/(5-1))) + 5);	// +5 for centering because position is bottom of text.
    }
};


/**
 * Draws a channel of the histogram.
 * @param _color The color the channel is drawn.
 * @param auiValueCounts An Array of occurance counts of color values.
 * @param uiValueCountMax The maximum vertical value.
 * @param bFill If the diagram should be filled or only dots.
 * @param bCumulative If the channel should be drawn cumulative.
 */
Histogramm.prototype.drawHistChannel = function(_color, auiValueCounts, uiValueCountMax, bFill, bCumulative) {
    var ctxStyle;
    if (bFill)
    {
        ctxStyle = 'fillStyle';
        this.targetContext.strokeStyle = '#000';
    }
    else
    {
        ctxStyle = 'strokeStyle';
    }
	
    this.targetContext[ctxStyle] = _color;

	var uiCurrentValue = 0;
	
    for (var x, y, i = 0; i < 256; i++)
    {
		if(bCumulative) {
			if (!(i in auiValueCounts)) {
				uiCurrentValue += 0;
			}
			else {
				uiCurrentValue += auiValueCounts[i];
			}
		}
		else {
			if (!(i in auiValueCounts)) {
				continue;
			}
			else {
				uiCurrentValue = auiValueCounts[i];
			}
		}
		
        //console.log ("#i = " + auiValueCounts[i])
        var uiValueWidth = Math.ceil(this.uiHistWidthPx/256);
        var uiValueHeight = Math.round((uiCurrentValue/uiValueCountMax) * this.uiHistHeightPx);
        var uiValueX = this.uiHistLeftPx + Math.round((i/256) * this.uiHistWidthPx);
        var uiValueY = this.uiHistTopPx + this.uiHistHeightPx - uiValueHeight;

        if (bFill)
        {
            this.targetContext.fillRect(uiValueX, uiValueY, uiValueWidth, uiValueHeight);
        }
        else
        {
            this.targetContext.fillRect(uiValueX, uiValueY, uiValueWidth, 2);
        }
    }
};

/**
 * Draws the whole histogram.
 * @param bFill If the diagram should be filled or only dots.
 * @param bCumulative If the channel should be drawn cumulative.
 */
Histogramm.prototype.drawHist = function(bFill, bCumulative) {
    //console.log("into");
	// Recalculate the histogram data.
    if (this.image.getChannelHistogramMax() == 0) {
        return;
    }

    this.histType = this.histTypeElement.value;
	
    // Clear the canvas.
    this.targetContext.clearRect(0, 0, this.targetCanvasElement.width, this.targetCanvasElement.height);

    // Select the color for the histogram channel.
    var colors = {
        0: '#000',
        1: '#f00',
        2: '#0f0',
        3: '#00f'
    };
	
    // For RGB there are 3 channels.
    if (this.histType === 'rgb') {
		// The maximum y value is the maximum over all channels.
		var uiMaxCount = (bCumulative===true) ? this.image.getNumPixels() : Math.max(this.image.getChannelHistogramMax(1), this.image.getChannelHistogramMax(2), this.image.getChannelHistogramMax(3));
		
		// Draw the axes.
		this.drawHistAxis(uiMaxCount);
	
		if (bFill)
		{
			this.targetContext.globalCompositeOperation = 'lighter';
		}
		
		// Draw the channels.
        for (var i = 1; i < 4; i++) {
            //console.log("channel type "+ asChannelTypes[i] + " channelHistogram " + this.aauiChannelValueCounts[i]);
            this.drawHistChannel(colors[i], this.image.getChannelHistogram(i), uiMaxCount, bFill, bCumulative);
        }

		if (bFill)
		{
			this.targetContext.globalCompositeOperation = 'source-over';
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
		
		// The maximum y value is the maximum over all channels.
		var uiMaxCount = (bCumulative===true) ? this.image.getNumPixels() : this.image.getChannelHistogramMax(i);
		
		// Draw the axes.
		this.drawHistAxis(uiMaxCount);
		
		// Draw the channel.
        //console.log("index = " + i);
        this.drawHistChannel(colors[i], this.image.getChannelHistogram(i), uiMaxCount, bFill, bCumulative);
    }
};

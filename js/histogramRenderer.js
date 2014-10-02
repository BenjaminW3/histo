/**
 * Constructor.
 */
function HistogrammRenderer(_extendedImageData, _targetCanvasElement, _context, _histTypeElement) {
    // The settings.
    this.histTypeElement = _histTypeElement;					//!< The HTML histogram type selection element.
    this.histType = this.histTypeElement.value;

    // The target data.
    this.targetCanvasElement = null;							//!< The target histogram HTML canvas element.
    this.targetContext = null;									//!< The target context of the histogram.

	this.setSourceExtendedImageData(_extendedImageData);
    this.setTargetCanvasElement(_targetCanvasElement, _context);
}

/**
 * sets the padding of the histogramm
 * @param top
 * @param left
 * @param bottom
 * @param right
 */
HistogrammRenderer.prototype.setHistogrammPadding = function(top, left, bottom, right) {
    if(typeof(top)==='undefined') top = 30;
    if(typeof(left)==='undefined') left = 70;
    if(typeof(bottom)==='undefined') bottom = 30;
    if(typeof(right)==='undefined') right = 20;

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
HistogrammRenderer.prototype.setTargetCanvasElement = function(_targetCanvasElement, _context) {
	this.targetCanvasElement = _targetCanvasElement;
    if(typeof(_context)==='undefined') _context = '2d';
    this.targetContext = this.targetCanvasElement.getContext(_context);
	// Set the histogram render sizes depending on the target canvas size.
    this.setHistogrammPadding(30,70,30,20);	
};

/**
 * Sets the extendedImageData.
 */
HistogrammRenderer.prototype.setSourceExtendedImageData = function(_extendedImageData) {
    this.extendedImageData = _extendedImageData;
};

/**
 * Draws a transformation.
 */
HistogrammRenderer.prototype.drawTransformationCurve = function(_pointOperator) {
	// Only render the transformation curve for brightness histogram because else its data is invalid.
	if(this.histType === 'brightness')
	{
		this.targetContext.lineWidth = 1;
		this.targetContext.fillStyle = '#A00';
		this.targetContext.strokeStyle = '#A00';
		this.targetContext.font = 'italic 14pt sans-serif';

		// Draw some y-axis values.
		this.targetContext.textAlign = "start";
		var uiSteps = 5;
		for(var i = 1; i < uiSteps; i++)
		{
			var yPosPx = this.uiHistBottomPx - Math.round(i * (this.uiHistHeightPx/(uiSteps-1)));
			this.targetContext.beginPath();
			this.targetContext.moveTo(this.uiHistLeftPx, yPosPx);
			this.targetContext.lineTo(this.uiHistLeftPx+3, yPosPx);
			this.targetContext.stroke();
			var uiYAxisValue = Math.round(i * ((255)/(uiSteps-1)));
			this.targetContext.fillText(uiYAxisValue, this.uiHistLeftPx + 5, yPosPx + 5);	// +5 for centering because position is bottom of text.
		}
		
		this.targetContext.beginPath();
		this.targetContext.moveTo(this.uiHistLeftPx, this.uiHistBottomPx - Math.round(((_pointOperator.transformPixel(0,0,0,this.extendedImageData)[0])/255) * this.uiHistHeightPx));
		for (var i = 1; i < 256; i++)
		{
			var uiValueX = this.uiHistLeftPx + Math.round((i/255) * this.uiHistWidthPx);
			var uiValueY = this.uiHistBottomPx - Math.round(((_pointOperator.transformPixel(i,i,i,this.extendedImageData)[0])/255) * this.uiHistHeightPx);
			this.targetContext.lineTo(uiValueX, uiValueY);
		}
		this.targetContext.stroke();
	}
}

/**
 * Draws the histogram axes.
 */
HistogrammRenderer.prototype.drawHistAxis = function(uiMaxValY, bCumulative) {
    this.targetContext.lineWidth = 1;
    this.targetContext.fillStyle = '#333';
    this.targetContext.strokeStyle = '#333';
    this.targetContext.font = 'italic 14pt sans-serif';
    this.targetContext.textAlign = 'center';

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
    this.targetContext.textAlign = 'center';
    for(var i = 0; i < dataX.length; i++)
    {
		var xPosPx = this.uiHistLeftPx + Math.round((dataX[i]/255) * this.uiHistWidthPx);
		this.targetContext.beginPath();
		this.targetContext.moveTo(xPosPx, this.uiHistBottomPx+3);
		this.targetContext.lineTo(xPosPx, this.uiHistBottomPx);
		this.targetContext.stroke();
        this.targetContext.fillText(dataX[i], xPosPx, this.uiHistBottomPx + 18);
    }

    // Draw x-axis name.
    this.targetContext.fillText("g", this.uiHistLeftPx + (this.uiHistWidthPx*0.5), this.uiHistBottomPx + 25);

    // Draw y-axis header.
    this.targetContext.fillText((bCumulative===true) ? "H(g)" : "h(g)", this.uiHistLeftPx, this.uiHistTopPx - 15);

    // Draw some y-axis values.
    this.targetContext.textAlign = "end";
	var uiSteps = 5;
    for(var i = 0; i < uiSteps; i++)
    {
		var yPosPx = this.uiHistBottomPx - Math.round(i * (this.uiHistHeightPx/(uiSteps-1)));
		this.targetContext.beginPath();
		this.targetContext.moveTo(this.uiHistLeftPx, yPosPx);
		this.targetContext.lineTo(this.uiHistLeftPx-3, yPosPx);
		this.targetContext.stroke();
        var uiYAxisValue = Math.round(i * (uiMaxValY/(uiSteps-1)));
        this.targetContext.fillText(uiYAxisValue, this.uiHistLeftPx - 5, yPosPx + 5);	// +5 for centering because position is bottom of text.
    }
};


/**
 * Draws a channel of the histogram.
 * @param _color The color the channel is drawn.
 * @param channelHistogram An Array of occurance counts of color values (histogram).
 * @param uiValueCountMax The maximum vertical value.
 * @param bFill If the diagram should be filled or only dots.
 */
HistogrammRenderer.prototype.drawHistChannel = function(_color, channelHistogram, uiValueCountMax, bFill) {
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
	
    var uiValueWidth = Math.ceil(this.uiHistWidthPx/256);
		
    for (var i = 0; i < 256; i++)
    {
		uiCurrentValue = channelHistogram[i];
		
        //console.log ("#i = " + uiCurrentValue)
        var uiValueHeight = Math.round((uiCurrentValue/uiValueCountMax) * this.uiHistHeightPx);
        var uiValueX = this.uiHistLeftPx + Math.round((i/255) * this.uiHistWidthPx);
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
HistogrammRenderer.prototype.drawHist = function(bFill, bCumulative) {
    //console.log("into");
	// Recalculate the histogram data.
    if (this.extendedImageData.getChannelHistogramMax() == 0) {
        return;
    }

    this.histType = this.histTypeElement.value;
	
    // Clear the canvas.
    this.targetContext.clearRect(0, 0, this.targetCanvasElement.width, this.targetCanvasElement.height);

    // Select the color for the histogram channel.
    var colors = {
        0: '#f00',
        1: '#0f0',
        2: '#00f',
        3: '#000'
    };
	
    // For RGB there are 3 channels.
    if (this.histType === 'rgb') {
		// The maximum y value is the maximum over all channels.
		var uiMaxCount = (bCumulative===true) ? this.extendedImageData.getNumPixels() : Math.max(this.extendedImageData.getChannelHistogramMax(1), this.extendedImageData.getChannelHistogramMax(2), this.extendedImageData.getChannelHistogramMax(3));
		
		// Draw the axes.
		this.drawHistAxis(uiMaxCount, bCumulative);
	
		if (bFill)
		{
			this.targetContext.globalCompositeOperation = 'lighter';
		}
		
		// Draw the channels.
        for (var i = 0; i < 3; i++) {
            //console.log("channel type "+ asChannelTypes[i] + " channelHistogram " + this.aauiChannelValueCounts[i]);
            this.drawHistChannel(colors[i], (bCumulative===true) ? this.extendedImageData.getChannelCumulativeHistogram(i) : this.extendedImageData.getChannelHistogram(i), uiMaxCount, bFill, bCumulative);
        }

		if (bFill)
		{
			this.targetContext.globalCompositeOperation = 'source-over';
		}
    }else {
        var i = 3;
        if(this.histType === 'red') {
            i = 0;
        }else if(this.histType === 'green') {
            i = 1;
        }else if(this.histType === 'blue') {
            i = 2;
        }else if(this.histType === 'brightness') {
            i = 3;
        }
		
		// The maximum y value is the maximum over all channels.
		var uiMaxCount = (bCumulative===true) ? this.extendedImageData.getNumPixels() : this.extendedImageData.getChannelHistogramMax(i);
		
		// Draw the axes.
		this.drawHistAxis(uiMaxCount, bCumulative);
		
		// Draw the channel.
        //console.log("index = " + i);
        this.drawHistChannel(colors[i], (bCumulative===true) ? this.extendedImageData.getChannelCumulativeHistogram(i) : this.extendedImageData.getChannelHistogram(i), uiMaxCount, bFill, bCumulative);
    }
};

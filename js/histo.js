//-----------------------------------------------------------------------------
//! This is executed after everything has been loaded.
//-----------------------------------------------------------------------------



function Histogramm(_sourceImageId, _targetCanvasId, _context, _histTypeID) {
    this.histTypeElement = document.getElementById(_histTypeID);			//!< The HTML histogram type selection element.
    this.histType = this.histTypeElement.value;
    this.state = "TEST";
    //-----------------------------------------------------------------------------
    //! Callback method which redraws the whole histogram on a input change event.
    //-----------------------------------------------------------------------------

    this.targetCanvas = null;
    this.targetContext = null;
    this.aauiChannelValueCounts = [[]];	//!< An array of arrays holding the counts for each channel. By default there is only one channel.
    this.uiMaxCountAllChannels = 0;		//!< The maximum number of occurrences of a value over all channels.

    this.sourceImg = document.getElementById(_sourceImageId);
    this.sourceImgCanvas = document.createElement('canvas');			//!< An invisible canvas for copying the image into.
    this.sourceImgCtx = this.sourceImgCanvas.getContext('2d');					//!< The context of the invisible canvas for copying the image into.
    this.sourceImgData = null;

    this.setTargetImageById(_targetCanvasId, _context);

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


    this.uiHistPaddingTopPx = top;								//!< The padding from the top.
    this.uiHistPaddingLeftPx = left;								//!< The padding of the x axis from the bottom.
    this.uiHistPaddingBottomPx = bottom;								//!< The padding of the y axis from the left.
    this.uiHistPaddingRightPx = right;								//!< The padding from the right.
    this.uiHistTopPx = this.uiHistPaddingTopPx;						//!< The distance of the top of the histogram from the top of the canvas.
    this.uiHistBottomPx = this.targetCanvas.height - this.uiHistPaddingBottomPx;//!< The distance of the bottom of the histogram from the top of the canvas.
    this.uiHistHeightPx = this.uiHistBottomPx - this.uiHistTopPx;			//!< The height of the histogram on the canvas.
    this.uiHistLeftPx = this.uiHistPaddingLeftPx;						//!< The distance of the left of the histogram from the left of the canvas.
    this.uiHistRightPx = this.targetCanvas.width - this.uiHistPaddingRightPx;//!< The distance of the right of the histogram from the left of the canvas.
    this.uiHistWidthPx = this.uiHistRightPx - this.uiHistLeftPx;			//!< The width of the histogram on the canvas.
};

/**
 * sets the target canvas and the context
 * @param _targetCanvas String id of the target canvas in the document
 * @param _context String context of the canvas (default = 2d)
 */
Histogramm.prototype.setTargetImageById = function(_targetCanvasId, _context) {
    this.targetCanvas = document.getElementById(_targetCanvasId);     //!< The HTML histogram canvas element.
    if(typeof(_context)==='undefined') _context = '2d';
    this.targetContext = this.targetCanvas.getContext(_context);    //!< The context of the histogram.
    this.setHistogrammPadding(30,40,30,10);
};

/**
 * return The luminance Y calculated from the RGB values.
 * @param R float red
 * @param G float green
 * @param B float blue
 * @returns luminance
 */
Histogramm.prototype.calcYFromRgb = function(R, G, B) {
    return Math.round(0.299 * R + 0.587 * G + 0.114 * B);
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

        console.log ("#i = " + auiValueCounts[i])
        var uiValueWidth = Math.ceil(this.uiHistWidthPx/256);
        var uiValueHeight = Math.round((auiValueCounts[i]/this.uiMaxCountAllChannels) * this.uiHistHeightPx);
        var uiValueX = this.uiHistLeftPx + Math.round((i/256) * this.uiHistWidthPx);
        var uiValueY = this.uiHistTopPx + this.uiHistHeightPx - uiValueHeight;

        if (sStyle === 'continuous')
        {
            this.targetContext.lineTo(x, this.targetCanvas.height - y);
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
        /*if (plotFill.checked)                 //??????????????
        {
            histCtx.fill();
        }*/

        this.targetContext.stroke();
        this.targetContext.closePath();
    }
};

Histogramm.prototype.reloadImage = function() {
    this.sourceImgData = this.sourceImgCtx.getImageData(0, 0, this.sourceImg.width, this.sourceImg.height).data;
};


/**
 * Draws the whole histogram.
 * @param sStyle Either 'discreet' or 'continuous'.
 * @param bFill If the diagram should be filled or only dots.
 */
Histogramm.prototype.drawHist = function(sStyle, bFill) {
    this.aauiChannelValueCounts = [[]];	//!< An array of arrays holding the counts for each channel. By default there is only one channel.
    this.uiMaxCountAllChannels = 0;
    this.histType = this.histTypeElement.value;
    var asChannelTypes = [this.histType];		//!< The types of the channels. By default there is only one channel with the given type.

    // For RGB there are 3 channels.
    if (this.histType === 'rgb')
    {
        this.aauiChannelValueCounts = [[], [], []];
        asChannelTypes = ['red', 'green', 'blue'];
    }

    var uiPixelStepWidth = 4; // 4 because the image data is always RGBA.

    // Loop over all pixels.
    for (var i = 0, n = this.sourceImgData.length; i < n; i+= uiPixelStepWidth)
    {
        var val;
        if (this.histType === 'brightness')
        {
            val = [this.calcYFromRgb(this.sourceImgData[i], this.sourceImgData[i+1], this.sourceImgData[i+2])];
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

    if (this.uiMaxCountAllChannels === 0)
    {
        return;
    }

    // Clear the canvas.
    this.targetContext.clearRect(0, 0, this.targetCanvas.width, this.targetCanvas.height);

    // Draw the axes.
    this.drawHistAxis();

    if (bFill && this.aauiChannelValueCounts.length > 1)
    {
        this.targetContext.globalCompositeOperation = 'lighter';
    }

    // Draw the channels into the histogram.
    for (var i = 0, n = this.aauiChannelValueCounts.length; i < n; i++)
    {
        console.log("channel type "+ asChannelTypes[i] + " channelValueCount " + this.aauiChannelValueCounts[i]);
        this.drawHistChannel(asChannelTypes[i], this.aauiChannelValueCounts[i], sStyle, bFill);
    }

    if (bFill && this.aauiChannelValueCounts.length > 1)
    {
        this.targetContext.globalCompositeOperation = 'source-over';
    }
};





window.addEventListener('load', function ()
{


	

	//var plotStyle = document.getElementById('plotStyle');
	//var plotFill = document.getElementById('plotFill');
    var imgSelector = document.getElementById('imgSelector');	//!< The HTML image selection element.

    var img = document.getElementById('myImg');					//!< The HTML image element.
    var imgCanvas = document.createElement('canvas');			//!< An invisible canvas for copying the image into.
    var imgCtx = imgCanvas.getContext('2d');					//!< The context of the invisible canvas for copying the image into.
    var imgData = null;



    var hist = new Histogramm('myImg', 'histogram', '2d', 'histType');

    var reloadAndUpdateHist = function() {
        hist.reloadImage();
        hist.drawHist('discreet', true/*plotStyle.value, plotFill.checked*/);
    };
    var updateHist = function() {
        hist.drawHist('discreet', true/*plotStyle.value, plotFill.checked*/);
    };


    var histTypeElement = document.getElementById('histType');			//!< The HTML histogram type selection element.
    histTypeElement.addEventListener('change', updateHist, false);


	//-----------------------------------------------------------------------------
	//! Callback method which reacts on a changed source image.
	// HTML-<image> -> imgCanvas/imgCtx -> imgData
	//-----------------------------------------------------------------------------
	var imgLoaded = function()
	{
		// Reset the class before retrieving the size because the thumb class limits the size.
		img.className = '';
		imgCanvas.width = img.width;
		imgCanvas.height = img.height;
		
		// Draw the image data onto the invisible image context.
		imgCtx.drawImage(img, 0, 0);
		
		// Get the image data from the invisible image canvas context.
		// CHROME: If you get an error in the following line you are possibly running this site locally in google chrome. Its safety policy treats all local files as served by different domains and forbids some operations from a source different to the page itself.
		// Add --allow-file-access-from-files to chrome startup to circumvent this.
		imgData = imgCtx.getImageData(0, 0, img.width, img.height).data;
		
		// Newly loaded images always have the thumb class.
		img.className = 'thumb';

		// Update the histogram.
        reloadAndUpdateHist();
	};
	
	//-----------------------------------------------------------------------------
	// Add event listeners.
	//-----------------------------------------------------------------------------
	img.addEventListener('load', imgLoaded, false);


	//plotStyle.addEventListener('change', updateHist, false);
	//plotFill.addEventListener('change', updateHist, false);

	imgSelector.addEventListener('change', function () {img.src = this.value;}, false);

	/*var initHistogram = function () 
	{
		// Plot defaults
		plotStyle.value = 'continuous';
		plotFill.checked = true;
		histType.value = 'brightness';
	};
	initHistogram();*/
	imgLoaded();
	
}, false);
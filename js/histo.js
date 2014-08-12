//-----------------------------------------------------------------------------
//! This is executed after everything has been loaded.
//-----------------------------------------------------------------------------
window.addEventListener('load', function ()
{
	var histCanvas = document.getElementById('histogram');		//!< The HTML histogram canvas element.
	var histCtx = histCanvas.getContext('2d');					//!< The context of the histogram.
	var uiAxisPaddingTopPx = 30;								//!< The padding of the x axis from the top.
	var uiAxisPaddingLeftPx = 40;								//!< The padding of the x axis from the bottom.
	var uiAxisPaddingBottomPx = 30;								//!< The padding of the y axis from the left.
	var uiAxisPaddingRightPx = 10;								//!< The padding of the x axis from the right.
	var uiHistTopPx = uiAxisPaddingTopPx;
	var uiHistBottomPx = histCanvas.height - uiAxisPaddingBottomPx;
	var uiHistHeightPx = uiHistBottomPx - uiHistTopPx;
	var uiHistLeftPx = uiAxisPaddingLeftPx;
	var uiHistRightPx = histCanvas.width - uiAxisPaddingRightPx;
	var uiHistWidthPx = uiHistRightPx - uiHistLeftPx;
	
	var histType = document.getElementById('histType');			//!< The HTML histogram type selection element.
	//var plotStyle = document.getElementById('plotStyle');
	//var plotFill = document.getElementById('plotFill');
	
	var imgSelector = document.getElementById('imgSelector');	//!< The HTML image selection element.
	
	var img = document.getElementById('myImg');					//!< The HTML image element.
	var imgCanvas = document.createElement('canvas');			//!< An invisible canvas for copying the image into.
	var imgCtx = imgCanvas.getContext('2d');					//!< The context of the invisible canvas for copying the image into.
	var imgData = null;											//!< The image data of the currently loaded image retrieved from the imgCanvas/imgCtx.

	//-----------------------------------------------------------------------------
	//! Draws the whole histogram.
	//! \param sType The type of the channel used for coloring.
	//! \param sStyle Either 'discreet' or 'continuous'.
	//! \param bFill If the diagram should be filled or only dots.
	//-----------------------------------------------------------------------------
	var drawHist = function(sType, sStyle, bFill)
	{
		var aauiChannelValueCounts = [[]];	//!< An array of arrays holding the counts for each channel. By default there is only one channel.
		var uiMaxCountAllChannels = 0;		//!< The maximum number of occurrences of a value over all channels.
		var asChannelTypes = [sType];		//!< The types of the channels. By default there is only one channel with the given type.
		
		// For RGB there are 3 channels.
		if (sType === 'rgb')
		{
			aauiChannelValueCounts = [[], [], []];
			asChannelTypes = ['red', 'green', 'blue'];
		}

		uiPixelStepWidth = 4; // 4 because the image data is always RGBA.
		
		// Loop over all pixels.
		for (var i = 0, n = imgData.length; i < n; i+= uiPixelStepWidth) 
		{
			var val;
			if (sType === 'val') 
			{
				val = [Math.max(imgData[i], imgData[i+1], imgData[i+2])];
			}
			else if (sType === 'rgb') 
			{
				val = [imgData[i], imgData[i+1], imgData[i+2]];
			}
			else if (sType === 'red') 
			{
				val = [imgData[i]];
			} 
			else if (sType === 'green') 
			{
				val = [imgData[i+1]];
			} 
			else if (sType === 'blue') 
			{
				val = [imgData[i+2]];
			}

			for (var y = 0, m = val.length; y < m; y++) 
			{
				// Accumulate the number of occurrences of the values.
				if (val[y] in aauiChannelValueCounts[y]) 
				{
					aauiChannelValueCounts[y][val[y]]++;
				} 
				else 
				{
					aauiChannelValueCounts[y][val[y]] = 1;
				}

				// Get the maximum number of occurrences of a value to adjust the amplitude.
				if (aauiChannelValueCounts[y][val[y]] > uiMaxCountAllChannels) 
				{
					uiMaxCountAllChannels = aauiChannelValueCounts[y][val[y]];
				}
			}
		}

		if (uiMaxCountAllChannels === 0) 
		{
			return;
		}

		// Clear the canvas.
		histCtx.clearRect(0, 0, histCanvas.width, histCanvas.height);

		// Draw the axes.
		drawHistAxis(uiMaxCountAllChannels);
		
		if (bFill && aauiChannelValueCounts.length > 1) 
		{
			histCtx.globalCompositeOperation = 'lighter';
		}

		// Draw the channels into the histogram.
		for (var i = 0, n = aauiChannelValueCounts.length; i < n; i++) 
		{
			drawHistChannel(asChannelTypes[i], aauiChannelValueCounts[i], uiMaxCountAllChannels, sStyle, bFill);
		}

		if (bFill && aauiChannelValueCounts.length > 1) 
		{
			histCtx.globalCompositeOperation = 'source-over';
		}
	};
	//-----------------------------------------------------------------------------
	//! Draws the histogram axes.
	//-----------------------------------------------------------------------------
	var drawHistAxis = function(uiMaxCountAllChannels) 
	{
		histCtx.lineWidth = 2;
		histCtx.fillStyle = '#333';
		histCtx.strokeStyle = '#333';
		histCtx.font = 'italic 10pt sans-serif';
		histCtx.textAlign = "center";
		
		// Render the axes lines.
		histCtx.beginPath();
		histCtx.moveTo(uiHistLeftPx, uiHistTopPx);
		histCtx.lineTo(uiHistLeftPx, uiHistBottomPx);
		histCtx.lineTo(uiHistRightPx, uiHistBottomPx);
		histCtx.stroke();
		
		// Draw some x-axis values.
		var dataX = [
			0,
			50,
			100,
			150,
			200,
			255,
		];
		histCtx.textAlign = "center";
		for(var i = 0; i < dataX.length; i++)
		{
			histCtx.fillText(dataX[i], uiHistLeftPx + Math.round((dataX[i]/256) * uiHistWidthPx), uiHistBottomPx + 15);
		}
		
		// Draw x-axis name.
		histCtx.fillText("g", uiHistLeftPx + (uiHistWidthPx*0.5), uiHistBottomPx + 25);
		
		// Draw y-axis header.
		histCtx.fillText("h(g)", uiHistLeftPx, uiHistTopPx - 15);
		
		// Draw some y-axis values.
		histCtx.textAlign = "end";
		for(var i = 0; i < 5; i++)
		{
			var uiYAxisValue = Math.round(i * (uiMaxCountAllChannels/(5-1)));
			histCtx.fillText(uiYAxisValue, uiHistLeftPx - 5, uiHistBottomPx - Math.round(i * (uiHistHeightPx/(5-1))) + 5);	// +5 for centering because position is bottom of text.
		}
	};
	//-----------------------------------------------------------------------------
	//! Draws a channel of the histogram.
	//! \param sType The type of the channel used for coloring.
	//! \param auiValueCounts An Array of occurance counts of color values.
	//! \param uiMaxCountAllChannels The maximum value over all channels and all values in the histogram. uiMaxCountAllChannels can be bigger then the maximum value of the current auiValueCounts array.
	//! \param sStyle Either 'discreet' or 'continuous'.
	//! \param bFill If the diagram should be filled or only dots.
	//-----------------------------------------------------------------------------
	var drawHistChannel = function(sType, auiValueCounts, uiMaxCountAllChannels, sStyle, bFill) 
	{
		var ctxStyle;

		if (bFill || sStyle === 'discreet') 
		{
			ctxStyle = 'fillStyle';
			histCtx.strokeStyle = '#000';
		} 
		else 
		{
			ctxStyle = 'strokeStyle';
		}

		// Select the color for the histogram channel.
		var colors = {
			'red':   '#f00',
			'green': '#0f0',
			'blue':  '#00f',
			'val':   '#000'
		};
		histCtx[ctxStyle] = colors[sType];

		if (sStyle === 'continuous') 
		{
			histCtx.beginPath();
			histCtx.moveTo(uiHistLeftPx, uiHistBottomPx);
		}

		for (var x, y, i = 0; i < 256; i++) 
		{
			if (!(i in auiValueCounts)) 
			{
				continue;
			}

			uiValueWidth = Math.ceil(uiHistWidthPx/256);
			uiValueHeight = Math.round((auiValueCounts[i]/uiMaxCountAllChannels) * uiHistHeightPx);
			uiValueX = uiHistLeftPx + Math.round((i/256) * uiHistWidthPx);
			uiValueY = uiHistTopPx + uiHistHeightPx - uiValueHeight;

			if (sStyle === 'continuous') 
			{
				histCtx.lineTo(x, histCanvas.height - y);
			} 
			else if (sStyle === 'discreet') 
			{
				if (bFill) 
				{
					histCtx.fillRect(uiValueX, uiValueY, uiValueWidth, uiValueHeight);
				}
				else 
				{
					histCtx.fillRect(uiValueX, uiValueY, uiValueWidth, 2);
				}
			}
		}

		if (sStyle === 'continuous') 
		{
			histCtx.lineTo(x, uiHistBottomPx);
			if (plotFill.checked) 
			{
				histCtx.fill();
			}
			
			histCtx.stroke();
			histCtx.closePath();
		}
	};
	//-----------------------------------------------------------------------------
	//! Callback method which redraws the whole histogram on a input change event.
	//-----------------------------------------------------------------------------
	var updateHist = function() 
	{
		drawHist(histType.value, 'discreet', true/*plotStyle.value, plotFill.checked*/);
	};
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
		updateHist();
	};
	
	//-----------------------------------------------------------------------------
	// Add event listeners.
	//-----------------------------------------------------------------------------
	img.addEventListener('load', imgLoaded, false);

	histType.addEventListener('change', updateHist, false);
	//plotStyle.addEventListener('change', updateHist, false);
	//plotFill.addEventListener('change', updateHist, false);

	imgSelector.addEventListener('change', function () {img.src = this.value;}, false);

	/*var initHistogram = function () 
	{
		// Plot defaults
		plotStyle.value = 'continuous';
		plotFill.checked = true;
		histType.value = 'val';
	};
	initHistogram();*/
	imgLoaded();
	
}, false);
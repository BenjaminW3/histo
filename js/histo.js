//-----------------------------------------------------------------------------
//! This is executed after everything has been loaded.
//-----------------------------------------------------------------------------
window.addEventListener('load', function ()
{
	var histCanvas = document.getElementById('histogram');		//!< The HTML histogram canvas element.
	var histCtx = histCanvas.getContext('2d');					//!< The context of the histogram.
	var discreetWidth = Math.round(histCanvas.width / 255);
	
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
			histCtx.moveTo(0, histCanvas.height);
		}

		for (var x, y, i = 0; i <= 255; i++) 
		{
			if (!(i in auiValueCounts)) 
			{
				continue;
			}

			y = Math.round((auiValueCounts[i]/uiMaxCountAllChannels)*histCanvas.height);
			x = Math.round((i/255)*histCanvas.width);

			if (sStyle === 'continuous') 
			{
				histCtx.lineTo(x, histCanvas.height - y);
			} 
			else if (sStyle === 'discreet') 
			{
				if (bFill) 
				{
					histCtx.fillRect(x, histCanvas.height - y, discreetWidth, y);
				}
				else 
				{
					histCtx.fillRect(x, histCanvas.height - y, discreetWidth, 2);
				}
			}
		}

		if (sStyle === 'continuous') 
		{
			histCtx.lineTo(x, histCanvas.height);
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
window.addEventListener('load', function () {
	var histCanvas = document.getElementById('histogram');
	var histCtx = histCanvas.getContext('2d');
	var histType = document.getElementById('histType');
	//var runtime = document.getElementById('runtime');
	//var plotStyle = document.getElementById('plotStyle');
	//var plotFill = document.getElementById('plotFill');
	var imgSelector = document.getElementById('imgSelector');
	var img = document.getElementById('myImg');
	var imgCanvas = document.createElement('canvas');
	var imgCtx = imgCanvas.getContext('2d');
	var colors = {
		'red':   ['#000', '#f00'],
		'green': ['#000', '#0f0'],
		'blue':  ['#000', '#00f'],
		'val':   ['#000', '#fff']
	};
	var discreetWidth = Math.round(histCanvas.width / 255);
	var imgData = null;

	var initHistogram = function () 
	{
		// Plot defaults
		//plotStyle.value = 'continuous';
		//plotFill.checked = true;
		histType.value = 'val';
	};

	var imgLoaded = function () {
		img.className = '';
		imgCanvas.width = img.width;
		imgCanvas.height = img.height;
		imgCtx.drawImage(img, 0, 0);
		//If you get an error in the following line you are possibly running this site locally in google chrome. Its safety policy treats all local files as served by different domains and forbids some operations from a source different to the page itself.
		//Add --allow-file-access-from-files to chrome startup to circumvent this.
		imgData = imgCtx.getImageData(0, 0, img.width, img.height).data;
		img.className = 'thumb';

		updateHist();
	};

	var DrawHist = function (sType, sStyle, bFill)
	{
		var chans = [[]];
		var maxCount = 0;
		var subtypes = [sType];
		
		if (sType === 'rgb')
		{
			chans = [[], [], []];
			subtypes = ['red', 'green', 'blue'];
		}

		step = 4; // 4 because the image is always rgba.
		
		// Loop over all pixels.
		for (var i = 0, n = imgData.length; i < n; i+= step) 
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
				// Accumulate the number of occurences of the values.
				if (val[y] in chans[y]) 
				{
					chans[y][val[y]]++;
				} 
				else 
				{
					chans[y][val[y]] = 1;
				}

				// Get the maximum number of occurences of a value to adjust the amplitude.
				if (chans[y][val[y]] > maxCount) 
				{
					maxCount = chans[y][val[y]];
				}
			}
		}

		if (maxCount === 0) 
		{
			return;
		}

		// Clear the canvas.
		histCtx.clearRect(0, 0, histCanvas.width, histCanvas.height);

		if (bFill && chans.length > 1) 
		{
			histCtx.globalCompositeOperation = 'lighter';
		}

		// Draw the channels into the histogram.
		for (var i = 0, n = chans.length; i < n; i++) 
		{
			DrawHistChannel(subtypes[i], chans[i], maxCount, sStyle, bFill);
		}

		if (bFill && chans.length > 1) 
		{
			histCtx.globalCompositeOperation = 'source-over';
		}
	};

	var DrawHistChannel = function (sType, vals, maxCount, sStyle, bFill) 
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

		if (sType in colors && sType !== 'val') 
		{
			histCtx[ctxStyle] = colors[sType][1];
		} 
		else 
		{
			histCtx[ctxStyle] = '#000';
		}

		if (sStyle === 'continuous') 
		{
			histCtx.beginPath();
			histCtx.moveTo(0, histCanvas.height);
		}

		for (var x, y, i = 0; i <= 255; i++) 
		{
			if (!(i in vals)) 
			{
				continue;
			}

			y = Math.round((vals[i]/maxCount)*histCanvas.height);
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

	var updateHist = function () 
	{
		DrawHist(histType.value, 'discreet', true/*plotStyle.value, plotFill.checked*/);
	};

	var thumbClick = function (ev) 
	{
		ev.preventDefault();

		if (this.className === 'thumb') {
		this.className = '';
		} else {
		this.className = 'thumb';
		}
	};

	img.addEventListener('load', imgLoaded, false);
	img.addEventListener('click', thumbClick, false);
	histCanvas.addEventListener('click', thumbClick, false);

	histType.addEventListener('change', updateHist, false);
	//plotStyle.addEventListener('change', updateHist, false);
	//plotFill.addEventListener('change', updateHist, false);

	imgSelector.addEventListener('change', function () 
	{
		img.src = this.value;
	}, false);

	initHistogram();
	imgLoaded();
	
}, false);
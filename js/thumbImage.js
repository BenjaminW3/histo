//-----------------------------------------------------------------------------
//! Callback method which resizes the image if it is clicked.
//-----------------------------------------------------------------------------
var thumbClick = function(ev) 
{
	ev.preventDefault();
	
	this.classList.toggle('thumb');
};

//-----------------------------------------------------------------------------
//! Registers the thumbClick callback to all images of class 'thumb'.
//-----------------------------------------------------------------------------
var registerAllThumbClick = function(ev) 
{
	var thumbs = document.querySelectorAll(".thumb");
	for (var i = 0; i < thumbs.length; i++)
	{
		thumbs.item(i).addEventListener('click', thumbClick, false);
	}
};

//-----------------------------------------------------------------------------
//! This is executed after everything has been loaded.
//-----------------------------------------------------------------------------
window.addEventListener('load', function()
{
	registerAllThumbClick();
}, false);
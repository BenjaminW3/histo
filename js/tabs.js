//-----------------------------------------------------------------------------
//! On a click on one of the tabs.
//-----------------------------------------------------------------------------
function displayTab(tabElement)
{
	// Get the ID of the old active tab.
	var uiCurrentId = tabElement.parentNode.getAttribute("data-uiCurrentId");
	// Remove class activetabheader and hide old tab.
	document.getElementById("tabHeader_" + uiCurrentId).removeAttribute("class");
	document.getElementById("tabpage_" + uiCurrentId).style.display="none";

	// Get the ID of the new active tab.
	var ident = tabElement.id.split("_")[1];
	// Set current tab class to activetabheader and show its contents.
	tabElement.setAttribute("class", "tabActiveHeader");
	document.getElementById("tabpage_" + ident).style.display = "block";
	tabElement.parentNode.setAttribute("data-uiCurrentId", ident);
};

//-----------------------------------------------------------------------------
//! This is executed after everything has been loaded.
//-----------------------------------------------------------------------------
window.addEventListener('load', function()
{
	// Get the tab container.
  	var container = document.getElementById("tabContainer");

	// Set the current tab.
	//var currentTab = container.querySelector("#tabs > ul > li");	// This is equivalent.
	var currentTab = document.getElementById("tabHeader_1");
	
	// Get the ID of the current active tab.
	var uiCurrentId = currentTab.id.split("_")[1];
	// Store the current tab.
	currentTab.parentNode.setAttribute("data-uiCurrentId", uiCurrentId);
	// Set current tab class to activetabheader.
	currentTab.setAttribute("class", "tabActiveHeader");

	// Adds click event to the tabs.
	var tabs = container.querySelectorAll("#tabs > ul > li");
	for (var i = 0; i < tabs.length; i++)
	{
		tabs[i].addEventListener('click', displayTab.bind(undefined, tabs[i]), false);
	}
	
	// Show the initial tab.
	displayTab(currentTab);
}, false);
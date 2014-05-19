/*  
	There are two sections here. One for those who know how to code, and one for those who don't.
		The first three examples are for those who DO understand code and want to just call the lightbox functions directly.
		The fourth and fifth examples are for those who DONT understand code and just want to plug in some inputs and make lightboxes.
*/

/* 
----------------------------------------------------------------------------------------------------------------------------------------------------------
For those who DO understand how to code:

There are two functions to call, one to create and position the lightbox (generateLightBox()) and one to populate the content (lightboxContentHelper()). 
Alternatively, instead of using the helper function you can populate the content manually with document.getElementById().innerHTML.
Examples 1 and 2 use lightboxContentHelper, example 3 populates it manually. 

Here's how they work:

generateLightBox(vpos, hpos, color, width, height) 
	only requires two inputs: vpos and hpos (positions), with the other three optional.
 
	vpos accepts four values to position the lightbox vertically: 'top', 'center', 'bottom', or a number. A number is a custom .top value as a percent  (i.e. "4" is the same as lightbox.style.top = "4%";)
	hpos accepts four values to position the lightbox horizontally: 'left', 'center', 'right', or a number. A number is a custom .left value as a percent (i.e. "29" is the same as lightbox.style.left = "29%";)
	color is the background color of the lightbox, assigned as a hex value (i.e. #c45fd3)
	width and height are used to manually set the lightboxes dimensions (in pixels). If left blank, the lightbox will fit to the content. 
	
lightboxContentHelper(id, body, title, image, button1, button1_action, button2, button2_action, button3, button3_action) 
	only requires two parameters: id and body, the rest are optional. 
	
	id 				the id of the lightbox you want to change/modify
	body			content to put in the body of the lightbox.
	title			lightbox title (optional)
	image			src of an image to use in the lightbox (optional)
	button1			text of a button to include (optional)
	button1_action	sets the onClick of the button (in addition to clearing the lightbox) (if left blank, will only clear the lightbox)
		
----------------------------------------------------------------------------------------------------------------------------------------------------------
*/	

// Example 1

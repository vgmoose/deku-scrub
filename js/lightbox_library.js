
var popupCount = 0;
var fout;

function generateLightBox(vpos, hpos, color, width, height)
//vpos, hpos are mandatory, color, width, height optional. See lightbox_examples for in depth description of function
{
    popupCount++;
	
	//initialize popup div and black background
    var div = document.createElement("div");
    div.setAttribute("id", "popup"+popupCount);
    div.className = "lightbox";
	document.body.appendChild(div);
	
	var black = document.createElement('div');
	black.id = 'blackout';
	document.body.appendChild(black);
	
	//Set lightbox height/width/color if supplied
	if (width != null && width != ''){
		div.style.width = width + "px"
	}
	if (height != null && height != ''){
		div.style.height = height + "px"
	}
	if (color != null && color != "default" && color != ""){
		div.style.background = color
	}
	
	//Positioning - Align vertically
	if (vpos == 'top') {
		div.style.top = "5%";
	}
	else if (vpos == 'bottom') {
		div.style.bottom = "5%"
	}
	else if (vpos == 'center') {
		div.style.top = "50%";
	}
	else {
		div.style.top = vpos+"%";
	}
	
	//Positioning - Align horizontally
	if (hpos == 'left') {
		div.style.left = "5%";
	}
	else if (hpos == 'right') {
		div.style.right = "5%"
	}
	else if (hpos == 'center') {
		div.style.left = "50%";
	}
	else {
		div.style.left = hpos+"%";
	}
	
	fout = div.id;
	fadeIn(div.id);
	
	// Clear current popup if a user clicks on the black background
	document.getElementById('blackout').onclick = function()
	{
		fadeOut(fout);
	}
    
    return div.id;
}

function lightboxContentHelper(id, body, title, image, button1, button1_action, button2, button2_action, button3, button3_action) 
// Populates the content of a lightbox with supplied data. Lightbox ID and body content required. Title, images, buttons optional. 
{
	// Get element and add content
	var lb = document.getElementById(id);
	lb.innerHTML = "<div>";
	
	if (title != "" && title != null) {
		lb.innerHTML = "<p class='lightboxTitle'>" + title + "</p>";
	}
	if (image != "" && image != null) {
		lb.innerHTML += "<img id='picpopup" + popupCount + "' src='" + image + "'></img><br><br>";
	}
	
	lb.innerHTML += "<p class='lightboxContent'>" + body + "</p></div>";
	
	if (button1 != null && button1 != '') {
		var but1 = document.createElement("button");
		but1.id = 'button1';
		but1.className = 'lightboxButton';
		but1.innerHTML = button1;
		but1.setAttribute("onclick","fadeOut(fout);" + button1_action);
		lb.appendChild(but1);
	}
	if (button2 != null && button2 != '') {
	console.log(button2);
		var but2 = document.createElement("button");
		but2.id = 'button2';
		but2.className = 'lightboxButton';
		but2.innerHTML = button2;
		but2.onClick = button1_action
		but2.setAttribute("onclick","fadeOut(fout);" + button2_action);
		lb.appendChild(but2);
	}
	if (button3 != null && button3 != '') {
		var but3 = document.createElement("button");
		but3.id = 'button3';
		but3.className = 'lightboxButton';
		but3.innerHTML = button3;
		but3.setAttribute("onclick","fadeOut(fout);" + button3_action);
		lb.appendChild(but3);
	}
	
	//If centered, offset by new width/height of div to find new center
	//NOTE: Does not account for images. Problem is that the image is not rendered by the browser at the time we try to access .height,
	//so img.height returns 0. If you load the lightbox twice, it will return the correct height. Will have to either preload the image or find a way to correctly access
	//the height so it can change the margin offset properly. 
	if (lb.style.top == "50%") {
		lb.style.marginTop = "-" + (lb.offsetHeight/2) + "px";
	}
	if (lb.style.left == "50%") {
		lb.style.marginLeft = "-" + (lb.offsetWidth/2) + "px";
	}
}

function logEmIn()
{
    var pass = document.getElementById('aaa').value;
    var passhash = CryptoJS.MD5(pass);
    
    var destination = passhash + "/public/index.html";
    
    $.ajax({
           url:destination,
           type:'GET',
           async: false,
           success: function(data){
           location.href = destination;
           }
           });
    
    denied();

}

function denied()
{
    $("#popup1").fadeOut();
    var d2 = generateLightBox("center", "center", "#bb0000");
    lightboxContentHelper(d2, "sry man", "access ttly denied", "");
}

function auth() {
    d1 = generateLightBox("center", "center", "#000000");
    lightboxContentHelper(d1, "<input id='aaa' type='password' value='' placeholder='enter pass'></input>", "who r u", "", "login", "logEmIn()");
    document.getElementById('aaa').focus();
    
    $('#aaa').keypress(function (e) {
                         if (e.which == 13) {
                         logEmIn();
                         }
                         });
}


function fadeOut(id)
{
//    var div = document.getElementById(id);
//    
//    $("#blackout").fadeOut();
//    $("#"+id).fadeOut();
}

function fadeIn(id)
{
    var div = document.getElementById(id);
    div.style.display = "none";
    
    $("#blackout").fadeIn();
    $("#"+id).fadeIn();
}


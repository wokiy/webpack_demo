document.addEventListener("touchstart",function(ev){
	ev=ev||event;
	ev.preventDefault();
});
(function(){
	var styleNode = document.createElement("style");
	var width = document.documentElement.clientWidth/16;
	styleNode.innerHTML="html{font-size:"+width+"px!important}";
	document.head.appendChild(styleNode);
})();
window.onload=function(){
	var ex = require("./tai.js");
	ex.CMFCMenuBar();
	ex.changeFocus();
	ex.drag();
	ex.changeColor();
	ex.swiper();
	ex.tab();
	ex.definedByMyself();
}

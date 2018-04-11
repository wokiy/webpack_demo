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


import * as ex from "./tai.js";
import data from "../json/Mtai.json";
import $ from "jquery";
import "../css/index.less";


window.onload=function(){
//	var ex = require("./tai.js");
	ex.CMFCMenuBar();
	ex.changeFocus();
	ex.drag();
	ex.changeColor();
	ex.swiper();
	ex.tab();
	ex.definedByMyself();
	
	/*$.each(data, function(index,val) {
		console.log(index,val);
	});*/
	$.each(data,(index,val)=>{console.log(index,val);} );
	
	
}

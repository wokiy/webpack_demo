		exports.css=function(node,type,val){
			/*{
			  	scale:.5,
			  	translateX:100
			   }*/
			if(typeof node["transforms"] ==="undefined"){
				node["transforms"]={};
			}
			
			if(arguments.length>=3){
				//设置
				var text ="";
				node["transforms"][type]=val;
				
				for(item in node["transforms"]){
					if(node["transforms"].hasOwnProperty(item)){
						switch (item){
							case "translateX":
							case "translateY":
							case "translateZ":
								text+=item+"("+node["transforms"][item]+"px)";
								break;
							case "scale":
								text+=item+"("+node["transforms"][item]+")";
								break;
							case "rotate":
								text+=item+"("+node["transforms"][item]+"deg)";
								break;
						}
					}
				}
				node.style.transform = node.style.webkitTransform = text;
			}else if(arguments.length==2){
				//读取
				val = node["transforms"][type];
				if(typeof val ==="undefined"){
					if(type ==="translateX"||type ==="translateY"||type ==="rotate"){
						val = 0;
					}else if(type ==="scale"){
						val = 1;
					}
				}
				return val;
			}
		}
	
	
	

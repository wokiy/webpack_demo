//		var   transform =require("./transform.js");
		import  transform from "./transform.js";
		export default{
			carouse:function(urls){
				var pointsFlag = urls.length;
				//滑屏区域
				var wrap = document.querySelector("#carouse-wrapper");
				var needCarouse = wrap.getAttribute("needCarouse");//有"" 无null
				needCarouse = needCarouse === null?false:true;
				if(needCarouse){
					urls = urls.concat(urls);
				}
				//滑屏元素
				var list  = document.createElement("ul");
				//3d硬件加速
				transform.css(list,"translateZ",1);
				var liText = "";
				var img =0;
				for(var i=0;i<urls.length;i++){
					switch (i){
						case 0:
						   img = require("../img/01.jpg");
						   liText+='<li><a href="javascript:;"><img src="'+img+'" /></a></li>';
							break;
						case 1:
						 	img = require("../img/02.jpg");
						 	liText+='<li><a href="javascript:;"><img src="'+img+'" /></a></li>';
							break;
						case 2:
							 img = require("../img/03.jpg");
							 liText+='<li><a href="javascript:;"><img src="'+img+'" /></a></li>';
							break;
						case 3:
						 	img = require("../img/04.jpg");
						 	liText+='<li><a href="javascript:;"><img src="'+img+'" /></a></li>';
							break;
						case 4:
							 img = require("../img/05.jpg");
							 liText+='<li><a href="javascript:;"><img src="'+img+'" /></a></li>';
							break;
					}
//					liText+='<li><a href="javascript:;"><img src="'+urls[i]+'" /></a></li>';
				}
				list.innerHTML = liText;
				wrap.appendChild(list);
				//所有的图片对象
				var imgs = document.querySelectorAll("#carouse-wrapper ul > li img");
				setTimeout(function(){
					//样式的设置
					var styleNode = document.createElement("style");
					styleNode.innerHTML+="#carouse-wrapper ul{width:"+urls.length+"00%!important}";
					styleNode.innerHTML+="#carouse-wrapper ul > li{width:"+(1/urls.length*100)+"%!important}";
					styleNode.innerHTML+="#carouse-wrapper {height:"+imgs[0].offsetHeight+"px!important}";
					document.head.appendChild(styleNode);
				},100);
			/*生成小圆点的结构和样式*/
				var pWrap = document.querySelector("#carouse-wrapper .points-wrapper");
				if(pWrap){
					var spanText = "";
					for(i=0;i<pointsFlag;i++){
						if(i==0){
							spanText+="<span class='active'></span>";
						}else{
							spanText+="<span></span>";
						}
					}
					pWrap.innerHTML=spanText;
					var points = document.querySelectorAll("#carouse-wrapper .points-wrapper > span");
				}
				
				
			/*基本滑屏逻辑*/
				//手指一开始的位置
				var startX = 0;
				var startY = 0;
				//元素一开始的位置
				var elementX = 0;
				var elementY = 0;
				//抽象ul的位置
				var now =0;
				//用来标识用户的滑动方向   true:在x轴上滑动  false:在y轴上滑动
				var isX =true;
				//做首次判断
				var isFirst=true;
				wrap.addEventListener("touchstart",function(ev){
					ev=ev||event;
					var touchC = ev.changedTouches[0];
					
					
					if(needCarouse){
						//无缝
						//now是第一组的第一张  -- 第二组的第一张
						//now是第二组的最后一张 -- 第一组的最后一张
						//抽象ul的位置
						var now = transform.css(list,"translateX")/document.documentElement.clientWidth;
						if(now == 0){
							now = -urls.length/2;
						}else if(now == 1-urls.length){
							now =1 -urls.length/2;
						}
						transform.css(list,"translateX",now*document.documentElement.clientWidth);
					}
					
					startX = touchC.clientX;
					startY = touchC.clientY;
					//实时获取元素的translateX的偏移量
					elementX=transform.css(list,"translateX");
					elementY=transform.css(list,"translateY");
					
					//清除过渡
					list.style.transition="none";
					//禁止自动轮播
					clearInterval(clearTime);
					
					//重启抖动判断
					isX=true;
					isFirst = true;
				})
				wrap.addEventListener("touchmove",function(ev){
					//看门狗   做二次以后的防抖动
					if(!isX){
						//咬住
						return;
					}
					ev=ev||event;
					var touchC = ev.changedTouches[0];
					//手指移动时的实时位置
					var nowX = touchC.clientX;
					var nowY = touchC.clientY;
					//每次move时手指移动的距离
					var disX = nowX - startX;
					var disY = nowY - startY;
					
					
					//防抖动
					if(isFirst){
						isFirst = false;
						//下面的逻辑只被执行一次
						if(Math.abs(disY) > Math.abs(disX)){
							//move的逻辑需要被禁止
							isX = false;
							//首次防抖动
							return;
						}
					}
					
					
					
					transform.css(list,"translateX",elementX+disX);
				})
				wrap.addEventListener("touchend",function(ev){
					ev=ev||event;
					var touchC = ev.changedTouches[0];
					//抽象ul的位置
					now = transform.css(list,"translateX")/document.documentElement.clientWidth;
					now = Math.round(now);
					//处理超出的情况
					if(now>0){
						now=0;
					}else if(now<1-urls.length){
						now = 1-urls.length;
					}
					moveAuto();
					//重启自动轮播
					if(needAuto){
						auto();
					}
				})
			
				//自动轮播
				var clearTime =0;
				var needAuto = wrap.getAttribute("needAuto");//有"" 无null
				needAuto = needAuto === null?false:true;
				if(needAuto){
					auto();
				}
				function auto(){
					clearInterval(clearTime);
					clearTime =setInterval(function(){
						//无缝
						if(now == 1-urls.length){
							list.style.transition="none";
							now = 1-urls.length/2;
							transform.css(list,"translateX",now*document.documentElement.clientWidth);
						}
						setTimeout(function(){
							now--;
							moveAuto();
						},50)
					},3000);
				}
				
				function moveAuto(){
					list.style.transition=".5s";
					transform.css(list,"translateX",now*document.documentElement.clientWidth);
					//小圆点的同步
					if(pWrap){
						for(var i=0;i<points.length;i++){
							points[i].className="";
						}
						points[-now%pointsFlag].className="active";
					}
				}
			},
			vMove:function(wrap,callBack){
			//滑屏区域
			//var  wrap = document.querySelector("#wrap");
			//滑屏元素
			//var  list = document.querySelector("#wrap .inner");
			var list = wrap.children[0];
			//3d硬件加速
			transform.css(list,"translateZ",1);
			
			//滑屏的最大值（数值上最小）
			var minY = wrap.clientHeight - list.offsetHeight;
			
			//手指一开始的位置
			var startP = {};
			//元素一开始的位置
			var elementP ={};
			
			//上一次的时间
			var lastTime =0;
			//上一次的位置
			var lastPoint =0;
			//时间差  初始化为1解决targetY为NaN的bug
			var timeVal =1;
			//位置差
			var pointVal = 0;
			
			//防抖动
			var isY = true;
			var isFirst = true;
			
			//即点即停
			var 	Tween={
				 Linear: function(t,b,c,d){ return c*t/d + b; },
				 Back: function(t,b,c,d,s){
		            if (s == undefined) s = 1.70158;
		            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		        }
			}
			
			wrap.addEventListener("touchstart",function(ev){
				ev=ev||event;
				var touchC = ev.changedTouches[0];
				
				//重新较正一下miny的值（因为此时页面肯定已经渲染完毕）
				minY = wrap.clientHeight - list.offsetHeight;
				
				startP = {clientX:touchC.clientX,clientY:touchC.clientY};
				elementP = {x:transform.css(list,"translateX"),y:transform.css(list,"translateY")}
				
				list.style.transition="none";
				list.elasticd=false;
				
				
				//同步手指点上来时的位置和时间点
				lastTime = new Date().getTime();
				lastPoint = touchC.clientY;
				
				//清除速度的残留
				pointVal =0;
				
				//重启防抖动判断
				isY = true;
				isFirst = true;
				
				//即点即停
				//if(transform.css(list,"translateY") <=0 &&  transform.css(list,"translateY") >=minY){
					clearInterval(wrap.clearTime);
				//}
				
				if(callBack&&typeof callBack["start"] === "function"){
					callBack["start"].call(this);
				}
			})
			
			wrap.addEventListener("touchmove",function(ev){
				if(!isY){
					return;
				}
				
				ev=ev||event;
				var touchC = ev.changedTouches[0];
				
				//手指在一次滑动过程中滑动的总距离  ！！注意disY不是每次手指滑动的距离
				var  nowP = touchC;
				var dis = {x:nowP.clientX - startP.clientX,y:nowP.clientY - startP.clientY}
				//左边的留白区域
				var translateY = elementP.y+dis.y;
				
				//每次touchmove触发时的时间点 位置
				var nowTime = new Date().getTime();
				var nowPoint = touchC.clientY;
				timeVal = nowTime -lastTime;
				pointVal = nowPoint - lastPoint;
				
				lastPoint = nowPoint;
				lastTime = nowTime;
				
				
				//手动橡皮筋效果
				if(translateY>0){
					var scale = document.documentElement.clientHeight/((document.documentElement.clientHeight+translateY)*2);
					//translateY = elementY+disY*scale;
					translateY = transform.css(list,"translateY") + pointVal*scale;
					list.elasticd=true;
				}else if(translateY<minY){
					var over = minY - translateY ;
					var scale = document.documentElement.clientHeight/((document.documentElement.clientHeight+over)*2);
					//translateY = elementY+disY*scale;
					translateY = transform.css(list,"translateY") + pointVal*scale;
					list.elasticd=true;
				}
				
				if(isFirst){
					isFirst =false;
					if(Math.abs(dis.x) > Math.abs(dis.y) ){
						isY = false;
						return;
					}
				}
				
				
				transform.css(list,"translateY",translateY);
				
				if(callBack&&typeof callBack["move"] === "function"){
					callBack["move"].call(this);
				}
			})
			
			wrap.addEventListener("touchend",function(ev){
				
				//最后一次touchmove的平均速度
				var speed = pointVal / timeVal;
				speed = Math.abs(speed)<1?0:speed;
				
				var translateY = transform.css(list,"translateY");
				var targetY = translateY + speed*200;
				var time = Math.abs(speed)*0.15;
				time = time>1?1:time;
				//var bsr="";
				var type = "Linear";
				if(targetY>0){
					targetY =0;
					//bsr = "cubic-bezier(.15,1.6,.72,1.65)";
					type = "Back";
					//手动的橡皮筋效果
					if(list.elasticd){
						time = .5;
						//bsr="";
						type="Linear";
					}
				}else if(targetY<minY){
					targetY=minY;
					//bsr = "cubic-bezier(.15,1.6,.72,1.65)";
					type="Back";
					if(list.elasticd){
						time = .5;
						//bsr="";
						type="Linear";
					}
				}
				
				/*list.style.transition=time+"s "+bsr;
				transform.css(list,"translateY",targetY);*/
				//即点即停的快速滑屏
				move(type,targetY,time);
			})
			
			//模拟过渡动画
			function move(type,targetY,time){
				var point =0;
				
				var t = 0;
				var b = transform.css(list,"translateY");
				var c  = targetY -b;
				var d = time/(0.02);
				//将回弹距离控制的小一点
				var s =1;
				
				//即点即停
				clearInterval(wrap.clearTime);
				wrap.clearTime=setInterval(function(){
					t++;
					if(t>d){
						clearInterval(wrap.clearTime);
						
						if(callBack&&typeof callBack["end"] === "function"){
							callBack["end"].call(this);
						}
						
						return;
					}
					point = Tween[type](t,b,c,d,s);
					transform.css(list,"translateY",point);
					if(callBack&&typeof callBack["move"] === "function"){
						callBack["move"].call(this);
					}
				},20)
			}
		}
		}
	
	

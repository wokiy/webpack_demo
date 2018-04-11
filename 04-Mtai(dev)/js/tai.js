//	var  damu =require("./damu.js");
//	var 	tools = require("./tools.js");
//	var    transform =require("./transform.js");

	
	import  damu from "./damu.js";
	import  tools from "./tools.js";
	import  transform from "./transform.js";
	
	export function CMFCMenuBar (){
				//面包导航
				var menuBtn = document.querySelector("#index .head .headT .menuBtn");
				//遮罩层
				var mask = document.querySelector("#index .head .mask");
				
				//flag:false---> 关的状态
				//flag:true---> 开的状态
				//menuBtn的事件应该要先被触发
				//menuBtn的事件逻辑和docunment的事件逻辑不应该产生冲突
				var flag=false;
				menuBtn.addEventListener("touchstart",function(ev){
						ev=ev||event;
						if(flag){
							tools.addClass(this,"menuBtnClose");
							tools.removeClass(this,"menuBtnShow");
							mask.style.display="none";
						}else{
							tools.addClass(this,"menuBtnShow");
							tools.removeClass(this,"menuBtnClose");
							mask.style.display="block";
						}
						flag=!flag;
						ev.stopPropagation();
						ev.preventDefault();
				})
				
				document.addEventListener("touchstart",function(ev){
					if(flag){
						tools.addClass(menuBtn,"menuBtnClose");
						tools.removeClass(menuBtn,"menuBtnShow");
						mask.style.display="none";
						flag=!flag;
					}
				})
				
				mask.addEventListener("touchstart",function(ev){
					ev=ev||event;
					ev.stopPropagation();
					ev.preventDefault();
				})
			}
	export function changeFocus (){
				var inputText = document.querySelector("#index .head .search input[type='text']");
				inputText.addEventListener("touchstart",function(ev){
					ev=ev||event;
					this.focus();
					if(!this.hasFocus){
						this.hasFocus=true;
					}
					ev.stopPropagation();
					ev.preventDefault();
				})
				
				document.addEventListener("touchstart",function(ev){
					if(inputText.hasFocus){
						inputText.blur();
						inputText.hasFocus=false;
					}
				})
			}
	export function drag (){
				//滑屏区域
				var  wrap = document.querySelector("#index .content .nav-wrap");
				//滑屏元素
				var  list = document.querySelector("#index .content .nav-wrap .nav-list");
				//3d硬件加速
				transform.css(list,"translateZ",1);
				
				//滑屏的最大值（数值上最小）
				var minX = wrap.clientWidth - list.offsetWidth;
				
				//手指一开始的位置
				var startX = 0;
				//元素一开始的位置
				var elementX =0;
				
				//上一次的时间
				var lastTime =0;
				//上一次的位置
				var lastPoint =0;
				//时间差  初始化为1解决targetX为NaN的bug
				var timeVal =1;
				//位置差
				var pointVal = 0;
				
				wrap.addEventListener("touchstart",function(ev){
					ev=ev||event;
					var touchC = ev.changedTouches[0];
					
					elementX = transform.css(list,"translateX");
					startX = touchC.clientX;
					
					list.style.transition="none";
					list.elasticd=false;
					
					
					//同步手指点上来时的位置和时间点
					lastTime = new Date().getTime();
					lastPoint = touchC.clientX;
					
					//清除速度的残留
					pointVal =0;
				})
				
				wrap.addEventListener("touchmove",function(ev){
					ev=ev||event;
					var touchC = ev.changedTouches[0];
					
					var nowX = touchC.clientX;
					//手指在一次滑动过程中滑动的总距离  ！！注意disX不是每次手指滑动的距离
					var disX = nowX - startX;
					//左边的留白区域
					var translateX = elementX+disX;
					
					//每次touchmove触发时的时间点 位置
					var nowTime = new Date().getTime();
					var nowPoint = touchC.clientX;
					timeVal = nowTime -lastTime;
					pointVal = nowPoint - lastPoint;
					
					lastPoint = nowPoint;
					lastTime = nowTime;
					
					
					//手动橡皮筋效果
					if(translateX>0){
						var scale = document.documentElement.clientWidth/((document.documentElement.clientWidth+translateX)*2);
						//translateX = elementX+disX*scale;
						translateX = transform.css(list,"translateX") + pointVal*scale;
						list.elasticd=true;
					}else if(translateX<minX){
						var over = minX - translateX ;
						var scale = document.documentElement.clientWidth/((document.documentElement.clientWidth+over)*2);
						//translateX = elementX+disX*scale;
						translateX = transform.css(list,"translateX") + pointVal*scale;
						list.elasticd=true;
					}
					
					transform.css(list,"translateX",translateX);
					
				})
				
				wrap.addEventListener("touchend",function(ev){
					
					//最后一次touchmove的平均速度
					var speed = pointVal / timeVal;
					speed = Math.abs(speed)<1?0:speed;
					
					var translateX = transform.css(list,"translateX");
					var targetX = translateX + speed*200;
					var time = Math.abs(speed)*0.15;
					time = time>1?1:time;
					console.log("速度："+speed+"目标位置："+targetX);
					var bsr="";
					if(targetX>0){
						targetX =0;
						bsr = "cubic-bezier(.15,1.6,.72,1.65)";
						//手动的橡皮筋效果
						if(list.elasticd){
							time = .5;
							bsr="";
						}
					}else if(targetX<minX){
						targetX=minX;
						bsr = "cubic-bezier(.15,1.6,.72,1.65)";
						if(list.elasticd){
							time = .5;
							bsr="";
						}
					}
					
					list.style.transition=time+"s "+bsr;
					transform.css(list,"translateX",targetX);
					
				})
			}
	export function changeColor(){
				var listNode = document.querySelector("#index .content .nav-wrap .nav-list");
				var aNodes = document.querySelectorAll("#index .content .nav-wrap .nav-list li a");
				
				listNode.addEventListener("touchstart",function(){
					this.isMoved = false;
				})
				listNode.addEventListener("touchmove",function(){
					if(!this.isMoved){
						this.isMoved = true;
					}
				})
				
				listNode.addEventListener("touchend",function(ev){
					if(this.isMoved){
						return;
					}
					
					ev=ev||event;
					var touchC = ev.changedTouches[0];
					for(var i=0;i<aNodes.length;i++){
						aNodes[i].className="";
					}
					touchC.target.className="active";
					
//					if(touchC.target.nodeName.toUpperCase() === "A"){
//						touchC.target.parentNode.className="active";
//					}else if(touchC.target.nodeName.toUpperCase() === "LI"){
//						touchC.target.className="active";
//					}
					
				})
				
			}
	export function swiper(){
				var urlArr = ["img/01.jpg","img/02.jpg","img/03.jpg","img/04.jpg","img/05.jpg"];
				damu.carouse(urlArr);
			}
	export function tab(){
				//即是滑屏区域  也是滑屏元素
				var tabs = document.querySelectorAll("#index .content .tab");
				var translateX = tabs[0].offsetWidth;
				var wraps = document.querySelectorAll("#index .content .tab .tab-wrap");
				var navs = document.querySelectorAll("#index .content .tab .tab-nav");
				for(var i=0;i<wraps.length;i++){
					move(wraps[i],navs[i]);
				}
				
				function move(wrap,nav){
					//3d硬件加速
					transform.css(wrap,"translateZ",1);
					//抽象小绿的下标（now的定义一定要在move函数中。每一个now对应一个小绿）
					var now = 0;
					//每一个wrap对应的loading
					var loadings = wrap.querySelectorAll(".tab-loading");
					//每一个nav下的小绿 和 导航元素
					var aNodes = nav.querySelectorAll("a");
					var smallG = nav.querySelector(".samllG");
					//3d硬件加速
					transform.css(smallG,"translateZ",1);
					smallG.style.width=aNodes[0].offsetWidth+"px";
					//矫正位置
					transform.css(wrap,"translateX",-translateX);
					
					//滑屏逻辑（防抖动）
					var startPoint ={x:0,y:0};
					var elementPoint ={x:0,y:0};
					//防抖动
					var isX = true;
					var isFirst = true;
					var isLoad = false;
					
					function jump(disX){
						
						var targetX = disX>0?0:-2*translateX;
						wrap.style.transition=".5s";
						transform.css(wrap,"translateX",targetX);
						
						//将isload置为true
						isLoad = true;
						//对now进行无缝判断
						disX>0?now--:now++;
						if(now<0){
							now = aNodes.length - 1;
						}else if(now>aNodes.length - 1){
							now = 0;
						}
						
						
						/*区分动画与请求
								请求的发送时间一定要在动画完成之后
									有可能请求的时间极快 动画一定会失效*/
						wrap.addEventListener("transitionend",endFn);
						wrap.addEventListener("webkitTransitionEnd",endFn);
						/*endFn
						 	1.为请求去做一些预备与提示工作
						 		loading图统一调整成显示状态（过渡完成后）
						 		小绿应该要产生移动（过渡完成后）
						 		将isload置为true（过渡完成前，进入jump的一刹那就应该完成）
						 				(为了让now的值获取正确，将isload置为true应该在进入jump函数一开始的时候就做)
						 	2.发生请求
						 			回调：请求正常返回
						 				获取数据  拿到数据后进行dom操作 将返回的数据准确的显示在页面上
						 				将主题内容拉回来
						 				loading应该隐藏起来
						 				将isload置为false
						 * */
						function endFn(){
							wrap.removeEventListener("transitionend",endFn);
							wrap.removeEventListener("webkitTransitionEnd",endFn);
							
							/*将loading图显示出来  这个loading的显示与隐藏代表了请求的阶段
									loading图没有显示:  请求没有发起  请求已经完成
									loading图显示:  请求正在执行*/
							for(var i=0;i<loadings.length;i++){
								loadings[i].style.opacity=1;
							}
							
							//小绿应该要产生移动
							smallG.style.width=aNodes[now].offsetWidth+"px";
							transform.css(smallG,"translateX",aNodes[now].offsetLeft);
							
							//模拟发请求    学完node和ajax之后  自己一定要回来发一次真正的请求
							setTimeout(function(){
								//获取数据  拿到数据后进行dom操作 将返回的数据准确的显示在页面上
								
								//将主题内容拉回来
								wrap.style.transition="none";
								transform.css(wrap,"translateX",-translateX);
								//loading应该隐藏起来
								for(var i=0;i<loadings.length;i++){
									loadings[i].style.opacity=0;
								}
								
								//将isload置为false
								isLoad = false;
							},2000);
						}
						
					}
					wrap.addEventListener("touchstart",function(ev){
						if(isLoad){
							return;
						}
						ev=ev||event;
						var touchC = ev.changedTouches[0];
						
						//startPoint = touchC;
						//快照
						startPoint={clientX:touchC.clientX,clientY:touchC.clientY};
						
						
						/*startPoint.x=touchC.clientX;
						startPoint.y=touchC.clientY;*/
						elementPoint.x = transform.css(this,"translateX");
						elementPoint.y = transform.css(this,"translateY");
						
						//清除过渡
						wrap.style.transition="none";
						//重启防抖动判断
						isX = true;
						isFirst = true;
					})
					wrap.addEventListener("touchmove",function(ev){
						if(isLoad){
							return;
						}
						if(!isX){
							return;
						}
						ev=ev||event;
						var touchC = ev.changedTouches[0];
						
						var nowPoint = touchC;
						var dis = {x:0,y:0};
						dis.x = nowPoint.clientX - startPoint.clientX;//0
						dis.y = nowPoint.clientY - startPoint.clientY;//0
						/*var nowPoint={x:0,y:0};
						nowPoint.x = touchC.clientX;
						nowPoint.y = touchC.clientY;
						var dis = {x:0,y:0};
						dis.x = nowPoint.x - startPoint.x;
						dis.y = nowPoint.y - startPoint.y;*/
						
						if(isFirst){
							isFirst = false;
							if(Math.abs(dis.y) > Math.abs(dis.x) ){
								isX = false;
								return;
							}
						}
						
						transform.css(this,"translateX",elementPoint.x+dis.x);
						
						//过半跳转  dis.x:整个一次独立touchstart到touchend那一瞬间 手指移动的总距离
						if(Math.abs(dis.x) > translateX/2 ){
							jump(dis.x);
						}
					})
					wrap.addEventListener("touchend",function(ev){
						if(isLoad){
							return;
						}
						ev=ev||event;
						var touchC = ev.changedTouches[0];
						
						var nowPoint = touchC;
						var dis = {x:0,y:0};
						dis.x = nowPoint.clientX - startPoint.clientX;
						dis.y = nowPoint.clientY - startPoint.clientY;
						/*var nowPoint={x:0,y:0};
						nowPoint.x = touchC.clientX;
						nowPoint.y = touchC.clientY;
						var dis = {x:0,y:0};
						dis.x = nowPoint.x - startPoint.x;
						dis.y = nowPoint.y - startPoint.y;*/
						if(Math.abs(dis.x) < translateX/2 ){
							this.style.transition=".5s";
							transform.css(this,"translateX",-translateX);
						}
					})
				}
			}
	export function definedByMyself(){
				var barY =0;
				var btns =  document.querySelectorAll("#index .head .headT .btns a");
				var head =  document.querySelector("#index .head");
				var search =  document.querySelector("#index .head .search");
				var content = document.querySelector("#index .content");
				var bar = document.querySelector("#index .scrollBar");
				var scale = content.clientHeight / content.children[0].offsetHeight;
				bar.style.height = content.clientHeight*scale+"px";
				
				//flag  true  ---> none
				var flag =true;
				btns[0].addEventListener("touchend",function(){
						if(barY>head.offsetHeight/2){
							if(flag){
								search.style.display="block";
							}else{
								search.style.display="none";
							}
							flag =!flag;
						}
				});
				
				var callBack ={
					start:function(){
						bar.style.opacity=1;
					},
					move:function(){
						var scale = transform.css(content.children[0] , "translateY") / (content.children[0].offsetHeight - content.clientHeight);
						barY =-(document.documentElement.clientHeight - bar.offsetHeight)*scale;
						transform.css(bar,"translateY",barY);
						
						if(barY>head.offsetHeight/2 && barY<head.offsetHeight){
							search.style.display="none";
							flag =true;
						}else if(barY<head.offsetHeight/2&&barY>0){
							search.style.display="block";
							flag =false;
						}
					},
					end:function(){
						bar.style.opacity=0;
					}
				}
				
				damu.vMove(content,callBack);
			}
		
			
			
			
			
			
			
			

			
			
			


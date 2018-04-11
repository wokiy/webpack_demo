###代码分割(code split)&懒加载(lazy load)
###第一步  新增文件atguigu.js
		export function confirmFn(){
			return confirm("要回娘家嘛？");
		}
		export function back(){
			window.location.href="http://www.atguigu.com";
		}

###使用atguigu.js(在index.js中编码)
	import * as atguigu from "./atguigu.js";
	var logo = document.querySelector(".head .headT .logo");
	logo.addEventListener("touchend",function(){
		 var atguigu = require('./atguigu');
				if(atguigu.confirmFn()){
						atguigu.back();
				}
	})


###懒加载
	//import * as atguigu from "./atguigu.js";
	logo.addEventListener("touchend",function(){
			require.ensure([],function(require) {
			    var atguigu = require('./atguigu');
				if(atguigu.confirmFn()){
						atguigu.back();
				}
			  })
	});
	
	//import * as atguigu from "./atguigu.js";
	logo.addEventListener("touchend",function(){
			import('./atguigu').then(atguigu => {
				if(atguigu.confirmFn()){
					atguigu.back();
				}
			})
	})


###使用hash
	[hash] is replaced by the hash of the compilation.
			hash代表的是compilation的hash值。
	[chunkhash] is replaced by the hash of the chunk.
			chunkhash代表的是chunk的hash值。
	extract-text-webpack-plugin提供了另外一种hash值：contenthash。
			顾名思义，contenthash代表的是文本文件内容的hash值，也就是只有style文件的hash值


###为什么要使用hash
	打包后的文件到底应不应该使用MD5或其他算法生成hsah？
			应该，因为有可能服务器和客户端之间没有建立符合http规范的协商缓存
		打包后为什么要拆分出第三库等基本不会修改的模块
			如果不拆分，打成一个包，无论哪个文件有修改都会使整个应用去加载所有的js，性能太低	
			
		不存在hash机制
				服务器和客户端之间没有建立符合http规范的协商缓存	
					不管改不改，应用每次都是去服务器下载的，因为没有缓存
				服务器和客户端之间建立了符合http规范的协商缓存	
					修改：具体的规则得看缓存的逻辑，有一定风险
					不改：使用缓存
		存在hash机制
				服务器和客户端之间没有建立符合http规范的协商缓存	
					不管改不改，应用每次都是去服务器下载的，因为没有缓存
				服务器和客户端之间建立了符合http规范的协商缓存	
					修改：肯定去访问新的，不会用缓存，因为文件名变了
					不改：使用缓存
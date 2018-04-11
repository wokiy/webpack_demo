# webpack快速入门
## 1. 目标
    1). 理解项目的模块化打包
        模块化(commonjs/ES6)		打包
    2). 学会webpack的基本使用
        配置     命令
    3). 理解webpack的相关概念
        entry	    output	  module	  bundle/chunk
    4). 掌握项目的打包和发布
           
## 2. 初始化项目
    cnpm init -y
    
## 3. 下载npx
	通常情况
	    cnpm install webpack -g   //全局下载webpack
	    cnpm install webpack --save-dev  //下载webpack为开发依赖
    
    推荐使用npx包
    	cnpm install -g npx
    	npx是内置的包执行器
    	npx 会自动查找当前依赖包中的可执行文件，或者去 PATH 里找。如果依然找不到，就会帮你安装！
    	npm 5.2.0自带npx包
    
## 4.打包commonjs版本的音悦台
		注意不用局部安装webpack
    	npx webpack  入口文件  目标文件
      
## 5. 使用配置打包ES6版本的音悦台
    1). webpack配置: wbpack.config.js
      module.exports = {
        // 入口
        entry: './app.js',
        // 出口
        output: {
          filename: 'bundle.js'，
          path:__dirname + '/dist'
        }
      }
    2). 编译打包
     	npx webpack
    3). 浏览器打开index.html, 查看运行效果

##6. 启服务
	安装包
    	npm install -g serve
    	serve ./ 

##7.配置npm脚本
	"scripts": {
          "build": "webpack",
          "server": "serve ./"
     },
	npm run build			打包
	npm run server		启服务
	
## 8. 总结
    1). webpack中的四个概念
        entry: webpack打包的入口
        output: webpack打包生成什么
        module: 模块文件
        bundle/chunk: webpack打包n个关联的module生成的文件
    2). 理解webpack的模块化打包
        1. webpack的模块化打包是建立在应用是模块化编码的基础上的, 且你的应用至少有一个入口JS模块
        2. webpack在打包是会从入口js开始, 将所有相关联的模块连接起来, 形成一个图(网)的结构, 
           将图中所有模块打包成一个或少量几个bundle文件, 而浏览器运行是打包生成的bundle文件
    3). webpack的基本配置和命令

## 8. 待解决问题
    1). webpack本身只能打包JS(3.0支持json), 而项目中的css/img等资源如何打包?
    2). 页面能不能自动引入动态生成的打包JS/CSS 
## 0. 目标
    移除js中的未引用代码: 主要用于ES6的模块打包(export/import)
    使用uglifyjs-webpack-plugin插件压缩代码 

## 1. 下载依赖模块
    npm install --save-dev uglifyjs-webpack-plugin
    
## 2. src/math.js
    // 分别导出2个函数
    export function square(x) {
      return x * x;
    }
    export function cube(x) {
      return x * x * x;
    }
    
## 3. src/index.js
    import {cube} from './math.js';  // 只引入一个函数
    
    function component() {
      var element = document.createElement('div');
      element.innerHTML = [
        'Hello webpack!',
        '5 cubed is equal to ' + cube(5)
      ].join(' ');
      return element;
    }
    
    document.getElementById('app').appendChild(component());
    
## 4. webpack.config.js
    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
    
    module.exports = {
      entry: {
        app: './src/index.js'
      },
      output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: './index.html'
        }),
        new UglifyJSPlugin() // 引入压缩js的插件(去除未使用的代码)
      ]
    };

## 7. 打包测试
    webpack
    查看打包文件: 没有包含math.js中的square函数代码
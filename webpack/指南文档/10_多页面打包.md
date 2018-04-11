## 0. 目标
    实现多页应用的打包
        指定多个入口和出口
        创建多个html-webpack-plugin的实例
    
## 1. 下载依赖包
    npm install --save-dev clean-webpack-plugin html-webpack-plugin

## 2. src/print.js
    export default function printMe() {
      console.log('I get called from print.js!');
    }
## 3. src/otherPageModule.js
    document.write('other page module')
    
## 4. src/index.js
    import _ from 'lodash';
    import printMe from './print.js';
    
    function component() {
      var element = document.createElement('div');
      var btn = document.createElement('button');
    
      element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    
      btn.innerHTML = 'Click me and check the console!';
      btn.onclick = printMe;
    
      element.appendChild(btn);
    
      return element;
    }
    
    document.body.appendChild(component());

## 5. pages/index.html
    <h1>index page</h1>
    <p><a href="other.html">other page</a></p>
    
## 6. pages/other.html
    <h1>other page</h1>
    <p><a href="index.html">index page</a></p>
    
## 7. webpack.config.js
    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const CleanWebpackPlugin = require('clean-webpack-plugin');
    
    module.exports = {
      entry: {
        app: './src/index.js',
        other: './src/otherPageModule.js'
      },
      output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist') // 得到绝对路径
      },
      plugins: [
        new CleanWebpackPlugin(['dist']),  // 清除指定文件
        new HtmlWebpackPlugin({  // 生成html文件
          template: './pages/index.html', //html模板路径
          filename: './pages/index.html', //生成的html存放路径，相对于path
          inject: true, //js插入的位置，true/'head'/'body'/false
          hash: true, //为静态资源生成hash值
          chunks: ['app'],//需要引入的chunk，不配置就会引入所有页面的资源
          minify: { //压缩HTML文件
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: false //删除空白符与换行符
          }
        }),
        new HtmlWebpackPlugin({  // 生成html文件
          template: './pages/other.html', //html模板路径
          filename: './pages/other.html', //生成的html存放路径，相对于path
          inject: true, //js插入的位置，true/'head'/'body'/false
          hash: true, //为静态资源生成hash值
          chunks: ['other'],//需要引入的chunk，不配置就会引入所有页面的资源
          minify: { //压缩HTML文件
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: false //删除空白符与换行符
          }
        })
      ]
    };
## 0. 目标
    分离开发环境(development)和生产环境(production)配置

## 1. 说明
    开发环境(development)和生产环境(production)的构建目标差异很大, 需要编写彼此独立的 webpack 配置
    开发环境中需要:
        live reloading: 实时重新加载
        hot module replacement(HMR): 热模块替换
        source map: 异常错误定位
        localhost server: 本地服务器
    生产环境中需要:
        更小的 bundle, 更优化的资源，以减小加载时间

## 2. 下载依赖包
    npm install --save-dev webpack-merge  //合并webpack配置的模块
    
## 3. src/print.js
    export default function printMe() {
      console.log('I get called from print.js!');
    }
## 4. src/index.js
    import _ from 'lodash';
    import printMe from './print.js';
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Looks like we are in development mode!');
    }
    
    function component() {
      var element = document.createElement('div');
      var btn = document.createElement('button');
    
      element.innerHTML = _.join(['Hello222', 'webpack'], ' ');
    
      btn.innerHTML = 'Click me and check the console!';
      btn.onclick = printMe;
    
      element.appendChild(btn);
    
      return element;
    }
    
    document.body.appendChild(component());
## 5. webpack.common.js
    const path = require('path');
    const CleanWebpackPlugin = require('clean-webpack-plugin');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    
    module.exports = {
      entry: {
        app: './src/index.js'
      },
      plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
          title: 'Production'
        })
      ],
      output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
      }
    };
## 6. webpack.dev.js
    const merge = require('webpack-merge');
    const common = require('./webpack.common.js');
    
    module.exports = merge(common, {
      devtool: 'inline-source-map',
      devServer: {
        contentBase: './dist'
      }
    });
    
## 7. webpack.prod.js
    const merge = require('webpack-merge');
    const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
    const common = require('./webpack.common.js');
    const webpack = require('webpack')
    
    module.exports = merge(common, {
      devtool: 'source-map',
      plugins: [
        new UglifyJSPlugin({
          sourceMap: true
        }),
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('production')
          }
        })
      ]
    });
       
## 8. package.json
    "scripts": {
      "start": "webpack-dev-server --open --config webpack.dev.js",
      "build": "webpack --config webpack.prod.js"
    }
    
## 9. 测试运行
    npm start: 开发运行
    npm run build: 生产构建

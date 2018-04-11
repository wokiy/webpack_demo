## 0. 目标
    启用 HMR
    HMR 修改样式表
    
## 1. 说明
    模块热替换(Hot Module Replacement 或 HMR)是 webpack 提供的最有用的功能之一。
    只在开发环境使用
    在开发过程中，可以将 HMR 作为 LiveReload 的替代。webpack-dev-server 支持 hot 模式
    好处:
        保留在完全重新加载页面时丢失的应用程序状态。
        只更新变更内容，以节省宝贵的开发时间。
        调整样式更加快速

## 2. src/print.js
    export default function printMe() {
      console.log('Updating print.js...')
    }
## 3. src/style.css
    body {
      background: blue;
    }
## 4. src/index.js
    import _ from 'lodash';
    import printMe from './print.js';
    import './styles.css';
    
    document.body.innerHTML = '<input type="text">'
    function component() {
      var element = document.createElement('div');
      var btn = document.createElement('button');
    
      element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    
      btn.innerHTML = 'Click me and check the console!';
      btn.onclick = printMe;
    
      element.appendChild(btn);
    
      return element;
    }
    
    let element = component(); // 当 print.js 改变导致页面重新渲染时，重新获取渲染的元素
    document.body.appendChild(element);
    //如果使用了HRM 当 print.js 内部发生变更时可以告诉 webpack 接受更新的模块
    if (module.hot) {
      module.hot.accept('./print.js', function () {
        console.log('Accepting the updated printMe module!');
        document.body.removeChild(element);
        element = component(); // 重新渲染页面后，component 更新 click 事件处理
        document.body.appendChild(element);
      })
    }

## 5. webpack.config.js
    const path = require('path'); // node内置路径处理相关的模块
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const CleanWebpackPlugin = require('clean-webpack-plugin');
    const webpack = require('webpack');
    
    module.exports = {
      entry: {
        app: './src/index.js'
      },
      devtool: 'inline-source-map',
      devServer: {
        contentBase: './dist',
        hot: true // 开启HMR
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          }
        ]
      },
      plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
          title: 'dev'
        }),
        new webpack.HotModuleReplacementPlugin() // 引入HMR插件
      ],
      output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
      }
    };
    
## 6. package.json
    "scripts": {
      "build": "webpack",
      "start": "webpack-dev-server --open"  //开发编译运行
    }
    
## 7. 测试运行
    npm start
    修改style.css, 自动HMR
    修改print.js, 自动HMR
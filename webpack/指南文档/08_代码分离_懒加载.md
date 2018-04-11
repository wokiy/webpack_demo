## 0. 目标
    代码分离
        入口起点：使用 entry 配置手动地分离代码。
        防止重复：使用 CommonsChunkPlugin 去重和分离 chunk。
        动态导入：通过模块的内联函数调用来分离代码。
    懒加载
        对分离出的包在需要时才从服务器加载它
        路由懒加载就是此效果
    使用webpack-bundle-analyzer分析打包文件组成: 
        优化lodash.js的使用
    
## 1. 说明
    代码分离是 webpack 中最引人注目的特性之一。
    此特性能够把代码分离到不同的 bundle 中，然后可以按需加载或并行加载这些文件。
    代码分离可以用于获取更小的 bundle，以及控制资源加载优先级，可极大影响加载时间。
    三种常用的代码分离方法：
        入口起点：使用 entry 配置手动地分离代码。
        防止重复：使用 CommonsChunkPlugin 去重和分离 chunk。
        动态导入/懒加载：使用import + promise。

## 2. src/another-module.js
    import _ from 'lodash';
    console.log(
      _.join(['Another', 'module', 'loaded!'], ' ')
    );
## 3. src/math.js
    export function square(x) {
      console.log('square()')
      return x * x;
    }
    export function cube(x) {
      console.log('cube()')
      return x * x * x;
    }
## 4. src/index.js
    import _ from 'lodash';
    
    function component() {
      var element = document.createElement('div');
    
      element.innerHTML = _.join(['Hello', 'webpack222'], ' ');
    /*
      // 在初始化代码中异步加载
      import('./math').then(math => {
        alert(math.square(2))
      } )
      */
      // 在事件回调函数中异步加载
      element.onclick = function () {
        import('./math').then(math => {
          alert(math.square(2))
        } )
      }
    
      return element;
    }
    
    document.body.appendChild(component());
## 5. webpack.config.js
    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const CleanWebpackPlugin = require('clean-webpack-plugin');
    
    const webpack = require('webpack');
    
    module.exports = {
      entry: {
        index: './src/index.js',
        another: './src/another-module.js'
      },
      output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist') // 得到绝对路径
      },
      plugins: [
        new CleanWebpackPlugin(['dist']),  // 清除指定文件
        new HtmlWebpackPlugin({  // 生成html文件
          title: '代码分离'
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'common' // 指定公共 bundle的名称。
        })
      ]
    };
    
## 6. 打包查看
    webpack
    index.js与another-module.js分离打包了
    公共模块lodash被分离打包到common.bundle.js
    math.js被分离打包到0.bundle.js, 且此js在需要时才从服务器端获取(懒加载)

## 7. 分析打包文件
    1. 下载工具包
        npm install --save-dev webpack-bundle-analyzer
    2. 配置
        var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
        // ...
        plugins: [new BundleAnalyzerPlugin()]
        // ...
    3. 打包查看分析
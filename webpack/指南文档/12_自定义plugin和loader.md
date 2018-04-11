## 0. 目标
    加深对plugin和loader的理解
    
#1. 自定义plugin
## 1). webpack插件的组成：
    一个JavaScript命名函数。
    在它的原型上定义一个apply方法。
    指定挂载的webpack事件钩子。
    处理webpack内部实例的特定数据。
    功能完成后调用webpack提供的回调(可选)
    
## 2). 编码(src/my-webpack-plugin.js)
    // 命名函数
    function MyExampleWebpackPlugin(options) {
    
    };
    
    // 在它的 prototype 上定义一个 `apply` 方法。
    MyExampleWebpackPlugin.prototype.apply = function (compiler) {
      console.log('apply()')
      // 指定挂载的webpack事件钩子。
      compiler.plugin('done', (compilation) => { /* compilation: 处理webpack内部实例的特定数据。*/
        console.log("This is an example plugin!!!");
      });
    
      // 设置回调来访问编译对象：
      compiler.plugin("compilation", function (compilation) {
    
        // 现在设置回调来访问编译中的步骤：
        compilation.plugin("optimize", function () {
          console.log("Assets are being optimized.");
        });
      });
    };
    
    module.exports = MyExampleWebpackPlugin
    
    /*
    区别compiler与compilation
      compiler: 代表了完整的 webpack 环境配置
      compilation: 代表了一次单一的版本构建和生成资源
     */
## 3). 配置使用自定义plugin(webpack.config.js)     
    const MyExampleWebpackPlugin = require('./src/my-webpack-plugin');
    
    plugins: [
      new MyExampleWebpackPlugin()
    ]
    
#2. 自定义loader
## 1). loader组成
    loader 是导出为 function 的 node 模块。
    当资源应该由此 loader 转换时，调用此函数。
    在简单的情况下，当只有一个 loader 应用于资源时，调用 loader 有一个参数：作为字符串的资源文件的内容。

## 2). 编码
    1.node_modules/json2-loader/index.js
      module.exports = function (source) {
      
        if (this.cacheable) this.cacheable();
        var value = typeof source === "string" ? JSON.parse(source) : source;
        value = JSON.stringify(value)
      
        return `module.exports = ${value}`;
      }
    
    2.src/person.json2
      {
        "name": "TOM",
        "age": 12
      }
    3. index.js
      import person from './person.json2'
      console.log(person)
      document.write(Json.stringify(person))

## 3). 配置
    module: {
      rules: [
        {
          test: /\.json2$/,
          use: 'json2-loader'
        }
      ]
    }

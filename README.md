# webpack_demo
 1. vue-cli的js文件分析
  
  文件分析图
  ![文件分析](http://114.215.91.58/Blog//static/userImages/20180507/1525658360756027421.jpg)

## webpack性能优化
> 如今前端工程化的概念早已经深入人心，选择一款合适的编译和资源管理工具已经成为了所有前端工程中的标配，而在诸多的构建工具中，
  webpack以其丰富的功能和灵活的配置而深受业内吹捧，逐步取代了grunt和gulp成为大多数前端工程实践中的首选，
  React，Vue，Angular等诸多知名项目也都相继选用其作为官方构建工具，极受业内追捧。但是，随者工程开发的复杂程度和代码规模不断地增加，
  webpack暴露出来的各种性能问题也愈发明显，极大的影响着开发过程中的体验

![](https://sfault-image.b0.upaiyun.com/281/059/2810595339-585b9b07eef9a_articlex)

### 历经了多个web项目的实战检验，我们对webapck在构建中逐步暴露出来的性能问题归纳主要有如下几个方面：

1. 代码全量构建速度过慢，即使是很小的改动，也要等待长时间才能查看到更新与编译后的结果（引入HMR热更新后有明显改进）
2. 随着项目业务的复杂度增加，工程模块的体积也会急剧增大，构建后的模块通常要以M为单位计算；
3. 多个项目之间共用基础资源存在重复打包，基础库代码复用率不高；
4. node的单进程实现在耗cpu计算型loader中表现不佳；

> 从项目结构着手，代码组织是否合理，依赖使用是否合理；
  从webpack自身提供的优化手段着手，看看哪些api未做优化配置；
  从webpack自身的不足着手，做有针对性的扩展优化，进一步提升效率；
  
- 在这里我们推荐使用一个wepback的可视化资源分析工具：webpack-bundle-analyzer，
  在webpack构建的时候会自动帮你计算出各个模块在你的项目工程中的依赖与分布情况，方便做更精确的资源依赖和引用的分析。  
  
### 方案一、合理配置 CommonsChunkPlugin

> webpack的资源入口通常是以entry为单元进行编译提取，那么当多entry共存的时候，CommonsChunkPlugin的作用就会发挥出来
  对所有依赖的chunk进行公共部分的提取，但是在这里可能很多人会误认为抽取公共部分指的是能抽取某个代码片段，其实并非如此，它是以module为单位进行提取。
  
1. 假设我们的页面中存在entry1，entry2，entry3三个入口，这些入口中可能都会引用如utils，loadash，fetch等这些通用模块
   那么就可以考虑对这部分的共用部分机提取。通常提取方式有如下四种实现：  
   
##### 1、传入字符串参数，由chunkplugin自动计算提取
```
  new webpack.optimize.CommonsChunkPlugin('common.js')
```
- 这种做法默认会把所有入口节点的公共代码提取出来, 生成一个common.js

##### 2、有选择的提取公共代码
```
  new webpack.optimize.CommonsChunkPlugin('common.js',['entry1','entry2']);
```
- 只提取entry1节点和entry2中的共用部分模块, 生成一个common.js
##### 3、将entry下所有的模块的公共部分（可指定引用次数）提取到一个通用的chunk中
```
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendors',
    minChunks: function (module, count) {
       return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
       )
    }
});
```
- 提取所有node_modules中的模块至vendors中，也可以指定minChunks中的最小引用数；
##### 4、抽取enry中的一些lib抽取到vendors中
```
  entry = {
    vendors: ['fetch', 'loadash']
  };
  new webpack.optimize.CommonsChunkPlugin({
      name: "vendors",
      minChunks: Infinity
  });
```
- 添加一个entry名叫为vendors，并把vendors设置为所需要的资源库，CommonsChunk会自动提取指定库至vendors中。

### 方案二、通过 externals 配置来提取常用库
- 按照官方文档的解释，如果我们想引用一个库，但是又不想让webpack打包，并且又不影响我们在程序中以CMD、AMD或者window/global全局等方式进行使用，那就可   以通过配置externals。这个功能主要是用在创建一个库的时候用的，但是也可以在我们项目开发中充分使用。
  
- 假设：我们开发了一个自己的库，里面引用了lodash这个包，经过webpack打包的时候，发现如果把这个lodash包打入进去，打包文件就会非常大。那么我们就可以     externals的方式引入。也就是说，自己的库本身不打包这个lodash，需要用户环境提供

- 在实际项目开发过程中，我们并不需要实时调试各种库的源码，这时候就可以考虑使用external选项了。

> 简单来说external就是把我们的依赖资源声明为一个外部依赖，然后通过script外链脚本引入。这也是我们早期页面开发中资源引入的一种翻版，只是通过配置后可以   告知webapck遇到此类变量名时就可以不用解析和编译至模块的内部文件中，而改用从外部变量中读取，这样能极大的提升编译速度，同时也能更好的利用CDN来实现     缓存。

- external的配置相对比较简单，只需要完成如下三步：

###### 1、在页面中加入需要引入的lib地址，如下：
```
  <head>
<script src="//cdn.bootcss.com/jquery.min.js"></script>
<script src="//cdn.bootcss.com/underscore.min.js"></script>
<script src="/static/common/react.min.js"></script>
<script src="/static/common/react-dom.js"></script>
<script src="/static/common/react-router.js"></script>
<script src="/static/common/immutable.js"></script>
</head>  
```

###### 2、在webapck.config.js中加入external配置项：
```
  module.export = {
    externals: {
        'react-router': {
            amd: 'react-router',
            root: 'ReactRouter',
            commonjs: 'react-router',
            commonjs2: 'react-router'
        },
        react: {
            amd: 'react',
            root: 'React',
            commonjs: 'react',
            commonjs2: 'react'
        },
        'react-dom': {
            amd: 'react-dom',
            root: 'ReactDOM',
            commonjs: 'react-dom',
            commonjs2: 'react-dom'
        }
    }
}
```
2. loda....
```
  
```

###### 3非常重要的是一定要在output选项中加入如下一句话：
```
  output: {
  libraryTarget: 'umd'
}
```

> 由于通过external提取过的js模块是不会被记录到webapck的chunk信息中，通过libraryTarget可告知我们构建出来的业务模块，当读到了externals中的key时，需   要以umd的方式去获取资源名，否则会有出现找不到module的情况。

### 方案三增强 uglifyPlugin

> uglifyJS凭借基于node开发，压缩比例高，使用方便等诸多优点已经成为了js压缩工具中的首选，但是我们在webpack的构建中观察发现，当webpack build进度走到   80%前后时，会发生很长一段时间的停滞，经测试对比发现这一过程正是uglfiyJS在对我们的output中的bunlde部分进行压缩耗时过长导致，针对这块我们可以使用     webpack-uglify-parallel来提升压缩速度。

###### 从插件源码中可以看到，webpack-uglify-parallel的是实现原理是采用了多核并行压缩的方式来提升我们的压缩速度

使用配置也非常简单，只需要将我们原来webpack中自带的uglifyPlugin配置：

```
  //old
  new webpack.optimize.UglifyJsPlugin({
     exclude:/\.min\.js$/
     mangle:true,
     compress: { warnings: false },
     output: { comments: false }
  })
```
* change

```
   const os = require('os');
    const UglifyJsParallelPlugin = require('webpack-uglify-parallel');
    
    new UglifyJsParallelPlugin({
      workers: os.cpus().length,
      mangle: true,
      compressor: {
        warnings: false,
        drop_console: true,
        drop_debugger: true
       }
    })
```
- 目前webpack官方也维护了一个支持多核压缩的UglifyJs插件：uglifyjs-webpack-plugin,使用方式类似，优势在于完全兼容webpack.optimize.UglifyJsPlugin   中的配置，可以通过uglifyOptions写入，因此也做为推荐使用，参考配置如下：

```
   const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
  new UglifyJsPlugin({
    uglifyOptions: {
      ie8: false,
      ecma: 8,
      mangle: true,
      output: { comments: false },
      compress: { warnings: false }
    },
    sourceMap: false,
    cache: true,
    parallel: os.cpus().length * 2
  })
```

### 四 Tree-shaking & Scope Hoisting

> wepback在2.X和3.X中从rolluo中借鉴了tree-shaking和Scope Hoisting，利用es6的module特性，利用AST对所有引用的模块和方法做了静态分析，从而能有效地   剔除项目中的没有引用到的方法，并将相关方法调用归纳到了独立的webpack_module中，对打包构建的体积优化也较为明显，但是前提是所有的模块写法必须使用ES6   Module进行实现，具体配置参考如下：

```
   // .babelrc: 通过配置减少没有引用到的方法
  {
    "presets": [
      ["env", {
        "targets": {
          "browsers": ["last 2 versions", "safari >= 7"]
        }
      }],
      // https://www.zhihu.com/question/41922432
      ["es2015", {"modules": false}]  // tree-shaking
    ]
  }

  // webpack.config: Scope Hoisting
  {
    plugins:[
      // https://zhuanlan.zhihu.com/p/27980441
      new webpack.optimize.ModuleConcatenationPlugin()
    ]
  }
```

### 适用场景

| 优化手段 | dev | pro |
| ------ | --------| --------- | 
| CommonsChunk  | yes  | yes |
| externals  |  -- |  yes |
| uglify-parallel  | --  | yes  |















  

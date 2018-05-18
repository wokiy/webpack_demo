var webpack = require('webpack');

//混淆压缩
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

//检测重用模块
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

//独立样式文件
var ExtractTextPlugin = require("extract-text-webpack-plugin");

// 在命令行 输入  “PRODUCTION=1 webpack --progress” 就会打包压缩，并且注入md5戳 到 d.html里面
var production = process.env.PRODUCTION;

var plugins = [

   //会将所有的样式文件打包成一个单独的style.css
  new ExtractTextPlugin(production ? "css/[name].css" : "css/[name].css", {
    disable: false
  }),

  //自动分析重用的模块并且打包成单独的文件
  new CommonsChunkPlugin({
    names: ["common"]
  })

];

//发布编译时，压缩，版本控制
if (production) {
  //压缩

  plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {warnings: false } }));
}
                    
// 动态生成模板
var HtmlWebpackPlugin = require("html-webpack-plugin");
var outPath = '../../../WEB-INF/view/financing';
var srcPath = './src/module';
var fileArr = ['index-mobile','sell-mobile'];
var cssArr = ['index','sell'];

for (var i = 0 ;i < fileArr.length; i++) {
    var fileName = fileArr[i];
    plugins.push( new HtmlWebpackPlugin({
      contextPath:"${rc.contextPath}",
      ensure_url:"${ensure_url}",
      Session:"${Session['resUrl']}",
      help_url:"${help_url}",
      card_protocol_url:"${card_protocol_url}",
      insurance_protocol_url:"${insurance_protocol_url}",
      contract_protocol_url:"${contract_protocol_url}",
      isLogin:"${isLogin}",
      phone:"${phone}",
      assign:"<#assign base=basePath />",
      base:'${base}/',
      filename:outPath +'/' + fileName + '.ftl',
      template:srcPath + '/' + fileName + '/' + fileName +'.html',
      //hash:true,
      inject:true,
      chunks: ['common', cssArr[i]]
    }));
}


var path = require('path')
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src/js');

module.exports = {
  entry:{
    index: "./src/module/index-mobile/index-mobile",
    sell: "./src/module/sell-mobile/sell-mobile"
  },
  output: {
    path: '../../webapp/tronkerWeb/finance-mobile/dist/',
    publicPath: "tronkerWeb/finance-mobile/dist/",
    filename: production ? "js/[name].js" : "js/[name].js"
  },
  module: {
    loaders: [{
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  vue: {
    loaders: {
      css: ExtractTextPlugin.extract('vue-style-loader', 'css-loader')
    }
  },
  performance: {
    hints: false
  },
  plugins : plugins,
  devtool: 'source-map'
}

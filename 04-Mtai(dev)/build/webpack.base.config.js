var htmlWebpack = require("html-webpack-plugin");
var path = require("path");
function resolve(dir){
	return path.resolve(__dirname,"..",dir);
}

module.exports={
	entry:{
		Mtai:"./js/index.js"
	},
	output:{
		path:resolve("dist"),
		filename:"[name].js"
	},
	module:{
		rules:[
			{
		      test: /\.js$/,
		      exclude: /(node_modules|bower_components)/,
		      use: {
		        loader: 'babel-loader',
		      }
		    },
			{
		        test: /\.(png|jpg|gif)$/,
		        use: [
		          {
		            loader: 'url-loader',
		            options: {
		              limit: 8192,
		              fallback: 'file-loader'
		            }
		          }
		        ]
		     },
		]
	},
	plugins:[
		new htmlWebpack({
		    template: "tai.html", 
		    filename:"tai.html",
		    inject:true
		  })
	]
}

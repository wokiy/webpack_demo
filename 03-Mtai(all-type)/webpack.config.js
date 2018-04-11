var htmlWebpack = require("html-webpack-plugin");

module.exports={
	entry:"./js/index.js",
	output:{
		path:__dirname+"/dist",
		filename:"index.js"
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
	            test: /\.less$/,
	            use: [{
	                loader: "style-loader" 
	            }, {
	                loader: "css-loader" 
	            }, {
	                loader: "less-loader" 
	            }]
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
			{
			  test: /\.(html)$/,
			  use: {
			    loader: 'html-loader',
			  }
			}
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

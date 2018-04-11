	const merge = require('webpack-merge');
	const baseConf = require('./webpack.base.config');
	const ExtractTextPlugin = require("extract-text-webpack-plugin");
	const CleanWebpackPlugin = require('clean-webpack-plugin');
	const webpack = require('webpack');
	const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
	const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
	var path = require("path");
	function resolve(dir){
		return path.resolve(__dirname,"..",dir);
	}
	
	module.exports = merge(baseConf, {
		entry:{
			vendor:"jquery"
		},
		output:{
			publicPath:'/',
			filename:"static/js/[name][chunkhash:12].js"
		},
	    module: {
	      rules: [
	      	{
		        test: /\.less$/,
		        use: ExtractTextPlugin.extract({
		          fallback: "style-loader",
		          use: ["css-loader","less-loader"]
		        })
		    },
			{
			  test: /\.(html)$/,
			  use: {
			    loader: 'html-loader',
			    options: {minimize: true }
			  }
			},
	    	{
		        test: /\.(png|jpg|gif)$/,
		        use: [
		          {
		            loader: 'image-webpack-loader',
		                    options: {
						          gifsicle: {
						            interlaced: false,
						          },
						          optipng: {
						            optimizationLevel: 7,
						          },
						          pngquant: {
						            quality: '65-90',
						            speed: 4
						          },
						          mozjpeg: {
						            progressive: true,
						            quality: 65
						          },
						          webp: {
						            quality: 75
						          }
						        }
					}
		        ]
		     },
	      ]
	    },
	    plugins: [
		   new ExtractTextPlugin("static/css/app[contenthash:12].css"),
		   new CleanWebpackPlugin(["dist"], {
		    		root:resolve(""),
		   	}),
		   	new webpack.optimize.CommonsChunkPlugin({
		   		name: "vendor"
		  	 }),
		   	new webpack.optimize.CommonsChunkPlugin({
		   		name: "runtime"
		  	 }),
		  	 new UglifyJsPlugin(),
			 new OptimizeCssAssetsPlugin(),
			 new webpack.HashedModuleIdsPlugin()
		  ]
  });
	
	
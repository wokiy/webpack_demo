	var merge = require('webpack-merge');
	var baseConf = require('./webpack.base.config');
	
	module.exports = merge(baseConf, {
		devtool:"inline-source-map",
	    module: {
	      rules: [
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
			  test: /\.(html)$/,
			  use: {
			    loader: 'html-loader',
			  }
			}
	      ]
	    }
  });
	
	
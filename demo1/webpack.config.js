// //webpack基本配置信息
// module.exports = {
//     //入口位置
//     entry: './src/index.js',
//     //输出目录位置
//     output: './dist/mian.js',
//     mode: 'production',
//     module: {
//         //配置loader
//         rule:[
//             {
//                 //正则匹配需要loader解析的模块文件
//                 test: /\.txt$/,
//                 //use使用相对匹配的loader
//                 use: 'raw-loader'
//             }
//         ]
//     },
//     plugins:[
//         //配置插件
//         new HtmlWebpackPlugins({
//             template: ' ./src/index.html'
//         })
//     ]    
// };

const path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname,'dist'),
        filename: 'bundle.js'
    },
    mode: 'production'
}
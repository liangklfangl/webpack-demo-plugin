const MyPlugin=require('./plugins/MyPlugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MyPlugin1=require('./plugins/MyPlugin1');
module.exports = {  
    entry: './index.js',  
    output: {  
        publicPath: "",  
        // filename: 'bundle.js'  
    },  filename: '[name].[chunkhash:8].js',
  
    module: {  
        loaders: [  
            {  
                test: /\.js$/,  
                exclude: /node_modules/,  
                loader: 'babel-loader?presets[]=es2015&presets[]=react'  
            }  ,
             { test: /\.css$/, loader: ExtractTextPlugin.extract({
                fallbackLoader: "style-loader",
                loader: "css-loader"
            }) }
        ]  
    },
    plugins:[
        new MyPlugin({options: true}),
        new MyPlugin1({options: true}),
        new ExtractTextPlugin("index.css")
    ]
};  
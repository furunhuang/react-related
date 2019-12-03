const path=require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');



module.exports={
    mode:'development',
    entry: {
        index: path.join(__dirname,'src/index.js'),
    },
    output: {
        path: path.join(__dirname,'dist'),
        filename:'[name].[hash:4].js'
    },
    module: {
        rules:[
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options:{
                     "presets": ["@babel/preset-env","@babel/preset-react"],
                     "plugins": [
                        ["@babel/plugin-proposal-decorators", { "legacy": true }],
                        ["@babel/plugin-proposal-class-properties", { "loose" : true }]
                     ]
                    }
                },
                include: [path.join(__dirname,'src'),path.join(__dirname,'vendors')],
                exclude:/node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public/index.html'),
            hash:true,

        }),
        new CleanWebpackPlugin()
    ],
    devServer: {
        contentBase:path.join(__dirname,'dist'),
        host:'localhost',
        compress:true,
        port:8080
    }
}
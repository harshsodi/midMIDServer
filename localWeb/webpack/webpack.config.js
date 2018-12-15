var webpack = require('webpack');
var path = require('path');

var parentDir = path.join(__dirname, '../');

module.exports = {
    entry: [
        path.join(parentDir, 'index.js')
    ],

    module: {
        rules: [{
            test: /\.js$/, // include .js files
            exclude: /node_modules/, // exclude any and all files in the node_modules folder
            use: [{
                loader: "babel-loader",
                // more options in the optional jshint object
            }]
        }, {
            test: /\.css$/, // include .js files
            use: [{
                loader: "css-loader",
                // more options in the optional jshint object
            }]
        }]
      },

    output: {
        path: path.join(parentDir, 'public'),
        filename: 'local_client.js'
    },

    devServer: {
        contentBase: parentDir,
        historyApiFallback: true
    }
}
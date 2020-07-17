const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { SourceMapDevToolPlugin } = require("webpack");

module.exports = {
    entry: ['babel-polyfill', './src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: ('./dist'),
        compress: true,
        port: 9000
    },
    plugins: [
        new HtmlWebpackPlugin({
                filename: 'index.html',
                template: './src/index.html'
            }
        ),
        // new SourceMapDevToolPlugin({
        //     filename: "[file].map"
        // }),
    ],
    watch: true,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: {
                    // ['source-map-loader'],
                    loader: 'babel-loader'
                },
            },
        ],
    },
}


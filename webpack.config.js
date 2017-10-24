const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './client/index.html',
    filename: 'index.html',
    inject: 'body'
})

module.exports = {
    entry: './client/index.js',
    output: {
    path: path.resolve('public'),
    filename: 'index_bundle.js'
    },
    module: {
    loaders: [
        { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
        { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
        { test: /\.css$/, loader: "style-loader!css-loader"},
        { test: /\.(pdf|jpg|png|gif|svg|ico|woff|ttf|woff2|eot|mp3)$/,loader: 'url-loader'}
    ]
    },
    resolve: {
    extensions: ['.js', '.jsx']
    },
    plugins: [HtmlWebpackPluginConfig]
}
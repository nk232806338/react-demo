var path = require("path");
var webpack = require('webpack');
module.exports = {
  entry: {
    demo: './test/main-test.js',
    demo_vendor: ['./test/utils/jquery.js'],
    main: './main.jsx',
    vendor: ['react', 'react-dom', 'underscore', 'moment'],
  },
  output: {
    path: path.join(__dirname, "built"),
    filename: "[name].js",
    publicPath: 'http://120.25.152.191:8080/',
  },
  resolve: {
    modulesDirectories: [ 'node_modules' ],
    extensions: ['', '.js', '.jsx']
  },
  devtool: 'cheap-module-source-map',
  module: {
    loaders: [
      {
        test: /\.jsx|js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      },
      {
        test: /\.png$/,
        loader: "url-loader?limit=5000&name=img/[name].[ext]",
        query: 'random=' + new Date().getTime(),
      }
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename:"vendor.js",
      chunks: ['main'],
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "demo_vendor",
      filename:"demo_vendor.js",
      chunks: ['demo'],
      minChunks: 100
    }),
  ]
};
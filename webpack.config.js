var path = require("path");
var webpack = require('webpack');
module.exports = {
  entry: {
    main: './main.jsx',
    vendor: ['react'],
  },
  output: {
    path: path.join(__dirname, "built"),
    filename: "[name].js",
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
      }
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename:"vendor.js",
      minChunks: Infinity
    }),
  ]
};
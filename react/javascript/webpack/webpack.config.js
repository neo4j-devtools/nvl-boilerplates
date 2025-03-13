const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = () => ({
  mode: 'none',
  entry: './src/index.jsx',
  module: {
    rules: [{
      test: /\.jsx$/,
      exclude: /node_modules|dist/,
      use: 'babel-loader'
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ]
})

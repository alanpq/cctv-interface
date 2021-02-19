const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  name: 'client',
  entry: './src/client/style/style.scss',
  target: 'web',
  output: {
    path: __dirname + '/build/client',
    filename: '[name].scss'
  },
  module: {
    rules: [
    {
      test: /\.s[ac]ss$/i,
      use: [
      // Creates `style` nodes from JS strings
      "style-loader",
      // Translates CSS into CommonJS
      "css-loader",
      // Compiles Sass to CSS
      "sass-loader",
      ],
    },
    ],
  },
  plugins: [
    new ExtractTextPlugin('[name].css')
  ]
};
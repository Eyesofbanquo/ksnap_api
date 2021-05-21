const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    mode: 'production',
    target: 'node',
  entry: path.resolve(__dirname, './src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  resolve: {
      extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  plugins: [
      new NodePolyfillPlugin({excludeAliases: ['console']}),
    new CopyWebpackPlugin({
        patterns: [{from: './src/pages', to: 'pages'}, {from: './src/styles', to: 'styles'}]
    }),
  ]
};

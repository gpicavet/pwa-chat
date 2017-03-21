var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var wpconfig = {
  devtool : 'source-map',
  entry: {
    bundle:'./frontend/App.jsx',
    'vendor-bundle': [
      'react',
      'react-dom',
      'moment'
    ]
  },

  output: {
      path: path.join(__dirname, 'static/js'),
	    filename: 'bundle.js'},

  module: {
    loaders: [
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-0']
        }
      },
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      }
    ]
  },
  plugins:[
    new CopyWebpackPlugin([
                // {output}/file.txt
                { from: 'frontend/index.html', to: path.join(__dirname, '/static') }
              ]),


    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor-bundle',
      filename: 'vendor-bundle.js',
      minChunks: Infinity
    })
  ]

};

module.exports = wpconfig;

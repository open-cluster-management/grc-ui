/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

const path = require('path'),
      webpack = require('webpack'),
      UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
      AssetsPlugin = require('assets-webpack-plugin'),
      WebpackMd5Hash = require('webpack-md5-hash'),
      CompressionPlugin = require('compression-webpack-plugin')

const NO_OP = () => { },
      PRODUCTION = process.env.BUILD_ENV ? /production/.test(process.env.BUILD_ENV) : false

process.env.BABEL_ENV = 'client'

module.exports = {
  entry: {
    'vendorhcm': [
      'carbon-components-react',
      'd3',
      'loadable-components',
      'lodash',
      'moment',
      'normalizr',
      'prop-types',
      'react-d3-radar',
      'react-dom',
      'react-dom/server',
      'react-redux',
      'react-router-dom',
      'react',
      'redux-logger',
      'redux-thunk',
      'redux',
      'reselect',
      'svg.js',
      'svg-loader'
    ]
  },
  output: {
    path: __dirname + '/public',
    filename: PRODUCTION ? 'dll.[name].[chunkhash].js' : 'dll.[name].js',
    library: '[name]'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(PRODUCTION ? 'production' : 'development')
      }
    }),
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dll', '[name]-manifest.json'),
      name: '[name]',
      context: __dirname
    }),
    PRODUCTION ? new UglifyJSPlugin({
      sourceMap: true
    }) : NO_OP,
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
    }),
    new AssetsPlugin({
      path: path.join(__dirname, 'public'),
      fullPath: false,
      prettyPrint: true,
      update: true
    }),
    PRODUCTION ? new webpack.HashedModuleIdsPlugin() : new webpack.NamedModulesPlugin(),
    new WebpackMd5Hash()
  ],
  resolve: {
    modules: [path.join(__dirname, 'node_modules')]
  }
}

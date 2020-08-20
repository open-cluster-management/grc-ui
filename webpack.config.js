/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
const config = require('./config'),
      path = require('path'),
      webpack = require('webpack'),
      AssetsPlugin = require('assets-webpack-plugin'),
      CompressionPlugin = require('compression-webpack-plugin'),
      FileManagerPlugin = require('filemanager-webpack-plugin-fixed'),
      MiniCssExtractPlugin = require('mini-css-extract-plugin'),
      MonacoWebpackPlugin = require('monaco-editor-webpack-plugin'),
      TerserPlugin = require('terser-webpack-plugin'),
      WebpackMd5Hash = require('webpack-md5-hash')

const noOP = () => { /*This is intentional*/},
      PRODUCTION = process.env.BUILD_ENV ? /production/.test(process.env.BUILD_ENV) : false

process.env.BABEL_ENV = process.env.BABEL_ENV ? process.env.BABEL_ENV : 'client'

const prodExternals = {}

const overpassTest = /overpass-.*\.(woff2?|ttf|eot|otf)(\?.*$|$)/

module.exports = {
  context: __dirname,
  devtool: PRODUCTION ? 'source-map' : 'cheap-module-source-map',
  stats: {
    children: false,
    warningsFilter: [/Failed to parse source map/],
  },
  entry: {
    'main': ['@babel/polyfill', './src-web/index.js']
  },

  externals: Object.assign(PRODUCTION ? prodExternals : {}, {
    // replace require-server with empty function on client
    './require-server': 'var function(){}'
  }),

  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          quiet: true
        }
      },
      {
        // Transpile React JSX to ES5
        test: [/\.jsx$/, /\.js$/],
        exclude: /node_modules|\.scss/,
        loader: 'babel-loader?cacheDirectory',
        query: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: ['@babel/plugin-proposal-class-properties']
        }
      },
      {
        test: [/\.s?css$/],
        exclude: /node_modules\/(?!(@patternfly)\/).*/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader?sourceMap',
            options: {
              plugins: function () {
                return [
                  require('autoprefixer')
                ]
              },
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader?sourceMap',
            options: {
              prependData: '$font-path: "'+ config.get('contextPath') + '/fonts";'
            },
          },
        ],
      },
      {
        test: /\.woff2?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, './node_modules/monaco-editor'),
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.properties$/,
        loader: 'properties-loader'
      },

      {
        test: [/\.handlebars$/, /\.hbs$/],
        loader: 'handlebars-loader',
      },
      {
        test: /\.yaml$/,
        loader: 'js-yaml-loader',
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff2?|ttf|eot|otf)(\?.*$|$)/,
        exclude: overpassTest,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]',
        },
      },
      {
        // Resolve to an empty module for overpass fonts included in SASS files.
        // This way file-loader won't parse them. Make sure this is BELOW the
        // file-loader rule.
        test: overpassTest,
        loader: 'null-loader',
      },
    ],
    noParse: [
      // don't parse minified bundles (vendor libs) for faster builds
      /\.min\.js$/
    ]
  },

  output: {
    //needs to be hash for production (vs chunckhash) in order to cache bust references to chunks
    filename: PRODUCTION ? 'js/[name].[hash].min.js' : 'js/[name].min.js',
    chunkFilename: PRODUCTION ? 'js/[name].[chunkhash].min.js' : 'js/[name].min.js',
    path: __dirname + '/public',
    publicPath: config.get('contextPath').replace(/\/?$/, '/'),
    jsonpFunction: 'webpackJsonpFunctionGrc',
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(PRODUCTION ? 'production' : 'development'),
      },
      CONSOLE_CONTEXT_URL: JSON.stringify(config.get('contextPath'))
    }),
    new webpack.DllReferencePlugin({
      context: process.env.STORYBOOK ? path.join(__dirname, '..') : __dirname,
      // eslint-disable-next-line import/no-unresolved
      manifest: require('./dll/vendorhcm-manifest.json'),
    }),
    new MiniCssExtractPlugin({
      filename: PRODUCTION ? 'css/[name].[contenthash].css' : 'css/[name].css',
      allChunks: true
    }),
    PRODUCTION ? new TerserPlugin({
      sourceMap: true
    }) : noOP,
    new webpack.LoaderOptionsPlugin({
      options: {
        eslint: {
          configFile: './.eslintrc.json',
          quiet: true
        }
      }
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname
      }
    }),
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$/,
      minRatio: 1,
    }),
    new MonacoWebpackPlugin({
      languages: ['yaml'],
    }),
    new AssetsPlugin({
      path: path.join(__dirname, 'public'),
      fullPath: false,
      prettyPrint: true,
      update: true
    }),
    PRODUCTION ? new webpack.HashedModuleIdsPlugin() : new webpack.NamedModulesPlugin(),
    new WebpackMd5Hash(),
    new FileManagerPlugin({
      onEnd: {
        copy: [
          { source: 'node_modules/carbon-icons/dist/carbon-icons.svg', destination: 'public/graphics' },
          { source: 'graphics/*.svg', destination: 'public/graphics'},
          { source: 'graphics/*.png', destination: 'public/graphics'},
          { source: 'fonts', destination: 'public/fonts' },
        ]
      }
    })
  ],

  resolve: {
    alias: {
      handlebars: 'handlebars/dist/handlebars.min.js'
    }
  },

  resolveLoader: {
    modules: [
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'node_modules/node-i18n-util/lib') // properties-loader
    ]
  }
}

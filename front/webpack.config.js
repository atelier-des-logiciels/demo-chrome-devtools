/* eslint-env node */
const path = require('path');
const { compact } = require('ramda-adjunct');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const context = path.resolve(__dirname, 'src');
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

const htmlPluginConfig = new HtmlWebpackPlugin({
  template: './index.html',
  filename: 'index.html',
  inject: 'body'
});

const definePluginConfig = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
})

const hotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin();

const namedModulesPluginConfig = new webpack.NamedModulesPlugin();

const distFolder = path.join(__dirname, '../dist/front');

module.exports = {
    devtool: isDevelopment ? 'eval-source-map' : 'source-map',
    context,
    mode: isProduction ? 'production' : 'development',
    optimization: {
      minimize: isProduction,
      splitChunks: {
        cacheGroups: {
          commons: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all"
          },
        },
      },
    },
    performance: {
      hints: false
    },
    entry: {
      app: './index.jsx',
    },
    output: {
       path: distFolder,
       publicPath: '/',
       filename: '[name].bundle.js',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.css'],
      modules: ['node_modules']
    },
    devServer: {
      historyApiFallback: true,
      hot: true,
      proxy: {
        '/api': 'http://localhost:3000'
      },
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        }
      ]
    },
    plugins: compact([
      htmlPluginConfig,
      definePluginConfig,
      isProduction ? new webpack.optimize.ModuleConcatenationPlugin() : undefined,
      isDevelopment ? new webpack.NoEmitOnErrorsPlugin() : undefined,
      isDevelopment ? namedModulesPluginConfig : undefined,
      isDevelopment ? hotModuleReplacementPlugin : undefined,
    ])
 };

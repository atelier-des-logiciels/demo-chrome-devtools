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


const hotModuleReplacementPluginConfig = new webpack.HotModuleReplacementPlugin();

const namedModulesPluginConfig = new webpack.NamedModulesPlugin();

const distFolder = path.join(__dirname, './dist');

module.exports = {
    devtool: isDevelopment ? 'eval-source-map' : 'source-map',
    context,
    mode: process.env.NODE_ENV,
    optimization: {
      minimize: isProduction,
    },
    performance: {
      hints: false
    },
    entry: [
      './index.js',
    ],
    output: {
       path: distFolder,
       publicPath: '/',
       filename: 'app.bundle.js',
    },
    resolve: {
      modules: ['node_modules']
    },
    devServer: {
      historyApiFallback: true,
      hot: true,
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
      isDevelopment ? hotModuleReplacementPluginConfig : undefined,
    ])
 };

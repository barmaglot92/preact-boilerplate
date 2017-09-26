const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const DashboardPlugin = require('webpack-dashboard/plugin')

const PROD = process.env.NODE_ENV === 'production'
const baseUrl = '/'
const outputDir = path.join(__dirname, './dist')
const sourcePath = path.join(__dirname, './src')

const plugins = [
  new CaseSensitivePathsPlugin(),
  new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/([^.*])$/),
  new webpack.optimize.CommonsChunkPlugin({
    name: ['common'],
  }),
  new HtmlWebpackPlugin({
    template: './index.html',
    favicon: './assets/favicon.png',
    inject: false,
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
]

if (PROD) {
  plugins.push(
    new SWPrecacheWebpackPlugin({
      cacheId: 'CONSOLE',
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'service-worker.js',
      minify: true,
      navigateFallback: '/index.html',
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
      maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
    })
  )
  console.log('Building production')
} else {
  const OpenBrowserPlugin = require('open-browser-webpack-plugin')
  plugins.push(
    // new DashboardPlugin(),
    new BundleAnalyzerPlugin(),
    new OpenBrowserPlugin({ url: 'http://localhost:9005' })
  )
}

module.exports = {
  context: sourcePath,
  entry: {
    app: './index.tsx',
    common: ['preact', 'mobx', 'mobx-preact']
  },
  devtool: 'eval',
  output: {
    path: path.resolve(__dirname, outputDir),
    publicPath: baseUrl,
    filename: '[name].js?[hash]',
  },
  resolve: {
    // alias: {
    //   react: 'preact-compat',
    //   'react-dom': 'preact-compat',
    // },
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    modules: [path.resolve(__dirname, 'node_modules'), sourcePath],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
      },
      {
        test: /\.(png|gif|jpg)$/,
        use: 'file-loader?name=autoimages/[hash].[ext]',
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9?=.]+)?$/,
        use: 'file-loader?name=fonts/[hash].[ext]',
      },
    ],
  },
  plugins: plugins,
}

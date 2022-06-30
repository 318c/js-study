require('dotenv').config();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

console.log('================================================================================================');
console.log("PROCESS_ENV : ", process.env);
console.log('================================================================================================');

const devServer = {
  static: {
    directory: path.resolve(__dirname, 'dist')
  },
  https: false,
  client: {
    progress: true,
    logging: 'log',
  },
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 5000,
}

const webpackConfig = (env, argv) => {
  const config = {
    entry: {
      app: path.resolve(__dirname, 'src/app.js'),
    },
    output: {
      filename: 'js/[name].[chunkhash].js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        //babel
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: ['lodash', 'angularjs-annotate'],
              presets: [
                [
                  '@babel/preset-env', {
                    'targets': { 'node': 6 },
                    'modules': false,
                    'useBuiltIns': 'usage',
                    'corejs': 3
                  }
                ]
              ]
            }
          }
        },

        //sass
        {
          test: /\.s[ac]ss$/i,
          use: [
            'style-loader',
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { minimize: true } },
            // Compiles Sass to CSS

            { loader: 'sass-loader', options: { implementation: require('sass') } }
          ],
        },

        //image
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        //font
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ]
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
        parallel: 4,
        terserOptions: {
          mangle: true,
          ie8: false
        },
        extractComments: false
      })],
      chunkIds: 'named',
      moduleIds: 'named',
      usedExports: true,
      splitChunks: {
        chunks: "all",
        minSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        automaticNameDelimiter: '~',
        name(module, chunks, cacheGroupKey) {
          const moduleFileName = module
            .identifier()
            .split('/')
            .reduceRight((item) => item);
          const allChunksNames = chunks.map((item) => item.name).join('~');
          return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
        },
        cacheGroups: {
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10
            },
            default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
            }
        }
      }
    },
    watchOptions: {
      ignored: '**/node_modules',
      aggregateTimeout: 300,
      poll: 1000,
    },
    plugins: [
      new webpack.ProvidePlugin({ /* for bootstrap & jquery */
        '_': 'lodash',
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery',
      }),

      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, 'src/index.html')
      }),

      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          '**/*.js',
          path.resolve(__dirname, 'dist')
        ]
      }),

      new webpack.BannerPlugin({
        banner:
          'fullhash:[fullhash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]',
      }),

      new webpack.EnvironmentPlugin({
        'KEEP_ALIVE_INTERVAL': 10,
        'AUTO_LOGOUT_TIMEOUT': 600,
        'DEBUG': false
      }),

      new WebpackManifestPlugin({
        fileName: 'manifest.json',
        basePath: '/'
      }),

      new MiniCssExtractPlugin({
        filename: '[name].[chunkhash].css',
        chunkFilename: '[name].[id].[chunkhash].css'
      }),

      new BundleAnalyzerPlugin()
    ],
  }

  console.log('ENV: ', argv);
  console.log('================================================================================================');
  if (env && argv.mode == 'development') {
    console.log('run mode "Development".');
    config.devServer = devServer;
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin()
    );
    config.devtool = 'source-map';
  }
  else {
    config.devtool = 'inline-source-map';
  }

  return config;
}

module.exports = webpackConfig;
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require("terser-webpack-plugin");

const isProd = process.env.NODE_ENV === 'production';

let target = 'web';
if (process.env.NODE_ENV === 'production') {
  target = 'browserslist';
}

let pluginList = [];
if (!isProd) {
  const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

  pluginList.push(new ReactRefreshWebpackPlugin());
}

pluginList.push(
  new HtmlWebpackPlugin({
    template: './src/index.html',
  }),
);

pluginList.push(
  new MiniCssExtractPlugin({
    filename: isProd ? '[name].[hash].css' : '[name].css',
    chunkFilename: isProd ? '[id].[hash].css' : '[id].css'
  }),
)

module.exports = {
  devtool: isProd ? false : 'source-map',
  plugins: pluginList,
  entry: './src/index.tsx',
  target,
  output: {
    path: path.resolve(__dirname, 'build'),
    clean: true,
    filename: isProd ? '[name].[chunkhash].js' : '[name].bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      "@/types": path.resolve(__dirname, 'src/types'),
      "@/hooks": path.resolve(__dirname, 'src/hooks'),
      "@/styles": path.resolve(__dirname, 'src/styles'),
      "@/recoil": path.resolve(__dirname, 'src/recoil'),
    },
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    static: './build',

    proxy: {
      '/api': 'http://localhost:8000',
      '/cms/media': 'http://localhost:8002',
      '/cms': 'http://localhost:8001',
      '/metrics': 'http://localhost:8003',
    },
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          maxSize: 200000,
        },
      },
    },
    runtimeChunk: {
      name: 'manifest',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['@babel/typescript', '@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/proposal-class-properties', '@babel/proposal-object-rest-spread'],
          },
        },
      },

      {
        test: /\.css$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader"
        ],
        exclude: /\.module\.css$/,
      },

      {
        test: /\.module\.s[ac]ss$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: isProd ? '[hash:base64:10]' : '[name]-[local]--[hash:base64:5]',
              },
              sourceMap: !isProd,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: !isProd,
            }
          }
        ],
      },
      {
        test: /\.s[ac]ss$/,
        exclude: /\.module\.s[ac]ss$/,
        use: [
          !isProd ? MiniCssExtractPlugin.loader : "style-loader",
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProd
            }
          }
        ]
      },

      {
        test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
};

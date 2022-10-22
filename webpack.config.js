const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

const plugins = [];
if (!isProd) {
  const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

  plugins.push(new ReactRefreshWebpackPlugin());
}

plugins.push(
  new HtmlWebpackPlugin({
    template: './src/index.html',
  }),
);

plugins.push(
  new MiniCssExtractPlugin({
    filename: isProd ? '[name].[hash].css' : '[name].css',
    chunkFilename: isProd ? '[id].[hash].css' : '[id].css',
  }),
);

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'source-map',
  plugins: plugins,
  entry: './src/index.tsx',
  target: isProd ? 'browserslist' : 'web',
  output: {
    path: path.resolve(__dirname, 'build'),
    clean: true,
    filename: isProd ? '[name].[chunkhash].js' : '[name].bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/styles': path.resolve(__dirname, 'src/styles'),
      '@/recoil': path.resolve(__dirname, 'src/recoil'),
    },
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    static: './build',
  },
  optimization: {
    minimize: isProd,
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
            plugins: [
              !isProd && 'react-refresh/babel',
            ].filter(Boolean),
          },
        },
      },

      {
        test: /\.css$/,
        use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
        exclude: /\.module\.css$/,
      },

      {
        test: /\.module\.s[ac]ss$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: isProd ? '[hash:base64:10]' : '[name]-[local]--[hash:base64:5]',
              },
              sourceMap: !isProd,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProd,
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/,
        exclude: /\.module\.s[ac]ss$/,
        use: [
          !isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProd,
            },
          },
        ],
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

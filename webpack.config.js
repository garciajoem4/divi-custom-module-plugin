const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: {
      'builder-bundle': './includes/modules/index.js',
      'frontend-bundle': './includes/frontend.js'
    },
    output: {
      path: path.resolve(__dirname, 'scripts'),
      filename: isProduction ? '[name].min.js' : '[name].js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 11']
                  }
                }],
                ['@babel/preset-react', {
                  runtime: 'automatic'
                }]
              ]
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.scss$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.css', '.scss']
    },
    plugins: [
      ...(isProduction ? [
        new MiniCssExtractPlugin({
          filename: '../styles/[name].min.css'
        })
      ] : [])
    ],
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true
            }
          }
        })
      ]
    },
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      '@wordpress/element': 'wp.element',
      '@wordpress/components': 'wp.components'
    },
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'source-map'
  };
};

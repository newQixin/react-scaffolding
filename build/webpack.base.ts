import {Configuration, webpack, DefinePlugin} from 'webpack';
import HtmLWebpackPlugin from 'html-webpack-plugin';
const path = require('path');

const baseConfig: Configuration = {
  entry: path.join(__dirname, '../src/index.tsx'),
  output: {
    filename: 'static/js/[name].js',
    path: path.join(__dirname, '../dist'),
    clean: true,
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /.(ts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: { browsers: ["> 1%", "last 2 versions", "not ie <= 8"] },
                    useBuiltIns: "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
                    corejs: 3, // 配置使用core-js使用的版本
                    loose: true,
                }
              ],
              [
                "@babel/preset-react", {runtime: 'automatic'}
              ],
              "@babel/preset-typescript"
            ]
          }
        }
      },
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
    
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      "@": path.join(__dirname, "../src")
    },
  },

  plugins: [
    new HtmLWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, "../public/index.html"),
      inject: true,
      hash: true,
      cache: false,
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true, // 在脚本元素和事件属性中缩小JavaScript(使用UglifyJS)
        minifyCSS: true, // 缩小CSS样式元素和样式属性
      },
      nodeModules: path.resolve(__dirname, "../node_modules"),
    }),
    new DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ]
}

export default baseConfig;
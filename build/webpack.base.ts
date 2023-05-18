import {Configuration, webpack, DefinePlugin} from 'webpack';
import HtmLWebpackPlugin from 'html-webpack-plugin';
import WebpackBar from 'webpackbar';;
import MinicssExyractPlugin from 'mini-css-extract-plugin'
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const path = require('path')


const cssRegex = /\.css$/;
const lessRegex = /\.less$/;
const stylusRegex = /\.styl$/;

const styleLoadersArray = [
  MinicssExyractPlugin.loader,
  {
    loader: "css-loader",
    options: {
      modules: {
        localIdentName: "[path][name]__[local]==[hash:5]"
      }
    }
  }
]

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
        exclude: /node_modules/,
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
        test: cssRegex,
        use: styleLoadersArray,
        exclude: /node_modules/,

      },
      {
        test: lessRegex,
        exclude: /node_modules/,

        use: [
          ...styleLoadersArray,
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modules: true,
              },
            }
          }
        ]
      },
      {
        test: stylusRegex,
        exclude: /node_modules/,

        use: [
          ...styleLoadersArray,
          'stylus-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        exclude: /node_modules/,

        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 20*1024,
          }
        },
        generator: {
          filename: 'static/images/[hash][ext][query]'
        }
      },
      {
        test:/.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        exclude: /node_modules/,

        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64
          }
        },
        generator:{ 
          filename:'static/fonts/[hash][ext][query]', // 文件输出目录和命名
        },
      },
      {
        test:/.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        exclude: /node_modules/,

        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64
          }
        },
        generator:{ 
          filename:'static/media/[hash][ext][query]', // 文件输出目录和命名
        },
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,

        type: "asset/resource", // 将json文件视为文件类型
        generator: {
          // 这里专门针对json文件的处理
          filename: "static/json/[name].[hash][ext][query]",
        } 
      }
    ]
    
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      "@": path.join(__dirname, "../src")
    },
  },
  cache: {
    type: 'filesystem', // 使用文件缓存
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
    }),
    new WebpackBar({
      color: '#85d',
      basic: false,
      profile: false,
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages:['项目启动地址: http://127.0.0.1:8082']
      }
    }),
    new MinicssExyractPlugin({
      filename: 'static/css/[name].css' // 抽离css的输出目录和名称
    }),
    
  ]
}

export default baseConfig;
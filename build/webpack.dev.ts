import path from "path";
import {merge} from 'webpack-merge';
import {Configuration as WebpackConfiguration} from 'webpack';
import {Configuration as webDevConfiguration} from 'webpack-dev-server';
import baseConfig from "./webpack.base";

interface Configuration extends WebpackConfiguration {
  devServe?: webDevConfiguration
};

const host = '127.0.0.1';
const port = '8082';

const devConfig: Configuration = merge(baseConfig, {
  mode: 'development',
  stats: 'errors-only',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    host,
    port,
    open: true,
    compress: false,
    hot: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, '../public') // 访问public静态资源
    },
    headers: {"Access-Control-Allow-Origin": "*" },
  }
})

export default devConfig;
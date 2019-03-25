const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const OpenBrowserPlugin = require("open-browser-webpack-plugin");
const autoprefixer = require("autoprefixer");
const precss = require("precss");

const baseConfig = require("./webpack.base.js");
const config = require("./config");
const port = config.port;

module.exports = function(env) {
  console.log(`
#################################################
  Server is listening at: http://localhost:${config.port} 
#################################################
	`);
  return webpackMerge(baseConfig(env), {
    entry: [
      "react-hot-loader/patch",
      "webpack-dev-server/client?http://localhost:" + port,
      "webpack/hot/only-dev-server",
      path.resolve(__dirname, "../src/main.js")
    ],
    devtool: "cheap-module-source-map",
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new OpenBrowserPlugin({ url: "http://localhost:" + port }),
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss() {
            return [precss, autoprefixer];
          }
        }
      })
    ],
    devServer: {
      hot: true,
      port: config.port,
      historyApiFallback: true,
      proxy: {
        "/student/login": "http://192.168.2.17:7001",
        "/student/info": "http://192.168.2.17:7001",
        "/exam/unstart": "http://192.168.2.17:7001",
        "/exam/exam": "http://192.168.2.17:7001",
        "/exam/student": "http://192.168.2.17:7001"
      }
      // proxy:{
      //   '/api':{
      //     target:'http://192.168.2.17:7001',
      //     pathRewrite:true
      //   }
      // }
    }
  });
};

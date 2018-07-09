const resolve = require("path").resolve;
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const url = require("url");
const publicPath = "";

module.exports = (options = {}) => ({
  entry: {
    vendor: "./src/vendor.js",
    index: "./src/index.js"
  },
  output: {
    path: resolve(__dirname, "CSSH5"),
    filename: options.dev ? "[name].js" : "[name].js?[chunkhash]",
    chunkFilename: "[id].js?[chunkhash]",
    publicPath: options.dev ? "/assets/" : publicPath
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ["vue-loader"]
      },
      {
        test: /\.js$/,
        use: ["babel-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              // 如果没有options这个选项将会报错 No PostCSS Config found
              plugins: loader => [
                require("autoprefixer")() //CSS浏览器兼容
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ["vendor", "manifest"]
    }),
    new HtmlWebpackPlugin({
      template: "src/index.html",
      projectPath: options.dev ? "/assets/" : publicPath
    }),
    new webpack.DefinePlugin({
      PRODUCTION: options.prod ? true : false,
      DEVELOPMENT: options.dev ? true : false,
      CI: options.ci ? true : false
    })
  ],
  resolve: {
    alias: {
      "~": resolve(__dirname, "src")
    }
  },
  devServer: {
    host: "127.0.0.1",
    port: 8001,
    proxy: {
      "/CSS": {
//   target: "http://css.sit.sf-express.com:40063", //测试接口地址
           target: "http://css.sf-express.com/CSS/ASRAutomaticService.pub",   //生产接口
//      target: "http://10.118.12.139:8083", 			//本地接口
      // "/automatic": {
      //   target: "http://10.118.12.90:8083/css/css",
        changeOrigin: true
      }
    },
    historyApiFallback: {
      index: url.parse(options.dev ? "/assets/" : publicPath).pathname
    }
  },
  devtool: options.dev ? "#eval-source-map" : false
});

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader/dist/index')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') 
module.exports = {
  mode: "development", //开发模式
  entry: path.resolve(__dirname, './src/main.js'), //打包的入口
  output: {
    path: path.resolve(__dirname, 'dist'),//打包的出口
    filename: 'js/[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'), //要使用的html模板地址
      filename: 'index.html',
      title: '手搭webpack环境'
    }),

    new VueLoaderPlugin(), //让webpack能编译vue语法
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      { test: /\.vue$/, use: ['vue-loader'] }, //让webpack能识别.vue文件
      {
        test: /\.css$/,
        use: ['style-loader','css-loader'] //从右往左加载，css-loader 打包css，style-loader把打包后的css添加到html
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // 不编译node_modules文件
        use: 'babel-loader'

      }
    ]
  },
  devServer: { //将dist文件运行成服务
    port: 8080,
    open: true
  }
}
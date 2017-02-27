let path = require('path');
let webpack = require('webpack');
/*
 extract-text-webpack-plugin插件，
 有了它就可以将你的样式提取到单独的css文件里
 */
let ExtractTextPlugin = require('extract-text-webpack-plugin');
/*
 html-webpack-plugin插件，webpack中生成HTML的插件，
 具体可以去这里查看https://www.npmjs.com/package/html-webpack-plugin
 */
let HtmlWebpackPlugin = require('html-webpack-plugin');
/*
 一个根据模式匹配获取文件列表的node模块。
 有关glob的详细用法可以在这里看到——https://github.com/isaacs/node-glob
 */
let glob = require('glob');
/*
 webpack插件
 */
let CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
let UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
//debug标示
import {CONFIG as projectConfig} from './src/js/lib/config';
let publicPath;
if (projectConfig.localEnv) {//如果是本地测试环境
    publicPath = '/dist/';
} else if (projectConfig.debugger) { //如果打包到测试环境
    publicPath = 'http://mdev.zhaoyl.com/activity/20170112/dist/';
} else {//如果打包到生产环境
    publicPath = 'http://m.zhaoyl.com/activity/20170112/dist/'
}
//通过getEntry函数获取所有js脚本
let jsEntries = getEntry('./src/js/page/**/*.js');
// let serverHost = "192.168.31.108";
let serverHost = "192.168.31.200";
// let serverHost = "localhost";
let config = {
    entry: jsEntries,
    output: {
        path: path.join(__dirname, 'dist'), //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
        publicPath: publicPath,                //模板、样式、脚本、图片等资源对应的server上的路径
        filename: 'js/[name].js',            //每个页面对应的主js的生成配置
        chunkFilename: 'js/[id].chunk.js?[chunkhash]'   //chunk生成的配置
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.html$/,
                loader: "raw-loader"
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                // loader: ExtractTextPlugin.extract('css-loader!sass-loader')
                // loader: ExtractTextPlugin.extract('css-loader!sass-loader')
                loader: 'style-loader!css-loader!sass-loader'
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=./fonts/[name].[ext]'
            },
            {
                //图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
                //如下配置，将小于8192byte的图片转成base64码
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192&name=images/[hash].[ext]'
            }
        ]
    },
    vue: {
        loaders: {
            scss: ['vue-style-loader', 'css', 'sass'].join('!')
        }
    },
    plugins: [
        new CommonsChunkPlugin({
            name: 'vendors' // 将公共模块提取，生成名为`vendors`的chunk
        }),
//单独使用link标签加载css并设置路径，相对于output配置中的publicPath
        new ExtractTextPlugin('css/[name].css', {
            chunks: ['vendors']
        }),
        projectConfig.debugger ? function () {
        } : new UglifyJsPlugin({ //压缩代码
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            },
            except: ['$super', '$', 'exports', 'require', 'define', 'module'] //排除关键字
        })
    ],
    //使用webpack-dev-server
    devServer: {
        contentBase: './',
        host: serverHost,
        port: 9090, //默认9090
        inline: true, //可以监控js变化
        hot: true//热启动
    },
    resolve: {
        alias: {vue: 'vue/dist/vue.js'}
    }
};
//所有需要生成的pages,Object.keys 给定对象的所有可枚举自身属性的属性名组成的数组
let tplPages = Object.keys(getEntry('./src/html/*.html'));
// console.log(tplPages);
tplPages.forEach((pathname)=> {
    // console.log(pathname);
    let conf = {
        filename: 'html/' + pathname + '.html', //生成的html存放路径，相对于path
        template: 'src/html/' + pathname + '.html', //ejs模板路径,前面最好加上loader用于处理
        inject: false  //js插入的位置，true/'head'/'body'/false
    };
//如果文件名和文件名所对应的js有匹配
    if (pathname in config.entry) {
        // conf.favicon = 'src/imgs/favicon.ico';
        conf.inject = 'body';
        conf.chunks = ['vendors', pathname];
        conf.hash = true;
    }
//生成配置压栈
    config.plugins.push(new HtmlWebpackPlugin(conf));
});
// console.log(config.plugins);
module.exports = config;
function getEntry(globPath) {
    //获取globPath路径下的所有文件
    let files = glob.sync(globPath);
    let entries = {},
        entry, dirname, basename, pathname, extname;
    //循环
    for (let i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);//返回路径的所在的文件夹名称
        extname = path.extname(entry);//返回指定文件名的扩展名称
        /**
         * path.basename(p, [ext])
         * 返回指定的文件名，返回结果可排除[ext]后缀字符串
         * path.basename('/foo/bar/baz/asdf/quux.html', '.html')=>quux
         */
        basename = path.basename(entry, extname);
        pathname = path.join(dirname, basename);//路径合并
        entries[basename] = entry;
    }
    //返回map=>{fileName:fileUrl}
    return entries;
}

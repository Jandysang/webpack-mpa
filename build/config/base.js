
const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const handlerEnvConfig = require(`../env/index`);
const handlerEntry = require('../utils/entry');
const handlerHtml = require('../utils/htmlPlugins');
const handlerStyleRules = require('../utils/styleRules');
const handlerAssetRules = require('../utils/assetRules');
const handlerScriptRules = require('../utils/scriptRules');


const envConfig = handlerEnvConfig();
const entry = handlerEntry();
const htmlPlugins = handlerHtml();
const styleRules = handlerStyleRules();

const env = process.env.NODE_ENV || 'development';

const isProduction = env == 'production';

const publicPath = envConfig['BASE_PATH'] || '/';


const assetRules = handlerAssetRules(publicPath);
const scriptRules = handlerScriptRules();

module.exports = {
    mode: isProduction ? 'production' : 'development',
    entry: entry,
    context: path.resolve(process.cwd(), './src'),
    output: {
        path: path.resolve(process.cwd(), './dist'),
        filename: "js/[name]-[contenthash:16].js",
        chunkFilename: 'js/chunk-[name]-[contenthash:16].js',
        clean: true,
        publicPath: publicPath
    },
    resolve: {
        extensions: ['.vue', '.js', '.jsx', '.json', '.ejs', '.ts', '.tsx'],
        alias: {
            'vue$': 'vue/dist/vue.esm-bundler.js',
            '@': path.resolve(process.cwd(), './src'),
            'react': path.resolve(process.cwd(), './node_modules/react'),
            'react-dom': path.resolve(process.cwd(), './node_modules/react-dom')
        },
        fallback: { "fs": false, "path": false, "crypto": false }
    },
    performance: {
        hints: isProduction ? 'warning' : false,
        maxEntrypointSize: 500000,
        maxAssetSize: 500000
    },
    watchOptions: {
        ignored: /node_modules/
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            ...scriptRules,
            // EJS模板
            {
                // 匹配 .ejs 文件，用于服务器端渲染模板
                test: /\.ejs$/,
                use: [
                    {
                        loader: 'ejs-loader',
                        options: {
                            // 禁用ES模块语法，兼容CommonJS环境
                            esModule: false
                        }
                    },
                    'extract-loader', {
                        loader: 'html-loader',
                        options: {
                            // 启用资源处理，如图片、链接等
                            sources: true,
                            // 禁用ES模块语法，兼容CommonJS环境
                            esModule: false
                        }
                    }
                ]
            },
            // HTML模板
            {
                // 匹配 .html 文件，用于HTML模板处理
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            // 启用资源处理，如图片、链接等
                            sources: true,
                            // 禁用ES模块语法，兼容CommonJS环境
                            esModule: false
                        }
                    }
                ]
            },
            ...styleRules,
            ...assetRules
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        ...htmlPlugins,
        new CopyPlugin({
            patterns: [{
                from: path.resolve(process.cwd(), './public'),
                to: path.resolve(process.cwd(), './dist'),
                noErrorOnMissing: true,
                globOptions: { ignore: ['.DS_Store', '**/README.md'] }
            }]
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name]-[contenthash:16].css", // 入口业务 CSS 文件名
            chunkFilename: "css/chunk-[name]-[contenthash:16].css", // 分割后的公共 CSS 文件名
            ignoreOrder: false,
            runtime: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env),
            ...Object.keys(envConfig).reduce((acc, key) => {
                acc[`import.meta.env.${key}`] = JSON.stringify(envConfig[key]);
                return acc;
            }, {}),
            //  ...Object.keys(envConfig).reduce((acc, key) => {
            //     acc[`process.env.${key}`] = JSON.stringify(envConfig[key]);
            //     return acc;
            // }, {})
        })

    ]
}
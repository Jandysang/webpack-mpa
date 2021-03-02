const path = require("path")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { pages, handlers } = require("../utils/handle-entry.js");
const handleVueLoader = require("../utils/handle-vue-loader.js")
const webpack = require('webpack')
const env = require("../env/index")
module.exports = {
    entry: handlers,
    context: path.resolve(process.cwd(), './src'),
    output: {
        path: path.resolve(process.cwd(), './dist'),
        filename: "js/[name]-[hash:16].js"
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            "~": path.join(__dirname, '../..', 'src')
        }
    },
    module: {
        rules: [
            {
                test: /\.hbs$/,
                use: ['handlebars-loader', 'extract-loader', {
                    loader: 'html-loader',
                    options: {
                        attributes: true
                    }
                }]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: handleVueLoader.cssLoaders({
                        sourceMap: env.NODE_ENV == 'development',
                        extract: env.NODE_ENV == 'production'
                    }),
                    cssSourceMap: env.NODE_ENV == 'development',
                    cacheBusting: env.NODE_ENV == 'development',
                    transformToRequire: {
                        video: ['src', 'poster'],
                        source: 'src',
                        img: 'src',
                        image: 'xlink:href'
                    }
                }
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /\.less$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: "../"
                    }
                }, 'css-loader', 'postcss-loader', 'less-loader']
            },
            {
                test: /\.s[c|a]ss$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: "../"
                    }
                }, 'css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.styl$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: "../"
                    }
                }, 'css-loader', 'postcss-loader', 'stylus-loader']
            },
            {
                test: /\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: "../"
                    }
                }, 'css-loader', 'postcss-loader']
            },
            {
                test: /\.ts$/,
                use: ['ts-loader']
            },
            {
                test: /\.tsx$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react'],
                    }
                }, 'ts-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.jsx$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react'],
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.(gif|png|jpe?g|webp|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        // 小于 8k 全部压缩
                        limit: 1024 * 2,
                        name: '[name]-[hash:16].[ext]',
                        outputPath: "images"
                    }
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: "fonts"
                    }
                }]
            }
        ]
    },
    //代码优化
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '-',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: 1,//权重
                    chunks: 'initial',
                    minSize: 0, //大于0个字节
                    minChunks: 2, //在分割之前，这个代码块最小应该被引用的次数
                },
                common: {
                    chunks: 'initial',
                    minChunks: 2,
                    minSize: 0
                }
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': env
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name]-[hash:16].css',
        }),
        new VueLoaderPlugin(),
        new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve(process.cwd(), './static')
            }]
        }),
        ...pages
    ]
}
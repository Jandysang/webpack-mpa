const path = require("path")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { pages, handlers } = require("../utils/handle-entry.js");
const handleVueLoader = require("../utils/handle-vue-loader.js")
const webpack = require('webpack')
const env = require("../env/index")
const publicPath = '/'
module.exports = {
    entry: handlers,
    context: path.resolve(process.cwd(), './src'),
    output: {
        path: path.resolve(process.cwd(), './dist'),
        filename: "js/[name]-[hash:16].js",
        publicPath: publicPath
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            "~": path.join(__dirname, '../..', 'src'),
            "node_modules": path.join(__dirname, "../..", "node_modules")
        }
    },
    module: {
        rules: [
            {
                test: /\.ejs$/,
                use: [{
                    loader: 'ejs-loader',
                    options: {
                        esModule: false
                    }
                }, 'extract-loader', {
                    loader: 'html-loader',
                    options: {
                        attributes: true
                    }
                }]
            },
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
                        publicPath: publicPath
                    }
                }, 'css-loader', 'postcss-loader', 'less-loader']
            },
            {
                test: /\.s[c|a]ss$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: publicPath
                    }
                }, 'css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.styl$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: publicPath
                    }
                }, 'css-loader', 'postcss-loader', 'stylus-loader']
            },
            {
                test: /\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                            publicPath: publicPath
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
                        // 小于2k 压缩，大于2k的用文件
                        limit: 1024 * 2,
                        name: 'images/[name]-[hash:16].[ext]',
                        publicPath: publicPath
                    }
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        // 小于2k 压缩，大于2k的用文件
                        limit: 1024 * 2,
                        name: 'fonts/[name]-[hash:16].[ext]',
                        publicPath: publicPath
                    }
                }]
            }
        ]
    },
    //代码优化
    // optimization: {
    //     splitChunks: {
    //         chunks: 'async',
    //         minSize: 30000,
    //         maxSize: 0,
    //         minChunks: 1,
    //         maxAsyncRequests: 5,
    //         maxInitialRequests: 3,
    //         automaticNameDelimiter: '-',
    //         name: true,
    //         cacheGroups: {
    //             vendors: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 priority: 1,//权重
    //                 chunks: 'initial',
    //                 name: 'vendors', // 自定义名称
    //                 minSize: 0, //大于0个字节
    //                 minChunks: 2, //在分割之前，这个代码块最小应该被引用的次数
    //             },
    //             common: {
    //                 chunks: 'initial',
    //                 // name: 'common-vendors', // 自定义名称
    //                 minChunks: 2,
    //                 minSize: 0
    //             }
    //         }
    //     }
    // },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            maxSize: 244000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '.',
            name: (module, chunks, cacheGroupKey) => {
                const chunkNames = chunks.map(chunk => chunk.name);
                // 进一步简化名称生成逻辑
                const baseName = chunkNames.join('.')
                    .replace(/[\/\\_-]/g, '.') // 替换特殊字符
                    .slice(0, 16); // 更短的长度限制
                const hash = require('crypto').randomBytes(2).toString('hex');
                return `${cacheGroupKey}.${baseName}.${hash}`;
            },
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    name: 'vendors',
                    chunks: 'all',
                },
                common: {
                    priority: 5,
                    minChunks: 2,
                    reuseExistingChunk: true,
                },
                // 移除 maxChunks，改用 minSize 控制
                pageShared: {
                    priority: 4,
                    minChunks: 2,
                    maxSize: 100000, // 用更小的 maxSize 限制来间接控制代码块范围
                    reuseExistingChunk: true,
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
            chunkFilename: 'css/[name]-[hash:16].css', // 新增：公共CSS的输出模板
            ignoreOrder: true
        }),
        new webpack.ProvidePlugin({
            _: "lodash"
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
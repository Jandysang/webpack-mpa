
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const env = process.env.NODE_ENV || 'development';

const isProduction = env === 'production';



const styleLoader = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';


// 过滤Sass警告的函数
const filterSassWarning = (message) => {
    if (message.includes('@import rules are deprecated')) return;
    console.warn('Sass Warning:', message);
};



module.exports = () => [
    // 处理 CSS 模块化文件
    {
        test: /\.module\.css$/,
        use: [
            styleLoader,
            {
                loader: 'css-loader',
                options: {
                    url: true,
                    modules: {
                        localIdentName: '[local]__[hash:base64:5]',  // 修改类名格式为双下划线
                    },
                    // 确保模块的默认导出正常工作
                    esModule: false,
                    sourceMap: !isProduction,  // 添加 source map 支持
                },
            },
            'postcss-loader'
        ]
    },
    // 全局样式 - CSS
    {
        test: /\.css$/,
        exclude: /\.module\.css$/,  // 排除 .module.css 文件
        use: [styleLoader, {
            loader: 'css-loader',
            options: {
                url: true,
                esModule: false,
                sourceMap: !isProduction,
            }
        }, 'postcss-loader']
    },
    // 处理 SCSS/SASS 模块化文件
    {
        test: /\.module\.(scss|sass)$/,
        use: [
            styleLoader,
            {
                loader: 'css-loader',
                options: {
                    url: true,
                    modules: {
                        localIdentName: '[local]__[hash:base64:5]',  // 修改类名格式为双下划线
                    },
                    // 确保模块的默认导出正常工作
                    esModule: false,
                    sourceMap: !isProduction,  // 添加 source map 支持
                },
            },
            'postcss-loader',
            {
                loader: 'sass-loader',
                options: {
                    sassOptions: {
                        quietDeps: true,
                        logger: { warn: filterSassWarning }
                    }
                }
            }
        ]
    },
    // 全局样式 - SCSS/SASS
    {
        test: /\.(scss|sass)$/,
        exclude: /\.module\.(scss|sass)$/,
        use: [
            styleLoader,
            {
                loader: 'css-loader',
                options: {
                    url: true,
                    esModule: false,
                    sourceMap: !isProduction,
                }
            },
            'postcss-loader',
            {
                loader: 'sass-loader',
                options: {
                    sassOptions: {
                        quietDeps: true,
                        logger: { warn: filterSassWarning }
                    }
                }
            }
        ]
    },
    // 处理 LESS 模块化文件
    {
        test: /\.module\.less$/,
        use: [
            styleLoader,
            {
                loader: 'css-loader',
                options: {
                    url: true,
                    modules: {
                        localIdentName: '[local]__[hash:base64:5]',  // 修改类名格式为双下划线
                    },
                    // 确保模块的默认导出正常工作
                    esModule: false,
                    sourceMap: !isProduction,  // 添加 source map 支持
                },
            },
            'postcss-loader',
            {
                loader: 'less-loader',
                options: {
                    lessOptions: {
                        javascriptEnabled: true
                    }
                }
            }
        ]
    },
    // 全局样式 - LESS
    {
        test: /\.less$/,
        exclude: /\.module\.less$/,
        use: [
            styleLoader,
            {
                loader: 'css-loader',
                options: {
                    url: true,
                    esModule: false,
                    sourceMap: !isProduction,
                }
            },
            'postcss-loader',
            {
                loader: 'less-loader',
                options: {
                    lessOptions: {
                        javascriptEnabled: true
                    }
                }
            }
        ]
    },
    // 处理 Stylus 模块化文件
    {
        test: /\.module\.styl$/,
        use: [
            styleLoader,
            {
                loader: 'css-loader',
                options: {
                    url: true,
                    modules: {
                        localIdentName: '[local]__[hash:base64:5]',  // 修改类名格式为双下划线
                    },
                    // 确保模块的默认导出正常工作
                    esModule: false,
                    sourceMap: !isProduction,  // 添加 source map 支持
                },
            },
            'postcss-loader', 'stylus-loader'
        ]
    },
    // 全局样式 - Stylus
    {
        test: /\.styl$/,
        exclude: /\.module\.styl$/,
        use: [styleLoader, {
            loader: 'css-loader',
            options: {
                url: true,
                esModule: false,
                sourceMap: !isProduction,
            }
        }, 'postcss-loader', 'stylus-loader']
    },
]
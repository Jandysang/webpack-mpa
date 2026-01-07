/**
 * 静态资源/模板loader规则
 * Webpack 5 中使用内置的 asset 模块类型替代 url-loader 和 file-loader
 */
module.exports = [
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
    // 图片/图标资源
    {
        // 匹配常见图片格式：GIF、PNG、JPG/JPEG、WebP、SVG
        test: /\.(gif|png|jpe?g|webp|svg)$/,
        // Webpack 5 内置资源类型，替代 url-loader 和 file-loader
        type: 'asset',
        // 资源处理选项
        generator: {
            // 输出路径和文件名格式
            filename: 'images/[name].[hash:8][ext]'
        },
        parser: {
            // 资源内联阈值（2KB），小于该值的资源会被内联为 Data URI
            dataUrlCondition: {
                maxSize: 1024 * 2 // 2KB
            }
        }
    },
    // 字体资源
    {
        // 匹配常见字体格式：WOFF、WOFF2、EOT、TTF、OTF
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        // Webpack 5 内置资源类型，替代 url-loader 和 file-loader
        type: 'asset',
        // 资源处理选项
        generator: {
            // 输出路径和文件名格式
            filename: 'fonts/[name].[hash:8][ext]'
        },
        parser: {
            // 资源内联阈值（2KB），小于该值的资源会被内联为 Data URI
            dataUrlCondition: {
                maxSize: 1024 * 2 // 2KB
            }
        }
    }
];
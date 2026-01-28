const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    devtool: false,
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                // 单独处理其他大型库
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: 10,
                    chunks: 'all'
                },
                // 分离被多次引用的模块（超过2次）
                shared: {
                    name: 'shared',  // 被多次引用的模块会打包到这个文件
                    minChunks: 2,    // 被至少引用2次以上的模块才会分离
                    chunks: 'all',   // 包括同步和异步代码块
                    priority: 5,     // 优先级
                    enforce: true    // 强制创建 chunk
                },
                // 默认公共模块
                default: {
                    name: 'common',
                    minChunks: 2,    // 被至少2次引用的模块才会被提取
                    priority: 2,     // 较低优先级
                    reuseExistingChunk: true // 复用已存在的 chunk
                }
            }
        },
        minimizer: [
            // JS 压缩
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true, // 移除 console
                        drop_debugger: true // 移除 debugger
                    }
                }
            }),
            // CSS 压缩
            new CssMinimizerPlugin()
        ]
    },
}
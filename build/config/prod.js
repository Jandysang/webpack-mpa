const { merge } = require('webpack-merge');
const baseConfig = require('./base');
const htmlPlugins = require('../plugins/html');

/**
 * 生产环境配置
 */
module.exports = merge(baseConfig(true), {
    devtool: 'source-map', // 生产环境源码映射（可选）
    plugins: [
        ...htmlPlugins(true)
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    name: 'vendors',
                    chunks: 'all',
                    priority: 10
                },
                // 预留Angular依赖拆分
                // angular: {
                //     test: /node_modules\/@angular/,
                //     name: 'angular-vendors',
                //     chunks: 'all',
                //     priority: 20
                // }
            }
        },
        runtimeChunk: 'single' // 运行时单独打包（生产环境优化）
    }
});
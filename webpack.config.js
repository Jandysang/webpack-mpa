
const { merge } = require('webpack-merge');

const config = require('./build/config/index.js');


module.exports = merge(config, {
    // 在这里可以扩展和修改更多的配置信息
    optimization: {
        splitChunks: {
            cacheGroups: {
                // 单独处理 Element Plus
                elementPlus: {
                    test: /[\\/]node_modules[\\/]element-plus[\\/]/,
                    name: 'element-plus',
                    priority: 40,
                    chunks: 'all'
                },
                // 单独处理 Vue 相关库
                vue: {
                    test: /[\\/]node_modules[\\/](vue|@vue)[\\/]/,
                    name: 'vue',
                    priority: 30,
                    chunks: 'all'
                },
                jquery: {
                    test: /[\\/]node_modules[\\/]jquery[\\/]/,
                    name: 'jquery',
                    priority: 20,
                    chunks: 'all'
                },
                // 单独处理 React 相关库（补充完善的核心配置）
                react2: {
                    // 匹配 react、react-dom 及 @react 命名空间的相关依赖（如 react-router、react-redux 等）
                    test: /[\\/]node_modules[\\/](react|react-dom|@react)[\\/]/,
                    // 提取后生成独立文件名为 react.js（生产环境会自动压缩优化）
                    name: 'react',
                    // 优先级 25（介于 elementPlus/vue 和 jquery 之间，确保优先提取 React 相关库）
                    priority: 25,
                    // 对所有代码块（同步 + 异步）生效，确保完整提取 React 相关依赖
                    chunks: 'all'
                },
                antd: {
                    test: /[\\/]node_modules[\\/]antd[\\/]/,
                    name: 'antd',
                    priority: 30,
                    chunks: 'all'
                },

            }
        },
    }
});
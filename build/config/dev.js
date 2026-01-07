const { merge } = require('webpack-merge');
const path = require('path');
const fs = require('fs');
const baseConfig = require('./base');
const htmlPlugins = require('../plugins/html');

/**
 * 开发环境配置
 */
module.exports = merge(baseConfig(false), {
    devtool: 'cheap-module-source-map', // 开发环境源码映射
    plugins: [
        ...htmlPlugins(false)
    ],
    devServer: {
        port: 8080,
        open: true,
        hot: true,
        historyApiFallback: {
            //path.resolve(process.cwd(), './tsconfig.json')
            rewrites: fs.existsSync(path.resolve(process.cwd(), './src/pages'))
                ? fs.readdirSync(path.resolve(process.cwd(), './src/pages')).filter(item => {
                    return fs.statSync(path.join(process.cwd(), './src/pages', item)).isDirectory();
                }).map(page => {
                    return { from: new RegExp(`^/${page}/.*`), to: `/${page}/index.html` };
                })
                : []
        },
        client: { overlay: { errors: true, warnings: false } }
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    }
});
const path = require('path');
const getEntry = require('../utils/getEntry');

// 导入loader规则
const vueRules = require('../rules/vue');
const reactRules = require('../rules/react');
const styleRules = require('../rules/style');
const scriptRules = require('../rules/script');
const assetRules = require('../rules/asset');

// 导入插件
const vuePlugins = require('../plugins/vue');
const cssPlugins = require('../plugins/css');
const copyPlugins = require('../plugins/copy');

/**
 * Webpack基础配置（通用）
 * @param {boolean} isProduction - 是否生产环境
 */
module.exports = (isProduction) => {
    return {
        mode: isProduction ? 'production' : 'development',
        entry: getEntry(),
        output: {
            path: path.resolve(process.cwd(), './dist'),
            filename: 'js/[name].[contenthash:8].js',
            chunkFilename: 'js/[name].[contenthash:8].chunk.js',
            clean: true,
            publicPath: '/'
        },
        resolve: {
            extensions: ['.vue', '.js', '.jsx', '.json', '.ejs', '.ts', '.tsx'],
            alias: {
                'vue$': 'vue/dist/vue.esm-bundler.js',
                '@': path.resolve(process.cwd(), './src'),
                'react': path.resolve(process.cwd(), './node_modules/react'),
                'react-dom': path.resolve(process.cwd(), './node_modules/react-dom'),
                '@angular/core': path.resolve(process.cwd(), './node_modules/@angular/core'),
            },
            fallback: { "fs": false, "path": false, "crypto": false }
        },
        module: {
            rules: [
                ...vueRules,
                ...reactRules,
                ...styleRules(isProduction),
                ...scriptRules,
                ...assetRules
            ]
        },
        plugins: [
            ...vuePlugins,
            ...cssPlugins,
            ...copyPlugins
        ]
    };
};
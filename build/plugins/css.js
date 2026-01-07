const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * CSS提取插件
 */
module.exports = [
    new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash:8].css' })
];
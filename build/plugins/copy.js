const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

/**
 * 静态资源复制插件（public目录）
 */
module.exports = [
    new CopyPlugin({ 
        patterns: [{ 
            from: path.resolve(process.cwd(), './public'), 
            to: path.resolve(process.cwd(), './dist'),
            noErrorOnMissing: true,
            globOptions: { ignore: ['.DS_Store', '**/README.md'] }
        }] 
    })
];
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
module.exports = {
    mode: 'production',
    plugins:[
        new OptimizeCSSAssetsPlugin()
    ]
}
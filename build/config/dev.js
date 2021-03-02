const path = require('path');
const proxyConfig = require('../../proxy.config.js')

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        contentBase: path.resolve(process.cwd(), './dist'),
        proxy:proxyConfig,
        port: 8888,
        host: '0.0.0.0'
    }
}
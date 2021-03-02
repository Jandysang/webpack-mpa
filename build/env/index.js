const env = process.env.NODE_ENV || 'development'

const { merge } = require("webpack-merge")

let base = require('./base.js')

let config;

switch (env) {
    case 'production':
        config = merge(base, require('./prod.js'))
        break;
    case 'development':
    default:
        config = merge(base, require('./dev.js'))
        break

}

module.exports = config
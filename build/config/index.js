
const { merge } = require('webpack-merge');


const base = require('./base');
const dev = require('./dev');
const prod = require('./prod');

const env = process.env.NODE_ENV || 'development';


module.exports = merge(base, env === 'development' ? dev : {}, env === 'production' ? prod : {});
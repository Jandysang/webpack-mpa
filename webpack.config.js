const env = process.env.NODE_ENV;

// 根据环境加载对应配置
if (env === 'production') {
    module.exports = require('./build/config/prod.js');
} else {
    module.exports = require('./build/config/dev.js');
}
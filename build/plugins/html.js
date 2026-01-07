const getHtmlPlugins = require('../utils/getHtmlPlugins');

/**
 * HTML插件（多页面）
 * @param {boolean} isProduction - 是否生产环境
 */
module.exports = (isProduction) => {
    return getHtmlPlugins(isProduction);
};
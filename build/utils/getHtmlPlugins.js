const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * 生成多页面HTML插件
 * @param {boolean} isProduction - 是否为生产环境，决定是否压缩HTML
 * @returns {Array} HtmlWebpackPlugin 实例数组
 */
const getHtmlPlugins = (isProduction) => {
    const plugins = [];
    const pagesDir = path.resolve(process.cwd(), './src/pages');

    // 检查pages目录是否存在
    if (!fs.existsSync(pagesDir)) {
        console.warn('⚠️  src/pages目录不存在，请检查目录结构');
        return plugins;
    }

    let pageFiles;
    try {
        // 读取pages目录下的所有文件/目录
        pageFiles = fs.readdirSync(pagesDir);
    } catch (error) {
        console.error('⚠️  读取src/pages目录失败:', error.message);
        return plugins;
    }

    // 遍历每个页面目录，生成对应的HTML插件配置
    pageFiles.forEach(page => {
        // 验证页面目录名，防止路径遍历攻击（如：../../../etc/passwd）
        if (!/^[a-zA-Z0-9_-]+$/.test(page)) {
            console.warn(`⚠️  页面目录名 "${page}" 包含非法字符，已跳过`);
            return;
        }

        const pageDir = path.join(pagesDir, page);
        let stats;
        try {
            // 获取目录信息，判断是否为目录
            stats = fs.statSync(pageDir);
        } catch (error) {
            console.warn(`⚠️  获取页面目录 "${page}" 状态失败:`, error.message);
            return;
        }

        // 跳过非目录文件
        if (!stats.isDirectory()) return;

        // 定义模板文件查找顺序：优先级 ejs > html
        const templateFiles = [
            path.join(pageDir, 'index.ejs'),  // EJS模板文件
            path.join(pageDir, 'index.html')  // HTML模板文件
        ];

        let template = '';
        // 按优先级查找模板文件
        for (const file of templateFiles) {
            try {
                if (fs.existsSync(file)) {
                    template = file;
                    break;
                }
            } catch (error) {
                console.warn(`⚠️  检查模板文件 "${file}" 时出错:`, error.message);
            }
        }

        // 如果没有找到任何模板文件，警告并跳过此页面
        if (!template) {
            console.warn(`⚠️  页面 ${page} 缺少模板文件（index.ejs/index.html），已跳过`);
            return; // forEach中的return相当于continue，不会影响其他页面的处理
        }

        // 创建HTML插件实例，为当前页面生成HTML文件
        plugins.push(
            new HtmlWebpackPlugin({
                filename: `${page}/index.html`,  // 输出的HTML文件路径
                template: template,              // 模板文件路径
                chunks: [page],                  // 当前页面需要引入的JS chunk
                inject: true,                    // 自动注入JS和CSS资源
                minify: isProduction ? {         // 生产环境压缩HTML
                    removeComments: true,        // 移除HTML注释
                    collapseWhitespace: true     // 压缩空格换行
                } : false
            })
        );
    });

    return plugins;
};
module.exports = getHtmlPlugins;
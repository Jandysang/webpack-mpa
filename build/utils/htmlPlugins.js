const path = require('path');
const fs = require('fs');
const consola = require('consola');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const CONFIG = {
    PAGES_DIR: './src/pages',
    TEMPLATE_EXTENSIONS: ['index.html', 'index.ejs', 'template.html', 'template.ejs']
};

/**
 * 检查文件或目录是否存在（带错误处理）
 * @param {string} filePath - 文件或目录路径
 * @returns {boolean} 是否存在
 */
const exists = (filePath) => {
    try {
        return fs.existsSync(filePath);
    } catch (error) {
        consola.error(`检查文件路径时发生错误: ${filePath}`, error.message);
        return false;
    }
};

/**
 * 查找页面的 HTML 模板文件
 * @param {string} pageDir - 页面目录路径
 * @returns {string|null} 模板文件路径，未找到返回 null
 */
const findHtmlTemplate = (pageDir) => {
    for (const templateName of CONFIG.TEMPLATE_EXTENSIONS) {
        const templatePath = path.join(pageDir, templateName);
        if (exists(templatePath)) {
            return templatePath;
        }
    }
    return null;
};

module.exports = () => {
    const plugins = [];
    const pagesDir = path.resolve(process.cwd(), CONFIG.PAGES_DIR);
    const isProduction = process.env.NODE_ENV === 'production';

    // 检查 pages 目录是否存在
    if (!exists(pagesDir)) {
        consola.warn('⚠️  src/pages目录不存在，请检查目录结构');
        return plugins;
    }

    try {
        const pageNames = fs.readdirSync(pagesDir);
        
        for (const pageName of pageNames) {
            // 跳过隐藏文件（如 .DS_Store）
            if (pageName.startsWith('.')) continue;
            
            const pageDir = path.join(pagesDir, pageName);
            if (!fs.statSync(pageDir).isDirectory()) continue;

            // 查找 HTML 模板文件
            const templatePath = findHtmlTemplate(pageDir);
            if (!templatePath) {
                consola.warn(`⚠️  页面 ${pageName} 缺少 HTML 模板文件，已跳过`);
                continue;
            }

            // 生成 HTML 插件
            // const filename =`${pageName}.html`;
            // consola.info(`✅  已找到页面 ${pageName} 的 HTML 模板文件: ${templatePath}`);
            plugins.push(new HtmlWebpackPlugin({
                filename:`${pageName}.html`,
                template: templatePath,
                chunks: [pageName],
                inject: true,
                minify: isProduction ? {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                } : false,
            }));
        }
    } catch (error) {
        consola.error('读取页面目录时发生错误:', error.message);
        return plugins;
    }

    return plugins;
};
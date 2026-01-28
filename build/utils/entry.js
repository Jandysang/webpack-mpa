const fs = require('fs');
const path = require('path');
const consola = require('consola');

// 入口文件扩展名配置
const ENTRY_FILE_EXTENSIONS = [
    'index.js', 
    'index.ts',      
    'index.react.js',
    'index.react.jsx',
    'index.react.ts',
    'index.react.tsx',
    'index.vue.js',
    'index.vue.jsx',
    'index.vue.ts',
    'index.vue.tsx',  
    'index.angular.ts',
];

/**
 * 验证页面名称是否合法
 * @param {string} pageName - 页面名称
 * @returns {boolean} 是否合法
 */
const isValidPageName = (pageName) => {
    // 跳过隐藏文件（以.开头的文件），如 .DS_Store, .git 等
    if (pageName.startsWith('.')) {
        return false;
    }
    
    // 检查是否符合合法字符要求
    return /^[a-zA-Z0-9_-]+$/.test(pageName);
};

/**
 * 查找页面入口文件
 * @param {string} pageDir - 页面目录路径
 * @returns {string|null} 找到的入口文件路径，未找到返回 null
 */
const findEntryFile = (pageDir) => {
    for (const extension of ENTRY_FILE_EXTENSIONS) {
        const filePath = path.join(pageDir, extension);
        if (fs.existsSync(filePath)) {
            return filePath;
        }
    }
    return null;
};

module.exports = () => {
    const entry = {};
    const pagesDir = path.resolve(process.cwd(), './src/pages');

    // 检查 pages 目录是否存在
    if (!fs.existsSync(pagesDir)) {
        consola.warn('⚠️  src/pages目录不存在，请检查目录结构');
        return entry;
    }

    try {
        const pageNames = fs.readdirSync(pagesDir);
        
        for (const page of pageNames) {
            // 验证页面名称
            if (!isValidPageName(page)) {
                // 只对非隐藏文件进行警告提示
                if (!page.startsWith('.')) {
                    consola.warn(`⚠️  页面名称 "${page}" 包含非法字符，已跳过`);
                }
                continue;
            }

            const pageDir = path.join(pagesDir, page);

            // 检查是否为目录
            if (!fs.statSync(pageDir).isDirectory()) {
                continue;
            }

            // 查找入口文件
            const entryFile = findEntryFile(pageDir);
            
            if (!entryFile) {
                consola.warn(`⚠️  页面 ${page} 缺少入口文件，已跳过`);
                continue;
            }

            entry[page] = entryFile;
        }
    } catch (error) {
        consola.error('读取页面目录时发生错误:', error.message);
        return entry;
    }

    return entry;
};
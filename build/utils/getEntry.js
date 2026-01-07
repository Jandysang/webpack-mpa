const fs = require('fs');
const path = require('path');

/**
 * 获取多页面入口配置
 * 
 * 该函数会扫描 src/pages 目录下的所有子目录，并为每个子目录查找对应的入口文件
 * 
 * 入口文件查找优先级（从高到低）：
 * 1. index.js - 普通 JavaScript 入口文件
 * 2. index.react.js - React 项目入口文件
 * 3. index.vue.js - Vue 项目入口文件
 * 4. index.angular.ts - Angular 项目入口文件（预留支持）
 * 
 * @returns {Object} 返回入口配置对象，格式为 { [pageName]: filePath }
 *                   例如：{ home: '/path/to/src/pages/home/index.js', ... }
 */
const getEntry = () => {
    const entry = {};
    // 获取 pages 目录的绝对路径
    const pagesDir = path.resolve(process.cwd(), './src/pages');

    // 检查 pages 目录是否存在
    if (!fs.existsSync(pagesDir)) {
        console.warn('⚠️  src/pages目录不存在，请检查目录结构');
        return entry; // 目录不存在时返回空对象
    }

    // 遍历 pages 目录下的所有子目录
    fs.readdirSync(pagesDir).forEach(page => {
        // 验证页面名称，防止路径遍历攻击（如使用 ../ 等路径）
        if (!/^[a-zA-Z0-9_-]+$/.test(page)) {
            console.warn(`⚠️  页面名称 "${page}" 包含非法字符，已跳过`);
            return; // 跳过当前页面，继续处理下一个
        }

        // 构建当前页面目录的完整路径
        const pageDir = path.join(pagesDir, page);
        
        // 检查是否为目录（而非文件）
        if (!fs.statSync(pageDir).isDirectory()) return;

        // 定义入口文件查找顺序（按优先级从高到低）
        const entryFiles = [
            path.join(pageDir, 'index.js'),        // 普通 JavaScript 入口
            path.join(pageDir, 'index.react.js'),  // React 专用入口
            path.join(pageDir, 'index.vue.js'),    // Vue 专用入口
            path.join(pageDir, 'index.angular.ts') // Angular 入口（预留）
        ];

        let entryFile = ''; // 存储找到的入口文件路径
        
        // 按优先级顺序查找存在的入口文件
        for (const file of entryFiles) {
            if (fs.existsSync(file)) {
                entryFile = file; // 找到第一个存在的文件后立即跳出循环
                break;
            }
        }

        // 如果没有找到任何入口文件，输出警告并跳过该页面
        if (!entryFile) {
            console.warn(`⚠️  页面 ${page} 缺少入口文件，已跳过`);
            return; // 在 forEach 中，return 相当于 continue，跳过当前迭代
        }

        // 将找到的入口文件添加到入口配置对象中
        // key 为页面目录名，value 为入口文件的完整路径
        entry[page] = entryFile;
    });

    return entry; // 返回完整的入口配置对象
};


module.exports = getEntry;
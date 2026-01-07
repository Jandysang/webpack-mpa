// /**
//  * React相关loader规则
//  * 用于处理React组件文件，支持JSX语法并使用React 17+的新JSX转换
//  */
// module.exports = [
//     {
//         // 匹配 .react.js 和 .react.jsx 文件
//         // 通过文件名约定区分React组件和普通JS文件
//         test: /\.react\.(js|jsx)$/,
//         // 排除 node_modules 目录，避免处理第三方库
//         exclude: /node_modules/,
//         // 使用 babel-loader 编译React JSX语法
//         loader: 'babel-loader',
//         options: {
//             // Babel预设配置
//             presets: [
//                 // @babel/preset-env：转译ES6+语法，根据目标环境支持情况自动转换
//                 '@babel/preset-env',
//                 // @babel/preset-react：转译JSX语法
//                 // runtime: 'automatic'：使用React 17+的新JSX转换，无需手动导入React
//                 ['@babel/preset-react', { 
//                     runtime: 'automatic' // 自动引入JSX运行时，减少代码体积
//                 }]
//             ],
//             // 启用缓存，提升构建性能
//             // 将编译结果缓存到文件系统，避免重复编译
//             cacheDirectory: true
//         }
//     }
// ];

const path = require('path');

/**
 * React相关loader规则
 * 用于处理React组件文件，支持JSX语法、TypeScript并使用React 17+的新JSX转换
 */
module.exports = [
    {
        // 匹配 .react.ts、.react.tsx、.react.js 和 .react.jsx 文件
        // 通过文件名约定区分React组件和普通JS/TS文件
        test: /\.react\.(ts|tsx|js|jsx)$/,
        // 排除 node_modules 目录，避免处理第三方库
        exclude: /node_modules/,
        // 使用 babel-loader 编译React TypeScript/JSX语法
        loader: 'babel-loader',
        options: {
            // Babel预设配置
            presets: [
                // @babel/preset-env：转译ES6+语法，根据目标环境支持情况自动转换
                '@babel/preset-env',
                // @babel/preset-react：转译JSX语法
                // runtime: 'automatic'：使用React 17+的新JSX转换，无需手动导入React
                ['@babel/preset-react', { 
                    runtime: 'automatic' // 自动引入JSX运行时，减少代码体积
                }],
                // @babel/preset-typescript：转译TypeScript语法
                // 注意：当使用ts-loader时，可能不需要此预设
                '@babel/preset-typescript'
            ],
            // 启用缓存，提升构建性能
            // 将编译结果缓存到文件系统，避免重复编译
            cacheDirectory: true
        }
    },
    // TypeScript编译规则（专门处理React的TS/TSX文件）
    {
        // 匹配 .react.ts 和 .react.tsx 文件
        test: /\.react\.(ts|tsx)$/,
        // 排除 node_modules 目录
        exclude: /node_modules/,
        // 使用 ts-loader 进行TypeScript编译
        loader: 'ts-loader',
        options: {
            // 指向项目根目录的tsconfig.json
            configFile: path.resolve(process.cwd(), './tsconfig.json'),
            // 只进行转译，跳过类型检查以提升构建性能
            transpileOnly: true
        }
    }
];
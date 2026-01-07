/**
 * Vue相关loader规则
 * 用于处理Vue单文件组件和Vue中的JSX语法
 */
// module.exports = [
//     {
//         // 匹配 .vue 文件
//         test: /\.vue$/,
//         // 使用 vue-loader 处理 Vue 单文件组件
//         loader: 'vue-loader',
//         options: {
//             // Vue 编译器选项：不保留模板中的空格，减少HTML体积
//             compilerOptions: { preserveWhitespace: false }
//         }
//     },
//     // Vue JSX规则
//     {
//         // 匹配以下文件类型：
//         // - .vue.js：Vue文件中的JS部分
//         // - .vue.jsx：Vue文件中的JSX部分
//         // - .jsx：普通的JSX文件
//         test: /(\.vue\.js)|(\.vue\.jsx)|(\.jsx)$/,
//         // 排除以下目录/文件：
//         // - node_modules：避免处理第三方库
//         // - .react.(js|jsx)：排除React相关的JSX文件
//         exclude: [/node_modules/, /\.react\.(js|jsx)$/],
//         // 使用 babel-loader 编译JSX语法
//         loader: 'babel-loader',
//         options: {
//             // ES6+ 语法转译预设
//             presets: ['@babel/preset-env'],
//             // Vue JSX 语法支持插件
//             plugins: ['@vue/babel-plugin-jsx'],
//             // 启用缓存，提升构建性能
//             cacheDirectory: true
//         }
//     }
// ];


/**
 * Vue相关loader规则
 * 用于处理Vue单文件组件、Vue中的JSX语法以及TypeScript支持
 */
module.exports = [
    {
        // 匹配 .vue 文件
        test: /\.vue$/,
        // 使用 vue-loader 处理 Vue 单文件组件
        loader: 'vue-loader',
        options: {
            // Vue 编译器选项：不保留模板中的空格，减少HTML体积
            compilerOptions: { preserveWhitespace: false }
        }
    },
    // Vue TypeScript/JSX规则
    {
        // 匹配以下文件类型：
        // - .vue.ts：Vue文件中的TS部分
        // - .vue.tsx：Vue文件中的TSX部分
        // - .vue.js：Vue文件中的JS部分
        // - .vue.jsx：Vue文件中的JSX部分
        // - .ts：TypeScript文件
        // - .tsx：TypeScript JSX文件
        // - .js：JavaScript文件
        // - .jsx：JavaScript JSX文件
        test: /(\.vue\.ts)|(\.vue\.tsx)|(\.vue\.js)|(\.vue\.jsx)|(\.(ts|tsx|js|jsx))$/,
        // 排除以下目录/文件：
        // - node_modules：避免处理第三方库
        // - .react.(ts|tsx|js|jsx)：排除React相关的文件
        exclude: [/node_modules/, /\.react\.(ts|tsx|js|jsx)$/],
        // 使用 babel-loader 编译TypeScript/JSX语法
        loader: 'babel-loader',
        options: {
            // ES6+ 语法转译预设
            presets: [
                '@babel/preset-env',
                // 如果需要支持Vue中的JSX，添加此插件
                ['@babel/preset-react', { runtime: 'automatic' }] // 用于Vue中可能的JSX支持
            ],
            // Vue JSX 语法支持插件（如果需要）
            plugins: ['@vue/babel-plugin-jsx'],
            // 启用缓存，提升构建性能
            cacheDirectory: true
        }
    },
    // // TypeScript编译规则
    // {
    //     // 匹配 .ts 和 .tsx 文件（包括Vue中的TS文件）
    //     test: /\.tsx?$/,
    //     // 排除第三方库和React文件
    //     exclude: [/node_modules/, /\.react\.(ts|tsx)$/],
    //     // 使用 ts-loader 进行TypeScript编译
    //     loader: 'ts-loader',
    //     options: {
    //         // 指向项目根目录的tsconfig.json
    //         configFile: path.resolve(process.cwd(), './tsconfig.json'),
    //         // 只进行转译，跳过类型检查以提升构建性能
    //         transpileOnly: true // 提升构建性能，跳过类型检查
    //     }
    // }
];
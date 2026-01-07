/**
 * JS/TS通用loader规则
 * 用于处理通用JavaScript和TypeScript文件（非Vue/React特定文件）
 * Vue和React相关的JS/TS文件由专门的规则处理
 */
module.exports = [
    // JavaScript规则
    {
        // 匹配 .js 文件
        test: /\.js$/,
        // 排除以下目录/文件：
        // - node_modules：避免处理第三方库，提升构建性能
        // - .react.js：排除React相关JS文件（由react.js规则处理）
        // - .vue.js：排除Vue相关JS文件（由vue.js规则处理）
        exclude: [/node_modules/, /\.react\.js$/, /\.vue\.js$/],
        // 使用 babel-loader 进行ES6+语法转译
        loader: 'babel-loader',
        options: {
            // Babel预设配置
            presets: [
                // @babel/preset-env：根据目标环境自动确定需要转译的特性
                // 只转换目标环境不支持的ES6+语法
                '@babel/preset-env'
            ],
            // 启用缓存，提升构建性能
            // 将编译结果缓存到文件系统，避免重复编译相同的文件
            cacheDirectory: true
        }
    },
    // TypeScript规则
    {
        // 匹配 .ts 和 .tsx 文件
        test: /\.tsx?$/,
        // 排除以下目录/文件：
        // - node_modules：避免处理第三方库，提升构建性能
        // - .react.ts(x)：排除React相关TS文件（由react.js规则处理）
        // - .vue.ts(x)：排除Vue相关TS文件（由vue.js规则处理）
        exclude: [/node_modules/, /\.react\.(ts|tsx)$/, /\.vue\.(ts|tsx)$/],
        // 使用 ts-loader 进行TypeScript编译
        loader: 'ts-loader',
        options: {
            // 指向项目根目录的tsconfig.json配置文件
            configFile: require('path').resolve(process.cwd(), './tsconfig.json'),
            // 只进行语法转译，跳过类型检查以提升构建性能
            // 类型检查可以由IDE或单独的tsc命令完成
            transpileOnly: true,
            // 启用编译缓存，进一步提升构建性能
            compilerOptions: {
                // 可以在这里覆盖tsconfig.json中的某些选项
            }
        }
    }
];
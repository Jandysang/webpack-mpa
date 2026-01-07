const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * 样式相关loader规则（CSS/SCSS/LESS/Stylus）
 * @param {boolean} isProduction - 是否生产环境，决定使用style-loader还是MiniCssExtractPlugin.loader
 * @returns {Array} 样式处理规则数组
 */
module.exports = (isProduction) => {
    // 根据环境选择样式加载器
    // 生产环境：使用MiniCssExtractPlugin.loader提取CSS到单独文件
    // 开发环境：使用style-loader动态注入样式到DOM中
    const styleLoader = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';
    
    return [
        // 全局样式（.self后缀）- CSS
        {
            // 匹配 .self.css 文件，用于全局样式
            test: /\.self\.css$/,
            // 排除 .vue 文件，避免与Vue组件样式冲突
            exclude: /\.vue$/,
            // 样式处理链：根据环境选择加载器 -> CSS解析 -> PostCSS处理
            use: [
                styleLoader,      // 根据环境选择的样式加载器
                'css-loader',     // 解析CSS文件中的import/require语句
                'postcss-loader'  // PostCSS处理（自动前缀等）
            ]
        },
        // 全局样式（.self后缀）- SCSS/SASS
        {
            // 匹配 .self.scss 或 .self.sass 文件，用于全局SCSS/SASS样式
            test: /\.self\.(scss|sass)$/,
            // 排除 .vue 文件，避免与Vue组件样式冲突
            exclude: /\.vue$/,
            // 样式处理链：根据环境选择加载器 -> CSS解析 -> PostCSS处理 -> SCSS/SASS编译
            use: [
                styleLoader,      // 根据环境选择的样式加载器
                'css-loader',     // 解析CSS文件中的import/require语句
                'postcss-loader', // PostCSS处理（自动前缀等）
                {
                    // SCSS/SASS编译器
                    loader: 'sass-loader',
                    options: {
                        // SCSS/SASS编译选项
                        sassOptions: {
                            // 静默依赖导入警告
                            quietDeps: true,
                            // 自定义日志处理
                            logger: {
                                // 警告处理函数
                                warn: function (message) {
                                    // 过滤废弃警告：@import rules are deprecated
                                    if (message.includes('@import rules are deprecated')) return;
                                    // 输出其他警告信息
                                    console.warn('Sass Warning:', message);
                                }
                            }
                        }
                    }
                }
            ]
        },
        // 全局样式（.self后缀）- LESS
        {
            // 匹配 .self.less 文件，用于全局LESS样式
            test: /\.self\.less$/,
            // 排除 .vue 文件，避免与Vue组件样式冲突
            exclude: /\.vue$/,
            // 样式处理链：根据环境选择加载器 -> CSS解析 -> PostCSS处理 -> LESS编译
            use: [
                styleLoader,      // 根据环境选择的样式加载器
                'css-loader',     // 解析CSS文件中的import/require语句
                'postcss-loader', // PostCSS处理（自动前缀等）
                {
                    // LESS编译器
                    loader: 'less-loader',
                    options: { 
                        // LESS编译选项
                        lessOptions: { 
                            // 允许在LESS中使用JavaScript（谨慎使用）
                            javascriptEnabled: true 
                        } 
                    }
                }
            ]
        },
        // 全局样式（.self后缀）- Stylus
        {
            // 匹配 .self.styl 文件，用于全局Stylus样式
            test: /\.self\.styl$/,
            // 排除 .vue 文件，避免与Vue组件样式冲突
            exclude: /\.vue$/,
            // 样式处理链：根据环境选择加载器 -> CSS解析 -> PostCSS处理 -> Stylus编译
            use: [
                styleLoader,      // 根据环境选择的样式加载器
                'css-loader',     // 解析CSS文件中的import/require语句
                'postcss-loader', // PostCSS处理（自动前缀等）
                'stylus-loader'   // Stylus编译器
            ]
        },
        // 通用样式（非.self）- CSS
        {
            // 匹配 .css 文件（不包括 .self.css），用于组件内部样式
            test: /\.css$/,
            // 排除 .self.css 文件和 node_modules 中的样式
            exclude: [/\.self\.css$/, /node_modules/],
            // 样式处理链：Vue样式加载器 -> CSS解析 -> PostCSS处理
            use: [
                'vue-style-loader', // Vue专用样式加载器，支持热更新
                'css-loader',       // 解析CSS文件中的import/require语句
                'postcss-loader'    // PostCSS处理（自动前缀等）
            ]
        },
        // 通用样式（非.self）- SCSS/SASS
        {
            // 匹配 .scss 或 .sass 文件（不包括 .self.scss/sass），用于组件内部SCSS/SASS样式
            test: /\.(scss|sass)$/,
            // 排除 .self.scss/sass 文件和 node_modules 中的样式
            exclude: [/\.self\.(scss|sass)$/, /node_modules/],
            // 样式处理链：Vue样式加载器 -> CSS解析 -> PostCSS处理 -> SCSS/SASS编译
            use: [
                'vue-style-loader', // Vue专用样式加载器，支持热更新
                'css-loader',       // 解析CSS文件中的import/require语句
                'postcss-loader',   // PostCSS处理（自动前缀等）
                {
                    // SCSS/SASS编译器
                    loader: 'sass-loader',
                    options: {
                        // SCSS/SASS编译选项
                        sassOptions: {
                            // 静默依赖导入警告
                            quietDeps: true,
                            // 自定义日志处理
                            logger: {
                                // 警告处理函数
                                warn: function (message) {
                                    // 过滤废弃警告：@import rules are deprecated
                                    if (message.includes('@import rules are deprecated')) return;
                                    // 输出其他警告信息
                                    console.warn('Sass Warning:', message);
                                }
                            }
                        }
                    }
                }
            ]
        },
        // 通用样式（非.self）- LESS
        {
            // 匹配 .less 文件（不包括 .self.less），用于组件内部LESS样式
            test: /\.less$/,
            // 排除 .self.less 文件和 node_modules 中的样式
            exclude: [/\.self\.less$/, /node_modules/],
            // 样式处理链：Vue样式加载器 -> CSS解析 -> PostCSS处理 -> LESS编译
            use: [
                'vue-style-loader', // Vue专用样式加载器，支持热更新
                'css-loader',       // 解析CSS文件中的import/require语句
                'postcss-loader',   // PostCSS处理（自动前缀等）
                {
                    // LESS编译器
                    loader: 'less-loader',
                    options: { 
                        // LESS编译选项
                        lessOptions: { 
                            // 允许在LESS中使用JavaScript（谨慎使用）
                            javascriptEnabled: true 
                        } 
                    }
                }
            ]
        },
        // 通用样式（非.self）- Stylus
        {
            // 匹配 .styl 文件（不包括 .self.styl），用于组件内部Stylus样式
            test: /\.styl$/,
            // 排除 .self.styl 文件和 node_modules 中的样式
            exclude: [/\.self\.styl$/, /node_modules/],
            // 样式处理链：Vue样式加载器 -> CSS解析 -> PostCSS处理 -> Stylus编译
            use: [
                'vue-style-loader', // Vue专用样式加载器，支持热更新
                'css-loader',       // 解析CSS文件中的import/require语句
                'postcss-loader',   // PostCSS处理（自动前缀等）
                'stylus-loader'     // Stylus编译器
            ]
        }
    ];
};
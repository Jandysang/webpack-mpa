
const path = require('path');

module.exports = () => [
    // 第一步处理react的tsx
    {
        test: /\.react\.tsx$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        ['@babel/preset-react', { runtime: 'automatic' }],
                        '@babel/preset-typescript'
                    ],
                    plugins: [
                        '@babel/plugin-transform-runtime'
                    ]
                }
            },
            {
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    configFile: path.resolve(process.cwd(), 'tsconfig.react.json')
                }
            }
        ]
    },
    // 第二步 处理vue的tsx
    {
        test: /\.tsx$/,
        exclude: [/node_modules/, /\.react\.tsx$/],
        use: [
            {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-typescript'
                    ],
                    plugins: [
                        // 使用 Vue 3 的 JSX 插件
                        ['@vue/babel-plugin-jsx', {
                            transformOn: true, // 转换 onXXX 事件处理器
                            enableObjectSlots: true, // 启用对象插槽
                        }],
                        '@babel/plugin-transform-runtime'
                    ]
                }
            },
            {
                loader: 'ts-loader',
                options: {
                    transpileOnly: true, // 只编译不检查类型，提高构建速度
                    configFile: path.resolve(process.cwd(), 'tsconfig.vue.json') // 指定 tsconfig.json 路径
                }
            }
        ]
    },
    // 第三步 处理react的ts
    {
        test: /\.react\.ts$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        ['@babel/preset-react', { runtime: 'automatic' }],
                        '@babel/preset-typescript'
                    ],
                    plugins: [
                        '@babel/plugin-transform-runtime'
                    ]
                }
            },
            {
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    configFile: path.resolve(process.cwd(), 'tsconfig.react.json')
                }
            }
        ]
    },
    // 第四步 处理vue的ts
    {
        test: /\.ts$/,
        exclude: [/node_modules/, /\.react\.ts$/],
        use: [
            {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-typescript'
                    ],
                    plugins: [
                        // 使用 Vue 3 的 JSX 插件
                        ['@vue/babel-plugin-jsx', {
                            transformOn: true, // 转换 onXXX 事件处理器
                            enableObjectSlots: true, // 启用对象插槽
                        }],
                        '@babel/plugin-transform-runtime'
                    ]
                }
            },
            {
                loader: 'ts-loader',
                options: {
                    transpileOnly: true, // 只编译不检查类型，提高构建速度
                    configFile: path.resolve(process.cwd(), 'tsconfig.vue.json') // 指定 tsconfig.json 路径
                }
            }
        ]
    },
    // 第五步 处理react的jsx
    {
        test: /\.react\.jsx$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    '@babel/preset-env',
                    ['@babel/preset-react', { runtime: 'automatic' }]
                ],
                plugins: [
                    '@babel/plugin-transform-runtime'
                ]
            }
        }
    },
    // 第六步 处理vue的jsx
    {
        test: /\.jsx$/,
        exclude: [/node_modules/, /\.react\.jsx$/],
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    '@babel/preset-env',
                    ['@babel/preset-react', { runtime: 'automatic' }] // 支持 JSX
                ],
                plugins: [
                    '@babel/plugin-transform-runtime'
                ]
            }
        }
    },

    // 第七步 处理react的js
    {
        test: /\.react\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    '@babel/preset-env',
                    ['@babel/preset-react', { runtime: 'automatic' }]
                ],
                plugins: [
                    '@babel/plugin-transform-runtime'
                ]
            }
        }
    },

    // 第八步 处理vue的js
    {
        test: /\.js$/,
        exclude: [/node_modules/, /\.react\.js$/],
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    '@babel/preset-env',
                    ['@babel/preset-react', { runtime: 'automatic' }] // 支持 JSX
                ],
                plugins: [
                    '@babel/plugin-transform-runtime'
                ]
            }
        }
    },
]
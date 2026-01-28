module.exports = (publicPath = '/') => [
    // 处理图片资源
    {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 2 * 1024, // 小于5kb的图片转为base64
                    name: 'images/[name]-[hash:16].[ext]', // 对应 Webpack 4 的 name 配置，输出到 dist/images/
                    publicPath: publicPath // 可选：配置资源的公共访问路径
                }
            }
        ]
    },

    // 处理字体资源
    {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        use: [{
            loader: 'url-loader',
            options: {
                // 小于2k 压缩，大于2k的用文件
                limit: 1024 * 2,
                name: 'fonts/[name]-[hash:16].[ext]',
                publicPath: publicPath
            }
        }],
    },
    // 处理音频和视频文件
    {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
        use: [{
            loader: 'url-loader',
            options: {
                name: 'media/[name]-[hash:16].[ext]',
                publicPath: publicPath
            }
        }],
    }
]
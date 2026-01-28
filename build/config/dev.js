const path = require('path');
const fs = require('fs');

// 自定义插件来调试 rule 匹配
class RuleDebugPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('RuleDebugPlugin', (compilation) => {
      compilation.hooks.buildModule.tap('RuleDebugPlugin', (module) => {
        // console.log(`\n=== Module Building: ${module.resource} ===`);
        
        // 获取模块使用的 loader
        const loaders = module.loaders || [];
        // console.log('Applied loaders:');
        loaders.forEach((loader, index) => {
          console.log(`  ${index + 1}. ${loader.loader}?${JSON.stringify(loader.options || {})}`, JSON.stringify(loader));
        });
      });
    });
  }
}


module.exports = {
    devtool: 'cheap-module-source-map', // 开发环境源码映射
    devServer: {
        port: 8080,
        open: true,
        hot: true,
        historyApiFallback: {
            //path.resolve(process.cwd(), './tsconfig.json')
            rewrites: fs.existsSync(path.resolve(process.cwd(), './src/pages'))
                ? fs.readdirSync(path.resolve(process.cwd(), './src/pages')).filter(item => {
                    return fs.statSync(path.join(process.cwd(), './src/pages', item)).isDirectory();
                }).map(page => {
                    return { from: new RegExp(`^/${page}/.*`), to: `/${page}/index.html` };
                })
                : []
        },
        client: { overlay: { errors: true, warnings: false } }
    },
    plugins: [
        new RuleDebugPlugin(),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
                common: {
                    name: 'common',
                    minChunks: 2,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
}
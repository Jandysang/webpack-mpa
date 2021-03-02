const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')
const consola = require('consola')

const resolve = pathUrl => path.resolve(process.cwd(), pathUrl)

let handlers = {};
let pages = []
let config = {}
try {
    fs.statSync(resolve('./project.config.json'))
    config = require(path.relative(__dirname, './project.config.json'))
    //多入口
    Object.keys(config.handlers).map((handler) => {
        handlers[handler] = resolve(config.handlers[handler])
    });

    Object.keys(config.pages).map((page) => {
        let pagePath = resolve(config.pages[page]['path'])
        pages.push(new HtmlWebpackPlugin({
            filename: `${page}.html`,
            template: `${pagePath}`,
            chunks: config.pages[page]['chunks']
        }))
    })
} catch (e) {
    consola.error(e)
}


module.exports = {
    handlers,
    pages
}
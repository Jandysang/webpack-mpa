# webpack-mpa<br/>
多页面无服务站点解决方案

## 作者

sangming12@sina.cn


## 初次创建时间

2021-01-28

## 技术点描述

### 1、背景

  * 现在主流的前端单页面应用，对后端不太友好；
  * 不太喜欢vue的ssr或generator；
  * 很多开发习惯于用jQuery、bootstrap或者asp.net、python等传统开发模式
  * 于是为了这个目的，我构建了多页面应用解决方案

### 2、解决方案描述

  * webpack4
  * ts-loader（typescript）
  * less-loader、sass-loader、stylus-loader
  * handlerbars-loader、ejs-loader

## 初始化/快速上手

```js
  npm config set registry https://registry.npm.taobao.org

  npm install

  npm run dev

  /*用于构建生产环境代码*/
  npm run build
```

## 多页面如何配置

  * 根目录下新建新建‘project.config.json’文件;内容示例如下：

```js
    {
        "pages": { /* 用于生成页面数枚举 */
            "home": { //将生成‘home.html’的页面
                "path": "./src/pages/home/index.hbs", //生成'home.html'页面的主入口
                "chunks": ["common","home"] //当前'home.html'需要用到的脚本（见：handlers的枚举），样式、图片、字体等资源，根据页面或脚本import/src等方式按需导出
            },
            "a": { //将生成‘a.html’的页面
                "path": "./src/pages/a/a.hbs", //生成'a.html'页面的主入口
                "chunks": ["common","a"] //生成'a.html'用到脚本入口（见：handlers），样式、图片、字体等资源，根据页面或脚本import/src等方式按需导出
            }
        },
        "handlers": { //用于生成多脚本（资源）数枚举
            "common": "./src/main.js", //生成common.js(包含样式、图片、字体等)主入口
            "home": "./src/handlers/home/home.js",//生成home.js(包含样式、图片、字体等)主入口
            "a": "./src/handlers/a/a.js"//生成home.js(包含样式、图片、字体等)主入口
        }
    }
```

## 案例

pushplus推送加: https://www.pushplus.plus/

shareplus互联网分享平台: https://www.shareplus.plus/

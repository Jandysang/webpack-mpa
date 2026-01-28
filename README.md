# Webpack 5 多框架多页面构建系统

基于 Webpack 5 的现代化前端项目构建系统，支持多种框架的多页面开发，可根据不同页面需求选择合适的开发方式。

## 特性

- ✅ **多页面应用**：自动生成多页面入口
- ✅ **多框架支持**：EJS + jQuery、Vue 3、React
- ✅ **SEO 优化**：EJS 页面天然支持 SEO
- ✅ **开发效率**：Vue/React 提供高效开发体验
- ✅ **现代构建优化**：代码分割、压缩优化
- ✅ **环境变量管理**：灵活的环境配置
- ✅ **热更新开发**：提升开发体验
- ✅ **CSS 预处理器**：支持 SCSS、LESS、Stylus

## 环境与依赖
- **Node.js 版本**: `>=20.0.0`
- **npm 版本**: `>=8.0.0`
- **webpack 版本**: `>=5.100.0`

## 安装依赖

```bash
npm install
```

## 开发模式

```bash
# 启动开发服务器
npm run dev

# 或指定环境
NODE_ENV=development npm run dev
```

开发服务器特性：
- 端口：8080
- 热更新：开启
- 源码映射：cheap-module-source-map

## 构建生产版本

```bash
# 构建生产版本
npm run build

# 或指定环境
NODE_ENV=production npm run build
```

## 开发策略选择指南

### 1. SEO 关键页面 → EJS + jQuery

适用于需要 SEO 且用于引流的关键页面：

```
src/
└── pages/
    ├── home/              # 首页（SEO 重要）
    │   ├── index.ejs      # EJS 模板（SSG 效果）
    │   ├── index.js       # jQuery 逻辑
    │   └── styles.scss    # 样式
    └── about/             # 关于我们（SEO 重要）
        ├── index.ejs
        ├── index.js
        └── styles.less
```

**优势**：
- 天然支持 SEO，内容在构建时生成
- 静态页面，加载速度快
- 适合搜索引擎抓取

### 2. 高效开发页面 → Vue 3/React SPA

适用于内部功能页面，注重开发效率：

```
src/
└── pages/
    ├── dashboard/         # 仪表盘（开发效率重要）
    │   ├── index.vue      # Vue 单文件组件
    │   └── main.js        # Vue 入口
    └── admin/             # 管理后台（开发效率重要）
        ├── index.react.tsx # React 组件
        └── main.tsx       # React 入口
```

**优势**：
- 响应式数据绑定，开发效率高
- 组件化开发，易于维护
- 丰富的生态系统

## 框架支持详情

### EJS + jQuery（SSG 类似效果）

- **文件扩展名**：`.ejs` 模板文件 + `.js` 逻辑文件
- **SEO 优势**：内容在构建时生成，天然 SEO 友好
- **性能特点**：首屏加载快，适合营销页面

### Vue 3 SPA

- **文件扩展名**：`.vue` 单文件组件、`.tsx` Vue JSX
- **开发体验**：响应式数据绑定，组件化开发
- **适用场景**：管理系统、后台界面

### React SPA

- **文件扩展名**：`.react.jsx`、`.react.tsx`
- **生态系统**：丰富的第三方库
- **适用场景**：复杂交互应用、组件库

## 项目约定

### 入口文件命名规则

- **EJS 页面**：[index.ejs] + [index.js/index.ts]
- **Vue 页面**：[index.html/index.ejs]+ [index.js/index.jsx/index.ts/index.tsx]
- **React 页面**：[index.html/index.ejs]+[index.react.js/index.react.jsx/index.react.tsx/index.react.ts]

### 页面目录结构示例

```
src/
└── pages/
    ├── landing/           # 营销页面（SEO 重要 → EJS+jQuery）
    │   ├── index.ejs      # EJS 模板
    │   ├── index.js       # 业务逻辑
    │   └── styles.scss    # 样式
    ├── dashboard/         # 仪表盘（开发效率重要 → Vue）
    │   ├── index.vue      # Vue 组件
    │   └── main.js        # Vue 入口
    └── admin/             # 管理后台（开发效率重要 → React）
        ├── index.react.tsx # React 组件
        └── main.tsx       # React 入口
```

## 框架选择最佳实践

### SEO 关键页面（使用 EJS + jQuery）

当页面需要：
- 良好的搜索引擎排名
- 快速的首屏加载
- 静态内容展示

```ejs
<!-- src/pages/home/index.ejs -->
<!DOCTYPE html>
<html>
<head>
    <title>首页 - 我的网站</title>
</head>
<body>
    <header>
        <h1>欢迎来到我的网站</h1>
    </header>
    <main>
        <p>这里是首页内容，搜索引擎可以直接抓取</p>
    </main>
    <script src="./index.js"></script>
</body>
</html>
```

### 高效开发页面（使用 Vue/React）

当页面需要：
- 复杂的用户交互
- 响应式数据绑定
- 组件化开发

```vue
<!-- src/pages/dashboard/index.vue -->
<template>
  <div class="dashboard">
    <h1>{{ title }}</h1>
    <div v-for="item in items" :key="item.id">
      {{ item.name }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '仪表盘',
      items: []
    }
  }
}
</script>
```

## 环境变量配置

项目支持 `.env` 文件配置环境变量：

```bash
# .env (基础环境)
BASE_PATH=/

# .env.development (开发环境)
BASE_PATH=http://localhost:8080/

# .env.production (生产环境)
BASE_PATH=https://example.com/
```

## 构建优化


### 代码分割策略

- **vendor**: 第三方库打包
- **shared**: 多次引用的公共模块
- **common**: 默认公共模块

### 生产环境优化

- JavaScript 压缩（Terser）
- CSS 压缩（CssMinimizerPlugin）
- 移除 console 和 debugger
- 资源哈希命名


## 资源处理

### 图片资源

- 小于 2KB 的图片自动转为 Base64
- 输出到 `dist/images/` 目录

### 字体资源

- 小于 2KB 的字体文件转为 Base64
- 输出到 `dist/fonts/` 目录

### 媒体文件

- 音频/视频文件输出到 `dist/media/` 目录

## 样式处理

支持多种 CSS 预处理器：

- **CSS**：原生 CSS 和模块化 CSS
- **SCSS/SASS**：Sass 预处理器
- **LESS**：Less 预处理器
- **Stylus**：Stylus 预处理器

## 策略总结

### 混合开发策略

| 页面类型 | 框架选择 | 适用场景 | 优势 |
|---------|---------|----------|------|
| SEO 关键页面 | EJS + jQuery | 首页、产品页、营销页 | 天然 SEO 友好，静态生成 |
| 高效开发页面 | Vue 3/React SPA | 管理后台、仪表盘、内部系统 | 开发效率高，组件化 |

### 纯 SPA 项目

如果所有页面都需要使用统一框架：
- **Vue 项目**：使用 Nuxt.js 进行 SSG
- **React 项目**：使用 Next.js 进行 SSG

## 插件系统

- **VueLoaderPlugin**: Vue 文件处理
- **MiniCssExtractPlugin**: CSS 提取
- **CopyPlugin**: 静态资源复制
- **HtmlWebpackPlugin**: HTML 生成
- **DefinePlugin**: 环境变量注入

## 自定义配置

如需自定义配置，可在项目根目录创建 [webpack.config.js](file:///Users/sangyoutao/minespace/ink-qrcode-portal-web/webpack.config.js) 文件并使用 `webpack-merge` 扩展配置。

## 案例
- **pushplus推送加**: https://www.pushplus.plus/
- **shareplus互联网分享平台**: https://www.shareplus.plus/
- **ddnstorage**: https://www.ddnstorage.com.cn/

## 常见问题

### 1. 框架选择建议

- **SEO 关键页面**：EJS + jQuery（天然 SSG 效果）
- **高效开发页面**：Vue 3/React（SPA 模式）

### 2. 环境变量不生效

检查 `.env` 文件路径和变量命名是否正确。

### 3. 多页面路由问题

开发环境下会根据 `src/pages` 目录结构自动生成路由重写规则。

## 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。

## 许可证

MIT License
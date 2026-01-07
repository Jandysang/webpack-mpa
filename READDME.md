# Webpack5 多框架多页面项目说明文档
## 一、项目概述
本项目基于 Webpack5 搭建，支持 Vue3、React、AngularJS 多框架共存，采用「约定优于配置」的设计理念，实现不同框架代码隔离、样式隔离，同时兼容 SCSS/LESS/Stylus 等预处理器，适用于复杂多页面应用开发。

### 1.1 核心特性
- **多框架支持**：Vue3（JSX/单文件组件）、React（18+ JSX）、AngularJS 共存，互不干扰
- **样式隔离**：通过 `.self` 后缀区分全局样式与 Vue 组件内样式，避免 vue-style-loader 冲突
- **预处理器兼容**：支持 SCSS/SASS、LESS、Stylus，自动匹配对应 loader 编译
- **多页面自动构建**：遍历 `src/pages` 目录自动生成入口和 HTML，无需手动配置
- **版本兼容**：Vue3 + React18 + Webpack5 稳定适配，规避版本冲突问题
- **优化配置**：代码分割、缓存策略、热更新、路径别名等生产级优化
- **模板引擎选型**：放弃 `handlebars-loader`，统一采用 EJS 作为静态模板编译引擎（适配多框架场景）

### 1.2 目录结构
```plaintext
project-root/
├── src/
│   ├── assets/          # 全局静态资源（图片、字体等）
│   ├── common/          # 通用代码（工具函数、全局样式）
│   │   ├── style/       # 全局样式（需加 .self 后缀）
│   │   │   ├── common.self.scss  # 全局SCSS样式
│   │   │   └── reset.self.less   # 全局LESS样式
│   ├── pages/           # 多页面目录（核心）
│   │   ├── vue3/        # Vue3页面示例
│   │   │   ├── App.vue  # Vue单文件组件
│   │   │   ├── index.vue.js      # Vue入口文件（.vue.js后缀标识）
│   │   │   └── index.html        # 页面模板（EJS语法）
│   │   ├── react/       # React页面示例
│   │   │   ├── App.react.jsx     # React组件（.react.jsx后缀标识）
│   │   │   ├── index.react.js    # React入口文件（.react.js后缀标识）
│   │   │   └── index.html        # 页面模板（EJS语法）
│   │   ├── ejs-angular/    # AngularJS+EJS页面示例（替换原hbs目录）
│   │   │   ├── index.js          # 通用入口文件
│   │   │   └── index.ejs         # EJS模板文件（替代原hbs模板）
│   ├── utils/           # 工具函数目录
├── webpack.config.js    # Webpack核心配置文件
├── package.json         # 依赖配置
├── postcss.config.js    # PostCSS配置（自动前缀等）
└── README.md            # 项目说明文档
```

## 二、环境准备
### 2.1 依赖版本要求
- Node.js：v18+（推荐 v18.18.0 及以上，避免依赖安装失败）
- npm：v8+ 或 yarn：v1.22+

### 2.2 依赖安装
- 克隆项目后，进入项目根目录执行以下命令安装依赖：
```shell
# 安装所有依赖（推荐npm）
npm install
```
```shell
# 若依赖安装失败，可尝试清除缓存后重新安装
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

核心依赖说明（已在 package.json 中配置，无需手动安装）：
- 框架依赖：vue@3.2.47、react@18+、react-dom@18+、angular@1.8+
- 构建依赖：webpack@5.104.1、webpack-cli、webpack-dev-server、vue-loader@17.0.1、@vue/compiler-sfc@3.2.47、ejs-loader@0.5.0（替代handlebars-loader）
- 预处理器依赖：sass@1.44.0、sass-loader@14.0.0、less@4+、less-loader@12+、stylus@0.59+、stylus-loader@8+
- 插件依赖：html-webpack-plugin、mini-css-extract-plugin、copy-webpack-plugin 等

## 三、核心约定（必看）
项目采用「文件名后缀+目录约定」实现多框架隔离，所有开发需遵循以下规则，否则会导致编译异常。

### 3.1 入口文件约定
Webpack 自动遍历 `src/pages` 下的子目录，按以下优先级查找入口文件：
1. `index.js`：通用入口（无框架专属语法时使用）
2. `index.react.js`：React 页面专属入口（内部可写 React JSX 语法）
3. `index.vue.js`：Vue3 页面专属入口（内部可写 Vue JSX 语法）

示例：React 页面入口需命名为 `index.react.js`，Vue 页面入口需命名为 `index.vue.js`，确保框架识别正确。

### 3.2 组件文件约定
- Vue 组件：
  - 单文件组件：`.vue` 后缀（如 `App.vue`），支持 `<script setup>` 语法
  - JSX 组件：`.vue.jsx` 后缀（如 `Comp.vue.jsx`），自动按 Vue JSX 编译
- React 组件：`.react.jsx` 后缀（如 `App.react.jsx`），自动按 React JSX 编译，无需手动导入 React
- AngularJS 组件：无特殊后缀，写在对应页面目录的 `index.js` 中即可
- 模板文件：统一使用 `.ejs` 后缀（或直接在 `.html` 中嵌入 EJS 语法），替代原 Handlebars 模板

### 3.3 样式文件约定
- 全局样式必须加 `.self` 后缀（如 `common.self.scss`），否则可能被 vue-style-loader 处理导致冲突
- Vue 单文件组件内的样式无需加 `.self`，直接用 `scoped` 实现作用域隔离
- 引入样式时需对应后缀，如：`import '@/common/style/common.self.scss'`

## 四、开发指南
### 4.1 开发服务器启动
```shell
npm run dev
```
开发服务器特性：
- 访问路径：
  - Vue3 页面：`http://localhost:8080/vue3/`
  - React 页面：`http://localhost:8080/react/`
  - AngularJS+EJS 页面：`http://localhost:8080/ejs-angular/`
- 热更新：修改代码后自动刷新页面，无需手动重启
- 路由重写：支持 SPA 路由模式，刷新页面不 404
- 错误提示：页面编译错误会在浏览器顶部弹窗提示

### 4.2 新增页面（多页面扩展）
新增页面无需修改 Webpack 配置，只需在 `src/pages` 下新建目录，按约定创建入口文件和模板文件即可。

#### 示例1：新增 React 页面
1. 在 `src/pages` 下新建 `react-demo` 目录
2. 创建入口文件 `index.react.js`：
```javascript
// src/pages/react-demo/index.react.js
import { createRoot } from 'react-dom/client';
import App from './App.react.jsx';
import '@/common/style/common.self.scss'; // 引入全局样式

// 确保挂载点存在
const rootEl = document.getElementById('react-demo-root') || (() => {
  const div = document.createElement('div');
  div.id = 'react-demo-root';
  document.body.appendChild(div);
  return div;
})();

// 渲染React组件
createRoot(rootEl).render(<App />);
```
3. 创建 React 组件 `App.react.jsx`：
```jsx
// src/pages/react-demo/App.react.jsx
export default function App() {
  return (
    <div className="react-demo-page">
      <h1>新增React页面示例</h1>
      <p>按约定自动编译，无需修改Webpack配置</p>
    </div>
  );
}
```
4. 创建 EJS 模板文件 `index.html`：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title><%= pageTitle %></title> <!-- EJS动态渲染标题 -->
</head>
<body>
  <div id="react-demo-root"></div>
</body>
</html>
```
5. 启动开发服务器，访问 `http://localhost:8080/react-demo/` 即可看到新增页面

#### 示例2：新增 Vue3 页面
1. 在 `src/pages` 下新建 `vue-demo` 目录
2. 创建入口文件 `index.vue.js`：
```javascript
// src/pages/vue-demo/index.vue.js
import { createApp } from 'vue';
import App from './App.vue';
import '@/common/style/common.self.scss'; // 引入全局样式

const appEl = document.getElementById('vue-demo-app') || (() => {
  const div = document.createElement('div');
  div.id = 'vue-demo-app';
  document.body.appendChild(div);
  return div;
})();

createApp(App).mount(appEl);
```
3. 创建 Vue 单文件组件 `App.vue`：
```vue
<template>
  <div class="vue-demo-page">
    <h1>{{ title }}</h1>
    <button @click="changeTitle">修改标题</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const title = ref('新增Vue3页面示例');
const changeTitle = () => {
  title.value = '标题修改成功！';
};
</script>

<style scoped>
.vue-demo-page {
  padding: 20px;
  color: #42b983;
}
button {
  padding: 8px 16px;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```
4. 创建 EJS 模板文件 `index.html`，确保挂载点存在
5. 启动开发服务器，访问 `http://localhost:8080/vue-demo/` 即可

### 4.3 样式开发教程
#### 4.3.1 全局样式开发（React/AngularJS 页面）
全局样式文件需加 `.self` 后缀，放在 `src/common/style` 或对应页面目录下，引入后全局生效。
```scss
// src/common/style/common.self.scss（全局SCSS样式）
// 引入第三方样式（如UIkit）
@import "~uikit/src/scss/uikit-theme.scss";

// 自定义全局变量
$primary-color: #42b983;

// 全局样式
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

// 全局组件样式
.global-container {
  width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
```
在入口文件中引入：
```javascript
// src/pages/react/index.react.js
import '@/common/style/common.self.scss'; // 引入全局SCSS样式
```

#### 4.3.2 Vue 组件内样式开发
Vue 单文件组件内样式无需加 `.self`，支持 `scoped` 作用域隔离，避免样式污染。
```vue
<style scoped lang="scss">
// 支持SCSS语法，仅作用于当前组件
.vue-page {
  padding: 20px;
  h1 {
    color: $primary-color; // 可使用全局SCSS变量（需在全局样式中定义）
  }
}
</style>
```
若需在 Vue 组件内使用全局样式变量，可在 `src/common/style` 中创建变量文件，通过 `@use` 引入：
```scss
// src/common/style/variables.self.scss
$primary-color: #42b983;
$font-size-base: 14px;
```
```vue
<style scoped lang="scss">
@use '@/common/style/variables.self.scss' as vars;

.vue-page {
  font-size: vars.$font-size-base;
  color: vars.$primary-color;
}
</style>
```

### 4.4 预处理器使用
项目已配置 SCSS/SASS、LESS、Stylus 支持，按以下方式使用即可。
示例（LESS 全局样式）：
```less
// src/common/style/reset.self.less
@reset-color: #333;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: @reset-color;
}
```

### 4.5 EJS 模板使用教程（替代 Handlebars）
#### 4.5.1 基础语法
```ejs
<!-- 变量渲染 -->
<h1><%= pageTitle %></h1>
<!-- 条件判断 -->
<% if (isShow) { %>
  <div class="content">显示内容</div>
<% } %>
<!-- 循环渲染 -->
<ul>
  <% list.forEach(item => { %>
    <li><%= item.name %></li>
  <% }) %>
</ul>
<!-- 引入子模板 -->
<% include ./components/header.ejs %>
```

#### 4.5.2 动态数据传递（Webpack 配置）
在 `webpack.config.js` 中为 `html-webpack-plugin` 传递模板数据：
```javascript
new HtmlWebpackPlugin({
  filename: `${pageName}/index.html`,
  template: `${pagePath}/index.ejs`, // 指向EJS模板
  templateParameters: {
    pageTitle: `${pageName}页面`,
    isShow: true,
    list: [{ name: '选项1' }, { name: '选项2' }]
  },
  chunks: [pageName],
  minify: isProd
})
```

#### 4.5.3 运行时动态渲染 EJS
在业务代码中（如 XHR 回调）渲染 EJS 模板：
```javascript
import ejs from 'ejs';

// XHR成功回调
success: function (data) {
  if (data && data.list.length > 0) {
    const item = find(data.list, it => it.id == (query.id || ''));
    if (item && item.content) {
      // 编译EJS模板字符串
      const renderedHtml = ejs.render(item.content, { 
        data: item.data // 模板数据
      });
      $("#app").html(renderedHtml);
    }
  }
}
```

## 五、放弃 handlebars-loader 的核心理由
结合本项目「多框架共存、约定优于配置、低维护成本」的核心设计理念，经实际开发验证，`handlebars-loader` 存在以下无法适配的核心问题，因此决定放弃使用，统一采用 `ejs-loader` 作为静态模板编译引擎：

### 5.1 与多框架项目的「约定优于配置」理念冲突
本项目核心是通过「文件名后缀+目录约定」实现零配置扩展多页面/多框架，而 `handlebars-loader` 存在以下问题：
1. **子模板依赖复杂配置**：需手动配置 `partialDirs` 注册子模板，且路径需为绝对路径+通配符（如 `src/**/*`），破坏「约定优于配置」的设计，新增页面需修改 Webpack 配置，与项目多页面自动构建特性冲突；
2. **运行时/编译时模式割裂**：打包时需配置 `runtime: false` 输出静态 HTML，运行时（如 XHR 动态渲染）需切换为完整 Handlebars 引擎，且需手动注册动态子模板，与 Vue/React 运行时逻辑耦合，增加多框架维护成本；
3. **命名冲突风险**：子模板按「相对根目录路径」注册，多页面/多框架场景下易出现重名模板覆盖问题，而 EJS 直接通过相对路径引入子模板，无此风险。

### 5.2 编译异常频发，适配成本过高
在实际开发中，`handlebars-loader` 频繁出现以下无法根治的编译错误，严重影响开发效率：
1. **runtime-only 模式错误**：即使配置 `partialDirs`，仍频繁触发 `The partial xxx could not be compiled when running in runtime-only mode` 错误，需手动注册所有子模板，且开发环境热更新后注册失效；
2. **与 Webpack5 兼容性问题**：`handlebars-loader` 最新稳定版（v1.7.2）针对 Webpack5 的适配不完善，存在缓存机制冲突（修改模板后热更新不生效）、运行时依赖注入异常等问题；
3. **多框架样式隔离冲突**：Handlebars 模板编译时会注入运行时代码，与 Vue 的 `vue-style-loader` 存在样式作用域冲突，需额外配置 `skipRuntime` 等参数，破坏样式隔离约定。

### 5.3 开发效率与维护成本不匹配
对比 `ejs-loader`，`handlebars-loader` 存在以下效率问题：
1. **学习成本高**：Handlebars 采用「逻辑无」语法（如 `{{> partial}}`、`{{#each}}`），需额外学习专属语法，而 EJS 直接使用原生 JS 语法，Vue/React/AngularJS 开发者可零成本上手；
2. **调试成本高**：编译错误提示模糊（如仅提示「partial 编译失败」），无法定位具体模板文件/行号，而 EJS 错误提示直接指向语法错误位置；
3. **运行时体积大**：Handlebars 运行时需单独引入（约 15KB），且动态渲染需引入完整编译器（约 40KB），而 EJS 运行时仅 4KB，且语法与原生 JS 一致，无需额外学习成本。

### 5.4 功能冗余，无法发挥核心优势
Handlebars 的核心优势（前后端同构、逻辑与模板分离、内置 XSS 防护）在本项目中完全冗余：
1. **前后端同构非核心需求**：本项目模板渲染以前端静态编译+运行时动态渲染为主，无需后端（Node.js）渲染模板；
2. **XSS 防护可替代**：EJS 可通过 `ejs.render(data, { escape: true })` 实现 HTML 转义，且本项目已有全局 XSS 防护工具函数，无需依赖 Handlebars 内置能力；
3. **逻辑与模板分离无必要**：本项目框架层（Vue/React）已实现逻辑与视图分离，静态模板仅需简单的变量/循环/条件渲染，Handlebars 的「逻辑无」设计反而增加模板编写复杂度。

### 5.5 与现有生态的兼容性问题
1. **与 UI 库冲突**：本项目引入的 UIkit 等第三方 UI 库模板语法与 Handlebars 存在冲突（如 `{{ }}` 语法重叠），需额外转义，而 EJS 使用 `<% %>` 语法，无任何冲突；
2. **热更新适配差**：修改 Handlebars 模板后，Webpack 热更新需重启开发服务器才能生效，而 EJS 模板修改后实时刷新，符合本项目开发体验要求；
3. **多页面自动构建适配难**：遍历 `src/pages` 自动生成多页面时，Handlebars 需为每个页面单独配置 `partialDirs`，而 EJS 可直接通过 `html-webpack-plugin` 零配置编译，适配多页面自动构建逻辑。

## 六、打包构建
### 6.1 生产环境打包
执行以下命令构建生产环境代码，打包后的文件输出到 `dist` 目录：
```shell
npm run build
```

打包优化特性：
- 代码压缩：JS/CSS/HTML 自动压缩，移除注释和空白字符
- 资源哈希：文件名添加 contenthash，实现浏览器缓存优化
- 代码分割：第三方依赖（node_modules）单独打包为 `vendors.[hash].js`，避免重复打包
- 样式提取：生产环境将样式提取为单独 CSS 文件，而非注入 JS 中
- 静态资源处理：图片、字体等资源自动复制到 `dist/assets` 目录

### 6.2 打包后部署
打包后的 `dist` 目录可直接部署到 Nginx、Apache、OSS 等服务器，部署时注意：
- 确保服务器配置支持 HTML5 History 模式（避免 SPA 页面刷新 404）
- Nginx 配置示例：
```nginx
server {
  listen 80;
  server_name your-domain.com;
  root /path/to/dist; # 指向dist目录

  location / {
    try_files $uri $uri/ /index.html; # 支持SPA路由
  }

  # 按页面目录部署（多页面）
  location /vue3/ {
    try_files $uri $uri/ /vue3/index.html;
  }
  location /react/ {
    try_files $uri $uri/ /react/index.html;
  }
}
```

## 七、常见问题及解决方案
### 7.1 样式相关问题
| 问题现象 | 解决方案 |
|----------|----------|
| Vue 组件样式污染全局 | 确保组件内样式添加 `scoped` 属性，全局样式加 `.self` 后缀 |
| SCSS 全局变量无法在 Vue 组件内使用 | 通过 `@use '@/common/style/variables.self.scss' as vars` 显式引入 |
| 第三方样式（如 UIkit）未生效 | 确保在全局样式文件（.self.scss）中通过 `@import` 引入，且路径正确 |

### 7.2 框架相关问题
| 问题现象 | 解决方案 |
|----------|----------|
| React 组件报错「React is not defined」 | 确保 React 组件后缀为 `.react.jsx`，Webpack 已配置自动导入 React |
| Vue 单文件组件编译失败 | 检查 `@vue/compiler-sfc` 版本与 `vue` 版本一致（均为 3.2.47） |
| AngularJS 双向绑定失效 | 确保 AngularJS 挂载点在 EJS 模板中提前定义，且入口文件正确引入 angular |

### 7.3 模板相关问题（EJS）
| 问题现象 | 解决方案 |
|----------|----------|
| EJS 模板变量未渲染 | 检查 `html-webpack-plugin` 的 `templateParameters` 是否传递对应数据 |
| 子模板引入失败 | 使用相对路径引入（如 `<% include ./components/header.ejs %>`），确保文件存在 |
| 运行时渲染 EJS 语法错误 | 确保模板字符串语法正确，数据结构与模板变量匹配，可通过 `ejs.compile()` 提前编译排查 |

### 7.4 构建相关问题
| 问题现象 | 解决方案 |
|----------|----------|
| 开发服务器热更新不生效 | 确保 `webpack-dev-server` 配置 `hot: true`，且未开启 `cache` 配置 |
| 生产打包后页面空白 | 检查 `html-webpack-plugin` 的 `chunks` 配置是否正确，确保入口 JS 已打包 |
| 静态资源 404 | 确保 `output.publicPath` 配置正确，生产环境建议配置为绝对路径 |

## 八、维护说明
1. **依赖版本锁定**：核心依赖（Vue3/React18/Webpack5/ejs-loader）已在 `package.json` 中锁定版本，避免自动升级导致兼容问题；
2. **新增框架适配**：如需新增框架（如 Svelte），只需在 Webpack 配置中新增对应 loader 规则，遵循「文件名后缀约定」即可，无需修改核心逻辑；
3. **模板引擎扩展**：若后续需切换模板引擎，只需修改 `html-webpack-plugin` 的 `template` 配置和 loader 规则，业务代码无需调整；
4. **定期维护**：每季度更新依赖版本，验证多框架/多页面编译稳定性，更新常见问题解决方案。

## 九、联系方式
若遇到无法解决的问题，可联系项目维护者协助处理，确保项目正常开发。

## 总结
### 核心关键点回顾
1. 项目放弃 `handlebars-loader` 的核心原因是其配置复杂、编译异常频发、与「约定优于配置」理念冲突，且核心优势在本项目中冗余；
2. 统一采用 `ejs-loader` 实现静态模板编译，其原生 JS 语法、零配置子模板引入、与多框架/多页面自动构建的适配性更符合项目需求；
3. 开发时遵循「文件名后缀+目录约定」即可实现多框架/多页面扩展，无需修改 Webpack 核心配置，降低维护成本。
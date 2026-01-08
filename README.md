
# Webpack5 多框架多页面项目说明

## 一、项目简介
本项目基于 **Webpack5** 搭建，支持 **Vue3、React、AngularJS** 多框架共存，采用 **「约定优于配置」** 设计，实现：
- 不同框架代码 & 样式隔离  
- 兼容 SCSS / LESS / Stylus 预处理器  
- 多页面自动构建（遍历 `src/pages` 生成入口和 HTML）  
- 静态构建 + Runtime 动态修改 HTML（比 SSR 简单、速度快、SEO 友好）  

> **适用场景**：复杂多页面应用、需要兼容低版本浏览器 + 高性能交互并存的项目。

---

## 二、核心特性
- ✅ 多框架支持：Vue3（JSX / SFC）、React18（JSX）、AngularJS 共存  
- ✅ 样式隔离：全局样式加 `.self` 后缀，Vue 组件用 `scoped`  
- ✅ 预处理器：SCSS / LESS / Stylus 自动编译  
- ✅ 多页面自动构建：新增页面无需改 Webpack 配置  
- ✅ 模板引擎：**EJS**（编译期）+ 可选 **Handlebars**（运行时）  
- ✅ 生产优化：代码分割、缓存、资源哈希、样式提取  

---

## 三、目录结构（核心）

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

## 四、快速开始

### 1. 环境
- Node.js：v18+（推荐 v18.18.0 及以上，避免依赖安装失败）
- npm：v8+ 或 yarn：v1.22+

```shell
  npm install
  npm run dev   # 启动开发服务器
  npm run build # 生产打包
```
### 2. 访问路径
- Vue3 页面 → `http://localhost:8080/vue3/`  
- React 页面 → `http://localhost:8080/react/`  
- AngularJS 页面 → `http://localhost:8080/ejs-angular/`

---

## 五、开发约定（必看）
### 入口文件命名
Webpack 自动找入口（优先级）：
1. `index.js`（通用）  
2. `index.react.js`（React）  
3. `index.vue.js`（Vue3）

### 组件文件命名
- Vue 单文件组件 → `.vue`  
- Vue JSX 组件 → `.vue.jsx`  
- React 组件 → `.react.jsx`  
- AngularJS → 写在 `index.js`  
- 模板 → 统一 `.ejs`（可内嵌 EJS 语法）

### 样式文件
- 全局样式 → 加 `.self` 后缀（`common.self.scss`）  
- Vue 组件样式 → 用 `scoped`，不加 `.self`

---

## 六、新增页面示例
### React 页面
1. `src/pages/react-demo/index.react.js`（入口）  
2. `App.react.jsx`（组件）  
3. `index.html`（EJS 模板，含挂载点）  
访问：`http://localhost:8080/react-demo/`

### Vue3 页面
1. `src/pages/vue-demo/index.vue.js`（入口）  
2. `App.vue`（SFC）  
3. `index.html`（EJS 模板）  
访问：`http://localhost:8080/vue-demo/`

> 无需改 Webpack 配置，按目录和命名约定即可自动构建。

---

## 七、样式与预处理器
- 全局样式在 `common/style`，引入时带 `.self` 后缀  
- Vue 组件内样式用 `scoped`，可用 `@use` 引入全局变量  
- 预处理器按文件后缀自动匹配 loader（SCSS / LESS / Stylus）

---

## 八、模板引擎选择
- **编译期**：统一用 **EJS**（简单、JS 语法、零配置子模板、多框架友好）  
- **放弃 handlebars-loader 原因**：配置复杂、与 Webpack5/多框架冲突、热更新差  
- **运行时**：仍可在业务代码里引入 Handlebars 做动态渲染（如 AJAX 返回模板字符串）

---

## 九、静态构建 + Runtime 动态修改 HTML
本方案特点：
- 构建时生成完整 HTML（SEO 友好）  
- 运行时用 JS（jQuery / Vue / React / Angular / EJS / Handlebars）修改 DOM  
- 比 SSR 简单、部署成本低、首屏快  
- 适合：首屏直出 + 后续交互复杂的场景

---

## 十、如果全用 Vue 做多页面？
可考虑 **Vite + Vue3 的 SSG（静态站点生成）** 方案：
- 文档参考：[Vite 官方 SSG 指南](https://vitejs.dev/guide/ssr.html#ssg)  
- Vue 专用 SSG 方案：[Vitesse](https://github.com/vuejs/vitesse)（社区模板，支持多页面/SSG）

---

## 十一、React / Angular 的 SSG 方案
- **React**：  
  - Next.js（支持 SSG/ISR）[官网](https://nextjs.org/docs/basic-features/data-fetching/static-site-generation)  
  - Gatsby [官网](https://www.gatsbyjs.com/docs/)
- **Angular**：  
  - Angular Universal（支持 SSG）[官网](https://angular.io/guide/universal)  
  - Scully（Angular 专用 SSG）[官网](https://scully.io/)

---

## 十二、常见问题速查
| 问题 | 解决 |
|------|------|
| Vue 样式污染 | 加 `scoped`，全局样式加 `.self` |
| React 报 React is not defined | 用 `.react.jsx` 后缀，Webpack 会自动引入 React |
| EJS 变量未渲染 | 检查 `html-webpack-plugin` 的 `templateParameters` |
| 生产打包页面空白 | 检查 `chunks` 配置和资源路径 |

---

## 十三、总结
- 本项目 = **Webpack5 多框架多页面 + EJS 编译期模板 + Runtime 动态渲染**  
- 静态构建保证 SEO 与首屏速度，Runtime 动态渲染满足复杂交互  
- 放弃 handlebars-loader 因 EJS 更简单、适配多框架更好  
- 全 Vue 多页面可考虑 Vite + SSG；React/Angular 也有成熟 SSG 方案  
- 遵循命名约定即可零配置扩展页面，维护成本低

# 【Vite】认识 Vite👌

**Vite 是什么**

是脚手架？是构建工具？

首先搞清楚这两者的定义：

1. 脚手架：帮助我们**搭建开发环境的项目代码**的工具
2. 构建工具：将代码从**开发环境构建到生产环境**

### 构建工具的发展

1. 第一代构建工具：以 npm scripts、grunt、gulp 为代表的构建工具，这一代构建工具所做的事情主要就是**编译、合并以及压缩**等工作。
2. 第二代构建工具：以 browserify、_webpack_、parcel、_rollup_ 为代表的构建工具。这一代构建工具加强了对模块的处理，能够对**模块的依赖关系**进行处理，对**模块进行合并打包**。
3. 第三代构建工具：主要就是往“**绣化**”的方向发展。就是使用 Rust 将前端工具链全部重构一遍（之前的工具都是用 js 书写运行在 node 环境中的）
    - Babel —> swc
    - PostCSS —> lightingCSS
    - Electron —> Tauri
    - ESLint —-> dprint
    - Webpack —> Turbopack（Webpack 官方团队）、Rspack（字节）
    - rollup —> rolldown（尤雨溪）

### 脚手架的发展

脚手架本身是帮助开发者**搭建开发环境项目的工具**，但是**现代脚手架往往内置构建工具**

-   VueCLI(Vue2.x)：内置了 webpack 作为构建工具
-   CreateReactApp(React)：内置了 webpack 作为构建工具

现在脚手架和构建工具的界限比较模糊了，你可以认为构建工作是脚手架工具里面的一部分。

Vite 也是相同的情况：

1. 脚手架：可以搭建各种类型（Vue、React、Sevlte、Solid.js）的项目
2. 构建：包含两个构建工具（TODO:为什么要包含两个构建工具？）
    - esbuild：用于开发环境
    - rollup：用于生产环境

### Vite 核心原理

1. webpack 的痛点在哪里？
    - 在构建大型项目的时候，非常的慢
    - 因为在启动 webpack 项目的时候，**webpack 会先对项目进行打包，然后运行的是打包后的文件**
      ![](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-07-28-031130.png)
2. Vite 是如何解决的？
    - 完全**跳过打包步骤**，利用浏览器的 imports 机制，按需获取内容，即使项目规模的越来越大，启动时间基本不变，通过 HTTP 请求的方式来获取所需的模块（TODO:什么是浏览器的 imports 机制？）
      ![](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-07-28-031211.png)
    - 浏览器针对 .vue 这样的模块文件，需要做编译，编译为 JS 文件再返回给浏览器
      ![](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-11-07-124403.png)
    - 关于 Vite 中**热更新**的实现，底层实际上使用的是 **websocket** 来实现的。

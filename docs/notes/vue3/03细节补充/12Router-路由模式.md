# 【Router】路由模式 ✨

[[TOC]]

::: tip 要点速览

- 模式：`Hash`（基于 `#`，不发请求）、`HTML5 History`（无 `#`，需服务器回退）、`Memory`（非浏览器环境）。
- 选择：面向浏览器与静态托管选 `Hash`；需美观 URL 与 SEO 配置选 `History`；SSR/Node 环境选 `Memory`。
- Vue 用法：`createWebHashHistory`、`createWebHistory`、`createMemoryHistory`。
- 注意：`History` 刷新 404 需服务器回退到入口；`BASE_URL` 影响资源与路由前缀。

:::

## 动机与总览

前端路由的本质是<span style="color:red">在不刷新页面的情况下切换视图</span>。不同模式以不同方式驱动 URL 与视图的对应关系：

- `Hash`：依赖 URL 的 `#` 片段，变更不会向服务器发起请求。
- `HTML5 History`：使用 History API 更新地址栏，需后端配合回退路由。
- `Memory`：在非浏览器环境维护一份内存中的历史栈（如 SSR、Node）。

## Hash 模式

Hash 是 URL 的组成部分，例如：

```
https://www.example.com/path?key=value#anchor
```

其 `#` 后面的部分即为 Hash。早期常用于锚点导航

```html
<a href="#target">go target</a>
...
<div id="target">i am target place</div>
```

在上面代码中，点击 `<a>` 链接，文档会滚动到 id='target' 的 div 的位置。

Hash 另一个重要特性：<span style="color:red">Hash 的变化不会触发对服务器的请求</span>。

利用该特性可以实现不同 URL 映射不同的模块。

### 实战：使用 Hash 实现单页应用

```js :title=index.js :collapsed-lines
document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");

  const renderPage = (hash) => {
    switch (hash) {
      case "#home":
        content.innerHTML = "<h1>Home</h1>";
        break;
      case "#about":
        content.innerHTML = "<h1>About</h1>";
        break;
      case "#contact":
        content.innerHTML = "<h1>Contact</h1>";
        break;
      default:
        content.innerHTML = "<h1>404</h1>";
    }
  };

  window.addEventListener("hashchange", () => {
    renderPage(window.location.hash);
  });

  renderPage(window.location.hash || "#home");
});
```

```html
<body>
  <nav>
    <a href="#home">Home</a>
    <a href="#about">About</a>
    <a href="#contact">Contact</a>
  </nav>
  <div id="content"></div>
  <script src="./index.js"></script>
</body>
```

Vue-router 中如何使用 Hash 模式？

```js :title="router/index.js"
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    /* ... */
  ],
});
```

说明：`import.meta.env.BASE_URL` 为 Vite 的基础路径（开发默认 `'/'`，生产可在 `vite.config.ts` 的 `base` 配置）。

## HTML5 模式（History）

通过 History API 管理浏览器历史记录，实现“无 `#` 的美观 URL”：

1. `history.pushState(state, title, url)`：将一个状态推入到历史堆栈里面
2. `history.replaceState(state, title, url)`：替换当前历史堆栈最上面的状态
3. `window.onpopstate`：这是一个事件，当用户点击浏览器的前进或者后退按钮的时候，会触发该事件

### **History 实现原理**

::: info History 工作原理

1. 拦截链接点击事件
   - 客户端路由器会**拦截**页面上的**所有链接点击事件**（通常是通过阻止链接的默认行为 `event.preventDefault()`）
   - 取而代之的是，**路由器使用 history.pushState 或 history.replaceState 更新 URL**。
2. URL 变化处理:
   - 当 URL 变化时，路由器会捕捉到这个变化。
   - 路由器不会发出新的 HTTP 请求，而是根据新的 URL 查找预先定义好的路由规则，并加载相应的视图组件

举个例子，假设有一个单页应用，使用 history 模式，并且有以下路由规则：

- /home: 显示主页内容
- /about: 显示关于页面内容

当用户点击导航链接从 /home 切换到 /about 时，流程如下：

1. 用户点击链接 `<a href="/about">About</a>`
2. 路由器拦截点击事件，调用 `event.preventDefault()` 阻止浏览器的默认行为（即不发出 HTTP 请求）
3. 路由器调用 `history.pushState(null, "", "/about")` 更新浏览器的地址栏 URL 为 /about
4. 路由器检测到 URL 变化，查找路由规则，发现 /about 对应的视图组件
5. 路由器加载并渲染 /about 视图组件，将其插入到页面的特定位置

整个过程中，浏览器地址栏的 URL 更新了，但没有发出新的 HTTP 请求，所有的视图更新都是在客户端完成的。
:::

### 实战：使用 History 实现单页应用

```jsx :title=index.js :collapsed-lines
document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");

  const renderPage = (path) => {
    console.log(path, "path");
    switch (path) {
      case "/":
      case "/index.html":
        content.innerHTML = "<h1>Home</h1>";
        break;
      case "/about":
        content.innerHTML = "<h1>About</h1>";
        break;
      case "/contact":
        content.innerHTML = "<h1>Contact</h1>";
        break;
      default:
        content.innerHTML = "Not Found";
    }
  };

  document.querySelectorAll("a[data-link]").forEach((link) => {
    link.addEventListener("click", (e) => {
      // 阻止默认事件
      e.preventDefault();
      const path = e.target.getAttribute("href");
      // 推入到浏览器历史记录中
      history.pushState(null, null, path);
      renderPage(path);
    });
  });

  renderPage(window.location.pathname || "/");
});
```

```html :title=index.html :collapsed-lines
// index.html
<body>
  <nav>
    <a href="/" data-link> Home </a>
    <a href="/about" data-link> About </a>
    <a href="/contact" data-link> Contact </a>
  </nav>
  <div id="content"></div>
  <script src="./index.js"></script>
</body>
```

Vue-router 中如何使用 History 模式？

```js :title=router/index.js
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ...
  ],
});
```

### History 存在的问题

一旦刷新，就会报 404 错误。

思考 🤔 为什么会这样？

答案：当你刷新的时候，是会请求服务器的。但是服务器并没有这个后端路由，这个仅仅是一个前端路由。

要解决这个问题，需要在服务器上面做一些配置。**添加一个回退路由，如果 URL 不匹配任何的静态资源，回退到首页**。具体服务器配置可以参考[官方文档](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%85%8D%E7%BD%AE%E7%A4%BA%E4%BE%8B)

### Memory 模式

无论是 Hash 也好、History API 也好，本质上都是**基于浏览器的特性**来实现的。

而 Memory 模式**一般用于非浏览器环境**，例如 Node 或者 SSR. 因为是非浏览器环境，所以不会有 URL 交互也**不会自动触发初始导航**。

该模式用 `createMemoryHistory()` 创建，并且需要**在调用 app.use(router) 之后手动 push 到初始导航**。

```js
import { createRouter, createMemoryHistory } from "vue-router";
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    /* ... */
  ],
});
```

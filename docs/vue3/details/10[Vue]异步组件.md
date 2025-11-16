# 【Vue】异步组件 👌

[[TOC]]

::: tip 要点速览

- 定义：按需加载的组件，通过延迟加载降低首屏体积与初始化开销。
- 用法：`defineAsyncComponent(() => import('./MyComp.vue'))` 返回一个可直接使用的组件。
- 体验：可配置 `loadingComponent/errorComponent/delay/timeout` 优化加载体验。
- 组织：支持全局注册或在父组件中内联定义；常与 `Suspense` 搭配。
- 场景：路由页面、体积较大或低频使用的组件、后台管理模块等。

:::

## 动机与定义

在应用启动阶段同步导入大量组件会增加首屏体积与加载时间。异步组件通过在“被需要时”才加载的方式，将代码拆分为独立块并按需获取，从而改善性能与交互体验。

## 基本用法

```js
import { defineAsyncComponent } from "vue";

const AsyncCom = defineAsyncComponent(() => import("./MyCom.vue"));
```

也可使用工厂函数手动返回一个 Promise：

```js
import { defineAsyncComponent } from "vue";

const AsyncCom = defineAsyncComponent(
  () =>
    new Promise((resolve) => {
      resolve(/* 组件模块 */);
    })
);
```

## 快速上手

```
src/
├── components/
│   ├── Home.vue
│   └── About.vue
├── App.vue
└── main.js
```

同步导入的写法会在应用启动时加载所有页面组件：

```vue
<template>
  <div id="app">
    <button @click="currentComponent = Home">访问主页</button>
    <button @click="currentComponent = About">访问关于</button>
    <component :is="currentComponent" v-if="currentComponent" />
  </div>
</template>

<script setup>
import { shallowRef } from "vue";
import Home from "./components/Home.vue";
import About from "./components/About.vue";
const currentComponent = shallowRef(null);
</script>
```

改为按需加载：

```vue
<template>
  <div id="app">
    <button @click="loadComponent('Home')">访问主页</button>
    <button @click="loadComponent('About')">访问关于</button>
    <component :is="currentComponent" v-if="currentComponent" />
  </div>
</template>

<script setup>
import { shallowRef, defineAsyncComponent } from "vue";
const currentComponent = shallowRef(null);
const loadComponent = (name) => {
  currentComponent.value = defineAsyncComponent(() =>
    import(`./components/${name}.vue`)
  );
};
</script>
```

<span style="color:red">`defineAsyncComponents`默认会缓存加载过的模块，避免重复加载。这意味着如果用户多次访问同一个组件，它只会被加载一次。</span>

现在组件只有在用户点击时才加载，实现了**懒加载与代码分割**。

## 相关细节

### 全局注册

```js
import { createApp, defineAsyncComponent } from "vue";
const app = createApp(/* ... */);
app.component(
  "MyComponent",
  defineAsyncComponent(() => import("./components/MyComponent.vue"))
);
```

### 在父组件中定义

```vue
<script setup>
import { defineAsyncComponent } from "vue";
const AdminPage = defineAsyncComponent(() =>
  import("./components/AdminPageComponent.vue")
);
</script>

<template>
  <AdminPage />
</template>
```

### 配置项

```js
import { defineAsyncComponent } from "vue";
const AsyncComp = defineAsyncComponent({
  loader: () => import("./Foo.vue"),
  loadingComponent: LoadingComponent,
  delay: 200,
  errorComponent: ErrorComponent,
  timeout: 3000,
});
```

配置项说明：

- `loader`：返回组件模块的异步函数；通常为 `() => import('...')`。
- `loadingComponent`：加载过程中展示的占位组件，配合 `delay` 避免闪烁。
- `delay`：展示 `loadingComponent` 的延迟（毫秒）；网络快时不显示占位以减少抖动。
- `errorComponent`：加载失败时展示的组件；与 `timeout`/`onError` 配合更友好。
- `timeout`：超时阈值（毫秒）；超过后视为失败，渲染 `errorComponent`。
- `suspensible`：是否参与 `Suspense`（默认 `true`）；设为 `false` 时不阻塞渲染，直接显示 loading。
- `onError(error, retry, fail, attempts)`：加载失败的重试钩子；可自定义重试策略。

高级用法（重试与取消）：

```js
import { defineAsyncComponent } from "vue";

const AsyncComp = defineAsyncComponent({
  loader: () => import("./Foo.vue"),
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 5000,
  suspensible: true,
  onError(error, retry, fail, attempts) {
    const max = 3;
    if (attempts <= max) {
      const wait = 1000 * attempts;
      setTimeout(() => retry(), wait);
    } else {
      fail();
    }
  },
});
```

## 常见误区与实践建议

- 忘记返回 Promise：loader 必须返回 `import()` 或其他 Promise。
- 过度切分：体积极小的组件不必异步化，避免产生过多请求。
- `loadingComponent` 闪烁：通过 `delay` 避免在快速网络下闪烁。
- 错误处理：提供 `errorComponent` 与合理的 `timeout`，并在控制台监控加载错误。

## 用户体验与性能

- 与路由按需加载结合：为页面组件做代码分割，减小首屏包体积。
- 预取与预加载：在用户可能访问前触发预取，缩短感知等待时间。
- 搭配 `Suspense`：在父层使用占位与回退内容，统一管理加载中的界面表现。

异步组件经常与内置组件 `Suspense` 搭配使用，以提供更平滑的用户体验。

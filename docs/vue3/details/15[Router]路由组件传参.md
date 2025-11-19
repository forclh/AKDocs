# 【Router】路由组件传参 ✨

[[TOC]]

::: tip 要点速览

- 目的：将路由参数以组件 `props` 传递，解耦组件与 `$route`。
- 模式：`props: true`（布尔）、`props: { ... }`（对象）、`props: (route) => ({ ... })`（函数）。
- 命名视图：为每个命名视图分别配置 `props` 映射。
- 插槽透传：在 `RouterView` 插槽中为渲染的组件统一传入附加 `props`。
- 类型建议：在函数模式中完成类型转换（如 `Number(route.params.id)`）。

:::

## 动机与定义

传统在组件中通过 `$route.params` 或 `useRoute()` 读取参数会令组件与路由强耦合，只能应用于特定 URL。将参数设置为组件的 `props` 能提升复用性与可测试性，使组件对路由实现不敏感。

## 快速上手

路由配置开启 `props`，组件声明对应 `props`：

```js
const routes = [
  {
    path: "/users/:userId(\\d+)",
    name: "User",
    component: User,
    props: true,
  },
];
```

```js
const props = defineProps({
  userId: { type: String, required: true },
});
```

## 相关细节

### 布尔模式

`props: true` 时，`route.params` 会作为同名 `props` 传入组件。命名视图需要分别为各视图配置 `props`：

```js
const routes = [
  {
    path: "/user/:id",
    components: { default: User, sidebar: Sidebar },
    props: { default: true, sidebar: false },
  },
];
```

### 对象模式

**静态对象**将原样作为组件 `props`，适用于固定的展示开关或配置：

```js
const routes = [
  {
    path: "/promotion",
    name: "Promotion",
    component: Promotion,
    props: { newsletter: true },
  },
];
```

### 函数模式

以函数接收 `route` 并返回 `props`，可进行类型转换与组合：

```js
const routes = [
  {
    path: "/search",
    component: Search,
    props: (route) => ({ query: route.query.q }),
  },
];
```

```vue
<template>
  <div id="app">
    <nav>
      <router-link to="/search?q=vue">Search</router-link>
    </nav>
    <router-view />
  </div>
</template>
```

### RouterView 插槽传参

在 `RouterView` 的插槽中统一为被渲染组件传入附加 `props`：

```vue
<RouterView v-slot="{ Component }">
  <component :is="Component" view-prop="value" />
</RouterView>
```

该方式会让所有视图组件均接收 `view-prop`，使用时需评估作用范围。

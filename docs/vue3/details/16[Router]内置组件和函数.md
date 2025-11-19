# 【Router】内置组件和函数 👌

[[TOC]]

::: tip 要点速览

- 内置组件：`RouterLink`（导航）、`RouterView`（视图出口，插槽提供 `Component/route`）。
- 激活类：`activeClass`（匹配子路径）、`exactActiveClass`（精确匹配）；默认 `router-link-active`/`router-link-exact-active`，可通过路由实例配置 `linkActiveClass`/`linkExactActiveClass`。
- 过渡与缓存：在 `RouterView` 插槽中组合 `Transition/KeepAlive` 控制过渡与缓存的范围与顺序。
- 模板引用：通过插槽把 `ref` 直接挂到当前视图组件，便于获取组件实例或元素引用。
- 内置函数：`useRouter/useRoute/useLink`，分别用于路由实例、当前路由与自定义导航组件。

:::

## 内置组件

### RouterLink

`RouterLink` 用于声明式导航，核心属性为 `to`。根据匹配结果自动添加激活类：

```vue
<template>
  <nav>
    <RouterLink to="/about" activeClass="my-active">About</RouterLink>
    <RouterLink to="/about" exactActiveClass="my-exact">About</RouterLink>
  </nav>
  <RouterView />
</template>
```

- 匹配规则：`activeClass` 在**指向路径与当前路由路径**匹配或为其祖先时生效；`exactActiveClass` 仅在精确相等时生效。
- 默认类名：`router-link-active` 与 `router-link-exact-active`；可在创建路由时通过 `linkActiveClass/linkExactActiveClass` 全局修改默认类名。

自定义渲染可使用 `custom` 插槽或 `useLink`（详见后文）：

```vue
<RouterLink
  to="/about"
  custom
  v-slot="{ href, navigate, isActive, isExactActive }"
>
  <a :href="href" @click.prevent="navigate">
    About
  </a>
</RouterLink>
```

### RouterView

`RouterView` 是路由出口。使用插槽可以获取当前匹配的组件并进行手动渲染或扩展：

```vue
<RouterView v-slot="{ Component }">
  <component :is="Component" />
</RouterView>
```

过渡与缓存的组合与顺序：

```vue
<RouterView v-slot="{ Component }">
  <Transition>
    <KeepAlive>
      <component :is="Component" />
    </KeepAlive>
  </Transition>
</RouterView>
```

模板引用可直接挂到视图组件上：

```vue
<RouterView v-slot="{ Component }">
  <component :is="Component" ref="mainContent" />
</RouterView>
```

命名视图可分别处理：

```vue
<RouterView name="sidebar" v-slot="{ Component }">
  <component :is="Component" />
</RouterView>
```

## 内置函数

### useRouter 与 useRoute

在组合式 API 中通过 `useRouter()` 获取路由实例，通过 `useRoute()` 获取当前路由：

```js
import { useRouter, useRoute } from "vue-router";

const router = useRouter(); // 拿到的就是整个路由实例
const route = useRoute(); // 拿到的是当前路由

function pushWithQuery(query) {
  router.push({
    name: "search",
    query: {
      ...route.query,
      ...query,
    },
  });
}
```

另外，在模板中可以直接访问 `$router` 和 `$route`，所以如果只在模板中使用这些对象的话，那就不需要 `useRouter` 或 `useRoute`.

### useLink（自定义导航）

`useLink` 用于构建自定义导航组件，返回链接的 `href`、匹配状态与导航方法：

```js
import { useLink } from "vue-router";

const props = { to: "/about" }; // 这里定义的props类似于RouterLink所有可以传递的props
const link = useLink(props);

function navigate() {
  link.navigate();
}
```

示例：自定义 `NavigationLink` 组件：

```vue :title="NavigationLink.vue"
<template>
  <a :href="link.href" @click.prevent="navigate">
    <slot />
  </a>
</template>

<script setup>
import { useLink } from "vue-router";

const props = defineProps({
  to: { type: String, required: true },
});

const link = useLink({ to: props.to });

function navigate() {
  link.navigate();
}
</script>
```

页面使用：

```vue :title="App.vue"
<template>
  <div id="app">
    <nav>
      <NavigateLink to="/">首页</NavigateLink>
      <NavigateLink to="/about">关于</NavigateLink>
      <NavigateLink to="/contact">联系</NavigateLink>
    </nav>
    <RouterView />
  </div>
</template>

<script setup>
import NavigateLink from "./components/NavigationLink.vue";
</script>
```

# ✨ KeepAlive 内置组件 👌

[[TOC]]

::: info 快速总览

- `KeepAlive` 是一个内置组件，用于“缓存不活动的组件实例”，避免重复销毁/创建。
- 常配合 `<router-view v-slot="{ Component }">` 或 `<component :is="...">` 动态组件一起使用。
- 关键 props：`include` / `exclude` 控制缓存范围，`max` 限制最大缓存数。
- 相关钩子：`onActivated` / `onDeactivated` 可感知组件被激活/停用。
  :::

::: tip component 元素
`component` 并非真正组件，而是模板语法的特殊元素（类似 `slot` / `template`）。用于渲染动态组件，最终在编译阶段被移除。文档：https://cn.vuejs.org/api/built-in-special-elements.html#component
:::

## 基本使用

在 `App.vue` 中为路由视图开启缓存：

```vue
<!-- App.vue -->
<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
```

上面通过 `<router-view>` 的作用域插槽拿到当前匹配的页面组件，并交给 `component` 的 `is` 属性进行渲染；外层包裹 `keep-alive` 后，切换路由时上一个页面组件会被“停用并缓存”，再次返回时无需重新创建。

::: danger 常见坑

- 忘记包裹在动态组件或 `<router-view>` 外层，导致 `KeepAlive` 无效。
- 切换到同一路由的不同 params 时，组件实例会复用（保持缓存），必要时通过 `:key` 或监听 `route` 实现响应更新。
  :::

## 包含/排除（include/exclude）

通过 `include` / `exclude` 指定哪些组件参与缓存。支持以逗号分隔的字符串、正则表达式、数组：

```vue
<!-- 逗号分隔字符串（注意无空格）-->
<keep-alive include="A,B">
  <component :is="view" />
</keep-alive>

<!-- 正则表达式（需使用 v-bind）-->
<keep-alive :include="/A|B/">
  <component :is="view" />
</keep-alive>

<!-- 数组（需使用 v-bind）-->
<keep-alive :include="['A', 'B']">
  <component :is="view" />
</keep-alive>
```

也可与路由联用：

```vue
<router-view v-slot="{ Component }">
  <keep-alive include="Counter,Timer">
    <component :is="Component" />
  </keep-alive>
</router-view>
```

::: warning 名称匹配规则
`include` / `exclude` 匹配的是组件的 `name` 选项（`export default { name: 'A' }` 或 `<script setup> defineOptions({ name: 'A' })`）。若未设置 `name`，匹配可能失败。
:::

## 最大缓存数（max）

当缓存实例数将超过 `max` 时，最久未访问的实例会被销毁：

```vue
<router-view v-slot="{ Component }">
  <keep-alive :max="3">
    <component :is="Component" />
  </keep-alive>
</router-view>
```

::: tip 缓存键与 `key`
`KeepAlive` 使用“组件类型 + key”作为缓存键。为同一组件提供不同 `:key`，可以将它们当作不同缓存实例；反之复用同一实例。
:::

## 激活与停用钩子

在被 `KeepAlive` 包裹的组件中使用：

```js
import { onActivated, onDeactivated } from "vue";

onActivated(() => {
  // 组件被重新激活（再次显示）
});

onDeactivated(() => {
  // 组件被停用（从视图移除但仍缓存）
});
```

::: tip 使用建议

- 页面表单、计时器等有状态组件非常适合 KeepAlive。
- 若需要在返回页面后刷新数据，可在 `onActivated` 中触发拉取。
  :::

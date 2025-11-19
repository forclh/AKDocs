# 【Vue】属性透传 ✨

[[TOC]]

::: tip 要点速览

- 定义：未在子组件声明为 `props/emits` 的属性，自动透传到子组件根元素（如 `class/style/id`）。
- 合并：子组件根元素已有 `class/style` 时与父侧透传值合并；其他同名属性以父侧为准。
- 深层透传：若子组件根直接渲染另一个组件，属性继续向下透传；已在中间组件声明的 `props/emits` 不再透传。
- 禁用与定向：`inheritAttrs:false` 禁止自动透传；用 `v-bind="$attrs"` 手动绑定到指定元素。
- 多根：多根组件不自动透传，需显式绑定 `$attrs`；否则会警告。
- JS 访问：`useAttrs()` 或 `setup(props, ctx).attrs` 访问透传属性；大小写保留，如 `$attrs['foo-bar']`、`$attrs.onClick`。
  :::

属性透传，指的是**未被子组件通过 `props` 或 `emits` 显式声明的 attribute**，它们会自动传到子组件根元素，例如常见的 `class`、`style`、`id`。

## 快速上手

A.vue

```vue
<template>
  <div>
    <p>A组件</p>
  </div>
</template>
```

App.vue

```vue
<template>
  <!-- 这些属性在 A 组件内部都没有声明为 Props -->
  <A id="a" class="aa" data-test="test" />
  <!-- 注意大小写：组件标签应为 <A> 而不是原生 <a> -->
</template>

<script setup>
import A from "./components/A.vue";
</script>
```

观察渲染结构：

```html
<div id="app" data-v-app="">
  <!-- 这些属性在A组件内部都没有声明为Props -->
  <div id="a" class="aa" data-test="test">
    <p>A组件</p>
  </div>
</div>
```

## 相关细节

### 1) `class/style` 的合并

如果一个子组件的根元素已经有了 class 或 style attribute，它会和从父组件上继承的值**合并**。

子组件其他同名属性（非 `class/style`）会被忽略，应用父组件透传的值。

### 2) 深层组件继承

1. 有些情况下，一个组件会在根节点上直接去渲染另一个组件，这种情况属性会**继续透传**。
2. 深层透传的属性不包含 A 组件上声明过的 props 或是针对 emits 声明事件的 v-on 侦听函数，可以理解为这些属性在 A 组件上消费了。

### 3) 禁用属性透传

属性会自动透传到根元素上，但有时我们想要控制透传属性的位置，此时可以这么做：

1. 禁用透传

   ```jsx
   defineOptions({
     inheritAttrs: false,
   });
   ```

2. 通过 `v-bind` 绑定 `$attrs` 手动指定位置

   ```html
   <div>
     <p v-bind="$attrs">A组件</p>
   </div>
   ```

注意：

1. 和 props 不同，透传 attributes 在 JS 中**保留原始大小写**，所以像 foo-bar 这样的 attribute 需要通过 `$attrs['foo-bar']` 来访问。
2. 像 @click 这样的一个 v-on 事件监听器将在此对象下被暴露为一个函数 `$attrs.onClick`。

### 4) 多根节点属性透传

和单根节点组件有所不同，有着多个根节点的组件没有自动 attribute 透传行为。

```html
<header>...</header>
<main>...</main>
<footer>...</footer>
```

这种情况下 Vue 不知道要将 attribute 透传到哪里，会抛出一个警告。

此时需要通过 $attrs 显式绑定。

```html
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```

### 5) JS 中访问透传的属性

在 `<script setup>` 中使用 `useAttrs` 访问透传属性：

```html
<script setup>
  import { useAttrs } from "vue";

  const attrs = useAttrs();
</script>
```

在传统 `setup()` 中通过上下文对象访问：

```jsx
export default {
  setup(props, ctx) {
    // 透传 attribute 被暴露为 ctx.attrs
    console.log(ctx.attrs);
  },
};
```

## 实际开发注意事项

- 语义与控制：能声明为 `props/emits` 的尽量声明；`$attrs` 用于样式与无语义属性的透传。
- 精准绑定：开启 `inheritAttrs:false` 后，将 `$attrs` 绑定到真正的“展示根元素”，避免误绑定在包裹层。
- 多根组件：明确将 `$attrs` 绑定到承载交互/样式的元素，避免散落绑定导致维护困难。
- 名称大小写：JS 中保留原始大小写，使用 `$attrs['foo-bar']` 访问连字符属性；事件监听通过 `$attrs.onClick` 等形式存在。
- 与插槽协作：若根渲染子组件且该子组件消费了部分 `props/emits`，剩余 `$attrs` 将继续下传；依场景选择在哪一层绑定。

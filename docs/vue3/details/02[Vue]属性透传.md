# 【Vue】属性透传

属性透传，指的是一些没有被组件声明为 props、emits 或自定义事件的属性，但依然能传递给子组件，例如常见的 class、style 和 id.

**快速上手**

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
    <!-- 这些属性在A组件内部都没有声明为Props -->
    <a id="a" class="aa" data-test="test" />
</template>

<script setup>
import A from "./components/A.vue";
</script>
```

观察渲染结构？

```html
<div id="app" data-v-app="">
    <!-- 这些属性在A组件内部都没有声明为Props -->
    <div id="a" class="aa" data-test="test">
        <p>A组件</p>
    </div>
</div>
```

**相关细节**

**1. 对 class 和 style 的合并**

如果一个子组件的根元素已经有了 class 或 style attribute，它会和从父组件上继承的值**合并**。

子组件其他同名的属性**会被忽略**，应用父组件上继承的值。

**2. 深层组件继承**

1. 有些情况下，一个组件会在根节点上直接去渲染另一个组件，这种情况属性会**继续透传**。
2. 深层透传的属性不包含 A 组件上声明过的 props 或是针对 emits 声明事件的 v-on 侦听函数，可以理解为这些属性在 A 组件上消费了。

**3. 禁用属性透传**

属性会自动透传到根元素上，但有时我们想要控制透传属性的位置，此时可以这么做：

1. 禁用透传

    ```jsx
    defineOptions({
        inheritAttrs: false,
    });
    ```

2. 通过 v-bind 绑定 $attrs 手动指定位置

    ```html
    <div>
        <p v-bind="$attrs">A组件</p>
    </div>
    ```

另外有两个注意点：

1. 和 props 不同，透传 attributes 在 JS 中**保留原始大小写**，所以像 foo-bar 这样的 attribute 需要通过 `$attrs['foo-bar']` 来访问。
2. 像 @click 这样的一个 v-on 事件监听器将在此对象下被暴露为一个函数 $attrs.onClick。

**4. 多根节点属性透传**

和单根节点组件有所不同，有着多个根节点的组件没有自动 attribute 透传行为。

```html
<header>...</header>
<main>...</main>
<footer>...</footer>
```

这种情况下 Vue 不知道要将 attribute 透传到哪里，所以会抛出一个警告。

此时需要通过 $attrs 显式绑定。

```html
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```

**5. JS 中访问透传的属性**

如果需要，你可以在 `<script setup>` 中使用 useAttrs API 来访问一个组件的所有透传 attribute：

```html
<script setup>
    import { useAttrs } from "vue";

    const attrs = useAttrs();
</script>
```

如果没有使用 `<script setup>`，attrs 会作为 setup 方法上下文对象的一个属性暴露：

```jsx
export default {
    setup(props, ctx) {
        // 透传 attribute 被暴露为 ctx.attrs    console.log(ctx.attrs)
    },
};
```

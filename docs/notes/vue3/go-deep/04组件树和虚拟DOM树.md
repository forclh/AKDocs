# ✨ 组件树与虚拟 DOM 树 👌

[[TOC]]

::: tip 要点速览

- 组件树：由组件之间的嵌套关系形成的“实例树”。
- 虚拟 DOM 树：某个组件内部的 vnode 结构，描述将要渲染的真实 DOM（局部，而非全局）。
- Vue1.x：细粒度 watcher（模板每次引用响应式数据会生成一个 watcher）。
- Vue2.x/3.x：组件级 watcher + 虚拟 DOM diff，定位组件内具体更新节点。
  :::

## 从 DOM 树到组件树

先看最基本的 DOM 树：

```html
<div>
  <h1>你喜欢的水果</h1>
  <ul>
    <li>西瓜</li>
    <li>香蕉</li>
    <li>苹果</li>
  </ul>
</div>
```

上面的结构在浏览器中会形成一棵 DOM 树：

![](https://bu.dusays.com/2025/11/05/690af9cb59534.png)

当我们把这段结构封装为组件 `Fruit`，并在其他组件中复用，组件与组件之间形成一棵更高层次的树，即“组件树”。每个组件内部的视图由一组虚拟 DOM（vnode）描述，最终映射为真实 DOM：

![](https://bu.dusays.com/2025/11/05/690af9cb57d85.png)

::: info 术语澄清

- 组件树：组件实例之间的层级关系树。
- 虚拟 DOM 树：某个组件内部的 vnode 树；并非“整个应用的虚拟 DOM 总树”。
  :::

## 响应式演进与虚拟 DOM 的引入

回顾 Vue1.x 的响应式：

- 使用 `Object.defineProperty` 实现依赖追踪。
- `Dep`（发布者）与 `Watcher`（订阅者）构成观察者模式。

在 Vue1.x 中，每次模板引用一个响应式数据，就会生成一个 watcher：

```vue :collapsed-lines
<template>
  <div class="wrapper">
    <!-- 模板中每引用一次响应式数据，就会生成一个 watcher -->
    <!-- watcher 1 -->
    <div class="msg1">{{ msg }}</div>
    <!-- watcher 2 -->
    <div class="msg2">{{ msg }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return { msg: "Hello Vue 1.0" }; // 与 dep 一一对应，可与多个 watcher 关联
  },
};
</script>
```

::: warning 取舍与问题

- 优点：能够非常精准地知道哪个数据被使用、哪里需要更新。
- 缺点：大型应用中，一个组件可能对应多个 watcher，资源开销大，管理复杂。
  :::

Vue2.x 引入虚拟 DOM，并将响应式的粒度提升为“组件级 watcher”（一个组件对应一个 watcher）。这带来新的问题与机会：

- 问题：只知道“哪个组件更新”，但组件内部“哪个具体节点更新”不再直接可知。
- 机会：引入虚拟 DOM diff，通过比对前后 vnode，精确定位需要更新的真实 DOM 节点。

![](https://bu.dusays.com/2025/11/05/690af9cb5af67.png)

在 Vue3 中，整体架构仍是“组件级响应式 + 虚拟 DOM diff”，但底层实现与优化策略更强：

- 响应式改为 `Proxy`，更好地覆盖对象/数组的深层拦截与性能表现。
- 虚拟 DOM diff 更精细（如 Patch Flags、Block Tree），减少不必要的比较与更新。

::: tip 为什么需要“组件级 + 虚拟 DOM”？

- 组件级 watcher 减少过多的细粒度订阅，降低复杂度与内存开销。
- 虚拟 DOM diff 把“定位组件内具体更新节点”的能力补回来，兼顾维护成本与性能。
  :::

## 常见误区

::: danger 易错点

- 把“虚拟 DOM 树”当成“全局唯一的大树”：实际是每个组件内部的 vnode 局部树。
- 以为引入虚拟 DOM 就能让所有场景更快：初始化阶段命令式 DOM 更快，虚拟 DOM 优势在更新阶段与复杂界面。
- 忽视 `key` 的重要性：列表未设置稳定唯一 `key` 容易触发错误复用与渲染错位。
  :::

## 小结与后续

- 组件树是“实例层级”，虚拟 DOM 树是“组件内部的结构描述”。
- Vue2.x/3.x 采用“组件级响应式 + 虚拟 DOM diff”的组合，平衡了可维护性与性能。

# 【Vue】Suspense

[[TOC]]

::: tip 要点速览

- 作用：统一管理组件树中的异步依赖的加载、错误与完成状态。
- 依赖类型：异步 `setup`/顶层 `await` 组件；异步组件。
- 插槽：`#default` 完成时显示，`#fallback` 挂起时显示；各仅一个直接子节点。
- 边界：默认插槽内的所有依赖完成后才 resolve；嵌套边界可独立解析。
- 配合：异步组件的 `suspensible` 控制是否参与挂起；与 `Transition/KeepAlive` 可组合。

:::

## 动机与定义

在复杂页面中可能存在多个异步数据或异步组件，分别显示各自的加载与错误会造成割裂的体验。`Suspense` 提供一个边界，使我们能在顶层统一展示加载或回退内容，并在依赖全部就绪后一次性切换到完成态。

示例结构：

```
<Suspense>
└─ <Dashboard>
   ├─ <Profile>
   │  └─ <FriendStatus>
   └─ <Content>
      ├─ <ActivityFeed>
      └─ <Stats>
```

## 可等待的异步依赖

异步 `setup`/顶层 `await`：

```vue
<script setup>
const res = await fetch("/api/posts");
const posts = await res.json();
</script>

<template>{{ posts }}</template>
```

异步组件：

```js
import { defineAsyncComponent } from "vue";
const AsyncStats = defineAsyncComponent(() => import("./Stats.vue"));
```

## 插槽与状态机

`Suspense` 有两个插槽，且各自只允许一个直接子节点：

- `#default`：当所有依赖完成后进入完成态，渲染默认内容。
- `#fallback`：有任一依赖未完成时进入挂起态，渲染后备内容。

```vue
<Suspense>
  <template #default>
    <Dashboard />
  </template>
  <template #fallback>
    <div class="loading">Loading...</div>
  </template>
</Suspense>
```

## 快速上手

将页面根内容包裹在 `Suspense` 中以统一加载态：

```vue
<template>
  <Suspense>
    <template #default>
      <Dashboard />
    </template>
    <template #fallback>
      <div class="loading">Loading...</div>
    </template>
  </Suspense>
</template>
```

提示：若希望某部分先显示而不阻塞整体，可为该部分建立内层 `Suspense` 边界，或在异步组件上设置 `suspensible: false`。

## **其他细节**

### **1. 内置组件嵌套顺序**

`<Suspense>` 经常会和 `<Transition>`、`<KeepAlive>` 搭配着一起使用，此时就涉及到一个**嵌套的顺序**问题，谁在外层，谁在内层。

下面是一个模板：

```html
<RouterView v-slot="{ Component }">
  <template v-if="Component">
    <Transition mode="out-in">
      <KeepAlive>
        <Suspense>
          <!-- 主要内容 -->
          <component :is="Component"></component>

          <!-- 加载中状态 -->
          <template #fallback> 正在加载... </template>
        </Suspense>
      </KeepAlive>
    </Transition>
  </template>
</RouterView>
```

你可以根据实际开发需求，删减你不需要的组件。

### **2. 事件**

`<Suspense>` 组件会触发三个事件：

- pending：在进入挂起状态时触发
- resolve：在 default 插槽完成获取新内容时触发
- fallback：显示后备内容的时候触发

# 【Vue】依赖注入 ✨

[[TOC]]

::: tip 要点速览

- 场景：跨层级传递数据，避免 Props 逐级传递的样板与耦合。
- API：`provide(key, value)` 提供；`inject(key, default?)` 注入；需在组件初始化阶段同步调用（`setup()` 内）。
- 全局：`app.provide(key, value)` 提供应用级依赖，任意组件均可注入。
- 响应式：可提供任意类型（含 `ref/reactive`）；注入到的是“原对象”，必要时用 `readonly()` 限制修改面。
- 命名：大型项目使用 `Symbol` 作为注入名，避免冲突；集中管理注入键。
- 边界：注入按“组件树层级”生效，不受 DOM 结构影响；最近祖先优先覆盖。
  :::

## 动机与问题

Props 逐级传递存在的问题：

![](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-07-15-055646.png)

使用 Pinia 能够解决该问题，但在更轻量/临时的跨层场景，可以使用依赖注入。

## 快速上手

整个依赖注入分为两个角色：

1. 提供方：负责**提供数据**
2. 注入方：负责**接收数据**

**1) 提供方**

要提供数据，使用 `provide`：

```vue
<script setup>
import { provide } from "vue";
provide("message", "hello!");
</script>
```

该方法接收的参数也很简单：

1. 数据对应的名称
2. 实际的数据

**2) 注入方**

注入方通过 `inject` 取得数据：

```vue
<script setup>
import { inject } from "vue";
const message = inject("message");
</script>
```

## 相关细节

### 1) 非 `<script setup>` 写法

若未使用 `<script setup>`，需要保证在 `setup()` 中同步调用：

```jsx
import { provide } from "vue";
export default {
  setup() {
    provide("message", "hello!");
  },
};
```

```jsx
import { inject } from "vue";
export default {
  setup() {
    const message = inject("message");
    return { message };
  },
};
```

依赖注入需在组件初始化期间同步建立依赖关系，确保渲染前依赖数据就绪。

### 2) 全局依赖提供

```jsx
import { createApp } from "vue";
const app = createApp({});
app.provide("message", "hello!");
```

应用级别提供的数据在该应用内的所有组件中均可注入。

### 3) 注入默认值

注入方可提供默认值：

```jsx
const value = inject("message", "这是默认值");
```

### 4) 提供响应式数据

可提供任意类型的值，包括响应式值。

注意：

1. 若提供的是 `ref`，注入得到的是该 `ref` 对象，不会自动解包。
2. 尽可能将对响应式状态的变更保持在提供方组件中。

```vue
<script setup>
import { provide, ref } from "vue";
const location = ref("North Pole");
function updateLocation() {
  location.value = "South Pole";
}
provide("location", { location, updateLocation });
</script>
```

```vue
<script setup>
import { inject } from "vue";
const { location, updateLocation } = inject("location");
</script>

<template>
  <button @click="updateLocation">{{ location }}</button>
</template>
```

3. 使用 `readonly` 提供只读值：

```vue
<script setup>
import { ref, provide, readonly } from "vue";
const count = ref(0);
provide("read-only-count", readonly(count));
</script>
```

### 5) 使用 `Symbol` 作为数据名

大型应用使用 `Symbol` 作为注入名，避免冲突；集中管理注入键：

```jsx
// keys.js
export const myInjectionKey = Symbol();
```

```jsx
// provider
import { provide } from "vue";
import { myInjectionKey } from "./keys.js";
provide(myInjectionKey, {
  /* data */
});
```

```jsx
// consumer
import { inject } from "vue";
import { myInjectionKey } from "./keys.js";
const injected = inject(myInjectionKey);
```

## 常见误区与实践建议

- 在 `setup()` 之外或异步调用 `provide/inject`，会错过初始化时机。
- 直接修改注入到消费方的响应式状态，导致不可控的双向耦合；建议仅在提供方修改或使用 `readonly`。
- 注入名冲突或字符串硬编码分散管理；建议集中导出 `Symbol` 注入键。
- 依赖注入用于“局部跨层”场景；全局共享与持久化推荐使用 Pinia，并可结合依赖注入为局部覆盖提供默认值。

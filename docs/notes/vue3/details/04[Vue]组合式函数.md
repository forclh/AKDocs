# 【Vue】组合式函数 ✨

[[TOC]]

::: tip 要点速览

- 本质：复用“有状态的逻辑”，在组件初始化阶段建立响应式与副作用。
- 约定：以 `useXxx` 命名；在 `<script setup>` 或 `setup()` 中同步调用。
- 返回：返回 `ref/reactive/computed` 等状态对象，支持解构且保持响应性。
- 副作用：在组合式函数内部挂靠生命周期（`onMounted/onUnmounted`）并做好清理。
- 参数：支持响应式参数（`ref/getter`）；用 `watch/watchEffect` 与 `toValue` 正确追踪。
- 区别：替代 Vue2 `mixins` 的隐式合并与命名冲突；组合式函数更显式、可组合。
  :::

组合式函数，本质上也就是**代码复用**的一种方式。

- 组件：对结构、样式、逻辑进行复用
- 组合式函数：侧重于对 **有状态** 的逻辑进行复用

[官方介绍](https://cn.vuejs.org/guide/reusability/composables.html)

## 快速上手

实现一个鼠标坐标值的追踪器。

```vue :title="mouse.vue" :collapsed-lines
<template>
  <div>当前鼠标位置: {{ x }}, {{ y }}</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const x = ref(0);
const y = ref(0);

function update(event) {
  x.value = event.pageX;
  y.value = event.pageY;
}

onMounted(() => window.addEventListener("mousemove", update));
onUnmounted(() => window.removeEventListener("mousemove", update));
</script>

<style scoped></style>
```

多个组件中复用这段逻辑该怎么办？

答：提取为“组合式函数”，将状态与副作用封装到一个可复用的函数中。

```js :title="mouse.vue" :collapsed-lines
import { ref, onMounted, onUnmounted } from "vue";

// 按照惯例，组合式函数名以“use”开头
export function useMouse() {
  // 被组合式函数封装和管理的状态
  const x = ref(0);
  const y = ref(0);

  // 组合式函数可以随时更改其状态。
  function update(event) {
    x.value = event.pageX;
    y.value = event.pageY;
  }

  // 一个组合式函数也可以挂靠在所属组件的生命周期上
  // 来启动和卸载副作用
  onMounted(() => window.addEventListener("mousemove", update));
  onUnmounted(() => window.removeEventListener("mousemove", update));

  // 通过返回值暴露所管理的状态
  return { x, y };
}
```

在模板中直接使用组合式函数暴露的状态：

```vue
<script setup>
import { useMouse } from "./mouse.js";

const { x, y } = useMouse();
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

## 相关细节

### 1) 组合式函数相互嵌套

组合式函数可以调用其他组合式函数，彼此共享与组合状态与副作用，形成更高层的抽象。

### 2) 与 Vue2 `mixins` 的区别

解决了 Vue2 时期 mixin 的一些问题。

1. **不清晰的数据来源**：当使用多个 minxin 的时候，实例上的数据属性来自于哪一个 mixin 不太好分辨。
2. **命名空间冲突**：如果多个 mixin 来自于不同的作者，可能会注册相同的属性名，造成命名冲突

   mixin

   ```js :title="mixin" :collapsed-lines
   const mixinA = {
     methods: {
       fetchData() {
         // fetch data logic for mixin A
         console.log("Fetching data from mixin A");
       },
     },
   };

   const mixinB = {
     methods: {
       fetchData() {
         // fetch data logic for mixin B
         console.log("Fetching data from mixin B");
       },
     },
   };

   new Vue({
     mixins: [mixinA, mixinB],
     template: `
       <div>
         <button @click="fetchData">Fetch Data</button>
       </div>
     `,
   });
   ```

   组合式函数：

   ```js :title="useMixinA.js" :collapsed-lines
   // useMixinA.js
   import { ref } from "vue";

   export function useMixinA() {
     function fetchData() {
       // fetch data logic for mixin A
       console.log("Fetching data from mixin A");
     }

     return { fetchData };
   }

   // useMixinB.js
   import { ref } from "vue";

   export function useMixinB() {
     function fetchData() {
       // fetch data logic for mixin B
       console.log("Fetching data from mixin B");
     }

     return { fetchData };
   }
   ```

   组件使用上面的组合式函数：

   ```js :collapsed-lines
   import { defineComponent } from "vue";
   import { useMixinA } from "./useMixinA";
   import { useMixinB } from "./useMixinB";

   export default defineComponent({
     setup() {
       // 这里必须要给别名
       const { fetchData: fetchDataA } = useMixinA();
       const { fetchData: fetchDataB } = useMixinB();

       fetchDataA();
       fetchDataB();

       return { fetchDataA, fetchDataB };
     },
     template: `
       <div>
         <button @click="fetchDataA">Fetch Data A</button>
         <button @click="fetchDataB">Fetch Data B</button>
       </div>
     `,
   });
   ```

3. **隐式的跨 mixin 交流**

   mixin

   ```js
   export const mixinA = {
     data() {
       return {
         sharedValue: "some value",
       };
     },
   };
   ```

   ```js
   export const minxinB = {
     computed: {
       dValue() {
         // 和 mixinA 具有隐式的交流
         // 因为最终 mixin 的内容会被合并到组件实例上面，因此在 mixinB 里面可以直接访问 mixinA 的数据
         return this.sharedValue + "xxxx";
       },
     },
   };
   ```

   组合式函数：交流就是显式的

   ```js
   import { ref } from "vue";

   export function useMixinA() {
     const sharedValue = ref("some value");
     return { sharedValue };
   }
   ```

   ```js
   import { computed } from "vue";

   export function useMixinB(sharedValue) {
     const derivedValue = computed(() => sharedValue.value + " extended");
     return { derivedValue };
   }
   ```

   ```vue :collapsed-lines
   <template>
     <div>{{ derivedValue }}</div>
   </template>

   <script>
   import { defineComponent } from "vue";
   import { useMixinA } from "./useMixinA";
   import { useMixinB } from "./useMixinB";

   export default defineComponent({
     setup() {
       const { sharedValue } = useMixinA();

       // 两个组合式函数的交流是显式的
       const { derivedValue } = useMixinB(sharedValue);

       return { derivedValue };
     },
   });
   </script>
   ```

### 3) 异步状态与封装

根据异步请求的情况显示不同的信息：

```vue
<template>
  <div v-if="error">Oops! Error encountered: {{ error.message }}</div>
  <div v-else-if="data">
    Data loaded:
    <pre>{{ data }}</pre>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import { ref } from "vue";

// 发送请求获取数据
const data = ref(null);
// 错误
const error = ref(null);

fetch("...")
  .then((res) => res.json())
  .then((json) => (data.value = json))
  .catch((err) => (error.value = err));
</script>
```

如何复用这段逻辑？仍然是提取成一个组合式函数。

如下：

```js
import { ref } from "vue";
export function useFetch(url) {
  const data = ref(null);
  const error = ref(null);
  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err));
  return { data, error };
}
```

现在重构上面的组件：

```vue
<template>
  <div v-if="error">Oops! Error encountered: {{ error.message }}</div>
  <div v-else-if="data">
    Data loaded:
    <pre>{{ data }}</pre>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import { useFetch } from "./hooks/useFetch";
const { data, error } = useFetch("xxxx");
</script>
```

这里为了更加灵活，我们想要传递一个响应式数据：

```js
const url = ref("first-url");
// 请求数据
const { data, error } = useFetch(url);
// 修改 url 的值后重新请求数据
url.value = "new-url";
```

此时我们就需要重构上面的组合式函数：

```js
import { ref, watchEffect, toValue } from "vue";
export function useFetch(url) {
  const data = ref(null);
  const error = ref(null);
  const fetchData = () => {
    // 每次执行 fetchData 的时候，重置 data 和 error 的值
    data.value = null;
    error.value = null;
    fetch(toValue(url)) // 调用toValue将ref和getter转换为值
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err));
  };
  watchEffect(() => {
    fetchData(); // url更新的时候会自动调用
  });
  return { data, error };
}
```

## 约定与最佳实践

- 命名：使用驼峰并以 `use` 开头，如 `useMouse/useEvent`。

- 输入参数：当参数为响应式（`ref/getter`），使用 `watch()` 或在 `watchEffect()` 中通过 `toValue()` 正确解包与追踪。

### 返回值

推荐返回“普通对象 + `ref` 属性”，以便解构后保持响应性：

```js
// 组合式函数
export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  // ...

  return { x, y };
}
```

```js
import { useMouse } from "./hooks/useMouse";
// 可以解构
const { x, y } = useMouse();
```

若希望以对象属性形式使用，可用 `reactive()` 再包装：

```js
import { useMouse } from "./hooks/useMouse";
const mouse = reactive(useMouse());
```

### 副作用

在组合式函数中可以执行副作用（事件监听、请求等），并在 `onUnmounted` 清理：

例如在一个组合式函数设置了一个事件监听器，那么就需要在 onUnmounted 的时候移除这个事件监听器。

```js
export function useMouse() {
  // ...

  onMounted(() => window.addEventListener("mousemove", update));
  onUnmounted(() => window.removeEventListener("mousemove", update));

  // ...
}
```

也可以像 `useEventListener` 一样专门处理副作用：

```js
import { onMounted, onUnmounted } from "vue";

export function useEventListener(target, event, callback) {
  // 专门处理副作用的组合式函数
  onMounted(() => target.addEventListener(event, callback));
  onUnmounted(() => target.removeEventListener(event, callback));
}
```

## 使用限制

1. 仅在 `<script setup>` 或 `setup()` 中调用：确保组件实例创建时完成初始化；选项式 API 需在 `setup()` 中调用并返回以暴露到模板与 `this`。

   ```js
   import { useMouse } from "./mouse.js";
   import { useFetch } from "./fetch.js";

   export default {
     setup() {
       const { x, y } = useMouse();
       const { data, error } = useFetch("...");
       return { x, y, data, error };
     },
     mounted() {
       console.log(this.x);
     },
   };
   ```

2. 需同步调用：初始化过程是同步的，异步调用可能错过依赖收集与实例时机。
3. 可在生命周期中调用：如 `onMounted` 内调用也是同步的，组件实例已就绪，安全。

## 常见误区与实践建议

- 在组合式函数内部直接修改外部（注入）状态导致耦合；建议通过入参函数或 `readonly` 控制写入边界。
- 返回对象包含非响应式字段导致解构失去响应；确保返回 `ref/reactive`。
- 忽视副作用清理导致内存泄漏；在 `onUnmounted` 或可复用清理函数中移除。
- 忽略响应式参数的解包；在 `watchEffect` 中使用 `toValue()` 或显式 `watch()`。

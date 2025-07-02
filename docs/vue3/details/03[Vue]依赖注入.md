# 【Vue】依赖注入

Props 逐级传递存在的问题：

![](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-07-15-055646.png)

使用 Pinia 能够解决该问题，但是如果不用 Pinia 呢？

可以用依赖注入。

## 快速上手

整个依赖注入分为两个角色：

1. 提供方：负责**提供数据**
2. 注入方：负责**接收数据**

**1. 提供方**

要提供数据，可以使用 provide 方法。例如：

```html
<script setup>
    import { provide } from "vue";

    provide(/* 数据名称 */ "message", /* 实际数据 */ "hello!");
    provide("message", "hello!");
</script>
```

该方法接收的参数也很简单：

1. 数据对应的名称
2. 实际的数据

**2. 注入方**

注入方通过 inject 方法来取得数据。例如：

```
<script setup>
import { inject } from 'vue'

const message = inject('message')
</script>
```

## 相关细节

**1. 非 setup 语法糖**

如果没有使用 setup 语法糖，那么需要**保证 provide 和 inject 方法是在 setup 方法中同步调用的**：

```jsx
import { provide } from 'vue'export default {
  setup() {
    provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
  }
}
```

```jsx
import { inject } from 'vue'export default {
  setup() {
    const message = inject('message')
    return { message }
  }
}
```

因为 Vue 的依赖注入机制需要在组件初始化期间同步建立依赖关系，这样可以**确保所有组件在渲染之前就已经获取到必要的依赖数据**。如果 provide 和 inject 在 setup 之外或异步调用，Vue 无法保证组件初始化完成之前所有的依赖关系已经正确建立。

**2. 全局依赖提供**

```jsx
// main.js
import { createApp } from "vue";

const app = createApp({});

app.provide(/* 注入名 */ "message", /* 值 */ "hello!");
```

在应用级别提供的数据在该应用内的所有组件中都可以注入。

**3. 注入默认值**

注入方可以提供一个默认值，这一点类似于 props 的默认值。

```jsx
// 如果没有祖先组件提供 "message"
// value 会是 "这是默认值"
const value = inject("message", "这是默认值");
```

**4. 提供响应式数据**

提供方所提供的值**可以是任意类型的值**，**包括响应式的值**。

注意点：

1. 如果提供的值是一个 ref，注入进来的会是该 ref 对象，而**不会自动解包**为其内部的值。
2. **尽可能将任何对响应式状态的变更都保持在提供方组件中**

    ```html
    <!-- 在供给方组件内 -->
    <script setup>
        import { provide, ref } from "vue";

        // 响应式数据
        const location = ref("North Pole");
        // 修改响应式数据的方法
        function updateLocation() {
            location.value = "South Pole";
        }

        provide("location", {
            location,
            updateLocation,
        });
    </script>
    ```

    ```html
    <!-- 在注入方组件 -->
    <script setup>
        import { inject } from "vue";
        // 同时拿到响应式数据，以及修改该数据的方法
        const { location, updateLocation } = inject("location");
    </script>

    <template>
        <button @click="updateLocation">{{ location }}</button>
    </template>
    ```

3. 使用 readonly 来提供只读值

    ```
    <script setup>
    import { ref, provide, readonly } from 'vue'

    const count = ref(0)
    provide('read-only-count', readonly(count))
    </script>
    ```

**5. 使用 Symbol 作为数据名**

大型的应用建议最好使用 Symbol 来作为注入名以避免潜在的冲突。推荐在一个单独的文件中导出这些注入名 Symbol：

```jsx
// keys.js
export const myInjectionKey = Symbol();
```

```jsx
// 在供给方组件中
import { provide } from "vue";
import { myInjectionKey } from "./keys.js";

provide(myInjectionKey, {
    /* 要提供的数据 */
});
```

```jsx
// 注入方组件
import { inject } from "vue";
import { myInjectionKey } from "./keys.js";

const injected = inject(myInjectionKey);
```

实战案例：整个应用程序在多个组件中共享一些全局配置（主题颜色、用户信息…）

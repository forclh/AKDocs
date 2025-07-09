# 【Vue】组合式函数 👌

组合式函数，本质上也就是**代码复用**的一种方式。

-   组件：对结构、样式、逻辑进行复用
-   组合式函数：侧重于对 **有状态** 的逻辑进行复用

[官方介绍](https://cn.vuejs.org/guide/reusability/composables.html)

## **快速上手**

实现一个鼠标坐标值的追踪器。

```vue
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

多个组件中**复用这个相同的逻辑**，该怎么办？

答：使用组合式函数。将包含了状态的相关逻辑，一起提取到一个单独的函数中，该函数就是组合式函数。

```js title="mouse.js"
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

在模板中就可以直接使用组合式函数暴露出来的状态

```vue
<script setup>
import { useMouse } from "./mouse.js";

const { x, y } = useMouse();
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

## **相关细节**

### **1. 组合式函数本身还可以相互嵌套**

### **2. 和 Vue2 时期 mixin 区别**

解决了 Vue2 时期 mixin 的一些问题。

1. **不清晰的数据来源**：当使用多个 minxin 的时候，实例上的数据属性来自于哪一个 mixin 不太好分辨。
2. **命名空间冲突**：如果多个 mixin 来自于不同的作者，可能会注册相同的属性名，造成命名冲突

    mixin

    ```js
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

    ```js
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

    ```js
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

    ```vue
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

### **3 异步状态**

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

## **约定和最佳实践**

**1. 命名**：组合式函数约定用**驼峰命名法**命名，并**以“use”作为开头**。例如前面的 useMouse、useEvent.

**2. 输入参数**：注意参数是**响应式数据**的情况。如果你的组合式函数在输入参数是 ref 或 getter 的情况下创建了响应式 effect，为了让它能够被正确追踪，请确保要么使用 watch( ) 显式地监视 ref 或 getter，要么在 watchEffect( ) 中调用 toValue( )。

**3. 返回值**

组合式函数中推荐返回一个普通对象，该对象的每一项是 ref 数据，这样可以保证在解构的时候仍然能够保持其响应式的特性：

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

如果希望以**对象属性的形式**来使用组合式函数中返回的状态，可以将返回的对象用 reactive 再包装一次即可：

```js
import { useMouse } from "./hooks/useMouse";
const mouse = reactive(useMouse());
```

**4. 副作用**

在组合式函数中可以执行副作用，例如添加 DOM 事件监听器或者请求数据。**但是请确保在 onUnmounted 里面清理副作用。**

例如在一个组合式函数设置了一个事件监听器，那么就需要在 onUnmounted 的时候移除这个事件监听器。

```js
export function useMouse() {
    // ...

    onMounted(() => window.addEventListener("mousemove", update));
    onUnmounted(() => window.removeEventListener("mousemove", update));

    // ...
}
```

也可以像前面 useEvent 一样，专门定义一个组合式函数来处理副作用：

```js
import { onMounted, onUnmounted } from "vue";

export function useEventListener(target, event, callback) {
    // 专门处理副作用的组合式函数
    onMounted(() => target.addEventListener(event, callback));
    onUnmounted(() => target.removeEventListener(event, callback));
}
```

**5. 使用限制**

1. 只能在 `<script setup>`或 `setup( )` 钩子中调用：确保在组件实例被创建时，所有的组合式函数都被正确初始化。特别如果你使用的是选项式 API，那么需要在 setup 方法中调用组合式函数，并且返回，这样才能暴露给 this 及其模板使用

    ```js
    import { useMouse } from "./mouse.js";
    import { useFetch } from "./fetch.js";

    export default {
        setup() {
            // 因为组合式函数会返回一些状态
            // 为了后面通过 this 能够正确访问到这些数据状态
            // 必须在 setup 的时候调用组合式函数
            const { x, y } = useMouse();
            const { data, error } = useFetch("...");
            return { x, y, data, error };
        },
        mounted() {
            // setup() 暴露的属性可以在通过 `this` 访问到
            console.log(this.x);
        },
        // ...其他选项
    };
    ```

2. **只能被同步调用**：Vue 需要在组件实例创建的过程中收集所有的响应式状态和副作用，这个过程是同步的。如果组合式函数被异步调用，可能会导致在组件实例还未完全初始化时，尝试访问未定义的实例数据，从而引发错误以及错过建立响应式依赖。
3. **可以在像 onMounted 生命周期钩子中调用**：在某些情况下，可以在如 onMounted 生命周期钩子中调用组合式函数。这些生命周期钩子也是**同步执行**的，并且在组件实例已经被初始化后调用，因此可以安全地使用组合式函数。

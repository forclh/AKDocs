# 【场景】自定义 ref 实现防抖

首先是一个防抖最基本的实现：

```vue
<template>
    <div class="container">
        <input @input="debounceInputHandler" type="text" />
        <p class="result">{{ text }}</p>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { debounce } from "lodash";
const text = ref("");

function inputHandler(e) {
    text.value = e.target.value;
}

const debounceInputHandler = debounce(inputHandler, 1000);
</script>
```

假设 Vue 给我们提供了一个防抖的 `ref`：

```vue
<template>
    <div class="container">
        <input v-model="text" type="text" />
        <p class="result">{{ text }}</p>
    </div>
</template>

<script setup>
import { debounceRef } from "vue";
const text = debounceRef("", 1000);
</script>
```

然而上面的设想是美好的，代码能够简洁很多，但是 Vue 并没有给我们提供 debounceRef.

不过自己可以借助 Vue 内置 API [customRef](https://vuejs.org/api/reactivity-advanced.html#customref) 来实现这个功能。`customRef` 的定义如下：

```ts
function customRef<T>(factory: CustomRefFactory<T>): Ref<T>;

type CustomRefFactory<T> = (
    track: () => void,
    trigger: () => void
) => {
    get: () => T;
    set: (value: T) => void;
};
```

下面是 `customRef` 的一个基本使用示例：

```js
import { customRef } from "vue";
let value = "";
const text = customRef(() => {
    return {
        get() {
            console.log("get");
            return value;
        },
        set(val) {
            value = val;
            console.log("set");
        },
    };
});
console.log(text);
console.log(text.value);
text.value = "test";
```

通过 `customRef` 实现 `ref` 原有的功能：

```vue
<template>
    <div class="container">
        <input v-model="text" type="text" />
        <p class="result">{{ text }}</p>
    </div>
</template>

<script setup>
import { customRef } from "vue";
let value = "111";
const text = customRef((track, trigger) => {
    return {
        get() {
            track();
            console.log("get方法被调用");
            return value;
        },
        set(val) {
            trigger();
            console.log("set方法被调用");
            value = val;
        },
    };
});
</script>
```

下面是通过自定义 ref 来实现防抖：

```js debounceRef.js
import { customRef } from "vue";
import { debounce } from "lodash";
export function debounceRef(value, delay = 1000) {
    return customRef((track, trigger) => {
        let _value = value;

        const _debounce = debounce((val) => {
            _value = val;
            trigger(); // 派发更新
        }, delay);

        return {
            get() {
                track(); // 收集依赖
                return _value;
            },
            set(val) {
                _debounce(val);
            },
        };
    });
}
```

更优雅的方式

```js debounceRef.js
import { customRef } from "vue";

export function useDebouncedRef(value, delay = 200) {
    let timeId;
    return customRef((track, trigger) => {
        return {
            get() {
                track();
                return value;
            },
            set(newValue) {
                if (timeId) clearTimeout(timeId);
                timeId = setTimeout(() => {
                    value = newValue;
                    trigger();
                }, delay);
            },
        };
    });
}
```

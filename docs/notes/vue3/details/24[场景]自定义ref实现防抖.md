# 【场景】自定义 Ref 防抖 ✨

[[TOC]]

::: tip 要点速览

- 目标：用 `customRef` 封装“带防抖的 ref”，以便与 `v-model` 无缝配合
- 核心机制：`get`→`track()` 收集依赖；`set`→ 防抖后 `trigger()` 派发更新
- 两种实现：基于 `lodash/debounce` 或原生 `setTimeout`
- 使用场景：输入框、搜索建议、频繁变动的筛选条件、滚动/调整等高频事件的状态
- 常见陷阱：忘记调用 `track/trigger`、未清理定时器、丢失内部值同步
  :::

## 概念与本质

- 防抖：在一段时间内多次触发只执行最后一次，降低频繁更新带来的渲染与副作用成本
- `customRef`：让开发者自定义 ref 的读写行为与依赖通知，完成“响应式 + 调度”的组合
- 目标：把防抖策略融入 `ref` 的 `set`，从而在模板里像普通 `ref` 一样使用 `v-model`

## 基本实现对比

使用函数防抖

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

如果存在“防抖版的 `ref`”，则可直接配合 `v-model`：

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

Vue 未内置 `debounceRef`，但可以用 `customRef` 自行封装。

## customRef 入门示例

customRef API 签名

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

```js
import { customRef } from "vue";
let value = "";
const text = customRef(() => {
  return {
    get() {
      return value;
    },
    set(val) {
      value = val;
    },
  };
});
```

## 对齐原生 ref 行为

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
      track(); // 依赖收集
      return value;
    },
    set(val) {
      value = val;
      trigger(); // 派发更新
    },
  };
});
</script>
```

## 封装：防抖版 ref（lodash）

```js title="debounceRef.js" :collapsed-lines
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
        track(); // 依赖收集
        return _value;
      },
      set(val) {
        _debounce(val);
      },
    };
  });
}
```

## 封装：防抖版 ref（原生）

```js title="debounceRef.js" :collapsed-lines
import { customRef } from "vue";

export function useDebouncedRef(value, delay = 200) {
  let timeId;
  return customRef((track, trigger) => {
    return {
      get() {
        track(); // 依赖收集
        return value;
      },
      set(newValue) {
        if (timeId) clearTimeout(timeId);
        timeId = setTimeout(() => {
          value = newValue;
          trigger(); // 派发更新
        }, delay);
      },
    };
  });
}
```

## 选择与实践

- 输入与搜索：用防抖 ref 驱动 `v-model`，降低频繁更新
- 网络与计算：防抖更新触发请求或重计算，配合 `watch` 更稳妥
- 预防遗漏：封装内务必调用 `track/trigger`，并在定时版实现中清理 `timeId`
- 值保持：内部独立 `_value` 用于缓存最新值，避免读写竞态

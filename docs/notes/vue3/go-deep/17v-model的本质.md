# ✨ v-model 的本质 👌

[[TOC]]

::: tip 要点速览

- v-model 在编译后会展开为：`prop: modelValue` + `event: update:modelValue`（在模板中以 `onUpdate:modelValue` 体现）。
- 两大使用场景：① 表单元素与响应式数据双向绑定；② 父子组件之间的数据同步（子改父）。
- defineModel 是编译期宏，等价于子组件接收 `modelValue` 与触发 `update:modelValue`，并在本地保持一个同步的 ref。

:::

::: info 使用场景

1. 表单元素双向绑定
2. 子组件对父组件数据的双向通信（含具名 v-model）。

:::

## 场景一：表单元素与响应式数据双向绑定

```html
<template>
  <div>
    <p>输入的内容为：{{ message }}</p>
    <input type="text" v-model="message" placeholder="请输入内容" />
  </div>
</template>

<script setup>
  import { ref } from "vue";
  const message = ref("Hello");
</script>

<style>
  input {
    padding: 8px;
    margin-top: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>
```

::: details 编译结果与说明
![](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-27-044828.png)

- v-model 被展开为一个名为 `onUpdate:modelValue` 的自定义事件，事件处理函数为：

```jsx
($event) => ($setup.message = $event);
```

- 输入值改变会触发该事件，从而写入响应式数据；而输入框的 `value` 又与 `setup.message` 绑定，数据变化驱动重新渲染，界面同步更新。
  :::

::: warning 表单常见注意点

- 输入法合成（IME）场景可能影响触发时机，可用 `v-model.lazy` 或手动监听 `change` 控制行为。
- 数值/空白处理可用修饰符：`v-model.number`、`v-model.trim`。
- 自定义组件充当输入框时，需要显式以 `modelValue`/`update:modelValue` 对齐 v-model 的编译约定。
  :::

## 场景二：父子组件数据同步（子组件使用 defineModel）

App.vue

```html
<template>
  <div class="app-container">
    <h1>请给产品打分：</h1>
    <RatingComponent v-model="rating" />
    <p v-if="rating > 0">您的评分：{{ rating }}/5</p>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import RatingComponent from "@/components/RatingComponent.vue";
  const rating = ref(3); // 评分的状态值
</script>
```

子组件 RatingComponent.vue

```html
<template>
  <div class="rating-container">
    <span v-for="star in 5" :key="star" class="star" @click="setRating(star)">
      {{ model >= star ? '★' : '☆' }}
    </span>
  </div>
</template>

<script setup>
  // 接收父组件通过 v-model 传递过来的状态
  const model = defineModel();

  function setRating(newRating) {
    // 通过触发更新事件（defineModel 已处理为本地 ref 同步）
    model.value = newRating;
  }
</script>

<style scoped>
  .rating-container {
    display: flex;
    font-size: 24px;
    cursor: pointer;
  }
  .star {
    margin-right: 5px;
    color: gold;
  }
  .star:hover {
    color: orange;
  }
</style>
```

::: details 编译结果与说明
App.vue：
![](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-27-045319.png)

- 传给子组件一个 `modelValue` 的 prop，值为 `$setup.rating`；并传入 `onUpdate:modelValue` 事件，事件处理函数为：

```jsx
($event) => ($setup.rating = $event);
```

RatingComponent.vue：
![](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-27-045928.png)

- 子组件通过 `modelValue` 读取父值；更新时触发 `update:modelValue`，父侧事件处理将新值写回到自身状态。
  :::

## 具名 v-model

具名 v-model 会改变 prop 与事件的命名：

![](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-05-27-050918.png)

- Props：`modelValue` → `title`
- 自定义事件：`update:modelValue` → `update:title`

::: warning 命名与约定

- 父模板里是 `v-model:title`；展开后对应 `:title` 与 `onUpdate:title`。
- 子组件需以 `title` 作为 prop，并触发 `update:title` 事件，或使用 `defineModel('title')` 统一处理。
  :::

## 小结

::: tip 总结

- v-model 的核心是“prop + 事件”的约定：`modelValue` 与 `update:modelValue`（模板中 `onUpdate:modelValue`）。
- 表单场景：事件驱动数据写入，数据变化再驱动界面更新；可用修饰符控制行为。
- 组件场景：子通过事件告诉父更新；`defineModel` 简化了子侧实现与同步逻辑。
  :::

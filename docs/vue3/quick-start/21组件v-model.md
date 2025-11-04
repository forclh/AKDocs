# ✨ 组件 v-model 👌

[[TOC]]

::: tip 要点速览

- `v-model` 让父子组件以“受控方式”交互，仍遵循单向数据流。
- Vue 3.4+ 推荐使用 `defineModel()`；旧版使用 `modelValue` + `update:modelValue`。
- `v-model` 绑定的是一个 `ref`，可直接用于内部表单的双向绑定。
- 支持命名与多个绑定：`v-model:title`、`v-model:first-name` 等。
- 修饰符只是“标记”，需在子组件 `set()` 中实现具体行为。
- 可选校验与默认值：`required`、`default`、`type`。
  :::

## 快速上手

父组件通过 `v-model` 受控地维护评分值；子组件使用 `defineModel()` 接收并更新：

```vue :collapsed-lines
<!-- App.vue -->
<template>
  <div class="app-container">
    <h1>请对本次服务评分：</h1>
    <Rating v-model="rating" />
    <p v-if="rating > 0">你当前的评价为 {{ rating }} 颗星</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Rating from "./components/Rating.vue";

// 父组件维护的受控状态
const rating = ref(0);
</script>

<style scoped>
.app-container {
  max-width: 600px;
  margin: auto;
  text-align: center;
  font-family: Arial, sans-serif;
}
p {
  font-size: 18px;
  color: #333;
}
</style>
```

```vue :collapsed-lines
<!-- components/Rating.vue -->
<template>
  <div class="rating-container">
    <span v-for="star in 5" :key="star" class="star" @click="setStar(star)">
      {{ model >= star ? "★" : "☆" }}
    </span>
  </div>
</template>

<script setup>
const model = defineModel();

function setStar(newStar) {
  model.value = newStar;
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

::: warning v-model 的约定

- 默认 `v-model` 对应子组件的 `props: modelValue` 与事件 `update:modelValue`。
- 使用 `defineModel()` 时由编译器自动展开为上述约定，不破坏单向数据流。
  :::

## 使用 defineModel（Vue 3.4+）

`defineModel()` 是一个编译期宏，展开为：

- `props: modelValue`
- `emits: update:modelValue`

返回值是一个 `ref`，可直接与表单控件绑定：

```vue
<script setup>
const model = defineModel();
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

::: tip 不破坏单向数据流

- 子组件并未直接修改父级数据，而是通过约定事件请求父级更新。
  :::

## 兼容旧版（3.4 之前）

未升级到 3.4 可手动遵守约定：

```vue
<script setup>
// 接收父组件传递下来的 Props
const props = defineProps(["modelValue"]);
// 触发父组件的事件
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

## 多个 v-model（命名）

当需要多个受控值时，使用命名 `v-model`：

```html
<!-- 父组件：为当前 v-model 指定名称 title -->
<MyComponent v-model:title="bookTitle" />
```

```vue
<!-- 子组件 MyComponent.vue -->
<script setup>
// 接收名为 title 的 v-model 绑定值
const title = defineModel("title");
</script>

<template>
  <input type="text" v-model="title" />
  <!-- 或者在内部以受控方式更新 title -->
</template>
```

多个命名 v-model：

```html
<!-- 父组件传递多个 v-model 绑定值 -->
<UserName v-model:first-name="first" v-model:last-name="last" />
```

```vue
<script setup>
// 子组件通过命名来指定要获取哪一个 v-model 绑定值
const firstName = defineModel("firstName");
const lastName = defineModel("lastName");
</script>

<template>
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
</template>
```

::: tip 命名转换规则

- 父层 `v-model:first-name` 会映射到子层 `defineModel('firstName')`。
- 保持父子命名语义一致，避免大小写或连字符不一致导致拿不到值。
  :::

## 修饰符与 setter

修饰符只是一个“标记”，子组件可以通过解构拿到并在 `set()` 中实现：

```vue
<script setup>
const [model, modifiers] = defineModel();
console.log(modifiers); // { capitalize: true }（若父层使用了 .capitalize）
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

示例：实现 `.capitalize` 修饰符效果：

```vue
<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  },
});
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

评分组件的 `.number` 修饰符与范围限制示例：

```vue
<script setup>
const [model, modifiers] = defineModel({
  required: true,
  set(value) {
    if (modifiers.number) {
      value = isNaN(value) ? 0 : Number(value);
      if (value < 0) value = 0;
      else if (value > 5) value = 5;
    }
    return value;
  },
});
</script>
```

::: warning 修饰符说明

- 修饰符不会自动生效，需在子组件中实现逻辑（通常在 `set()` 中）。
- 修饰符本质是“约束子组件更新父数据时的行为”。
  :::

## 验证与默认值

`defineModel` 支持简单的校验和默认值：

```js
// 使 v-model 必填
const model = defineModel({ required: true });
// 提供一个默认值
const model = defineModel({ default: 0 });
// 指定类型（仅在开发期帮助校验）
const model = defineModel({ type: String });
```

也可用于命名 v-model：

```js
const title = defineModel("title", { required: true });
const count = defineModel("count", { type: Number, default: 0 });
```

::: danger 常见误区

- 误以为 `v-model` 是双向任意修改；本质上仍是单向数据流的受控约定。
- 父子命名不一致：父写 `v-model:first-name`，子却写 `defineModel('firstname')`。
- 忘记在旧版实现中触发 `update:modelValue` 事件，导致父层值不更新。
- 误用 DOM 事件修饰符（如 `.stop`、`.prevent`）到组件 `v-model` 上。
  :::

## TypeScript（可选）

为 `defineModel` 添加类型更直观：

```ts
// 单个 v-model
const model = defineModel<number>({ required: true, default: 0 });

// 命名 v-model
const title = defineModel<string>("title");

// 修饰符 + setter（示例）
const [count, modifiers] = defineModel<number>({
  set(v) {
    return modifiers.number ? Number(v) : v;
  },
});
```

## 小结与后续

`v-model` 是组件受控设计的关键，与 Props 和自定义事件共同构成清晰的单向数据流：

1. 先理解 `defineModel()` 与旧版约定 `modelValue/update:modelValue`。
2. 再掌握命名与多个 `v-model` 的使用，以及修饰符的实现方式。
3. 最后结合 Props 与事件，构建可复用、易维护的组件。

::: tip 学习建议

- 建议配合阅读「Props」与「自定义事件」章节，形成完整的受控心智模型。
- 从一个小组件（如评分或输入框）开始实践命名与修饰符。
  :::

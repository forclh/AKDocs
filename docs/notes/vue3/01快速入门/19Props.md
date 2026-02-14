# ✨ Props 👌

[[TOC]]

::: tip 要点速览

- Props 是父组件向子组件传递数据的唯一入口，遵循单向数据流。
- 在 `<script setup>` 中用 `defineProps()` 声明接收的属性；编译期宏、零运行开销。
- 组件内使用驼峰命名；在模板（DOM）中对外传参用短横线命名。
- 非字符串值必须用动态绑定（`:`）；布尔型支持省略值语法（`<Comp disabled />`）。
- 对象/数组默认值必须使用工厂函数；提供类型、必填与自定义校验更稳健。
- 不要在子组件直接修改 props；如需本地副本，复制到内部状态后再改。
  :::

## 快速入门

示例组件 `UserCard.vue`：接收三个独立的 props 并渲染内容。

```vue :collapsed-lines :collapsed-lines
<template>
  <div class="user-card">
    <img :src="avatarUrl" alt="用户头像" class="avatar" />
    <div class="user-info">
      <h2>{{ name }}</h2>
      <p>{{ email }}</p>
    </div>
  </div>
</template>

<script setup>
// 宏：声明组件接收哪些 props（编译期展开）
const { name, email, avatarUrl } = defineProps({
  name: String,
  email: String,
  avatarUrl: String,
});
</script>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
}
.user-info h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}
.user-info p {
  margin: 5px 0 0;
  font-size: 16px;
  color: #666;
}
</style>
```

父组件使用：

```vue :collapsed-lines
<template>
  <div class="app-container">
    <UserCard
      name="张三"
      email="123@gamil.com"
      avatar-url="src/assets/yinshi.jpg"
    />
    <UserCard
      name="莉丝"
      email="456@gamil.com"
      avatar-url="src/assets/jinzhu.jpeg"
    />
  </div>
</template>

<script setup>
import UserCard from "./components/UserCard.vue";
</script>

<style scoped>
.app-container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
}
</style>
```

::: warning 命名风格

- 组件内部 props 声明用驼峰：`greetingMessage`。
- 组件外部传参（模板属性）用短横线：`greeting-message="hello"`。
  :::

## 动态 Props（绑定状态）

当父组件属性值来源于父组件自身的响应式状态时，应使用动态绑定：

```vue :collapsed-lines
<!-- 父组件模板 -->
<UserCard :name="user.name" :email="user.email" :avatar-url="user.avatarUrl" />
```

也可以将对象整体作为一个 prop 传入：

```vue :collapsed-lines
<!-- 子组件：UserCard.vue 接收对象 prop -->
<script setup>
defineProps({
  user: { type: Object, required: true },
});
</script>

<!-- 父组件：按对象传入，并提供修改入口 -->
<template>
  <div class="app-container">
    <UserCard :user="user" />
    <div class="input-group">
      <input type="text" placeholder="请输入新的名字" v-model="newName" />
      <button @click="changeName">确定修改</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import UserCard from "./components/UserCard.vue";

const user = ref({
  name: "张三",
  email: "123@gamil.com",
  avatarUrl: "src/assets/yinshi.jpg",
});
const newName = ref("");

function changeName() {
  if (newName.value.trim()) {
    user.value.name = newName.value;
  }
}
</script>

<style scoped>
.app-container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
}
.input-group {
  display: flex;
  margin-top: 20px;
}
input {
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}
button:hover {
  background-color: #0056b3;
}
</style>
```

::: tip 非字符串值必须动态绑定

- `number`、`boolean`、`array`、`object` 等非字符串类型，必须使用 `:` 动态绑定，否则会变成字符串。
- 布尔型简写：`<Comp disabled />` 等同于传 `true`；绑定变量用 `:disabled="isDisabled"`。
  :::

## 单向数据流与局部副本

Props 由父组件驱动，子组件不应直接修改：

```js
const props = defineProps(["foo"]);
// ❌ 警告！prop 是只读的
props.foo = "bar";
```

如需本地可变副本，复制到自身状态再修改：

```js
import { ref } from "vue";
const props = defineProps(["age"]);
const localAge = ref(props.age);
// 后续只改 localAge，不改 props
```

也可以基于 props 派生只读的计算数据：

```js
const props = defineProps(["size"]);
const normalizedSize = computed(() => props.size.trim().toLowerCase());
```

::: danger 常见误区

- 在子组件中直接写入 props 导致警告与数据来源混乱。
- 复制 props 时忘记与源保持同步需求（按需选择副本或计算属性）。
  :::

## 校验与默认值

在声明 props 时提供类型、必填、默认值和自定义校验：

```js :collapsed-lines
defineProps({
  // 单一类型
  propA: Number,

  // 多类型
  propB: [String, Number],

  // 必填
  propC: { type: String, required: true },

  // 基本类型默认值
  propD: { type: Number, default: 100 },

  // 对象默认值（必须用工厂函数）
  propE: {
    type: Object,
    default(rawProps) {
      return { message: "hello" };
    },
  },

  // 自定义校验（3.4+ 第二个参数是完整 props）
  propF: {
    validator(value, props) {
      return ["success", "warning", "danger"].includes(value);
    },
  },

  // 函数默认值（直接函数即可）
  propG: {
    type: Function,
    default() {
      return "Default function";
    },
  },
});
```

对 `UserCard.vue` 添加校验示例：

```js
defineProps({
  user: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && value.name && value.email && value.avatarUrl;
    },
  },
  age: { type: [Number, String], default: 18 },
});
```

::: tip 校验提示

- 校验在开发环境下给出警告，生产环境不会阻止渲染。
- 默认值仅在父组件未传该 prop 时生效；`null`/`undefined` 会跳过类型检查。
  :::

## TypeScript（可选）

在 `<script setup lang="ts">` 中，使用泛型与 `withDefaults` 更清晰：

```ts
type User = { name: string; email: string; avatarUrl: string };

const props = withDefaults(
  defineProps<{
    user?: User;
    size?: "sm" | "md" | "lg";
  }>(),
  {
    size: "md",
  }
);

// 直接解构保持响应性（仅限宏调用时的直接解构）
const { user, size } = props;
```

::: warning 解构的响应性

- 直接从 `defineProps(...)` 调用处解构，编译器会保留响应性(Vue 3.5+)。
- 先赋值给 `const props = defineProps(...)` 再从 `props` 解构，将失去编译期增强，可能影响响应性；推荐直接解构。
  :::

## 小结与后续

Props 是组件通信的第一步，接下来建议继续学习：

1. 自定义事件（`emit`，子 → 父反馈）
2. 插槽（结构与内容扩展）

::: tip 学习建议

- 先掌握命名、动态绑定、单向数据流与校验。
- 然后配合事件与插槽完成常见父子通信与组合模式。
  :::

# ✨ 虚拟 DOM 本质 👌

[[TOC]]

::: tip 要点速览

- 虚拟 DOM 是“用普通 JS 对象描述 UI 结构”的抽象层，常用 `h()` 创建。
- 直接操作真实 DOM 在初始化性能上最快；虚拟 DOM 在“更新阶段”更有优势。
- 与 `innerHTML` 对比：初始化差距不大；更新时虚拟 DOM 用 diff 精准打补丁。
- 抽象层带来跨平台与架构演进能力（渲染器解耦、Fiber/Vapor 等）。
- 合理使用 `key` 能显著提升 diff 效率；误用会造成性能与渲染错误。
  :::

## 快速上手

下面用一个最小例子直观理解“虚拟 DOM 是 JS 对象”，以及如何在 Vue 中使用 `h()`：

```vue :collapsed-lines
<!-- App.vue -->
<template>
  <div class="app-container">
    <h1>这是 App 组件</h1>
    <!-- 直接渲染子组件 -->
    <Child name="李四" email="123@qq.com" />
    <!-- 通过 vnode（虚拟 DOM）渲染同样的子组件 -->
    <component :is="vnode" />
  </div>
</template>

<script setup>
import { h } from "vue";
import Child from "@/components/Child.vue";

const vnode = h(Child, { name: "李四", email: "123@qq.com" });
console.log("vnode:", vnode); // 普通 JS 对象，描述了将要渲染的 UI
</script>

<style scoped>
.app-container {
  width: 400px;
  border: 1px solid #ccc;
  padding: 12px;
}
</style>
```

```vue :collapsed-lines
<!-- Child.vue -->
<template>
  <div class="child-container">
    <h3>这是子组件</h3>
    <p>姓名：{{ name }}</p>
    <p>email：{{ email }}</p>
  </div>
</template>

<script setup>
defineProps({ name: String, email: String });
</script>

<style scoped>
.child-container {
  width: 200px;
  height: 160px;
  border: 1px solid #999;
  padding: 8px;
}
</style>
```

::: warning 性能认知与前提

- 虚拟 DOM 并非“任何场景都更快”，直接命令式 DOM 操作在“初始化”通常更快。
- 虚拟 DOM 优势主要体现在“更新阶段”：通过 diff 只更新必要的真实 DOM。
- 小型、一次性渲染的页面，`innerHTML` 与虚拟 DOM 初始化性能接近，差异不大。
  :::

## 核心概念

### DOM 如何被 JS 调用（简要）

浏览器内核（C++）通过 WebIDL 暴露接口，JS 引擎通过绑定层调用底层能力：

```js
// JS 层使用 DOM API
const div = document.createElement("div");
```

```cpp
// （化简示意）绑定层将 JS 调用映射到 C++ 实现
void Document_createElement(const v8::FunctionCallbackInfo<v8::Value>& args) {
  // 省略细节：取参、调用底层 C++ createElement，再把结果包回 JS
}
```

真实 DOM 指的是“浏览器底层已创建且参与渲染的节点”；任何改动（如 `appendChild`）都可能触发重排/重绘，代价较高。

### 什么是虚拟 DOM（VNode）

- 用**普通 JS 对象来描述 UI 的结构**（标签、属性、子节点等）。
- 框架持有这层抽象，在需要更新时**用 diff 计算最小变更，再对真实 DOM 打补丁**。

```js
// 一个可能的 vnode 形状（示例）
const vnode = {
  type: "div",
  props: { class: "message" },
  children: [
    { type: "span", children: "张三" },
    { type: "span", children: "2024.5.6" },
  ],
};
```

## 初始化 vs 更新：为什么虚拟 DOM“更像更新利器”

### 传统命令式与 `innerHTML`

命令式创建（性能高但心智负担重）：

```js
const app = document.getElementById("app");
const messageDiv = document.createElement("div");
messageDiv.className = "message";
const infoDiv = document.createElement("div");
infoDiv.className = "info";
const nameSpan = document.createElement("span");
nameSpan.textContent = "张三";
infoDiv.appendChild(nameSpan);
const dateSpan = document.createElement("span");
dateSpan.textContent = "2024.5.6";
infoDiv.appendChild(dateSpan);
messageDiv.appendChild(infoDiv);
app.appendChild(messageDiv);
```

模板字符串（`innerHTML`）创建（易写但需要解析字符串）：

```js
const app = document.getElementById("app");
app.innerHTML += `
  <div class="message">
    <div class="info">
      <span>张三</span>
      <span>2024.5.6</span>
    </div>
    <p>这是一堂讲解虚拟 DOM 的课</p>
    <div class="btn">
      <a href="#" class="removeBtn" _id="1">删除</a>
    </div>
  </div>`;
```

### 更新阶段的差异

- `innerHTML` 更新通常是：销毁旧 DOM → 解析新字符串 → 重新创建全部 DOM。
- 虚拟 DOM 更新是：JS 层做 diff → 只在 DOM 层进行必要的最小更新。

示例：点击按钮更新时间（`innerHTML` 方式）：

```html
<button id="updateButton">更新内容</button>
<div id="content"></div>
```

```js
document.getElementById("updateButton").addEventListener("click", () => {
  const now = new Date().toTimeString().split(" ")[0];
  content.innerHTML = `
    <div class="message">
      <div class="info">
        <span>张三</span>
        <span>${now}</span>
      </div>
      <p>这是一堂讲解虚拟 DOM 的课</p>
      <div class="btn">
        <a href="#" class="removeBtn" _id="1">删除</a>
      </div>
    </div>`;
});
```

::: tip 实战对比：全量重建 vs 精准补丁

- 方式一（`innerHTML`）：上面示例每次更新都会重建整段 DOM（销毁 + 解析 + 重新创建）。
- 方式二（Vue + 虚拟 DOM）：仅更新时间文本，其他结构保持不动，框架在 JS 层 diff 后只更新必要节点。

```vue :collapsed-lines
<!-- Vue 3 示例：仅更新时间文本，避免整段重建 -->
<template>
  <div class="message">
    <div class="info">
      <span>张三</span>
      <span>{{ now }}</span>
    </div>
    <p>这是一堂讲解虚拟 DOM 的课</p>
    <div class="btn">
      <a href="#" class="removeBtn" _id="1">删除</a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
const now = ref("");
let timer;
onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date().toTimeString().split(" ")[0];
  }, 1000);
});
onBeforeUnmount(() => clearInterval(timer));
</script>
```

- 直观感受：在频繁更新场景中，虚拟 DOM 通过“精准补丁”减少不必要的重建与重排/重绘。
  :::

::: info 性能对比的正确打开方式

- 比较对象不同：**与“原生命令式 DOM”比，虚拟 DOM 多一层计算，初始化更慢**。
- 与 `innerHTML` 比：初始化阶段差不多；更新阶段虚拟 DOM 通常更优（避免全量重建）。
- 结论：虚拟 DOM 价值在于“**复杂组件的频繁更新场景**”，不是初始化加速器。
  :::

## h() 与渲染抽象的价值

在 Vue 中，`h()` 将组件/元素转为 vnode，框架统一在抽象层做决策：

```js
import { h } from "vue";
const vnode = h("div", { class: "box" }, [h("span", null, "Hello")]);
```

- 抽象带来跨平台：同一套 vnode 可由不同渲染器“落地”到浏览器、原生（Weex）、Canvas、SSR 等。
- 框架演进更安全：如 React 从 Stack → Fiber、Vue 的 Vapor 模式，均可在不侵入业务的前提下替换内部策略。

::: tip 架构与渲染器解耦

- 依赖倒置：业务代码依赖抽象（vnode/渲染 API），不直接依赖具体 DOM 实现。
- 好处：底层渲染器可替换升级；上层业务仍保持稳定 API 与心智模型。
  :::

## 实战：key 失误导致渲染错位

::: danger 问题复现

- 在列表中使用 `index` 作为 `key` 或不写 `key`，当数据插入、删除或重排时，DOM 可能被错误复用，导致输入框内容“串位”、动画错乱等。
  :::

错误示例（`key` 用索引，打乱顺序后输入值会跟着错位）：

```vue :collapsed-lines
<template>
  <div>
    <button @click="shuffle">打乱顺序</button>
    <ul>
      <li v-for="(user, i) in users" :key="i">
        <input v-model="user.name" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
const users = ref([
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Carol" },
]);
const shuffle = () => {
  users.value.sort(() => Math.random() - 0.5);
};
</script>
```

正确示例（使用稳定且唯一的 `key`，如 `id`）：

```vue :collapsed-lines
<template>
  <div>
    <button @click="shuffle">打乱顺序</button>
    <ul>
      <li v-for="user in users" :key="user.id">
        <input v-model="user.name" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
const users = ref([
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Carol" },
]);
const shuffle = () => {
  users.value.sort(() => Math.random() - 0.5);
};
</script>
```

### 为什么你可能“看不出区别”？

在上面的简单示例里，`v-model="user.name"` 绑定的是父层数组里的同一个对象属性。打乱顺序只是移动了对象的位置，输入值会跟着对象一起移动，因此表面看不出错位。

更能体现差异的是“子组件持有本地状态”的场景：当组件实例被错误复用，本地状态会绑定到错误的数据项上，出现明显错位。

错误示例（索引 key 导致子组件实例按位置复用，状态串位）：

```vue :collapsed-lines
<!-- UserItem.vue：子组件持有本地状态，不直接改父层数据 -->
<template>
  <div class="row">
    <span class="label">{{ user.id }}</span>
    <input v-model="draftName" />
    <small class="ts">mountedAt: {{ mountedAt }}</small>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({ user: { type: Object, required: true } });
const draftName = ref(props.user.name); // 本地草稿，未与父层双向绑定
const mountedAt = Date.now(); // 用于观察实例是否被复用/重建
</script>

<style scoped>
.row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.label {
  width: 32px;
  color: #888;
}
.ts {
  color: #999;
}
</style>
```

```vue :collapsed-lines
<!-- 错误用法：索引 key，打乱后子组件实例按位置复用，draftName 会串位到别的用户 -->
<template>
  <div>
    <button @click="shuffle">打乱顺序</button>
    <UserItem v-for="(user, i) in users" :key="i" :user="user" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import UserItem from "./UserItem.vue";
const users = ref([
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Carol" },
]);
const shuffle = () => {
  users.value.sort(() => Math.random() - 0.5);
};
</script>
```

正确示例（稳定 `id` 作为 key，组件实例随数据项移动或重建，状态不串位）：

```vue :collapsed-lines
<template>
  <div>
    <button @click="shuffle">打乱顺序</button>
    <UserItem v-for="user in users" :key="user.id" :user="user" />
  </div>
</template>

<script setup>
// 同上 users 与 shuffle；关键在 :key="user.id"
</script>
```

- 错误用法下，输入框的值会跟着位置走（实例复用），而不是跟着数据项走。
- 正确用法下，组件实例与其数据项绑定稳定，输入值不会串位；`mountedAt` 也能帮助观察复用/重建行为。

::: info 结论

- 简单“直接改同一对象属性”的示例可能不显差异；但涉及本地状态、动画、表单焦点、过渡等场景时，错误 `key` 会导致明显错位与状态污染。
- 始终使用稳定且唯一的 `key`（如后端返回的 `id`）。
  :::

::: tip 使用建议

- `key` 是 diff 的“锚点”：帮助框架识别节点身份，决定复用、移动或销毁。
- 选择稳定、唯一的标识（如数据库主键、后端返回的 `id`）；避免使用索引或非唯一值。
- 在过渡动画、可编辑表单、拖拽排序等场景必须保证 `key` 稳定，否则易出现错位与状态串扰。
  :::

## 框架趋势与取舍

- 无虚拟 DOM 的路线（Svelte、Solid.js）：编译期生成命令式更新代码，通常在性能上更优。
- Vue Vapor 模式（实验）：探索无需传统虚拟 DOM 的更新路径，进一步降低运行时开销。
- 取舍关键：开发体验（抽象、生态）与极致性能之间的平衡；看业务场景与团队偏好。

::: danger 常见误区

- 误以为“虚拟 DOM 一定更快”；忽视初始化阶段与场景差异。
- 忽视 `key` 的重要性：列表未设置稳定 `key` 会造成复用错误与性能问题。
- 在小场景硬上虚拟 DOM：简单一次性渲染用模板/`innerHTML`即可，过度抽象反增复杂度。
- 将虚拟 DOM 当作“数据传输通道”；它是“结构抽象”，数据与交互仍需 Props/事件/状态管理。
  :::

## 小结与后续

1. 虚拟 DOM 是“结构抽象”，在更新阶段通过 diff 精准打补丁，提升复杂界面更新效率。
2. 初始化阶段命令式/`innerHTML` 与虚拟 DOM 差距不大；场景选择应基于复杂度与维护成本。
3. 抽象层带来跨平台与架构演进的能力，使框架能在不侵入业务的前提下升级策略。

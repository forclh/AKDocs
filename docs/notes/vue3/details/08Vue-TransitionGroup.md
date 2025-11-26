# 【Vue】TransitionGroup

[[TOC]]

::: tip 要点速览

- 作用：为“多个元素/列表项”的新增、删除与重新排序应用过渡/移动动画。
- 容器：默认不渲染容器；通过 `tag` 指定容器元素（如 `ul/div`）。
- key：列表项必须具备唯一且稳定的 `:key`，否则无法正确动画与复用。
- 模式：不支持 `mode`；因为不是两个互斥元素的切换场景。
- 类名：过渡类应用在子元素上；重新排序使用 `name-move` 类。
- 建议：为 `*-move` 提供 `transition: transform/opacity` 等以触发移动动画。

:::

## 动机与定义

`TransitionGroup` 是 Vue 的内置组件，专为“多个元素”或“列表项”的过渡而设计。与只包裹单个根节点的 `Transition` 不同，<span style="color:red">`TransitionGroup` 能够在元素新增、删除与重新排序时分别为每一个子元素挂载/移除过渡类。</span>

下面代码把 `Transition` 包在 `ul` 外层，新增/删除的是 `li`，因此不会触发过渡：

```vue :collapsed-lines
<template>
  <div class="container">
    <div class="btns">
      <button @click="addItem">添加项目</button>
      <button @click="removeItem">移除项目</button>
    </div>
    <Transition name="fade">
      <ul>
        <li v-for="item in items" :key="item" class="box">{{ item }}</li>
      </ul>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
const items = ref(["内容1", "内容2", "内容3"]);
const addItem = () => items.value.push(`内容${items.value.length + 1}`);
const removeItem = () => items.value.pop();
</script>

<style scoped>
.container {
  text-align: center;
}
.btns button {
  margin: 1em 0.5em;
}
.box {
  background: #42b983;
  color: #fff;
  margin: 5px auto;
  padding: 10px;
  width: 200px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

正确做法是使用 `TransitionGroup`，将过渡直接应用到每个 `li` 上：

```vue
<TransitionGroup name="fade" tag="ul">
  <li v-for="item in items" :key="item" class="box">{{ item }}</li>
</TransitionGroup>
```

## 快速上手

```vue :collapsed-lines
<template>
  <div class="container">
    <div class="btns">
      <button @click="addItem">添加</button>
      <button @click="removeItem">移除</button>
    </div>
    <TransitionGroup name="fade" tag="ul">
      <li v-for="item in items" :key="item" class="box">{{ item }}</li>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref } from "vue";
const items = ref(["A", "B", "C"]);
const addItem = () =>
  items.value.unshift(`N${Math.random().toString(36).slice(2, 5)}`);
const removeItem = () => items.value.shift();
</script>

<style scoped>
.container {
  text-align: center;
}
.btns button {
  margin: 1em 0.5em;
}
.box {
  background: #42b983;
  color: #fff;
  margin: 5px auto;
  padding: 10px;
  width: 200px;
}
.fade-enter-active,
.fade-leave-active,
.fade-move {
  transition: all 0.5s;
}
.fade-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
```

## 相关细节

`TransitionGroup` 与 `Transition` 的共同点：支持相同命名规则的过渡类与 JS 钩子；不同点如下：

- 默认不渲染容器元素；需要容器时使用 `tag` 指定（如 `ul`）。
- 不支持 `mode`；列表不是两个互斥元素的切换。
- 必须为每个列表项提供唯一且稳定的 `:key`（避免使用数组下标）。
- 过渡类应用在子元素，而非容器元素；重新排序时为受影响的元素添加 `name-move`。

## 实战案例

使用过渡效果优化待办事项的显示与排序动画：

```vue :collapsed-lines
<template>
  <div class="container">
    <input
      type="text"
      placeholder="Add a new todo"
      class="todo-content"
      v-model="newTodo"
      @keypress.enter="addTodo"
    />
    <TransitionGroup tag="ul" name="fade" class="todo-container">
      <li v-for="todo in todos" :key="todo.id" class="todo">
        <span>{{ todo.content }}</span>
        <button @click="deleteTodo(todo.id)">删除</button>
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref } from "vue";
const newTodo = ref("");
const todos = ref([
  { id: id(), content: "Learn Vue.js", done: false },
  { id: id(), content: "Learn Vite", done: false },
]);
function id() {
  return Math.random().toString(36).slice(2, 9);
}
function deleteTodo(id) {
  todos.value = todos.value.filter((t) => t.id !== id);
}
function addTodo() {
  if (newTodo.value.trim()) {
    todos.value.unshift({ id: id(), content: newTodo.value, done: false });
    newTodo.value = "";
  }
}
</script>

<style scoped>
.container {
  width: 600px;
  margin: 1em auto;
  padding: 1.5em;
  border-radius: 5px;
}
.todo-content {
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  border-radius: 5px;
  outline: none;
  font-size: 1.3em;
  padding: 0 1em;
  border: 1px solid #ccc;
}
.todo-container {
  list-style: none;
  padding: 0;
  margin: 1em 0;
}
.todo {
  padding: 0.5em 0;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
}
.fade-enter-active,
.fade-leave-active,
.fade-move {
  transition: all 0.5s;
}
.fade-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
```

## 常见误区与实践建议

- 使用稳定 `:key`：避免数组下标；使用业务 ID 保持实例稳定与动画可预期。
- 触发移动动画：`name-move` 只有在存在位移时才会触发；通常通过 `transform` 更可靠。
- 类应用位置：所有过渡类加在“子元素”上，不会加在容器（`tag`）元素上。
- 模式不可用：不要尝试在 `TransitionGroup` 上使用 `mode`；针对互斥元素切换请用 `Transition`。

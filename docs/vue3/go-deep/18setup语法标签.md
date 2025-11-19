# ✨ setup 语法标签 👌

[[TOC]]

::: tip 要点速览

- `<script setup>` 是 Composition API 的语法糖，顶层声明自动向模板暴露。
- 编译期宏：`defineProps`、`defineEmits`、`defineExpose`、`defineSlots`、`defineModel` 仅在编译阶段展开。
- 相比传统 `setup()`：不再 `return`，默认不暴露实例成员，需要显式 `defineExpose`。
- TS 友好：更强类型推断与更少样板代码；通常无需配合 `defineComponent`。
- 宏必须位于模块顶层，不能置于条件、循环或函数内部。
  :::

## 概念回顾

- `setup()` 是组件逻辑入口；`<script setup>` 将其简化为“顶层即逻辑”。
- 顶层变量与函数在编译后映射到渲染上下文，模板可直接使用。
- 宏用于描述编译意图：属性、事件、暴露、插槽、模型等。

::: info 运行期与编译期的分工

- 运行期负责响应式与渲染；宏只在编译期生效，运行时并不存在宏函数实体。
- 顶层声明生成的渲染上下文是“每个组件实例一份”，并非共享的模块全局。
  :::

## **Vue2 经典写法**

Vue2 时期采用的是 Options API 语法，这是一种经典写法。

TaskManager.vue

```vue :collapsed-lines
<template>
  <div class="task-manager">
    <h3>任务列表</h3>
    <div class="toolbar">
      <input v-model="newTaskTitle" placeholder="输入新任务" />
      <button @click="addTask">新增</button>
    </div>
    <ul class="list">
      <li v-for="t in tasks" :key="t.id">
        <span class="title" :class="{ completed: t.completed }">{{
          t.title
        }}</span>
        <button class="btn" @click="completeTask(t.id)">完成</button>
        <button class="btn" @click="uncompleteTask(t.id)">撤销</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "TaskManager",
  props: {
    initialTasks: { type: Array, required: true, default: () => [] },
  },
  data() {
    return { tasks: [...this.initialTasks], newTaskTitle: "" };
  },
  methods: {
    addTask() {
      if (this.newTaskTitle.trim() === "") return;
      this.tasks.push({
        id: Date.now(),
        title: this.newTaskTitle,
        completed: false,
      });
      this.newTaskTitle = "";
    },
    completeTask(id) {
      const task = this.tasks.find((task) => task.id === id);
      if (task) {
        task.completed = true;
        this.$emit("task-completed", task);
      }
    },
    uncompleteTask(id) {
      const task = this.tasks.find((task) => task.id === id);
      if (task) {
        task.completed = false;
        this.$emit("task-uncompleted", task);
      }
    },
  },
};
</script>

<style scoped>
.task-manager {
  max-width: 560px;
  margin: 0 auto;
}
.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.toolbar input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn {
  margin-left: 8px;
}
.list {
  list-style: none;
  padding: 0;
}
.list li {
  display: flex;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
}
.title {
  flex: 1;
}
.completed {
  text-decoration: line-through;
}
</style>
```

## **Vue3 初期写法**

Vue3 时期，官方提出了 Composition API 风格，这种风格能够对组件的共有模块进行一个更好的组合复用。

```vue :collapsed-lines
<script>
import { ref, toRefs } from "vue";
export default {
  name: "TaskManager",
  props: {
    initialTasks: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  emits: ["task-completed", "task-uncompleted"],
  setup(props, { emit }) {
    // setup是一个生命周期方法
    // 在该方法中书写数据以及函数
    const { initialTasks } = toRefs(props);
    const tasks = ref([...initialTasks.value]); // 任务列表
    const newTaskTitle = ref(""); // 存储新任务的标题

    // 添加任务
    const addTask = () => {
      if (newTaskTitle.value.trim() === "") {
        return;
      }
      tasks.value.push({
        id: Date.now(),
        title: newTaskTitle.value,
        completed: false,
      });
      newTaskTitle.value = "";
    };
    // 完成任务
    const completeTask = (taskId) => {
      const task = tasks.value.find((task) => task.id === taskId);
      if (task) {
        task.completed = true;
        // 触发自定义事件
        emit("task-completed", task);
      }
    };
    // 取消完成任务
    const uncompleteTask = (taskId) => {
      const task = tasks.value.find((task) => task.id === taskId);
      if (task) {
        task.completed = false;
        // 触发自定义事件
        emit("task-uncompleted", task);
      }
    };

    // 最后需要返回一个对象
    // 该对象里面就包含了需要在模板中使用的数据以及方法
    return {
      tasks,
      newTaskTitle,
      addTask,
      completeTask,
      uncompleteTask,
    };
  },
};
</script>
```

可以看出，早期的 Vue3 的 CompositionAPI 写法，实际上有 OptionsAPI 写法的影子，和 Vue2 的语法有一定的相似性，**同样都是导出一个对象，最重要的特点是对象中多了一个 setup 函数**。

这是一个新的生命周期钩子方法，在该方法中，我们可以定义对应的数据和方法，并且在最后返回出去，在模板中可以使用所返回的数据和方法。

::: info setup 返回渲染函数

在早期 Composition API 中，`setup()` 也可以直接返回一个“渲染函数”，从而不依赖 `<template>`，利用**闭包**的特性，访问到 `setup()` 中的数据和方法。

```js :collapsed-lines
import { h, ref } from "vue";
export default {
  setup() {
    const count = ref(0);
    const add = () => {
      count.value++;
    };
    // 返回渲染函数：每次渲染根据响应式状态生成 VNode
    return () => h("button", { onClick: add }, `Count: ${count.value}`);
  },
};
```

官方推荐使用 `<template>` 定义组件视图；`<template>` 在构建阶段会被编译成 `render()` 函数。手写渲染函数与模板的运行效果等价，而模板更易读，渲染函数/JSX 更适合高度动态的节点拼装与可视化场景。

:::

## **defineComponent 写法**

defineComponent 是 Vue 3 中引入的一个**辅助函数**，主要用于定义 Vue 组件，特别是在使用 **TypeScript 时提供更好的类型推断和校验**。

通过使用 defineComponent，我们可以：

1. 自动推断类型：减少显式类型注解，使代码更简洁。
2. 减少冗余：不需要手动定义 Props 接口和响应式数据的类型。
3. 提高可读性：使代码更易读、更易维护。

```vue :collapsed-lines
<script>
import { defineComponent, toRefs, ref } from "vue";
export default defineComponent({
  name: "TaskManager",
  props: {
    initialTasks: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  emits: ["task-completed", "task-uncompleted"],
  setup(props, { emit }) {
    // setup是一个生命周期方法
    // 在该方法中书写数据以及函数
    const { initialTasks } = toRefs(props);
    const tasks = ref([...initialTasks.value]); // 任务列表
    const newTaskTitle = ref(""); // 存储新任务的标题

    // 添加任务
    const addTask = () => {
      if (newTaskTitle.value.trim() === "") {
        return;
      }
      tasks.value.push({
        id: Date.now(),
        title: newTaskTitle.value,
        completed: false,
      });
      newTaskTitle.value = "";
    };
    // 完成任务
    const completeTask = (taskId) => {
      const task = tasks.value.find((task) => task.id === taskId);
      if (task) {
        task.completed = true;
        // 触发自定义事件
        emit("task-completed", task);
      }
    };
    // 取消完成任务
    const uncompleteTask = (taskId) => {
      const task = tasks.value.find((task) => task.id === taskId);
      if (task) {
        task.completed = false;
        // 触发自定义事件
        emit("task-uncompleted", task);
      }
    };

    // 最后需要返回一个对象
    // 该对象里面就包含了需要在模板中使用的数据以及方法
    return {
      tasks,
      newTaskTitle,
      addTask,
      completeTask,
      uncompleteTask,
    };
  },
});
</script>
```

可以看出，defineComponent 仅仅只是一个辅助方法，和 TS 配合得更好。但是并没有从本质上改变初期 Composition API 的写法。

## **setup 标签写法**

从 Vue3.2 版本开始正式引入了 setup **语法糖**，它简化了使用 Composition API 时的书写方式，使得组件定义更加简洁和直观，**编译后的结果与传统的 setup 函数相同**。

其优化的点主要如下：

1. 简化书写：在传统的 setup 函数中，我们需要返回一个对象，其中包含需要在模板中使用的变量和方法。在 `<script setup>` 中，这一步被省略了，所有定义的**顶层变量和方法会自动暴露给模板使用，从而减少了样板代码**。
2. 更好的类型推断：在 `<script setup>` 中所有定义的内容都是顶层变量，TypeScript 的类型推断更加直观和简单。

```vue :collapsed-lines
<script setup>
import { ref, toRefs } from "vue";

const props = defineProps({
  initialTasks: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["task-completed", "task-uncompleted"]);

const { initialTasks } = toRefs(props);
const tasks = ref([...initialTasks.value]); // 任务列表
const newTaskTitle = ref(""); // 存储新任务的标题
// 添加任务
const addTask = () => {
  if (newTaskTitle.value.trim() === "") {
    return;
  }
  tasks.value.push({
    id: Date.now(),
    title: newTaskTitle.value,
    completed: false,
  });
  newTaskTitle.value = "";
};
// 完成任务
const completeTask = (taskId) => {
  const task = tasks.value.find((task) => task.id === taskId);
  if (task) {
    task.completed = true;
    // 触发自定义事件
    emit("task-completed", task);
  }
};
// 取消完成任务
const uncompleteTask = (taskId) => {
  const task = tasks.value.find((task) => task.id === taskId);
  if (task) {
    task.completed = false;
    // 触发自定义事件
    emit("task-uncompleted", task);
  }
};
</script>
```

在 `<script setup>` 中无需编写 `export default`、`setup()` 与 `return`；在脚本顶层定义的变量与函数会自动向模板暴露，可直接使用。

::: info 模板可访问范围

- 顶层响应式变量与普通变量
- 顶层函数与导入的组件（导入即用，无需 `components:{}`）
- 宏的结果：`defineProps`、`defineEmits`、`defineExpose`、`defineSlots`、`defineModel`
  :::

::: info 什么是“宏”（编译期特性）
宏是编译阶段执行的代码生成/替换机制，运行时并不存在相应的函数实体。在 Vue 中，`defineProps/defineEmits/...` 会在编译期被展开为等价的组件选项配置。

举个例子，在 C 语言中通过 #define 来定义宏：

```c
#define PI 3.14159
#define SQUARE(x) ((x) * (x))

int main() {
    double area = PI * SQUARE(5);
    return 0;
}
```

在编译开始之前，会将 PI 替换为 3.14159，将 SQUARE(5) 替换为 ((5) \* (5))

理解了这一点，再看 `defineProps` 与 `defineEmits`，即可将它们视为“编译期展开到选项对象”的语法糖。

```jsx
export default {
  // ...
  props: {
    initialTasks: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  emits: ["task-completed", "task-uncompleted"],
  // ...
};
```

这一点可通过 `vite-plugin-inspect` 的编译产物分析验证：`<script setup>` 会被还原为早期 Composition API 写法（选项对象 + `setup()`），从而保证运行期一致性。
:::

## 组件实例暴露

`<script setup>` 默认不向外部暴露任何实例成员。若希望通过父侧 `ref` 访问子组件的内部方法/数据，需要显式暴露：

> 一般来讲，父组件管理父组件的数据和方法，子组件管理子组件的数据和方法，如果涉及到通信，那么通过 props 的方式来进行传递。但如果一个组件通过 ref 获取到组件实例，在早期的 Composition API 中，能够拿到组件内部所有数据和方法的。

在传统 Composition API 中，通过 `setup(props, { expose })` 暴露；在 `<script setup>` 中使用 `defineExpose`。

```jsx
export default {
  setup(props, { emit, expose }) {
    expose({
      // 要暴露的成员
    });
  },
};
```

而到了 setup 标签写法中，则**默认行为就是不向外部暴露任何的成**员。如果想要暴露某个成员，仍然是通过 expose 的方式，这里会涉及到一个 defineExpose 的宏。

```jsx
defineExpose({
  // 要暴露的成员
});
```

::: warning 常见误区与工程要点

- 宏必须顶层调用；不要放入条件、循环或函数体。
- 直接解构 `props` 会失去响应性；使用 `toRefs` 或 `toRef`。
- `<script setup>` 不写 `return`；顶层声明自动暴露到模板。
- 在 `<script setup>` 中通常不需要 `defineComponent`；避免冗余与混用。
- 每个组件实例拥有独立的渲染上下文；顶层声明不会跨实例共享。
  :::

## 小结

::: tip 总结

- `<script setup>` 以编译期宏简化组件定义与通信约定，减少样板代码。
- 顶层声明自动暴露、宏顶层调用、`props` 响应性保持是使用关键。
- 实战建议：业务组件优先 `<script setup>`；与 TS 结合时必要时使用 `defineComponent` 增强类型。
  :::

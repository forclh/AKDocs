# 【State】组件通信方式总结 ✨

[[TOC]]

::: tip 要点速览

- 分类：父子组件通信与跨层级组件通信
- 父子：Props、Emits/自定义事件、属性透传、ref 引用、作用域插槽
- 跨层级：provide/inject、事件总线、简易数据仓库（推荐使用 Pinia）
- 原则：数据自上而下流动、事件自下而上冒泡；避免直接修改父传入的 `props`
- 响应性：避免直接解构 `props`；使用 `toRefs/toRef` 保持响应性
- 选择建议：简单父子用 Props/Emits；跨层级用 inject 或状态库；全局复杂状态优先 Pinia
  :::

## 概念与分类

组件通信用于在不同组件之间传递数据或触发行为。常见分为两类：

- 父子组件通信：父子直接耦合，单向数据流与事件反馈
- 跨层级组件通信：祖先与任意后代或同级之间的解耦通信

## 父子组件通信

### Props（父传子）

```vue title="Parent.vue"
<Child :title="msg" :count="n" />
```

```vue title="Child.vue"
<script setup>
const props = defineProps({
  title: String,
  count: { type: Number, default: 0 },
});
</script>
```

::: info 要点与注意

- 单向数据流：子组件不要修改 `props`，派发事件通知父侧变更
- 类型与默认值：使用 `type/default/required/validator` 增强健壮性
- 响应性：直接解构会失去响应性，配合 `toRefs/toRef`

:::

### 自定义事件（子传父）与 v-model

```vue title="Child.vue"
<script setup>
const emit = defineEmits(["submit"]);
const onClick = () => emit("submit", { id: 1 });
</script>
```

```vue title="Parent.vue"
<Child @submit="onSubmit" />
```

### 属性透传（Fallthrough Attributes）

父侧未声明为 `props/emits` 的属性会自动透传到子组件根元素。可按需关闭并手动绑定：

```vue title="Child.vue"
<template>
  <div>
    <p v-bind="$attrs"></p>
  </div>
</template>

<script setup>
defineOptions({ inheritAttrs: false });
</script>
```

::: info 常见透传属性

- `class/style/id/aria-*` 等无须在子组件声明即可传递
- 需要绑定到非根元素时关闭 `inheritAttrs` 并手动 `v-bind="$attrs"`

:::

### ref 引用（父获取子实例能力）

```vue title="Parent.vue"
<template>
  <div>
    <Child ref="child" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const child = ref(null);
onMounted(() => child.value?.reset());
</script>
```

```vue title="Child.vue"
<script setup>
const reset = () => {};
defineExpose({ reset });
</script>
```

### 作用域插槽（子向父暴露数据片段）

```vue title="Child.vue"
<template>
  <div>
    <slot :user="user"></slot>
  </div>
</template>

<script setup>
const user = { name: "Alice", email: "alice@example.com" };
</script>
```

```vue title="Parent.vue"
<template>
  <div>
    <Child v-slot="{ user }">
      <span>{{ user.name }}</span>
      <span>{{ user.email }}</span>
    </Child>
  </div>
</template>
```

![](https://bu.dusays.com/2025/11/04/6909b4b850acb.png)

## 跨层级组件通信

### provide/inject（祖先与后代）

```js title="main.ts"
// main.ts 或祖先组件
app.provide("theme", "dark");
```

```js
// 任意后代组件
const theme = inject("theme", "light");
```

::: info 进阶要点

- 使用 `Symbol` 作为 key 提升可维护性与避免冲突
- 注入响应式对象保持响应性；必要时配合只读包装防止误改
- 提供在应用或局部祖先组件调用，作用域为其后代树

:::

### 事件总线（发布-订阅）

```js title="bus.ts"
// 使用mitt库实现事件总线
import mitt from "mitt";
export const bus = mitt();
```

```js
bus.on("save", handler);
bus.emit("save", data);
bus.off("save", handler);
```

::: details 事件总线原理

原理：本质上是设计模式里面的观察者模式，有一个对象（事件总线）维护一组依赖于它的对象（事件监听器），当自身状态发生变化的时候会通过所有的事件监听器。

- 核心操作：
  1.  发布事件：发布通知，通知所有的依赖自己去执行监听器方法
  2.  订阅事件：其他对象可以订阅某个事件，当事件发生时，就会触发相应的回调函数
  3.  取消订阅
- 事件总线的核心代码(简易)如下：

  ```js title="eventBus.js"
  class EventBus {
    constructor() {
      // 维护一个事件列表
      this.events = {};
    }

    /**
     * 订阅事件
     * @param {*} event 你要订阅哪个事件
     * @param {*} listener 对应的回调函数
     */
    on(event, listener) {
      if (!this.events[event]) {
        // 说明当前没有这个类型
        this.events[event] = [];
      }
      this.events[event].push(listener);
    }

    /**
     * 发布事件
     * @param {*} event 什么类型
     * @param {*} data 传递给回调函数的数据
     */
    emit(event, data) {
      if (this.events[event]) {
        // 首先有这个类型
        // 通知这个类型下面的所有的订阅者（listener）执行一遍
        this.events[event].forEach((listener) => {
          listener(data);
        });
      }
    }

    /**
     * 取消订阅
     * @param {*} event 对应的事件类型
     * @param {*} listener 要取消的回调函数
     */
    off(event, listener) {
      if (this.events[event]) {
        // 说明有这个类型
        this.events[event] = this.events[event].filter((item) => {
          return item !== listener;
        });
      }
    }
  }

  const eventBus = new EventBus();
  export default eventBus;
  ```

:::

### 自定义数据仓库（简易状态容器）

定义仓库

```js title="store.js"
import { reactive } from "vue";
export const store = reactive({
  todos: [
    { id: 1, text: "学习Vue3", completed: false },
    { id: 2, text: "学习React", completed: false },
    { id: 3, text: "学习Angular", completed: false },
  ],
  addTodo(todo) {
    this.todos.push(todo);
  },
  toggleTodo(id) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) todo.completed = !todo.completed;
  },
});
```

使用仓库

```js title="Component.vue"
import { store } from "./store";
store.addTodo({ id: 4, text: "学习Svelte", completed: false });
```

::: info 与 Pinia 的对比与建议

- 简易仓库适用于小型应用或临时状态共享
- Pinia 提供模块化、持久化、中间件、类型支持与 DevTools 集成，更适合中大型项目
- 服务端渲染需考虑单例与请求隔离；状态库需支持 SSR 的状态注水与脱水

:::

## 选择指引与常见陷阱

- 父子通信优先 Props + Emits；避免在子组件直接修改 `props`
- 跨层级优先 provide/inject 或状态库；事件总线用于松耦合事件通知
- 避免直接解构 `props` 导致失去响应性；使用 `toRefs/toRef`
- 作用域插槽关注插槽内容的渲染上下文与性能；避免过度嵌套
- 使用 `ref` 暴露最小必要 API，减少组件间耦合

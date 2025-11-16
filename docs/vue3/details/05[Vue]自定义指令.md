# 【Vue】自定义指令 ✨

[[TOC]]

::: tip 要点速览

- 定义：针对普通元素的底层 DOM 行为进行复用与封装。
- 注册：局部（`<script setup>` 中以 `vXxx` 变量命名）、选项式（`directives`）、全局（`app.directive`）。
- 钩子：`created/beforeMount/mounted/beforeUpdate/updated/beforeUnmount/unmounted` 控制指令生命周期。
- 简写：`app.directive(name, fn)` 等价于在 `mounted/updated` 时调用。
- 参数：`el`、`binding({ value, oldValue, arg, modifiers, instance, dir })`、`vnode/prevVnode`。
- 清理：在 `unmounted` 进行副作用清理（计时器、事件、资源）。
  :::

## 动机与问题

Vue 内置指令：

- v-if
- v-for
- v-show
- v-html
- v-model
- v-on
- v-bind
- ….

自定义指令的本质也是一种复用。常见复用方式：

- **组件**: 对结构、样式、逻辑的一种复用
- **组合式函数**：侧重于对**有状态的逻辑**进行复用
- **自定义指令**：重用涉及普通元素的\*底层 DOM 访问的逻辑\*\*

## 快速上手

```vue :title="App.vue" :collapsed-lines
<template>
  <input type="text" v-focus />
</template>

<script setup>
// 这里是局部注册自定义指令，只在 App.vue里面生效
const vFocus = {
  // 键值对
  // 键：生命周期钩子
  // 值：函数（参数el为挂载的DOM元素）
  mounted: (el) => {
    // 这个是 DOM 原生方法，用来让元素获取焦点
    el.focus();
  },
};
</script>

<style scoped></style>
```

## 相关细节

### 1) 组件写法与局部注册

1. `<script setup>`：任何以 `v` 开头的驼峰式变量都可作为指令。
2. 选项式 API：在 `directives` 中注册。

   ```vue
   <script>
   export default {
     directives: {
       focus: { mounted: (el) => el.focus() },
     },
   };
   </script>

   <template>
     <input v-focus />
   </template>
   ```

### 2) 全局注册

在 app 应用实例上面通过 directive 来进行全局注册。

```jsx :title="main.js" :collapsed-lines
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

// 创建一个全局的自定义指令 v-focus
// 全局注册的自定义指令可以在所有组件里面使用
app.directive("focus", {
  mounted(el) {
    el.focus();
  },
});

app.mount("#app");
```

简化写法：

```jsx
// 注意第二个参数，不再是对象而是函数
app.directive("color", (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  el.style.color = binding.value;
});
```

第二个参数是一个函数而非对象，之前对象可以指定具体哪个生命周期，而**函数对应的就固定是 `mounted` 和 `updated` 生命周期**。

### 3) 指令钩子与参数

对象内是和生命周期钩子相关的键值对，可以选择其他生命周期钩子函数：

```jsx
const myDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode) {},
  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vnode) {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode) {},
};
```

指令的钩子函数，会有这么一些参数：

1. `el`：绑定到的元素。
2. `binding`：包含值、参数与修饰符的对象：

   - value：传递给指令的值。例如在 `v-my-directive=“1 + 1”` 中，值是 2。
   - oldValue：之前的值，仅在 `beforeUpdate` 和 `updated` 中可用。无论值是否更改，它都可用。
   - arg：传递给指令的**参数** (如果有的话)。例如在 `v-my-directive:foo` 中，参数是 “foo”。
   - modifiers：一个包含**修饰符的对象**。例如在 `v-my-directive.foo.bar` 中，修饰符对象是 `{ foo: true, bar: true }`。
   - instance：使用该指令的**组件实例**。
   - dir：指令的定义对象。

   例如：

   ```html
   <div v-example:foo.bar="baz"></div>
   ```

   binding 参数如下：

   ```jsx
   {
     arg: 'foo',
     modifiers: { bar: true },
     value: /* baz 的值 */,
     oldValue: /* 上一次更新时 baz 的值 */
   }
   ```

   通过 `binding` 获取到用户在使用指令时的详细信息，以此进行差异化处理。

   再来看一个内置指令示例：

   ```html
   <div v-bind:id="id"></div>
   ```

   binding 参数如下：

   ```jsx
   {
     arg: 'id',
     value: /* id 的值 */,
     oldValue: /* 上一次更新时 id 的值 */
   }
   ```

3. `vnode`：绑定元素的 VNode。
4. `prevVnode`：上一次渲染的 VNode，仅在 `beforeUpdate/updated` 可用。

### 4) 传递多个值

正常情况下，会给指令传递一个值，例如：

```html
<div v-bind:id="id"></div>
```

这里给指令传递的值就是 id.

但是有些时候的需求是传递多个值，这个时候可以使用**对象字面量**，例如：

```html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

这里就通过对象的方式传递了多个值：

```jsx
app.directive("demo", (el, binding) => {
  // binding.value
  console.log(binding.value.color); // => "white"
  console.log(binding.value.text); // => "hello!"
});
```

## 实战案例

### 1) `v-permission`：基于权限的元素显示控制

```js :title="main.js" :collapsed-lines
import { createApp } from "vue";
import App from "./App.vue";
// 模拟用户权限
const userPermission = ["read", "admin"];
const app = createApp(App);

app.directive("permission", (el, binding) => {
  const { value } = binding;
  if (value && value instanceof Array) {
    const hasPermission = value.some((item) => userPermission.includes(item));
    if (!hasPermission) {
      el.style.display = "none";
    }
  } else {
    throw new Error("请传入一个权限数组");
  }
});
app.mount("#app");
```

```vue :title="App.vue" :collapsed-lines
<template>
  <div>
    <button v-permission="['read']">读取按钮</button>
    <button v-permission="['write']">写入按钮</button>
    <button v-permission="['admin']">管理权限</button>
  </div>
</template>
```

### 2) `v-time`：相对时间显示

```js :title="main.js" :collapsed-lines
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);
// 辅助方法
const time = {
  // 获取当前事件戳
  getUnix() {
    const date = new Date();
    return date.getTime();
  },
  // 获取今天0时0分0秒的时间戳
  getTodayUnix() {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.getTime();
  },
  // 获取今年1月1日0点0时0秒的时间戳
  getYearUnix: function () {
    const date = new Date();
    date.setMonth(0);
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.getTime();
  },
  // 获取标准年月日
  getLastDate(time) {
    const date = new Date(time);
    const month =
      date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth();
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return date.getFullYear() + "-" + month + "-" + day;
  },
  // 转换时间
  getFormatTime(timestamp) {
    // 根据时间戳来决定返回的提示信息
    const now = this.getUnix();
    const today = this.getTodayUnix();
    const timer = (now - timestamp) / 1000;
    let tips = "";
    if (timer <= 0) {
      tips = "刚刚";
    } else if (Math.floor(timer / 60) <= 0) {
      tips = "刚刚";
    } else if (timer < 3600) {
      tips = Math.floor(timer / 60) + "分钟前";
    } else if (timer >= 3600 && timestamp - today >= 0) {
      tips = Math.floor(timer / 3600) + "小时前";
    } else if (timer / 86400 <= 31) {
      tips = Math.ceil(timer / 86400) + "天前";
    } else {
      tips = this.getLastDate(timestamp);
    }
    return tips;
  },
};

// 自定义指令
app.directive("time", {
  mounted(el, binding) {
    // 拿到时间戳
    const { value } = binding;
    // 转换事件戳
    el.innerHTML = time.getFormatTime(value);
    // 监听时间戳的变化
    el.timeout = setInterval(() => {
      el.innerHTML = time.getFormatTime(value);
    }, 6000);
  },

  unmounted(el) {
    clearInterval(el.timeout);
    delete el.timeout;
  },
});

app.mount("#app");
```

```vue :title="App.vue" :collapsed-lines
<template>
  <div>
    <div v-time="timeNow"></div>
    <div v-time="timeBefore"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const timeNow = ref(new Date().getTime());

const timeBefore = ref(1488930695721);
</script>
```

## 常见误区与实践建议

- 未在 `unmounted` 清理副作用（计时器、事件）导致内存泄漏。
- 将组件级逻辑放入指令，造成职责不清；指令适合“元素级行为”，组件/组合式函数负责“状态与业务逻辑”。
- 忽略 `binding.arg/modifiers` 导致指令可配置性差；善用参数与修饰符提升复用性。
- 在指令中直接修改响应式状态，引入隐式耦合；建议仅操作元素与其属性，状态改动放在组件逻辑中。

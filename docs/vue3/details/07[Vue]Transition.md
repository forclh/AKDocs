# 【Vue】Transition 👌

[[TOC]]

::: tip 要点速览

- 作用：在元素或组件的“进入/离开”阶段自动挂载/移除过渡类，便于实现动画。
- 样式类：共 6 个，进入 `v-enter-from/v-enter-to/v-enter-active`，离开 `v-leave-from/v-leave-to/v-leave-active`。
- 命名：`<Transition name="fade">` 使用自定义前缀；也可用 `*-from/active/to` 属性传入自定义类名。
- 属性：`appear` 首次渲染应用过渡；`mode` 控制先后顺序（`in-out/out-in`）。
- key：纯文本更新需配合 `:key` 才能触发过渡。
- JS 钩子：支持 `before-enter/enter/after-enter/...`，异步动画需调用 `done` 结束。

:::

## 动机与定义

`Transition` 是 Vue 提供的内置组件，用于在元素/组件**进入**与**离开** DOM 时应用动画。它通过在恰当时机自动添加/移除一组约定的 CSS 类，使模板保持简洁、行为更可控。

在 Web 应用中，元素的显隐与切换非常常见；不使用 `Transition` 也能实现，但管理类名与时序会更繁琐。

## 快速上手

不使用 Transition：

```vue :collapsed-lines
<template>
  <div>
    <button @click="show = !show">切换</button>
    <div :class="['fade', { active: show, leave: !show }]">
      <h1>动画</h1>
      <p>淡入淡出</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const show = ref(true);
</script>

<style scoped>
.fade {
  transition: 1s;
}

.active {
  opacity: 1;
}

.leave {
  opacity: 0;
}
</style>
```

使用 Transition：

```vue :collapsed-lines
<template>
  <div>
    <button @click="show = !show">切换</button>
    <Transition>
      <div v-if="show">
        <h1>动画</h1>
        <p>淡入淡出</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
const show = ref(true);
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 1s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-to,
.v-leave-from {
  opacity: 1;
}
</style>
```

## 样式类机制

通过“自动添加/移除类”驱动过渡，你需要自己编写这些类的样式。共 6 个：

![](https://bu.dusays.com/2025/11/16/691969c97dd5c.png)

**进入阶段**

- `v-enter-from`
- `v-enter-to`
- `v-enter-active`

**离开阶段**

- `v-leave-from`
- `v-leave-to`
- `v-leave-active`

以进入为例：在元素**插入前**自动添加
`v-enter-from/v-enter-active`：

```html
<div v-if="show" class="v-enter-from v-enter-active">
  <h1>动画</h1>
  <p>淡入淡出</p>
</div>
```

在**插入完成后**移除 `v-enter-from`，并添加 `v-enter-to`：

```html
<div v-if="show" class="v-enter-to v-enter-active">
  <h1>动画</h1>
  <p>淡入淡出</p>
</div>
```

整个进入阶段 `v-enter-active` 始终存在：插入前为 `v-enter-from`，插入后为 `v-enter-to`。

对应样式示例：

- `v-enter-from`: `opacity: 0`
- `v-enter-to`: `opacity: 1`
- `v-enter-active`: `transition: opacity 3s`

当过渡结束后，这 3 个辅助类会被一并移除。

## 命名与自定义类

传递 `name` 使用自定义前缀：

```html
<Transition name="fade"> ... </Transition>
```

使用的类名：

- `fade-enter-from`
- `fade-enter-to`
- `fade-enter-active`

也可通过以下 props 指定自定义类名：

- `enter-from-class`
- `enter-active-class`
- `enter-to-class`
- `leave-from-class`
- `leave-active-class`
- `leave-to-class`

## 搭配 animation

也可以搭配 CSS 的 animation 来使用，这个时候只需要简单的在 `*-enter/leave-active`
样式类下使用动画即可。

```vue :collapsed-lines
<template>
  <div>
    <button @click="show = !show">切换</button>
    <Transition name="bounce" appear>
      <div v-if="show" class="box">
        <h1>动画</h1>
        <p>弹跳</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
const show = ref(true);
</script>

<style scoped>
.box {
  width: 200px;
  background-color: #008c8c;
  transform-origin: center;
  will-change: transform, opacity;
}

.bounce-enter-active {
  animation: bounce-in 400ms cubic-bezier(0.22, 0.61, 0.36, 1);
}

.bounce-leave-active {
  animation: bounce-in 400ms cubic-bezier(0.22, 0.61, 0.36, 1) reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  60% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
```

## 组件常用属性

- `appear`：在初始渲染时应用过渡
- `mode`：指定过渡模式
  - `in-out`：新元素先进入，旧元素等待新元素完成后再离开
  - `out-in`：旧元素先离开，离开完成后新元素进入

## 使用 key 触发文本过渡

有些时候会存在这么一种情况，就是不存在元素的进入和离开，仅仅是**文本节点的更新**，此时就不会发生过渡。
要解决这种情况也很简单，添加上 key 即可。

```vue :collapsed-lines
<template>
  <div>
    <button @click="show = !show">切换</button>
    <Transition name="fade" mode="out-in">
      <p :key="message">{{ message }}</p>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
const show = ref(true);
const message = computed(() => {
  return show.value ? "Hello" : "World";
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 400ms;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
```

## 实战案例：图片切换

```vue :collapsed-lines
<template>
  <div class="container">
    <div class="btns">
      <button @click="prev">上一张</button>
      <button @click="next">下一张</button>
    </div>
    <!-- 根据不同的方向，name不同对应的class不同 -->
    <Transition :name="`${direction}-image`">
      <img class="image" :src="curImage" :key="curIndex" />
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const curIndex = ref(0)

const images = [...]
const curImage = computed(() => images[curIndex.value])

const direction = ref('next')
function prev() {
  direction.value = 'prev'
  curIndex.value--
  if (curIndex.value < 0) {
    curIndex.value = images.length - 1
  }
}

function next() {
  direction.value = 'next'
  curIndex.value++
  if (curIndex.value > images.length - 1) {
    curIndex.value = 0
  }
}
</script>

<style scoped>
.container {
  text-align: center;
}

.btns button {
  margin: 1em 0.5em;
}

.image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  margin-left: -100px;
  top: 100px;
}

/* active阶段 */
.next-image-enter-active,
.next-image-leave-active,
.prev-image-enter-active,
.prev-image-leave-active {
  transition: all 0.5s;
}

.next-image-enter-from,
.next-image-leave-to,
.prev-image-enter-from,
.prev-image-leave-to {
  opacity: 0;
}

.next-image-enter-from,
.prev-image-leave-to {
  transform: translateX(200px);
}

.next-image-leave-to,
.prev-image-enter-from {
  transform: translateX(-200px);
}
</style>
```

## JS 钩子

除了通过 CSS 来实现动画，也可以使用 JS 钩子：

```vue :collapsed-lines
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
 <!-- ... -->
</Transition>

<script setup>
const onEnter = (el, done) => {
  // ...
};
</script>
```

done 方法的作用如下：

- 通知 Vue 过渡完成：在执行完自定义的进入或离开动画后调用 `done`，允许 Vue 继续处理 DOM 更新。
- 处理异步操作：过渡期间若有异步任务（如数据加载、网络请求），在任务完成后调用 `done` 结束过渡。

示例：

```vue :collapsed-lines
<template>
  <div class="container">
    <div class="btns">
      <button @click="show = !show">切换</button>
    </div>
    <!-- 之前是在特定的时间挂对应的 CSS 样式类 -->
    <!-- 现在是在特定的时间触发事件处理函数 -->
    <Transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <p v-if="show" class="box">Hello World</p>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
const show = ref(true);

function beforeEnter(el) {
  // 在元素进入之前，设置初始样式
  el.style.opacity = 0;
  el.style.transform = "translateY(-20px)";
}

function enter(el, done) {
  // 这里设置 setTimeout 是为了让浏览器有时间应用初始样式
  // 将这个函数推到下一个事件循环中执行
  // 避免初始样式和目标样式在同一帧中执行
  setTimeout(() => {
    el.style.transition = "all 1s";
    el.style.opacity = 1;
    el.style.transform = "translateY(0)";
    done();
  }, 0);
}

function leave(el, done) {
  // 因为元素已经在文档中了，直接设置样式即可
  el.style.transition = "all 1s";
  el.style.opacity = 0;
  el.style.transform = "translateY(-20px)";
  // 这里的 setTimeout 是为了让动画执行完毕后再调用 done
  // 保证和过渡时间一致
  setTimeout(() => {
    done();
  }, 1000);
}
</script>

<style scoped>
.container {
  text-align: center;
}
.btns button {
  margin: 1em 0.5em;
}
.box {
  width: 200px;
  height: 50px;
  background-color: #42b983;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px auto;
}
</style>
```

相比纯 CSS，JS 钩子更灵活：

- 精确控制过渡效果
- 处理异步操作
- 动态计算与条件逻辑
- 与第三方库集成（如 GSAP）

## 常见误区与实践建议

- 忽视 `mode` 导致新旧元素同时存在而样式冲突；根据场景选择 `out-in` 或 `in-out`。
- 未使用 `:key` 导致纯文本更新不触发过渡；为文本/同标签节点提供稳定 `key`。
- 仅设置 `*-active` 而无 `*-from/to`，动画不生效或闪烁；保证三个类配合使用。
- JS 钩子未调用 `done` 导致过渡挂起；异步动画必须在合适时机调用 `done`。
- 动画过重阻塞渲染；对大列表使用 `transition-group` 并谨慎动画范围。

## 调试技巧

- 在开发者工具中检查节点类名随时间变更，确认 `from/active/to` 时序。
- 临时将过渡时间调为极短/极长，以观察进入与离开阶段的边界与类切换。
- 在 JS 钩子中打印触发顺序与调用时机，定位卡顿或未结束的过渡。

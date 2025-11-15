# ✨ keep-alive 生命周期 👌

[[TOC]]

::: tip 要点速览

- 功能：**缓存组件实例，避免频繁销毁/重建**，保留内部状态与数据。
- 核心钩子：`onActivated`（激活）与 `onDeactivated`（失活）；不再重复触发 `mounted/unmounted`。
- 缓存控制：`include/exclude/max` 精准控制缓存范围与数量（超额触发最近最少使用淘汰）。
- 适用场景：Tab/切换视图、复杂表单向导、路由组件缓存（与 `router-view` 配合）。
- 注意：失活期间无真实 DOM，避免访问；在激活时刷新数据或恢复副作用。
  :::

## 概念与类比

keep-alive 借鉴了 HTTP 的“持久连接”思想：避免重复销毁与重建，提升性能。在 Vue 中它用于对组件进行缓存，从而复用组件实例与其内部状态。

## 基本使用

未缓存的切换会频繁创建/销毁组件：

```vue :collapsed-lines
<template>
  <Tab v-if="currentTab === 1" />
  <Tab v-if="currentTab === 2" />
  <Tab v-if="currentTab === 3" />
  <!-- 切换时会卸载旧 Tab 并重建新 Tab -->
  <!-- 导致 mounted/unmounted 反复触发，状态重置 -->
  <!-- 性能在大组件场景下尤为明显 -->
</template>
```

加入缓存后，切换不再销毁组件实例：

```vue :collapsed-lines
<template>
  <keep-alive>
    <Tab v-if="currentTab === 1" />
    <Tab v-if="currentTab === 2" />
    <Tab v-if="currentTab === 3" />
  </keep-alive>
</template>
```

## 缓存控制与匹配规则

- `include`：指定需要缓存的组件。支持字符串、正则、数组；依据组件的 `name` 选项匹配。
- `exclude`：排除不缓存的组件。
- `max`：最大缓存数量；超出时淘汰最久未使用的实例（LRU）。

示例：

```vue :collapsed-lines
<template>
  <keep-alive :include="['UserList', 'UserDetail']" :max="5">
    <component :is="currentView" />
  </keep-alive>
</template>
```

建议：为可缓存的组件显式设置 `name`，确保匹配稳定；需要多份独立缓存时使用不同的 `key`。

## 生命周期与时序

::: info 时序详解（未缓存 vs 缓存）

- 未使用 keep-alive：切换组件 A → B 的一次完整时序

  - A `beforeUnmount`（准备卸载，仍可访问实例）
  - B `created`（创建阶段，状态就绪但未挂载）
  - B `beforeMount`（首次渲染前）
  - A `unmounted`（A 的 DOM 与渲染副作用已清理）
  - B `mounted`（B 首次插入 DOM，可安全访问真实节点）

- 使用 keep-alive：切换与缓存的行为差异

  - 首次进入某视图：与未缓存一致，正常触发该视图的 `mounted`。
  - 之后在已缓存视图之间切换：
    - 离开当前视图 A：触发 `onDeactivated`（A 被移出 DOM，但实例与状态保留）
    - 进入目标视图 B：触发 `onActivated`（B 被插入 DOM，恢复渲染与副作用）
  - 由于实例未销毁，`mounted/unmounted` 不会重复触发；只有当缓存被淘汰或显式清理时才会重新触发卸载/挂载。

- 何时会重新触发 `mounted/unmounted`
  - 超过 `max` 触发 LRU 淘汰，被淘汰的实例将执行 `unmounted`；再次进入时会重新 `mounted`。
  - 通过条件渲染移除缓存容器或修改 `include/exclude` 使实例不再命中缓存。

:::

典型场景代码：

```vue :collapsed-lines
<script setup>
import { onActivated, onDeactivated } from "vue";
let timer = null;
onActivated(() => {
  // 恢复副作用（例如重启轮询/订阅）
  timer = setInterval(() => {
    /* ... */
  }, 2000);
});
onDeactivated(() => {
  // 暂停副作用（组件失活期间不在 DOM 中）
  clearInterval(timer);
  timer = null;
});
</script>
```

## 常见误区与建议

- 误区：期望每次进入都执行 `mounted`。建议：使用 `onActivated` 作为进入点，`onDeactivated` 作为离开点。
- 误区：失活期间访问真实 DOM。建议：在激活时再访问/更新 DOM；失活期间组件不在文档流中。
- 误区：未为组件设置 `name` 导致 `include/exclude` 无效。建议：显式设置 `name` 并与匹配值一致。
- 误区：缓存过多导致内存占用。建议：合理设置 `max`，并在离开页面时清理不再需要的缓存。
- 建议：对订阅、计时器、第三方实例在 `onActivated/onDeactivated` 做暂停与恢复，避免后台空转。

## 与路由的结合

常见做法是基于路由 `meta.keepAlive` 与组件 `name` 控制缓存；并通过 `key` 决定是否区分参数/查询的不同实例。

方式一：按 meta 决定是否缓存

```vue :collapsed-lines
<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive>
      <component
        v-if="route.meta.keepAlive"
        :is="Component"
        :key="route.name"
      />
    </keep-alive>
    <component v-else :is="Component" :key="route.name" />
  </router-view>
  <!-- route.name 复用同名组件的缓存；若需区分不同参数，改为 route.fullPath -->
</template>
```

方式二：使用 include/exclude 精确匹配组件名

```vue :collapsed-lines
<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="cachedNames" :max="5">
      <component :is="Component" :key="route.name" />
    </keep-alive>
  </router-view>
</template>

<script setup>
import { ref } from "vue";
// 与路由配置中的组件 name 保持一致
const cachedNames = ref(["UserList", "UserDetail"]);
</script>
```

实践要点：

- 为路由组件显式设置 `name`，以便与 `include/exclude` 匹配。
- `:key="route.name"` 复用同名缓存；`:key="route.fullPath"` 为不同参数创建独立缓存。
- 使用 `max` 控制缓存规模；超额将执行 LRU 淘汰并触发 `unmounted`。
- 仅在需要保留复杂状态的视图使用缓存；避免对轻量页面滥用缓存导致内存占用。

注意：确保路由组件具备稳定的 `name`；若需要区分同名组件的不同实例，使用不同的 `key`（如基于路由参数）。

## 示例

```vue :collapsed-lines
<template>
  <div>
    <button @click="currentTab = 1">Tab1</button>
    <button @click="currentTab = 2">Tab2</button>
    <button @click="currentTab = 3">Tab3</button>
    <keep-alive :include="['TabOne', 'TabTwo']" :max="2">
      <component :is="viewComp" />
    </keep-alive>
  </div>
</template>

<script setup>
import { computed, ref, defineComponent, h } from "vue";
const TabOne = defineComponent({
  name: "TabOne",
  setup() {
    const count = ref(0);
    const add = () => {
      count.value++;
    };
    return () =>
      h("div", null, [
        h("h3", null, "Tab 1"),
        h("button", { onClick: add }, `Count: ${count.value}`),
      ]);
  },
});
const TabTwo = defineComponent({
  name: "TabTwo",
  setup() {
    const count = ref(0);
    const add = () => {
      count.value++;
    };
    return () =>
      h("div", null, [
        h("h3", null, "Tab 2"),
        h("button", { onClick: add }, `Count: ${count.value}`),
      ]);
  },
});
const TabThree = defineComponent({
  name: "TabThree",
  setup() {
    const count = ref(0);
    const add = () => {
      count.value++;
    };
    return () =>
      h("div", null, [
        h("h3", null, "Tab 3"),
        h("button", { onClick: add }, `Count: ${count.value}`),
      ]);
  },
});
const currentTab = ref(1);
const viewComp = computed(() =>
  currentTab.value === 1 ? TabOne : currentTab.value === 2 ? TabTwo : TabThree
);
</script>
```

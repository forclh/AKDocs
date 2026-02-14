# 【Vue】Teleport

[[TOC]]

::: tip 要点速览

- 作用：将组件内的一段子树渲染到指定的目标节点（组件外层）。
- 属性：`to` 指定目标（选择器或元素）；`disabled` 关闭传送保持原位。
- 关系不变：只改变渲染位置，组件层级与响应性、事件绑定不变。
- 场景：模态框、通知、全局浮层，避免祖先的 `transform/z-index` 影响定位。
- 建议：目标容器使用 `body` 或专用 `#portal-root`，确保层叠上下文稳定。

:::

## 动机与定义

理想情况下，模态框的按钮与内容在同一组件中管理状态，但这会让模态框被渲染在应用 DOM 的深层，受祖先样式影响。`Teleport` 允许将这段模板“传送”到组件外层的指定位置，同时保持组件关系与响应性不变。

## 快速上手

不使用 Teleport：

```vue :collapsed-lines
<template>
  <button @click="open = true">打开模态框</button>
  <div v-if="open" class="modal">
    <p>模态框内容</p>
    <button @click="open = false">关闭</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
const open = ref(false);
</script>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  border: 1px solid #ccc;
  text-align: center;
}
.modal p {
  padding: 10px;
  margin: 0;
  background: #f4f4f4;
  text-align: center;
}
</style>
```

渲染结构示例：

```html :collapsed-lines
<div id="app" data-v-app="">
  <div class="outer">
    <h1>Teleport示例</h1>
    <div>
      <button>打开模态框</button>
      <div class="modal">
        <p>模态框内容</p>
        <button>关闭</button>
      </div>
    </div>
  </div>
  <!-- 模态框仍在组件内部 -->
</div>
```

问题：

- 若祖先设置了 `transform/perspective/filter`，`position: fixed` 的定位参考会改变，导致布局异常。
- 模态框的 `z-index` 受限于所在层叠上下文，易被更高层覆盖。

正确做法（使用 Teleport）：

```vue
<Teleport to="body">
  <div v-if="open" class="modal">
    <p>模态框内容</p>
    <button @click="open = false">关闭</button>
  </div>
 </Teleport>
```

`to` 指定目标节点，可以是选择器或真实元素。

## 相关细节

- `to`：接收选择器字符串或 DOM 元素；目标需存在于客户端。
- `disabled`：为 `true` 时不传送，内容保留在原组件位置。
- 渲染关系：传送不改变父子组件关系与响应性；事件依旧按组件逻辑触发。
- 目标选择：常用 `body` 或自建根节点（如 `#portal-root`），避免受业务容器影响。

## **实战案例**

用户管理模块中，有一个全局的“用户详情”对话框，该对话框可以在页面的任何地方被触发显示。为了使该对话框在 DOM 结构上位于应用的根元素下，并且避免它受到父组件的 CSS 样式影响，可以使用 Teleport 组件将该对话框传送到指定的 DOM 节点。

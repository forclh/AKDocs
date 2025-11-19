# 【Router】路由过渡特效 👌

[[TOC]]

::: tip 要点速览

- 使用 `Transition` 包裹 `router-view` 的渲染组件以实现页面切换动画
- 通过 `name` 指定 CSS 过渡前缀，`mode` 控制进出时序（`out-in`/`in-out`）
- 利用 `v-slot="{ Component, route }"` 读取当前路由与元信息，动态应用过渡
- 设置 `:key` 强制重新渲染以触发过渡，建议使用 `route.fullPath`
- 可在全局后置守卫中为不同页面写入 `to.meta.transition` 实现差异化过渡
- CSS 建议采用 `opacity/transform` 结合硬件加速，避免布局抖动
- `style scoped` 场景需用 `:deep(.class)` 作用到子组件根元素
  :::

## 概念与本质

路由过渡是通过 `Transition` 组件在页面切换时为即将进入与离开的组件添加一组钩子类名，从而让 CSS 动画在正确的时机生效。核心是用插槽拿到当前要渲染的组件并包裹它：

```vue
<template>
  <router-view v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </router-view>
</template>
```

## 动态过渡（基于路由）

通过 `route.meta.transition` 统一管理不同页面的过渡名：

```vue
<template>
  <router-view v-slot="{ Component, route }">
    <Transition :name="route.meta.transition || 'fade'" mode="out-in">
      <component :is="Component" />
    </Transition>
  </router-view>
</template>
```

在全局后置守卫中按路径写入：

```js
router.afterEach((to) => {
  switch (to.path) {
    case "/panel-left":
      to.meta.transition = "slide-left";
      break;
    case "/panel-right":
      to.meta.transition = "slide-right";
      break;
    default:
      to.meta.transition = "fade";
  }
});
```

对应样式：

```css :collapsed-lines
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.25s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(16px);
}
.slide-left-enter-to,
.slide-left-leave-from {
  transform: translateX(0);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.25s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(-16px);
}
.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
}
```

## 强制过渡（Key）

当路由组件被“复用”时可能不会触发预期过渡，需添加 `key` 强制重新渲染。为了包含 `query/hash` 的变化，推荐：

```vue
<template>
  <router-view v-slot="{ Component, route }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" :key="route.fullPath" />
    </Transition>
  </router-view>
</template>
```

## 实际开发注意事项

- 动画属性选择：优先 `transform/opacity`，避免触发布局/重绘；设置 `will-change: transform, opacity`
- 时序控制：页面栈切换常用 `out-in`，避免新旧页面叠加导致闪烁
- Scoped 样式：父组件定义的过渡类需用 `:deep(.fade-enter-active)` 作用到子组件根元素
- 可访问性：在 `@media (prefers-reduced-motion: reduce)` 下降低或禁用动画
- 初次渲染：需要首屏过渡时使用 `appear` 属性

示例（Scoped 与首屏过渡）：

```vue
<template>
  <router-view v-slot="{ Component, route }">
    <Transition name="fade" mode="out-in" appear>
      <component :is="Component" :key="route.fullPath" />
    </Transition>
  </router-view>
</template>
```

```css :collapsed-lines
:deep(.fade-enter-active),
:deep(.fade-leave-active) {
  transition: opacity 0.2s ease;
}
:deep(.fade-enter-from),
:deep(.fade-leave-to) {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  :deep(.fade-enter-active),
  :deep(.fade-leave-active) {
    transition: none;
  }
}
```

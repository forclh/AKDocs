# 【Router】路由滚动行为 👌

[[TOC]]

::: tip 要点速览

- 在创建路由时通过 `scrollBehavior(to, from, savedPosition)` 自定义页面滚动
- 仅在支持 `history.pushState` 的浏览器可用
- `savedPosition` 仅在浏览器前进/后退（`popstate`）时提供
- `scrollBehavior` 返回值可为 `{ left, top, behavior }` 或 `{ el, top, left, behavior }`
- 处理锚点跳转：`to.hash` 可配合 `{ el: to.hash }` 精确滚动
- 可返回 Promise 以延迟滚动，适配过渡/懒加载
  :::

## 概念与签名

在路由实例上声明滚动策略：

```js
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});
```

- `to`：目标路由对象，含 `path/fullPath/hash/query/meta` 等
- `from`：来源路由对象
- `savedPosition`：仅在 popstate 导航提供，形如 `{ left, top }`

## 常用场景

### 统一滚顶与平滑

```js
scrollBehavior() {
  return { top: 0, behavior: 'smooth' }
}
```

### 历史返回恢复位置

```js
scrollBehavior(to, from, savedPosition) {
  if (savedPosition) return { ...savedPosition, behavior: 'smooth' }
  return { top: 0 }
}
```

### 锚点滚动与偏移

```js
scrollBehavior(to) {
  if (to.hash) return { el: to.hash }
  return { top: 0 }
}
```

指定元素并设置相对偏移：

```js
scrollBehavior() {
  return { el: '#main', top: 10 }
}
```

### 延迟滚动（适配过渡/懒加载）

```js
scrollBehavior(to, from, savedPosition) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(savedPosition ?? { top: 0 })
    }, 300)
  })
}
```

## 返回值与行为

- 位置描述符：`{ left, top, behavior }`
- 元素描述符：`{ el, top, left, behavior }`，`el` 可为选择器或 DOM 元素
- 平滑滚动：设置 `behavior: 'smooth'`，或在 CSS 中全局配置 `html { scroll-behavior: smooth }`

## 实际开发注意事项

- `savedPosition` 不在编程式前进导航中提供，仅限浏览器前进/后退
- 锚点导航需显式处理 `to.hash`，否则默认策略可能不滚动
- 大量内容懒加载时应延迟滚动或在资源就绪后触发
- 与过渡配合时建议延迟至过渡结束，避免位置抖动
- 移动端滚动惯性与软键盘影响需实际验证并调整偏移

## 示例合集

统一策略：

```js
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return { ...savedPosition, behavior: "smooth" };
    if (to.hash) return { el: to.hash, behavior: "smooth" };
    return { top: 0 };
  },
});
```

延迟与元素偏移：

```js
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(to.hash ? { el: to.hash, top: 8 } : { top: 0 });
      }, 250);
    });
  },
});
```

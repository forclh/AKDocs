# 【Router】滚动行为

在 Vue-router 可以自定义路由切换时页面如何滚动。

> 注意：这个功能只在支持 history.pushState 的浏览器中可用。

当创建一个 Router 实例，可以提供一个 scrollBehavior 方法：

```jsx
const router = createRouter({
  history: createWebHashHistory(),
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
		// 始终滚动到顶部
    return { top: 0 }
  }
})
```

第三个参数 savedPosition，只有当这是一个 popstate 导航时才可用（**由浏览器的 后退/前进 按钮触发**）。

## **快速入门**

核心代码如下：

```jsx
const router = createRouter({
    history: createWebHistory(),
    routes,
    // 设置滚动行为
    scrollBehavior(to, from, savedPosition) {
        console.log("savedPosition:", savedPosition);
        if (savedPosition) {
            return { ...savedPosition, behavior: "smooth" };
        } else {
            return { top: 0, behavior: "smooth" };
        }
    },
});
```

savedPosition 是一个类似于 `{ left: XXX, top: XXX }` 这样的对象，如果存在就滚动到对应位置，否则滚动到 top 为 0 的位置。

## **相关细节**

### **1. 滚动到指定元素**

以通过 el 传递一个 CSS 选择器或一个 DOM 元素。在这种情况下，top 和 left 将被视为该元素的相对偏移量。

```jsx
const router = createRouter({
    scrollBehavior(to, from, savedPosition) {
        // 始终在元素 #main 上方滚动 10px
        return {
            // 也可以这么写
            // el: document.getElementById('main'),
            el: "#main",
            // 在元素上 10 像素
            top: 10,
        };
    },
});
```

### **2. 延迟滚动**

有时候，我们需要在页面中滚动之前稍作等待。例如，当处理过渡时，我们希望等待过渡结束后再滚动。要做到这一点，你可以返回一个 Promise，它可以返回所需的位置描述符。

下面是一个例子，我们在滚动前等待 500ms：

```jsx
const router = createRouter({
    scrollBehavior(to, from, savedPosition) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ left: 0, top: 0 });
            }, 500);
        });
    },
});
```

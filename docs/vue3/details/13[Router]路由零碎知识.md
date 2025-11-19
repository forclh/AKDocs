# 【Router】路由零碎知识 ✨

[[TOC]]

::: tip 要点速览

- 别名：为同一路由提供额外访问路径，URL 不变；与重定向不同。
- 命名视图：**一个路由渲染多个视图**；使用 `components` 与多 `router-view`（含 `name`）。
- 重定向：支持字符串/对象/函数，改变 URL 并重新匹配目标路由。
- 元数据：在 `meta` 携带权限/标题等信息；在守卫中访问，在 `afterEach` 设置标题。
- 懒加载：路由级动态导入做代码分割；无需 `defineAsyncComponent`。

:::

## 别名（alias）

通过 `alias` 为同一路由提供额外访问路径，访问别名时 URL 保持为别名，不发生跳转。

假设你有一个路由 `/user/:id/profile` 显示用户的个人资料，你希望能够通过 `/profile/:id` 也能访问到同样的组件，那么此时就可以通过别名的方式来进行配置，例如：

```js :collapsed-lines
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/user/:id/profile",
      name: "user-profile",
      component: UserProfile,
      alias: "/profile/:id", // 配置路由别名
    },
  ],
});
```

别名的好处：

- **提供不同的访问路径**：为同一个路由提供了多种访问方式，更加灵活
- **兼容旧路径**：有些时候需要更新路径，使用别名可以保证旧的路由依然有效
- **简化路径**：特别是嵌套路由的情况下，路径可能会很长，别名可以简化路径

区别与注意：

- 与重定向不同：**别名不改变地址栏；重定向会更新 URL 并重新匹配**。
- 可使用多个别名（数组）；避免与其它路由冲突。

## 命名视图（Named Views）

`router-view` 是视图（路由出口）。一个路由可以同时渲染多个组件到不同命名视图。

有些时候会存在这样的需求，那就是**一个路由对应多个组件**，而非一个组件。**不同的组件渲染到不同的视图里面**，此时需要给视图设置不同的 name 来加以区分。

例如：

```js :collapsed-lines
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      // 注意这里是 components，多了一个's'
      components: {
        default: Home,
        // LeftSidebar: LeftSidebar 的缩写
        LeftSidebar,
        // 它们与 <router-view> 上的 name 属性匹配
        RightSidebar,
      },
    },
  ],
});
```

在上面的 `components` 配置中，对应多个视图：

```html
<router-view class="view left-sidebar" name="LeftSidebar" />
<router-view class="view main-content" />
<router-view class="view right-sidebar" name="RightSidebar" />
```

如果**视图没有设置名字，那么默认为 default**. 那些只配置了一个组件的路由，默认就渲染在 default 视图所在位置。

## 重定向（redirect）

`redirect` 将一个路径重定向到另一个路径；访问被重定向的路径时，地址栏将更新为目标路径并渲染目标组件。

redirect 对应的值可以有多种形式：

1. 字符串

   ```js :collapsed-lines
   const router = createRouter({
     history: createWebHistory(),
     routes: [
       {
         path: "/home",
         redirect: "/",
       },
       {
         path: "/",
         component: HomeView,
       },
     ],
   });
   ```

   在这个示例中，当用户访问 `/home` 时，会被重定向到 `/`，并渲染 HomeView 组件。

2. 对象（可携带参数/查询）

   ```js :collapsed-lines
   const router = createRouter({
     history: createWebHistory(),
     routes: [
       {
         path: "/user/:id",
         redirect: { name: "profile", params: { userId: ":id" } },
       },
       {
         path: "/profile/:userId",
         name: "profile",
         component: UserProfile,
       },
     ],
   });
   ```

   在这个示例中，当用户访问 `/user/123` 时，会被重定向到 `/profile/123`，并渲染 UserProfile 组件。

3. 函数（基于目标路由信息动态返回）

   ```js :collapsed-lines
   const router = createRouter({
     history: createWebHistory(),
     routes: [
       {
         path: "/old-path/:id",
         redirect: (to) => {
           const { params } = to;
           return `/new-path/${params.id}`;
         },
       },
       {
         path: "/new-path/:id",
         component: NewPathComponent,
       },
     ],
   });
   ```

在这个示例中，当用户访问 `/old-path/123` 时，会被重定向到 `/new-path/123`，并渲染 NewPathComponent 组件。

补充：重定向会触发一次新的匹配与导航；若需保留查询/哈希请在对象形式中显式传递。

## 路由元数据（meta）

`meta` 是附加到路由的任意字段集合，常用于权限控制、标题设置、面包屑与过渡效果。

元数据经常用于权限控制、标题设置、面包屑导航、路由过渡之类的效果

1. 定义元数据：添加 `meta` 对象

   ```js
   const router = createRouter({
     history: createWebHistory(),
     routes: [
       {
         path: "/",
         component: HomeView,
         meta: { requiresAuth: true, title: "Home" },
       },
       {
         path: "/about",
         component: AboutView,
         meta: { requiresAuth: false, title: "About Us" },
       },
     ],
   });
   ```

2. 访问元数据：在守卫中读取 `to.meta`

   ```js
   router.beforeEach((to, from, next) => {
     if (to.meta.requiresAuth && !isLoggedIn()) {
       next("/login");
     } else {
       next();
     }
   });
   ```

3. 设置标题：在 `afterEach` 同步文档标题

```js
router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
});
```

## 路由懒加载（动态导入）

在新项目的模板代码中，官方路由示例的写法如下：

```js :collapsed-lines
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
```

可以看到，HomeView 是正常导入，而 AboutView 却有所不同。component 的配置对应的是**一个返回 Promise 组件的函数**，这种情况下，Vue Router 只会在第一次进入页面时才会获取这个函数，然后使用缓存数据。

这意味着你也可以使用更复杂的函数，只要它们返回一个 Promise ：

```js
const UserDetails = () =>
  Promise.resolve({
    /* 组件定义 */
  });
```

这样的组件导入方式被称之为动态导入，好处在于：

1. 当**路由被访问的时候才加载对应组件**，这样就会更加高效
2. 进行打包的时候方便做**代码分割**

另外注意，**路由中不要再使用异步组件**，下面的代码虽然可以使用，但是**没有必要**：

```js :collapsed-lines
import { defineAsyncComponent } from "vue";
import { createRouter, createWebHistory } from "vue-router";

const asyncAboutView = defineAsyncComponent(() =>
  import("../views/AboutView.vue")
);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ...
    {
      path: "/about",
      name: "about",
      component: asyncAboutView,
    },
  ],
});

export default router;
```

究其原因：<span style="color:red">**Vue Router 内部会将动态导入转换为异步组件**</span>，开发者只需书写 `import()` 即可完成懒加载与代码分割。

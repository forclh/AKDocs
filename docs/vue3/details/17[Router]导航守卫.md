# 【Router】路由导航守卫 ✨

[[TOC]]

::: tip 要点速览

- 本质：在导航生命周期关键时点执行回调，用于拦截与扩展
- 类型：全局守卫、路由级别守卫、组件守卫
- 时序：组件离开 → 全局前置 → 路由前置 → 全局解析 → 全局后置 → 组件进入
- 复用场景：参数变化时执行 全局前置 → 组件更新 → 全局解析 → 全局后置
- beforeEnter 只在进入触发；同父子路由切换不触发
- 常用场景：鉴权、加载指示器、埋点统计、页面标题、切换动画
- Vue 3.3：守卫内可使用 inject() 获取 app.provide 与 Pinia 等全局资源
- 放行与拦截：next() 放行；返回 false 或路由位置用于拒绝或重定向
  :::

## 概念与管线

导航守卫是在路由导航阶段被触发的回调。它以规范的参数签名执行：

```js
router.beforeEach((to, from, next) => {
  // 回调函数里面决定了拦截下来后做什么
  console.log("from:", from);
  console.log("to:", to);
  console.log("导航到：", to.name);
  next(); // 调用该方法代表放行
});
```

这是一个全局导航守卫，回调会自动传入 3 个参数：

- `to`：目标路由对象，含 `path/fullPath/hash/params/query/meta` 等信息
- `from`：当前离开的路由对象，结构同 `to`
- `next`：控制导航继续、终止或重定向的函数

## 守卫类型

### 全局守卫

- `beforeEach`：在任何组件守卫与异步组件解析之前调用
- `beforeResolve`：在导航被确认之前、但所有组件守卫与异步组件解析之后调用
- `afterEach`：导航确认后触发，用于非阻塞型副作用

```js
router.beforeEach((to, from, next) => {
  next();
});

router.beforeResolve((to, from, next) => {
  next();
});

router.afterEach((to, from) => {});
```

::: details 常用使用场景

- 访问统计与埋点（`afterEach`）
- 加载指示器的开启/关闭（`beforeEach`/`afterEach`）
- 页面切换动画与视觉效果（`afterEach`）
- 文档标题更新（`afterEach` 使用 `to.meta.title`）

:::

### 路由级别守卫

在某个路由的配置中声明，仅拦截进入该路由的导航：

```js
const routes = [
  {
    path: "/users/:id",
    component: UserDetails,
    beforeEnter: (to, from, next) => next(),
  },
];
```

相关细节：

- 只在“进入路由”时触发，不会因 `params/query/hash` 改变而触发
- 若守卫写在父级路由上，在同父的子路由之间切换不会触发父级的 `beforeEnter`

  ```jsx
  const routes = [
    {
      path: "/user",
      beforeEnter() {
        // ...
      },
      children: [
        { path: "list", component: UserList },
        { path: "details", component: UserDetails },
      ],
    },
  ];
  ```

  从 `/user/list` 跳转到 `/user/details` 不会触发路由级别守卫。

- 可配置为多个函数形成处理链

```js
const routes = [
  {
    path: "/about",
    component: About,
    beforeEnter: [(to, from, next) => next(), (to, from, next) => next()],
  },
];
```

### 组件守卫

- `beforeRouteEnter`：在进入该组件对应的路由、组件渲染前触发（Options API）
- `beforeRouteUpdate`：当前路由更新且组件被复用时触发
- `beforeRouteLeave`：离开该组件对应的路由时触发

Options API：

```js
export default {
  beforeRouteEnter(to, from, next) {
    next();
  },
  beforeRouteUpdate(to, from, next) {
    next();
  },
  beforeRouteLeave(to, from, next) {
    next();
  },
};
```

Composition API：

```js
import { onBeforeRouteUpdate, onBeforeRouteLeave } from "vue-router";
// 直接书写相当于beforeRouterEnter钩子
onBeforeRouteUpdate((to, from, next) => next());
onBeforeRouteLeave((to, from, next) => next());
```

## 执行顺序

完整导航的顺序：

1. 组件离开守卫
2. 全局前置守卫
3. 路由级别守卫
4. 全局解析守卫
5. 全局后置守卫
6. 组件进入守卫

组件复用（仅参数变化）时的顺序：

1. 全局前置守卫
2. 组件更新守卫
3. 全局解析守卫
4. 全局后置守卫

## 常见场景与实践

### 鉴权与角色控制

```js
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/login", name: "Login", component: Login },
  { path: "/user", name: "User", component: User, meta: { requireAuth: true } },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: { requireAuth: true, requireAdmin: true },
  },
];

let currentUserRole = null;

export function login(role) {
  currentUserRole = role;
}
export function logout() {
  currentUserRole = null;
}
export function getCurrentRole() {
  return currentUserRole;
}

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta?.requireAuth;
  const requiresAdmin = to.meta?.requireAdmin;
  if (!requiresAuth) return next();
  if (!currentUserRole) return next({ name: "Login" });
  if (requiresAdmin && currentUserRole !== "admin")
    return next({ name: "Home" });
  next();
});

export default router;
```

### 加载指示器

```js
router.beforeEach((to, from, next) => {
  showLoading();
  next();
});

router.afterEach(() => {
  hideLoading();
});
```

### 标题与埋点

```js
router.afterEach((to, from) => {
  if (to.meta && to.meta.title) document.title = to.meta.title;
  trackPage(to.fullPath, from.fullPath);
});
```

## 误用与陷阱

- 未调用 `next()` 导致导航卡住
- 重定向逻辑形成递归循环（进入 Login 时仍重定向到 Login）
- 在守卫中执行大量同步任务阻塞导航，合理使用异步与加载指示器
- 期望 `beforeEnter` 响应 `params/query/hash` 变化；需改用组件更新守卫
- 组件复用时忘记处理 `onBeforeRouteUpdate`

## 注入与全局状态

从 Vue 3.3 开始，可在守卫内使用依赖注入取得全局资源：

```js
const app = createApp(App);
app.provide("global", "some data");
```

```js
router.beforeEach(() => {
  const data = inject("global");
});
```

# **实战案例**

使用导航守卫拦截未登录的用户，将未登录用户导航到登录页面。

角色：普通用户、管理员

页面：主页、用户页、管理员页、登录

未登录：主页、登录

用户身份登录：主页、用户页、登录

管理员身份登录：主页、用户页、管理员页、登录

```js :title="router.js" :collapsed-lines
import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import User from "../views/User.vue";
import Admin from "../views/Admin.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/login", name: "Login", component: Login },
  // 仅仅需要普通权限即可
  {
    path: "/user",
    name: "User",
    component: User,
    meta: { requireAuth: true },
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: { requireAuth: true, requireAdmin: true },
  },
];

// 模拟用户登录状态
let currentUserRole = null;

// 提供一些喝角色配套的方法
export function login(role) {
  currentUserRole = role;
}
export function logout() {
  currentUserRole = null;
}

export function getCurrentRole() {
  return currentUserRole;
}

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    // 当前页面需要权限
    if (currentUserRole) {
      // 用户已登录
      if (to.meta.requireAdmin && currentUserRole !== "admin") {
        // 需要管理员权限，但是当前用户不是管理员
        next({ name: "Home" });
      } else {
        // 不需要管理员权限或者当前用户是管理员
        next();
      }
    } else {
      // 用户未登录
      next({ name: "Login" });
    }
  } else {
    // 当前页面不需要权限
    next();
  }
});

export default router;
```

```vue :title="Login.vue" :collapsed-lines
<template>
  <div class="login-container">
    <h1 v-if="!userRole">登录</h1>
    <div v-if="userRole">
      <p>
        您当前的身份为：<strong>{{ userRole }}</strong>
      </p>
      <button @click="logoutHandle">退出登录</button>
    </div>
    <form v-else @submit.prevent="loginHandle">
      <input type="text" placeholder="请输入用户名" v-model="username" />
      <input type="password" placeholder="请输入密码" v-model="password" />
      <button type="submit">登录</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { login, logout, getCurrentRole } from "../router/index.js";

// 获取路由实例
const router = useRouter();
const username = ref("");
const password = ref("");

// 获取当前登录的角色
const userRole = computed(() => {
  const role = ref(getCurrentRole());
  if (role.value === "admin") {
    return "管理员";
  } else if (role.value === "user") {
    return "普通用户";
  } else {
    return "";
  }
});

const loginHandle = () => {
  // 这里应该有具体的登录逻辑，如表单校验等，这里只是模拟
  if (username.value === "admin" && password.value === "admin") {
    login("admin");
    alert("当前以管理员身份登录");
    router.push({ name: "Admin" }); // 跳转到admin页面
  } else if (username.value === "user" && password.value === "user") {
    login("user");
    alert("当前以普通用户身份登录");
    router.push({ name: "User" }); // 跳转到user页面
  } else {
    alert("用户名或密码错误");
  }
};

const logoutHandle = () => {
  logout();
  alert("退出登录成功");
  router.push({ name: "Login" });
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

input {
  display: block;
  width: calc(100% - 24px);
  margin: 10px auto;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}
</style>
```

# 【Router】动态路由

-   动态参数路由
    -   /stu/:id
    -   /stu/1、/stu/2
-   动态的添加/删除路由表里面的路由
    -   角色 A：1、2、3、4、5
    -   角色 B：1、2、4

**基础知识**

这里的 router 就是通过 createRouter 方法创建的路由实例。

-   router.addRoute( )：动态的添加路由，只注册一个新的路由，如果要跳转到新路由需要手动 push 或者 replace.
-   router.removeRoute(name)：动态的移除路由，除了此方法移除路由，还有几种方式
    -   通过添加一个名称冲突的路由。如果添加与现有路由名称相同的路由，会先删除旧路由，再添加新路由：
        ```jsx
        router.addRoute({ path: "/about", name: "about", component: About });
        // 这将会删除之前已经添加的路由，因为他们具有相同的 name
        router.addRoute({ path: "/other", name: "about", component: Other });
        ```
    -   通过调用 router.addRoute( ) 返回的**回调函数**，调用该函数后可以删除添加的路由。当路由没有名称时，这很有用。
        ```jsx
        const removeRoute = router.addRoute(routeRecord);
        removeRoute(); // 删除路由如果存在的话
        ```

如果要添加嵌套的路由，可以将路由的 name 作为**第一个参数**传递给 router.addRoute( )

```jsx
router.addRoute({ name: "admin", path: "/admin", component: Admin });
router.addRoute("admin", { path: "settings", component: AdminSettings });
```

这等价于：

```jsx
router.addRoute({
    name: "admin",
    path: "/admin",
    component: Admin,
    children: [{ path: "settings", component: AdminSettings }],
});
```

另外还有两个常用 API：

-   router.hasRoute(name)：检查路由是否存在。
-   router.getRoutes( )：获取一个包含所有路由记录的数组（子路由会被提出来）。

**实战案例**

实现一个后台管理系统，该系统根据用户登录的不同角色，显示不同的导航栏。

权限分为三种：

-   管理员：能够访问所有模块（教学、教师、课程、学生）
-   教师：能够访问教学、课程、学生模块
-   学生：能够访问课程模块

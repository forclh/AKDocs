# 【Router】路由匹配语法

前面所介绍的路由匹配：

1. 静态路由匹配：/about —> /about
2. 动态路由匹配：/users/:id —> /users/1、/users/2

路由匹配规则非常丰富。

## **1. 参数正则**

```jsx
const routes = [
    // 这是一个动态路由
    { path: "/users/:userId" },
];
```

我们期望后面是一个用户的 id，/users/1、/users/2

/users/abc 这种形式依然能够匹配上

参数就可以设置为正则的方式.

```jsx
const routes = [
    // 这是一个动态路由
    // 第一个 \ 是转义字符
    // 后面的 \d 代表数字的意思
    // 最后的 + 表示数字可以有1个或者多个
    // 这里用于限制参数的类型
    { path: "/users/:userId(\\d+)" },
];
```

现在该路由后面的参数就只能匹配数字。

## **2. 重复参数**

可以设置参数的重复次数，+ 表示 1 或者多次，\* 表示 0 或者多次

```jsx
const routes = [
    // 注意这里是写在参数后面的，用于限制参数出现的次数
    { path: "/product/:name+" },
];
```

-   /product/one：能够匹配，name 参数的值为 `["one"]`
-   /product/one/two：能够匹配，name 参数的值为 `["one", "two"]`
-   /product/one/two/three：能够匹配，name 参数的值为 `["one", "two", "three"]`
-   /product：不能匹配，因为要求参数至少要有 1 个

```jsx
const routes = [{ path: "/product/:name*" }];
```

-   /product：能够匹配，name 参数的值为 `[]`
-   /product/one：能够匹配，name 参数的值为 `["one"]`
-   /product/one/two：能够匹配，name 参数的值为 `["one", "two"]`

可以和自定义正则一起使用，将重复次数符号放在自定义正则表达式后面：

```jsx
const routes = [
    // 前面的 (\\d+) 是限制参数的类型
    // 最后的 + 是限制参数的次数
    { path: "/product/:id(\\d+)+" },
];
```

-   /product/123 ：能够匹配，id 参数的值为 `["123"]`
-   /product/123/456：能够匹配，id 参数的值为 `["123", "456"]`
-   /product/123/456/789：能够匹配，id 参数的值为 `["123", "456", "789"]`
-   /product/abc：不能匹配，因为 abc 不是数字
-   /product/123/abc：不能匹配，因为 abc 不是数字
-   /product/：不能匹配，因为至少需要一个数字

## **3. 可选参数**

可以通过使用 ? 修饰符(0 个或 1 个)将一个参数标记为可选：

```jsx
const routes = [{ path: "/users/:userId?" }];
```

-   /users：能够匹配，可以没有 userId 这个参数
-   /users/posva：能够匹配，userId 参数的值为 `["posva"]`

```jsx
const routes = [
    // 这里就是对参数类型进行了限制
    // 参数可以没有，如果有的话，必须是数字
    { path: "/users/:userId(\\d+)?" },
];
```

-   /users：能够匹配，因为可以没有参数
-   /users/42：能够匹配，有参数并且参数是数字
-   /users/abc：不匹配，因为参数不是数字

## **4. sensitive 与 strict**

默认情况下，所有路由是**不区分大小写**的，并且**能匹配带有或不带有尾部斜线的路由**。

例如，路由 /users 将匹配 /users、/users/、甚至 /Users/。

这种行为可以通过 strict 和 sensitive 选项来修改：

-   sensitive：指定路径匹配是否对**大小写敏感**，默认 false
-   strict：指定路径匹配是否严格要求**结尾的斜杠**，默认 false

它们既可以应用在整个全局路由上，又可以应用于当前路由上：

```jsx
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // 这个sensitive是局部应用
        { path: "/users/:id", sensitive: true },
    ],
    strict: true, // 这个strict是全局应用
});

export default router;
```

-   /users/posva：能够匹配
-   /users/posva/：不能够匹配，因为 strict 是 true，不允许有多余的尾部斜线
-   /Users/posva：不能够匹配，因为 sensitive 是 true，严格区分大小写

```jsx
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: "/users/:id?" }],
    strict: true,
});

export default router;
```

-   /users：能够匹配，因为 id 是可选
-   /Users：能够匹配，因为默认不区分大小写
-   /users/42：能够匹配，这里会匹配上 id 参数
-   /users/：不能匹配，因为 strict 是 true，不允许有多余的尾部斜线
-   /users/42/：不能匹配，因为 strict 是 true，不允许有多余的尾部斜线

最后官方推荐了一个 [路径排名调试工具](https://paths.esm.dev/?p=AAMeJSyAwR4UbFDAFxAcAGAIJXMAAA..)，可以用于了解为什么一个路由没有被匹配，或者报告一个 bug.

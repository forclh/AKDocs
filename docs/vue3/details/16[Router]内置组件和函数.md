# 【Router】内置组件和函数

## 内置组件

### **1. RouterLink**

2 个样式类：

1. activeClass：当链接所指向的路径**匹配**当前路由路径时，应用于该链接的 CSS 类，默认类名为 linkActiveClass

    ```html
    <RouterLink to="/about" activeClass="my-active">About</RouterLink>
    ```

    - 当前路径是 /about：会应用 my-active 样式类
    - 当前路径是 /about/team：会应用 my-active 样式类

2. exactActiveClass：当链接所指向的路径**精确匹配**当前路由路径时，应用于该链接的 CSS 类，默认类名为 linkExactActiveClass

    ```html
    <RouterLink to="/about" exactActiveClass="my-exact-active"
        >About</RouterLink
    >
    ```

    - 当前路径是 /about：会应用 my-exact-active 样式类
    - 当前路径是 /about/team：不会应用 my-exact-active 样式类

### **2. RouterView**

称之为**视图**或**路由出口**

RouterView 组件暴露了一个插槽（作用域插槽），**这个插槽可以用来获取当前匹配的路由组件**。

```html
<router-view v-slot="{ Component }">
    <component :is="Component" />
</router-view>
```

思考 🤔：获取到当前所匹配的组件有啥用呢？

答案：主要就是为了方便扩展一些其他的功能。

**KeepAlive & Transition**

当在处理 KeepAlive 组件时，我们通常想要保持对应的路由组件活跃，而不是 RouterView 本身。为了实现这个目的，我们可以将 KeepAlive 组件放置在插槽内：

```html
<router-view v-slot="{ Component }">
    <keep-alive>
        <component :is="Component" />
    </keep-alive>
</router-view>
```

类似地，插槽允许我们使用一个 Transition 组件来实现在路由组件之间切换时实现过渡效果：

```html
<router-view v-slot="{ Component }">
    <transition>
        <component :is="Component" />
    </transition>
</router-view>
```

两者结合后的嵌套顺序：

```html
<router-view v-slot="{ Component }">
    <transition>
        <keep-alive>
            <component :is="Component" />
        </keep-alive>
    </transition>
</router-view>
```

**模板引用**

使用插槽可以让我们直接将模板引用放置在路由组件上。

```html
<router-view v-slot="{ Component }">
    <!-- 我现在要引用组件内部的模板 -->
    <component :is="Component" ref="mainContent" />
</router-view>
```

如果将 ref 挂在 router-view 上面，那么最终拿到的是 router-view 的引用，而非所匹配的组件本身。

## 内置函数

### **1. useRouter 和 useRoute**

**在 setup 中没有 this**，因此无法像 Vue2 那样通过 this._router 或者 this_.route 来访问路由实例和当前路由

与之替代的就是通过 useRouter 和 useRoute 这两个内置函数。

```jsx
import { useRouter, useRoute } from "vue-router";

const router = useRouter(); // 拿到的就是整个路由实例
const route = useRoute(); // 拿到的是当前路由

function pushWithQuery(query) {
    router.push({
        name: "search",
        query: {
            ...route.query,
            ...query,
        },
    });
}
```

另外，在模板中可以直接访问 $router 和 $route，所以如果只在模板中使用这些对象的话，那就不需要 useRouter 或 useRoute.

### **2. useLink**

useLink 主要用于**自定义导航组件的时候使用**。

```jsx
const {
    // 解析出来的路由对象
    route,
    // 用在链接里的 href
    href,
    // 布尔类型的 ref 标识链接是否匹配当前路由
    isActive,
    // 布尔类型的 ref 标识链接是否严格匹配当前路由
    isExactActive,
    // 导航至该链接的函数
    navigate,
} = useLink(props); // 这里接收的props类似于RouterLink所有props
```

示例：NavigationLink 组件

```html
<template>
    <a :href="link.href" @click.prevent="navigate">
        <slot></slot>
    </a>
</template>

<script setup>
    import { useLink } from "vue-router";

    const props = defineProps({
        to: {
            type: String,
            required: true,
        },
    });

    const link = useLink({
        to: props.to,
    });

    const navigate = () => {
        if (confirm("你确定要跳转么？")) {
            link.navigate();
        }
    };
</script>
```

App.vue

```html
<template>
    <div id="app">
        <nav>
            <!-- 接下来使用我们自定义的组件NavigationLink来做跳转 -->
            <NavigateLink to="/">首页</NavigateLink>
            <NavigateLink to="/about">关于</NavigateLink>
            <NavigateLink to="/contact">联系</NavigateLink>
        </nav>
        <router-view></router-view>
    </div>
</template>

<script setup>
    import NavigateLink from "./components/NavigationLink.vue";
</script>
```

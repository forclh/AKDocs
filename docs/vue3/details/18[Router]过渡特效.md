# 【Router】过渡特效

## **1. 快速上手**

为路由切换添加过渡效果，其实就是使用 Transition 内置组件，没有其他新知识。

```html
<router-view v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
        <component :is="Component" />
    </Transition>
</router-view>
```

## **2. 相关细节**

1. 单个路由的过渡：
    - 如果对不同的路由的过渡有需求，那么可以通过以下的设置来做：
        - meta：设置元数据，上面记录过渡的方式
        - RouterView 插槽，通过插槽拿到 route，从而拿到元数据里面的过渡方式
        - <Transition>组件设置不同的 name 值从而应用不同的过渡方式
        ```html
        <router-view v-slot="{ Component, route }">
            <Transition :name="route.meta.transition || 'fade'" mode="out-in">
                <component :is="Component" />
            </Transition>
        </router-view>
        ```
2. 基于路由动态过渡

    这里可以使用导航守卫（全局后置守卫）来添加过渡效果

    ```jsx
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

3. 使用 Key：Vue 可能会**自动复用看起来相似的组件**，从而忽略了任何过渡，可以**添加一个 key 属性**来强制过渡。

    ```html
    <router-view v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
            <component :is="Component" :key="route.path" />
        </Transition>
    </router-view>
    ```

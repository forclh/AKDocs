# 【Vue】插件

插件（plugin）是一种可选的独立模块，它可以添加特定功能或特性，而无需修改主程序的代码。

Vue 中使用插件：

```jsx
const app = createApp();
// 通过use方法来使用插件
app.use(router).use(pinia).use(ElementPlus).mount("#app");
```

Vue 中制作插件：

1. 一个插件可以是一个**拥有 install 方法的对象**：

    ```jsx
    const myPlugin = {
        install(app, options) {
            // 配置此应用
        },
    };
    ```

2. 也可以直接是**一个安装函数本身**：

    ```jsx
    const install = function (app, options) {};
    ```

    安装方法接收两个参数：

    1. app：应用实例
    2. options：额外选项，这是在使用插件时传入的额外信息

        ```jsx
        app.use(myPlugin, {
            /* 可选的选项，会传递给 options */
        });
        ```

Vue 中插件带来的增强包括：

1. 通过 app.component 和 app.directive 注册一到多个全局组件或自定义指令
2. 通过 app.provide 使一个资源注入进整个应用
3. 向 app.config.globalProperties 中添加一些全局实例属性或方法
4. 一个可能上述三种都包含了的功能库 (例如 vue-router)

例如：自定义组件库时，install 方法所做的事情就是往当前应用注册所有的组件

```jsx
import Button from "./Button.vue";
import Card from "./Card.vue";
import Alert from "./Alert.vue";

const components = [Button, Card, Alert];

const myPlugin = {
    install(app, options) {
        // 这里要做的事情，其实就是引入所有的自定义组件
        // 然后将其注册到当前的应用里面
        components.forEach((com) => {
            app.component(com.name, com);
        });
    },
};

export default myPlugin;
```

# **实战案例**

在企业级应用开发中，经常需要一个 **全局错误处理和日志记录插件**，它能够帮助捕获和记录全局的错误信息，并提供一个集中化的日志记录机制。

我们的插件目标如下：

1. **捕获全局的 Vue 错误**和**未处理的 Promise 错误**。
2. 将错误信息**记录到控制台**或**发送到远程日志服务器**。
3. 提供一个 Vue 组件用于显示最近的错误日志。

# 【Vue】插件 ✨

[[TOC]]

::: tip 要点速览

- 定义：插件是独立的增强模块，通过 `app.use(plugin, options)` 安装，不修改主程序代码。
- 形态：对象形式（含 `install(app, options)`）或函数形式（`(app, options) => void`）。
- 能力：注册全局组件/指令（`app.component/app.directive`）、注入资源（`app.provide`）、添加全局属性（`app.config.globalProperties`）。
- 安装特性：安装与配置在应用层生效；建议幂等设计，避免重复注册与副作用泄漏。
- 生态示例：`vue-router`、`pinia`、UI 组件库等均以插件形式提供能力。

:::

## 动机与定义

插件（plugin）是一种可选的独立模块，它可以在不修改主程序代码的前提下，为应用添加特定功能或特性。

## 快速上手

使用插件：

```jsx
const app = createApp(/* root component */);
app.use(router).use(pinia).use(ElementPlus).mount("#app");
```

制作插件：

1. 对象形式（拥有 `install` 方法）：

```jsx
const myPlugin = {
  install(app, options) {
    // 配置此应用
  },
};
```

2. 函数形式（安装函数本身）：

```jsx
const install = (app, options) => {
  // 配置此应用
};
```

安装方法接收两个参数：

- `app`：应用实例
- `options`：使用插件时传入的额外配置

```jsx
app.use(myPlugin, {
  /* 可选的选项，会传递给 options */
});
```

## 能力总览

1. 通过 `app.component/app.directive` 注册一到多个全局组件或指令
2. 通过 `app.provide` 使资源注入进整个应用（配合 `inject` 使用）
3. 向 `app.config.globalProperties` 添加全局实例属性或方法（组件内 `this.$xxx`）
4. 一个可能上述三种都包含的功能库（例如 `vue-router`）

例如：自定义组件库时，`install` 负责在当前应用注册所有组件：

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

# 实战案例

在企业级应用开发中，经常需要一个 **全局错误处理和日志记录插件**，它能够帮助捕获和记录全局的错误信息，并提供一个集中化的日志记录机制。

我们的插件目标如下：

1. **捕获全局的 Vue 错误**和**未处理的 Promise 错误**。
2. 将错误信息**记录到控制台**或**发送到远程日志服务器**。
3. 提供一个 Vue 组件用于显示最近的错误日志。

显示错误日志组件

```vue :title="/src/plugins/ErrorLogger/ErrorLogger.vue" :collapsed-lines
<!-- 显示错误日志 -->
<template>
  <div v-if="errors.length">
    <h1>错误日志</h1>
    <ul>
      <li v-for="error in errors" :key="error.timestamp">
        {{ error.timestamp }} - {{ error.message }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { reactive, onMounted, onUnmounted } from "vue";

const errors = reactive([]);
const originalError = console.error;
onMounted(() => {
  // 改写console.error方法
  // 之后在调用console.error时，会触发这个方法，从而记录错误日志
  console.error = (...args) => {
    // 记录错误日志
    errors.push({
      timestamp: new Date().toLocaleString(),
      message: args[0],
    });
    originalError.apply(console, args);
  };
});

onUnmounted(() => {
  // 组件卸载时，恢复console.error方法
  console.error = originalError;
});
</script>
```

插件配置项

```js :title="/src/plugins/ErrorLogger/error-logger.js" :collapsed-lines
import ErrorLogger from "./ErrorLogger.vue";

export default {
  install(app, options = {}) {
    // 1.参数归一化
    const defaultOptions = {
      logToConsole: true, // 是否将错误日志同时打印到控制台
      remoteLogging: false, // 是否将错误日志发送到远程服务器
      remoteLoggingUrl: "", // 远程服务器日志记录URL
    };

    // 合并用户选项和默认选项
    const config = { ...defaultOptions, ...options };

    // 2. 捕获两种类型的错误：
    // (1). 全局Vue错误
    app.config.errorHandler = (err, instance, info) => {
      logError(err, info);
    };
    // (2). 未处理的Promise错误
    window.addEventListener("unhandledrejection", (event) => {
      logError(event.reason, "未处理的Promise错误");
    });
    // 3. 统一交给错误处理函数处理
    function logError(error, info) {
      // 是否打印错误日志到控制台
      if (config.logToConsole) {
        console.error(`[错误:${info}]`, error); // 使用改写过的error方法，记录错误信息
      }
      // 是否发送错误日志到远程服务器
      if (config.remoteLogging && config.remoteLoggingUrl) {
        fetch(config.remoteLoggingUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            error: error.message, // 错误消息
            stack: error.stack, // 错误栈信息
            info, // 错误说明
            timestamp: new Date().toISOString(), // 错误发生时间
          }),
        }).catch((error) => {
          console.error("[发送错误日志到远程服务器失败]:", error);
        });
      }
    }
    // 4. 注册ErrorLogger组件
    app.component("ErrorLogger", ErrorLogger);
  },
};
```

插件安装

```js :title="/src/main.js" :collapsed-lines
import { createApp } from "vue";
import App from "./App.vue";
// 引入自定义插件
import ErrorLogger from "./plugins/ErrorLogger/error-logger.js";

const app = createApp(App);

// 安装自定义插件
app.use(ErrorLogger, {
  logToConsole: true, // 是否将错误日志同时打印到控制台
  remoteLogging: true, // 是否将错误日志发送到远程服务器
  remoteLoggingUrl: "http://localhost:3000/log", // 远程服务器日志记录URL
});

app.mount("#app");
```

插件使用

```vue :title="/src/App.vue" :collapsed-lines
<template>
  <div>
    <h1>错误插件使用示例</h1>
    <button @click="simulateError">模拟错误</button>
    <!-- 使用ErrorLogger插件所提供的组件 -->
    <ErrorLogger />
  </div>
</template>

<script setup>
const simulateError = () => {
  // 模拟一个错误
  throw new Error("这是一个模拟错误");
};
</script>
```

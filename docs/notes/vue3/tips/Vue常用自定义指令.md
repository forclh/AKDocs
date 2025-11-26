# Vue3 常用自定义指令

[参考文章](https://juejin.cn/post/6906028995133833230?searchId=20250731075545000A6DD955E93917EC8D)

## v-copy 实现文本复制

**需求**：实现一键复制文本内容，用于鼠标右键粘贴。

### 代码实现

```js :title='@/src/directives/copy.js' :collapsed-lines
/**
 * 复制指令
 * 使用 Clipboard API 实现高效的文本复制功能
 * 支持降级方案，兼容旧版浏览器
 *
 * @author AidenKao
 * @version 1.0.0
 * @description 提供完整的复制功能，包括成功/失败回调等
 */

/**
 * 降级复制方案 - 使用传统的 execCommand 方法
 * 当 Clipboard API 不可用时的备选方案
 *
 * @param {string} text - 要复制的文本内容
 * @returns {Promise<void>} - 返回 Promise 以保持 API 一致性
 */
const fallbackCopy = (text) => {
  return new Promise((resolve, reject) => {
    try {
      // 创建临时的 textarea 元素用于复制操作
      const textArea = document.createElement("textarea");

      // 设置要复制的文本内容
      textArea.value = text;

      // 设置样式使元素不可见但仍可操作
      // 使用 Object.assign 批量设置样式，提高性能
      Object.assign(textArea.style, {
        position: "fixed", // 固定定位，避免影响页面布局
        top: "0", // 定位到页面顶部
        left: "0", // 定位到页面左侧
        width: "2em", // 设置最小宽度
        height: "2em", // 设置最小高度
        padding: "0", // 移除内边距
        border: "none", // 移除边框
        outline: "none", // 移除轮廓
        boxShadow: "none", // 移除阴影
        background: "transparent", // 设置透明背景
        opacity: "0", // 设置完全透明
        pointerEvents: "none", // 禁用鼠标事件
      });

      // 将元素添加到 DOM 中
      document.body.appendChild(textArea);

      // 聚焦到 textarea 元素
      textArea.focus();

      // 选中所有文本内容
      textArea.select();

      // 执行复制命令
      const successful = document.execCommand("copy");

      // 清理：从 DOM 中移除临时元素
      document.body.removeChild(textArea);

      // 根据复制结果决定 Promise 状态
      if (successful) {
        resolve(); // 复制成功
      } else {
        reject(new Error("execCommand failed")); // 复制失败
      }
    } catch (error) {
      // 捕获任何异常并拒绝 Promise
      reject(error);
    }
  });
};

/**
 * 解析绑定值，获取复制内容和配置
 * 支持字符串和对象两种绑定方式
 *
 * @param {any} bindingValue - 指令绑定的值
 * @returns {Object} - 返回解析后的配置对象
 */
const parseBindingValue = (bindingValue) => {
  // 默认配置选项
  const defaultConfig = {
    text: "", // 要复制的文本内容
    onSuccess: null, // 成功回调函数
    onError: null, // 失败回调函数
  };

  // 处理响应式对象（ref）
  // 防御性：虽然外层 ref 会自动解包
  let currentValue = bindingValue;
  if (
    currentValue &&
    typeof currentValue === "object" &&
    "value" in currentValue
  ) {
    currentValue = currentValue.value;
    console.log("传递了ref");
  }

  // 如果绑定值是字符串，直接作为复制内容
  if (typeof currentValue === "string") {
    return {
      ...defaultConfig,
      text: currentValue,
    };
  }

  // 如果绑定值是对象，解析配置
  if (typeof currentValue === "object" && currentValue !== null) {
    // 处理 text 属性可能是响应式对象的情况
    let textValue = currentValue.text;
    // 说明 textValue 是 ref
    if (textValue && typeof textValue === "object" && "value" in textValue) {
      textValue = textValue.value;
    }

    return {
      ...defaultConfig,
      ...currentValue,
      text: textValue || "",
    };
  }

  // 其他情况返回默认配置
  return defaultConfig;
};

/**
 * 通用事件处理函数 - 统一处理复制操作的回调和事件触发
 *
 * @param {HTMLElement} el - 触发事件的DOM元素
 * @param {'success'|'error'} eventType - 事件类型，决定调用哪个回调函数和触发哪个事件
 * @param {Object} config - 配置对象，包含回调函数
 * @param {Function} [config.onSuccess] - 成功时的回调函数
 * @param {Function} [config.onError] - 错误时的回调函数
 * @param {Object} data - 事件数据，将作为事件详情和回调参数传递
 * @param {string} [data.content] - 成功复制的内容（success事件）
 * @param {Error|string} [data.error] - 错误信息（error事件）
 *
 * @example
 * // 处理成功情况
 * triggerCopyEvent(el, 'success', config, { content: 'copied text' });
 *
 * @example
 * // 处理异常情况
 * triggerCopyEvent(el, 'error', config, { error: new Error('clipboard error') });
 */
const triggerCopyEvent = (el, eventType, config, data) => {
  // 调用相应的回调函数
  if (eventType === "success" && typeof config.onSuccess === "function") {
    config.onSuccess(data);
  } else if (eventType === "error" && typeof config.onError === "function") {
    config.onError(data);
  }

  // 触发自定义事件
  el.dispatchEvent(
    new CustomEvent(`copy-${eventType}`, {
      detail: data,
    })
  );
};

/**
 * 执行复制操作的核心函数
 * 优先使用现代 Clipboard API，失败时降级到传统方法
 *
 * @param {Object} config - 复制配置对象
 * @param {HTMLElement} el - 绑定指令的 DOM 元素
 * @returns {Promise<void>} - 复制操作的 Promise
 */
const performCopy = async (config, el) => {
  try {
    // 检查是否有内容需要复制
    if (!config.text) {
      // 无内容复制：触发失败回调和事件
      triggerCopyEvent(el, "error", config, {
        error: "无复制内容",
      });
      return;
    }

    // 复制内容到剪贴板
    // 优先使用现代 Clipboard API, 检查浏览器支持和安全上下文
    if (navigator.clipboard && window.isSecureContext) {
      // 使用 Clipboard API 写入文本
      await navigator.clipboard.writeText(config.text);
    } else {
      // 降级到传统复制方法
      await fallbackCopy(config.text);
    }

    // 复制成功触发成功回调和事件
    triggerCopyEvent(el, "success", config, {
      content: config.text,
    });
  } catch (error) {
    // 复制失败触发失败回调和事件
    triggerCopyEvent(el, "error", config, { error });
  }
};

/**
 * 复制指令定义
 */
const vCopy = {
  /**
   * 指令挂载时的处理
   * 在元素被插入到 DOM 中时调用
   *
   * @param {HTMLElement} el - 绑定指令的 DOM 元素
   * @param {Object} binding - 指令绑定对象
   */
  mounted(el, binding) {
    // 存储绑定值，用于后续更新
    el._bindingValue = binding.value;

    // 创建点击处理函数
    const handleCopy = async () => {
      // 解析当前的绑定值和配置
      const config = parseBindingValue(el._bindingValue); // 使用存储的绑定值

      // 执行复制操作
      await performCopy(config, el);
    };

    // 将处理函数存储到元素上，便于后续更新和清理
    el._copyHandler = handleCopy;

    // 绑定点击事件监听器
    el.addEventListener("click", handleCopy);

    // 添加视觉反馈样式
    el.style.cursor = "pointer"; // 设置鼠标指针样式
    el.setAttribute("title", "点击复制"); // 设置提示文本

    // 添加可访问性属性
    el.setAttribute("role", "button"); // 设置角色为按钮
    el.setAttribute("aria-label", "复制到剪贴板"); // 设置无障碍标签
  },

  /**
   * 指令更新时的处理
   * 当绑定值发生变化时调用或者父组件更新时调用
   * vue3 是组件级别的更新，任何收集到的响应式依赖变化都会导致当前组件更新，从而触发所有指令的 update 钩子，
   * 但是此时指令绑定的值可能没有变化，即 binding.value === binding.oldValue
   * 如果绑定的值是一个对象，组件重渲染会创建新的对象，导致地址的引用变化，而实际的值相同，
   * 因此为了避免不必要的对象创建，最好绑定一个常量或者一个计算属性
   *
   * @param {HTMLElement} el - 绑定指令的 DOM 元素
   * @param {Object} binding - 新的指令绑定对象
   */
  updated(el, binding) {
    // 更新存储的绑定值（对应绑定的事件处理函数）
    el._bindingValue = binding.value;
  },

  /**
   * 指令卸载前的清理
   * 在元素从 DOM 中移除前调用
   *
   * @param {HTMLElement} el - 绑定指令的 DOM 元素
   */
  beforeUnmount(el) {
    // 清理事件监听器，防止内存泄漏
    if (el._copyHandler) {
      el.removeEventListener("click", el._copyHandler);

      // 清理存储的引用
      delete el._copyHandler;
      delete el._bindingValue;
    }

    // 清理添加的属性
    el.removeAttribute("title");
    el.removeAttribute("role");
    el.removeAttribute("aria-label");

    // 重置样式
    el.style.cursor = "";
  },
};

export default vCopy;
```

### 使用示例

#### 固定文本

```vue :collapsed-lines
<template>
  <button v-copy="'Hello World'">复制固定文本</button>
</template>

<script setup>
import vCopy from "@/directives/copy.js";
</script>
```

#### 复制响应式数据

```vue :collapsed-lines
<template>
  <input type="text" v-model="copyText" />
  <button v-copy="copyText">复制响应式数据</button>
</template>

<script setup>
import { ref } from "vue";
import vCopy from "@/directives/copy.js";

const copyText = ref("AidenKao");
</script>
```

#### 使用事件监听器

```vue :collapsed-lines
<template>
  <textarea v-model="longText" placeholder="输入长文本..."></textarea>
  <button
    v-copy="longText"
    @copy-success="handleEventSuccess"
    @copy-error="handleEventError"
  >
    事件监听复制
  </button>
</template>

<script setup>
import { ref } from "vue";
import vCopy from "@/directives/copy.js";

const longText = ref(
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, praesentium odit quisquam nemo excepturi labore aspernatur quod dicta doloribus aut blanditiis rerum autem dolorem necessitatibus magnam consequatur! Quos, necessitatibus rem."
);

// 事件监听成功处理函数
const handleEventSuccess = (event) => {
  // ... 其他操作
  // ...成功提示
  console.log("复制成功:", event, event.detail.content);
};

// 事件监听失败处理函数
const handleEventError = (event) => {
  // ...失败提示
  console.log("复制失败:", event, event.detail.error);
};
</script>
```

#### 计算属性方式

```vue :collapsed-lines
<template>
  <button v-copy="urlConfig">复制当前页面URL</button>
</template>

<script setup>
import { ref, computed } from "vue";
import vCopy from "@/directives/copy.js";

const urlConfig = computed(() => ({
  text: window.location.href,
  onSuccess: handleCopySuccess,
  onError: handleCopyError,
}));

// 复制成功回调函数
const handleCopySuccess = (data) => {
  // ...其他处理

  // ...显示成功提示
  console.log("复制成功:", data.content);
};

// 复制失败回调函数
const handleCopyError = (data) => {
  // 显示失败提示
  console.log("复制失败:", data.error);
};
</script>
```

## v-longpress

##

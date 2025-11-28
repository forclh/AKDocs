# Vue 组件 v-model 自定义修饰符指南

## 概述

Vue 3 允许我们为组件的 v-model 创建自定义修饰符，通过 `defineModel` 的 `set` 和 `get` 函数来处理修饰符逻辑。这为组件提供了强大的数据处理能力。

## 常用自定义修饰符实现

### 1. `.capitalize` - 首字母大写

**用途**：自动将输入的首字母转换为大写

```vue
<!-- 子组件 CapitalizeInput.vue -->
<template>
  <input v-model="model" type="text" />
</template>

<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.capitalize && typeof value === "string") {
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
    return value;
  },
});
</script>
```

**使用方式**：

```vue
<!-- 父组件 -->
<template>
  <CapitalizeInput v-model.capitalize="name" />
  <p>结果：{{ name }}</p>
</template>
```

### 2. `.trim` - 去除空格

**用途**：自动去除输入值的首尾空格

```vue
<!-- 子组件 TrimInput.vue -->
<template>
  <input v-model="model" type="text" />
</template>

<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.trim && typeof value === "string") {
      return value.trim();
    }
    return value;
  },
});
</script>
```

**使用方式**：

```vue
<TrimInput v-model.trim="username" />
```

### 3. `.number` - 数字转换

**用途**：自动将输入转换为数字类型

```vue
<!-- 子组件 NumberInput.vue -->
<template>
  <input v-model="model" type="text" />
</template>

<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.number) {
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    }
    return value;
  },
  get(value) {
    if (modifiers.number) {
      return String(value || 0);
    }
    return value;
  },
});
</script>
```

**使用方式**：

```vue
<NumberInput v-model.number="age" />
```

### 4. `.currency` - 货币格式化

**用途**：格式化货币显示，存储时保持数字格式

```vue
<!-- 子组件 CurrencyInput.vue -->
<template>
  <input v-model="displayValue" type="text" @blur="handleBlur" />
</template>

<script setup>
import { computed } from "vue";

const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.currency) {
      // 移除货币符号和格式化字符，保留数字
      const numValue = parseFloat(String(value).replace(/[^\d.-]/g, ""));
      return isNaN(numValue) ? 0 : numValue;
    }
    return value;
  },
  get(value) {
    return value;
  },
});

const displayValue = computed({
  get() {
    if (modifiers.currency && typeof model.value === "number") {
      return new Intl.NumberFormat("zh-CN", {
        style: "currency",
        currency: "CNY",
      }).format(model.value);
    }
    return model.value;
  },
  set(value) {
    model.value = value;
  },
});

const handleBlur = () => {
  // 失焦时重新格式化显示
  displayValue.value = displayValue.value;
};
</script>
```

**使用方式**：

```vue
<CurrencyInput v-model.currency="price" />
```

### 5. `.debounce` - 防抖处理

**用途**：延迟更新，减少频繁的数据变更

```vue
<!-- 子组件 DebounceInput.vue -->
<template>
  <input v-model="localValue" type="text" />
</template>

<script setup>
import { ref, watch } from "vue";

const [model, modifiers] = defineModel();
const localValue = ref(model.value);

let debounceTimer = null;

watch(localValue, (newValue) => {
  if (modifiers.debounce) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      model.value = newValue;
    }, 300); // 300ms 延迟
  } else {
    model.value = newValue;
  }
});

watch(
  () => model.value,
  (newValue) => {
    localValue.value = newValue;
  }
);
</script>
```

**使用方式**：

```vue
<DebounceInput v-model.debounce="searchQuery" />
```

### 6. `.uppercase` / `.lowercase` - 大小写转换

**用途**：自动转换文本大小写

```vue
<!-- 子组件 CaseInput.vue -->
<template>
  <input v-model="model" type="text" />
</template>

<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    if (typeof value === "string") {
      if (modifiers.uppercase) {
        return value.toUpperCase();
      }
      if (modifiers.lowercase) {
        return value.toLowerCase();
      }
    }
    return value;
  },
});
</script>
```

**使用方式**：

```vue
<CaseInput v-model.uppercase="code" />
<CaseInput v-model.lowercase="email" />
```

### 7. `.phone` - 电话号码格式化

**用途**：自动格式化电话号码显示

```vue
<!-- 子组件 PhoneInput.vue -->
<template>
  <input v-model="displayValue" type="text" maxlength="13" />
</template>

<script setup>
import { computed } from "vue";

const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.phone) {
      // 只保留数字
      return String(value).replace(/\D/g, "");
    }
    return value;
  },
});

const displayValue = computed({
  get() {
    if (modifiers.phone && model.value) {
      const phone = String(model.value);
      // 格式化为 xxx-xxxx-xxxx
      if (phone.length >= 11) {
        return phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
      }
      return phone;
    }
    return model.value;
  },
  set(value) {
    model.value = value;
  },
});
</script>
```

**使用方式**：

```vue
<PhoneInput v-model.phone="phoneNumber" />
```

### 8. `.maxlength` - 长度限制

**用途**：限制输入的最大长度

```vue
<!-- 子组件 MaxLengthInput.vue -->
<template>
  <div>
    <input v-model="model" type="text" />
    <span v-if="modifiers.maxlength" class="char-count">
      {{ (model || "").length }}/{{ maxLength }}
    </span>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  maxLength: {
    type: Number,
    default: 100,
  },
});

const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.maxlength && typeof value === "string") {
      return value.slice(0, props.maxLength);
    }
    return value;
  },
});
</script>

<style scoped>
.char-count {
  font-size: 12px;
  color: #666;
  margin-left: 8px;
}
</style>
```

**使用方式**：

```vue
<MaxLengthInput v-model.maxlength="description" :max-length="50" />
```

## 组合使用多个修饰符

可以同时使用多个修饰符：

```vue
<!-- 子组件 MultiModifierInput.vue -->
<template>
  <input v-model="model" type="text" />
</template>

<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    let result = value;

    // 按顺序应用修饰符
    if (modifiers.trim && typeof result === "string") {
      result = result.trim();
    }

    if (modifiers.lowercase && typeof result === "string") {
      result = result.toLowerCase();
    }

    if (modifiers.capitalize && typeof result === "string") {
      result = result.charAt(0).toUpperCase() + result.slice(1);
    }

    return result;
  },
});
</script>
```

**使用方式**：

```vue
<MultiModifierInput v-model.trim.capitalize="title" />
```

## 最佳实践

### 1. 修饰符命名规范

- 使用小写字母
- 使用描述性名称
- 避免与内置修饰符冲突

### 2. 性能考虑

- 在 `set` 函数中进行必要的类型检查
- 避免在 `get` 函数中进行复杂计算
- 合理使用防抖和节流

### 3. 用户体验

- 提供实时反馈
- 保持输入的响应性
- 处理边界情况

### 4. 错误处理

```javascript
const [model, modifiers] = defineModel({
  set(value) {
    try {
      if (modifiers.custom) {
        // 自定义处理逻辑
        return processValue(value);
      }
      return value;
    } catch (error) {
      console.warn("修饰符处理错误:", error);
      return value; // 返回原值作为降级处理
    }
  },
});
```

## 总结

自定义 v-model 修饰符为 Vue 组件提供了强大的数据处理能力，通过合理使用这些修饰符，可以：

- 提升用户体验
- 减少重复代码
- 统一数据处理逻辑
- 增强组件的可复用性

在实际开发中，根据业务需求选择合适的修饰符，并注意性能和用户体验的平衡。

# v-model

> 面试题：请阐述一下 v-model 的原理

`v-model`即可以作用于表单元素，又可作用于自定义组件，无论是哪一种情况，它都是一个语法糖，最终会**生成一个属性和一个事件**

**当其作用于表单元素时**，`vue`会根据作用的**表单元素类型而生成合适的属性和事件**。例如，作用于普通文本框的时候，它会生成`value`属性和`input`事件，而当其作用于单选框或多选框时，它会生成`checked`属性和`change`事件。

`v-model`也可作用于自定义组件，**当其作用于自定义组件时**，默认情况下，它会生成一个`value`属性和`input`事件。

```html
<Comp v-model="data" />
<!-- 等效于 -->
<Comp :value="data" @input="data=$event" />
```

> `$event`  是一个特殊变量，用于在模板中直接访问原生 DOM 事件对象或自定义事件的参数 。它在事件绑定时非常有用，尤其是在需要同时传递其他参数的情况下。

开发者可以通过组件的`model`配置来改变生成的属性和事件

```jsx
// Comp
const Comp = {
    model: {
        prop: "number", // 默认为 value
        event: "change", // 默认为 input
    },
    // ...
};
```

```html
<Comp v-model="data" />
<!-- 等效于 -->
<Comp :number="data" @change="data=$event" />
```

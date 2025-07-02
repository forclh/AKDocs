# 组件v-model

父传子通过 Props，子传父通过自定义事件。

v-model 是 Vue 中的一个内置指令，除了可以做表单元素的双向绑定以外，还可以用在组件上面，从而成为父组件和子组件数据传输的桥梁。

## 快速上手

App.vue

```jsx
<template>
  <div class="app-container">
    <h1>请对本次服务评分：</h1>
    <!-- <Rating @update-rating="handleRating" :rating /> -->
    <Rating v-model="rating" />
    <p v-if="rating > 0">你当前的评价为 {{ rating }} 颗星</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Rating from './components/Rating.vue'
// 这是父组件维护的数据
const rating = ref(0)
</script>

<style scoped>
.app-container {
  max-width: 600px;
  margin: auto;
  text-align: center;
  font-family: Arial, sans-serif;
}

p {
  font-size: 18px;
  color: #333;
}
</style>

```

Rating.vue

```jsx
<template>
  <div class="rating-container">
    <span v-for="star in 5" :key="star" class="star" @click="setStar(star)">
      {{ model >= star ? '★' : '☆' }}
    </span>
  </div>
</template>

<script setup>
const model = defineModel()

function setStar(newStar) {
  model.value = newStar
}
</script>

<style scoped>
.rating-container {
  display: flex;
  font-size: 24px;
  cursor: pointer;
}

.star {
  margin-right: 5px;
  color: gold;
}

.star:hover {
  color: orange;
}
</style>

```

在上面的例子中， 仍然是一个宏，并且这个宏是从 3.4 才开始支持的。

defineModel 没有破坏单向数据流的规则，因为它的底层仍然是使用的 Props 和 emits，编译器在进行编译的时候，会将 defineModel 这个宏展开为：

- 一个名为 modelValue 的 prop
- 一个名为 update:modelValue 的事件

如果你是 3.4 版本之前，那么得按照这种方式来使用：

```jsx
<script setup>
// 接收父组件传递下来的 Props
const props = defineProps(['modelValue'])
// 触发父组件的事件
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

由于 v-model 返回的是一个 ref 值，这个值可以再次和子组件的表单元素进行双向绑定：

```html
<input type="text" v-model="model" />
```

## 相关细节

1. defineModel支持简单的验证

```jsx
// 使 v-model 必填
const model = defineModel({ required: true })
// 提供一个默认值
const model = defineModel({ default: 0 })
// 指定类型
const model = defineModel({ type: String })
```

1. 父组件在使用子组件的时候，v-model 可以传递一个参数

父组件

```html
<!-- 传递给子组件的状态是 bookTitle，而这里的 title 相当于是给当前的 v-model 命名 -->
<MyComponent v-model:title="bookTitle" />
```

回头在子组件中：

```jsx
<!-- MyComponent.vue -->
<script setup>
// 接收名为 title 的 v-model 绑定值
const title = defineModel('title')
</script>

<template>
  <input type="text" v-model="title" />
</template>
```

当绑定多个 v-model 的时候，那么就需要命名了：

```html
<!-- 父组件传递多个 v-model绑定值，这个时候就需要命名了 -->
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
```

```jsx
<script setup>
// 子组件通过命名来指定要获取哪一个 v-model 绑定值
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
</script>

<template>
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
</template>
```

当使用了名字之后，验证就书写成第二个参数即可

```jsx
const title = defineModel('title', { required: true })
const count = defineModel("count", { type: Number, default: 0 })
```

1. 使用 v-model 和子组件进行通信的时候，也可以使用修饰符

父组件

```html
<MyComponent v-model.capitalize="myText" />
```

回头子组件通过解构的方式能够拿到修饰符

```jsx
<script setup>
const [model, modifiers] = defineModel()

console.log(modifiers) // { capitalize: true }
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

虽然拿到了修饰符，但是该修饰符没有任何功能，需要子组件这边自己来实现，实现了对应的功能之后，实际上对应的就是对子组件修改父组件数据时的一种限制。

```jsx
<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    // 如果父组件书写了 capitalize 修饰符
    // 那么子组件在修改状态的时候，会走 setter
    // 在 setter 中就可以对子组件所设置的值进行一个限制
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  }
})
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

这里我们以前面的星级评分为例：

```jsx
const [model, modifiers] = defineModel({
  required: true,
  // 这个就是一个 setter，回头子组件在修改值的时候，就会走这个 setter
  set(value) {
    console.log(value)
    if (modifiers.number) {
      if (isNaN(value)) {
        value = 0
      } else {
        value = Number(value)
      }
      if (value < 0) {
        value = 0
      } else if (value > 5) {
        value = 5
      }
      return value
    }
  }
})
```


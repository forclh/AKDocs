# 【Vue】TransitionGroup

TransitionGroup 仍然是 Vue 里面一个内置的组件。作用：用于解决**多个元素**的过渡问题。

## **案例演示**

下面的代码使用 Transition 为项目添加过渡效果，但是没有生效：

```html
<template>
    <div class="container">
        <div class="btns">
            <button @click="addItem">添加项目</button>
            <button @click="removeItem">移除项目</button>
        </div>
        <Transition name="fade">
            <ul>
                <li v-for="item in items" :key="item" class="box">
                    {{ item }}
                </li>
            </ul>
        </Transition>
    </div>
</template>

<script setup>
    import { ref } from "vue";

    const items = ref(["内容1", "内容2", "内容3"]);

    const addItem = () => {
        items.value.push(`内容${items.value.length + 1}`);
    };

    const removeItem = () => {
        items.value.pop();
    };
</script>

<style>
    .container {
        text-align: center;
    }
    .btns button {
        margin: 1em 0.5em;
    }
    .box {
        background-color: #42b983;
        color: white;
        margin: 5px auto;
        padding: 10px;
        width: 200px;
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 1s;
    }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>
```

问题 🙋 为什么过渡不生效？

答案：因为这里对项目的新增和移除都是针对的 li 元素，但是 Transition 下面是 ul，ul 是一直存在的。

并且 Transition 下面只能有一个根元素。如果存放多个根元素，会报错：Transition expects exactly one child element or component.

此时就可以使用 TransitionGroup 来解决这个问题。代码重构如下：

```html
<TransitionGroup name="fade" tag="ul">
    <li v-for="item in items" :key="item" class="box">{{ item }}</li>
</TransitionGroup>
```

## **相关细节**

TransitionGroup 可以看作是 Transition 的一个升级版，它支持和 Transition 基本相同的 props、CSS 过渡 class 和 JavaScript 钩子监听器，但有以下几点区别：

1. 默认情况下，它不会渲染一个容器元素。但可以通过传入 tag prop 来指定一个元素作为容器元素来渲染。
2. 过渡模式 mode 在这里**不可用**，因为不再是在互斥的元素之间进行切换。
3. 列表中的每个元素都必须有一个独一无二的 key attribute。
4. CSS 过渡 class **会被应用在列表内的元素上**，而不是容器元素上。

# **实战案例**

使用过渡效果优化待办事项的显示效果

```html
<template>
    <div class="contianer">
        <input
            type="text"
            placeholder="Add a new todo"
            class="todo-content"
            v-model="newTodo"
            @keypress.enter="addTodo"
        />
        <transition-group tag="ul" name="fade" class="todo-container">
            <li v-for="todo in todos" :key="todo.id" class="todo">
                <span>{{ todo.content }}</span>
                <button @click="deleteTodo(todo.id)">删除</button>
            </li>
        </transition-group>
    </div>
</template>

<script setup>
    import { ref } from "vue";

    const todos = ref([
        {
            id: randomId(),
            content: "Learn Vue.js",
            done: false,
        },
        {
            id: randomId(),
            content: "Learn Vite",
            done: false,
        },
    ]);

    const newTodo = ref("");
    function randomId() {
        // 生成随机的id值
        return Math.random().toString(36).substring(2, 9);
    }

    function deleteTodo(id) {
        todos.value = todos.value.filter((todo) => todo.id !== id);
    }

    function addTodo() {
        if (newTodo.value.trim() !== "") {
            todos.value.unshift({
                id: randomId(),
                content: newTodo.value,
                done: false,
            });
            newTodo.value = "";
        }
    }
</script>

<style scoped>
    .container {
        width: 600px;
        margin: 1em auto;
        padding: 1.5em;
        border-radius: 5px;
    }

    .shuffle {
        margin: 1em 0;
    }

    .todo-content {
        box-sizing: border-box;
        width: 100%;
        height: 50px;
        border-radius: 5px;
        outline: none;
        font-size: 1.3em;
        padding: 0 1em;
        border: 1px solid #ccc;
    }

    .todo-container {
        list-style: none;
        padding: 0;
        margin: 1em 0;
    }

    .todo {
        padding: 0.5em 0;
        border-bottom: 1px solid #ccc;
        display: flex;
        justify-content: space-between;
        margin-bottom: 1em;
    }

    /* 
xxx-enter-active 新元素进入的时候会添加这个类
xxx-enter-leave 离开的时候会添加这个类
xxx-move 其他元素涉及到移动的时候会添加这个类
*/

    .fade-enter-active,
    .fade-leave-active,
    .fade-move {
        transition: all 0.5s;
    }

    .fade-leave-to {
        opacity: 0;
        transform: translateX(100%);
    }
</style>
```

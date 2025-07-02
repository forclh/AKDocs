# setup 语法标签

setup 语法标签，是目前 Vue3 最推荐的写法。

不过这种写法并非一开始就是这样的，而是一步一步演进而来的。

## **Vue2 经典写法**

Vue2 时期采用的是 Options API 语法，这是一种经典写法。

TaskManager.vue

```jsx
export default {
    name: "TaskManager",
    props: {
        initialTasks: {
            type: Array,
            required: true,
            default: () => [],
        },
    },
    data() {
        return {
            tasks: [...this.initialTasks],
            newTaskTitle: "", // 新任务标题
        };
    },
    methods: {
        // 新增任务
        addTask() {
            if (this.newTaskTitle.trim() === "") {
                return;
            }
            // 添加新任务
            this.tasks.push({
                id: Date.now(),
                title: this.newTaskTitle,
                completed: false,
            });
            this.newTaskTitle = ""; // 清空输入框
        },
        // 标记任务已完成
        completeTask(id) {
            const task = this.tasks.find((task) => task.id === id);
            if (task) {
                task.completed = true;
                this.$emit("task-completed", task);
            }
        },
        // 标记任务未完成
        uncompleteTask(id) {
            const task = this.tasks.find((task) => task.id === id);
            if (task) {
                task.completed = false;
                this.$emit("task-uncompleted", task);
            }
        },
    },
};
```

## **Vue3 初期写法**

Vue3 时期，官方提出了 Composition API 风格，这种风格能够对组件的共有模块进行一个更好的组合复用。

```jsx
import { ref, toRefs } from "vue";
export default {
    name: "TaskManager",
    props: {
        initialTasks: {
            type: Array,
            required: true,
            default: () => [],
        },
    },
    emits: ["task-completed", "task-uncompleted"],
    setup(props, { emit }) {
        // setup是一个生命周期方法
        // 在该方法中书写数据以及函数
        const { initialTasks } = toRefs(props);
        const tasks = ref([...initialTasks.value]); // 任务列表
        const newTaskTitle = ref(""); // 存储新任务的标题

        // 添加任务
        const addTask = () => {
            if (newTaskTitle.value.trim() === "") {
                return;
            }
            tasks.value.push({
                id: Date.now(),
                title: newTaskTitle.value,
                completed: false,
            });
            newTaskTitle.value = "";
        };
        // 完成任务
        const completeTask = (taskId) => {
            const task = tasks.value.find((task) => task.id === taskId);
            if (task) {
                task.completed = true;
                // 触发自定义事件
                emit("task-completed", task);
            }
        };
        // 取消完成任务
        const uncompleteTask = (taskId) => {
            const task = tasks.value.find((task) => task.id === taskId);
            if (task) {
                task.completed = false;
                // 触发自定义事件
                emit("task-uncompleted", task);
            }
        };

        // 最后需要返回一个对象
        // 该对象里面就包含了需要在模板中使用的数据以及方法
        return {
            tasks,
            newTaskTitle,
            addTask,
            completeTask,
            uncompleteTask,
        };
    },
};
```

可以看出，早期的 Vue3 的 CompositionAPI 写法，实际上有 OptionsAPI 写法的影子，和 Vue2 的语法有一定的相似性，同样都是导出一个对象，最重要的特点是对象中多了一个 setup 函数。

这是一个新的生命周期钩子方法，在该方法中，我们可以定义对应的数据和方法，并且在最后返回出去，在模板中可以使用所返回的数据和方法。

## **defineComponent 写法**

defineComponent 是 Vue 3 中引入的一个**辅助函数**，主要用于定义 Vue 组件，特别是在使用 **TypeScript 时提供更好的类型推断和校验**。

通过使用 defineComponent，我们可以：

1. 自动推断类型：减少显式类型注解，使代码更简洁。
2. 减少冗余：不需要手动定义 Props 接口和响应式数据的类型。
3. 提高可读性：使代码更易读、更易维护。

```jsx
import { defineComponent, toRefs, ref } from "vue";
export default defineComponent({
    name: "TaskManager",
    props: {
        initialTasks: {
            type: Array,
            required: true,
            default: () => [],
        },
    },
    emits: ["task-completed", "task-uncompleted"],
    setup(props, { emit }) {
        // setup是一个生命周期方法
        // 在该方法中书写数据以及函数
        const { initialTasks } = toRefs(props);
        const tasks = ref([...initialTasks.value]); // 任务列表
        const newTaskTitle = ref(""); // 存储新任务的标题

        // 添加任务
        const addTask = () => {
            if (newTaskTitle.value.trim() === "") {
                return;
            }
            tasks.value.push({
                id: Date.now(),
                title: newTaskTitle.value,
                completed: false,
            });
            newTaskTitle.value = "";
        };
        // 完成任务
        const completeTask = (taskId) => {
            const task = tasks.value.find((task) => task.id === taskId);
            if (task) {
                task.completed = true;
                // 触发自定义事件
                emit("task-completed", task);
            }
        };
        // 取消完成任务
        const uncompleteTask = (taskId) => {
            const task = tasks.value.find((task) => task.id === taskId);
            if (task) {
                task.completed = false;
                // 触发自定义事件
                emit("task-uncompleted", task);
            }
        };

        // 最后需要返回一个对象
        // 该对象里面就包含了需要在模板中使用的数据以及方法
        return {
            tasks,
            newTaskTitle,
            addTask,
            completeTask,
            uncompleteTask,
        };
    },
});
```

可以看出，defineComponent 仅仅只是一个辅助方法，和 TS 配合得更好。但是并没有从本质上改变初期 Composition API 的写法。

## **setup 标签写法**

从 Vue3.2 版本开始正式引入了 setup 语法糖，它**简化了使用 Composition API 时的书写方式**，使得组件定义更加简洁和直观。

其优化的点主要如下：

1. 简化书写：在传统的 setup 函数中，我们需要返回一个对象，其中包含需要在模板中使用的变量和方法。在 `<script setup>` 中，这一步被省略了，所有定义的变量和方法会自动暴露给模板使用，从而减少了样板代码。
2. 更好的类型推断：在 `<script setup>` 中所有定义的内容都是顶层变量，TypeScript 的类型推断更加直观和简单。

```jsx
import { ref, toRefs } from "vue";

const props = defineProps({
    initialTasks: {
        type: Array,
        required: true,
    },
});
const emit = defineEmits(["task-completed", "task-uncompleted"]);

const { initialTasks } = toRefs(props);
const tasks = ref([...initialTasks.value]); // 任务列表
const newTaskTitle = ref(""); // 存储新任务的标题
// 添加任务
const addTask = () => {
    if (newTaskTitle.value.trim() === "") {
        return;
    }
    tasks.value.push({
        id: Date.now(),
        title: newTaskTitle.value,
        completed: false,
    });
    newTaskTitle.value = "";
};
// 完成任务
const completeTask = (taskId) => {
    const task = tasks.value.find((task) => task.id === taskId);
    if (task) {
        task.completed = true;
        // 触发自定义事件
        emit("task-completed", task);
    }
};
// 取消完成任务
const uncompleteTask = (taskId) => {
    const task = tasks.value.find((task) => task.id === taskId);
    if (task) {
        task.completed = false;
        // 触发自定义事件
        emit("task-uncompleted", task);
    }
};
```

在 setup 语法糖中，没有了模板语法，定义的数据以及方法能够直接在模板中使用。

另外通过 defineProps 获取到父组件传递过来的 props，通过 defineEmits 来触发父组件的事件。

究竟什么是宏呢？宏这个概念最初是在 C 语言里面引入的，大家知道，C 语言是编译型语言，在开始编译之前，会对**宏代码进行一个文本替换的操作**，这就被称之为**预处理**。

举个例子，在 C 语言中通过 #define 来定义宏：

```c
#define PI 3.14159
#define SQUARE(x) ((x) * (x))

int main() {
    double area = PI * SQUARE(5);
    return 0;
}
```

在编译开始之前，会将 PI 替换为 3.14159，将 SQUARE(5) 替换为 ((5) \* (5))

理解了这个，回头再看 defineProps 以及 defineEmits，你就非常好理解了，这两个部分的代码回头会被替换掉，替换成 Vue3 刚出来时的写法。

```jsx
export default {
    // ...
    props: {
        initialTasks: {
            type: Array,
            required: true,
            default: () => [],
        },
    },
    emits: ["task-completed", "task-uncompleted"],
    // ...
};
```

这一点可以从 vite-plugin-inspect 插件的编译分析中得到验证。

从插件的编译分析中，我们可以看出，setup 标签写法其实就是一个语法糖，方便开发者书写，在编译的时候最终会被编译为 CompositionAPI 早期的写法。

**expose 上的区别**

**setup 虽然说是一种语法糖，不过在某些行为上的表现还是和原始的 Composition API 有一些区别的**，例如 expose.

这里需要先解释一下什么是 expose：

> 一般来讲，父组件管理父组件的数据和方法，子组件管理子组件的数据和方法，如果涉及到通信，那么通过 props 的方式来进行传递。但如果一个组件通过 ref 获取到组件实例，在早期的 Composition API 中，能够拿到组件内部所有数据和方法的。

Vue 提供了一个名为 expose 的方法，由组件自己来决定，如果外部拿到我这个组件实例（ref），我能暴露哪些成员给对方。

```jsx
export default {
    setup(props, { emit, expose }) {
        expose({
            // 要暴露的成员
        });
    },
};
```

而到了 setup 标签写法中，则**默认行为就是不向外部暴露任何的成**员。如果想要暴露某个成员，仍然是通过 expose 的方式，这里会涉及到一个 defineExpose 的宏。

```jsx
defineExpose({
    // 要暴露的成员
});
```

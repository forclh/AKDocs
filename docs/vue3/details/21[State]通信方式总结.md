# 【State】通信方式总结

通信方式整体来讲能够分为两大类：

1. 父子组件通信
2. 跨层级组件通信

**父子组件通信**

1. Props：通过 Props 可以实现父组件向子组件传递数据。
2. Event：又被称之为自定义事件，原理是父组件通过 Props 向子组件传递一个自定义事件，子组件通过 emit 来触发自定义事件，触发自定义事件的时候就会传递一些数据给父组件
3. 属性透传：一些没有被组件声明为 props、emits 或自定义事件的属性，但依然能传递给子组件，例如常见的 class、style 和 id.
4. ref 引用：ref 除了创建响应式数据以外，还可以拿来作为引用。
5. 作用域插槽：子组件在设置 slot 的时候，上面绑定一些属性，回头父组件通过 v-slot 来拿到这些属性。

    ![](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-04-16-075301.png)

**跨层级组件通信**

1. 依赖注入：通过 provide（提供数据方）和 inject（注入数据方）来实现的。
2. 事件总线：从 Vue2 时期就支持的一种通信方式。从 Vue3 开始更加推荐 **依赖注入** 或者 **Pinia** 来进行组件通信。不过事件总线这种方式仍然保留了下来。

    - 原理：本质上是设计模式里面的观察者模式，有一个对象（事件总线）维护一组依赖于它的对象（事件监听器），当自身状态发生变化的时候会通过所有的事件监听器。
    - 核心操作：
        1. 发布事件：发布通知，通知所有的依赖自己去执行监听器方法
        2. 订阅事件：其他对象可以订阅某个事件，当事件发生时，就会触发相应的回调函数
        3. 取消订阅
    - 事件总线的核心代码如下：

        ```jsx
        class EventBus {
            constructor() {
                // 维护一个事件列表
                this.events = {};
            }

            /**
             * 订阅事件
             * @param {*} event 你要订阅哪个事件
             * @param {*} listener 对应的回调函数
             */
            on(event, listener) {
                if (!this.events[event]) {
                    // 说明当前没有这个类型
                    this.events[event] = [];
                }
                this.events[event].push(listener);
            }

            /**
             * 发布事件
             * @param {*} event 什么类型
             * @param {*} data 传递给回调函数的数据
             */
            emit(event, data) {
                if (this.events[event]) {
                    // 首先有这个类型
                    // 通知这个类型下面的所有的订阅者（listener）执行一遍
                    this.events[event].forEach((listener) => {
                        listener(data);
                    });
                }
            }

            /**
             * 取消订阅
             * @param {*} event 对应的事件类型
             * @param {*} listener 要取消的回调函数
             */
            off(event, listener) {
                if (this.events[event]) {
                    // 说明有这个类型
                    this.events[event] = this.events[event].filter((item) => {
                        return item !== listener;
                    });
                }
            }
        }

        const eventBus = new EventBus();
        export default eventBus;
        ```

    - 除了像上面一样自己来实现事件总线以外，还可以使用现成的第三方库 mitt.
        ```jsx
        import mitt from "mitt";
        const eventBus = mitt();
        export default eventBus;
        ```

3. 自定义数据仓库：其实就是简易版的 Pinia.

```jsx
// store.js
import { reactive } from "vue";

// 通过 reactive 创建一个响应式对象
// 作为我们自定义的数据仓库
// 回头只要有组件用到这个数据仓库的数据
// 数据仓库数据发生变化，对应的组件会自动更新
export const store = reactive({
    todos: [
        {
            id: 1,
            text: "学习Vue3",
            completed: false,
        },
        {
            id: 2,
            text: "学习React",
            completed: false,
        },
        {
            id: 3,
            text: "学习Angular",
            completed: false,
        },
    ],
    addTodo(todo) {
        this.todos.push(todo);
    },
    // 切换todo的状态
    toggleTodo(id) {
        const todo = this.todos.find((todo) => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
        }
    },
});
```

1. Pinia

# computed

> 面试题：computed 和 methods 有什么区别

**标准而浅显的回答**

> 1. 在使用时，computed 当做属性使用，而 methods 则当做方法调用
> 2. computed 可以具有 getter 和 setter，因此可以赋值，而 methods 不行
> 3. computed 无法接收多个参数，而 methods 可以
> 4. **computed 具有缓存，而 methods 没有**

**更接近底层原理的回答**

> vue 对 methods 的处理比较简单，只需要遍历**methods 配置中的每个属性，将其对应的函数使用 bind 绑定当前组件实例后复制其引用到组件实例中即可**
>
> 而 vue 对 computed 的处理会稍微复杂一些。
>
> 当组件实例触发**生命周期函数`beforeCreate`后**，它会做一系列事情，其中就包括对 computed 的处理
>
> 它会遍历 computed 配置中的所有属性，为**每一个属性创建一个 Watcher 对象，并传入一个函数，该函数的本质其实就是 computed 配置中的 getter**，这样一来，getter 运行过程中就会收集依赖
>
> 但是和**渲染函数不同**，为计算属性创建的**Watcher 不会立即执行**，因为要考虑到该计算属性是否会被渲染函数（模板是否使用）使用，如果没有使用，就不会得到执行。因此，在创建 Watcher 的时候，它**使用了 lazy 配置**，lazy 配置可以让 Watcher 不会立即执行。
>
> 收到`lazy`的影响，Watcher 内部会**保存两个关键属性来实现缓存，一个是`value`，一个是`dirty`**
>
> `value`属性用于保存 Watcher 运行的结果，受`lazy`的影响，该值在最开始是`undefined`
>
> **`dirty`属性用于指示当前的`value`是否已经过时了，即是否为脏值**，受`lazy`的影响，**该值在最开始是`true`**
>
> Watcher 创建好后，**vue 会使用代理模式`Object.defineProperty(vm, 'xxx', get(){// 运行watcher})`，将计算属性挂载到组件实例**中
>
> 当**读取计算属性（模板）**时，**vue 检查其对应的 Watcher 中的 dirty 是否是脏值，如果是，则运行函数（getter），收集依赖（dep），并得到对应的值，保存在 Watcher 的 value 中，然后设置 dirty 为 false**，然后返回。
>
> 如果 dirty 为 false，则直接返回 watcher 的 value
>
> 巧妙的是，在依赖收集时，**被依赖的数据不仅会收集到计算属性的 Watcher，还会收集到组件的 Watcher**
>
> 当计算属性的依赖变化时，会先触发计算属性的 Watcher 执行，此时，它只需设置`dirty`为 true 即可，不做任何处理。
>
> 由于依赖同时会收集到组件的 Watcher，因此**组件会重新渲染，而重新渲染时又读取到了计算属性**，由于计算属性目前已为 dirty，因此会重新运行 getter 进行运算
>
> 而对于计算属性的 setter，则极其简单，当**设置计算属性 `Object.defineProperty`**时，直接运行 setter 即可

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        <div id="app">
            <h1 v-if="showName">{{fullName}}</h1>
            <button @click="firstName='abc', showName = !showName">
                toggle
            </button>
        </div>
        <script src="./vue.js"></script>
        <script>
            var vm = new Vue({
                el: "#app",
                data: {
                    firstName: "Aiden",
                    lastName: "Kao",
                    showName: true,
                },
                computed: {
                    fullName: {
                        get() {
                            console.log("getter");
                            return this.firstName + this.lastName;
                        },
                        set(val) {
                            var parts = val.split(" ");
                            this.firstName = parts[0];
                            this.lastName = parts[1];
                        },
                    },
                },
                methods: {
                    a() {},
                    b(...args) {},
                },
            });
            console.log(vm);
        </script>
    </body>
</html>
```

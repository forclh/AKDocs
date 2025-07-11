# diff

> 面试题：请阐述 vue 的 diff 算法
>
> 参考回答：
>
> 当组件创建和更新时，vue 均会执行内部的 update 函数，该函数使用 render 函数生成的虚拟 dom 树，将新旧两树进行对比，找到差异点，最终更新到真实 dom
>
> 对比差异的过程叫 diff，vue 在内部通过一个叫 patch 的函数完成该过程
>
> 在对比时，vue 采用深度优先、同层比较的方式进行比对。
>
> 在判断**两个节点是否相同时，vue 是通过虚拟节点的 key 和 tag 来进行判断**的
>
> 具体来说，首先对根节点进行对比，如果相同则将**旧节点关联的真实 dom 的引用挂到新节点**上，然后**根据需要更新属性到真实 dom，然后再对比其子节点数组**；如果不相同，则**按照新节点的信息递归创建所有真实 dom，同时挂到对应虚拟节点上**，然后移除掉旧的 dom。
>
> 在对比其子节点数组时，**vue 对每个子节点数组使用了两个指针，分别指向头尾，然后不断向中间靠拢来进行对比，这样做的目的是尽量复用真实 dom**，尽量少的销毁和创建真实 dom。如果发现相同，则进入和根节点一样的对比流程，如果发现不同，则移动真实 dom 到合适的位置。
>
> 这样一直递归的遍历下去，直到整棵树完成对比。

## `diff`的时机

当**组件创建时，以及依赖的属性或数据变化时，会运行一个函数**，该函数会做两件事：

-   运行`_render`生成一棵新的虚拟 dom 树（vnode tree），返回虚拟 DOM 树根节点
-   运行`_update`，**传入虚拟 dom 树的根节点**，对新旧两棵树进行对比，最终**完成对真实 dom 的更新**

    核心代码如下：

```jsx
// vue构造函数
function Vue() {
    // ... 其他代码
    var updateComponent = () => {
        this._update(this._render());
    };
    new Watcher(updateComponent);
    // ... 其他代码
}
```

`diff`就发生在`_update`函数的运行过程中

## `_update`函数在干什么

`_update`函数接收到一个`vnode`参数，这就是**新**生成的虚拟 dom 树

同时，`_update`函数通过当前组件的`_vnode`属性，拿到**旧**的虚拟 dom 树

`_update`函数首先会**给组件的`_vnode`属性重新赋值，让它指向新树**

![](http://mdrs.yuanjin.tech/img/20210301193804.png)

然后会判断旧树是否存在：

不存在：说明这是**第一次加载组件，于是通过内部的`patch`函数，直接遍历新树，为每个节点生成真实 DOM，挂载到每个节点的`elm`属性上**

![](http://mdrs.yuanjin.tech/img/20210301194237.png)

存在：说明之前已经渲染过该组件，于是通过内部的`patch`函数，对新旧两棵树进行对比，以达到下面两个目标： - 完成**对所有真实 dom 的最小化处理** - 让**新树的节点对应合适的真实 dom**

![](http://mdrs.yuanjin.tech/img/20210301195003.png)

## `patch`函数的对比流程

**术语解释**：

1. 「**相同**」：是指**两个虚拟节点的标签类型、`key`值均相同**，但`input`元素还要看`type`属性
2. 「**新建元素**」：是指根据一个虚拟节点提供的信息，创建一个真实 dom 元素，同时挂载到虚拟节点的`elm`属性上
3. 「**销毁元素**」：是指：`vnode.elm.remove()`
4. 「**更新**」：是指对两个虚拟节点进行对比更新，它**仅发生**在两个虚拟节点「相同」的情况下。具体过程稍后描述。
5. 「**对比子节点**」：是指对两个虚拟节点的子节点进行对比，具体过程稍后描述

**详细流程：**

1. **根节点比较**

![](http://mdrs.yuanjin.tech/img/20210301203350.png)

`patch`函数首先对根节点进行比较

如果两个节点：

-   「相同」，进入「更新」流程
    1.  将旧节点的真实 dom 赋值到新节点：`newVnode.elm = oldVnode.elm`
    2.  对比**新节点和旧节点的属性，有变化的更新到真实 dom 中**
    3.  当前两个节点处理完毕，开始**「对比子节点」**
-   不「相同」
    1.  新节点**递归**「新建元素」
    2.  旧节点「销毁元素」
    3.  **「对比子节点」**

在「对比子节点」时，vue 一切的出发点，都是为了：

-   尽量啥也别做
-   不行的话，尽量仅改动元素属性
-   还不行的话，尽量移动元素，而不是删除和创建元素
-   还不行的话，删除和创建元素

## 示例

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
            <ul>
                <li v-for="n in numbers" :key="n">{{n}}</li>
            </ul>
            <button @click="numbers.reverse()">翻转数组</button>
            <button @click="numbers.unshift(100)">头部插入</button>
        </div>
        <script src="./vue.js"></script>
        <script>
            new Vue({
                el: "#app",
                data: {
                    numbers: [1, 2, 3, 4, 5],
                },
            });
        </script>
    </body>
</html>
```

如果不增加 key 值，那么新旧的虚拟 DOM 树在 diff 的时候会认为两者的 li 元素相同，则会大量更改真实 DOM（包括子元素），增加 key 值，则会进行真实 DOM 的移动，对真实 DOM 的修改大大减少

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
        <div id="app" style="width: 500px; margin: 0 auto; line-height: 3">
            <div>
                <a href="" @click.prevent="accoutLogin=true">账号登录</a>
                <span>|</span>
                <a href="" @click.prevent="accoutLogin=false">手机号登录</a>
            </div>
            <div v-if="accoutLogin" key="1">
                <label>账号</label>
                <input type="text" />
            </div>
            <div v-else key="2">
                <label>手机号</label>
                <input type="text" />
            </div>
        </div>
        <script src="./vue.js"></script>
        <script>
            new Vue({
                el: "#app",
                data: {
                    accoutLogin: true,
                },
            });
        </script>
    </body>
</html>
```

如果不增加 key 值，那么新旧的虚拟 DOM 树在 diff 的时候会复用 input 表单元素，所以切换的时候 input 元素内容会被保留。

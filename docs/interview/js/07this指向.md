# ✨ this 指向

## 经典真题

-   _this_ 的指向哪几种 ？

## _this_ 指向总结

_this_ 关键字是一个非常重要的语法点。毫不夸张地说，不理解它的含义，大部分开发任务都无法完成。

_this_ 可以用在构造函数之中，表示实例对象。除此之外，_this_ 还可以用在别的场合。**但不管是什么场合，_this_ 都有一个共同点：它总是返回一个对象**。

关于 _this_ 的指向，有一种广为流传的说法就是“谁调用它，_this_ 就指向谁”。

这样的说法没有太大的问题，但是并不是太全面。总结起来，_this_ 的指向规律有如下几条：

-   在函数体中，非显式或隐式地简单调用函数时，在严格模式下，函数内的 _this_ 会被绑定到 _undefined_ 上，在非严格模式下则会被绑定到全局对象 _window/global_ 上。
-   一般使用 _new_ 方法调用构造函数时，构造函数内的 _this_ 会被绑定到新创建的对象上。
-   一般通过 _call/apply/bind_ 方法显式调用函数时，函数体内的 _this_ 会被绑定到指定参数的对象上。
-   一般通过上下文对象调用函数时，函数体内的 _this_ 会被绑定到该对象上。
-   在箭头函数中，_this_ 的指向是由外层（函数或全局）作用域来决定的。

当然，真实环境多种多样，下面我们就来根据实战例题逐一梳理。

---

> JS 的 this 指向取决于环境。
>
> 全局环境中的`this`，直接指向全局对象。
>
> 函数环境中的`this`，取决于函数如何被调用：
>
> 1. 如果函数是直接调用的，同时又是出于严格模式下，则指向`undefined`，如果不是严格模式，则指向全局对象
> 2. 如果函数是通过一个对象调用的，则指向对象本身
> 3. 如果函数是通过一些特殊方法调用的，比如`call`、`apply`、`bind`，通过这些方法调用的话，则指向指定的对象
> 4. 如果函数是通过`new`调用的，则指向新的实例。
>    另外，箭头函数由于没有`this`，所以箭头函数内部的`this`由其外部作用域决定。

---

### 全局环境中的 _this_

例题 _1_：

```js
function f1() {
    console.log(this);
}

function f2() {
    "use strict";
    console.log(this);
}

f1(); // window or global
f2(); // undefined
```

这种情况相对简单、直接，函数在浏览器全局环境下被简单调用，在非严格模式下 _this_ 指向 _window_，在通过 _use strict_ 指明严格模式的情况下指向 _undefined_。

虽然上面的题目比较基础，但是需要注意上面题目的变种，例如

例题 _2_：

```js
const foo = {
    bar: 10,
    fn: function () {
        console.log(this); // window or global
        console.log(this.bar); // undefined
    },
};
var fn1 = foo.fn;
fn1();
```

这里的 _this_ 仍然指向 _window_。虽然 _fn_ 函数在 _foo_ 对象中作为该对象的一个方法，但是在赋值给 _fn1_ 之后，_fn1_ 仍然是在 _window_ 的全局环境下执行的。因此上面的代码仍然会输出 _window_ 和 _undefined_。

还是上面这道题目，如果改成如下的形式

例题 _3_：

```js
const foo = {
    bar: 10,
    fn: function () {
        console.log(this); // { bar: 10, fn: [Function: fn] }
        console.log(this.bar); // 10
    },
};
foo.fn();
```

这时，_this_ 指向的是最后调用它的对象，在 _foo.fn( )_ 语句中，this 指向的是 _foo_ 对象。

### 上下文对象调用中的 _this_

例题 _4_：

```js
const student = {
    name: "zhangsan",
    fn: function () {
        return this;
    },
};
console.log(student.fn() === student); // true
```

在上面的代码中，_this_ 指向当前的对象 _student_，所以最终会返回 _true_。

当存在更复杂的调用关系时，如以下代码中的嵌套关系，_this_ 将指向**最后调用它的对象**，例如

例题 _5_：

```js
const student = {
    name: "zhangsan",
    son: {
        name: "zhangxiaosan",
        fn: function () {
            return this.name;
        },
    },
};
console.log(student.son.fn()); // zhangxiaosan
```

在上面的代码中，_this_ 会指向最后调用它的对象，因此输出的是 _zhangxiaosan_。

至此，_this_ 的上下文对象调用已经介绍得比较清楚了。我们再来看一道比较高阶的题目

例题 _6_：

```js
const o1 = {
    text: "o1",
    fn: function () {
        return this.text;
    },
};

const o2 = {
    text: "o2",
    fn: function () {
        return o1.fn();
    },
};

const o3 = {
    text: "o3",
    fn: function () {
        var fn = o1.fn;
        return fn();
    },
};

console.log(o1.fn()); // o1
console.log(o2.fn()); // o1
console.log(o3.fn()); // undefined
```

答案是 _o1、o1、undefined_。

这里主要讲一下为什么第三个是 _undefined_。这里将 _o1.fn_ 赋值给了 _fn_，所以 _fn_ 等价于 _function () { return this.text; }_，然后该函数在调用的时候，是直接 _fn( )_ 的形式调用的，并不是以对象的形式，相当于还是全局调用，指向 _window_，所以打印出 _undefined_。

### _this_ 指向绑定事件的元素

_DOM_ 元素绑定事件时，事件处理函数里面的 _this_ 指向**绑定了事件的元素**。

这个地方一定要注意它和 _target_ 的区别，_target_ 是指向**触发事件的元素**。

示例如下：

```html
<ul id="color-list">
    <li>red</li>
    <li>yellow</li>
    <li>blue</li>
    <li>green</li>
    <li>black</li>
    <li>white</li>
</ul>
```

```js
// this 是绑定事件的元素
// target 是触发事件的元素 和 srcElememnt 等价
let colorList = document.getElementById("color-list");
colorList.addEventListener("click", function (event) {
    console.log("this:", this);
    console.log("target:", event.target);
    console.log("srcElement:", event.srcElement);
});
```

当我点击如下位置时打印出来的信息如下：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-09-28-033304.png" alt="image-20210928113303839" style="zoom:50%;" />

有些时候我们会遇到一些困扰，比如在 _div_ 节点的事件函数内部，有一个局部的 _callback_ 方法，该方法被作为普通函数调用时，_callback_ 内部的 _this_ 是指向全局对象 _window_ 的

例如：

```html
<div id="div1">我是一个div</div>
```

```js
window.id = "window";
document.getElementById("div1").onclick = function () {
    console.log(this.id); // div1
    const callback = function () {
        console.log(this.id); // 因为是普通函数调用，所以 this 指向 window
    };
    callback();
};
```

此时有一种简单的解决方案，可以用一个变量保存 _div_ 节点的引用，如下：

```js
window.id = "window";
document.getElementById("div1").onclick = function () {
    console.log(this.id); // div1
    const that = this; // 保存当前 this 的指向
    const callback = function () {
        console.log(that.id); // div1
    };
    callback();
};
```

### 改变 _this_ 指向

#### 1. _call、apply、bind_ 方法修改 _this_ 指向

由于 _JavaScript_ 中 _this_ 的指向受函数运行环境的影响，指向经常改变，使得开发变得困难和模糊，所以在封装 _sdk_ 或者写一些复杂函数的时候经常会用到 _this_ 指向绑定，以避免出现不必要的问题。

_call、apply、bind_ 基本都能实现这一功能，起到确定 _this_ 指向的作用

**_Function.prototype.call( )_**

_call_ 方法可以指定 _this_ 的指向（即函数执行时所在的的作用域），然后再指定的作用域中，执行函数。

```js
var obj = {};
var f = function () {
    return this;
};
console.log(f() === window); // this 指向 window
console.log(f.call(obj) === obj); // 改变this 指向 obj
```

上面代码中，全局环境运行函数 _f_ 时，_this_ 指向全局环境（浏览器为 _window_ 对象）；

_call_ 方法可以改变 _this_ 的指向，指定 _this_ 指向对象 _obj_，然后在对象 _obj_ 的作用域中运行函数 _f_。

**_call_ 方法的参数，应该是对象 _obj_**，如果参数为空或 _null、undefind_，则**默认传参全局对象**。

```js
var n = 123;
var obj = { n: 456 };

function a() {
    console.log(this.n);
}

a.call(); // 123
a.call(null); // 123
a.call(undefined); // 123
a.call(window); // 123
a.call(obj); // 456
```

上面代码中，_a_ 函数中的 _this_ 关键字，如果指向全局对象，返回结果为 _123_。

如果使用 _call_ 方法将 _this_ 关键字指向 _obj_ 对象，返回结果为 _456_。可以看到，如果 _call_ 方法没有参数，或者参数为 _null_ 或 _undefined_，则等同于指向全局对象。

**如果 _call_ 传参不是以上类型，则转化成对应的包装对象，然后传入方法**。

例如，_5_ 转成 _Number_ 实例，绑定 _f_ 内部 _this_

```js
var f = function () {
    return this;
};

f.call(5); // Number {[[PrimitiveValue]]: 5}
```

_call_ 可以接受多个参数，第一个参数是 _this_ 指向的对象，之后的是**函数回调所需的参数**。

```js
function add(a, b) {
    return a + b;
}

add.call(this, 1, 2); // 3
```

_call_ 方法的一个应用是**调用对象的原生方法**。

```js
var obj = {};
obj.hasOwnProperty("toString"); // false

// 覆盖掉继承的 hasOwnProperty 方法
obj.hasOwnProperty = function () {
    return true;
};
obj.hasOwnProperty("toString"); // true

Object.prototype.hasOwnProperty.call(obj, "toString"); // false
```

上面代码中 _hasOwnProperty_ 是 _obj_ 继承来的方法，用来判断对象是否包含自身特点（非继承）属性，但是 _hasOwnProperty_ 并不是保留字，如果被对象覆盖，会造成结果错误。

_call_ 方法可以解决这个问题，它将 _hasOwnProperty_ 方法的原始定义放到 _obj_ 对象上执行，这样无论 _obj_ 上有没有同名方法，都不会影响结果。

**_Function.prototype.apply( )_**

_apply_ 和 _call_ 作用类似，也是改变 _this_ 指向，然后调用该函数，唯一区别是 _apply_ 接收**数组作为函数执行时的参数**。语法如下：

```js
func.apply(thisValue, [arg1, arg2, ...])
```

_apply_ 方法的第一个参数也是 _this_ 所要指向的那个对象，如果设为 _null_ 或 _undefined_，则等同于指定全局对象。

第二个参数则是一个数组，该数组的所有成员依次作为参数，传入原函数。

**原函数的参数，在 _call_ 方法中必须一个个添加，但是在 _apply_ 方法中，必须以数组形式添加。**

```js
function f(x, y) {
    console.log(x + y);
}

f.call(null, 1, 1); // 2
f.apply(null, [1, 1]); // 2
```

利用这一特性，可以实现很多小功能。比如，输出数组的最大值：

```js
var a = [24, 30, 2, 33, 1];
Math.max.apply(null, a); //33
```

还可以将数组中的空值，转化成 _undefined_。

通过 _apply_ 方法，利用 _Array_ 构造函数将数组的空元素变成 _undefined_。

```js
var a = ["a", , "b"];
Array.apply(null, a); //['a',undefind,'b']
```

空元素与 _undefined_ 的差别在于，数组的 _forEach_ 方法会跳过空元素，但是不会跳过 _undefined_。因此，遍历内部元素的时候，会得到不同的结果。

```js
var a = ["a", , "b"];

function print(i) {
    console.log(i);
}

a.forEach(print);
// a
// b

Array.apply(null, a).forEach(print);
// a
// undefined
// b
```

配合数组对象的 _slice_ 方法，可以将一个类似数组的对象（类数组对象是指具有 `length` 属性，并且可以通过数字索引访问其元素的对象，比如 _arguments_ 对象）转为真正的数组。

```js
Array.prototype.slice.apply({ 0: 1, length: 1 }); // [1]
Array.prototype.slice.apply({ 0: 1 }); // []
Array.prototype.slice.apply({ 0: 1, length: 2 }); // [1, undefined]
Array.prototype.slice.apply({ length: 1 }); // [undefined]
```

上面代码的 _apply_ 方法的参数都是对象，但是返回结果都是数组，这就起到了将对象转成数组的目的。

从上面代码可以看到，这个方法起作用的前提是，被处理的对象必须有 _length_ 属性，以及相对应的数字键。

**_Function.prototype.bind( )_**

_bind_ 用于将函数体内的 _this_ 绑定到某个对象，然后**返回一个新函数**

```js
var d = new Date();
d.getTime(); // 1481869925657

var print = d.getTime;
print(); // Uncaught TypeError: this is not a Date object.
```

报错是因为 _d.getTime_ 赋值给 _print_ 后，_getTime_ 内部的 _this_ 指向方式变化，已经不再指向 _date_ 对象实例了。

解决方法：

```js
var print = d.getTime.bind(d);
print(); // 1481869925657
```

_bind_ 接收的参数就是所要绑定的对象

```js
var counter = {
    count: 0,
    inc: function () {
        this.count++;
    },
};

var func = counter.inc.bind(counter);
func();
counter.count; // 1
```

绑定到其他对象

```js
var counter = {
    count: 0,
    inc: function () {
        this.count++;
    },
};

var obj = {
    count: 100,
};
var func = counter.inc.bind(obj);
func();
obj.count; // 101
```

_bind_ 还可以接收更多的参数，将**这些参数绑定到原函数的参数**

```js
var add = function (x, y) {
    return x * this.m + y * this.n;
};

var obj = {
    m: 2,
    n: 2,
};

var newAdd = add.bind(obj, 5);
newAdd(5); // 20
```

上面代码中，_bind_ 方法除了绑定 _this_ 对象，还将 _add_ 函数的第一个参数 _x_ 绑定成 _5_，然后返回一个新函数 _newAdd_，这个函数只要再接受一个参数 _y_ 就能运行了。

如果 _bind_ 方法的第一个参数是 _null_ 或 _undefined_，等于将 _this_ 绑定到全局对象，函数运行时 _this_ 指向顶层对象（浏览器为 _window_）。

```js
function add(x, y) {
    return x + y;
}

var plus5 = add.bind(null, 5);
plus5(10); // 15
```

上面代码中，函数 _add_ 内部并没有 _this_，使用 _bind_ 方法的主要目的是绑定参数 _x_，以后每次运行新函数 _plus5_，就只需要提供另一个参数 _y_ 就够了。

而且因为 _add_ 内部没有 _this_，所以 _bind_ 的第一个参数是 _null_，不过这里如果是其他对象，也没有影响。

_bind_ 方法有一些使用注意点。

（1）每一次返回一个新函数

**_bind_ 方法每运行一次，就返回一个新函数**，这会产生一些问题。比如，监听事件的时候，不能写成下面这样。

```
element.addEventListener('click', o.m.bind(o));
```

上面代码中，_click_ 事件绑定 _bind_ 方法生成的一个匿名函数。这样会导致无法取消绑定，所以，下面的代码是无效的。

```js
element.removeEventListener("click", o.m.bind(o));
```

正确的方法是写成下面这样：

```js
var listener = o.m.bind(o);
element.addEventListener("click", listener);
//  ...
element.removeEventListener("click", listener);
```

（2）结合回调函数使用

回调函数是 _JavaScript_ 最常用的模式之一，但是一个常见的错误是，将包含 _this_ 的方法直接当作回调函数。解决方法就是使用 _bind_ 方法，将 _counter.inc_ 绑定 _counter_。

```js
var counter = {
    count: 0,
    inc: function () {
        "use strict";
        this.count++;
    },
};

function callIt(callback) {
    callback();
}

callIt(counter.inc.bind(counter));
counter.count; // 1
```

上面代码中，_callIt_ 方法会调用回调函数。这时如果直接把 _counter.inc_ 传入，调用时 _counter.inc_ 内部的 _this_ 就会指向全局对象。使用 _bind_ 方法将 _counter.inc_ 绑定 _counter_ 以后，就不会有这个问题，_this_ 总是指向 _counter_。

还有一种情况比较隐蔽，就是某些数组方法可以接受一个函数当作参数。这些函数内部的 _this_ 指向，很可能也会出错。

```js
var obj = {
    name: "张三",
    times: [1, 2, 3],
    print: function () {
        this.times.forEach(function (n) {
            console.log(this.name);
        });
    },
};

obj.print();
// 没有任何输出
```

上面代码中，_obj.print_ 内部 _this.times_ 的 _this_ 是指向 _obj_ 的，这个没有问题。

但是，_forEach_ 方法的回调函数内部的 _this.name_ 却是指向全局对象，导致没有办法取到值。稍微改动一下，就可以看得更清楚。

```js
obj.print = function () {
    this.times.forEach(function (n) {
        console.log(this === window);
    });
};

obj.print();
// true
// true
// true
```

解决这个问题，也是通过 _bind_ 方法绑定 _this_。

```js
obj.print = function () {
    this.times.forEach(
        function (n) {
            console.log(this.name);
        }.bind(this)
    );
};

obj.print();
// 张三
// 张三
// 张三
```

（3）结合 _call_ 方法使用

利用 _bind_ 方法，可以改写一些 _JavaScript_ 原生方法的使用形式，以数组的 _slice_ 方法为例。

```js
[1, 2, 3].slice(0, 1); // [1]
// 等同于
Array.prototype.slice.call([1, 2, 3], 0, 1); // [1]
```

上面的代码中，数组的 _slice_ 方法从 _[1, 2, 3]_ 里面，按照指定位置和长度切分出另一个数组。这样做的本质是在 _[1, 2, 3]_ 上面调用 _Array.prototype.slice_ 方法，因此可以用 _call_ 方法表达这个过程，得到同样的结果。

_call_ 方法实质上是调用 _Function.prototype.call_ 方法，因此上面的表达式可以用 _bind_ 方法改写。

```js
var slice = Function.prototype.call.bind(Array.prototype.slice);
slice([1, 2, 3], 0, 1); // [1]
```

上面代码的含义就是，将 _Array.prototype.slice_ 变成 _Function.prototype.call_ 方法所在的对象，调用时就变成了 _Array.prototype.slice.call_。类似的写法还可以用于其他数组方法。

```js
var push = Function.prototype.call.bind(Array.prototype.push);
var pop = Function.prototype.call.bind(Array.prototype.pop);

var a = [1, 2, 3];
push(a, 4);
a; // [1, 2, 3, 4]

pop(a);
a; // [1, 2, 3]
```

如果再进一步，将 _Function.prototype.call_ 方法绑定到 _Function.prototype.bind_ 对象，就意味着 _bind_ 的调用形式也可以被改写。

```js
function f() {
    console.log(this.v);
}

var o = { v: 123 };
var bind = Function.prototype.call.bind(Function.prototype.bind);
bind(f, o)(); // 123
```

上面代码的含义就是，将 _Function.prototype.bind_ 方法绑定在 _Function.prototype.call_ 上面，所以 _bind_ 方法就可以直接使用，不需要在函数实例上使用。

#### 2. 箭头函数的 _this_ 指向

当我们的 _this_ 是以函数的形式调用时，_this_ 指向的是全局对象。

不过对于箭头函数来讲，却比较特殊。**箭头函数的 _this_ 指向始终为外层的作用域。**

先来看一个普通函数作为对象的一个方法被调用时，_this_ 的指向，如下：

```js
const obj = {
    x: 10,
    test: function () {
        console.log(this); // 指向 obj 对象
        console.log(this.x); // 10
    },
};
obj.test();
// { x: 10, test: [Function: test] }
// 10
```

可以看到，普通函数作为对象的一个方法被调用时，_this_ 指向当前对象。

在上面的例子中，就是 _obj_ 这个对象，_this.x_ 的值为 _10_。

接下来是箭头函数以对象的方式被调用的时候的 _this_ 的指向，如下：

```js
var x = 20;
const obj = {
    x: 10,
    test: () => {
        console.log(this); // {}
        console.log(this.x); // undefined
    },
};
obj.test();
// {}
// undefined
```

这里的结果和上面不一样，_this_ 打印出来为 { }，而 _this.x_ 的值为 _undefined_。

为什么呢？

实际上刚才我们有讲过，箭头函数的 _this_ 指向与普通函数不一样，它的 _this_ 指向始终是指向的外层作用域。所以这里的 _this_ 实际上是指向的全局对象。

如果证明呢？

方法很简单，将这段代码放入浏览器运行，在浏览器中用 _var_ 所声明的变量会成为全局对象 _window_ 的一个属性，如下：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-09-28-052059.png" alt="image-20210928132058878" style="zoom:50%;" />

接下来我们再来看一个例子，来证明箭头函数的 _this_ 指向始终是指向的外层作用域。

```js
var name = "JavaScript";
const obj = {
    name: "PHP",
    test: function () {
        const i = function () {
            console.log(this.name);
            // i 是以函数的形式被调用的，所以 this 指向全局
            // 在浏览器环境中打印出 JavaScript，node 里面为 undeifned
        };
        i();
    },
};
obj.test(); // JavaScript
```

接下来我们将 i 函数修改为箭头函数，如下：

```js
var name = "JavaScript";
const obj = {
    name: "PHP",
    test: function () {
        const i = () => {
            console.log(this.name);
            // 由于 i 为一个箭头函数，所以 this 是指向外层的
            // 所以 this.name 将会打印出 PHP
        };
        i();
    },
};
obj.test(); // PHP
```

最后需要说一点的就是，箭头函数不能作为构造函数，如下：

```js
const Test = (name, age) => {
    this.name = name;
    this.age = age;
};
const test = new Test("xiejie", 18);
// TypeError: Test is not a constructor
```

## 真题解答

-   _this_ 的指向哪几种 ？

> 参考答案：
>
> 总结起来，_this_ 的指向规律有如下几条：
>
> -   简单调用函数时，在严格模式下，函数内的 _this_ 会被绑定到 _undefined_ 上，在非严格模式下则会被绑定到全局对象 _window/global_ 上。
> -   一般使用 _new_ 方法调用构造函数时，构造函数内的 _this_ 会被绑定到新创建的对象上。
> -   一般通过 _call/apply/bind_ 方法显式调用函数时，函数体内的 _this_ 会被绑定到指定参数的对象上。
> -   一般通过对象（上下文）调用函数时，函数体内的 _this_ 会被绑定到该对象上。
> -   在箭头函数中，_this_ 的指向是由外层（函数或全局）作用域来决定的。

-_EOF_-

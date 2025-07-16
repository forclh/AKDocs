# ✨ let、var、const 的区别

## 经典真题

-   _let const var_ 的区别？什么是块级作用域？如何用？

## 声明变量关键字汇总

在 _JavaScript_ 中，一共存在 _3_ 种**声明变量**的方式：

-   _var_
-   _let_
-   _const_

之所以有 _3_ 种方式，这是由于历史原因造成的。最初声明变量的关键字就是 _var_，但是为了解决作用域的问题，所以后面新增了 _let_ 和 _const_ 的方式。

### 作用域

首先我们来了解一下作用域。

_ES5_ 中的作用域有：**全局作用域、函数作用域**，_ES6_ 中新增了**块级作用域**。块作用域由 { } 包括，_if_ 语句和 _for_ 语句里面的 { } 也属于块作用域。

关于作用域的更多内容，可以参阅《[[【JS】作用域和作用域链🌟]]》章节。

### _var_ 关键字

1. 没有块级作用域的概念

```js
//Global Scope
{
    var a = 10;
}
console.log(a); //10
```

上面代码中，在 _Global Scope_（全局作用域）中，且在 _Block Scope_（块级作用域） { } 中，_a_ 输出结果为 _10_，由此可以看出 _var_ 声明的变量不存在 _Block Scope_ 的概念

2. 有全局作用域、函数作用域的概念

```js
//Global Scope
var a = 10;
function checkscope() {
    //Local Scope
    var b = 20;
    console.log(a); //10
    console.log(b); //20
}
checkscope();
console.log(b); //ReferenceError: b is not defined
```

上面代码中，在 _Global Scope_ 中用 _var_ 声明了 _a_，在 _checkscope_ 函数中的 _Local Scope_（本地作用域、函数作用域）中打印出了 _10_，但是在 _Global Scope_ 中打印的变量 _b_ 报错了。

3. 不初始化值默认为 _undefined_

```js
//Global Scope
var a;
console.log(a); //undefined
```

上面代码中，在 _Global Scope_ 中用 _var_ 声明了 _a_，但没有初始化值，它的值默认为 _undefined_，这里是 _undefined_ 是 _undefined_ 类型，而不是字符串。

4. 存在变量提升

```js
//Global Scope
console.log(a); //undefined
var a = 10;
// 函数声明也存在提升现象，但是函数表达式不存在
checkscope();
function checkscope() {
    //Local Scope
    console.log(a); //undefined
    var a;
}
```

上面代码中，先打印了 _a_，然后用 _var_ 声明变量 _a_。变量提升是因为 _js_ 需要经历编译和执行阶段。而 _js_ 在编译阶段的时候，会搜集所有的变量声明并且提前声明变量。

可以将这个过程形象地想象成所有的**变量声明（不包括初始化）都会被“移动”到各自作用域的最顶端**，这个过程被称为提升。

至于 _checkscope_ 函数中的变量 _a_ 为什么输出 _undefined_，可以参阅《[[【JS】作用域和作用域链🌟]]》章节。

5. 全局作用域用 _var_ 声明的变量会挂载到 _window_ 对象下

```js
//Global Scope
var a = 10;
console.log(a); //10
console.log(window.a); //10
console.log(this.a); //10
```

上面代码中，打印出了 _3_ 个 _10_，访问 _a_ 和 _window.a_ 或是 _this.a_ 都是等价的。

举个例子：比如我要访问 _location_ 对象，使用 _location_ 可以访问，使用 _window.location_ 也可以访问，只不过 _window_ 对象可以省略不写，就像 _new Array( )_ 和 _new window.Array( )_ 是等价的。

6. 同一作用域中允许重复声明

```js
//Global Scope
var a = 10;
var a = 20;
console.log(a); //20

checkscope();
function checkscope() {
    //Local Scope
    var b = 10;
    var b = 20;
    console.log(b); //20
}
```

上面代码中，在 _Global Scope_ 中声明了 _2_ 次 _a_，以最后一次声明有效，打印为 _20_。同理，在 _Local Scope_ 也是一样的。

### _let_ 关键字

1. 有块级作用域的概念

```js
{
    //Block Scope
    let a = 10;
}
console.log(a); //ReferenceError: a is not defined
```

上面代码中，打印 _a_ 报错，说明存在 _Block Scope_ 的概念。

2. 不存在变量提升

```js
{
    //Block Scope
    console.log(a); //ReferenceError: Cannot access 'a' before initialization
    let a = 10;
}
```

上面代码中，打印 _a_ 报错：无法在初始化之前访问。说明不存在变量提升。

3. 暂时性死区

```js
{
    // Block Scope
    console.log(a); // ReferenceError: Cannot access 'a' before initialization
    let a = 20;
}

if (true) {
    // TDZ开始
    console.log(a); // ReferenceError: Cannot access 'a' before initialization

    let a; // TDZ结束
    console.log(a); // undefined

    a = 123;
    console.log(a); // 123
}
```

上面代码中，使用 _let_ 声明的变量 _a_，导致绑定这个块级作用域，所以在 _let_ 声明变量前，打印的变量 _a_ 报错。

这是因为使用 _let/const_ 所声明的变量会存在暂时性死区。

什么叫做暂时性死区域呢？

_ES6_ 标准中对 _let/const_ 声明中的解释 [第 13 章](https://link.segmentfault.com/?enc=K6pZVwgVNQb0IBQ9LTOuJg%3D%3D.p07UoPCGl5RslJ9ZnW9Nr36NFqs2pU%2FnSfWZUPIH3S1TUXzWdj22pH0lUMFVGVUwJkDpSHrYe8uKlYek%2FK4HBDYkJhc%2Fe2xiWo5V6teR%2BXY%3D)，有如下一段文字：

> _The variables are created when their containing Lexical Environment is instantiated but may not be accessed in any way until the variable’s LexicalBinding is evaluated._

翻译成人话就是：

> 当程序的控制流程在新的作用域（_module、function_ 或 _block_ 作用域）进行实例化时，在此作用域中用 _let/const_ 声明的变量会先在作用域中被创建出来，但因此时还未进行词法绑定，所以是不能被访问的，如果访问就会抛出错误。因此，在这运行流程进入作用域创建变量，到变量可以被访问之间的这一段时间，就称之为暂时死区。

再简单理解就是：

> _ES6_ 规定，_let/const_ 命令会使区块形成封闭的作用域。若在声明之前使用变量，就会报错。
> 总之，在代码块内，使用 _let/const_ 命令声明变量之前，该变量都是不可用的。
> 这在语法上，称为 **“暂时性死区”**（ _temporal dead zone_，简称 **_TDZ_**）。

其实上面不存在变量提升的例子中，其实也是暂时性死区，因为它有暂时性死区的概念，所以它压根就**不存在变量提升**了。

4. 同一块作用域中不允许重复声明

```js
{
    //Block Scope
    let A;
    var A; //SyntaxError: Identifier 'A' has already been declared
}
{
    //Block Scope
    var A;
    let A; //SyntaxError: Identifier 'A' has already been declared
}
{
    //Block Scope
    let A;
    let A; //SyntaxError: Identifier 'A' has already been declared
}
```

### _const_ 关键字

1. 必须立即初始化，不能留到以后赋值

```js
// Block Scope
const a; // SyntaxError: Missing initializer in const declaration }
```

上面代码中，用 _const_ 声明的变量 _a_ 没有进行初始化，所以报错。

2. 常量的值不能改变

```js
//Block Scope
{
    const a = 10;
    a = 20; // TypeError: Assignment to constant variable
}
```

上面代码中，用 _const_ 声明了变量 _a_ 且初始化为 _10_，然后试图修改 _a_ 的值，报错。

_const_ 实际上保证的，并不是变量的值不得改动，而是**变量指向的那个内存地址所保存的数据不得改动**。

### 特点总结

-   _var_ 关键字

1. 没有**块级作用域**的概念
2. 有全局作用域、函数作用域的概念
3. 不初始化值默认为 _undefined_
4. 存在**变量提升**
5. 全局作用域用 _var_ 声明的变量会挂载到 _window_ 对象下
6. 同一作用域中允许重复声明

-   _let_ 关键字

1. 有**块级作用域**的概念
2. 不存在变量提升
3. **暂时性死区**
4. 同一块作用域中不允许重复声明

-   _const_ 关键字

1. 与 _let_ 特性一样，仅有 _2_ 个差别
2. 区别 1：**必须立即初始化**，不能留到以后赋值
3. 区别 2：**常量的值不能改变**

## 真题解答

-   _let const var_ 的区别？什么是块级作用域？如何用？

1. var 最主要的特性就是它存在变量提升的现象，并且没有块级作用域。其他的一些特点包括 var 定义的变量不初始化默认为 undefined，同一作用域允许重复声明、全局变量挂载到全局对象下。
2. let 关键字主要的特性即使存在块级作用域和暂时性死区，并且同一作用域下不允许重复声明。
3. const 关键字和 let 关键字基本相同，主要的的差别是 const 关键字声明的时候需要立即初始化、并且声明的常量不能修改。

块级作用域就是由一堆花括号包裹形成的作用域空间，比如 if 语句和 for 语句里面的花括号

> 参考答案：
>
> 1.  _var_ 定义的变量，没有块的概念，可以跨块访问, 不能跨函数访问，有变量提升。
> 2.  _let_ 定义的变量，只能在块作用域里访问，不能跨块访问，也不能跨函数访问，无变量提升，不可以重复声明。
> 3.  _const_ 用来定义常量，使用时必须初始化(即必须赋值)，只能在块作用域里访问，而且不能修改，无变量提升，不可以重复声明。
>
> 最初在 _JS_ 中作用域有：全局作用域、函数作用域。没有块作用域的概念。
>
> _ES6_ 中新增了块级作用域。块作用域由 { } 包括，_if_ 语句和 _for_ 语句里面的 { } 也属于块作用域。
>
> 在以前没有块作用域的时候，在 _if_ 或者 _for_ 循环中声明的变量会泄露成全局变量，其次就是 { } 中的内层变量可能会覆盖外层变量。块级作用域的出现解决了这些问题。

| 特性                 | var                             | let                           | const                               |
| -------------------- | ------------------------------- | ----------------------------- | ----------------------------------- |
| **块级作用域**       | ❌ 没有块级作用域               | ✅ 有块级作用域               | ✅ 有块级作用域                     |
| **函数作用域**       | ✅ 有函数作用域                 | ✅ 有函数作用域               | ✅ 有函数作用域                     |
| **全局作用域**       | ✅ 有全局作用域                 | ✅ 有全局作用域               | ✅ 有全局作用域                     |
| **变量提升**         | ✅ 存在变量提升                 | ❌ 不存在变量提升             | ❌ 不存在变量提升                   |
| **暂时性死区 (TDZ)** | ❌ 没有                         | ✅ 有                         | ✅ 有                               |
| **重复声明**         | ✅ 允许在同一作用域重复声明     | ❌ 禁止在同一块作用域重复声明 | ❌ 禁止在同一块作用域重复声明       |
| **挂载到 window**    | ✅ 全局声明会挂载到 window 对象 | ❌ 不会挂载到 window          | ❌ 不会挂载到 window                |
| **初始化值**         | 默认为 undefined                | 无默认值，未初始化前无法访问  | 必须立即初始化                      |
| **值可变性**         | ✅ 可修改                       | ✅ 可修改                     | ❌ 不可修改（但对象内部属性可修改） |

# 为什么会存在变量提升现象？ JavaScript 的执行过程？

```mermaid
flowchart TD
    A[JavaScript 源代码] --> B[词法分析]
    B -->|生成tokens| C[语法分析]
    C -->|生成AST| D[代码生成]
    D --> E[执行准备]

    subgraph 编译阶段
        B
        C
        D
    end

    subgraph 执行环境准备
        E --> E1[创建执行上下文]

        E1 --> E2[创建阶段]
        E2 --> E21[创建词法环境]
        E2 --> E22[创建变量环境]
        E2 --> E23[创建this绑定]
        E2 --> E24[设置外部环境引用]

        E21 --> E211[处理let/const声明]
        E211 --> E211A[提升但进入暂时性死区]

        E22 --> E221[处理var声明]
        E221 --> E221A[提升并初始化为undefined]
        E22 --> E222[函数声明整体提升]
    end

    E1 --> F[执行阶段]

    subgraph 代码执行
        F --> F1[按顺序执行代码]
        F1 --> F2[变量赋值]
        F1 --> F3[函数调用]
        F3 -->|创建新的执行上下文| E1
        F1 --> F4[原型链查找]
        F1 --> F5[闭包形成]
    end

    subgraph 执行上下文栈管理
        G[执行上下文栈/调用栈]
        G <-->|压入全局上下文| E1
        G <-->|函数调用压栈| F3
        F1 -->|函数返回| H[执行上下文出栈]
        H --> G
    end

    subgraph 内存管理
        I[标记-清除垃圾回收]
        H -.->|可能触发| I
        I -.->|定期执行| I
    end

    subgraph 事件循环
        J[事件队列]
        K[微任务队列]
        L[宏任务队列]

        F1 --> K
        F1 --> L
        F -.->|同步代码执行完毕| M[检查微任务队列]
        M -->|执行所有微任务| N[执行一个宏任务]
        N --> M
    end

    F5 -.->|保持对外部变量引用| O[形成闭包]
    O -.->|延长变量生命周期| I
```

# 虚拟DOM本质

- DOM工作原理
- 虚拟DOM本质
- 为什么要需要虚拟DOM

## DOM工作原理

大家思考一个问题：我们写的代码是 JS 代码，但是浏览器引擎是 C++ 写的

```jsx
const div = document.createElement("div");
```

浏览器引擎（C++）拿到你这个 JS 代码是如何处理的？

这里介绍一个东西：Web Interface Definition Language，WebIDL，翻译成中文“Web接口定义语言”。这里就是定义浏览器和 JS 之间如何进行通信，换句话说，浏览器（C++实现的）所提供的一些功能（本地功能）如何能够被 JS 调用。

通过 WebIDL，**浏览器开发者** 可以描述哪些类和方法能够被 JS 访问，以及这些方法应该如何映射到 JS 中的对象和方法。

假设现在有如下的 WebIDL 定义，用于创建 DOM 元素：

```
interface Document {
    Element createElement(DOMString localName);
};
```

这里就定义了一个 Document 的接口，该接口内部有一个 createElement，用来创建 DOM 元素的。

接下来 **浏览器开发者** 接下来使用 C++ 来实现这个接口：

```cpp
class Document {
public:
  	// 实现了上面的接口，定义了具体如何来创建 DOM 元素
    Element* createElement(const std::string& tagName) {
        return new Element(tagName);
    }
};
```

接下来的步骤非常重要，需要生成绑定代码（绑定层），绑定了 JS 如何调用这个 C++ 方法：

```cpp
// 这个绑定代码是由 WebIDL 编译器自动生成
// 这就是 JS 到 C++ 的绑定
// 换句话说，这段绑定代码决定了 JS 开发者可以调用哪些方法从而来调用上面的 C++ 方法
void Document_createElement(const v8::FunctionCallbackInfo<v8::Value>& args) {
    v8::Isolate* isolate = args.GetIsolate();
    v8::HandleScope handle_scope(isolate);
    Document* document = Unwrap<Document>(args.Holder());

    v8::String::Utf8Value utf8_value(isolate, args[0]);
    std::string localName(*utf8_value);

    Element* element = document->createElement(localName);
    v8::Local<v8::Value> result = WrapElement(isolate, element);
    args.GetReturnValue().Set(result);
}
```

有了绑定代码之后，接下来需要在 JS 引擎里面注册：

```cpp
// 将上面的绑定代码注册到 JS 引擎里面
void RegisterDocument(v8::Local<v8::Object> global, v8::Isolate* isolate) {
    v8::Local<v8::FunctionTemplate> tmpl = v8::FunctionTemplate::New(isolate);
    tmpl->InstanceTemplate()->Set(isolate, "createElement", Document_createElement);
    global->Set(v8::String::NewFromUtf8(isolate, "Document"), tmpl->GetFunction());
}
```

**Web 开发者**在进行开发的时候，可以在 JS 文件中书写如下的代码：

```jsx
const i = 1;
document.createElement("div");
```

首先是 JS 引擎来执行 JS 代码，第一句是 JS 引擎完全能搞定的。第二句 JS 引擎发现你要创建 DOM 节点，会将其识别为一个 API 调用，然后向浏览器底层（渲染引擎）发出请求，由浏览器底层（渲染引擎）负责来创建这个 DOM 元素。浏览器底层创建完 DOM 元素之后，还需要给你最初的调用端返回一个结果，所谓最初的调用端，也就是 JS 代码中调用 DOM API 的地方。

如下图所示：

![](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-04-29-075748.png)

平时我们所指的真实 DOM，究竟是在指什么？

指的就是浏览器底层已经调用过 C++ 对应的 API 了

假设你在 JS 层面

```jsx
document.appendChild("div");
```

那么浏览器底层在调用对应的 C++ 代码的时候，还会涉及到浏览器重新渲染的相关内容，这又是一个很大的话题。

## 虚拟DOM本质

最初虚拟 DOM 是由 React 团队提出的：

> 虚拟 DOM 是一种编程概念。在这个概念里， UI 以一种理想化的，或者说“虚拟的”表现形式被保存于内存中。
> 

理论上来讲，无论你用什么样的结构，只要你将文档的结构能够展示出来，你的这种结构就是一种虚拟 DOM. 虽然理论是美好的，但实际上也只有 JS 对象适合干这个事情。

在 Vue 中，可以通过一个名叫 h 的函数，该函数的调用结果就是返回虚拟 DOM.

文档地址：https://cn.vuejs.org/api/render-function.html#h

下面是一个简单的示例：

父组件 App.vue

```
<template>
  <div class="app-container">
    <h1>这是App组件</h1>
    <Child name="李四" email="123@qq.com" />
    <component :is="vnode" />
  </div>
</template>

<script setup>
import { h } from 'vue'
import Child from '@/components/Child.vue'
const vnode = h(Child, {
  name: '李四',
  email: '123@qq.com'
})
console.log('vnode:', vnode)
</script>

<style scoped>
.app-container {
  width: 400px;
  border: 1px solid;
}
</style>
```

子组件 Child.vue

```
<template>
  <div class="child-container">
    <h3>这是子组件</h3>
    <p>姓名：{{ name }}</p>
    <p>email：{{ email }}</p>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  email: String
})
</script>

<style scoped>
.child-container {
  width: 200px;
  height: 200px;
  border: 1px solid;
}
</style>
```

通过上面的例子，我们可以得出一个结论：虚拟 DOM 的本质就是普通的 JS 对象。

## 为什么需要使用虚拟DOM

先来回顾早期的开发模式。

在最早期的时候，前端是通过手动操作 DOM 节点来编写代码的。

创建节点：

```jsx
// 创建一个新的<div>元素
var newDiv = document.createElement("div");
// 给这个新的<div>添加一些文本内容
var newContent = document.createTextNode("Hello, World!");
// 把文本内容添加到<div>中
newDiv.appendChild(newContent);
// 最后，把这个新的<div>添加到body中
document.body.appendChild(newDiv);
```

更新节点：

```jsx
// 假设我们有一个已存在的元素ID为'myElement'
var existingElement = document.getElementById("myElement");
// 更新文本内容
existingElement.textContent = "Updated content here!";
// 更新属性，例如改变样式
existingElement.style.color = "red";
```

删除节点：

```jsx
// 假设我们要删除ID为'myElement'的元素
var elementToRemove = document.getElementById("myElement");
// 获取父节点
var parent = elementToRemove.parentNode;
// 从父节点中移除这个元素
parent.removeChild(elementToRemove);
```

插入节点：

```jsx
// 创建新节点
var newNode = document.createElement("div");
newNode.textContent = "这是新的文本内容";
// 假设我们想把这个新节点插入到id为'myElement'的元素前面
var referenceNode = document.getElementById("myElement");
referenceNode.parentNode.insertBefore(newNode, referenceNode);
```

上面的代码，如果从编程范式的角度来看，是属于 **命令式编程**，这种命令式编程的性能一定是最高的。

这意味着，假如你要创建一个 div 的 DOM 节点，没有什么比 document.createElement(“div”) 这句代码的性能还要高。

虽然上面的方式是性能最高的，但是在实际开发中，开发者往往倾向于更加方便的方式。

```html
<div id="app">
  <!-- 需求：往这个节点内部添加一些其他的节点 -->
</div>
```

如果是采用传统的操作 DOM 节点的方式：

```jsx
// 获取app节点
var app = document.getElementById("app");

// 创建外层div
var messageDiv = document.createElement("div");
messageDiv.className = "message";

// 创建info子div
var infoDiv = document.createElement("div");
infoDiv.className = "info";

// 创建span元素并添加到infoDiv
var nameSpan = document.createElement("span");
nameSpan.textContent = "张三";
infoDiv.appendChild(nameSpan);

var dateSpan = document.createElement("span");
dateSpan.textContent = "2024.5.6";
infoDiv.appendChild(dateSpan);

// 将infoDiv添加到messageDiv
messageDiv.appendChild(infoDiv);

// 创建并添加<p>
var p = document.createElement("p");
p.textContent = "这是一堂讲解虚拟DOM的课";
messageDiv.appendChild(p);

// 创建btn子div
var btnDiv = document.createElement("div");
btnDiv.className = "btn";

// 创建a元素并添加到btnDiv
var removeBtn = document.createElement("a");
removeBtn.href = "#";
removeBtn.className = "removeBtn";
removeBtn.setAttribute("_id", "1");
removeBtn.textContent = "删除";
btnDiv.appendChild(removeBtn);

// 将btnDiv添加到messageDiv
messageDiv.appendChild(btnDiv);

// 将构建的messageDiv添加到app中
```

如果使用 innerHTML 的方式：

```jsx
var app = document.getElementById("app");

app.innerHTML += `
  <div class="message">
    <div class="info">
      <span>张三</span>
      <span>2024.5.6</span>
    </div>
    <p>这是一堂讲解虚拟DOM的课</p>
    <div class="btn">
      <a href="#" class="removeBtn" _id="1">删除</a>
    </div>
  </div>`;
```

虽然第一种方式性能最高，但是写起来 Web开发者 的心智负担也很高。

因此 Web开发者往往选择第二种，虽然性能要差一些，但是心智负担也没有那么高，写起来轻松一些。

为什么第二种性能要差一些？差在哪里？

原因很简单，第二种方式涉及到了两个层面的计算：

1. 解析字符串（JS层面）
2. 创建对应的 DOM 节点（DOM 层面）

实际上使用虚拟 DOM 也涉及到两个层面的计算：

1. 创建 JS 对象（虚拟DOM，属于 JS 层面）
2. 根据 JS 对象创建对应的 DOM 节点（DOM 层面）

这里我们不需要考虑同属于 JS 层面的计算，解析字符串和创建 JS 对象究竟谁快谁慢。只需要知道不同层面的计算，JS 层面的计算和 DOM 层面的计算，速度是完全不同的。

JS 层面创建 1千万个对象：

```jsx
console.time("time");
const arr = [];
for(let i=0;i<10000000;i++){
  let div = {
    tag : "div"
  };
  arr.push(div);
}
console.timeEnd("time");
// 平均在几百毫秒左右
```

DOM 层面创建 1千万个对象：

```jsx
console.time("time");
const arr = [];
for(let i=0;i<10000000;i++){
  arr.push(document.createElement("div"));
}
console.timeEnd("time");
// 平均在几千毫秒
```

到目前为止，我们完全了解了 JS 层面的计算和 DOM 层面的计算，速度完全不一样。

接下来我们来看一下虚拟 DOM 真实的解决的问题。

实际上无论使用虚拟 DOM 还是 innerHTML，在初始化（js层面）的时候性能是相差无几的。虚拟 DOM 发挥威力的时候，实际上是在更新的时候。

来看一个例子：

```html
<body>
  <button id="updateButton">更新内容</button>
  <div id="content"></div>
  <script src="script.js"></script>
</body>
```

```jsx
// 通过 innerHTML 来更新 content 里面的内容
document.addEventListener("DOMContentLoaded", function () {
  const contentDiv = document.getElementById("content");
  const updateButton = document.getElementById("updateButton");

  updateButton.addEventListener("click", function () {
    const currentTime = new Date().toTimeString().split(" ")[0]; // 获取当前时间
    contentDiv.innerHTML = `
        <div class="message">
            <div class="info">
                <span>张三</span>
                <span>${currentTime}</span>
            </div>
            <p>这是一堂讲解虚拟DOM的课</p>
            <div class="btn">
                <a href="#" class="removeBtn" _id="1">删除</a>
            </div>
        </div>`;
  });
});
```

在上面的例子中，我们使用的是 innerHTML 来更新，这里涉及到的计算层面如下：

1. 销毁所有旧的 DOM（DOM 层面）
2. 解析新的字符串（JS 层面）
3. 重新创建所有 DOM 节点（DOM 层面）

如果使用虚拟 DOM，那么只有两个层面的计算：

1. 使用 diff 计算出更新的节点（JS 层面）
2. 更新必要的 DOM 节点（DOM 层面）

因此，总结一下，平时所说的虚拟DOM“快”，是有前提的：

- 首先看你和谁进行比较
    - 如果是和原生 JS 操作 DOM 进行对比，那么虚拟 DOM 性能肯定更低而非更高，因为你多了一层计算
- 其次就算你和 innerHTML 进行比较
    - 初始化渲染的时候两者之间的差距并不大
    - 虚拟 DOM 是在更新的时候相比 innerHTML 性能更高

最后总结一句话：使用虚拟 DOM 是为了防止组件在 **重渲染** 时导致的性能恶化。

接下来，关于虚拟 DOM 咱们进行一个更深层次思考，虚拟 DOM 还有哪些好处？

1. 跨平台性

虚拟 DOM 实际上是增加一层抽象层，相当于和原本的底层操作 DOM 进行解藕。这个其实就是设计原则里面的依赖倒置原则：

> 高层模块不应依赖于低层模块（实际的底层操作DOM）的实现细节，两者都应依赖于抽象（虚拟DOM层）
> 

加一层的好处在于，底层模块是可以随时替换的。使用抽象层（虚拟DOM层）来描述 UI 的结构，回头可以通过不同的渲染引擎来进行渲染，而不是局限于浏览器平台。

1. 框架更加灵活

Reactv15 升级到 Reactv16 后，架构层面有了非常大的变化，从 Stack 架构升级到了 Fiber 架构，React 内部实际上发生了翻天覆地的变化，但是对开发者的入侵是极小的，开发者基本上感受不到变化，仍然可以使用以前的开发方式进行开发。

因为 React 有虚拟 DOM 这个中间层，就将开发者的代码和框架内部的架构解藕了。架构的变化只是依赖于不同的虚拟 DOM 而已，回头开发者的代码会被编译为对应结构的虚拟 DOM.

目前有一些新的框架：Svelte、Solid.js 这一类框架提出了无虚拟 DOM 的概念。这一类框架直接将组件编译为命令式代码，而不是在运行时通过比较虚拟 DOM 来更新真实 DOM. 因此这一类框架在 **性能** 方面一定是优于虚拟 DOM 类的框架的。

包括 Vue 目前也在积极推出无虚拟 DOM 版本，简称“蒸汽模式”：https://github.com/vuejs/core-vapor


# _Web Worker_

在运行大型或者复杂的 _JavaScript_ 脚本的时候经常会出现浏览器假死的现象，这是由于 _JavaScript_ 这个语言在执行的时候是采用**单线程来执行**而导致的。采用同步执行的方式进行运行，如果出现阻塞，那么后面的代码将不会执行。例如：

```js
while (true) {}
```

**那么能不能让这些代码在后台运行，或者让 _JavaScript_ 函数在多个进程中同时运行呢？**

_HTML5_ 所提出的 _Web Worker_ 正是为了解决这个问题而出现的。

_HTML5_ 的 _Web Worker_ 可以让 _Web_ 应用程序具备后台的处理能力。它支持**多线程处理功能**，因此可以充分利用多核 _CPU_ 带来的优势，将耗时长的任务分配给 _HTML5_ 的 _Web Worker_ 运行，从而避免了有时页面反应迟缓，甚至假死的现象。

本文将分为以下几个部分来介绍 _Web worker_：

- _Web Worker_ 概述
- _Web Worker_ 使用示例
- 使用 _Web Worker_ 实现跨标签页通信

## _Web worker_ 概述

在 _Web_ 应用程序中，_Web Worker_ 是一项后台处理技术。

在此之前，_JavaScript_ 创建的 _Web_ 应用程序中，因为所有的处理都是在单线程内执行的，所以如果脚本所需运行时间太长，程序界面就会长时间处于停止状态，甚至当等待时间超出一定的限度，浏览器就会进入假死的状态。

为了解决这个问题，_HTML5_ 新增加了一个 _Web Worker API_。

**使用这个 _API_，用户可以很容易的创建在后台运行的线程，这个线程被称之为 _Worker_。**如果将可能耗费较长时间的处理交给后台来执行，则对用户在前台页面中执行的操作没有影响。

_Web Worker_ 的特点如下：

- 通过加载一个 _JS_ 文件（Worker）来进行大量复杂的计算，而不挂起主进程。通过 `postMessage` 和 `onmessage` 进行通信。

- 可以在 _Worker_ 中通过 `importScripts(url)` 方法来加载 _JavaScript_ 脚本文件。

- 可以使用 `setTimeout( )`，`clearTimeout( )`，`setInterval( )` 和 `clearInterval( )` 等方法。

- 可以使用 `XMLHttpRequest` 进行异步请求。

- 可以访问 `navigator` 的部分属性。

- 可以使用 _JavaScript_ 核心对象。

除了上述的优点，_Web Worker_ 本身也具有一定局限性的，具体如下：

- 不能跨域加载 _JavaScript_

- **_Worker_ 内代码不能访问 _DOM_**

- 使用 _Web Worker_ 加载数据没有 _JSONP_ 和 _Ajax_ 加载数据高效。

目前来看，_Web Worker_ 的浏览器兼容性还是很不错的，基本得到了主流浏览器的一致支持。

![](https://bu.dusays.com/2025/06/28/685fd7ba740cd.png)

在开始使用 _Web Worker_ 之前，我们先来看一下使用 _Worker_ 时会遇到的属性和方法，如下：

- `self`：_self_ 关键值用来表示本线程范围内的作用域。

- `postMessage`：**向创建线程的源窗口发送信息。**

- `onmessage`：**获取接收消息的事件句柄。**

- `importScripts(urls)`：_Worker_ 内部如果要**加载其他脚本**，可以使用该方法来导入其它 _JavaScript_ 脚本文件。参数为该脚本文件的 _URL_ 地址，导入的脚本文件必须与使用该线程文件的页面在同一个域中，并在同一个端口中。

例如：

```js
// 导入了 3 个 JavaScript 脚本
importScripts("worker1.js", "worker2.js", "worker3.js");
```

## _Web Worker_ 使用示例

接下来我们来看一下 _Web Worker_ 的具体使用方式。

_Web Worker_ 的使用方法非常简单，只需要创建一个 _Web Worker_ 对象，并传入希望执行的 _JavaScript_ 文件即可。

之后在页面中设置一个事件监听器，用来监听由 _Web Worker_ 对象发来的消息。

如果想要在页面与 _Web Worker_ 之间建立通信，数据需要通过 `postMessage( )` 方法来进行传递。

创建 _Web Worker_。步骤十分简单，只要在 _Worker_ 类的构造器中，将需要在后台线程中执行的脚本文件的 _URL_ 地址作为参数传入，就可以创建 _Worker_ 对象，如下：

```js
let worker = new Worker("./worker.js");
```

> 注意：在**后台线程中是不能访问页面或者窗口对象**的，此时如果在后台线程的脚本文件中使用 _window_ 或者 _document_ 对象，则会引发错误。

这里传入的 _JavaScript_ 的 _URL_ 可以是相对或者绝对路径，只要是相同的协议，主机和端口即可。

如果想获取 _Worker_ 进程的返回值，可以通过 `onmessage` 属性来绑定一个事件处理程序。如下：

```js
let worker = new Worker("./worker.js");
worker.onmessage = function () {
  console.log("the message is back!");
};
```

这里第一行代码用来创建和运行 _Worker_ 进程，第 _2_ 行设置了 _Worker_ 的 _message_ 事件，当**后台 Worker 的 `postMessage` 方法被调用时，该事件就会被触发。**

使用 _Worker_ 对象的 `postMessage` 方法可以给后台线程发送消息。发送的消息需要为文本数据，如果要发送任何 _JavaScript_ 对象，需要通过 `JSON.stringify( )` 方法将其转换成文本数据。

```js
worker.postMessage(message);
```

**通过获取 _Worker_ 对象的 `onmessage` 事件以及 _Worker_ 对象的 `postMessage` 方法就可以实现线程之间的消息接收和发送。**

_Web Worker_ 不能自行终止，但是能够被启用它们的页面所终止。

调用 `terminate( )` 函数可以终止后台进程。被终止的 _Web Workers_ 将不再响应任何消息或者执行任何其他运算。

终止之后，_Worker_ 不能被重新启动，但是可以使用同样的 _URL_ 创建一个新的 _Worker_。

下面是 _Web Worker_ 的一个具体使用示例。

```html index.html
<p>计数：<output id="count"></output></p>
<button id="startBtn">开始计数</button>
<button id="endBtn">结束计数</button>
```

```js
const doms = {
  count: document.getElementById("count"),
  startBtn: document.getElementById("startBtn"),
  endBtn: document.getElementById("endBtn"),
};
let worker;
startBtn.onclick = function () {
  worker = new Worker("worker.js");
  // 接收来自于后台的数据
  worker.onmessage = function (e) {
    doms.count.innerHTML = e.data;
  };
};

endBtn.onclick = function () {
  worker.terminate();
  worker = null;
};
```

_worker.js_

```js
let count = 0;

setInterval(function () {
  count++;
  postMessage(count);
}, 1000);
```

在上面的代码中，当用户点击"开始工作"时，会创建一个 _Web Worker_ 在后台进行计数。每次计的数都会通过 `postMessage` 方法返回给前台。

当用户点击"停止工作"时，则会调用 `terminate( )` 方法来终止 _Web Worker_ 的运行。

## 使用 _Web Worker_ 实现跨标签页通信

_Web Worker_ 可分为两种类型：

- 专用线程 _dedicated Web worker_

- 共享线程 _shared Web worker_

_Dedicated Web worker_ 随当前页面的关闭而结束，**这意味着 _Dedicated Web worker_ 只能被创建它的页面访问**。

**与之相对应的 _Shared Web worker_ 共享线程可以同时有多个页面的线程链接。**

前面我们示例 _Web Worker_ 时，实例化的是一个 Worker 类，这就代表是一个 _Dedicated Web worker_，而要创建 _Shared Worker_ 则需要实例化 `SharedWorker` 类。

```js
var worker = new SharedWorker("sharedworker.js");
```

下面我们就使用 _Shared Web worker_ 共享线程来实现跨标签页通信。

```html *index.html*
<body>
  <input type="text" name="" id="content" />
  <button id="btn">发送数据</button>
  <script>
    const content = document.querySelector("#content");
    const btn = document.querySelector("#btn");

    // 创建一个worker
    const worker = new SharedWorker("worker.js");
    // 点击向worker发送消息
    btn.onclick = function () {
      worker.port.postMessage(content.value);
    };
  </script>
</body>
```

```html index2.html
<body>
  <script>
    const worker = new SharedWorker("worker.js");
    worker.port.start();

    // 监听worker返回的数据
    worker.port.onmessage = function (e) {
      if (e.data) {
        console.log(e.data);
      }
    };

    // 轮询向worker发送消息查询数据
    setInterval(function () {
      worker.port.postMessage("get");
    }, 1000);
  </script>
</body>
```

```js worker.js
let data = ""; // 存储用户发送的信息
self.onconnect = function (e) {
  console.log("页面连接上了");
  let port = e.ports[0];
  port.onmessage = function (e) {
    // 说明要将接收到的数据返回给客户端
    if (e.data === "get") {
      port.postMessage(data);
      data = "";
    } else {
      data = e.data;
    }
  };
};
```

# JQuery

> 官网：https://jquery.com/
>
> 中文网：https://jquery.cuishifeng.cn/
>
> CDN：https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js

针对 DOM 的操作无非以下几种：

-   获取它
-   创建它
-   监听它
-   改变它

JQuery 可以让上面整个过程更加轻松

## jQuery 函数

jQuery 提供了一个函数，名称为`jQuery`，也可以写作`$`

该函数提供了强大的 DOM 控制能力

通过下面的示例，可以快速理解 jQuery 的核心功能

```js
// 获取类样式为container的所有DOM
const container = $(".container");

// 获取container后面的兄弟元素，元素类样式必须包含list
container.nextAll(".list");

// 删除元素
container.remove();

// 找到所有类样式为list元素的后代li元素，给它们加上类样式item
$(".list li").addClass("item");

// 为所有p元素添加一些style
$("p").css({ color: "#ff0011", background: "blue" });

// 注册DOMContentLoaded事件
$(function () {
    // ...
});

// 给所有li元素注册点击事件
$("li").click(function () {
    // ...
});

// 创建一个a元素，设置其内容为link，然后将它作为子元素追加到类样式为.list的元素中
$("<a>").text("link").appendTo(".list");
```

下面依次介绍 jQuery 中的核心概念，以便于文档查阅

## jQuery 对象和 DOM 对象

通过 jQuery 得到的元素是一个 jQuery 对象，而不是传统的 DOM

jQuery 对象是一个伪数组，它和 DOM 元素的关系如下

<img src="http://mdrs.yuanjin.tech/img/20210522134507.png" alt="image-20210522134507738" style="zoom:50%;" />

jQuery 对象和 DOM 之间可以互相转换

```js
// jQuery -> DOM
jQuery对象[索引];
jQuery对象.get(索引);

// DOM -> jQuery
$(DOM对象);
```

## 官网文档中的目录

| 目录名   | 内容                                                                                |
| -------- | ----------------------------------------------------------------------------------- |
| 选择器   | 选择器是一个字符串，用于描述要选中哪些元素                                          |
| 筛选     | 在当前 jQuery 对象的基础上，进一步选中元素                                          |
| 文档处理 | 更改 HTML 文档结构，例如删除元素、清空元素内容、改变元素之间的关系                  |
| 属性     | 控制元素属性，例如修改类样式、读取和设置文本框的 value、读取和设置 img 的 src       |
| css      | 控制元素 style 样式，例如改变字体颜色、设置背景、获取元素尺寸、获取和设置滚动位置   |
| 事件     | 监听元素的事件，例如监听文档加载完成、监听元素被点击                                |
| ajax     | jQuery 封装了 XHR，使 ajax 访问更加方便<br />这部分功能目前已被其他第三方库全面超越 |
|          |                                                                                     |

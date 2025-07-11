# CSS 单位总结

## 经典真题

-   _px_ 和 _em_ 的区别

## _CSS_ 中的哪些单位

首先，在 _CSS_ 中，单位分为两大类，**绝对长度单位**和**相对长度单位**。

### 绝对长度单位

我们先来说这个，绝对长度单位最好理解，和我们现实生活中是一样的。在我们现实生活中，常见的长度单位有米（_m_）、厘米（_cm_）、毫米（_mm_），每一种单位的长度都是固定，比如 _5cm_，你走到任何地方 _5cm_ 的长度都是一致的

例如：

```html
<div class="container"></div>
```

```css
.container {
    width: 5cm;
    height: 5cm;
    background-color: pink;
}
```

在上面的代码中，我们设置了盒子的宽高都是 _5cm_，这里用的就是绝对长度单位。

常见的绝对单位长度如下：

![](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-09-14-073818.png)

这些值中的大多数在用于打印时比用于屏幕输出时更有用。例如，我们通常不会在屏幕上使用 _cm_。

惟一一个经常使用的值，估计就是 _px_(像素)。

### 相对长度单位

相对长度单位相对于其他一些东西，比如父元素的字体大小，或者视图端口的大小。使用相对单位的好处是，经过一些仔细的规划，我们可以使文本或其他元素的大小与页面上的其他内容相对应。

下表列出了 _web_ 开发中一些最有用的单位。

![](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-09-14-074021.png)

上面的单位中，常用的有 _em、rem、vw、vh_，其中 _vw_ 和 _vh_ 代表的是视口的宽度和高度，例如：

```html
<div class="container"></div>
```

```css
* {
    margin: 0;
    padding: 0;
}
.container {
    width: 50vw;
    height: 100vh;
    background-color: pink;
}
```

在上面的代码中，我们设置了容器的宽度为 _50vw_，也就是占视口的一半，而高度我们设置的是 _100vh_，就是占满整个视图。

接下来来看一下 _em_ 和 _rem_。

_em_ 和 _rem_ 相对于 _px_ 更具有灵活性，他们是相对长度单位，意思是长度不是定死了的，更适用于响应式布局。

对于 _em_ 和 _rem_ 的区别一句话概括：**_em_ 相对于父元素，_rem_ 相对于根元素。**

来看关于 _em_ 和 _rem_ 示例。

_em_ 示例

```html
<div>
    我是父元素div
    <p>
        我是子元素p
        <span>我是孙元素span</span>
    </p>
</div>
```

```css
* {
    margin: 0;
    padding: 0;
}

div {
    font-size: 40px;
    width: 10em;
    /* 400px */
    height: 10em;
    outline: solid 1px black;
    margin: 10px;
}

p {
    font-size: 0.5em;
    /* 20px */
    width: 10em;
    /* 200px */
    height: 10em;
    outline: solid 1px red;
}

span {
    font-size: 0.5em;
    width: 10em;
    height: 10em;
    outline: solid 1px blue;
    display: block;
}
```

效果：

![](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-09-14-075220.png)

_rem_ 示例

_rem_ 是全部的长度都相对于根元素，根元素是谁？

那就是 *html*元素。通常做法是给 _html_ 元素设置一个字体大小，然后其他元素的长度单位就为 _rem_。

例如：

```html
<div>
    我是父元素div
    <p>
        我是子元素p
        <span>我是孙元素span</span>
    </p>
</div>
```

```css
* {
    margin: 0;
    padding: 0;
}

html {
    font-size: 10px;
}

div {
    font-size: 4rem;
    /* 40px */
    width: 30rem;
    /* 300px */
    height: 30rem;
    /* 300px */
    outline: solid 1px black;
    margin: 10px;
}

p {
    font-size: 2rem;
    /* 20px */
    width: 15rem;
    /* 150px */
    height: 15rem;
    /* 150px */
    outline: solid 1px red;
}

span {
    font-size: 1.5rem;
    width: 10rem;
    height: 10rem;
    outline: solid 1px blue;
    display: block;
}
```

所以当用 _rem_ 做响应式时，直接在媒体中改变 _html_ 的 _font-size_，此时用 _rem_ 作为单位的元素的大小都会相应改变，很方便。

看到这里我想大家都能够更深刻的体会了 _em_ 和 _rem_ 的区别了，其实就是参照物不同。

## 真题解答

-   _px_ 和 _em_ 的区别

> 参考答案：
>
> _px_ 即 _pixel_ 像素，是相对于屏幕分辨率而言的，是一个绝对单位，但是具有一定的相对性。因为在同一设备上每个设备像素所代表的物理长度是固定不变的（绝对性），但在不同设备间每个设备像素所代表的物理长度是可以变化的（相对性）。
>
> _em_ 是相对长度单位，具体的大小要相对于父元素来计算，例如父元素的字体大小为 _40px_，那么子元素 _1em_ 就代表**字体大小**和父元素一样为 _40px_，_0.5em_ 就代表**字体大小**为父元素的一半即 _20px_。

-   _EOF_

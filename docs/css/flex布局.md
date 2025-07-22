# ✨flex 布局 👌

对于布局之前我们学习过浮动定位。那本身不算真正的布局，接下来要学习才属于真正的 css 布局

Flexbox，也称为**弹性盒模型**，是一种新的布局模式。它提供了一种更加有效的方式来布局、对齐和分配容器内项目的空间，即使它们的大小是动态的或者未知的。**Flexbox 布局主要思想是让容器能够改变其子元素的宽度、高度和顺序以最好地填充可用空间**（主要是为了适应所有类型的显示设备和屏幕大小）。

## 如何声明 flex 布局

```css
element {
  display: flex;
  /* display: inline-flex */
}
```

这里介绍两个概念 **flex 容器**，**flex 项目**

1. **flex 容器（flex container）**：你可以通过将一个元素的 `display` 属性设置为 `flex` 或 `inline-flex` 来创建一个 flex 容器。
2. **flex 项目（flex items）**：flex 容器内的直接子元素自动成为 flex 项目

![flex布局-image1](https://bu.dusays.com/2025/07/22/687ee45cae8cb.png) 这里的 `flex` `inline-flex` 说明一下： `flex` 会使容器表现为**块级**元素，而 `inline-flex` 会使容器表现为**内联**元素

- 设置为 `display: flex` 时，flex 容器未显式设置与宽度相关的属性时，其宽度与其父容器等同（相当于 width: 100% ）
- 设置为 `display: inline-flex` 时，flex 容器未显式设置与宽度相关的属性时，其**宽度等同于所有 flex 项目的宽度和**

使用建议： ![flex布局-image2](https://bu.dusays.com/2025/07/22/687ee49d4a795.png) 使用 `display: inline-flex` 时最好结合 `min-width` 和 `min-height` 一起使用。不建议显式设置 `width` 和 `height`

## 设置`display: flex`后发生了什么？

flex 项目们**默认会水平单行排列，无论多少个项目都会在一行内展示，可能会发生压缩**。默认排列的方向被称为主轴方向，也会有一个侧轴。需要使用后续一些 flex 相关的 css 属性进行布局调整。

**注意**：display 设置为 flex 时，flex 容器从表现形式上类似于块容器，事实它是一个 flex 容器，上下文格式是 FFC（Flexbox Formatting Content），因此运用于块容器（Block Formatting Content）上的一些布局属性就不再适用，比如：

- CSS 的 `float` 和 `clear` 属性在 flex 项目上不起作用，也不会让 flex 项目脱离文档流
- CSS 的 `vertical-align` 属性在 flex 项目上不起作用
- CSS 伪元素 `::first-line` 和 `::first-letter` 在 flex 容器上不起作用，而且 flex 容器不会为其祖先提供首行或首字母格式化

## flex 容器中的主轴和交叉轴

flex 项目**默认按照主轴方向排列**

![flex布局-image3](https://bu.dusays.com/2025/07/22/687ee7489e219.png)

### 3.1 如何修改主轴方向

**`flex-direction`**: 决定了 flex 容器内部 flex 项的排列方式

| 属性值              | 描述                                                                                                                                       |
| :------------------ | :----------------------------------------------------------------------------------------------------------------------------------------- |
| `row`<br>（默认值） | flex 项目沿着文本的书写方向水平排列，即**从左到右**排列<br>（在 RTL（从右到左）的语言环境中，如阿拉伯语和希伯来语，flex 项将从右到左排列） |
| `row-reverse`       | 与 `row` 相似，但是 flex 项目的开始和结束位置相反，即**从右到左**排列<br>（在 RTL 环境中，将从左到右排列）                                 |
| `column`            | flex 项目将垂直排列，**从上到下**                                                                                                          |
| `column-reverse`    | 与 `column` 相似，但 flex 项目的开始和结束位置相反，即**从下到上**排列                                                                     |

### 3.2 主轴方向的对齐方式

**主轴方向上的排列方式**是通过`justify-content`属性来控制的。该属性定义了容器中**项目对齐主轴**的方式，以下是该属性可接受的值：

| 属性值          | 描述                                                                                         |
| --------------- | -------------------------------------------------------------------------------------------- |
| `flex-start`    | 项目靠近主轴的起点排列                                                                       |
| `flex-end`      | 项目靠近主轴的终点排列                                                                       |
| `center`        | 项目居中排列在主轴上                                                                         |
| `space-between` | 项目在主轴上平均分布，第一个项目靠近起点，最后一个项目靠近终点，其余项目平分剩余空间         |
| `space-around`  | 项目在主轴上平均分布，但所有项目两侧的空间相同，因此项目之间的空间是项目与容器边缘空间的两倍 |
| `space-evenly`  | 项目在主轴上平均分布，所有项目与容器边缘的空间以及项目之间的空间都相等                       |

![flex布局-image4](https://bu.dusays.com/2025/07/22/687ee80c720ce.png)

### 3.3 交叉轴方向的对齐方式

**当 flex 项目宽度超过 flex 容器宽度，默认情况下会被压缩（`flex-shrink`默认值为 1），而非换行展示**，想要换行展示需要是用`flex-wrap`属性 `flex-wrap` 属性在 flex 布局中用于控制 flex 项是否换行以及如何换行。这个属性对于管理当 flex 容器空间不足以容纳所有 flex 项在一行或一列（取决于主轴方向）时的布局非常有用，`flex-wrap` 属性的可选值如下：

| 属性值             | 描述                                                                                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nowrap`（默认值） | 所有 flex 项会尽可能在一行（或一列）上排列。<br>如果 flex 项总宽度（或高度）超过了容器的宽度（或高度），flex 项将不会换行，而是会缩小尺寸或者溢出容器                                 |
| `wrap`             | flex 项将会在必要时换行到新的行（或列）。<br>第一行（或列）的项将位于容器的顶部（或起始边），而新行（或列）将被添加在当前行（或列）的下面（或结束边）                                 |
| `wrap-reverse`     | 与 wrap 类似，flex 项也会在必要时换行。<br>**但新行（或列）将位于当前行（或列）的上面（或起始边）**。这意味着 flex 容器内的第一行（或列）将出现在底部（或结束边），新行依次堆叠在上面 |

> 可以使用`flex-flow`属性作为`flex-direction`和`flex-wrap`的简写（与顺序无关）

**设置交叉轴方向上的排列顺序**

通过设置容器上的`align-items` 属性 可以控制 flex 项目在交叉轴上面的排列方式 `align-items` 属性定义了 flex 容器内所有 flex 项在交叉轴上的对齐方式。这个属性可以接受如下的值：

| 属性值              | 描述                                                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `stretch`（默认值） | flex 项会被拉伸以填满容器在交叉轴上的高度。<br>**除非 flex 项已经设置了具体的高度**（或宽度，如果 flex-direction 是 column 或 column-reverse） |
| `flex-start`        | 所有 flex 项向交叉轴的起始边界对齐                                                                                                             |
| `flex-end`          | 所有 flex 项向交叉轴的结束边界对齐                                                                                                             |
| `center`            | 所有 flex 项在交叉轴上居中对齐                                                                                                                 |
| `baseline`          | 所有 flex 项根据它们的基线进行对齐                                                                                                             |

![flex布局-image5](https://bu.dusays.com/2025/07/22/687eedd8b0365.png)

**设置多行 flex 子项的对齐方式**

跟 `align-items` 类似的属性 `align-content`, `align-items` 用于**单行 flex 子项的对齐**方式，而 `align-content` 用于**多行 flex 子项之间的间隔和分布**。如果 flex 子项不换行，`align-content` 属性不会有任何效果。 `align-content` 属性可以接受以下值：

| 属性值              | 描述                                                                   |
| ------------------- | ---------------------------------------------------------------------- |
| `flex-start`        | 所有行紧靠在容器的交叉轴起始边缘                                       |
| `flex-end`          | 所有行紧靠在容器的交叉轴结束边缘                                       |
| `center`            | 所有行在交叉轴方向上居中对齐                                           |
| `space-between`     | 所有行在交叉轴方向上均匀分布，第一行贴近起始边缘，最后一行贴近结束边缘 |
| `space-around`      | 所有行在交叉轴方向上均匀分布，每个行在前后都有相同的空间               |
| `space-evenly`      | 所有行在交叉轴方向上均匀分布，每个行之间的间隔相同                     |
| `stretch`（默认值） | 所有行将会被拉伸以占用交叉轴方向上的剩余空间                           |

![flex布局-image6](https://bu.dusays.com/2025/07/22/687eed9923776.png)

### 3.4 flex 对齐特性

- `justify` 表示水平方向的样式设置；
- `align` 表示垂直方向的样式设置；
- `items` 表示全体元素的样式设置；
- `content` 表示整体布局的样式设置；
- `self` 表示元素自身的样式设置，其一定是应用在子元素上的。

## flex 项目

上面说了 `justify-content`, `align-items`, `align-content`，对齐方式，接下来说说 flex 项目自己的对齐方式

### `align-self`

| 属性值       | 描述                                           |
| ------------ | ---------------------------------------------- |
| `auto`       | flex 项将继承 flex 容器的 align-items 属性的值 |
| `flex-start` | flex 项会被放置在容器的起始边缘                |
| `flex-end`   | flex 项会被放置在容器的结束边缘                |
| `center`     | flex 项会被居中放置在容器内部                  |
| `baseline`   | flex 项的基线会与其他 flex 项的基线对齐        |
| `stretch`    | flex 项会被拉伸填满容器在交叉轴上的空间        |

![flex布局-image7](https://bu.dusays.com/2025/07/22/687eeeeccb28d.png)

### `order`

在 flex 项目上，还可以使用 `order` 指定具体的数值，**在不改变 DOM 结构之下对 flex 项目进行排序，其中数值越大，越在往后排, 默认值是 `0`**

### `flex-grow`

用于**控制 flex 项目在主轴上的增长比例。它定义了每个 flex 项目相对于其他项目在剩余空间中分配的比例分配规则**，默认值为 `0`。

![flex布局-image8](https://bu.dusays.com/2025/07/22/687ef7b48f574.png)

**常见应用**：

**粘底布局**

```html :collapsed-lines
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>粘底布局</title>
    <style>
      * {
        margin: 0;
      }

      .flex-box {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      .header {
        height: 100px;
        background-color: #fca;
      }

      .footer {
        height: 200px;
        background-color: #fac;
        order: 2;
      }

      .main {
        flex-grow: 1;
        background-color: greenyellow;
        /* 此时需要设置外层容器的高度*/
        flex-grow: 1;
        order: 1;
      }
    </style>
  </head>

  <body>
    <div class="flex-box">
      <div class="main">MAIN</div>
      <div class="header">HEADER</div>
      <div class="footer">FOOTER</div>
    </div>
  </body>
</html>
```

**三栏布局**

```html :collapsed-lines
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>三栏布局</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }

      .flex-box {
        display: flex;
      }

      .left {
        width: 100px;
        height: 100px;
        background-color: #fca;
      }

      .right {
        width: 100px;
        height: 100px;
        background-color: #fac;
        order: 2;
      }

      .center {
        flex-grow: 1;
        height: 300px;
        background-color: greenyellow;
        order: 1;
      }
    </style>
  </head>

  <body>
    <div class="flex-box">
      <!-- center为为主体内容，优先渲染 -->
      <div class="center"></div>
      <div class="left"></div>
      <div class="right"></div>
    </div>
  </body>
</html>
```

### `flex-shrink`

用于控制 flex 项目**在主轴上**的收缩比例。它定义了当空间不足时，每个 flex 项目相对于其他项目的收缩比例收缩\*\*规则，默认值是 `1`。

![flex布局-image9](https://bu.dusays.com/2025/07/22/687ef8d336604.png)

### `flex-basis`

**flex-basis** 是 flex 布局中的一个属性，用于**设置 flex 项目在主轴上的初始尺寸**。它定义了一个项目在分配多余空间之前的基本大小。默认值为`auto`表示根据内容自动分配。

#### `flex-basis` 和 `width` 的区别

![flex布局-image10](https://bu.dusays.com/2025/07/22/687ef96327cdc.png)

对于设置了`flex-basis`的元素来说：

- 元素内容区域撑开的尺寸 > `flex-basis`值: 元素尺寸为内容尺寸
- 元素内容区域撑开的尺寸 < `flex-basis`值: 元素尺寸为 `flex-basis`值

对于设置了`width`的元素来说：

- 元素内容区域撑开的尺寸 > `width`值: 元素尺寸为`width`值
- 元素内容区域撑开的尺寸 < `width`值: 元素尺寸为 `width`值

对于同时设置了`flex-basis`和`width`的元素来说：

- 元素的尺寸为：**max(flex-basis, min(width, 内容宽度))**

在 flex 布局中最好使用 `flex-basis`

`flex-basis` 还支持一些关键字, 直接忽略 `width` 属性的作用

- `max-content`: 文字不换行最大区域
- `min-content`: 文字自然换行最小区域
- `content`: 和 `max-content` 效果一致
- `fit-content`: 作用不详

### flex

在 flex 布局中，**flex** 是一个用于设置 **flex-grow**、**flex-shrink** 和 **flex-basis** 三个属性的缩写属性；

| **单值语法**  | **等同于**     | **备注**             |
| ------------- | -------------- | -------------------- |
| flex: initial | flex: 0 1 auto | 初始值，常用         |
| flex: 0       | flex: 0 1 0%   | 适用场景少           |
| flex: none    | flex: 0 0 auto | 推荐                 |
| flex: 1       | flex: 1 1 0%   | 推荐                 |
| flex: auto    | flex: 1 1 auto | 适用场景少，但很有用 |

**通过在浏览器中调整 flex 容器的宽度来感受 flex 属性**

```html :collapsed-lines
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>从财产分配看flex</title>
    <style>
      .flex-box {
        display: flex;
        width: 1000px;
      }

      .item:nth-of-type(1) {
        flex: 0 2 100px;
        background-color: #fea;
      }

      .item:nth-of-type(2) {
        flex: 0 1 100px;
        background-color: #fca;
      }

      .item:nth-of-type(3) {
        flex: 0 0 100px;
        background-color: #abc;
      }

      .item:nth-of-type(4) {
        flex: 1 0 20px;
        background-color: #acb;
      }

      .item:nth-of-type(5) {
        flex: 2 0 20px;
        background-color: #bac;
      }
    </style>
  </head>

  <body>
    <div class="flex-box">
      <div class="item">老大</div>
      <div class="item">老二</div>
      <div class="item">老三</div>
      <div class="item">老四</div>
      <div class="item">老小</div>
    </div>
  </body>
</html>
```

**利用 `flex:auto` 实现宽度自适应导航栏**

```html :collapsed-lines
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>宽度自适应导航栏</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .list {
        display: flex;
        height: 100px;
        line-height: 100px;
      }

      .nav {
        background-color: #fca;
        /* 1 1 auto */
        flex: auto;
        text-align: center;
        border-left: 1px solid #fff;
      }
    </style>
  </head>

  <body>
    <ui class="list">
      <li class="nav">我们</li>
      <li class="nav">商品页</li>
      <li class="nav">购物车页</li>
      <li class="nav">我是一个页</li>
      <li class="nav">我也是一个页</li>
    </ui>
  </body>
</html>
```

### flex-gap

在 flex 布局中，**gap** 是一个用于设置项目之间的间隙的属性。它是 **row-gap** 和 **column-gap** 的简写形式，用于定义主轴和交叉轴上的间隙大小。具体来说，**gap** 属性接受一个长度值，表示项目之间的间隙大小。可以使用一个值来同时设置主轴和交叉轴上的间隙，也可以使用两个值分别设置主轴和交叉轴上的间隙。

![flex布局-image11](https://bu.dusays.com/2025/07/22/687efa144403c.png)

```html :collapsed-lines
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>flex实现网格布局</title>
    <style>
      .box {
        width: 400px;
        display: flex;
        flex-wrap: wrap;
        row-gap: 10px;
        column-gap: 20px;
      }

      .item {
        background-color: red;
        flex: 1 1 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
      }
    </style>
  </head>

  <body>
    <div class="box">
      <div class="item">1</div>
      <div class="item">2</div>
      <div class="item">3</div>
      <div class="item">4</div>
      <div class="item">5</div>
      <div class="item">6</div>
      <div class="item">7</div>
      <div class="item">8</div>
    </div>
  </body>
</html>
```

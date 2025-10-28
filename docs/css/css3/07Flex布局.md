# ✨Flex 弹性盒布局 👌

[[TOC]]

对于布局，之前我们学习过浮动和定位，但那些本身不算真正的布局方案。接下来要学习的 Flex 才属于真正的 CSS 布局技术。

Flexbox（弹性盒模型）是 CSS3 中引入的一种新的布局模式。它提供了一种更加高效的方式来布局、对齐和分配容器内项目的空间，即使它们的大小是动态的或者未知的。

**Flex 布局的核心思想：**

- 让容器能够改变其子元素的宽度、高度和顺序
- 以最佳方式填充可用空间
- 适应所有类型的显示设备和屏幕大小
- 解决传统布局方案的局限性

## 1. 如何声明 Flex 布局

通过设置 `display` 属性来创建 Flex 容器：

```css :collapsed-lines
.container {
  display: flex;
  /* 或者 */
  /* display: inline-flex; */
}
```

### 1.1 核心概念

**Flex 容器（Flex Container）**

- 通过设置 `display: flex` 或 `display: inline-flex` 创建
- 成为 Flex 布局的父容器
- 建立 Flex 格式化上下文（FFC）

**Flex 项目（Flex Items）**

- Flex 容器内的直接子元素
- 自动成为 Flex 项目
- 受 Flex 布局规则控制

![flex布局-image1](https://bu.dusays.com/2025/07/22/687ee45cae8cb.png)

### 1.2 flex 与 inline-flex 的区别

| 属性值        | 容器表现 | 宽度行为                          | 使用场景           |
| ------------- | -------- | --------------------------------- | ------------------ |
| `flex`        | 块盒     | 默认占满父容器宽度（width: 100%） | 大多数布局场景     |
| `inline-flex` | 行块盒   | 宽度等于所有子项宽度之和          | 内联布局、组件封装 |

::: tip 使用建议

- `display: flex` 适用于大部分布局场景
- `display: inline-flex` 最好结合 `min-width` 和 `min-height` 使用
- 不建议对 `inline-flex` 容器显式设置 `width` 和 `height`
  :::

![flex布局-image2](https://bu.dusays.com/2025/07/22/687ee49d4a795.png)

## 2. 设置 display: flex 后发生了什么？

### 2.1 默认行为

当设置 `display: flex` 后，会发生以下变化：

1. **水平单行排列**：Flex 项目默认水平排列在一行内
2. **自动压缩**：无论多少个项目都会在一行内展示，可能发生压缩
3. **建立坐标系**：形成主轴（默认水平）和交叉轴（默认垂直）
4. **格式化上下文**：建立 FFC（Flexbox Formatting Context）

### 2.2 失效的 CSS 属性

::: warning 注意
设置 `display: flex` 后，以下 CSS 属性将失效：

- `float` 和 `clear` - 在 Flex 项目上不起作用，也不会脱离文档流
- `vertical-align` - 在 Flex 项目上不起作用
- `::first-line` 和 `::first-letter` - 在 Flex 容器上不起作用
- `column-*` - 多列布局属性失效
  :::

## 3. Flex 容器中的主轴和交叉轴

Flex 布局基于两个轴线：**主轴（Main Axis）** 和 **交叉轴（Cross Axis）**。

- **主轴**：Flex 项目的主要排列方向
- **交叉轴**：垂直于主轴的方向
- Flex 项目默认沿主轴方向排列

![flex布局-image3](https://bu.dusays.com/2025/07/22/687ee7489e219.png)

### 3.1 修改主轴方向 - flex-direction

`flex-direction` 属性决定了 Flex 容器内部 Flex 项目的排列方向。

| 属性值           | 描述                                                                                                                                   |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| `row`（默认）    | flex 项目沿着文本的书写方向水平排列，即**从左到右**排列（在 RTL（从右到左）的语言环境中，如阿拉伯语和希伯来语，flex 项将从右到左排列） |
| `row-reverse`    | 与 `row` 相似，但是 flex 项目的开始和结束位置相反，即**从右到左**排列（在 RTL 环境中，将从左到右排列）                                 |
| `column`         | flex 项目将垂直排列，**从上到下**                                                                                                      |
| `column-reverse` | 与 `column` 相似，但 flex 项目的开始和结束位置相反，即**从下到上**排列                                                                 |

### 3.2 主轴方向的对齐方式 - justify-content

`justify-content` 属性控制 Flex 项目在主轴上的对齐方式，定义了项目如何分布在主轴上。

| 属性值          | 描述                                                                                         |
| --------------- | -------------------------------------------------------------------------------------------- |
| `flex-start`    | 项目靠近主轴的起点排列                                                                       |
| `flex-end`      | 项目靠近主轴的终点排列                                                                       |
| `center`        | 项目居中排列在主轴上                                                                         |
| `space-between` | 项目在主轴上平均分布，第一个项目靠近起点，最后一个项目靠近终点，其余项目平分剩余空间         |
| `space-around`  | 项目在主轴上平均分布，但所有项目两侧的空间相同，因此项目之间的空间是项目与容器边缘空间的两倍 |
| `space-evenly`  | 项目在主轴上平均分布，所有项目与容器边缘的空间以及项目之间的空间都相等                       |

![flex布局-image4](https://bu.dusays.com/2025/07/22/687ee80c720ce.png)

### 3.3 换行控制 - flex-wrap

默认情况下，当 Flex 项目宽度超过容器宽度时，会被压缩（`flex-shrink` 默认值为 1）而不换行。

`flex-wrap` 属性控制 Flex 项目是否换行以及如何换行：

| 属性值           | 描述                                                                                                                                                                              |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nowrap`（默认） | 所有 flex 项会尽可能在一行（或一列）上排列。如果 flex 项总宽度（或高度）超过了容器的宽度（或高度），flex 项将不会换行，而是会缩小尺寸或者溢出容器                                 |
| `wrap`           | flex 项将会在必要时换行到新的行（或列）。第一行（或列）的项将位于容器的顶部（或起始边），而新行（或列）将被添加在当前行（或列）的下面（或结束边）                                 |
| `wrap-reverse`   | 与 wrap 类似，flex 项也会在必要时换行。**但新行（或列）将位于当前行（或列）的上面（或起始边）**。这意味着 flex 容器内的第一行（或列）将出现在底部（或结束边），新行依次堆叠在上面 |

::: tip 简写属性
可以使用 `flex-flow` 属性作为 `flex-direction` 和 `flex-wrap` 的简写：

```css :collapsed-lines
.container {
  /* flex-flow: <flex-direction> <flex-wrap> */
  flex-flow: row wrap;
  /* 等同于 */
  flex-direction: row;
  flex-wrap: wrap;
}
```

:::

### 3.4 交叉轴方向的对齐方式 - align-items

`align-items` 属性定义了 Flex 容器内所有 Flex 项目在交叉轴上的对齐方式。

| 属性值            | 描述                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `stretch`（默认） | flex 项会被拉伸以填满容器在交叉轴上的高度。**除非 flex 项已经设置了具体的高度**（或宽度，如果 flex-direction 是 column 或 column-reverse） |
| `flex-start`      | 所有 flex 项向交叉轴的起始边界对齐                                                                                                         |
| `flex-end`        | 所有 flex 项向交叉轴的结束边界对齐                                                                                                         |
| `center`          | 所有 flex 项在交叉轴上居中对齐                                                                                                             |
| `baseline`        | 所有 flex 项根据它们的基线进行对齐                                                                                                         |

![flex布局-image5](https://bu.dusays.com/2025/07/22/687eedd8b0365.png)

### 3.5 多行对齐方式 - align-content

`align-content` 属性用于设置多行 Flex 项目的对齐方式：

- `align-items`：控制单行内项目在交叉轴上的对齐
- `align-content`：控制多行之间在交叉轴上的分布

::: warning 注意
如果 Flex 项目不换行（单行），`align-content` 属性不会有任何效果。
:::

| 属性值            | 描述                                                                   |
| ----------------- | ---------------------------------------------------------------------- |
| `flex-start`      | 所有行紧靠在容器的交叉轴起始边缘                                       |
| `flex-end`        | 所有行紧靠在容器的交叉轴结束边缘                                       |
| `center`          | 所有行在交叉轴方向上居中对齐                                           |
| `space-between`   | 所有行在交叉轴方向上均匀分布，第一行贴近起始边缘，最后一行贴近结束边缘 |
| `space-around`    | 所有行在交叉轴方向上均匀分布，每个行在前后都有相同的空间               |
| `space-evenly`    | 所有行在交叉轴方向上均匀分布，每个行之间的间隔相同                     |
| `stretch`（默认） | 所有行将会被拉伸以占用交叉轴方向上的剩余空间                           |

![flex布局-image6](https://bu.dusays.com/2025/07/22/687eed9923776.png)

### 3.6 Flex 对齐属性规律

理解 Flex 对齐属性的命名规律：

| 前缀       | 含义             | 应用对象  |
| ---------- | ---------------- | --------- |
| `justify-` | 主轴方向的对齐   | 容器      |
| `align-`   | 交叉轴方向的对齐 | 容器/项目 |

| 后缀       | 含义               | 作用范围 |
| ---------- | ------------------ | -------- |
| `-items`   | 所有项目的对齐方式 | 容器属性 |
| `-content` | 整体内容的分布方式 | 容器属性 |
| `-self`    | 单个项目的对齐方式 | 项目属性 |

## 4. Flex 项目属性

前面介绍了容器的对齐属性，接下来学习 Flex 项目自身的属性。

### 4.1 单独对齐 - align-self

`align-self` 属性允许单个 Flex 项目覆盖容器的 `align-items` 设置：

| 属性值       | 描述                                           |
| ------------ | ---------------------------------------------- |
| `auto`       | flex 项将继承 flex 容器的 align-items 属性的值 |
| `flex-start` | flex 项会被放置在容器的起始边缘                |
| `flex-end`   | flex 项会被放置在容器的结束边缘                |
| `center`     | flex 项会被居中放置在容器内部                  |
| `baseline`   | flex 项的基线会与其他 flex 项的基线对齐        |
| `stretch`    | flex 项会被拉伸填满容器在交叉轴上的空间        |

![flex布局-image7](https://bu.dusays.com/2025/07/22/687eeeeccb28d.png)

### 4.2 排序 - order

`order` 属性可以在**不改变 DOM 结构的情况下对 Flex 项目进行排序**：

- **默认值**：`0`
- **排序规则**：数值越小越靠前，数值越大越靠后
- **支持负值**：可以使用负数让项目排在最前面

```css :collapsed-lines
.item-1 {
  order: 3;
} /* 排在第三位 */

.item-2 {
  order: 1;
} /* 排在第一位 */

.item-3 {
  order: 2;
} /* 排在第二位 */

.item-4 {
  order: -1;
} /* 排在最前面 */
```

### 4.3 放大比例 - flex-grow

`flex-grow` 属性定义 Flex 项目的放大比例：

- **默认值**：`0`（不放大）
- **作用**：当容器有剩余空间时，按比例分配给各项目
- **计算方式**：剩余空间 × (当前项目的 flex-grow / 所有项目 flex-grow 之和)

![flex布局-image8](https://bu.dusays.com/2025/07/22/687ef7b48f574.png)

#### 4.3.1 常见应用

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

### 4.4 缩小比例 - flex-shrink

`flex-shrink` 属性定义 Flex 项目的缩小比例：

- **默认值**：`1`（等比例缩小）
- **作用**：当容器空间不足时，按比例缩小各项目
- **特殊值**：`0` 表示不缩小
- **计算方式**：超出空间 × (当前项目的 flex-shrink × 基础大小 / 所有项目的加权和)

![flex布局-image9](https://bu.dusays.com/2025/07/22/687ef8d336604.png)

### 4.5 基础大小 - flex-basis

`flex-basis` 属性设置 Flex 项目在主轴上的初始尺寸：

- **默认值**：`auto`（根据内容自动计算）
- **作用**：定义项目在**分配剩余空间之前的基础大小**
- **优先级**：比 `width`/`height` 优先级更高

#### 4.5.1 flex-basis 与 width 的区别

![flex布局-image10](https://bu.dusays.com/2025/07/22/687ef96327cdc.png)

**flex-basis 的尺寸计算：**

- 内容尺寸 > `flex-basis` 值 → 元素尺寸 = 内容尺寸
- 内容尺寸 < `flex-basis` 值 → 元素尺寸 = `flex-basis` 值

**width 的尺寸计算：**

- 内容尺寸 > `width` 值 → 元素尺寸 = `width` 值（可能溢出）
- 内容尺寸 < `width` 值 → 元素尺寸 = `width` 值

**同时设置时的优先级：**

```
最终尺寸 = max(flex-basis, min(width, 内容宽度))
```

::: tip 最佳实践
在 Flex 布局中推荐使用 `flex-basis` 而不是 `width`/`height`
:::

#### 4.5.2 flex-basis 的关键字值

`flex-basis` 除了`auto`外还支持以下关键字值（会忽略 `width` 属性）：

| 关键字        | 描述                                 | 使用场景         |
| ------------- | ------------------------------------ | ---------------- |
| `max-content` | 内容不换行时的最大宽度               | 让内容完全展开   |
| `min-content` | 内容自然换行时的最小宽度             | 最紧凑的布局     |
| `content`     | 等同于 `max-content`                 | 基于内容的自适应 |
| `fit-content` | 介于 min-content 和 max-content 之间 | 自适应内容宽度   |

### 4.6 综合属性 - flex

`flex` 是 `flex-grow`、`flex-shrink` 和 `flex-basis` 三个属性的缩写：

```css :collapsed-lines
.item {
  /* flex: <flex-grow> <flex-shrink> <flex-basis> */
  flex: 1 1 auto;

  /* 等同于 */
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
}
```

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

### 4.7 间隙设置 - gap

`gap` 属性用于设置 Flex 项目之间的间隙：

- **简写形式**：`gap` = `row-gap` + `column-gap`
- **单值语法**：`gap: 20px`（主轴和交叉轴间隙相同）
- **双值语法**：`gap: 20px 10px`（行间隙 列间隙）

```css :collapsed-lines
.container {
  display: flex;
  gap: 20px; /* 所有方向间隙 20px */
  /* 或者 */
  gap: 20px 10px; /* 行间隙 20px，列间隙 10px */
  /* 或者 */
  row-gap: 20px; /* 行间隙 */
  column-gap: 10px; /* 列间隙 */
}
```

![flex布局-image11](https://bu.dusays.com/2025/07/22/687efa144403c.png)

#### 4.7.1 flex 实现网格布局

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

## 5. 常见 Flex 布局模式

### 5.1 水平垂直居中

**HTML 结构：**

```html :collapsed-lines
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Flex 水平垂直居中</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      .center-container {
        display: flex;
        justify-content: center; /* 主轴居中 */
        align-items: center; /* 交叉轴居中 */
        height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .center-box {
        width: 200px;
        height: 200px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="center-container">
      <div class="center-box">完美居中</div>
    </div>
  </body>
</html>
```

**CSS 核心代码：**

```css :collapsed-lines
.center-container {
  display: flex;
  justify-content: center; /* 主轴居中 */
  align-items: center; /* 交叉轴居中 */
  height: 100vh;
}
```

### 5.2 等高布局

**HTML 结构：**

```html :collapsed-lines
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Flex 等高布局</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: "Arial", sans-serif;
        background-color: #f5f5f5;
        padding: 20px;
      }

      .equal-height {
        display: flex;
        gap: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .equal-height .item {
        flex: 1; /* 等宽分布 */
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        border-left: 4px solid #3498db;
      }

      .item h3 {
        color: #2c3e50;
        margin-bottom: 15px;
        font-size: 18px;
      }

      .item p {
        color: #7f8c8d;
        line-height: 1.6;
        margin-bottom: 10px;
      }

      .item:nth-child(2) {
        border-left-color: #e74c3c;
      }

      .item:nth-child(3) {
        border-left-color: #2ecc71;
      }
    </style>
  </head>
  <body>
    <div class="equal-height">
      <div class="item">
        <h3>卡片 1</h3>
        <p>这是第一个卡片的内容。</p>
        <p>内容相对较少。</p>
      </div>
      <div class="item">
        <h3>卡片 2</h3>
        <p>这是第二个卡片的内容。</p>
        <p>这个卡片有更多的内容。</p>
        <p>可以看到所有卡片的高度都是相等的。</p>
        <p>这就是 Flex 布局的优势。</p>
      </div>
      <div class="item">
        <h3>卡片 3</h3>
        <p>这是第三个卡片。</p>
        <p>无论内容多少，高度都会自动调整。</p>
        <p>非常适合做响应式布局。</p>
      </div>
    </div>
  </body>
</html>
```

**CSS 核心代码：**

```css :collapsed-lines
.equal-height {
  display: flex;
  gap: 20px; /* 项目间距 */
}

.equal-height .item {
  flex: 1; /* 等宽分布，自动等高 */
}
```

### 5.3 圣杯布局

**HTML 结构：**

```html :collapsed-lines
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Flex 圣杯布局</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: "Arial", sans-serif;
      }

      .holy-grail {
        display: flex;
        min-height: 100vh;
        flex-direction: column;
      }

      .header {
        background: #3498db;
        color: white;
        padding: 20px;
        text-align: center;
        flex-shrink: 0; /* 不缩小 */
      }

      .main {
        display: flex;
        flex: 1; /* 占据剩余空间 */
      }

      .sidebar {
        background: #2c3e50;
        color: white;
        padding: 20px;
        flex-basis: 200px;
        flex-shrink: 0;
      }

      .content {
        background: #ecf0f1;
        padding: 20px;
        flex: 1;
      }

      .sidebar-right {
        background: #34495e;
        color: white;
        padding: 20px;
        flex-basis: 180px;
        flex-shrink: 0;
      }

      .footer {
        background: #e74c3c;
        color: white;
        padding: 20px;
        text-align: center;
        flex-shrink: 0; /* 不缩小 */
      }

      .sidebar h3,
      .sidebar-right h3 {
        margin-bottom: 15px;
        font-size: 16px;
      }

      .sidebar ul,
      .sidebar-right ul {
        list-style: none;
      }

      .sidebar li,
      .sidebar-right li {
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .content h2 {
        color: #2c3e50;
        margin-bottom: 20px;
      }

      .content p {
        line-height: 1.6;
        margin-bottom: 15px;
        color: #7f8c8d;
      }

      @media (max-width: 768px) {
        .main {
          flex-direction: column;
        }

        .sidebar,
        .sidebar-right {
          flex-basis: auto;
        }
      }
    </style>
  </head>
  <body>
    <div class="holy-grail">
      <header class="header">
        <h1>网站头部</h1>
      </header>

      <main class="main">
        <aside class="sidebar">
          <h3>左侧导航</h3>
          <ul>
            <li>首页</li>
            <li>产品</li>
            <li>服务</li>
            <li>关于我们</li>
            <li>联系我们</li>
          </ul>
        </aside>

        <section class="content">
          <h2>主要内容区域</h2>
          <p>
            这里是网站的主要内容区域。圣杯布局是一种经典的网页布局方式，具有头部、底部、左右侧边栏和主内容区域。
          </p>
          <p>
            使用 Flex
            布局可以很容易实现这种布局，并且具有良好的响应式特性。当屏幕宽度不够时，侧边栏会自动换行到下方。
          </p>
          <p>主内容区域会自动占据剩余的所有空间，无论侧边栏的高度如何变化。</p>
        </section>

        <aside class="sidebar-right">
          <h3>右侧边栏</h3>
          <ul>
            <li>热门文章</li>
            <li>最新动态</li>
            <li>推荐内容</li>
            <li>广告位</li>
          </ul>
        </aside>
      </main>

      <footer class="footer">
        <p>&copy; 2024 网站底部信息</p>
      </footer>
    </div>
  </body>
</html>
```

**CSS 核心代码：**

```css :collapsed-lines
.holy-grail {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.header,
.footer {
  flex-shrink: 0; /* 不缩小 */
}

.main {
  display: flex;
  flex: 1; /* 占据剩余空间 */
}

.content {
  flex: 1; /* 主内容区域占据剩余空间 */
}

.sidebar {
  flex-basis: 200px; /* 固定宽度 */
  flex-shrink: 0; /* 不缩小 */
}
```

### 5.4 响应式导航

**HTML 结构：**

```html :collapsed-lines
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Flex 响应式导航</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: "Arial", sans-serif;
        background-color: #f8f9fa;
      }

      .navbar {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem 2rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .nav {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        list-style: none;
        max-width: 1200px;
        margin: 0 auto;
      }

      .nav-item {
        flex: 1 1 auto;
        min-width: 120px;
      }

      .nav-item a {
        display: block;
        padding: 12px 20px;
        color: white;
        text-decoration: none;
        text-align: center;
        border-radius: 6px;
        transition: all 0.3s ease;
        font-weight: 500;
      }

      .nav-item a:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }

      .nav-item.active a {
        background: rgba(255, 255, 255, 0.3);
        font-weight: bold;
      }

      .content {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 0 2rem;
      }

      .demo-section {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }

      .demo-section h2 {
        color: #2c3e50;
        margin-bottom: 1rem;
      }

      .demo-section p {
        color: #7f8c8d;
        line-height: 1.6;
      }

      /* 响应式设计 */
      @media (max-width: 768px) {
        .navbar {
          padding: 1rem;
        }

        .nav {
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          min-width: auto;
        }

        .nav-item a {
          text-align: left;
        }
      }

      @media (max-width: 480px) {
        .nav-item a {
          padding: 10px 15px;
          font-size: 14px;
        }
      }
    </style>
  </head>
  <body>
    <nav class="navbar">
      <ul class="nav">
        <li class="nav-item active">
          <a href="#home">首页</a>
        </li>
        <li class="nav-item">
          <a href="#products">产品中心</a>
        </li>
        <li class="nav-item">
          <a href="#services">服务支持</a>
        </li>
        <li class="nav-item">
          <a href="#about">关于我们</a>
        </li>
        <li class="nav-item">
          <a href="#news">新闻资讯</a>
        </li>
        <li class="nav-item">
          <a href="#contact">联系我们</a>
        </li>
      </ul>
    </nav>

    <div class="content">
      <div class="demo-section">
        <h2>响应式导航演示</h2>
        <p>
          这是一个使用 Flex
          布局实现的响应式导航栏。在桌面端，导航项会水平排列并自动分配宽度。
        </p>
        <p>
          当屏幕宽度小于 768px
          时，导航会自动切换为垂直布局，适应移动设备的显示。
        </p>
        <p>尝试调整浏览器窗口大小来查看响应式效果！</p>
      </div>

      <div class="demo-section">
        <h2>技术特点</h2>
        <p>
          <strong>弹性布局：</strong>使用 flex: 1 1 auto 让导航项自动分配空间
        </p>
        <p><strong>最小宽度：</strong>设置 min-width 确保导航项不会过度压缩</p>
        <p><strong>响应式：</strong>通过媒体查询在小屏幕上切换为垂直布局</p>
        <p><strong>用户体验：</strong>添加悬停效果和过渡动画提升交互体验</p>
      </div>
    </div>
  </body>
</html>
```

**CSS 核心代码：**

```css :collapsed-lines
.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.nav-item {
  flex: 1 1 auto; /* 自动伸缩 */
  min-width: 120px; /* 最小宽度 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav {
    flex-direction: column; /* 垂直排列 */
  }
}
```

## 6. Flex 布局最佳实践

### 6.1 性能优化

::: tip 性能建议

- 避免在大量元素上使用复杂的 Flex 计算
- 优先使用 `flex-basis` 而不是 `width`/`height`
- 合理使用 `flex-shrink: 0` 避免不必要的收缩计算
  :::

### 6.2 兼容性处理

```css :collapsed-lines
.flex-container {
  display: -webkit-box; /* 旧版 WebKit */
  display: -webkit-flex; /* WebKit */
  display: -ms-flexbox; /* IE 10 */
  display: flex; /* 标准语法 */
}
```

### 6.3 常见问题解决

**问题 1：Flex 项目被意外压缩**

```css :collapsed-lines
.item {
  flex-shrink: 0; /* 禁止收缩 */
  min-width: 0; /* 重置最小宽度 */
}
```

**问题 2：文本溢出**

```css :collapsed-lines
.text-item {
  min-width: 0; /* 允许收缩到内容以下 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

**问题 3：Safari 中的 Flex 问题**

```css :collapsed-lines
.safari-fix {
  flex-basis: auto; /* Safari 需要明确的 flex-basis */
  -webkit-flex-basis: auto;
}
```

## 7. 实际应用示例

### 7.1 卡片布局

```html :collapsed-lines
<div class="card-container">
  <div class="card">卡片1</div>
  <div class="card">卡片2</div>
  <div class="card">卡片3</div>
</div>
```

```css :collapsed-lines
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
}

.card {
  flex: 1 1 300px; /* 最小宽度300px，可伸缩 */
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
```

### 7.2 表单布局

```html :collapsed-lines
<form class="form">
  <div class="form-row">
    <label>姓名</label>
    <input type="text" />
  </div>
  <div class="form-row">
    <label>邮箱</label>
    <input type="email" />
  </div>
  <div class="form-actions">
    <button type="submit">提交</button>
    <button type="reset">重置</button>
  </div>
</form>
```

```css :collapsed-lines
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.form-row label {
  flex-basis: 80px;
  flex-shrink: 0;
}

.form-row input {
  flex: 1;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
```

## 8. 总结

### 8.1 核心概念回顾

| 概念      | 描述                            | 关键属性                                 |
| --------- | ------------------------------- | ---------------------------------------- |
| Flex 容器 | 设置了 `display: flex` 的父元素 | `justify-content`, `align-items`         |
| Flex 项目 | 容器的直接子元素                | `flex-grow`, `flex-shrink`, `flex-basis` |
| 主轴      | 项目排列的主要方向              | `flex-direction` 控制                    |
| 交叉轴    | 垂直于主轴的方向                | `align-items` 控制对齐                   |

### 8.2 属性速查表

**容器属性：**

- `display: flex` - 创建 Flex 容器
- `flex-direction` - 主轴方向
- `flex-wrap` - 是否换行
- `justify-content` - 主轴对齐
- `align-items` - 交叉轴对齐
- `align-content` - 多行对齐
- `gap` - 项目间隙

**项目属性：**

- `flex-grow` - 放大比例
- `flex-shrink` - 缩小比例
- `flex-basis` - 基础大小
- `flex` - 综合简写
- `align-self` - 单独对齐
- `order` - 排序

::: tip 学习建议

1. **理解轴线概念**：主轴和交叉轴是 Flex 布局的基础
2. **掌握常用属性**：`justify-content`、`align-items`、`flex` 是最常用的
3. **多做实践**：通过实际项目加深理解
   :::

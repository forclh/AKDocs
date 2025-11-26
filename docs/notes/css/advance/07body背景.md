# body 背景（扩展）👌

在 CSS 中，`body`元素的背景处理有其特殊性，涉及到画布（canvas）概念和背景传播机制。理解这些机制对于正确设置页面背景至关重要。

## 1. 画布（Canvas）概念

### 什么是画布

画布是浏览器渲染页面的基础区域，**注意：这里的 canvas 不是 HTML5 的`<canvas>`元素**，而是浏览器的渲染概念。

### 画布特点

- **最小宽度**：等于视口宽度（viewport width）
- **最小高度**：等于视口高度（viewport height）
- **实际尺寸**：会根据内容自动扩展

```css
/* 画布的概念示意 */
/* 画布尺寸 = max(视口尺寸, 内容尺寸) */
```

## 2. HTML 元素的背景

`html`元素的背景会直接覆盖整个画布区域。

```css
html {
  background-color: #f0f0f0;
  /* 背景会覆盖整个画布 */
}
```

**示例效果：**

```css
html {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  min-height: 100%; /* 确保覆盖整个视口 */
}
```

## 3. BODY 元素的背景传播机制

这是 CSS 中一个重要但容易被忽视的特性：**背景传播（Background Propagation）**。

### 3.1 当 HTML 元素有背景时

```css
html {
  background-color: #e0e0e0; /* HTML有背景 */
}

body {
  background-color: #ffffff; /* body背景正常显示，只覆盖body的边框盒 */
  margin: 20px;
  padding: 20px;
  border: 2px solid #ccc;
}
```

**结果：**

- HTML 背景覆盖整个画布
- body 背景只在 body 元素的边框盒内显示
- body 外的区域显示 HTML 背景

### 3.2 当 HTML 元素没有背景时

```css
html {
  /* 没有设置背景 */
}

body {
  background-color: #ffffff; /* body背景会传播到整个画布 */
  margin: 20px;
}
```

**结果：**

- body 的背景会自动传播到整个画布
- 即使 body 有 margin，背景仍覆盖整个画布
- 这是浏览器的默认行为

### 3.3 阻止背景传播

```css
html {
  background: transparent; /* 显式设置透明背景 */
}

body {
  background-color: #ffffff;
  margin: 20px;
}
```

## 4. 画布背景图的特殊规则

当背景图应用到画布时，其尺寸和位置计算有特殊规则：

### 4.1 尺寸计算

```css
body {
  background-image: url("bg.jpg");
  background-size: 50% 30%; /* 特殊的百分比计算 */
}
```

**计算规则：**

- **宽度百分比**：相对于**视口宽度**计算
- **高度百分比**：相对于**网页总高度**计算（包括滚动区域）

### 4.2 位置计算

```css
body {
  background-image: url("bg.jpg");
  background-position: 50% 20%; /* 位置百分比计算 */
}
```

**计算规则：**

- **横向位置百分比**：相对于**视口宽度**
- **纵向位置百分比**：相对于**网页总高度**

### 4.3 预设值的行为

```css
body {
  background-position: center top; /* 水平居中，顶部对齐 */
  background-position: right bottom; /* 右下角对齐 */
}
```

- **横向预设值**（left, center, right）：相对于视口
- **纵向预设值**（top, center, bottom）：相对于网页高度

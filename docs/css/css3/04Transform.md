# ✨Transform👌

[[TOC]]

利用 CSS 使元素完成几何变化，如 **平移、缩放、倾斜、旋转**。变换分为 **2D 变换** 和 **3D 变换**，属性差别不大，重点理解 3D 的相关原理。

::: tip 核心概念
Transform 是 CSS3 中最强大的视觉效果属性之一，它可以在不影响文档流的情况下对元素进行 2D 和 3D 变换。
:::

## 1. 2D 变换

2D 变换是在二维平面上对元素进行的几何变化，包括平移、缩放、旋转和倾斜。

### 1.1 变换坐标系

**标准笛卡尔坐标系：**
![transform-1](https://bu.dusays.com/2025/08/20/68a5226fc3759.png)

**Transform 坐标系：**
![transform-2](https://bu.dusays.com/2025/08/20/68a5226f8dfea.png)

Transform 的坐标系在标准笛卡尔坐标系基础上做了改变：

- **Y 轴方向**：从自下向上改为自上向下
- **原点位置**：坐标的 (0,0) 点位于元素的中心
- **变换原点**：默认为元素的中心点

::: warning 重要提醒
在变换中一定要注意变换原点，不同的变换原点会产生完全不同的变换效果！
:::

### 1.2 平移 (Translate)

平移是最常用的变换之一，可以在不影响文档流的情况下移动元素。

**语法：**

```css :collapsed-lines
.element {
  /* 单轴平移 */
  transform: translateX(100px); /* 沿 X 轴移动 */
  transform: translateY(50px); /* 沿 Y 轴移动 */

  /* 双轴平移 */
  transform: translate(100px, 50px); /* X轴100px, Y轴50px */
  transform: translate(100px); /* 等同于 translate(100px, 0) */

  /* 百分比值（相对于元素自身尺寸）*/
  transform: translate(50%, 50%); /* 常用于居中 */
}
```

**实际应用 - 完美居中：**

```css :collapsed-lines
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

### 1.3 缩放 (Scale)

缩放可以改变元素的大小，支持等比例或非等比例缩放。

**语法：**

```css :collapsed-lines
.element {
  /* 单轴缩放 */
  transform: scaleX(1.5); /* X轴放大1.5倍 */
  transform: scaleY(0.8); /* Y轴缩小到0.8倍 */

  /* 双轴缩放 */
  transform: scale(1.2, 0.8); /* X轴1.2倍，Y轴0.8倍 */
  transform: scale(1.5); /* 等同于 scale(1.5, 1.5) */

  /* 负值缩放（翻转效果）*/
  transform: scaleX(-1); /* 水平翻转 */
  transform: scaleY(-1); /* 垂直翻转 */
  transform: scale(-1, -1); /* 180度翻转 */
}
```

**特殊值说明：**

- `1`：保持原始大小
- `0`：元素消失（但仍占据空间）
- `负值`：翻转后缩放

### 1.4 旋转 (Rotate)

旋转可以让元素围绕**变换原点**进行角度变化。

**语法：**

```css :collapsed-lines
.element {
  /* 基本旋转 */
  transform: rotate(45deg); /* 顺时针旋转45度 */
  transform: rotate(-30deg); /* 逆时针旋转30度 */
  transform: rotate(0.5turn); /* 旋转半圈（180度）*/
  transform: rotate(3.14159rad); /* 使用弧度单位 */
}
```

**角度单位：**

- `deg`：度数（最常用）
- `turn`：圈数（1turn = 360deg）
- `rad`：弧度（2π rad = 360deg）

**旋转方向：**

- **正值**：顺时针旋转
- **负值**：逆时针旋转

### 1.5 倾斜 (Skew)

倾斜可以让元素产生斜切效果，常用于创建平行四边形或菱形。

**语法：**

```css :collapsed-lines
.element {
  /* 单轴倾斜 */
  transform: skewX(30deg); /* 沿X轴倾斜30度 */
  transform: skewY(15deg); /* 沿Y轴倾斜15度 */

  /* 双轴倾斜 */
  transform: skew(30deg, 15deg); /* X轴30度，Y轴15度 */
  transform: skew(30deg); /* 等同于 skew(30deg, 0) */
}
```

**倾斜效果：**

- `skewX()`：水平方向倾斜，形成平行四边形
- `skewY()`：垂直方向倾斜
- 正值和负值产生相反的倾斜方向

### 1.6 变换原点 (transform-origin)

变换原点决定了变换的基准点，不同的原点会产生完全不同的效果。

**语法：**

```css :collapsed-lines
.element {
  /* 使用关键字 */
  transform-origin: center center; /* 默认值：中心点 */
  transform-origin: top left; /* 左上角 */
  transform-origin: bottom right; /* 右下角 */

  /* 使用百分比 */
  transform-origin: 50% 50%; /* 中心点 */
  transform-origin: 0% 0%; /* 左上角 */
  transform-origin: 100% 100%; /* 右下角 */

  /* 使用具体数值 */
  transform-origin: 20px 30px; /* 距离左上角20px, 30px */

  /* 3D变换原点（包含Z轴）*/
  transform-origin: center center 100px;
}
```

**关键字对应表：**

| 关键字 | 水平位置 | 垂直位置 |
| ------ | -------- | -------- |
| left   | 0%       | -        |
| center | 50%      | 50%      |
| right  | 100%     | -        |
| top    | -        | 0%       |
| bottom | -        | 100%     |

::: important 重要概念
**变换原点的持久性**：每次变换时，变换原点都保持不变，除非重新设置。理解这一点对于复杂变换至关重要。
:::

**变换原点示例：**

**变换前：**
![transform-3](https://bu.dusays.com/2025/08/20/68a5226f8f16f.png)

**变换后：**
![transform-4](https://bu.dusays.com/2025/08/20/68a5226fa1d2d.png)

### 1.7 多重变换

可以同时应用多个变换，变换按从右到左的顺序执行。

```css :collapsed-lines
.element {
  /* 多重变换 */
  transform: translate(100px, 50px) rotate(45deg) scale(1.2);
  /* 执行顺序：scale → rotate → translate */
  /* 注意：顺序很重要，不同顺序产生不同效果 */
}

/* 示例：先旋转再平移 vs 先平移再旋转 */
.rotate-first {
  transform: translate(100px, 0) rotate(45deg);
}

.translate-first {
  transform: rotate(45deg) translate(100px, 0);
}
```

## 2. 3D 变换

3D 变换在 2D 变换的基础上增加了 Z 轴（深度轴），可以创建真正的三维效果。

::: tip 3D 变换核心
3D 变换的关键在于理解三维坐标系和透视原理。Z 轴垂直于屏幕，正值向外（靠近观察者），负值向内（远离观察者）。
:::

### 2.1 3D 坐标系

- **X 轴**：水平方向（左右）
- **Y 轴**：垂直方向（上下）
- **Z 轴**：深度方向（前后）

### 2.2 3D 平移 (Translate3D)

3D 平移在 2D 平移基础上增加了 Z 轴移动。

**语法：**

```css :collapsed-lines
.element {
  /* Z轴平移 */
  transform: translateZ(100px); /* 向前移动100px */
  transform: translateZ(-50px); /* 向后移动50px */

  /* 3D平移（同时控制三个轴）*/
  transform: translate3d(50px, 100px, 200px);
  /* 等同于：translateX(50px) translateY(100px) translateZ(200px) */

  /* 硬件加速优化 */
  transform: translate3d(0, 0, 0); /* 常用于开启硬件加速 */
}
```

::: warning 注意
单独的 `translateZ()` 在没有透视的情况下是无效的，必须配合 `perspective` 使用才能看到效果。
:::

### 2.3 透视 (Perspective)

透视是 3D 变换的核心概念，它模拟了人眼观察三维物体的效果。

![transform-5](https://bu.dusays.com/2025/08/20/68a5290c41d77.png)

**透视的两种设置方式：**

```css :collapsed-lines
/* 方式1：在父元素上设置（推荐）*/
.parent {
  perspective: 1000px; /* 透视距离 */
  perspective-origin: center center; /* 透视原点 */
}

.child {
  transform: rotateY(45deg);
}
```

```css :collapsed-lines
/* 方式2：在当前元素上设置 */
.element {
  transform: perspective(1000px) rotateY(45deg);
}
```

**两种方式的区别：**

- **父元素设置**：多个子元素共享同一个透视点
- **元素自身设置**：每个元素有独立的透视点

![transform-12](https://bu.dusays.com/2025/08/20/68a5290c43d29.png)

**透视原理：**

![transform-6](https://bu.dusays.com/2025/08/20/68a5290c4c2d4.png)

**无透视时：**

- 默认透视距离为无限大
- Z 轴变化无视觉效果：`∞ + 100 ≈ ∞ - 100`

**设置透视后：**
![transform-7](https://bu.dusays.com/2025/08/20/68a5290c534e1.png)
![transform-8](https://bu.dusays.com/2025/08/20/68a5290c48a07.png)

**透视距离的影响：**

```css :collapsed-lines
/* 不同透视距离的效果 */
.near-perspective {
  perspective: 300px; /* 近距离：变形明显 */
}

.far-perspective {
  perspective: 2000px; /* 远距离：变形轻微 */
}

/* 透视原点 */
.custom-origin {
  perspective: 1000px;
  perspective-origin: top left; /* 从左上角观察 */
}
```

### 2.4 3D 旋转 (Rotate3D)

3D 旋转可以让元素围绕三维空间中的任意轴旋转。

![transform-9](https://bu.dusays.com/2025/08/20/68a5290c46888.png)

**基本 3D 旋转：**

```css :collapsed-lines
.element {
  /* 单轴旋转 */
  transform: rotateX(45deg); /* 围绕X轴旋转（上下翻转效果）*/
  transform: rotateY(45deg); /* 围绕Y轴旋转（左右翻转效果）*/
  transform: rotateZ(45deg); /* 围绕Z轴旋转（等同于rotate()）*/

  /* 注意：rotateZ() 和 rotate() 效果完全相同 */
}
```

**自定义轴旋转：**

![transform-10](https://bu.dusays.com/2025/08/20/68a5290c4c2f9.png)

```css :collapsed-lines
.element {
  /* rotate3d(x, y, z, angle) */
  /* x, y, z 定义旋转轴的方向向量 */
  transform: rotate3d(1, 1, 1, 45deg); /* 围绕(1,1,1)向量旋转45度 */
  transform: rotate3d(1, 0, 0, 45deg); /* 等同于 rotateX(45deg) */
  transform: rotate3d(0, 1, 0, 45deg); /* 等同于 rotateY(45deg) */
  transform: rotate3d(0, 0, 1, 45deg); /* 等同于 rotateZ(45deg) */
}
```

![transform-11](https://bu.dusays.com/2025/08/20/68a52a6b9655c.png)

**实际应用示例：**

```css :collapsed-lines
/* 翻牌效果 */
.card {
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card:hover {
  transform: rotateY(180deg);
}

/* 3D 立方体旋转 */
.cube {
  transform: rotateX(45deg) rotateY(45deg);
}
```

### 2.5 3D 缩放 (Scale3D)

3D 缩放包含了 Z 轴方向的缩放，但需要理解其特殊性。

```css :collapsed-lines
.element {
  /* 3D缩放语法 */
  transform: scaleZ(2); /* Z轴缩放（通常无视觉效果）*/
  transform: scale3d(1.5, 1.2, 2); /* 三轴同时缩放 */
}
```

::: warning scaleZ 的特殊性
`scaleZ()` 在二维屏幕上通常无法直接观察到效果，因为：

- 屏幕是二维平面，无法直接显示深度变化
- Z 轴缩放主要影响元素在 3D 空间中的厚度
- 只有在配合其他 3D 变换时才能间接观察到效果
  :::

**scaleZ 的实际应用：**

```css :collapsed-lines
/* 配合旋转观察scaleZ效果 */
.element {
  transform: scaleZ(3) rotateX(45deg);
  /* 先在Z轴放大3倍，再绕X轴旋转，此时可以看到厚度变化 */
}

/* 3D变换中的深度通常通过以下方式实现： */
.depth-effect {
  transform: translateZ(100px); /* 位置变化 */
  /* 而不是 scaleZ() */
}
```

### 2.6 透视原点 (perspective-origin)

透视原点决定了观察者的视角位置，相对于设置了 perspective 属性的元素。

```css :collapsed-lines
/* 透视原点设置 */
.container {
  perspective: 1000px;
  perspective-origin: center center; /* 默认值：中心观察 */
  perspective-origin: top left; /* 左上角观察 */
  perspective-origin: 50% 0%; /* 顶部中心观察 */
  perspective-origin: 100px 200px; /* 具体位置观察 */
}
```

### 2.7 3D 变换样式 (transform-style)

`transform-style` 决定了子元素如何在 3D 空间中渲染。

```css :collapsed-lines
/* transform-style 属性 */
.parent {
  transform-style: preserve-3d; /* 保持3D空间 */
  /* transform-style: flat; */ /* 默认值：平面化 */
}
```

**属性值说明：**

- **`preserve-3d`**：子元素保持在三维空间中，符合真实 3D 表现
- **`flat`**：默认值，将三维空间压缩到二维平面中

![transform-13](https://bu.dusays.com/2025/08/20/68a5290c4cc8a.png)

::: tip 最佳实践

- `perspective` 通常设置在父元素上
- `transform-style: preserve-3d` 设置在需要 3D 效果的容器上
- 避免在同一元素上同时设置 `perspective` 和 `transform-style`

:::

### 2.8 背面可见性 (backface-visibility)

控制元素背面是否可见。

```css :collapsed-lines
.element {
  backface-visibility: visible; /* 默认值：背面可见 */
  backface-visibility: hidden; /* 背面隐藏 */
}

/* 翻牌效果中的应用 */
.card-front,
.card-back {
  backface-visibility: hidden;
  transition: transform 0.6s;
}

.card-back {
  transform: rotateY(180deg);
}

.card:hover .card-front {
  transform: rotateY(180deg);
}

.card:hover .card-back {
  transform: rotateY(0deg);
}
```

## 3. 实际应用案例

### 3.1 2D 变换案例

**悬停放大效果：**

```html :collapsed-lines
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>悬停放大效果</title>
    <style>
      body {
        margin: 0;
        padding: 40px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        font-family: "Arial", sans-serif;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        text-align: center;
      }

      h1 {
        color: white;
        margin-bottom: 50px;
        font-size: 32px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        margin-bottom: 50px;
      }

      .hover-scale {
        width: 100%;
        height: 200px;
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
        border-radius: 15px;
        transition: all 0.3s ease;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 18px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        position: relative;
        overflow: hidden;
      }

      .hover-scale::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.2),
          transparent
        );
        transition: left 0.5s ease;
      }

      .hover-scale:hover {
        transform: scale(1.05) translateY(-5px);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
      }

      .hover-scale:hover::before {
        left: 100%;
      }

      /* 不同样式的卡片 */
      .card-1 {
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
      }

      .card-2 {
        background: linear-gradient(45deg, #a8edea, #fed6e3);
        color: #333;
      }

      .card-3 {
        background: linear-gradient(45deg, #ffecd2, #fcb69f);
        color: #333;
      }

      .card-4 {
        background: linear-gradient(45deg, #667eea, #764ba2);
      }

      .card-5 {
        background: linear-gradient(45deg, #f093fb, #f5576c);
      }

      .card-6 {
        background: linear-gradient(45deg, #4facfe, #00f2fe);
      }

      /* 特殊效果卡片 */
      .special-effects {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-top: 40px;
      }

      .rotate-scale {
        background: linear-gradient(45deg, #fa709a, #fee140);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      .rotate-scale:hover {
        transform: scale(1.1) rotate(5deg);
      }

      .pulse-scale {
        background: linear-gradient(45deg, #a8edea, #fed6e3);
        color: #333;
        animation: pulse 2s infinite;
      }

      .pulse-scale:hover {
        transform: scale(1.15);
        animation: none;
      }

      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.02);
        }
      }

      .section-title {
        color: white;
        font-size: 24px;
        margin: 40px 0 20px 0;
        text-align: left;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>悬停放大效果展示</h1>

      <div class="cards-grid">
        <div class="hover-scale card-1">
          <span>基础放大效果</span>
        </div>
        <div class="hover-scale card-2">
          <span>渐变卡片 A</span>
        </div>
        <div class="hover-scale card-3">
          <span>渐变卡片 B</span>
        </div>
        <div class="hover-scale card-4">
          <span>渐变卡片 C</span>
        </div>
        <div class="hover-scale card-5">
          <span>渐变卡片 D</span>
        </div>
        <div class="hover-scale card-6">
          <span>渐变卡片 E</span>
        </div>
      </div>

      <h2 class="section-title">特殊效果组合</h2>
      <div class="special-effects">
        <div class="hover-scale rotate-scale">
          <span>旋转 + 放大</span>
        </div>
        <div class="hover-scale pulse-scale">
          <span>脉冲 + 放大</span>
        </div>
      </div>
    </div>
  </body>
</html>
```

**图片倾斜展示：**

```html :collapsed-lines
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>图片倾斜展示</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background: linear-gradient(135deg, #1e3c72, #2a5298);
        min-height: 100vh;
        font-family: "Arial", sans-serif;
        overflow-x: hidden;
      }

      .header {
        text-align: center;
        padding: 40px 20px;
        color: white;
      }

      .header h1 {
        font-size: 36px;
        margin-bottom: 10px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .header p {
        font-size: 18px;
        opacity: 0.9;
        margin: 0;
      }

      .skew-gallery {
        display: flex;
        gap: 30px;
        padding: 40px;
        overflow-x: auto;
        scroll-behavior: smooth;
      }

      .skew-gallery::-webkit-scrollbar {
        height: 8px;
      }

      .skew-gallery::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }

      .skew-gallery::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
      }

      .skew-item {
        min-width: 250px;
        height: 350px;
        position: relative;
        transform: skew(-8deg);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        cursor: pointer;
      }

      .skew-item::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          45deg,
          rgba(255, 107, 107, 0.8),
          rgba(78, 205, 196, 0.8)
        );
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .skew-item:hover::before {
        opacity: 1;
      }

      .skew-item:hover {
        transform: skew(0deg) scale(1.05) translateY(-10px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      }

      .item-content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 20px;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
        color: white;
        transform: translateY(100%);
        transition: transform 0.3s ease;
      }

      .skew-item:hover .item-content {
        transform: translateY(0);
      }

      .item-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 8px;
      }

      .item-description {
        font-size: 14px;
        opacity: 0.9;
        line-height: 1.4;
      }

      /* 不同的背景图片效果 */
      .item-1 {
        background: linear-gradient(45deg, #ff9a9e, #fecfef);
      }

      .item-2 {
        background: linear-gradient(45deg, #a8edea, #fed6e3);
      }

      .item-3 {
        background: linear-gradient(45deg, #ffecd2, #fcb69f);
      }

      .item-4 {
        background: linear-gradient(45deg, #667eea, #764ba2);
      }

      .item-5 {
        background: linear-gradient(45deg, #f093fb, #f5576c);
      }

      .item-6 {
        background: linear-gradient(45deg, #4facfe, #00f2fe);
      }

      .item-7 {
        background: linear-gradient(45deg, #43e97b, #38f9d7);
      }

      .item-8 {
        background: linear-gradient(45deg, #fa709a, #fee140);
      }

      /* 添加一些装饰性图案 */
      .skew-item::after {
        content: "";
        position: absolute;
        top: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        opacity: 0;
        transform: scale(0);
        transition: all 0.3s ease;
      }

      .skew-item:hover::after {
        opacity: 1;
        transform: scale(1);
      }

      .controls {
        text-align: center;
        padding: 20px;
      }

      .scroll-btn {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.3);
        padding: 10px 20px;
        margin: 0 10px;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
      }

      .scroll-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.5);
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>倾斜画廊展示</h1>
      <p>悬停查看完整效果</p>
    </div>

    <div class="skew-gallery" id="gallery">
      <div class="skew-item item-1">
        <div class="item-content">
          <div class="item-title">创意设计</div>
          <div class="item-description">
            探索无限可能的创意世界，让想象力自由飞翔。
          </div>
        </div>
      </div>

      <div class="skew-item item-2">
        <div class="item-content">
          <div class="item-title">技术创新</div>
          <div class="item-description">前沿技术与创新思维的完美结合。</div>
        </div>
      </div>

      <div class="skew-item item-3">
        <div class="item-content">
          <div class="item-title">艺术灵感</div>
          <div class="item-description">
            从生活中汲取灵感，创造独特的艺术作品。
          </div>
        </div>
      </div>

      <div class="skew-item item-4">
        <div class="item-content">
          <div class="item-title">数字世界</div>
          <div class="item-description">数字化时代的无限可能与机遇。</div>
        </div>
      </div>

      <div class="skew-item item-5">
        <div class="item-content">
          <div class="item-title">未来科技</div>
          <div class="item-description">展望未来，拥抱科技带来的变革。</div>
        </div>
      </div>

      <div class="skew-item item-6">
        <div class="item-content">
          <div class="item-title">海洋之美</div>
          <div class="item-description">深邃的海洋蕴含着无尽的神秘与美丽。</div>
        </div>
      </div>

      <div class="skew-item item-7">
        <div class="item-content">
          <div class="item-title">自然和谐</div>
          <div class="item-description">与自然和谐共处，感受生命的美好。</div>
        </div>
      </div>

      <div class="skew-item item-8">
        <div class="item-content">
          <div class="item-title">梦想起航</div>
          <div class="item-description">每一个梦想都值得被认真对待和实现。</div>
        </div>
      </div>
    </div>

    <div class="controls">
      <button class="scroll-btn" onclick="scrollGallery('left')">
        ← 向左滚动
      </button>
      <button class="scroll-btn" onclick="scrollGallery('right')">
        向右滚动 →
      </button>
    </div>

    <script>
      function scrollGallery(direction) {
        const gallery = document.getElementById("gallery");
        const scrollAmount = 300;

        if (direction === "left") {
          gallery.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        } else {
          gallery.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }

      // 自动滚动功能（可选）
      let autoScroll = false;

      function toggleAutoScroll() {
        autoScroll = !autoScroll;
        if (autoScroll) {
          autoScrollGallery();
        }
      }

      function autoScrollGallery() {
        if (!autoScroll) return;

        const gallery = document.getElementById("gallery");
        gallery.scrollBy({ left: 200, behavior: "smooth" });

        // 如果滚动到末尾，重新开始
        if (gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth) {
          setTimeout(() => {
            gallery.scrollTo({ left: 0, behavior: "smooth" });
          }, 2000);
        }

        setTimeout(autoScrollGallery, 3000);
      }
    </script>
  </body>
</html>
```

**旋转加载动画：**

```html :collapsed-lines
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>旋转加载动画</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background: linear-gradient(135deg, #667eea, #764ba2);
        min-height: 100vh;
        font-family: "Arial", sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .container {
        text-align: center;
        color: white;
      }

      h1 {
        font-size: 36px;
        margin-bottom: 50px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .loaders-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 50px;
        max-width: 1000px;
        margin-bottom: 50px;
      }

      .loader-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
      }

      .loader-title {
        font-size: 16px;
        font-weight: bold;
        opacity: 0.9;
      }

      /* 基础旋转加载器 */
      .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top: 4px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      /* 脉冲旋转加载器 */
      .pulse-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top: 4px solid #ff6b6b;
        border-radius: 50%;
        animation: pulse-spin 1.5s ease-in-out infinite;
      }

      @keyframes pulse-spin {
        0% {
          transform: rotate(0deg) scale(1);
          border-top-color: #ff6b6b;
        }
        50% {
          transform: rotate(180deg) scale(1.1);
          border-top-color: #4ecdc4;
        }
        100% {
          transform: rotate(360deg) scale(1);
          border-top-color: #ff6b6b;
        }
      }

      /* 双环旋转加载器 */
      .double-ring {
        position: relative;
        width: 50px;
        height: 50px;
      }

      .double-ring::before,
      .double-ring::after {
        content: "";
        position: absolute;
        border-radius: 50%;
        border: 3px solid transparent;
      }

      .double-ring::before {
        width: 50px;
        height: 50px;
        border-top: 3px solid #ff6b6b;
        border-right: 3px solid #ff6b6b;
        animation: spin 1s linear infinite;
      }

      .double-ring::after {
        width: 30px;
        height: 30px;
        top: 10px;
        left: 10px;
        border-bottom: 3px solid #4ecdc4;
        border-left: 3px solid #4ecdc4;
        animation: spin 1s linear infinite reverse;
      }

      /* 点阵旋转加载器 */
      .dots-spinner {
        position: relative;
        width: 50px;
        height: 50px;
        animation: spin 2s linear infinite;
      }

      .dots-spinner::before,
      .dots-spinner::after {
        content: "";
        position: absolute;
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
      }

      .dots-spinner::before {
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }

      .dots-spinner::after {
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        background: #ff6b6b;
      }

      /* 方形旋转加载器 */
      .square-spinner {
        width: 40px;
        height: 40px;
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
        animation: square-spin 1.2s ease-in-out infinite;
      }

      @keyframes square-spin {
        0% {
          transform: rotate(0deg) scale(1);
          border-radius: 0;
        }
        50% {
          transform: rotate(180deg) scale(0.8);
          border-radius: 50%;
        }
        100% {
          transform: rotate(360deg) scale(1);
          border-radius: 0;
        }
      }

      /* 三角旋转加载器 */
      .triangle-spinner {
        width: 0;
        height: 0;
        border-left: 20px solid transparent;
        border-right: 20px solid transparent;
        border-bottom: 35px solid white;
        animation: triangle-spin 1.5s linear infinite;
      }

      @keyframes triangle-spin {
        0% {
          transform: rotate(0deg);
          border-bottom-color: white;
        }
        33% {
          border-bottom-color: #ff6b6b;
        }
        66% {
          border-bottom-color: #4ecdc4;
        }
        100% {
          transform: rotate(360deg);
          border-bottom-color: white;
        }
      }

      /* 控制按钮 */
      .controls {
        display: flex;
        gap: 20px;
        margin-top: 30px;
      }

      .control-btn {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.3);
        padding: 12px 24px;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
        font-weight: bold;
      }

      .control-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-2px);
      }

      .paused {
        animation-play-state: paused !important;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>旋转加载动画展示</h1>

      <div class="loaders-grid">
        <div class="loader-item">
          <div class="spinner loading-element"></div>
          <div class="loader-title">基础旋转</div>
        </div>

        <div class="loader-item">
          <div class="pulse-spinner loading-element"></div>
          <div class="loader-title">脉冲旋转</div>
        </div>

        <div class="loader-item">
          <div class="double-ring loading-element"></div>
          <div class="loader-title">双环旋转</div>
        </div>

        <div class="loader-item">
          <div class="dots-spinner loading-element"></div>
          <div class="loader-title">点阵旋转</div>
        </div>

        <div class="loader-item">
          <div class="square-spinner loading-element"></div>
          <div class="loader-title">方形变换</div>
        </div>

        <div class="loader-item">
          <div class="triangle-spinner loading-element"></div>
          <div class="loader-title">三角旋转</div>
        </div>
      </div>

      <div class="controls">
        <button class="control-btn" onclick="toggleAnimation()">
          暂停/继续
        </button>
        <button class="control-btn" onclick="changeSpeed()">切换速度</button>
        <button class="control-btn" onclick="resetAnimation()">重置动画</button>
      </div>
    </div>

    <script>
      let isPaused = false;
      let currentSpeed = 1;

      function toggleAnimation() {
        const elements = document.querySelectorAll(".loading-element");
        isPaused = !isPaused;

        elements.forEach((element) => {
          if (isPaused) {
            element.classList.add("paused");
          } else {
            element.classList.remove("paused");
          }
        });
      }

      function changeSpeed() {
        const elements = document.querySelectorAll(".loading-element");
        currentSpeed = currentSpeed === 1 ? 0.5 : currentSpeed === 0.5 ? 2 : 1;

        elements.forEach((element) => {
          element.style.animationDuration = `${
            parseFloat(getComputedStyle(element).animationDuration) /
            currentSpeed
          }s`;
        });
      }

      function resetAnimation() {
        const elements = document.querySelectorAll(".loading-element");

        elements.forEach((element) => {
          element.style.animation = "none";
          element.offsetHeight; // 触发重排
          element.style.animation = null;
          element.classList.remove("paused");
        });

        isPaused = false;
        currentSpeed = 1;
      }
    </script>
  </body>
</html>
```

### 3.2 3D 变换案例

**3D 翻牌效果：**

```html :collapsed-lines
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>3D 翻牌效果</title>
    <style>
      body {
        margin: 0;
        padding: 40px;
        background: linear-gradient(135deg, #2c3e50, #3498db);
        min-height: 100vh;
        font-family: "Arial", sans-serif;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        text-align: center;
      }

      h1 {
        color: white;
        font-size: 36px;
        margin-bottom: 20px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .subtitle {
        color: rgba(255, 255, 255, 0.8);
        font-size: 18px;
        margin-bottom: 50px;
      }

      .cards-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 40px;
        margin-bottom: 50px;
      }

      .flip-card {
        width: 100%;
        height: 350px;
        perspective: 1000px;
        cursor: pointer;
      }

      .flip-card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        transform-style: preserve-3d;
      }

      .flip-card:hover .flip-card-inner {
        transform: rotateY(180deg);
      }

      .flip-card-front,
      .flip-card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 30px;
        box-sizing: border-box;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
      }

      .flip-card-front {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
      }

      .flip-card-back {
        background: linear-gradient(135deg, #f093fb, #f5576c);
        color: white;
        transform: rotateY(180deg);
      }

      .card-icon {
        font-size: 60px;
        margin-bottom: 20px;
        opacity: 0.9;
      }

      .card-title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 15px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      }

      .card-description {
        font-size: 16px;
        line-height: 1.5;
        opacity: 0.9;
        text-align: center;
      }

      /* 不同样式的卡片 */
      .card-1 .flip-card-front {
        background: linear-gradient(135deg, #667eea, #764ba2);
      }

      .card-1 .flip-card-back {
        background: linear-gradient(135deg, #f093fb, #f5576c);
      }

      .card-2 .flip-card-front {
        background: linear-gradient(135deg, #ffecd2, #fcb69f);
        color: #333;
      }

      .card-2 .flip-card-back {
        background: linear-gradient(135deg, #a8edea, #fed6e3);
        color: #333;
      }

      .card-3 .flip-card-front {
        background: linear-gradient(135deg, #ff9a9e, #fecfef);
      }

      .card-3 .flip-card-back {
        background: linear-gradient(135deg, #4facfe, #00f2fe);
      }

      .card-4 .flip-card-front {
        background: linear-gradient(135deg, #43e97b, #38f9d7);
        color: #333;
      }

      .card-4 .flip-card-back {
        background: linear-gradient(135deg, #fa709a, #fee140);
        color: #333;
      }

      /* 特殊效果区域 */
      .special-section {
        margin-top: 60px;
      }

      .section-title {
        color: white;
        font-size: 28px;
        margin-bottom: 30px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .special-cards {
        display: flex;
        justify-content: center;
        gap: 40px;
        flex-wrap: wrap;
      }

      /* 垂直翻转卡片 */
      .flip-vertical .flip-card-inner {
        transition: transform 0.8s ease;
      }

      .flip-vertical:hover .flip-card-inner {
        transform: rotateX(180deg);
      }

      .flip-vertical .flip-card-back {
        transform: rotateX(180deg);
      }

      /* 3D 翻转卡片 */
      .flip-3d:hover .flip-card-inner {
        transform: rotateY(180deg) rotateX(15deg) scale(1.05);
      }

      /* 延迟翻转卡片 */
      .flip-delay .flip-card-inner {
        transition: transform 1.2s ease-in-out;
      }

      .flip-delay:hover .flip-card-inner {
        transform: rotateY(180deg) rotateZ(10deg);
      }

      .controls {
        margin-top: 50px;
        display: flex;
        justify-content: center;
        gap: 20px;
        flex-wrap: wrap;
      }

      .control-btn {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.3);
        padding: 12px 24px;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
        font-weight: bold;
      }

      .control-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-2px);
      }

      .auto-flip {
        animation: auto-flip-animation 4s infinite;
      }

      @keyframes auto-flip-animation {
        0%,
        40% {
          transform: rotateY(0deg);
        }
        60%,
        100% {
          transform: rotateY(180deg);
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>3D 翻牌效果展示</h1>
      <p class="subtitle">悬停卡片查看翻转效果</p>

      <div class="cards-container">
        <!-- 基础翻牌卡片 -->
        <div class="flip-card card-1">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <div class="card-icon">🎨</div>
              <div class="card-title">创意设计</div>
              <div class="card-description">探索设计的无限可能</div>
            </div>
            <div class="flip-card-back">
              <div class="card-icon">✨</div>
              <div class="card-title">设计理念</div>
              <div class="card-description">
                用创意点亮生活，用设计改变世界。每一个像素都承载着设计师的匠心。
              </div>
            </div>
          </div>
        </div>

        <!-- 技术卡片 -->
        <div class="flip-card card-2">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <div class="card-icon">💻</div>
              <div class="card-title">前端开发</div>
              <div class="card-description">构建现代化的用户界面</div>
            </div>
            <div class="flip-card-back">
              <div class="card-icon">🚀</div>
              <div class="card-title">技术栈</div>
              <div class="card-description">
                HTML5、CSS3、JavaScript、Vue.js、React
                等现代前端技术的完美结合。
              </div>
            </div>
          </div>
        </div>

        <!-- 创新卡片 -->
        <div class="flip-card card-3">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <div class="card-icon">💡</div>
              <div class="card-title">创新思维</div>
              <div class="card-description">突破传统的思维模式</div>
            </div>
            <div class="flip-card-back">
              <div class="card-icon">🎯</div>
              <div class="card-title">解决方案</div>
              <div class="card-description">
                用创新的思维解决复杂问题，为用户提供最佳的体验和价值。
              </div>
            </div>
          </div>
        </div>

        <!-- 团队卡片 -->
        <div class="flip-card card-4">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <div class="card-icon">👥</div>
              <div class="card-title">团队协作</div>
              <div class="card-description">高效的团队合作模式</div>
            </div>
            <div class="flip-card-back">
              <div class="card-icon">🤝</div>
              <div class="card-title">协作精神</div>
              <div class="card-description">
                团结协作，共同成长。每个人的贡献都是团队成功的重要组成部分。
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="special-section">
        <h2 class="section-title">特殊翻转效果</h2>
        <div class="special-cards">
          <!-- 垂直翻转 -->
          <div class="flip-card flip-vertical card-1">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <div class="card-icon">⬆️</div>
                <div class="card-title">垂直翻转</div>
                <div class="card-description">上下翻转效果</div>
              </div>
              <div class="flip-card-back">
                <div class="card-icon">⬇️</div>
                <div class="card-title">翻转完成</div>
                <div class="card-description">
                  垂直翻转让卡片呈现不同的视觉效果
                </div>
              </div>
            </div>
          </div>

          <!-- 3D 翻转 -->
          <div class="flip-card flip-3d card-2">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <div class="card-icon">🔄</div>
                <div class="card-title">3D 翻转</div>
                <div class="card-description">立体翻转效果</div>
              </div>
              <div class="flip-card-back">
                <div class="card-icon">🌟</div>
                <div class="card-title">立体效果</div>
                <div class="card-description">
                  3D 变换让翻转更有立体感和层次感
                </div>
              </div>
            </div>
          </div>

          <!-- 延迟翻转 -->
          <div class="flip-card flip-delay card-3">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <div class="card-icon">⏱️</div>
                <div class="card-title">延迟翻转</div>
                <div class="card-description">缓慢翻转效果</div>
              </div>
              <div class="flip-card-back">
                <div class="card-icon">🎭</div>
                <div class="card-title">优雅过渡</div>
                <div class="card-description">
                  延长的动画时间让翻转更加优雅流畅
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="controls">
        <button class="control-btn" onclick="toggleAutoFlip()">自动翻转</button>
        <button class="control-btn" onclick="flipAllCards()">翻转所有</button>
        <button class="control-btn" onclick="resetAllCards()">重置卡片</button>
      </div>
    </div>

    <script>
      let autoFlipEnabled = false;
      let allFlipped = false;

      function toggleAutoFlip() {
        const cards = document.querySelectorAll(".flip-card-inner");
        autoFlipEnabled = !autoFlipEnabled;

        cards.forEach((card) => {
          if (autoFlipEnabled) {
            card.classList.add("auto-flip");
          } else {
            card.classList.remove("auto-flip");
          }
        });
      }

      function flipAllCards() {
        const cards = document.querySelectorAll(".flip-card-inner");
        allFlipped = !allFlipped;

        cards.forEach((card) => {
          if (allFlipped) {
            card.style.transform = "rotateY(180deg)";
          } else {
            card.style.transform = "rotateY(0deg)";
          }
        });
      }

      function resetAllCards() {
        const cards = document.querySelectorAll(".flip-card-inner");

        cards.forEach((card) => {
          card.style.transform = "rotateY(0deg)";
          card.classList.remove("auto-flip");
        });

        autoFlipEnabled = false;
        allFlipped = false;
      }

      // 随机翻转效果（可选）
      function randomFlip() {
        const cards = document.querySelectorAll(".flip-card-inner");
        const randomCard = cards[Math.floor(Math.random() * cards.length)];

        randomCard.style.transform = "rotateY(180deg)";
        setTimeout(() => {
          randomCard.style.transform = "rotateY(0deg)";
        }, 2000);
      }

      // 每5秒随机翻转一张卡片（可选功能）
      // setInterval(randomFlip, 5000);
    </script>
  </body>
</html>
```

**3D 立方体：**

```html :collapsed-lines
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>3D 立方体动画</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background: radial-gradient(circle at center, #2c3e50, #34495e);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: "Arial", sans-serif;
        overflow: hidden;
      }

      h2 {
        color: white;
        margin-bottom: 50px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        font-size: 28px;
      }

      .cubes-container {
        display: flex;
        gap: 100px;
        align-items: center;
      }

      .cube-container {
        perspective: 1000px;
        width: 200px;
        height: 200px;
      }

      .cube {
        position: relative;
        width: 200px;
        height: 200px;
        transform-style: preserve-3d;
        animation: rotate-cube 6s infinite linear;
      }

      .cube-face {
        position: absolute;
        width: 200px;
        height: 200px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
        color: white;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        box-shadow: inset 0 0 50px rgba(255, 255, 255, 0.1);
      }

      .front {
        background: rgba(52, 152, 219, 0.8);
        transform: rotateY(0deg) translateZ(100px);
      }

      .back {
        background: rgba(231, 76, 60, 0.8);
        transform: rotateY(180deg) translateZ(100px);
      }

      .right {
        background: rgba(46, 204, 113, 0.8);
        transform: rotateY(90deg) translateZ(100px);
      }

      .left {
        background: rgba(155, 89, 182, 0.8);
        transform: rotateY(-90deg) translateZ(100px);
      }

      .top {
        background: rgba(243, 156, 18, 0.8);
        transform: rotateX(90deg) translateZ(100px);
      }

      .bottom {
        background: rgba(26, 188, 156, 0.8);
        transform: rotateX(-90deg) translateZ(100px);
      }

      @keyframes rotate-cube {
        from {
          transform: rotateX(0) rotateY(0);
        }
        to {
          transform: rotateX(360deg) rotateY(360deg);
        }
      }

      /* 第二个立方体 - 不同的动画 */
      .cube-2 {
        animation: rotate-cube-alt 8s infinite ease-in-out;
      }

      @keyframes rotate-cube-alt {
        0% {
          transform: rotateX(0) rotateY(0) rotateZ(0);
        }
        33% {
          transform: rotateX(90deg) rotateY(180deg) rotateZ(0);
        }
        66% {
          transform: rotateX(180deg) rotateY(270deg) rotateZ(90deg);
        }
        100% {
          transform: rotateX(360deg) rotateY(360deg) rotateZ(180deg);
        }
      }

      /* 第三个立方体 - 悬停控制 */
      .cube-3 {
        animation: none;
        transition: transform 0.5s ease;
      }

      .cube-container:hover .cube-3 {
        transform: rotateX(45deg) rotateY(45deg);
      }

      .controls {
        margin-top: 50px;
        text-align: center;
      }

      .control-button {
        background: rgba(52, 152, 219, 0.8);
        color: white;
        border: none;
        padding: 10px 20px;
        margin: 0 10px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.3s ease;
      }

      .control-button:hover {
        background: rgba(52, 152, 219, 1);
      }

      .cube-label {
        color: white;
        text-align: center;
        margin-top: 20px;
        font-size: 14px;
        opacity: 0.8;
      }
    </style>
  </head>
  <body>
    <h2>3D 立方体动画展示</h2>

    <div class="cubes-container">
      <!-- 基础旋转立方体 -->
      <div class="cube-container">
        <div class="cube">
          <div class="cube-face front">前面</div>
          <div class="cube-face back">后面</div>
          <div class="cube-face right">右面</div>
          <div class="cube-face left">左面</div>
          <div class="cube-face top">顶面</div>
          <div class="cube-face bottom">底面</div>
        </div>
        <div class="cube-label">连续旋转</div>
      </div>

      <!-- 复杂动画立方体 -->
      <div class="cube-container">
        <div class="cube cube-2">
          <div class="cube-face front">HTML</div>
          <div class="cube-face back">CSS</div>
          <div class="cube-face right">JS</div>
          <div class="cube-face left">Vue</div>
          <div class="cube-face top">React</div>
          <div class="cube-face bottom">Node</div>
        </div>
        <div class="cube-label">缓动动画</div>
      </div>

      <!-- 悬停控制立方体 -->
      <div class="cube-container">
        <div class="cube cube-3">
          <div class="cube-face front">🎨</div>
          <div class="cube-face back">🚀</div>
          <div class="cube-face right">💡</div>
          <div class="cube-face left">⚡</div>
          <div class="cube-face top">🎯</div>
          <div class="cube-face bottom">🔥</div>
        </div>
        <div class="cube-label">悬停旋转</div>
      </div>
    </div>

    <div class="controls">
      <button class="control-button" onclick="toggleAnimation()">
        暂停/继续
      </button>
      <button class="control-button" onclick="resetCubes()">重置位置</button>
    </div>

    <script>
      let animationPaused = false;

      function toggleAnimation() {
        const cubes = document.querySelectorAll(".cube");
        animationPaused = !animationPaused;

        cubes.forEach((cube) => {
          if (animationPaused) {
            cube.style.animationPlayState = "paused";
          } else {
            cube.style.animationPlayState = "running";
          }
        });
      }

      function resetCubes() {
        const cubes = document.querySelectorAll(".cube");
        cubes.forEach((cube) => {
          cube.style.animation = "none";
          cube.offsetHeight; // 触发重排
          cube.style.animation = null;
        });
      }
    </script>
  </body>
</html>
```

## 4. 总结与最佳实践

### 4.1 核心要点

1. **变换原点**：理解并合理设置 `transform-origin`
2. **变换顺序**：多重变换的执行顺序影响最终效果
3. **透视设置**：3D 变换必须配合 `perspective` 使用
4. **性能优化**：使用 `transform` 而非改变布局属性

### 4.2 常用属性速查

| 属性                  | 作用       | 示例                           |
| --------------------- | ---------- | ------------------------------ |
| `translate()`         | 平移       | `translate(50px, 100px)`       |
| `scale()`             | 缩放       | `scale(1.2)`                   |
| `rotate()`            | 旋转       | `rotate(45deg)`                |
| `skew()`              | 倾斜       | `skew(30deg, 15deg)`           |
| `perspective`         | 透视       | `perspective: 1000px`          |
| `transform-origin`    | 变换原点   | `transform-origin: top left`   |
| `transform-style`     | 3D 样式    | `transform-style: preserve-3d` |
| `backface-visibility` | 背面可见性 | `backface-visibility: hidden`  |

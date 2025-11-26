# ✨Grid 网格布局 👌

[[TOC]]

## 1. 如何声明 Grid 布局

通过设置 `display` 属性来创建 Grid 容器：

```css :collapsed-lines
.container {
  display: grid; /* 常用：块盒，默认宽度 100% */
  /* 或者 */
  /* display: inline-grid;  行块盒，可与文本同行 */
}
```

### 1.1 核心概念

- Grid 容器（Grid Container）：设置了 `display: grid/inline-grid` 的元素。
- Grid 项目（Grid Items）：容器的直接子元素。
- 轨道（Track）：行或列（row/column）。
- 网格线（Line）：轨道的分隔线，可命名用于定位。
- 单元格（Cell）：一条行轨与一条列轨围成的区域。
- 区域（Area）：由若干相邻单元格组成的矩形区域。

```text
行/列/线/单元格/区域示意（ASCII）：

┌─────────┬─────────┬─────────┐
│  cell   │  cell   │  cell   │  ← row track 1
├─────────┼─────────┼─────────┤
│  cell   │  area   │  area   │  ← row track 2
├─────────┼─────────┼─────────┤
│  cell   │  area   │  area   │  ← row track 3
└─────────┴─────────┴─────────┘
           ↑       ↑
        column track 2 & 3
```

### 1.2 显式网格 vs 隐式网格

- 显式网格（Explicit Grid）：由 `grid-template-rows/columns/areas` 明确定义的轨道与区域。
- 隐式网格（Implicit Grid）：当项目超出已定义范围时，浏览器自动生成的额外行/列。
- 相关属性：`grid-auto-rows`、`grid-auto-columns` 用于控制隐式轨道的尺寸。

```css :collapsed-lines
.grid {
  display: grid;
  grid-template: 100px auto / 1fr 2fr; /* 显式两行两列 */
  grid-auto-rows: 80px; /* 隐式新增行的高度 */
}
```

## 2. 轨道尺寸 - grid-template-columns / grid-template-rows

用于定义网格容器的列与行的大小与结构。

### 2.1 支持的单位

- 长度：`px`、`em`、`rem`、`vw/vh`、`%`
- 分数：`fr`（fraction，可用空间的份额）
- 关键词：`auto`、`min-content`、`max-content`

### 2.2 常用函数

- `repeat(count, track-size)`：重复轨道定义（只用于 template rows/columns）
- `minmax(min, max)`：定义轨道尺寸范围
- `fit-content(limit)`：限制轨道尺寸（公式：`max(min-content, min(limit, max-content))`）

```css :collapsed-lines
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 三列，等份 */
  grid-template-rows: 100px auto; /* 第一行 100px，第二行自适应 */
}
```

### 2.3 auto-fill vs auto-fit（响应式网格）

```css :collapsed-lines
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.grid-fit {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
```

- `auto-fill`：尽可能“填充”轨道，空槽位保留（可能出现空轨占位）。
- `auto-fit`：尽可能“适配”内容，空槽位会“折叠”，现有内容会拉伸填满。

## 3. 网格线命名

网格线可命名，便于项目定位：

```css :collapsed-lines
.grid {
  display: grid;
  grid-template-rows: [row-start] 100px [row-middle] 200px [row-end];
  grid-template-columns: [col-start] 1fr [col-2] 2fr [col-end];
}

.item {
  /* 使用命名线定位 */
  grid-row: row-start / row-end;
  grid-column: col-start / col-2;
}
```

## 4. 区域布局 - grid-template-areas

用字符矩阵声明区域（必须为矩形）：

```css :collapsed-lines
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar content content"
    "footer footer footer";
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: 80px auto 60px;
}
.header {
  grid-area: header;
}
.sidebar {
  grid-area: sidebar;
}
.content {
  grid-area: content;
}
.footer {
  grid-area: footer;
}
```

注意：区域名称可以为任意字符串（含中文），`.` 代表空单元格；非矩形区域无效。

## 5. 隐式轨道 - grid-auto-rows / grid-auto-columns

当子项超过显式网格范围时，会创建隐式轨道：

```css :collapsed-lines
.grid {
  display: grid;
  grid-template: 1fr 1fr / 1fr 1fr; /* 显式 2x2 */
  grid-auto-rows: 120px; /* 隐式新增行高度 */
}
```

## 6. 自动放置 - grid-auto-flow

控制未指定位置的项目放置顺序与算法：

| 属性值   | 描述                               |
| -------- | ---------------------------------- |
| `row`    | 按行自然排列（默认）               |
| `column` | 按列自然排列                       |
| `dense`  | 启用密集打包算法（尽可能填补空隙） |
| 组合     | `row dense` / `column dense`       |

```css :collapsed-lines
.grid {
  display: grid;
  grid-template: 100px 100px / 1fr 1fr 1fr;
  grid-auto-flow: row dense;
}
```

## 7. 间隙 - gap / row-gap / column-gap

设置网格行与列之间的间隙（不等同于 `margin`）：

```css :collapsed-lines
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 12px; /* 行间隙 */
  column-gap: 24px; /* 列间隙 */
  /* 简写 */
  /* gap: 12px 24px; */
}
```

## 8. 对齐 - 项目对齐与内容分布

### 8.1 项目对齐 - justify-items / align-items / place-items

- `justify-items`：沿列（内联方向）的对齐
- `align-items`：沿行（块方向）的对齐
- `place-items`：`align-items` + `justify-items` 的简写

常用属性值：`start`、`end`、`center`、`stretch`、`baseline`、`normal`

注意：`normal` 通常表现为 `stretch`；若子项是具有内在尺寸/比例的元素，则更接近 `start`。

### 8.2 内容分布 - justify-content / align-content / place-content

- 用于控制“整个网格内容”在容器内的分布与对齐（需总内容尺寸 < 容器尺寸）。
- 简写：`place-content: <align-content> <justify-content>?`

```css :collapsed-lines
.grid {
  display: grid;
  grid-template-columns: repeat(3, 200px);
  grid-template-rows: repeat(2, 120px);
  justify-content: space-between;
  align-content: center;
}
```

### 8.3 单项对齐 - justify-self / align-self / place-self

用于某个子项覆盖容器的对齐设置：

```css :collapsed-lines
.item {
  place-self: center end;
} /* 垂直居中，水平靠右 */
```

## 9. 子项定位与跨度 - grid-column / grid-row / grid-area

定位语法：

- 线号定位：`grid-row: 1 / 3;`、`grid-column: 2 / 4;`
- 关键字 `span`：`grid-column: 2 / span 2;`（从线 2 开始跨 2 轨）
- 负数线号：`-1` 表示最后一条线，可用于“从末端计数”
- 区域定位：`grid-area: r-start / c-start / r-end / c-end`

```css :collapsed-lines
.item-1 {
  grid-column: 1 / span 2;
  grid-row: 2 / 4;
}
.item-2 {
  grid-area: 1 / 3 / 3 / 4; /* r1-c3 到 r3-c4 */
}
```

## 10. Grid 简写 - grid 属性

`grid` 是以下属性的缩写集合：`grid-template-rows`、`grid-template-columns`、`grid-template-areas`、`grid-auto-rows`、`grid-auto-columns`、`grid-auto-flow`。

四类用法示例：

```css :collapsed-lines
/* 1) 关闭网格 */
.a {
  grid: none;
}

/* 2) grid-template（行/列/区域） */
.b {
  grid:
    "header header" 80px
    "sidebar content" auto
    "footer footer" 60px
    / 200px 1fr;
}

/* 3) <rows> / [auto-flow && dense?] <auto-columns>? */
.c {
  grid: 100px 1fr / auto-flow dense 200px;
}

/* 4) [auto-flow && dense?] <auto-rows>? / <columns> */
.d {
  grid: auto-flow 120px / 1fr 2fr;
}
```

## 11. 实战示例 - 圣杯布局（Header/Sidebar/Content/Footer）

```html :collapsed-lines
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Grid 圣杯布局</title>
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
      }
      .layout {
        display: grid;
        grid-template-areas:
          "header header header"
          "sidebar content content"
          "footer footer footer";
        grid-template-columns: 240px 1fr 1fr;
        grid-template-rows: 80px auto 80px;
        gap: 16px;
        padding: 16px;
        min-height: 100vh;
      }
      .header {
        grid-area: header;
        background: #fee;
      }
      .sidebar {
        grid-area: sidebar;
        background: #eef;
      }
      .content {
        grid-area: content;
        background: #efe;
      }
      .footer {
        grid-area: footer;
        background: #eee;
      }
    </style>
  </head>
  <body>
    <div class="layout">
      <header class="header">Header</header>
      <aside class="sidebar">Sidebar</aside>
      <main class="content">Content</main>
      <footer class="footer">Footer</footer>
    </div>
  </body>
</html>
```

## 12. 实战示例 - 自适应卡片网格（auto-fit + minmax）

```html :collapsed-lines
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>响应式卡片网格</title>
    <style>
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
        padding: 16px;
      }
      .card {
        background: #fafafa;
        border: 1px solid #eee;
        height: 160px;
      }
    </style>
  </head>
  <body>
    <div class="grid">
      <div class="card"></div>
      <div class="card"></div>
      <div class="card"></div>
      <div class="card"></div>
      <div class="card"></div>
    </div>
  </body>
</html>
```

## 13. 最佳实践

- 优先使用 `fr` 分数单位表达弹性轨道；必要时用 `minmax` 限制最小值。
- 响应式网格推荐 `repeat(auto-fit, minmax(...))`；若需要保留空槽，用 `auto-fill`。
- 间隙使用 `gap`（不影响外边距折叠，语义更清晰）。
- 区域必须为矩形；复杂布局优先区域，不要滥用大量线号硬定位。
- Grid 与 Flex 的搭配：页面大布局用 Grid，局部一维分布用 Flex。

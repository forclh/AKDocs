# web 字体和图标 ✨

## web 字体

web 字体用于解决用户电脑上没有安装相应字体时，强制让用户下载该字体，确保网页在不同设备上显示一致的字体效果。

### @font-face 语法

使用 `@font-face` 指令可以制作一个新的字体族，让浏览器下载并使用自定义字体。

```css
@font-face {
  font-family: "字体名称";
  src: url("字体文件路径") format("字体格式");
}
```

### 基本示例

```css
/* 制作一个新的字体，名称叫做good night */
@font-face {
  font-family: "good night";
  src: url("./font/晚安体.ttf");
}

p {
  font-family: "good night";
}
```

## 字体图标

字体图标是将图标制作成字体的技术，具有矢量、可缩放、文件小、易于修改颜色等优点。

### 字体图标的优势

- **矢量图形**：无限缩放不失真
- **文件小**：比位图图标文件更小
- **易于修改**：可通过 CSS 修改颜色、大小等
- **兼容性好**：支持所有浏览器
- **减少 HTTP 请求**：多个图标打包在一个字体文件中

### 字体图标网站

- [iconfont (阿里巴巴矢量图标库)](https://www.iconfont.cn/)
- [Font Awesome](https://fontawesome.com/)

## 字体图标的使用方式

### 1. 在线引用方式

直接引用在线 CSS 文件：

```html :collapsed-lines
<!DOCTYPE html>
<html>
  <head>
    <link
      rel="stylesheet"
      href="//at.alicdn.com/t/c/font_4999485_rqpkgxb1y2m.css"
    />
  </head>
  <body>
    <p>
      <i class="iconfont icon-binggao"></i>
      <span>文本内容</span>
      <i class="iconfont icon-jiandan"></i>
    </p>
  </body>
</html>
```

### 2. 离线本地方式

下载字体文件到本地使用：

```css :collapsed-lines
/* iconfont.css */
@font-face {
  font-family: "iconfont"; /* Project id 4999485 */
  src: url("iconfont.woff2?t=1755177751575") format("woff2"), url("iconfont.woff?t=1755177751575")
      format("woff"), url("iconfont.ttf?t=1755177751575") format("truetype");
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-binggao:before {
  content: "\e6c7";
}

.icon-jiandan:before {
  content: "\e6c8";
}

.icon-hanbao:before {
  content: "\e6c9";
}

.icon-buding:before {
  content: "\e6ca";
}

.icon-qiaokeli:before {
  content: "\e6cb";
}
```

### 3. Unicode 方式

直接使用 Unicode 编码：

```css :collapsed-lines
@font-face {
  font-family: "iconfont"; /* Project id 4999485 */
  src: url("//at.alicdn.com/t/c/font_4999485_rqpkgxb1y2m.woff2?t=1755176623648")
      format("woff2"), url("//at.alicdn.com/t/c/font_4999485_rqpkgxb1y2m.woff?t=1755176623648")
      format("woff"),
    url("//at.alicdn.com/t/c/font_4999485_rqpkgxb1y2m.ttf?t=1755176623648")
      format("truetype");
}

.iconfont {
  font-family: "iconfont";
  font-style: normal;
}
```

```html
<p>
  <i class="iconfont">&#xe6c7;</i>
</p>
```

## 使用方式对比

| 方式     | 优点               | 缺点               | 适用场景           |
| -------- | ------------------ | ------------------ | ------------------ |
| 在线引用 | 简单快速，自动更新 | 依赖网络，可能被墙 | 快速开发，原型设计 |
| 离线本地 | 稳定可靠，加载快速 | 需要手动更新       | 生产环境，正式项目 |
| Unicode  | 直观，易于理解     | 代码可读性差       | 少量图标使用       |

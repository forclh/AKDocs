# iframe 元素

## 什么是 iframe

iframe（内联框架）是一个 HTML 元素，用于在当前网页中嵌入另一个 HTML 页面。它创建了一个独立的浏览上下文，可以显示来自同一域名或不同域名的网页内容。

## iframe 的特性

iframe 是一个**可替换元素**（如 img、video），可替换元素具有以下特点：

1. **通常为行盒**：默认情况下表现为行内元素
2. **显示内容取决于元素属性**：iframe 元素通过 src 属性指定要嵌入的页面
3. **CSS 不能完全控制其中的样式**：嵌入页面的样式由其自身控制
4. **具有行块盒的特点**：可以设置宽高，同时保持行内特性

## 基本语法

```html
<iframe src="页面地址"></iframe>
```

## 常用属性

### 基础属性

- **src**：指定要嵌入的页面 URL
- **name**：为 iframe 指定名称，可作为链接的 target 目标

### 控制属性

- **frameborder**：设置边框（0=无边框，1=有边框）
- **scrolling**：控制滚动条（yes/no/auto）
- **allowfullscreen**：允许全屏显示
- **sandbox**：安全限制（限制脚本执行等）

## 示例

### 网页导航框架

创建一个简单的网页导航系统，点击链接在 iframe 中显示不同页面：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <style>
      iframe {
        width: 100%;
        height: 500px;
      }
    </style>
  </head>
  <body>
    <a href="https://www.baidu.com" target="myframe">百度</a>
    <a href="https://douyu.com" target="myframe">斗鱼</a>
    <a href="https://www.taobao.com" target="myframe">淘宝</a>

    <iframe name="myframe" src="https://www.baidu.com"></iframe>
  </body>
</html>
```

**关键点说明：**

- `target="myframe"`：链接点击后在指定的 iframe 中打开
- `name="myframe"`：为 iframe 指定名称，与 target 对应
- 实现了单页面应用的基本效果

### 嵌入视频播放器

嵌入 B 站等视频平台的播放器：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <style>
      iframe {
        width: 1000px;
        height: 600px;
      }
    </style>
  </head>
  <body>
    <iframe
      src="https://player.bilibili.com/player.html?aid=52736078&cid=92261718&page=1"
      scrolling="no"
      frameborder="no"
      framespacing="0"
      allowfullscreen="true"
    >
    </iframe>
  </body>
</html>
```

**关键点说明：**

- `scrolling="no"`：禁用滚动条
- `frameborder="no"`：移除边框（注意这里使用的是"no"而不是"0"）
- `framespacing="0"`：设置框架间距为 0
- `allowfullscreen="true"`：允许全屏播放
- 适合嵌入第三方视频、地图等服务

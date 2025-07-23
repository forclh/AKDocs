# Animate.css

> 官网：https://animate.style/
>
> CDN：https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.min.css

Animate.css 库提供了大量的动画效果，开发者仅需使用它提供的类名即可

**注意：animate.css 中的动画对行盒无效**

## 基本使用

类名格式为：

```
animate__animated animate__效果名
```

效果名分为以下几个大类，你可以从官网中找到对应的分类，每个分类下有多种效果名可供使用

| 分类               | 含义     |
| ------------------ | -------- |
| Attention seekers  | 强调     |
| Back entrances     | 进入     |
| Back exits         | 退出     |
| Bouncing entrances | 弹跳进入 |
| Bouncing exits     | 弹跳退出 |
| Fading entrances   | 淡入     |
| Fading exits       | 淡出     |
| Flippers           | 翻转     |
| Lightspeed         | 光速     |
| Rotating entrances | 旋转进入 |
| Rotating exits     | 旋转退出 |
| Specials           | 特殊效果 |
| Zooming entrances  | 缩放进入 |
| Zooming exits      | 缩放退出 |
| Sliding entrances  | 滑动进入 |
| Sliding exits      | 滑动退出 |
|                    |          |

## 工具类

Animate.css 还提供了多个工具类，可以控制动画的**延时**、**重复次数**、**速度**

-   延时

    ```css
    /* 默认无延时 */
    animate__delay-1s  /* 延时1秒 */
    animate__delay-2s  /* 延时2秒 */
    animate__delay-3s  /* 延时3秒 */
    animate__delay-4s  /* 延时4秒 */
    animate__delay-5s  /* 延时5秒 */
    ```

-   重复次数

    ```css
    /* 默认重复1次 */
    animate__repeat-2	/* 重复2次 */
    animate__repeat-3	/* 重复3次 */
    animate__infinite	/* 重复无限次 */
    ```

-   速度

    ```css
    /* 默认1秒内完成动画 */
    animate__slow /* 2秒内完成动画 */
    animate__slower	/* 3秒内完成动画 */
    animate__fast	/* 800毫秒内完成动画 */
    animate__faster	/* 500毫秒内完成动画 */
    ```

示例：

```html
<!-- 
使用animate.css
动画名：bounce
速度：快
重复：无限次
延迟：1秒
-->
<h1
    class="
           animate__animated
           animate__bounce
           animate_fast
           animate__infinite
           animate__delay-1s
           "
>
    Hello Animate
</h1>
```

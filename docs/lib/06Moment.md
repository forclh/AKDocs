# Moment

> [官网](https://momentjs.com/)
>
> [中文网](http://momentjs.cn/)
>
> [CDN](https://cdn.bootcdn.net/ajax/libs/moment.js/2.29.1/moment.min.js)
>
> [各种语言包](https://www.bootcdn.cn/moment.js/)

Moment 提供了强大的日期处理能力

## 时间基础知识

## 单位

| 单位               | 名称 | 换算                  |
| ------------------ | ---- | --------------------- |
| hour               | 小时 | 1 day = 24 hours      |
| minute             | 分钟 | 1 hour = 60 minutes   |
| second             | 秒   | 1 minute = 60 seconds |
| millisecond （ms） | 毫秒 | 1 second = 1000 ms    |
| nanosecond （ns）  | 纳秒 | 1 ms = 1000 ns        |

## GMT 和 UTC

世界划分为 24 个时区，北京在东 8 区，格林威治在 0 时区。

![时区](https://gblobscdn.gitbook.com/assets%2F-LQcTxgqTqhC05ckLpLr%2F-LikgRi0I4q8Q0a3kFgz%2F-LikgSk-E-e8AcD50vHu%2F2019-07-02-11-14-46.png?alt=media)

**GMT**：Greenwish Mean Time 格林威治世界时。太阳时，精确到毫秒。

**UTC**：Universal Time Coodinated 世界协调时。以原子时间为计时标准，精确到纳秒。

> 国际标准中，已全面使用 UTC 时间，而不再使用 GMT 时间

GMT 和 UTC 时间在文本表示格式上是一致的，均为`星期缩写, 日期 月份 年份 时间 GMT`，例如：

```
Thu, 27 Aug 2020 08:01:44 GMT
```

另外，ISO 8601 标准规定，建议使用以下方式表示时间：

```
YYYY-MM-DDTHH:mm:ss.msZ
例如：
2020-08-27T08:01:44.000Z
```

**GMT、UTC、ISO 8601 都表示的是零时区的时间**

## Unix 时间戳

> Unix 时间戳（Unix Timestamp）是 Unix 系统最早提出的概念

它将 UTC 时间 1970 年 1 月 1 日凌晨作为起始时间，到指定时间经过的秒数（毫秒数）

## 程序中的时间处理

**程序对时间的计算、存储务必使用 UTC 时间，或者时间戳**

**在和用户交互时，将 UTC 时间或时间戳转换为更加友好的文本**

<img src="http://mdrs.yuanjin.tech/img/20200827163636.png" alt="image-20200827163636508" style="zoom:50%;" />

思考下面的问题：

1. 用户的生日是本地时间还是 UTC 时间？
2. 如果要比较两个日期的大小，是比较本地时间还是比较 UTC 时间？
3. 如果要显示文章的发布日期，是显示本地时间还是显示 UTC 时间？
4. `北京时间2020-8-28 10:00:00`和`格林威治2020-8-28 02:00:00`，两个时间哪个大，哪个小？
5. `北京的时间戳为0`和`格林威治的时间戳为0`，它们的时间一样吗？
6. 一个中国用户注册时填写的生日是`1970-1-1`，它出生的 UTC 时间是多少？时间戳是多少？

## Moment 的核心用法

<img src="http://mdrs.yuanjin.tech/img/20200828144832.png" alt="image-20200828144832151" style="zoom:50%;" />

Moment 的使用分为两个部分：

1. 获得 Moment 对象
2. 针对 Moment 对象做各种操作

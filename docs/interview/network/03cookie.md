# Cookie ✨

[[TOC]]

::: tip 要点速览

- Cookie 是浏览器的“卡包”，按域与路径自动随请求发送，用于身份与偏好传递。
- 匹配条件：未过期、域匹配、路径匹配、协议匹配（`secure`）后才会被附带到请求头 `Cookie`。
- 关键属性：`Domain/Path/Expires/Max-Age/Secure/HttpOnly/SameSite`；`SameSite=None` 需同时 `Secure`。
- 安全建议：认证类 Cookie 设置 `HttpOnly`、`Secure`、恰当的 `SameSite`，并控制有效期与作用域。
- 传输规范：服务器通过多个 `Set-Cookie` 响应头下发；客户端可用 `document.cookie` 读写（受 `HttpOnly` 限制）。
  :::

## 一个不大不小的问题

假设服务器有一个接口，通过请求这个接口，可以添加一个管理员

但是，不是任何人都有权力做这种操作的

那么服务器如何知道请求接口的人是有权力的呢？

答案是：只有登录过的管理员才能做这种操作

可问题是，客户端和服务器的传输使用的是 http 协议，**http 协议是无状态的**，什么叫无状态，就是**每个 HTTP 请求都是完全独立的，服务器不会“记住”之前的请求**

![](http://mdrs.yuanjin.tech/img/image-20200417161014030.png)

![](http://mdrs.yuanjin.tech/img/image-20200417161244373.png)

由于 http 协议的无状态，服务器**忘记**了之前的所有请求，它无法确定这一次请求的客户端，就是之前登录成功的那个客户端。

> 你可以把服务器想象成有着严重脸盲症的东哥，他没有办法分清楚跟他说话的人之前做过什么

于是，服务器想了一个办法

它按照下面的流程来认证客户端的身份

1. 客户端登录成功后，服务器会给客户端一个**出入证**
2. 后续客户端的每次请求，都必须要**附带这个出入证**

![](http://mdrs.yuanjin.tech/img/image-20200417161950450.png)

服务器发扬了认证不认人的优良传统，就可以很轻松的识别身份了。

但是，用户不可能只在一个网站登录，于是**客户端会收到来自各个网站的出入证**，因此，就要求客户端要有一个类似于卡包的东西，能够具备下面的功能：

1. **能够存放多个出入证**。这些出入证来自不同的网站，也可能是一个网站有多个出入证，分别用于出入不同的地方
2. **能够自动出示出入证**。客户端在访问不同的网站时，能够自动的把对应的出入证附带请求发送出去。
3. **正确的出示出入证**。客户端不能将肯德基的出入证发送给麦当劳。
4. **管理出入证的有效期**。客户端要能够自动的发现那些已经过期的出入证，并把它从卡包内移除。

能够满足上面所有要求的，就是 cookie

cookie 类似于一个卡包，专门用于存放各种出入证，并有着一套机制来自动管理这些证件。

卡包内的每一张卡片，称之为**一个 cookie**。

## cookie 的组成

cookie 是浏览器中特有的一个概念，它就像浏览器的专属卡包，管理着各个网站的身份信息。

每个 cookie 就相当于是属于某个网站的一个卡片，它记录了下面的信息：

- key：键，比如「身份编号」
- value：值，比如阿卡的身份编号「14563D1550F2F76D69ECBF4DD54ABC95」，这有点像卡片的条形码，当然，它可以是任何信息
- domain：域，表达这个 cookie 是属于哪个网站的，比如`forclh.top`，表示这个 cookie 是属于`forclh.top`这个网站的
- path：路径，表达**这个 cookie 是属于该网站的哪个基路径的**，就好比是同一家公司不同部门会颁发不同的出入证。比如`/news`，表示这个 cookie 属于`/news`这个路径的。（后续详细解释）
- secure：**是否使用安全传输**（后续详细解释）
- expire：过期时间，表示该 cookie 在什么时候过期

### 属性对照表

| 属性       | 含义                 | 示例                             | 默认值                   | 说明                                  |
| ---------- | -------------------- | -------------------------------- | ------------------------ | ------------------------------------- |
| `key`      | 名称                 | `token`                          | 必填                     | 键名唯一性受 `domain+path` 作用域影响 |
| `value`    | 值                   | `eyJhbGci...`                    | 必填                     | 建议长度受限，避免过大                |
| `domain`   | 作用域域名           | `forclh.top` 或 `www.forclh.top` | 当前请求域               | 子域匹配规则见下文                    |
| `path`     | 作用域路径           | `/`、`/news`                     | 当前请求路径             | 前缀匹配，`/` 可匹配所有路径          |
| `expires`  | 绝对过期时间         | `Fri, 17 Apr 2020 09:35:59 GMT`  | 会话结束                 | 到期后自动失效                        |
| `max-age`  | 相对有效期（秒）     | `3600`                           | 会话结束                 | 与 `expires` 二选一                   |
| `secure`   | 仅随 HTTPS 发送      | `Secure`                         | 否                       | `SameSite=None` 必须同时 `Secure`     |
| `httponly` | 仅传输不可被 JS 读取 | `HttpOnly`                       | 否                       | 防范 XSS 窃取敏感 Cookie              |
| `samesite` | 跨站携带策略         | `Strict`/`Lax`/`None`            | 浏览器默认（常为 `Lax`） | 减少 CSRF 风险；`None` 需 `Secure`    |

当浏览器向服务器发送一个请求的时候，它会瞄一眼自己的卡包，看看哪些卡片适合附带捎给服务器

如果一个 cookie**同时满足**以下条件，则这个 cookie 会被附带到请求中

- cookie 没有过期
- cookie 中的域和这次请求的域是匹配的
  - 比如 cookie 中的域是`forclh.top`，则可以匹配的请求域是`forclh.top`、`www.forclh.top`、`blogs.forclh.top`等等
  - 比如 cookie 中的域是`www.forclh.top`，则只能匹配`www.forclh.top`这样的请求域
  - **cookie 是不在乎端口的，只要域匹配**即可
- cookie 中的 path 和这次请求的 path 是匹配的
  - 比如 cookie 中的 path 是`/news`，则可以匹配的请求路径可以是`/news`、`/news/detail`、`/news/a/b/c`等等，但不能匹配`/blogs`
  - 如果 cookie 的 path 是`/`，可以想象，能够匹配所有的路径
- 验证 cookie 的安全传输
  - **如果 cookie 的 secure 属性是 true，则请求协议必须是`https`，否则不会发送该 cookie**
  - 如果 cookie 的 secure 属性是 false，则请求协议可以是`http`，也可以是`https`

::: warning 跨站策略与第三方 Cookie

- 现代浏览器对第三方 Cookie 有更严格的限制；跨站请求通常需 `SameSite=None; Secure` 才能携带 Cookie。
- 针对 CSRF 风险，认证 Cookie 建议设置 `SameSite=Lax/Strict`，并配合 CSRF Token 等机制。
  :::

如果一个 cookie 满足了上述的所有条件，则浏览器会把它自动加入到这次请求中

具体加入的方式是，**浏览器会将符合条件的 cookie，自动放置到请求头中**，例如，当我在浏览器中访问百度的时候，它在请求头中附带了下面的 cookie：

![](http://mdrs.yuanjin.tech/img/image-20200417170328584.png)

看到打马赛克的地方了吗？这部分就是通过请求头`cookie`发送到服务器的，它的格式是`键=值; 键=值; 键=值; ...`，每一个键值对就是一个符合条件的 cookie。

## 如何设置 cookie

由于 cookie 是保存在浏览器端的，同时，很多证件又是服务器颁发的

所以，cookie 的设置有两种模式：

- **服务器响应**：这种模式是非常普遍的，当服务器决定给客户端颁发一个证件时，它会在响应的消息中包含 cookie，浏览器会自动的把 cookie 保存到卡包中
- **客户端自行设置**：这种模式少见一些，不过也有可能会发生，比如用户关闭了某个广告，并选择了「以后不要再弹出」，此时就可以把这种小信息直接通过浏览器的 JS 代码保存到 cookie 中。后续请求服务器时，服务器会看到客户端不想要再次弹出广告的 cookie，于是就不会再发送广告过来了。

### 服务器端设置 cookie

**服务器可以通过<span style="color:red">设置响应头</span>，来告诉浏览器应该如何设置 cookie**

响应头按照下面的格式设置：

```
Set-Cookie: cookie1
Set-Cookie: cookie2
Set-Cookie: cookie3
```

通过这种模式，就可以在一次响应中设置多个 cookie 了，具体设置多少个 cookie，设置什么 cookie，根据你的需要自行处理

其中，每个 cookie 的格式如下：

```
key=value; Path=/; Domain=forclh.top; Expires=Fri, 17 Apr 2020 09:35:59 GMT; Max-Age=3600; Secure; HttpOnly; SameSite=Lax
```

**每个 cookie 除了键值对是必须要设置的，其他的属性都是可选的，并且顺序不限**

当这样的响应头到达客户端后，<span style="color:red">**浏览器会自动的将 cookie 保存到卡包中，如果卡包中已经存在一模一样的卡片（其他 path、domain 相同），则会自动的覆盖之前的设置**</span>。

下面，依次说明每个属性值：

#### path

设置 cookie 的路径。如果不设置，浏览器会将其**自动设置为当前请求的路径**。比如，浏览器请求的地址是`/login`，服务器响应了一个`set-cookie: a=1`，浏览器会将该 cookie 的 path 设置为请求的路径`/login`

#### domain

设置 cookie 的域。如果不设置，浏览器会**自动将其设置为当前的请求域**，比如，浏览器请求的地址是
`<http://www.forclh.top>`
，服务器响应了一个
`set-cookie: a=1`
，浏览器会将该 cookie 的 domain 设置为请求的域
`www.forclh.top`

- 这里值得注意的是，如果服务器响应了一个无效的域，浏览器是不认的
- 什么是无效的域？就是响应的域连根域都不一样。比如，浏览器请求的域是`forclh.top`，服务器响应的 cookie 是`set-cookie: a=1; domain=baidu.com`，这样的域浏览器是不认的。
- 如果浏览器连这样的情况都允许，就意味着张三的服务器，有权利给用户一个 cookie，用于访问李四的服务器，这会造成很多安全性的问题

::: tip 子域匹配规则

- 当 `Domain=forclh.top` 时，`www.forclh.top`、`blogs.forclh.top` 等子域均可匹配。
- 当 `Domain=www.forclh.top` 时，仅匹配该子域，不匹配其他子域。
  :::

#### expire

设置 cookie 的过期时间。这里必须是一个有效的 GMT 时间，即格林威治标准时间字符串，比如`Fri, 17 Apr 2020 09:35:59 GMT`，表示格林威治时间的`2020-04-17 09:35:59`，即北京时间的`2020-04-17 17:35:59`。当**客户端的时间达到这个时间点后，会自动销毁该 cookie**。

#### max-age

设置 cookie 的相对有效期。expire 和 max-age 通常仅设置一个即可。比如设置`max-age`为`1000`，浏览器在添加 cookie 时，会自动设置它的`expire`为当前时间加上 1000 秒，作为过期时间。 如果**不设置 expire，又没有设置 max-age，则表示会话结束后过期**。对于大部分浏览器而言，关闭所有浏览器窗口意味着会话结束。

#### secure

设置 cookie 是否是安全连接。如果设置了该值，则表示**该 cookie 后续只能随着`https`请求发送**。如果不设置，则表示该 cookie 会随着所有请求发送。

#### httponly

设置 cookie 是否仅能用于传输。如果设置了该值，表示**该 cookie 仅能用于传输，而不允许在客户端通过 JS 获取，这对防止跨站脚本攻击（[XSS](./15XSS攻击.md)）会很有用**。

- 未设置 httponly

![](https://bu.dusays.com/2025/07/16/68774bd632446.png)

- 设置了 httponly

![](https://bu.dusays.com/2025/07/16/68774bd6007ad.png)

### 举例

下面来一个例子，客户端通过`post`请求服务器`http://forclh.top/login`，并在消息体中给予了账号和密码，服务器验证登录成功后，在响应头中加入了以下内容：

```
Set-Cookie: token=123456; Path=/; Max-Age=3600; HttpOnly; SameSite=Lax
```

当该响应到达浏览器后，浏览器会创建下面的 cookie：

```yaml
key: token
value: 123456
domain: forclh.top
path: /
expire: 2020-04-17 18:55:00 #假设当前时间是2020-04-17 17:55:00
secure: false #任何请求都可以附带这个cookie，只要满足其他要求
httponly: true #不允许JS获取该cookie
```

于是，随着浏览器后续对服务器的请求，只要满足要求，这个 cookie 就会被附带到请求头中传给服务器：

```yaml
cookie: token=123456; 其他cookie...
```

### 删除 cookie

现在，还剩下最后一个问题，就是如何删除浏览器的一个 cookie 呢？

如果要删除浏览器的 cookie，只需要让服务器响应一个同样的域、同样的路径、同样的 key，只是时间过期的 cookie 即可

**所以，删除 cookie 其实就是修改 cookie**

下面的响应会让浏览器删除`token`

```yaml
Set-Cookie: token=; Domain=forclh.top; Path=/; Max-Age=-1
```

浏览器按照要求修改了 cookie 后，会发现 cookie 已经过期，于是自然就会删除了。

> 无论是修改还是删除，都要注意 cookie 的域和路径，因为完全可能存在域或路径不同，但 key 相同的 cookie
>
> 因此无法仅通过 key 确定是哪一个 cookie

### 客户端设置 cookie

既然 cookie 是存放在浏览器端的，所以浏览器向 JS 公开了接口，让其可以设置 cookie

```js
// 写入：键值与属性（注意：无法设置 HttpOnly）
document.cookie = "token=abc123; Path=/; Max-Age=3600; SameSite=Lax";

// 读取：从 document.cookie 中解析目标键
function getCookie(name) {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}

// 删除：设置过期或 max-age 为负数（作用域需一致）
document.cookie = "token=; Path=/; Max-Age=-1";
```

::: danger 读取限制
带有 `HttpOnly` 的 Cookie 无法通过 `document.cookie` 读取，仅能在传输层使用，浏览器会自动附带到请求头。
:::

可以看出，在客户端设置 cookie，和服务器设置 cookie 的格式一样，只是有下面的不同

- **没有 httponly。因为 httponly 本来就是为了限制在客户端访问的，既然你是在客户端配置，自然失去了限制的意义**。
- path 的默认值。在服务器端设置 cookie 时，如果没有写 path，使用的是请求的 path。而在客户端设置 cookie 时，也许根本没有请求发生。因此，**path 在客户端设置时的默认值是当前网页的 path**
- domain 的默认值。和 path 同理，**客户端设置时的默认值是当前网页的 domain**
- 其他：一样
- 删除 cookie：和服务器也一样，修改 cookie 的过期时间即可

## 总结

以上，就是 cookie 原理部分的内容。

如果把它用于登录场景，就是如下的流程：

**登录请求**

1. 浏览器发送请求到服务器，附带账号密码
2. 服务器验证账号密码是否正确，如果不正确，响应错误，如果正确，在响应头中设置 cookie，附带登录认证信息（至于登录认证信息是设么样的，如何设计，要考虑哪些问题，就是另一个话题了，可以了解 [JWT](./06jwt.md)）
3. 客户端收到 cookie，浏览器自动记录下来

**后续请求**

1. 浏览器发送请求到服务器，希望添加一个管理员，并将 cookie 自动附带到请求中
2. 服务器先获取 cookie，验证 cookie 中的信息是否正确，如果不正确，不予以操作，如果正确，完成正常的业务流程

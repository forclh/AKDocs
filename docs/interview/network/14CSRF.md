# ✨ CSRF 攻击

CSRF（Cross-site request forgery，**跨站请求伪造**）

它是指攻击者**利用了用户的身份信息，执行了用户非本意的操作**

![](http://mdrs.yuanjin.tech/img/20211101145156.png)

## 防御方式

| 防御手段                                                                                                                                                | 防御力          | 问题                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 不使用 cookie                                                                                                                                           | ⭐️⭐️⭐️⭐️⭐️ | 兼容性略差（使用 H5 的 localStorage）<br>ssr 会遇到困难（因为登录和不登陆服务器返回的页面大概率是不同的，而第一次请求无法携带 localStorage），但可解决 |
| 使用**sameSite**（cookie 中的一个特殊字段，**当值为 strict 的时候表示，发送请求的页面需要和获得 cookie 的页面为相同站点，但是太过严格，一般使用 lax**） | ⭐️⭐️⭐️⭐️    | 兼容性差<br>容易挡住自己人                                                                                                                             |
| 使用**csrf token**                                                                                                                                      | ⭐️⭐️⭐️⭐️⭐️ | 获取到 token 后未进行操作仍然会被攻击                                                                                                                  |
| 使用 referer 防护                                                                                                                                       | ⭐️⭐️          | 过去很常用，现在已经发现漏洞                                                                                                                           |

## 面试题

介绍 csrf 攻击

> CSRF 是跨站请求伪造，是一种挟制**用户在当前已登录的 Web 应用上执行非本意的操作的攻击方法**
>
> 它首先引导用户访问一个危险网站，**当用户访问网站后，网站会发送请求（img\iframe）到被攻击的站点，这次请求会携带用户的 cookie 发送**，因此就利用了用户的身份信息完成攻击
>
> 防御 CSRF 攻击有多种手段：
>
> 1. 不使用 cookie
> 2. 为表单添加校验的 token 校验
> 3. cookie 中使用 sameSite 字段
> 4. 服务器检查 referer 字段（不用了）

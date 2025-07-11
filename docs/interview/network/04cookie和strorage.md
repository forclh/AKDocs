# 面试题

cookie/sessionStorage/localStorage 的区别

> 参考答案：
> 
> cookie、sessionStorage、localStorage 都是**保存本地数据**的方式
> 
> 其中，cookie 兼容性较好，所有浏览器均支持。浏览器针对 cookie 会有一些默认行为，比如当响应头中出现`set-cookie`字段时，浏览器会自动保存 cookie 的值；再比如，浏览器发送请求时，会附带匹配的 cookie 到请求头中。这些默认行为，使得 cookie 长期以来担任着维持登录状态的责任。与此同时，也正是因为浏览器的默认行为，给了恶意攻击者可乘之机，CSRF 攻击就是一个典型的利用 cookie 的攻击方式。虽然 cookie 不断的改进，但前端仍然需要另一种更加安全的保存数据的方式
> 
> HTML5 新增了 sessionStorage 和 localStorage，前者用于保存会话级别的数据，后者用于更持久的保存数据。浏览器针对它们没有任何默认行为，这样一来，就把保存数据、读取数据的工作交给了前端开发者，这就让恶意攻击者难以针对登录状态进行攻击。 cookie 的大小是有限制的，一般浏览器会限制同一个域下的 cookie 总量不超过 4KB，而 sessionStorage 和 localStorage 则拥有更大的空间，多数浏览器一般要求不超过 5MB~10MB cookie 会与 domain、path 关联，而 sessionStorage 和 localStorage 只与 domain 关联

sessionStorage、localStorage的区别在于前者用于**保存会话级别的数据**，后者用于**更持久的保存数据**。

cookie与上述两者的区别在于：

1. cookie **兼容性较好**，所有浏览器均支持。sessionStorage 和 localStorage是HTML5 新增的
2. 浏览器针对 **cookie 会有一些默认行为**，比如当响应头中出现`set-cookie`字段时，浏览器会自动保存 cookie 的值；再比如，浏览器发送请求时，会附带匹配的 cookie 到请求头中。 sessionStorage 和 localStorage需要开发者手动编写代码进行数据的读取和保存
3. 由于**浏览器的默认行为，会使得cookie容易被攻击如：CSRF 攻击就是一个典型的利用 cookie 的攻击方式.**
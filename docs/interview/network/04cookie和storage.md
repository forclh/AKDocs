# Cookie 和 Storage ✨

[[TOC]]

## cookie/sessionStorage/localStorage 的区别

::: tip 要点速览

- 三者均为浏览器本地存储；适用场景与行为不同。
- Cookie：随请求自动发送，常用于会话/认证；容量约 4KB；受 `Domain/Path/SameSite/HttpOnly/Secure` 管控。
- localStorage：持久存储（长期），容量通常 5–10MB；按域隔离；需 JS 主动读写。
- sessionStorage：会话级存储（标签页/窗口生命周期），容量通常 5–10MB；按域隔离；需 JS 主动读写。

:::

## 参考答案

Cookie、sessionStorage、localStorage 都是保存本地数据的方式，但有这些核心差异：

### 行为与默认机制

- Cookie 兼容性好（所有浏览器），并具备默认行为：
  - 响应头出现 `Set-Cookie` 时自动保存；
  - 符合匹配规则的 Cookie 会自动随请求附带到请求头 `Cookie`。
- Storage（local/session）无默认传输行为，完全由前端代码控制读写与发送，降低与会话状态相关的攻击面。

### 持久性与容量

- Cookie 容量一般每域不超过约 4KB（含多个键值的总和），适合小型状态标识。
- localStorage 为持久存储（除非手动清除），多数浏览器限制 5–10MB。
- sessionStorage 为会话级存储（单标签页/窗口生命周期），关闭标签页或窗口即清空，容量同上。

### 作用域与隔离

- Cookie 受 `Domain/Path` 作用域控制，可在子域间共享（视 `Domain` 设置而定），并受 `Secure/HttpOnly/SameSite` 限制。
- localStorage/sessionStorage 只与 `domain` 关联，不区分路径；不同子域互不共享；`sessionStorage` 还隔离不同标签页/窗口。

::: warning 安全与风控

- Cookie 的自动携带可能被 CSRF 利用；建议认证类 Cookie 设置 `HttpOnly/Secure/SameSite` 并配合 CSRF Token。
- 不要把敏感信息（如令牌明文）存入可被 JS 读取的存储（localStorage/sessionStorage/Cookie 非 HttpOnly）。
  :::

## 示例代码

```js
// Cookie：由服务端下发或前端写入（注意：无法设置 HttpOnly）
document.cookie = "pref=dark; Path=/; Max-Age=3600; SameSite=Lax";

// localStorage：长期持久化（同域共享）
localStorage.setItem("theme", "dark");
console.log(localStorage.getItem("theme"));

// sessionStorage：会话期存储（每个标签页独立）
sessionStorage.setItem("tabState", "active");
console.log(sessionStorage.getItem("tabState"));
```

## 对比小结

| 维度     | Cookie                     | localStorage       | sessionStorage                |
| -------- | -------------------------- | ------------------ | ----------------------------- |
| 传输行为 | 自动随请求附带（匹配后）   | 无（需代码控制）   | 无（需代码控制）              |
| 持久性   | 受 `Expires/Max-Age` 控制  | 长期持久           | 会话期（标签页/窗口生命周期） |
| 容量     | ≈ 4KB/域                   | ≈ 5–10MB/域        | ≈ 5–10MB/域                   |
| 作用域   | `Domain/Path` 可控         | 按域隔离           | 按域且标签页隔离              |
| 安全属性 | `HttpOnly/Secure/SameSite` | 无（需自控与加密） | 无（需自控与加密）            |
| 典型用途 | 会话/认证标识、少量偏好    | 业务缓存、偏好配置 | 页面会话状态、临时数据        |

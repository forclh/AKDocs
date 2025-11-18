# CSRF 攻击 ✨

[[TOC]]

::: tip 要点速览

- 概念：跨站请求伪造，利用**浏览器会自动携带凭证（Cookie/会话）在目标站发起请求**，执行非本意操作。
- 成立条件：自动凭证、可被第三方触发的跨站请求、目标接口缺少用户意图验证或防护。
- 高危接口：转账、修改密码、绑定手机、下单支付等“状态改变”接口。
- 关键防护：`SameSite`、CSRF Token、双重提交、校验 `Origin/Referer`、只用非 Cookie 凭证、接口幂等与方法约束。

:::

## 攻击原理与场景

![](http://mdrs.yuanjin.tech/img/20211101145156.png)

- 用户已登录目标网站，浏览器保存了登录 Cookie。
- 攻击者引导用户访问恶意页面，该页面通过 `form/img/iframe` 等发起跨站请求到目标网站。
- 浏览器自动附带 Cookie，若目标接口未做意图校验，即可能执行危险操作。

::: danger 攻击成立的典型条件

- 浏览器自动附带 Cookie（或其他会话凭证）。
- 跨站来源可发起到目标域的请求。
- 目标接口缺少令牌校验或来源校验，且允许 GET/POST 等无额外验证的提交。
  :::

## 防御方式

| 防御手段                                                                    | 防御力          | 适用性与注意点                                                      |
| --------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------- |
| 不使用 Cookie（改用 `Authorization` 头、Token 存储于内存/`sessionStorage`） | ⭐️⭐️⭐️⭐️⭐️ | 跨站不会自动携带；SSR 场景需设计首屏与鉴权流程；谨慎处理 XSS。      |
| `SameSite`（`Lax`/`Strict`/`None`）                                         | ⭐️⭐️⭐️⭐️    | 降低跨站请求携带 Cookie；`None` 需 `Secure`；过严可能影响自身业务。 |
| CSRF Token（同步令牌/双重提交）                                             | ⭐️⭐️⭐️⭐️⭐️ | 后端生成令牌，前端提交时携带，后端校验；适合表单与变更接口。        |
| 校验 `Origin/Referer`                                                       | ⭐️⭐️          | 可作为辅助；存在绕过与兼容问题，不可单独依赖。                      |

::: warning 实施建议

- 对“状态改变”接口统一采用 CSRF Token 校验，并拒绝 GET 修改状态。
- 为 Cookie 设置 `HttpOnly/Secure/SameSite`，跨域场景谨慎使用 `SameSite=None` 与凭证。
- 不要将令牌写入 Cookie 明文；令牌应与会话绑定，具备有效期与一次性策略（可选）。
  :::

### 服务端示例（Express + 同步令牌模式）

```js
const express = require("express");
const crypto = require("crypto");
const app = express();
app.use(express.json());

const sessions = new Map();

function parseCookies(s) {
  const out = {};
  if (!s) return out;
  s.split(";")
    .map((v) => v.trim())
    .forEach((kv) => {
      const [k, ...r] = kv.split("=");
      out[k] = decodeURIComponent(r.join("="));
    });
  return out;
}

app.use((req, res, next) => {
  const c = parseCookies(req.headers.cookie);
  let sid = c.sessionid;
  if (!sid || !sessions.has(sid)) {
    sid = crypto.randomUUID();
    sessions.set(sid, { csrf: crypto.randomBytes(16).toString("hex") });
    res.setHeader(
      "Set-Cookie",
      `sessionid=${sid}; HttpOnly; Path=/; SameSite=Lax`
    );
  }
  req.session = sessions.get(sid);
  next();
});

app.get("/csrf-token", (req, res) => {
  res.json({ token: req.session.csrf });
});

app.post("/transfer", (req, res) => {
  const token = req.headers["x-csrf-token"] || req.body.csrf;
  if (!token || token !== req.session.csrf)
    return res.status(403).json({ ok: false, reason: "csrf" });
  res.json({ ok: true });
});

app.listen(4000);
```

### 前端示例（获取令牌并提交）

```js
async function getToken() {
  const r = await fetch("http://localhost:4000/csrf-token", {
    credentials: "include",
  });
  const j = await r.json();
  return j.token;
}

async function transfer(amount) {
  const token = await getToken();
  const r = await fetch("http://localhost:4000/transfer", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "x-csrf-token": token },
    body: JSON.stringify({ amount, csrf: token }),
  });
  return r.json();
}
```

::: tip 提示

- 令牌需与会话绑定并定期轮换；对关键操作可采用一次性令牌。
- 禁止使用 GET 修改状态；优先限制跨站来源与方法。
  :::

## 面试题速览

- 定义与原理：跨站请求伪造依赖浏览器自动附带凭证在目标站执行操作。
- 常见载体：`form` 自动提交、隐蔽 `img/iframe` 请求、第三方脚本触发导航。
- 防御要点：`SameSite`、CSRF Token、来源校验、凭证策略与方法约束。

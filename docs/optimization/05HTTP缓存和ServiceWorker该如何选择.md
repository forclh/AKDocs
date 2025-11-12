# HTTP 缓存与 Service Worker 选择策略

[[TOC]]

::: tip 要点速览

- 核心差异在“控制权”：HTTP 缓存由服务器通过响应头控制；Service Worker 由开发者用 JS 自定义拦截与缓存策略。
- 场景选择：静态资源（JS/CSS/图片）优先 HTTP 缓存；动态数据与离线访问交给 Service Worker。
- 组合方案最稳：静态资源走响应头 + 动态数据走 SWR 策略；避免让 SW 取代所有 HTTP 缓存。
- 验证路径：DevTools Network 观察命中/验证；Application 面板调试 SW 安装/激活/缓存。
  :::

## 快速上手

目标：一页落地“静态资源走 HTTP 缓存 + API 走 Service Worker”的最小实现。

```http
# 响应头（示例）：为构建产物设置长期缓存（哈希变更即失效）
Cache-Control: max-age=31536000, public
ETag: "app.abc123"

# 某些偶尔更新的静态资源：要求每次验证
Cache-Control: no-cache
ETag: "banner.def456"
```

```html
<!-- 页面注册 Service Worker（需 HTTPS 或 localhost） -->
<script>
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js");
  }
</script>
```

```js
// sw.js：对 /api/ 采用 SWR（先缓存再网络更新），对静态资源保持走浏览器原生 HTTP 缓存
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const isAPI = new URL(request.url).pathname.startsWith("/api/");
  if (!isAPI) return; // 静态资源交给 HTTP 缓存与浏览器默认策略

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request).then((res) => {
        caches.open("api-cache").then((c) => c.put(request, res.clone()));
        return res;
      });
      return cached || network; // 无缓存则走网络；有缓存则先回缓存再更新
    })
  );
});
```

::: warning 正确心智模型

- HTTP 缓存像“自动挡”：由响应头声明策略，浏览器自动命中/验证；适合稳定的静态资源。
- Service Worker 像“手动挡”：开发者编写脚本自定义缓存/降级/离线策略；适合动态与离线场景。
- 两者不是替代关系，而是组合关系：SW 不应取代静态资源的响应头缓存。
  :::

- **核心目标**：掌握 HTTP 缓存与 Service Worker 的核心区别、适用场景及组合使用策略，形成面试结构化答题思路，解决实际项目中“静态资源缓存”与“动态离线体验”需求。

## 面试回答误区与核心分析原则

### 常见误区

多数人回答此类问题时，易陷入“堆砌 API 细节”或“混淆适用场景”的误区，仅罗列两者技术特性，却未点明核心差异与选择逻辑，无法体现解决问题的能力。

### 核心分析原则

**先定义“控制权”，再分场景选择**：这是区分两者的关键框架，视频用“自动挡”与“手动挡”作类比，清晰界定两者定位：

- HTTP 缓存 = 自动挡：无需开发者干预，由服务器通过响应头“发号施令”，浏览器自动执行缓存逻辑；
- Service Worker = 手动挡：由开发者编写 JavaScript 代码，完全自定义缓存规则，可主动拦截请求、控制资源加载。

## HTTP 缓存与 Service Worker 核心区别对比

| 对比维度       | HTTP 缓存                                                              | Service Worker                                       |
| -------------- | ---------------------------------------------------------------------- | ---------------------------------------------------- |
| **控制权归属** | 服务器（通过响应头控制）                                               | 开发者（通过 JS 代码自定义）                         |
| **实现机制**   | 浏览器依据`Cache-Control`/`ETag`等响应头，自动执行缓存、验证、失效逻辑 | 独立于主线程的脚本，拦截网络请求，自定义缓存读写策略 |
| **灵活性**     | 低（仅能通过响应头调整，无法动态修改逻辑）                             | 高（可根据请求类型、网络状态、资源类型灵活定制）     |
| **复杂度**     | 低（无需额外代码，浏览器原生支持）                                     | 高（需编写注册、激活、拦截请求等逻辑，需处理兼容性） |
| **核心能力**   | 静态资源缓存（如 JS、CSS、图片）                                       | 静态+动态资源缓存、离线访问、请求拦截重写            |
| **依赖条件**   | 依赖服务器响应头配置                                                   | 依赖 HTTPS 环境（localhost 除外）、浏览器支持        |

## HTTP 缓存详解：静态资源的“自动化管家”

### 核心机制

HTTP 缓存是浏览器原生的自动化缓存方案，无需开发者编写前端代码，仅需服务器在响应头中配置缓存规则，浏览器会自动完成以下流程：

1. 首次请求：服务器返回资源时，附带`Cache-Control`（缓存时长）、`ETag`（资源标识）等响应头；
2. 后续请求：浏览器先检查本地缓存，若资源未过期则直接使用；若过期则携带`ETag`向服务器验证资源是否更新，未更新则复用缓存。

### 适用场景

**仅用于处理“几乎不变的静态资源”**，例如：

- 项目打包后的 JS/CSS 文件（如`app.[hash].js`，哈希值变化代表资源更新）；
- 图片、字体等静态资源（如首页 Banner 图、图标字体文件）；
- 第三方库 CDN 资源（如 jQuery、Vue 的 CDN 文件）。

### 典型配置示例（服务器响应头）

```http
# 示例1：设置资源缓存1年（哈希值变化时失效）
Cache-Control: max-age=31536000, public
ETag: "5f8d72a3"

# 示例2：资源需每次验证（适用于偶尔更新的静态资源）
Cache-Control: no-cache
ETag: "5f8d72a3"
```

### 关键特点

- 优势：零前端代码成本、性能损耗低、浏览器兼容性极佳；
- 局限：无法缓存动态资源（如 API 接口返回的实时数据）、无法实现离线访问、缓存逻辑完全依赖服务器配置。

## Service Worker 详解：动态场景的“自定义工程师”

### 核心机制

Service Worker 是运行在浏览器后台的独立脚本，脱离主线程，可拦截页面所有网络请求，通过`Cache API`实现自定义缓存逻辑，核心流程：

1. 注册激活：前端代码注册 Service Worker，浏览器在后台安装并激活；
2. 拦截请求：激活后，Service Worker 可拦截页面发出的所有网络请求；
3. 自定义处理：开发者编写逻辑，决定请求是“走缓存”“走网络”还是“缓存+网络”（如 SWR 策略）。

### 适用场景

**用于处理“动态需求或离线场景”**，例如：

1. 实现 PWA 离线访问（如新闻 APP，无网络时展示缓存的新闻内容）；
2. 动态数据缓存（如 API 接口数据，采用 SWR 策略：先返回缓存数据，再异步请求更新缓存，兼顾速度与新鲜度）；
3. 资源拦截重写（如网络异常时，将图片请求重定向到默认占位图）。

### 简化代码示例

```javascript
// 1. 注册Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(() => {
    console.log("Service Worker 注册成功");
  });
}

// 2. sw.js：拦截请求并自定义缓存逻辑
self.addEventListener("fetch", (event) => {
  // 对API请求采用SWR策略
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // 更新缓存
          caches.open("api-cache").then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        });
        // 先返回缓存，无缓存则等网络
        return cachedResponse || fetchPromise;
      })
    );
  }
});
```

### 关键特点

- 优势：可自定义缓存逻辑、支持动态资源缓存、实现离线访问、提升弱网体验；
- 局限：需编写额外代码、依赖 HTTPS 环境、存在浏览器兼容性差异（IE 完全不支持）、调试成本较高。

## 最佳实践：两者结合的“黄金方案”

视频强调：**单一方案无法覆盖所有场景，两者结合才能实现“高效+灵活”的缓存体系**，具体分工如下：
| 资源类型 | 负责方案 | 原因分析 |
|------------------|----------------|-------------------------------------------|
| 静态资源（JS/CSS/图片） | HTTP 缓存 | 自动化、低成本，哈希值机制可保证资源更新时失效 |
| 动态资源（API 数据） | Service Worker | 需自定义 SWR 策略，兼顾“快速响应”与“数据新鲜度” |
| 离线访问需求 | Service Worker | HTTP 缓存无法实现离线，需通过 Service Worker 拦截请求返回缓存 |

### 组合优势

- 性能最大化：静态资源用 HTTP 缓存减少网络请求，动态资源用 Service Worker 优化弱网体验；
- 成本可控：无需为静态资源编写复杂 SW 逻辑，降低开发与维护成本；
- 体验全面：既保证静态资源加载速度，又支持动态数据缓存与离线访问。

## 面试回答框架（结构化示例）

当面试官问“HTTP 缓存和 Service Worker 该如何选择”时，可按以下逻辑回答：

1. **先讲核心区别（控制权）**：  
   “两者最核心的区别是控制权归属——HTTP 缓存是‘自动挡’，由服务器通过响应头控制，浏览器自动执行，适合简单场景；Service Worker 是‘手动挡’，由开发者写 JS 自定义缓存逻辑，适合复杂场景。”

2. **再分场景说应用**：  
   “如果是处理几乎不变的静态资源（如 JS、CSS、图片），优先用 HTTP 缓存，因为它零前端成本、兼容性好，只需服务器配置响应头即可；如果需要动态缓存（如 API 数据）或离线访问（如 PWA），就用 Service Worker，它能拦截请求、自定义 SWR 策略，灵活满足复杂需求。”

3. **最后说组合方案**：  
   “实际项目中建议两者结合：静态资源交给 HTTP 缓存提升加载速度，动态数据和离线需求交给 Service Worker 处理，这样既高效又能覆盖全面场景。”

## 实践建议

::: danger 常见坑与规避

- 仅用 Service Worker 替代所有缓存：会增加复杂度且效果不稳定；静态资源优先响应头缓存。
- 忽视版本策略：构建产物需带哈希并配合 `Cache-Control`，否则更新不及时或命中不稳定。
- SW 作用域与更新陷阱：确保 `sw.js` 路径与作用域正确，调试时在 DevTools Application 面板“跳过等待/更新”。
  :::

1. **优先用 HTTP 缓存处理静态资源**：除非有动态或离线需求，否则不轻易引入 Service Worker，避免过度设计；
2. **Service Worker 按需使用**：仅在需要离线访问、SWR 策略或资源重写时使用，且需做好兼容性降级（如老浏览器不启用 SW）；
3. **注意 SW 调试技巧**：在 Chrome DevTools 的“Application > Service Workers”面板中，可强制更新 SW、清空缓存，避免调试时缓存干扰；
4. **静态资源加哈希后缀**：配合 HTTP 缓存使用，哈希值变化时自动失效旧缓存，避免资源更新不及时的问题。

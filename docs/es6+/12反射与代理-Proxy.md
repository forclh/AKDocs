# 【反射与代理】Proxy👌

[[TOC]]

::: tip 要点速览

- Proxy 是运行时的“拦截层”，让你为对象的基本操作定义自定义行为。
- 在拦截器中用对应的 `Reflect.*` 方法转发真实操作，保持规范不变式与返回值语义。
- 常用 traps：`get`、`set`、`has`、`deleteProperty`、`defineProperty`、`ownKeys`、`getPrototypeOf`、`setPrototypeOf`、`apply`、`construct`。
- 惰性深度代理 + `WeakMap` 缓存可避免重复代理并支持嵌套对象按需拦截。
  :::

## 什么是 Proxy

`Proxy` 通过“代理对象”在运行时拦截并重定义目标对象的一系列基础操作。

```js
// 基本语法：为目标对象 target 创建一个代理，使用 handler 定义拦截逻辑
const p = new Proxy(target, handler);
```

::: info 代理 vs 反射

- 代理负责“拦截与重写”；反射（`Reflect`）负责“执行真实操作并返回结果”。
- 最佳实践是：在代理的各个 trap 中调用对应的 `Reflect` 方法进行转发。
  :::

## 核心 traps 示例与对等转发

```js
const target = {
  a: 1,
  get b() {
    return this.a + 1;
  },
};
const p = new Proxy(target, {
  get(t, key, receiver) {
    console.log("get:", key);
    // 注意第三个参数 receiver，会影响访问器属性中 this 的绑定
    return Reflect.get(t, key, receiver);
  },
  set(t, key, value, receiver) {
    console.log("set:", key, "->", value);
    // 必须返回布尔值；严格模式下返回 false 会触发 TypeError
    return Reflect.set(t, key, value, receiver);
  },
  has(t, key) {
    console.log("has:", key);
    return Reflect.has(t, key);
  },
  deleteProperty(t, key) {
    console.log("delete:", key);
    return Reflect.deleteProperty(t, key);
  },
  defineProperty(t, key, desc) {
    console.log("define:", key);
    return Reflect.defineProperty(t, key, desc); // 布尔返回更易与逻辑协作
  },
  ownKeys(t) {
    console.log("ownKeys");
    return Reflect.ownKeys(t);
  },
});

// 示例调用
p.a = 2; // set
console.log(p.a); // get
"a" in p; // has
delete p.a; // deleteProperty
Object.keys(p); // ownKeys（与可枚举性相关）
```

::: warning 重要差异与不变式

- `set`/`defineProperty` 等需要返回布尔值，错误返回会违反严格模式或不变式。
- `ownKeys` 不能遗漏不可配置属性或返回不存在的不可配置属性，否则会抛错。
- 对访问器属性，传递正确的 `receiver` 以确保 `this` 绑定符合预期。
  :::

## 与函数相关的拦截：apply/construct

```js
function sum(a, b) {
  return a + b;
}
const fnProxy = new Proxy(sum, {
  apply(t, thisArg, args) {
    console.log("apply:", args);
    // 可在此进行校验、打点、限流等，再交由 Reflect.apply 执行
    return Reflect.apply(t, thisArg, args);
  },
  construct(t, args, newTarget) {
    console.log("construct:", args);
    // 对构造调用进行拦截；通常使用 Reflect.construct 保持语义一致
    return Reflect.construct(t, args, newTarget);
  },
});

fnProxy(1, 2); // apply
new fnProxy(3); // construct（如果目标可作为构造函数）
```

## 惰性深度代理与 WeakMap 缓存

在读取到子对象时才继续代理，并缓存已创建的代理，避免重复包裹和循环引用问题：

```js
const cache = new WeakMap();
function getProxy(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (cache.has(obj)) return cache.get(obj);

  const p = new Proxy(obj, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      return value && typeof value === "object" ? getProxy(value) : value;
    },
    set(target, prop, value, receiver) {
      return Reflect.set(target, prop, value, receiver);
    },
    deleteProperty(target, prop) {
      return Reflect.deleteProperty(target, prop);
    },
    has(target, prop) {
      return Reflect.has(target, prop);
    },
    getPrototypeOf(target) {
      return Reflect.getPrototypeOf(target);
    },
    setPrototypeOf(target, proto) {
      return Reflect.setPrototypeOf(target, proto);
    },
  });

  cache.set(obj, p);
  return p;
}
```

::: tip 数组与方法拦截

- 数组的变更通常通过方法触发（如 `push/pop/splice`），会体现在 `get` 到函数再调用；必要时在 `set` 中关注 `length` 或新增索引。
- 通过 `ownKeys` + `get` 可以观察枚举与读取行为，结合 `Reflect` 保持一致性。
  :::

## 常见坑位

::: danger 易踩坑

- 在 `set` trap 中未返回布尔值或始终返回 `true`，导致严格模式/不变式问题。
- `ownKeys` 返回的键集合与目标不一致，尤其是遗漏不可配置属性时会抛错。
- 未考虑 `receiver` 导致访问器属性的 `this` 绑定错误。
- 忘记缓存导致重复代理，或在深层次对象上产生性能问题。
  :::

## 使用建议

- 优先在各 trap 中使用对应的 `Reflect` 方法进行真实操作转发。
- 根据场景选择拦截范围：对象属性访问、函数调用、构造调用、原型相关等。
- 深度结构采用惰性代理与缓存策略，避免一次性预遍历的巨大开销。
- 与描述符协同时，谨慎使用不可配置属性，避免锁死结构导致维护困难。

## 小结

1. `Proxy` 提供运行时拦截能力，可重定义对象的基本操作行为。
2. 与 `Reflect` 协同能确保不变式与返回语义一致，提升可维护性与可测试性。
3. 在复杂对象与数组场景下使用惰性代理与缓存，平衡可控性与性能。

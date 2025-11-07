# 【反射与代理】Reflect 👌

[[TOC]]

::: tip 要点速览

- `Reflect` 是“标准化的底层操作集合”，为属性访问、定义、删除、函数/构造调用等提供一致 API。
- 相比旧语法，Reflect 更倾向于“返回值而非抛错”（如 `defineProperty` 返回布尔值），便于与逻辑流程协作。
- 在 `Proxy` 拦截中优先使用对应的 `Reflect` 方法转发（如 `set`/`get`/`defineProperty` 等），可保持对象不变式与规范一致性。
- `Reflect.apply/construct` 统一函数调用与构造调用的语义；`receiver` 参数在某些 API 中至关重要。
  :::

## 什么是 Reflect

`Reflect` 是一个内置对象，聚合了与对象属性、原型、函数调用相关的底层操作的“标准 API”。它让这些操作从“语法魔法”变为“可编程的函数调用”，更利于组合与管控。

::: info 为什么需要 Reflect？

- 减少魔法：把赋值、删除、调用、原型相关等行为抽取为显式 API，降低心智负担。
- 统一语义：多数方法都有明确返回值（布尔/具体值），便于流程控制与错误处理。
- 与 `Proxy` 协同：拦截器应调用对应的 `Reflect` 方法以保持 ECMAScript 不变式。
  :::

## 核心 API 速览与对等写法

```js
const obj = { x: 1 };

// 读/写/存在性
Reflect.get(obj, "x"); // ≈ obj["x"]
Reflect.set(obj, "x", 2); // ≈ obj["x"] = 2（返回布尔值）
Reflect.has(obj, "x"); // ≈ "x" in obj

// 删除属性
Reflect.deleteProperty(obj, "x"); // ≈ delete obj["x"]（返回布尔值）

// 定义属性（返回布尔值，不抛错）
Reflect.defineProperty(obj, "y", { value: 3, configurable: true });
// Object.defineProperty 在配置非法时会抛错；Reflect 版本会返回 false：
const ok = Reflect.defineProperty(obj, "z", { configurable: false });
console.log(ok); // true/false

// 函数调用与构造调用
function sum(a, b) {
  return a + b;
}
Reflect.apply(sum, null, [1, 2]); // ≈ sum.apply(null, [1, 2])

class A {
  constructor(x) {
    this.x = x;
  }
}
const a = Reflect.construct(A, [10]); // ≈ new A(10)

// 键枚举（包含字符串键与 Symbol 键；仅自有属性，不含原型链）
const s = Symbol("id");
const o = Object.create({ proto: 1 });
Object.defineProperty(o, "hidden", { value: 42, enumerable: false });
o.x = 1;
o[s] = 2;
Reflect.ownKeys(o); // → ["hidden", "x", Symbol(id)]
// ≈ Object.getOwnPropertyNames(o).concat(Object.getOwnPropertySymbols(o))
```

::: tip 关于 Reflect.ownKeys 的差异

- `Reflect.ownKeys(obj)`：返回目标对象“自有属性”的所有键（字符串键 + Symbol 键），**不区分可枚举性**。
- `Object.keys(obj)`：仅返回“**可枚举**的字符串键”。
- `Object.getOwnPropertyNames(obj)`：返回“所有字符串键”（含不可枚举），不包含 Symbol。
- `Object.getOwnPropertySymbols(obj)`：仅返回“所有 Symbol 键”。

在 Proxy 的 `ownKeys` trap 中，应尽量通过 `Reflect.ownKeys` 转发，保持与目标对象的一致性，否则可能违反不变式（如遗漏不可配置属性会抛错）。
:::

::: warning 重要差异

- `Reflect.defineProperty` 与 `Object.defineProperty`：前者失败返回 `false`，后者抛错，需要 `try/catch`。
- `Reflect.set` 返回布尔值，严格模式下对于只读属性会返回 `false`（通过 `Proxy` 的 `set` 需要如实返回）。
- `Reflect.apply/construct` 提供统一接口，适合在元编程场景中组合调用。
  :::

## 与 Proxy 的协同与不变式

在 `Proxy` 拦截器中应尽量通过 `Reflect` 执行真实操作，以保证对象不变式（如不可配置属性的行为、严格模式的返回值约束等）：

```js
const target = { a: 1 };
const p = new Proxy(target, {
  get(t, key, receiver) {
    console.log("get:", key);
    return Reflect.get(t, key, receiver);
  },
  set(t, key, value, receiver) {
    console.log("set:", key, "->", value);
    // 必须返回布尔值，严格模式下返回 false 会触发 TypeError
    return Reflect.set(t, key, value, receiver);
  },
  deleteProperty(t, key) {
    return Reflect.deleteProperty(t, key);
  },
  defineProperty(t, key, desc) {
    return Reflect.defineProperty(t, key, desc); // 布尔返回更易与逻辑协作
  },
});

p.a = 2; // set 拦截，返回 true/false
console.log(p.a); // get 拦截
```

::: danger 常见坑位

- 在 `set` 拦截中不返回布尔值（或错误地返回 `true`），会违反严格模式或对象不变式。
- 忽视 `receiver`：`Reflect.get/set` 的第三/第四个参数会影响访问器属性中的 `this` 绑定。
- 随意定义不可配置属性（`configurable: false`）会锁死结构，后续难以维护。
  :::

## 实战对比：抛错 vs 布尔返回

```js
// Object.defineProperty：错误配置会抛异常
try {
  Object.defineProperty({}, "x", { get: 1 }); // 非函数，抛错
} catch (e) {
  console.error("O.dP 抛错:", e.message);
}

// Reflect.defineProperty：错误配置返回 false
const ok = Reflect.defineProperty({}, "x", { get: 1 });
console.log("R.dP 返回:", ok); // false
```

::: tip 使用建议

- 在 `Proxy` 拦截器内，用相应的 `Reflect` 方法转发真实操作，保持规范一致性与布尔返回。
- 需要流程控制时，优先使用 Reflect（布尔返回），避免到处写 `try/catch`。
- 涉及访问器属性时，正确传递 `receiver`，确保 `get/set` 的 `this` 绑定符合预期。
  :::

## 小结

1. `Reflect` 将底层操作标准化为函数调用，统一返回语义，便于组合与管控。
2. 与 `Proxy` 协同时优先使用 Reflect，以保证对象不变式与严格模式行为。
3. 在实际开发中，使用 `Reflect` 能降低“魔法语法”的心智成本，提升可维护性与可测试性。

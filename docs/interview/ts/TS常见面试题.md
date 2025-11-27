# TS 常见面试题（初学者友好版）

> 本文按难度循序渐进，包含常见考点、简明答案与可运行示例。建议先读“基础概念”，再做“进阶与高级”，最后尝试“实践题”。

## 基础概念

### 1. TypeScript 与 JavaScript 的关系

TypeScript 是在 JavaScript 之上增加了静态类型系统与编译阶段的语言。TS 代码会编译为 JS 运行在任何支持 JS 的环境。

### 2. 常见基本类型有哪些

`string`、`number`、`boolean`、`null`、`undefined`、`symbol`、`bigint`、`object`，以及字面量类型（如特定字符串/数字）。

### 3. any、unknown、never、void 的区别

- `any`：跳过类型检查，能赋值给任何类型。
- `unknown`：未知类型，不能直接使用，需先做类型收窄。
- `never`：不可能有值（如抛错或无限循环）。
- `void`：没有返回值的函数返回类型。

```ts
let a: any = 1;
let u: unknown = "x";
function fail(): never {
  throw new Error("e");
}
function f(): void {}
```

### 4. 类型断言与类型转换的区别

类型断言仅在编译期影响类型，不改变运行时值。类型转换（如 `Number(x)`）在运行时改变值。

```ts
const el = document.getElementById("app") as HTMLDivElement;
const n = Number("42");
```

### 5. 接口（interface）与类型别名（type）的区别

- 两者都可描述对象形状与函数类型。
- `interface` 可多次声明同名合并，支持继承。
- `type` 更通用，可用于联合、交叉、条件类型等。

```ts
interface A {
  x: number;
}
interface A {
  y: string;
}
type B = { x: number } & { y: string };
```

### 6. 联合类型与交叉类型

- 联合 `A | B`：值可能是 A 或 B。
- 交叉 `A & B`：同时满足 A 与 B。

```ts
type Id = string | number;
type WithTime = { createdAt: Date } & { updatedAt: Date };
```

### 7. 可选（`?`）与只读（`readonly`）属性

```ts
interface User {
  readonly id: string;
  name?: string;
}
```

### 8. 函数类型与重载

```ts
type Fn = (x: number, y: number) => number;

function parse(input: string): number;
function parse(input: number): string;
function parse(input: string | number) {
  return typeof input === "string" ? Number(input) : String(input);
}
```

### 9. 枚举与常量枚举

`enum` 在运行时是对象；`const enum` 会在编译时内联，减少体积。

```ts
enum Color {
  Red,
  Green,
  Blue,
}
const enum Code {
  Ok = 200,
  NotFound = 404,
}
```

### 10. 类型推断与类型缩小（narrowing）

TS 会根据上下文推断类型，使用 `typeof`、`instanceof`、`in` 等进行缩小。

```ts
function print(x: string | number) {
  if (typeof x === "string") return x.toUpperCase();
  return x.toFixed(2);
}
```

## 进阶考点

### 11. 类型守卫与自定义守卫

```ts
type Res = { ok: true; data: string } | { ok: false; error: string };

function isOk(r: Res): r is { ok: true; data: string } {
  return r.ok === true;
}

function handle(r: Res) {
  if (isOk(r)) return r.data.length;
  return r.error.length;
}
```

### 12. 泛型与约束、默认类型

```ts
function wrap<T>(value: T): { value: T } {
  return { value };
}

function getProp<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

type Box<T = string> = { value: T };
```

### 13. 常见工具类型

`Partial<T>`、`Required<T>`、`Readonly<T>`、`Pick<T, K>`、`Omit<T, K>`、`Record<K, T>`、`ReturnType<F>`、`Parameters<F>`、`NonNullable<T>`。

```ts
interface U {
  id: string;
  name?: string;
}
type A = Partial<U>;
type B = Required<U>;
type C = Readonly<U>;
type D = Pick<U, "id">;
type E = Omit<U, "name">;
type F = Record<"en" | "zh", string>;
```

### 14. keyof 与 typeof 的用法

```ts
const cfg = { port: 3000, env: "dev" };
type Cfg = typeof cfg;
type Keys = keyof Cfg;
```

### 15. 映射类型与条件类型

```ts
type ReadonlyKeys<T> = { readonly [K in keyof T]: T[K] };
type IsString<T> = T extends string ? true : false;
```

### 16. infer 的基本用法

```ts
type FirstArg<F> = F extends (a: infer A, ...args: any[]) => any ? A : never;
type Element<T> = T extends Array<infer U> ? U : never;
```

### 17. this 类型与 noImplicitThis

在对象方法中声明 `this` 类型可避免误用；开启 `noImplicitThis` 强化检查。

```ts
interface Ctx {
  value: number;
}
function inc(this: Ctx, step: number) {
  this.value += step;
}
```

### 18. 模块与命名空间

现代 TS 推荐使用 ES 模块（`import/export`），命名空间主要用于旧代码或全局声明。

### 19. 声明文件与 @types

第三方库的类型通常由 `@types/<package>` 提供，也可编写 `*.d.ts` 描述全局或库类型。

### 20. tsconfig 常用选项

`strict`、`noImplicitAny`、`target`、`module`、`lib`、`skipLibCheck`、`esModuleInterop` 等影响类型检查与输出目标。

## 高级话题

### 21. Promise 与异步函数的类型

`async` 函数返回 `Promise<T>`，用 `Awaited<T>` 获取异步结果类型。

```ts
async function fetchText(): Promise<string> {
  return "ok";
}
type R = Awaited<ReturnType<typeof fetchText>>;
```

### 22. 结构化类型与名义类型

TS 采用结构化类型系统，类型兼容基于成员结构而非名称。

```ts
type P = { x: number };
type Q = { x: number };
const p: P = { x: 1 };
const q: Q = p;
```

### 23. 函数参数的协变与逆变

在 `strictFunctionTypes` 下，函数参数趋向逆变；返回类型协变，确保类型安全。

### 24. as const 与字面量收窄

```ts
const roles = ["admin", "user"] as const;
type Role = (typeof roles)[number];
```

### 25. satisfies 运算符（TS 4.9+）

用于在不改变推断的情况下校验对象是否满足某类型。

```ts
type Route = { path: string; method: "GET" | "POST" };
const r = { path: "/api", method: "GET" } satisfies Route;
```

## 实践题（带答案）

### 26. 实现非空数组类型 `NonEmptyArray<T>`

```ts
type NonEmptyArray<T> = [T, ...T[]];
const a: NonEmptyArray<number> = [1, 2];
```

### 27. 提取对象值类型 `ValueOf<T>`

```ts
type ValueOf<T> = T[keyof T];
type V = ValueOf<{ a: number; b: string }>;
```

### 28. 深度只读 `DeepReadonly<T>`

```ts
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
```

### 29. 深度可选 `DeepPartial<T>`

```ts
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
```

### 30. 去除只读 `Mutable<T>`

```ts
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
```

### 31. 反转键值的映射类型

```ts
type Flip<T extends Record<string, string | number>> = {
  [K in keyof T as `${T[K]}`]: K;
};

type R = Flip<{ a: 1; b: "x" }>;
```

### 32. 获取函数返回类型与参数类型

```ts
type Ret<F extends (...args: any) => any> = ReturnType<F>;
type Params<F extends (...args: any) => any> = Parameters<F>;
```

### 33. 安全访问对象属性 `getProp`

```ts
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

## 易错与陷阱

### 34. any 污染

一旦进入 `any`，类型检查失效，应优先使用 `unknown` 并收窄。

### 35. 枚举的运行时成本

普通枚举会生成对象与反向映射，`const enum` 可内联降低体积。

### 36. 断言滥用

`as` 只能在你确定类型正确时使用，优先类型守卫与收窄。

### 37. 未开启严格模式

开启 `strict` 与相关选项能显著提升代码质量。

### 38. DOM 类型误用

操作 DOM 时选择正确的元素类型，如 `HTMLInputElement`、`HTMLDivElement`。

---

## 面试小建议

- 用简短代码展示理解，优先体现类型收窄与泛型能力。
- 熟悉工具类型与 `keyof`、`typeof`、`infer` 的组合。
- 对 `tsconfig` 常用项与编译目标有基本认识。
- 写题时尽量避免 `any`，选择更安全的表达。

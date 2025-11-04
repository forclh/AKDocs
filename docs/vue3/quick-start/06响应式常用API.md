# 响应式常用 API 👌

[[TOC]]

## ref 相关

### toRef

将“响应式对象”的某个属性包装为一个 `ref`，保持双向同步：

```js
import { reactive, toRef } from "vue";

const state = reactive({ count: 0 });
const countRef = toRef(state, "count");

console.log(countRef.value); // 0
countRef.value++; // 影响 state.count
console.log(state.count); // 1
```

```js
import { reactive, isReactive, toRef } from "vue";

const state = reactive({
  count: { value: 0 },
});
console.log(isReactive(state)); // true
console.log(isReactive(state.count)); // true

const countRef = toRef(state, "count");
console.log(countRef.value.value); // 0
```

::: tip 要点

- `toRef(obj, key)` 不复制值，而是“引用到源属性”。对 `ref.value` 的修改会同步到源对象。
- 源对象应为 `reactive`；若为普通对象，`toRef` 仍可用，但不会产生响应式更新。
  :::

### toRefs

将一个响应式对象转为一个“由多个 ref 组成的普通对象”，便于解构而不丢失响应性：

```js
import { reactive, toRefs } from "vue";

const state = reactive({ count: 0, message: "hello" });
const { count, message } = toRefs(state); // 解构后仍保持响应式

count.value++;
console.log(state.count); // 1
```

::: tip 使用场景

- 组件 `setup` 中经常需要“解构响应式对象”，用 `toRefs` 保证解构后的变量依然是响应式。
  :::

### unref

若参数是 `ref`，返回其内部值；否则原样返回：

```js
import { ref, unref } from "vue";

const countRef = ref(10);
const normalValue = 20;

console.log(unref(countRef)); // 10
console.log(unref(normalValue)); // 20
```

::: tip 心智模型
`unref(x)` 等价于：`isRef(x) ? x.value : x`。
:::

::: warning 容易忽视
`unref` 只解决“取值”的简化，不会让非响应式值变得响应式。
:::

---

## 只读代理：readonly

对对象（响应式或普通）或 `ref` 创建一个只读代理，阻止“写入”：

```js
import { ref, readonly } from "vue";

const count = ref(0);
const countRO = readonly(count); // count 的只读版本

count.value++; // ✅ 允许修改源
countRO.value++; // ❌ 运行时警告：只读不可写
```

```js
const rawConfig = { apiEndpoint: "https://api.example.com", timeout: 5000 };
const config = readonly(rawConfig);
// config.apiEndpoint = '...' // ❌ 只读不可写
```

::: tip 场景

- 暴露只读配置或状态，约束使用方不可修改源数据。
  :::

::: warning 注意
`readonly` 是深只读；若只需顶层只读可用 `shallowReadonly`（此处仅说明，不展开）。
:::

---

## 判断相关

### isRef 与 isReactive

```js
import {
  ref,
  shallowRef,
  reactive,
  shallowReactive,
  isRef,
  isReactive,
} from "vue";

const obj = { a: 1, b: 2, c: { d: 3, e: 4 } };
const s1 = ref(obj);
const s2 = shallowRef(obj);
const s3 = reactive(obj);
const s4 = shallowReactive(obj);

console.log(isRef(s1)); // true
console.log(isRef(s2)); // true
console.log(isRef(s1.value.c)); // false
console.log(isRef(s2.value.c)); // false
console.log(isReactive(s1.value.c)); // true （ref 持有的对象被深度响应）
console.log(isReactive(s2.value.c)); // false（shallowRef 不深度响应）
console.log(isReactive(s3)); // true
console.log(isReactive(s4)); // true
console.log(isReactive(s3.c)); // true
console.log(isReactive(s4.c)); // false（浅响应不递归）
```

::: tip 结论

- `ref` 持有对象值时会被深度转为响应式（等价于 `reactive`）。
- `shallowRef` 仅在替换 `.value` 时触发更新，内部对象不被转为响应式。
  :::

### isProxy

检查一个对象是否为以下 API 创建的代理：`reactive`、`readonly`、`shallowReactive`、`shallowReadonly`。

```js
import {
  reactive,
  readonly,
  shallowReactive,
  shallowReadonly,
  isProxy,
} from "vue";

const r = reactive({ message: "Hello" });
const ro = readonly({ message: "Hello" });
const sr = shallowReactive({ message: "Hello" });
const sro = shallowReadonly({ message: "Hello" });
const normal = { message: "Hello" };

console.log(isProxy(r)); // true
console.log(isProxy(ro)); // true
console.log(isProxy(sr)); // true
console.log(isProxy(sro)); // true
console.log(isProxy(normal)); // false
```

::: tip 小技巧
调试响应式对象来源时，`isProxy` 很有用。
:::

---

## toValue

与 `unref` 类似，但更灵活：若传入函数则执行并返回其结果。

```js
import { ref, toValue } from "vue";

const countRef = ref(10);
const normalValue = 20;
const getter = () => 30;

console.log(toValue(countRef)); // 10（解包 ref）
console.log(toValue(normalValue)); // 20（原样返回）
console.log(toValue(getter)); // 30（执行函数）
```

::: tip 适用

- 需要统一“可能是值、可能是 ref、可能是 getter”的输入类型时，用 `toValue` 最省心。
  :::

::: warning 与 unref 的区别

- `unref`：仅解包 `ref`；
- `toValue`：解包 `ref`，且若是函数则执行（返回函数结果）。
  :::

---

## 小结

- `toRef`：针对响应式对象的某个属性创建 `ref`，保持双向同步。
- `toRefs`：对象转为“属性为 ref”的普通对象，解构不丢响应。
- `unref`：统一取值；`toValue`：再进一层，支持函数执行。
- `readonly`：提供不可写的只读视图，约束外部修改。
- `isRef`/`isReactive`/`isProxy` 等判断类 API 便于调试与断言。

::: tip 推荐实践

- 解构响应式对象优先使用 `toRefs`；
- 组件向外暴露只读数据使用 `readonly`；
- 统一入参类型用 `toValue`；
- 遇到响应式来源不明时先 `isProxy`/`isReactive` 断言。
  :::

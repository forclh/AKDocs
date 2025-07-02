# 手写computed

**回顾computed的用法**

首先回顾一下 computed 的基本用法：

```jsx
const state = reactive({
  a: 1,
  b: 2
})

const sum = computed(() => {
  return state.a + state.b
})
```

```jsx
const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  get() {
    return firstName.value + ' ' + lastName.value
  },
  set(newValue) {
    ;[firstName.value, lastName.value] = newValue.split(' ')
  }
})
```

**实现computed方法**

首先第一步，我们需要对参数进行归一化，如下所示：

```jsx
function normalizeParameter(getterOrOptions) {
  let getter, setter;
  if (typeof getterOrOptions === "function") {
    getter = getterOrOptions;
    setter = () => {
      console.warn(`Computed property was assigned to but it has no setter.`);
    };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  return { getter, setter };
}
```

上面的方法就是对传入 computed 的参数进行归一化，无论是传递的函数还是对象，统一都转换为对象。

接下啦就是建立依赖关系，如何建立呢？

无外乎就是将传入的 getter 函数运行一遍，getter 函数内部的响应式数据和 getter 产生关联：

```jsx
// value 用于记录计算属性的值，dirty 用于标识是否需要重新计算
let value,
  dirty = true;
// 将 getter 传入 effect，getter 里面的响应式属性就会和 getter 建立依赖关系
const effetcFn = effect(getter, {
  lazy: true,
});
```

这里的 value 用于缓存计算的值，dirty 用于标记数据是否过期，一开始标记为过期方便一开始执行一次计算到最新的值。

lazy 选项标记为 true，因为计算属性只有在访问的之后，才会进行计算。

接下来向外部返回一个对象：

```jsx
const obj = {
  // 外部获取计算属性的值
  get value() {
    if (dirty) {
      // 第一次会进来，先计算一次，然后将至缓存起来
      value = effetcFn();
      dirty = false;
    }
    // 返回计算出来的值
    return value;
  },
  set value(newValue) {
    setter(newValue);
  },
};
return obj;
```

该对象有一个 value 访问器属性，当访问 value 值的时候，会根据当前是否为脏值来决定是否重新计算。

目前为止，我们的计算属性工作一切正常，但是这种情况，某一个函数依赖计算属性的值，例如渲染函数。那么此时计算属性值的变化，应该也会让渲染函数重新执行才对。例如：

```jsx
const state = reactive({
  a: 1,
  b: 2,
});
const sum = computed(() => {
  console.log("computed");
  return state.a + state.b;
});

effect(() => {
  // 假设这个是渲染函数，依赖了 sum 这个计算属性
  console.log("render", sum.value);
});

state.a++
```

执行结果如下：

```jsx
computed
render 3computed
```

可以看到 computed 倒是重新执行了，但是渲染函数并没有重新执行。

怎么办呢？很简单，内部让渲染函数和计算属性的值建立依赖关系即可。

```jsx
const obj = {
  // 外部获取计算属性的值
  get value() {
    // 相当于计算属性的 value 值和渲染函数之间建立了联系
    track(obj, TrackOpTypes.GET, "value");
    // ...
  },
 	// ...
};
return obj;
```

首先在获取依赖属性的值的时候，我们进行依次依赖收集，这样因为渲染函数里面用到了计算属性，因此计算属性 value 值就会和渲染函数产生依赖关系。

```jsx
const effetcFn = effect(getter, {
  lazy: true,
  scheduler() {
    dirty = true;
    // 派发更新，执行和 value 相关的函数，也就是渲染函数。
    trigger(obj, TriggerOpTypes.SET, "value");
  },
});
```

接下来添加配置项 scheduler，之后无论是 state.a 的变化，还是 state.b 的变化，都会进入到 scheduler，而在 scheduler 中，重新将 dirty 标记为脏数据，然后派发和 value 相关的更新即可。

完整的代码如下：

```jsx
import { effect } from "./effect/effect.js";
import track from "./effect/track.js";
import trigger from "./effect/trigger.js";
import { TriggerOpTypes, TrackOpTypes } from "./utils.js";

function normalizeParameter(getterOrOptions) {
  let getter, setter;
  if (typeof getterOrOptions === "function") {
    getter = getterOrOptions;
    setter = () => {
      console.warn(`Computed property was assigned to but it has no setter.`);
    };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  return { getter, setter };
}

/**
 *
 * @param {*} getterOrOptions 可能是函数，也可能是对象
 */
export function computed(getterOrOptions) {
  // 1. 第一步，先做参数归一化
  const { getter, setter } = normalizeParameter(getterOrOptions);

  // value 用于记录计算属性的值，dirty 用于标识是否需要重新计算
  let value,
    dirty = true;
  // 将 getter 传入 effect，getter 里面的响应式属性就会和 getter 建立依赖关系
  const effetcFn = effect(getter, {
    lazy: true,
    scheduler() {
      dirty = true;
      trigger(obj, TriggerOpTypes.SET, "value");
      console.log("j");
    },
  });

  // 2. 第二步，返回一个新的对象
  const obj = {
    // 外部获取计算属性的值
    get value() {
      track(obj, TrackOpTypes.GET, "value");
      if (dirty) {
        // 第一次会进来，先计算一次，然后将至缓存起来
        value = effetcFn();
        dirty = false;
      }
      // 直接计算出来的值
      return value;
    },
    set value(newValue) {
      setter(newValue);
    },
  };
  return obj;
}
```


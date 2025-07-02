# 手写watch

**回顾watch的用法**

```jsx
const x = reactive({
  a: 1,
  b: 2
})

// 单个 ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter 函数
watch(
  () => x.a + x.b,
  (sum) => {
    console.log(`sum is: ${sum}`)
  }
)
```

简单总结起来，就是前面的响应式数据发生变化，重新执行后面的回调函数。回调函数的参数列表中，会传入新的值和旧的值。

另外 watch 还接收第三个参数，是一个选项对象，可以的配置的值有：

- immediate：立即执行一次回调函数
- once：只执行一次
- flush
    - post：在侦听器回调中能访问被 Vue 更新之后的所属组件的 DOM
    - sync：在 Vue 进行任何更新之前触发

watch 方法会返回一个函数，该函数用于停止侦听

```jsx
const unwatch = watch(() => {})

// ...当该侦听器不再需要时
unwatch()
```

**实现watch方法**

首先写一个工具方法 traverse：

```jsx
function traverse(value, seen = new Set()) {
  // 检查 value 是否是对象类型，如果不是对象类型，或者是 null，或者已经访问过，则直接返回 value。
  if (typeof value !== "object" || value === null || seen.has(value)) {
    return value;
  }

  // 将当前的 value 添加到 seen 集合中，标记为已经访问过，防止循环引用导致的无限递归。
  seen.add(value);

  // 使用 for...in 循环遍历对象的所有属性。
  for (const key in value) {
    // 递归调用 traverse，传入当前属性的值和 seen 集合。
    traverse(value[key], seen);
  }

  // 返回原始值
  return value;
}
```

该方法的主要作用是递归遍历一个对象及其所有嵌套的属性，从而触发这些属性的依赖收集。

这个方法在 watch 函数中很重要，因为它确保了所有嵌套属性的依赖关系都能被追踪到，当它们变化时能够触发回调函数。

假设有一个深层嵌套的对象：

```jsx
const obj = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3
    }
  }
};
```

那么整个遍历过程如下：

- 由于 obj 是对象，并且没有访问过，会将 obj 添加到 seen 集合里面
- 遍历 obj 的属性：
    - 访问 obj.a 是数字，会直接返回，不做进一步的处理
    - 访问 obj.b，会进入 traverse(obj.b, seen)
        - 由于 obj.b 是对象，并且未被访问过，将 obj.b 添加到 seen 集合中。
        - 遍历 obj.b 的属性：
            - 访问 obj.b.c 是数字，会直接返回，不做进一步的处理
            - 访问 obj.b.d，会进入 traverse(obj.b.d, seen)
                - 由于 obj.b.d 是对象，并且未被访问过，将 obj.b.d 添加到 seen 集合中。
                - 遍历 obj.b.d 的属性：
                    - 访问 obj.b.c.e 是数字，会直接返回，不做进一步的处理

在这个过程中，每次访问一个属性（例如 obj.b 或 obj.b.d），都会触发依赖收集。这意味着当前活动的 effect 函数会被记录为这些属性的依赖。

接下来咱们仍然是进行参数归一化：

```jsx
/**
 * @param {*} source 
 * @param {*} cb 要执行的回调函数
 * @param {*} options 选项对象
 * @returns
 */
export function watch(source, cb, options = {}) {
  let getter;
  if (typeof source === "function") {
    getter = source;
  } else {
    getter = () => traverse(source);
  }
}
```

在上面的代码中，无论用户的 source 是传递什么类型的值，都转换为函数（这里没有考虑数组的情况）

- source 本来就是函数：直接将 source 赋值给 getter
- source 是一个响应式对象：转换为一个函数，该函数会调用 traverse 方法

接下来定义两个变量，用于存储新旧两个值：

```jsx
let oldValue, newValue;
```

好了，接下来轮到 effect 登场了：

```jsx
const effectFn = effect(() => getter(), {
  lazy: true,
  scheduler: () => {
    newValue = effectFn();
    cb(newValue, oldValue);
    oldValue = newValue;
  },
});
```

这段代码，首先会运行 getter 函数（前面做了参数归一化，已经将 getter 转换为函数了），getter 函数里面的响应式数据就会被依赖收集，当这些响应式数据发生变化的时候，就需要派发更新。

因为这里传递了 scheduler，因此在派发更新的时候，实际上执行的就是 scheduler 对应的函数，实际上也就是这三行代码：

```jsx
newValue = effectFn();cb(newValue, oldValue);oldValue = newValue;
```

这三行代码的意思也非常明确：

- newValue = effectFn( )：重新执行一次 getter，获取到新的值，然后把新的值给 newValue
- cb(newValue, oldValue)：调用用户传入的换掉函数，将新旧值传递过去
- oldValue = newValue：更新 oldValue

再往后走，代码就非常简单了，在此之前之前，我们先把 scheduler 对应的函数先提取出来：

```jsx
const job = () => {
  newValue = effectFn();
  cb(newValue, oldValue);
  oldValue = newValue;
};

const effectFn = effect(() => getter(), {
  lazy: true,
  scheduler: job
});
```

然后实现 immediate，如下：

```jsx
if (options.immediate) {
  job();
} else {
  oldValue = effectFn();
}
```

immediate 的实现无外乎就是立马派发一次更新。而如果没有配置 immediate，实际上也会执行一次依赖函数，只不过算出来的值算作旧值，而非新值。

接下来执行取消侦听，其实也非常简单：

```jsx
return () => {
  cleanup(effectFn);
};
```

就是返回一个函数，函数里面调用 cleanup 将依赖清除掉即可。

你会发现只要前面响应式系统写好了，接下来的这些实现都非常简单。

最后我们再优化一下，添加 flush 配置项的 post 值的支持。flush 的本质就是指定调度函数的执行时机，当 flush 的值为 post 的时候，代表调用函数需要将最终执行的更新函数放到一个微任务队列中，等待 DOM 更新结束后再执行。

代码如下所示：

```jsx
const effectFn = effect(() => getter(), {
  lazy: true,
  scheduler: () => {
    if (options.flush === "post") {
      Promise.resolve().then(job);
    } else {
      job();
    }
  },
});
```

完整代码如下：

```jsx
import { effect, cleanup } from "./effect/effect.js";

/**
 * @param {*} source 
 * @param {*} cb 要执行的回调函数
 * @param {*} options 选项对象
 * @returns
 */
export function watch(source, cb, options = {}) {
  let getter;
  if (typeof source === "function") {
    getter = source;
  } else {
    getter = () => traverse(source);
  }

  // 用于保存上一次的值和当前新的值
  let oldValue, newValue;

  // 这里的 job 就是要执行的函数
  const job = () => {
    newValue = effectFn();
    cb(newValue, oldValue);
    oldValue = newValue;
  };

  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler: () => {
      if (options.flush === "post") {
        Promise.resolve().then(job);
      } else {
        job();
      }
    },
  });

  if (options.immediate) {
    job();
  } else {
    oldValue = effectFn();
  }

  return () => {
    cleanup(effectFn);
  };
}

function traverse(value, seen = new Set()) {
  // 检查 value 是否是对象类型，如果不是对象类型，或者是 null，或者已经访问过，则直接返回 value。
  if (typeof value !== "object" || value === null || seen.has(value)) {
    return value;
  }

  // 将当前的 value 添加到 seen 集合中，标记为已经访问过，防止循环引用导致的无限递归。
  seen.add(value);

  // 使用 for...in 循环遍历对象的所有属性。
  for (const key in value) {
    // 递归调用 traverse，传入当前属性的值和 seen 集合。
    traverse(value[key], seen);
  }

  // 返回原始值
  return value;
}
```


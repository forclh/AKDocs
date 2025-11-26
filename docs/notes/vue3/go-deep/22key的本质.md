# ✨ key 的本质 👌

[[TOC]]

::: tip 要点速览

- 作用：为 VNode 提供唯一标识，帮助 diff 精准匹配、复用与移动节点。
- 无 key 策略：就地更新，适合简单稳定列表；对状态依赖的子组件与 DOM 状态可能不安全。
- 正确用法：使用稳定且唯一的业务 id；避免使用数组下标作为 key。
- 典型场景：列表重排、过滤/插入/删除、过渡动画、可编辑表格、与缓存/KeepAlive 结合。
- 性能与一致性：减少不必要的卸载/重建，避免状态错位与 UI 闪烁。
  :::

## 概念与类比

在关系型数据库中，有一个 primary key 的概念，这个其实和这里的 key 有一定的相似性。

![](https://bu.dusays.com/2025/11/15/69185e8685b33.png)

在关系型数据库中，**primary key 用于标记这条数据的唯一性**，因此在上表中只有 id 这个字段能够作为主键，另外 3 个字段都不行。

那么为什么需要对一条数据做唯一性标识呢？那就是**方便精准的查找**。这就好比现实生活中的身份证号，所有人都是独一无二的，你名字可能相同、年龄、性别这些都可能相同，而身份证号则是每个人的一个唯一标识，能够精准找到这个人。

Vue 中的 key，道理就是一样的，key 其实也是用来做唯一标识，谁的唯一标识呢，就是**虚拟节点 VNode 的唯一标识**。

## 不采用复用策略

假设更新前的虚拟 DOM 为：

```jsx
const oldVNode = {
  type: "div",
  children: [
    { type: "p", children: "1" },
    { type: "p", children: "2" },
    { type: "p", children: "3" },
  ],
};
```

```html
<div>
  <p>1</p>
  <p>2</p>
  <p>3</p>
</div>
```

更新后的虚拟 DOM 为：

```jsx
const newVNode = {
  type: "div",
  children: [
    { type: "p", children: "4" },
    { type: "p", children: "5" },
    { type: "p", children: "6" },
  ],
};
```

如果完全不采用复用策略，那么当更新子节点的时候，需要执行 6 次 DOM 操作。

![](https://bu.dusays.com/2025/11/15/69185e86a1993.png)

- 卸载所有旧的子节点，需要 3 次 DOM 的删除操作
- 挂载所有新的子节点，需要 3 次 DOM 的添加操作

通过观察我们发现，VNode 的变化，仅仅是 p 元素的子节点（文本节点）发生变化，p 元素本身其实没有任何的变化。因此最为理想的做法是更新这个 3 个 p 元素的文本节点内容，这样只会涉及到 3 次 DOM 操作，性能提升一倍。

## 采用复用策略

1. 先考虑更新前后长度不变、类型不变的情况

这里可以写出如下的伪代码：

```jsx
function patchChildren(n1, n2, container) {
  if (typeof n2.children === "string") {
    // 说明该节点的子节点就是文本节点
    // ...
  } else if (Array.isArray(n2.children)) {
    // 说明该节点的子节点也是数组
    const oldChildren = n1.children; // 旧的子节点数组
    const newChildren = n2.children; // 新的子节点数组

    // 目前假设长度没有变化
    for (let i = 0; i < oldChildren.length; i++) {
      // 对文本子节点进行更新
      patch(oldChildren[i], newChildren[i]);
    }
  } else {
    // 其他情况
    // ...
  }
}
```

1. 考虑长度发生变化的情况

   - 对于新节点更多的情况，那就需要**挂载新的节点**

   ![](https://bu.dusays.com/2025/11/15/69185e86a5383.png)

   - 对于新节点变少的情况，那就需要**卸载多余的旧节点**

   ![](https://bu.dusays.com/2025/11/15/69185e869f2d0.png)

因此我们的伪代码会发生一些变化：

```jsx
function patchChildren(n1, n2, container) {
  if (typeof n2.children === "string") {
    // 说明该节点的子节点就是文本节点
    // ...
  } else if (Array.isArray(n2.children)) {
    // 说明该节点的子节点也是数组
    const oldChildren = n1.children; // 旧的子节点数组
    const newChildren = n2.children; // 新的子节点数组

    // 存储一下新旧节点的长度
    const oldLen = oldChildren.length; // 旧子节点数组长度
    const newLen = newChildren.length; // 新子节点数组长度

    // 接下来先找这一组长度的公共值，也就是最小值
    const commonLength = Math.min(oldLen, newLen);

    // 先遍历最小值，把该处理的节点先跟新
    for (let i = 0; i < commonLength; i++) {
      // 对文本子节点进行更新
      patch(oldChildren[i], newChildren[i]);
    }

    // 然后接下来处理长度不同的情况
    if (newLen > oldLen) {
      // 新节点多，那么就做新节点的挂载
      for (let i = commonLength; i < newLen; i++) {
        patch(null, newChildren[i], container);
      }
    } else if (oldLen > newLen) {
      // 旧节点多，做旧节点的卸载
      for (let i = commonLength; i < oldLen; i++) {
        unmount(oldChildren[i]);
      }
    }
  } else {
    // 其他情况
    // ...
  }
}
```

1. 考虑类型发生变化

```jsx
const oldVNode = {
  type: "div",
  children: [
    { type: "p", children: "1" },
    { type: "div", children: "2" },
    { type: "span", children: "3" },
  ],
};
```

```jsx
const newVNode = {
  type: "div",
  children: [
    { type: "span", children: "3" },
    { type: "p", children: "1" },
    { type: "div", children: "2" },
  ],
};
```

按照目前上面的设计，当遇到这种情况的时候，通通不能复用，又回到最初的情况，需要 6 次 DOM 的操作。

但是我们稍作观察，会发现上面的例子中仅仅是元素标签移动了位置，因此最理想的情况是移动 DOM 即可，这样也能达到对 DOM 节点的复用。

这里涉及到一个问题：如何确定是同一个类型能够复用的节点？

如果仅仅只是判断 VNode 的 type 值是否相同，这种方式并不可靠！

```jsx
const oldVNode = {
  type: "div",
  children: [
    { type: "p", children: "3" },
    { type: "div", children: "2" },
    { type: "p", children: "1" },
  ],
};
```

```jsx
const newVNode = {
  type: "div",
  children: [
    { type: "p", children: "1" },
    { type: "p", children: "3" },
    { type: "div", children: "2" },
  ],
};
```

在这种情况下，没有办法很好的有一个对应关系，因为有多种相同类型的节点。

![](https://bu.dusays.com/2025/11/15/69185e866f4af.png)

## 引入 key 标识

key 相当于给每一个 VNode 一个身份证号，通过这个身份证号就可以找到唯一的那个 VNode，而非多个。

```jsx
const oldVNode = {
  type: "div",
  children: [
    { type: "p", children: "3", key: 1 },
    { type: "div", children: "2", key: 2 },
    { type: "p", children: "1", key: 3 },
  ],
};
```

```jsx
const newVNode = {
  type: "div",
  children: [
    { type: "p", children: "1", key: 3 },
    { type: "p", children: "3", key: 1 },
    { type: "div", children: "2", key: 2 },
  ],
};
```

![](https://bu.dusays.com/2025/11/15/69185e867d631.png)

因此，在实际的判断中，如果 VNode 的 type 属性和 key 属性都相同，那么就说明是同一组映射，并且在新旧节点中都出现了，那么就可以进行 DOM 节点的复用。

> 哪怕没有 key，我在旧节点中找到一个类型相同的，就复用该 DOM 节点，这样的设计不行么？

实际上，在没有 key 的情况下，Vue 内部采用的就是这样的复用策略，这种策略在 Vue 中被称之为“就地更新”策略。这种策略默认是高效的，**但是这种复用策略仅仅是保证 DOM 节点的类型对上了**，如果节点本身还依赖**子组件状态或者临时 DOM 状态**，由于这种复用策略没有精准的对上号，因此会涉及到子组件状态或者临时 DOM 状态的还原。

举个例子，假设旧节点是三个男生，新节点也是三个男生

![](https://bu.dusays.com/2025/11/15/69185e8682a1f.png)

如果不考虑其他的因素，只考虑是否是男生，然后简单的把名字变一下，那么这种就地复用的策略是非常高效。

但是很多时候依赖子组件状态或者临时的 DOM 状态：

![](https://bu.dusays.com/2025/11/15/69185e86a32ba.png)

在这种情况下，就地复用的策略反而是低效的，因为涉及到子组件状态或者临时的 DOM 状态的恢复。

因此在这个时候，最好的方式就是加上 key，让新旧节点能够精准的对应上。

![](https://bu.dusays.com/2025/11/15/69185e86a23a1.png)

## 反例与注意事项

避免使用下标作为 key。顺序变化会导致错误复用，产生不必要的更新与状态错位。

例如，当你在列表中插入或删除元素时，使用下标会使得每个元素的 key 发生变化，导致 Vue 不能正确识别元素，从而导致状态和数据的不一致。

```jsx
// 初始状态
[
  { id: 1, text: "Item 1" },
  { id: 2, text: "Item 2" },
  { id: 3, text: "Item 3" },
][
  // 删除第二个元素后的状态
  ({ id: 1, text: "Item 1" }, { id: 3, text: "Item 3" })
];
```

在这种情况下，如果使用下标作为 key 值，当删除第二个元素后，第三个元素的下标会从 2 变为 1，这会使 Vue 误以为原本的第三个元素和第二个元素是同一个，从而导致错误的更新。

## 小结

key 本质上是 VNode 的唯一性标识，有助于精确复用与移动节点，保障状态与 UI 的一致性。

## 实际开发注意事项

- 选择稳定唯一的业务 id 作为 key（如 `id/uuid`），避免使用数组下标或易变字段。
- 在存在重排、插入、过滤、动画的列表场景使用 key，降低不必要的挂载/卸载。
- 子组件含本地状态或依赖 DOM 状态的场景务必加 key，避免就地更新造成状态错位。
- 与过渡/动画结合时确保 key 稳定，防止动画中断或重复触发。
- 调试列表更新问题时，打印新旧列表的 key 顺序，定位错位来源。

特别是在渲染列表时。key 的作用主要有以下几点：

1. **高效的更新：** key 帮助 Vue 识别哪些元素是变化的、哪些是新的、哪些是需要被移除的。
   - 在没有 key 的情况下，Vue 会尽量复用已有元素，而不管它们的实际内容是否发生了变化，这可能导致不必要的更新或者错误的更新。
   - 通过使用 key，Vue 可以准确地知道哪些元素发生了变化，从而高效地更新 DOM。
2. **确保元素的唯一性：** key 属性需要是唯一的，这样每个元素在列表中都可以被唯一标识。这避免了在元素移动、插入或删除时出现混淆，确保 Vue 可以正确地追踪每个元素。
3. **提升渲染性能：** 使用 key 可以显著提升列表渲染的性能。因为 Vue 能通过 key 快速定位到需要更新的元素，而不是重新渲染整个列表。尤其在处理大型列表时，使用 key 可以避免大量不必要的 DOM 操作，提升应用的响应速度。

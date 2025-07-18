# ✨ WeakSet 和 WeakMap

## 经典真题

-   是否了解 _WeakMap、WeakSet_（美团 _19_ 年）

## 从对象开始说起

首先我们从大家都熟悉的对象开始说起。

对于对象的使用，大家其实是非常熟悉的，所以我们这里仅简单的过一遍。

```js
const algorithm = { site: "leetcode" };
console.log(algorithm.site); // leetcode

for (const key in algorithm) {
    console.log(key, algorithm[key]);
}

// site leetcode
delete algorithm.site;
console.log(algorithm.site); // undefined
```

在上面的代码中，我们有一个 _algorithm_ 对象，它的 _key_ 和 _value_ 是一个字符串类型的值，之后通过点（ . ）进行值的访问。

另外，_for-in_ 循环也很适合在对象中循环。可以使用中括号（ [ ] ）访问其键对应的值。但是不能使用 _for-of_ 循环，因为**对象是不可迭代的**。

对象的属性可以用 _delete_ 关键字来删除。

好的，我们已经快速讨论了有关对象的一些事项：

-   如何添加属性
-   如何遍历对象
-   如何删除属性

关于对象的讨论暂时就到这儿。

## _Map_

_Map_ 是 _JavaScript_ 中新的集合对象，其功能类似于对象。但是，与常规对象相比，存在一些主要差异。

首先，让我们看一个创建 _Map_ 对象的简单示例。

### 添加属性

首先，通过 _Map_ 构造函数，我们可以创建一个 _Map_ 实例对象出来，如下：

```js
const map = new Map();
// Map(0) {}
```

_Map_ 有一种特殊的方法可在其中添加称为 _set_ 的属性。它有两个参数：键是第一个参数，值是第二个参数。

```js
map.set("name", "john");
// Map(1) {"name" => "john"}
```

但是，它不允许你在其中添加现有数据。如果 _Map_ 对象中**已经存在与新数据的键对应的值，则不会添加新数据。**

```js
map.set("phone", "iPhone");
// Map(2) {"name" => "john", "phone" => "iPhone"}
map.set("phone", "iPhone");
// Map(2) {"name" => "john", "phone" => "iPhone"}
```

但是可以用其他值覆盖现有数据。

```js
map.set("phone", "Galaxy");
// Map(2) {"name" => "john", "phone" => "Galaxy"}
```

二维数组和 _Map_ 对象之间可以很方便的相互转换。例如：

```js
var arr = [
    [1, 2],
    [3, 4],
    [5, 6],
];

var map = new Map(arr);
console.log(map); //Map { 1 => 2, 3 => 4, 5 => 6 }
console.log(Array.from(map)); //[ [ 1, 2 ], [ 3, 4 ], [ 5, 6 ] ]
```

### 获取属性和长度

可以通过 _get_ 方法获得 _Map_ 对象某一条属性的值：

```js
const map = new Map();
map.set("name", "john");
map.set("phone", "iPhone");
console.log(map.get("phone")); // iPhone
```

可以通过 _has_ 方法来查询是否具有某一条属性：

```js
const map = new Map();
map.set("name", "john");
map.set("phone", "iPhone");
console.log(map.has("phone")); // true
```

可以通过 _size_ 属性获取 _Map_ 对象的长度：

```js
const map = new Map();
map.set("name", "john");
map.set("phone", "iPhone");
console.log(map.size); // 2
```

### 遍历 _Map_ 对象

_Map_ 是一个可迭代的对象，**这意味着可以使用 _for-of_ 语句将其映射**。

_Map_ 以数组形式提供数据，要获取键或值则需要解构数组或以索引的方式来进行访问。

```js
for (const item of map) {
    console.dir(item);
}
// Array(2) ["name", "john"]
// Array(2) ["phone", "Galaxy"]
```

要仅获取键或值，还有一些方法可供使用。

```js
map.keys();
// MapIterator {"name", "phone"}
map.values();
// MapIterator {"john", "Galaxy"}
map.entries();
// MapIterator {"name" => "john", "phone" => "Galaxy"}
```

也可以使用 _forEach_ 方法，例如：

```js
const map = new Map();
map.set("name", "john");
map.set("phone", "iPhone");
map.forEach((item) => {
    console.log(item);
});
// john
// iPhone
```

可以使用展开操作符( ... )来获取 _Map_ 的全部数据，因为展开操作符还可以在幕后与可迭代对象一起工作。

```js
const simpleSpreadedMap = [...map];
// [Array(2), Array(2)]
```

### 删除属性

从 _Map_ 对象中删除数据也很容易，你所需要做的就是调用 _delete_。

```js
map.delete("phone");
// true
map.delete("fake");
// false
```

_delete_ 返回布尔值，该布尔值指示 _delete_ 函数是否成功删除了数据。如果是，则返回 _true_，否则返回 _false_。

如果要清空整个 _Map_ 对象，可以使用 _clear_ 方法，如下：

```js
const map = new Map();
map.set("name", "john");
map.set("phone", "iPhone");
console.log(map); // Map(2) { 'name' => 'john', 'phone' => 'iPhone' }
map.clear();
console.log(map); // Map(0) {}
```

### _Map_ 和 _Object_ 的区别

关于 _Map_ 和 _Object_ 的区别，可以参阅下表：

![image-20210930183632548](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-09-30-103632.png)

## _WeakMap_

_WeakMap_ 起源于 _Map_，因此它们彼此非常相似。但是，_WeakMap_ 具有很大的不同。

_WeakMap_ 的名字是怎么来的呢？

嗯，是因为它与它的**引用链接所指向的数据对象的连接或关系没有 _Map_ 的连接或关系那么强**，所以它是弱的。

那么，这到底是什么意思呢？

### **差异 _1_：_key_ 必须是对象**

可以将任何值作为键传入 _Map_ 对象，但 _WeakMap_ 不同，它**只接受一个对象作为键**，否则，它将返回一个错误。

```js
const John = { name: "John" };
const weakMap = new WeakMap();
weakMap.set(John, "student");
// WeakMap {{...} => "student"}
weakMap.set("john", "student");
// Uncaught TypeError: Invalid value used as weak map key
```

### **差异 _2_：并非 _Map_ 中的所有方法都支持**

_WeakMap_ 可以使用的方法如下：

-   _delete_
-   _get_
-   _has_
-   _set_

还有一个最大的不同是 _WeakMap_ **不支持迭代对象**的方法。

### **差异 _3_：当 _GC_ 清理引用时，数据会被删除**

这是和 _Map_ 相比最大的不同。

例如：

```js
let John = { major: "math" };

const map = new Map();
const weakMap = new WeakMap();

map.set(John, "John");
weakMap.set(John, "John");

John = null;
/* John 被垃圾收集 */
```

当 _John_ 对象被垃圾回收时，_Map_ 对象将保持引用链接，而 _WeakMap_ 对象将丢失链接。

所以当你使用 _WeakMap_ 时，你应该考虑这个特点。

## _Set_

_Set_ 也非常类似于 _Map_，但是 _Set_ 对于单个值更有用。

### 添加属性

使用 _add_ 方法可以添加属性。

```js
const set = new Set();

set.add(1);
set.add("john");
set.add(BigInt(10));
// Set(4) {1, "john", 10n}
```

与 _Map_ 一样，_Set_ 也不允许添加相同的值。

```js
set.add(5);
// Set(1) {5}

set.add(5);
// Set(1) {5}
```

对于原始数据类型（_boolean、number、string、null、undefined_），如果储存相同值则只保存一个，对于**引用类型,引用地址完全相同则只会存一个**。

-   _+0_ 与 _-0_ 在存储判断唯一性的时候是恒等的，所以不可以重复。
-   _undefined_ 和 _undefined_ 是恒等的，所以不可以重复。
-   _NaN_ 与 _NaN_ 是不恒等的，但是在 _Set_ 中只能存一个不能重复。

### 遍历对象

**由于 _Set_ 是一个可迭代的对象**，因此可以使用 _for-of_ 或 _forEach_ 语句。

```js
for (const val of set) {
    console.dir(val);
}
// 1
// 'John'
// 10n
// 5

set.forEach((val) => console.dir(val));
// 1
// 'John'
// 10n
// 5
```

### 删除属性

这一部分和 _Map_ 的删除完全一样。如果数据被成功删除，它返回 _true_，否则返回 _false_。

当然也可以使用 clear 方法清空 _Set_ 集合。

```js
set.delete(5);
// true
set.delete(function () {});
// false;

set.clear();
```

如果你不想将相同的值添加到数组表单中，则 _Set_ 可能会非常有用。

```js
/* With Set */
const set = new Set();
set.add(1);
set.add(2);
set.add(2);
set.add(3);
set.add(3);
// Set {1, 2, 3}

// Converting to Array
const arr = [...set];
// [1, 2, 3]

Object.prototype.toString.call(arr);
// [object Array]

/* Without Set */
const hasSameVal = (val) => ar.some(v === val);
const ar = [];

if (!hasSameVal(1)) ar.push(1);
if (!hasSameVal(2)) ar.push(2);
if (!hasSameVal(3)) ar.push(3);
```

### 应用场景

接下来来看一下 _Set_ 常见的应用场景：

```js
//数组去重
...new Set([1,1,2,2,3])

//并集
var arr1 = [1, 2, 3]
var arr2 = [2, 3, 4]
var newArr = [...new Set([...arr1, ...arr2])]
//交集
var arr1 = [1, 2, 3]
var arr2 = [2, 3, 4]
var set1 = new Set(arr1)
var set2 = new Set(arr2)
var newArr = []
set1.forEach(item => {
    set2.has(item) ? newArr.push(item) : ''
})
console.log(newArr)
//差集
var arr1 = [1, 2, 3]
var arr2 = [2, 3, 4]
var set1 = new Set(arr1)
var set2 = new Set(arr2)
var newArr = []
set1.forEach(item => {
    set2.has(item) ? '' : newArr.push(item)
})
set2.forEach(item => {
    set1.has(item) ? '' : newArr.push(item)
})
console.log(newArr)
```

## _WeakSet_

_WeakSet_ 和 _Set_ 区别如下：

-   _WeakSet_ **只能储存对象引用，不能存放值**，而 _Set_ 对象都可以
-   _WeakSet_ 对象中**储存的对象值都是被弱引用的，即垃圾回收机制不考虑 _WeakSet_ 对该对象的引用，如果没有其他的变量或者属性引用这个对象值，则这个对象将会被垃圾回收掉。**（不考虑该对象还存在与 _WeakSet_ 中），所以 _WeakSet_ 对象里有多少个成员元素，取决于垃圾回收机制有没有运行，运行前后成员个数可能不一致，遍历结束之后，有的成员可能取不到，被垃圾回收了。因此 _ES6_ 规定，**_WeakSet_ 对象是无法被遍历的**，也没有办法拿到它包含的所有元素。

_WeakSet_ 能够使用的方法如下：

-   _add(value)_ 方法：在 _WeakSet_ 中添加一个元素。如果添加的元素已存在，则不会进行操作。
-   _delete(value)_ 方法：删除元素 _value_
-   _has(value)_ 方法：判断 _WeakSet_ 对象中是否包含 _value_
-   _clear( )_ 方法：清空所有元素

下面来看一下 _WeakSet_ 的代码示例，与 _WeakMap_ 一样，_WeakSet_ 也将丢失对内部数据的访问链接（如果内部数据已被垃圾收集）。

```js
let John = { major: "math" };

const set = new Set();
const weakSet = new WeakSet();

set.add(John);
// Set {{...}}
weakSet.add(John);
// WeakSet {{...}}

John = null;
/* John 被垃圾收集 */
```

一旦对象 _John_ 被垃圾回收，_WeakSet_ 就无法访问其引用 _John_ 的数据。而且 _WeakSet_ 不支持 _for-of_ 或 _forEach_，因为它不可迭代。

## 比较总结

-   _Map_
    -   键名唯一不可重复
    -   类似于集合，键值对的集合，任何值都可以作为一个键或者一个值
    -   可以遍历，可以转换各种数据格式，方法 _get、set、has、delete_
-   _WeakMap_

    -   只接受**对象为键名**，不接受其他类型的值作为键名，键值可以是任意
    -   **键名是弱引用，键名所指向的对象，会被垃圾回收机制回收**
    -   不能遍历，方法 _get、set、has、delete_

-   _Set_
    -   成员唯一，无序且不会重复
    -   类似于数组集合，键值和键名是一致的（只有键值。没有键名）
    -   可以遍历，方法有 _add、delete、has_
-   _WeakSet_
    -   **只能存储对应引用，不能存放值**
    -   成员都是弱引用，会被垃圾回收机制回收
    -   不**能遍历**，方法有 _add、delete、has_

## 真题解答

-   是否了解 _WeakMap、WeakSet_（美团 _19_ 年）

> 参考答案：
>
> _WeakSet_ 对象是一些对象值的集合, 并且其中的每个对象值都只能出现一次。在 _WeakSet_ 的集合中是唯一的
>
> 它和 _Set_ 对象的区别有两点:
>
> -   与 _Set_ 相比，_WeakSet_ 只能是**对象的集合**，而不能是任何类型的任意值。
> -   _WeakSet_ 持弱引用：集合中对象的引用为弱引用。 如果没有其他的对 _WeakSet_ 中对象的引用，那么这些对象会被当成垃圾回收掉。 这也意味着 _WeakSet_ 中没有存储当前对象的列表。 正因为这样，_WeakSet_ 是不可枚举的。
>
> _WeakMap_ 对象也是键值对的集合。它的**键必须是对象类型**，值可以是任意类型。它的键被弱保持，也就是说，当其键所指对象没有其他地方引用的时候，它会被 _GC_ 回收掉。_WeakMap_ 提供的接口与 _Map_ 相同。
>
> 与 _Map_ 对象不同的是，_WeakMap_ 的键是不可枚举的。不提供列出其键的方法。列表是否存在取决于垃圾回收器的状态，是不可预知的。

-_EOF_-

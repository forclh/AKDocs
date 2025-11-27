# 数据结构与算法

## 链表

::: tip 链表基本原理

- [链表（链式存储）基本原理](https://labuladong.online/algo/data-structure-basic/linkedlist-basic/)

:::

链表相关的题目套路比较固定，主要是双指针技巧。

::: tip 双指针技巧

- [双指针技巧秒杀七道链表题目](https://labuladong.online/algo/essential-technique/linked-list-skills-summary/)
- [链表双指针经典习题](https://labuladong.online/algo/problem-set/linkedlist-two-pointers/)

:::

::: tip 如何判断回文链表

- [如何判断回文链表](https://labuladong.online/algo/data-structure/palindrome-linked-list/)

:::

::: tip 单链表的花式反转方法汇总

- [单链表的花式反转方法汇总](https://labuladong.online/algo/data-structure/reverse-linked-list-recursion/)

:::

## 数组/字符串

::: tip 数组基本原理

- [数组（顺序存储）基本原理](https://labuladong.online/algo/data-structure-basic/array-basic/)
- [环形数组技巧](https://labuladong.online/algo/data-structure-basic/cycle-array/)

:::

数组相关的技巧也主要是双指针，只不过可以分为快慢指针、左右指针几种不同的类型。经典的数组双指针算法有二分搜索、滑动窗口。字符串算法本质上还是数组算法。

::: danger 双指针技巧

- [双指针技巧秒杀七道数组题目](https://labuladong.online/algo/essential-technique/array-two-pointers-summary/)
- [【练习】数组双指针经典习题](https://labuladong.online/algo/problem-set/array-two-pointers/)

:::

::: danger 滑动窗口技巧

- [滑动窗口算法核心代码模板](https://labuladong.online/algo/essential-technique/sliding-window-framework/)
- [【练习】滑动窗口算法经典习题](https://labuladong.online/algo/problem-set/sliding-window/)

::: details 滑动窗口模板代码

```js
// 滑动窗口算法伪码框架
let slidingWindow = function(s) {
    // 用合适的数据结构记录窗口中的数据，根据具体场景变通
    // 比如说，我想记录窗口中元素出现的次数，就用 map
    // 如果我想记录窗口中的元素和，就可以只用一个 int
    let window = ...;

    let left = 0, right = 0;
    while (right < s.length) {
        // c 是将移入窗口的字符
        let c = s[right];
        window.add(c);
        // 增大窗口
        right++;
        // 进行窗口内数据的一系列更新
        ...

        // *** debug 输出的位置 ***
        // 注意在最终的解法代码中不要 print
        // 因为 IO 操作很耗时，可能导致超时
        console.log("window: [%d, %d)\n", left, right);
        // *********************

        // 判断左侧窗口是否要收缩
        while (window needs shrink) {
            // d 是将移出窗口的字符
            let d = s[left];
            window.remove(d);
            // 缩小窗口
            left++;
            // 进行窗口内数据的一系列更新
            ...
        }
    }
};
```

:::

::: danger 二分查找技巧

- [二分搜索算法核心代码模板](https://labuladong.online/algo/essential-technique/binary-search-framework/)
- [实际运用二分搜索时的思维框架](https://labuladong.online/algo/frequency-interview/binary-search-in-action/)

::: details 二分搜索模板代码

```js
let binary_search = function (nums, target) {
  let left = 0,
    right = nums.length - 1;
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    if (nums[mid] < target) {
      left = mid + 1;
    } else if (nums[mid] > target) {
      right = mid - 1;
    } else if (nums[mid] == target) {
      // 直接返回
      return mid;
    }
  }
  // 直接返回
  return -1;
};

// 查找左边界
let left_bound = function (nums, target) {
  let left = 0,
    right = nums.length - 1;
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    if (nums[mid] < target) {
      left = mid + 1;
    } else if (nums[mid] > target) {
      right = mid - 1;
    } else if (nums[mid] == target) {
      // 别返回，锁定左侧边界
      right = mid - 1;
    }
  }
  // 判断 target 是否存在于 nums 中
  if (left < 0 || left >= nums.length) {
    return -1;
  }
  // 判断一下 nums[left] 是不是 target
  return nums[left] == target ? left : -1;
};

// 查找右边界
let right_bound = function (nums, target) {
  let left = 0,
    right = nums.length - 1;
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    if (nums[mid] < target) {
      left = mid + 1;
    } else if (nums[mid] > target) {
      right = mid - 1;
    } else if (nums[mid] == target) {
      // 别返回，锁定右侧边界
      left = mid + 1;
    }
  }
  // 由于 while 的结束条件是 right == left - 1，且现在在求右边界
  // 所以用 right 替代 left - 1 更好记
  if (right < 0 || right >= nums.length) {
    return -1;
  }
  return nums[right] == target ? right : -1;
};
```

:::

::: danger 二维数组遍历技巧

- [二维数组的花式遍历技巧](https://labuladong.online/algo/practice-in-action/2d-array-traversal-summary/)

:::

::: danger 前缀和数组技巧

- [小而美的算法技巧：前缀和数组](https://labuladong.online/algo/data-structure/prefix-sum/)

::: details 前缀和数组模板代码

```js
let NumArray = function (nums) {
  // 前缀和数组
  let preSum = new Array(nums.length + 1).fill(0);

  // preSum[0] = 0，便于计算累加和
  preSum[0] = 0;

  // 输入一个数组，构造前缀和
  for (let i = 1; i < preSum.length; i++) {
    // 计算 nums 的累加和
    preSum[i] = preSum[i - 1] + nums[i - 1];
  }

  this.preSum = preSum;
};

// 查询闭区间 [left, right] 的累加和
NumArray.prototype.sumRange = function (left, right) {
  return this.preSum[right + 1] - this.preSum[left];
};
```

:::

::: danger 差分数组技巧

- [小而美的算法技巧：差分数组](https://labuladong.online/algo/data-structure/diff-array/)

::: details 差分数组模板代码

```js
class Difference {
  constructor(nums) {
    // 差分数组
    this.diff = new Array(nums.length);
    // 根据初始数组构造差分数组
    this.diff[0] = nums[0];
    for (let i = 1; i < nums.length; i++) {
      this.diff[i] = nums[i] - nums[i - 1];
    }
  }

  // 给闭区间 [i, j] 增加 val（可以是负数）
  increment(i, j, val) {
    this.diff[i] += val;
    if (j + 1 < this.diff.length) {
      this.diff[j + 1] -= val;
    }
  }

  // 返回结果数组
  result() {
    let res = new Array(this.diff.length);
    // 根据差分数组构造结果数组
    res[0] = this.diff[0];
    for (let i = 1; i < this.diff.length; i++) {
      res[i] = res[i - 1] + this.diff[i];
    }
    return res;
  }
}
```

:::

::: danger nSum 问题

- [一个方法团灭 nSum 问题](https://labuladong.online/algo/practice-in-action/nsum/)

:::

## 哈希表

- [哈希表核心原理](https://labuladong.online/algo/data-structure-basic/hashmap-basic/)
- [用链表加强哈希表（LinkedHashMap）](https://labuladong.online/algo/data-structure-basic/hashtable-with-linked-list/)
- [用数组加强哈希表（ArrayHashMap）](https://labuladong.online/algo/data-structure-basic/hashtable-with-array/)

## 队列/栈

::: danger 队列/栈的原理

- [队列/栈基本原理](https://labuladong.online/algo/data-structure-basic/queue-stack-basic/)

:::

::: danger 队列实现栈以及栈实现队列

- [队列实现栈以及栈实现队列](https://labuladong.online/algo/data-structure/stack-queue/)

:::

::: danger 经典习题

- [【练习】栈的经典习题](https://labuladong.online/algo/problem-set/stack/)
- [【练习】队列的经典习题](https://labuladong.online/algo/problem-set/queue/)
- [【练习】括号类问题汇总](https://labuladong.online/algo/problem-set/parentheses/)

:::

::: danger 单调栈

- [单调栈算法模板解决三道例题](https://labuladong.online/algo/data-structure/monotonic-stack/)
- [【练习】单调栈的几种变体及经典习题](https://labuladong.online/algo/problem-set/monotonic-stack/)
  :::

::: danger 单调队列

- [单调队列结构解决滑动窗口问题](https://labuladong.online/algo/data-structure/monotonic-queue/)
- [【练习】单调队列的通用实现及经典习题](https://labuladong.online/algo/problem-set/monotonic-queue/)

:::

## 二叉堆 & 优先级队列

- [二叉堆核心原理](https://labuladong.online/algo/data-structure-basic/binary-heap-basic/)

::: details 优先级队列代码模板

```js
class MyPriorityQueue {
  constructor(comparator) {
    this.heap = [];
    this.comparator = comparator || ((a, b) => (a > b ? 1 : a < b ? -1 : 0));
  }

  // 返回堆的大小
  getSize() {
    return this.heap.length;
  }

  // 判断堆是否为空
  isEmpty() {
    return this.heap.length === 0;
  }

  parent(i) {
    return Math.floor((i - 1) / 2);
  }

  left(i) {
    return i * 2 + 1;
  }

  right(i) {
    return i * 2 + 2;
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  // 查，返回堆顶元素，时间复杂度 O(1)
  peek() {
    if (this.isEmpty()) {
      throw new Error("Priority queue underflow");
    }
    return this.heap[0];
  }

  // 增，向堆中插入一个元素，时间复杂度 O(logN)
  push(node) {
    this.heap.push(node);
    this.swim(this.heap.length - 1);
  }

  // 删，删除堆顶元素，时间复杂度 O(logN)
  pop() {
    if (this.isEmpty()) {
      throw new Error("Priority queue underflow");
    }
    const res = this.heap[0];
    const last = this.heap.pop();
    if (!this.isEmpty()) {
      this.heap[0] = last;
      this.sink(0);
    }
    return res;
  }

  swim(i) {
    while (
      i > 0 &&
      this.comparator(this.heap[this.parent(i)], this.heap[i]) > 0
    ) {
      this.swap(this.parent(i), i);
      i = this.parent(i);
    }
  }

  sink(i) {
    while (this.left(i) < this.heap.length) {
      let min = i;
      const l = this.left(i);
      const r = this.right(i);
      if (
        l < this.heap.length &&
        this.comparator(this.heap[l], this.heap[min]) < 0
      ) {
        min = l;
      }
      if (
        r < this.heap.length &&
        this.comparator(this.heap[r], this.heap[min]) < 0
      ) {
        min = r;
      }
      if (min === i) break;
      this.swap(i, min);
      i = min;
    }
  }
}

// 小顶堆
const pq = new MyPriorityQueue(3, (a, b) => a - b);
pq.push(3);
pq.push(1);
pq.push(4);
pq.push(1);
pq.push(5);
pq.push(9);
```

:::

## 二叉树 & 二叉搜索树

## 图算法

## 回溯算法

## DFS

## BFS

## 动态规划

- [最长递增子序列](https://labuladong.online/algo/dynamic-programming/longest-increasing-subsequence/)

> dp[i] 表示以 nums[i] 这个数结尾的最长递增子序列的长度

- [经典动态规划：编辑距离](https://labuladong.online/algo/dynamic-programming/edit-distance/)

> dp[i], dp[j] 定义为 s1[0..i], s2[0..j] 子串的编辑距离

- [经典动态规划：最长公共子序列](https://labuladong.online/algo/dynamic-programming/longest-common-subsequence/)

> dp[i], dp[j] 定义为 s1[0..i], s2[0..j] 子串的最长公共子序列长度

- [动态规划设计：最大子数组](https://labuladong.online/algo/dynamic-programming/maximum-subarray/)

> dp[i] 表示以 nums[i] 为结尾的「最大子数组和」

- [经典动态规划：0-1 背包问题](https://labuladong.online/algo/dynamic-programming/knapsack1/)

> dp[i][w] 表示前 i 个物品，背包重量为 w，所能装下的最大价值

- [经典动态规划：子集背包问题](https://labuladong.online/algo/dynamic-programming/knapsack2/)

> dp[i][w] = x 表示，对于前 i 个物品（i 从 1 开始计数），当前背包的容量为 w 时，若 x 为 true，则说明可以恰好将背包装满，若 x 为 false，则说明不能恰好将背包装满。

## 贪心算法

- [贪心算法解题套路框架](https://labuladong.online/algo/essential-technique/greedy/)

## 数据结构设计

## 数学

- [位操作](https://labuladong.online/algo/frequency-interview/bitwise-operation/)

## 排序算法

## 其他经典

- [如何高效解决接雨水问题](https://labuladong.online/algo/frequency-interview/trapping-rain-water/)
- [一文秒杀所有丑数系列问题](https://labuladong.online/algo/frequency-interview/ugly-number-summary/)
- [扫描线技巧：安排会议室](https://labuladong.online/algo/frequency-interview/scan-line-technique/)
- [带权重的随机选择算法](https://labuladong.online/algo/frequency-interview/random-pick-with-weight/)

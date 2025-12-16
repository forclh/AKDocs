# 回溯算法

## 子集、组合、排列问题

### 元素无重不可复选

[78. 子集](https://leetcode.cn/problems/subsets/description/)

::: details 回溯

```js
/**
 * v1 回溯算法
 * @param {number[]} nums
 * @return {number[][]}
 */
let subsets = function (nums) {
  let result = [];
  let track = []; // 记录路径
  // 回溯算法核心函数，遍历子集问题的回溯树
  function backtrack(start) {
    // 前序遍历位置，每个节点的值都是一个子集
    result.push([...track]);
    for (let i = start; i < nums.length; i++) {
      // 选择
      track.push(nums[i]);
      // 回溯遍历下一层节点
      backtrack(i + 1);
      // 撤销选择
      track.pop();
    }
  }
  backtrack(0);
  return result;
};
```

:::

[77. 组合](https://leetcode.cn/problems/combinations/description/)

::: details 回溯

```js
/**
 * v1 回溯算法（组合问题等同子集问题）
 * @param {number} n
 * @param {number} k
 * @return {number[][]}
 */
let combine = function (n, k) {
  let result = [];
  let track = [];

  function backtrack(start) {
    // 前序位置
    if (k === track.length) {
      // 大小为 k 的组合就是大小为 k 的子集
      result.push([...track]);
    }

    for (let i = start; i < n; i++) {
      track.push(i + 1);
      backtrack(i + 1);
      track.pop();
    }
  }

  backtrack(0);
  return result;
};
```

:::

[46. 全排列](https://leetcode.cn/problems/permutations/description/)

::: details 回溯

```js
/**
 * v1 回溯算法
 * @param {number[]} nums
 * @return {number[][]}
 */
let permute = function (nums) {
  let result = []; // 结果列表

  let track = []; //记录路径
  let used = new Array(nums.length).fill(false); // 选择列表（配合num）

  function backtrack(track, used) {
    // 路径：记录在 track 中
    // 选择列表：nums 中不存在于 track 的那些元素（used[i] 为 false）
    // 结束条件：nums 中的元素全都在 track 中出现
    if (track.length === nums.length) {
      // 触发结束条件
      result.push([...track]); // 注意点: 传递的值是地址引用
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used[i]) {
        continue;
      }
      // 前序位置
      // 做选择
      track.push(nums[i]);
      used[i] = true;
      // 进入下一层决策树
      backtrack(track, used);
      // 后序位置
      // 撤销当前选择
      track.pop();
      used[i] = false;
    }
  }

  backtrack(track, used);
  return result;
};
```

:::

### 元素可重不可复选

[90. 子集 II](https://leetcode.cn/problems/subsets-ii/description/)

::: details 回溯

```js
/**
 * v1 回溯算法
 * 对于一个节点如果存在两条值相同的相邻树枝（排序）则需要剪枝
 * @param {number[]} nums
 * @return {number[][]}
 */
let subsetsWithDup = function (nums) {
  let result = [];
  let track = [];
  // 先排序，让相同的元素靠在一起
  nums.sort((a, b) => a - b); // 原地操作

  backtrack(nums, track, result, 0);
  return result;
};

function backtrack(nums, track, result, start) {
  // 前序位置，每个节点的值都是一个子集
  result.push([...track]);

  for (let i = start; i < nums.length; i++) {
    // 剪枝逻辑
    // 两条值相同的枝条只保留第一条
    if (i > start && nums[i] === nums[i - 1]) {
      continue;
    }

    track.push(nums[i]);
    backtrack(nums, track, result, i + 1);
    track.pop();
  }
}
```

:::

[40. 组合总和 II](https://leetcode.cn/problems/combination-sum-ii/description/)
::: details 回溯

```js
/**
 * v1 回溯算法
 * 组合问题就是子集问题
 * 等价于找出 candidates 数组中和为 target 的子集
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
let combinationSum2 = function (candidates, target) {
  let result = [];
  let track = [];
  let trackSum = 0;
  // 排序使得重复元素相邻便于后续剪枝
  candidates.sort((a, b) => a - b);
  backtrack(candidates, target, track, trackSum, result, 0);
  return result;
};

function backtrack(candidates, target, track, trackSum, result, start) {
  // base case，达到目标和，找到符合条件的组合
  if (trackSum === target) {
    result.push([...track]);
    return;
  }
  // base case，超过目标和，直接结束
  if (trackSum > target) {
    return;
  }
  for (let i = start; i < candidates.length; i++) {
    // 剪枝
    if (i > start && candidates[i] === candidates[i - 1]) {
      continue;
    }
    // 做选择
    let value = candidates[i];
    track.push(value);
    trackSum += value;
    backtrack(candidates, target, track, trackSum, result, i + 1);
    // 撤销选择
    track.pop(value);
    trackSum -= value;
  }
}
```

:::

[47. 全排列 II](https://leetcode.cn/problems/permutations-ii/description/)
::: details 回溯

```js
/**
 * v1 全排列 + 固定相同元素形成的序列顺序进行剪枝
 * @param {number[]} nums
 * @return {number[][]}
 */
let permuteUnique = function (nums) {
  let result = [];
  let track = [];
  let isUsed = new Array(nums.length).fill(false);
  nums.sort((a, b) => a - b);

  backtrack(nums, result, track, isUsed, 0);
  return result;
};

function backtrack(nums, result, track, isUsed, n) {
  if (n === nums.length) {
    result.push([...track]);
    return;
  }
  // 遍历所有选择
  for (let i = 0; i < nums.length; i++) {
    if (isUsed[i]) {
      continue;
    }
    // 剪枝逻辑：固定相同的元素在排列中的相对位置
    if (i > 0 && nums[i] === nums[i - 1] && !isUsed[i - 1]) {
      // 如果前面的相邻相等元素没有用过，则跳过
      continue;
    }
    track.push(nums[i]);
    isUsed[i] = true;
    backtrack(nums, result, track, isUsed, n + 1);
    track.pop();
    isUsed[i] = false;
  }
}
```

:::

### 元素无重可复选

[39. 组合总和](https://leetcode.cn/problems/combination-sum/description/)

::: details 回溯

```js
/**
 * v1 回溯算法
 * 与无重复不可复选的子集/组合问题相类比
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
let combinationSum = function (candidates, target) {
  let result = [];
  let track = [];
  let trackSum = 0;

  backtrack(candidates, target, result, track, trackSum, 0);
  return result;
};

function backtrack(candidates, target, result, track, trackSum, start) {
  // base case
  if (trackSum === target) {
    result.push([...track]);
    return;
  }
  // base case
  if (trackSum > target) {
    return;
  }

  for (let i = start; i < candidates.length; i++) {
    let value = candidates[i];
    track.push(value);
    trackSum += value;
    // 与无重复不可复选的子集/组合问题区别在于 start 变量的设置
    backtrack(candidates, target, result, track, trackSum, i);
    track.pop();
    trackSum -= value;
  }
}
```

:::

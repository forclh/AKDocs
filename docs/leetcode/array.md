# 数组（字符串）

## 双指针

::: details [26. 删除有序数组中的重复项](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/description/)-保留一项
::: code-group

```js [快慢指针]
/**
 * v1 双指针（快慢指针）
 * @param {number[]} nums
 * @return {number}
 */
let removeDuplicates = function (nums) {
  if (nums.length === 0) return 0;
  let slow = 0;
  let fast = 0;
  while (fast < nums.length) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      // 维护 nums[0..slow] 无重复
      nums[slow] = nums[fast];
    }
    fast++;
  }

  return slow + 1;
};
```

:::

::: details ✨[80. 删除有序数组中的重复项 II](https://leetcode.cn/problems/remove-duplicates-from-sorted-array-ii/description/)-保留两项
::: code-group

```js [快慢指针]
/**
 * v1 双指针（快慢指针）
 * @param {number[]} nums
 * @return {number}
 */
let removeDuplicates = function (nums) {
  if (nums.length <= 2) return nums.length;
  // slow 表示当前需要处理的位置
  // fast 出去探路
  let slow = 2;
  let fast = 2;
  while (fast < nums.length) {
    // 确保每个元素最多出现两次
    if (nums[fast] !== nums[slow - 2]) {
      nums[slow] = nums[fast];
      slow++;
    }
    // 如果 nums[slow - 2] === nums[fast] 则 num[slow - 2,...,fast]都相等
    fast++;
  }
  return slow;
};
```

:::

::: details [27. 移除元素](https://leetcode.cn/problems/remove-element/description/)
::: code-group

```js [快慢指针]
/**
 * v1 双指针（快慢指针）
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
let removeElement = function (nums, val) {
  if (nums.length === 0) return 0;
  let slow = 0;
  let fast = 0;
  while (fast < nums.length) {
    if (nums[fast] !== val) {
      nums[slow] = nums[fast];
      slow++;
    }
    fast++;
  }
  return slow;
};
```

:::

::: details [283. 移动零](https://leetcode.cn/problems/move-zeroes/description/)
::: code-group

```js [快慢指针]
/**
 * v1 双指针（快慢指针）
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
let moveZeroes = function (nums) {
  if (nums.length === 0) return 0;
  let slow = 0;
  let fast = 0;
  while (fast < nums.length) {
    if (nums[fast] !== 0) {
      nums[slow] = nums[fast];
      if (fast !== slow) {
        nums[fast] = 0;
      }
      slow++;
    }
    fast++;
  }
};
```

:::

::: details ✨[75. 颜色分类](https://leetcode.cn/problems/sort-colors/description/)
::: code-group

```js [左右指针]
/**
 * v2 双指针（左右指针）
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
let sortColors = function (nums) {
  let left = 0; // nums[0, left) 维护 0
  let right = nums.length - 1; // nums(right, nums.length - 1] 维护 2
  let p = 0;
  // 由于 right 是开区间，所以 p <= right
  while (p <= right) {
    if (nums[p] === 0) {
      // 交换后 nums[p] 必定是 1（因为 [left, p) 区间全为 1），
      // 所以可以直接 p++ 处理下一个
      [nums[p], nums[left]] = [nums[left], nums[p]];
      left++;
      p++;
    } else if (nums[p] === 2) {
      // 交换后 nums[p] 此时是原 nums[right] 的值，是未知的，
      // 可能为 0/1/2，所以 p 不能动，需要再次判断
      [nums[p], nums[right]] = [nums[right], nums[p]];
      right--;
    } else if (nums[p] === 1) {
      p++;
    }
  }
};
```

:::

::: details [167. 两数之和 II - 输入有序数组](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/description/)
::: code-group

```js [左右指针]
/**
 * v1 双指针（左右指针）
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
let twoSum = function (numbers, target) {
  // 一左一右两个指针相向而行
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    let sum = numbers[left] + numbers[right];
    if (sum === target) {
      // 题目要求的索引是从 1 开始的
      return [left + 1, right + 1];
    } else if (sum < target) {
      // 让 sum 大一点
      left++;
    } else {
      // 让 sum 小一点
      right--;
    }
  }
  return [-1, -1];
};
```

:::

::: details [344. 反转字符串](https://leetcode.cn/problems/reverse-string/description/)
::: code-group

```js [左右指针]
/**
 * v1 双指针（左右指针）
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
let reverseString = function (s) {
  // 一左一右两个指针相向而行
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    // 交换 s[left] 和 s[right]
    [s[left], [s[right]]] = [s[right], s[left]];
    left++;
    right--;
  }
};
```

:::

::: details [125. 验证回文串](https://leetcode.cn/problems/valid-palindrome/description/)
::: code-group

```js [左右指针]
/**
 * @param {string} s
 * @return {boolean}
 */
const isPalindrome = function (s) {
  s = s.toLowerCase();
  s = s.replace(/[^a-z0-9]/g, "");
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) {
      return false;
    } else {
      left++;
      right--;
    }
  }
  return true;
};
```

:::

::: details ✨[5. 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/description/)
::: code-group

```js [左右指针]
/**
 * v1 双指针（左右指针）
 * @param {string} s
 * @return {string}
 */
let longestPalindrome = function (s) {
  let result = "";
  for (let i = 0; i < s.length; i++) {
    // 以 s[i] 为中心的最长回文子串
    let s1 = palindrome(s, i, i);
    // 以 s[i] 和 s[i+1] 为中心的最长回文子串
    let s2 = palindrome(s, i, i + 1);
    result = result.length > s1.length ? result : s1;
    result = result.length > s2.length ? result : s2;
  }
  return result;
};

// 返回字符串s中以left和right为中心的最长回文串
let palindrome = function (s, left, right) {
  while (left >= 0 && right < s.length && s[left] === s[right]) {
    left--;
    right++;
  }
  // 此时 s[l+1..r-1] 就是最长回文串
  return s.substring(left + 1, right);
};
```

:::

::: details [88. 合并两个有序数组](https://leetcode.cn/problems/merge-sorted-array/description/)
::: code-group

```js [从后向前的双指针]
/**
 * v1 双指针（从后往前的指针）
 * 合并两个有序数组
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
let merge = function (nums1, m, nums2, n) {
  let p1 = m - 1; // 指向num1的非0尾巴
  let p2 = m + n - 1; // 指向num1的尾
  let p = n - 1; // 指向num2的尾巴
  // 从后向前生成结果数组，类似合并两个有序链表的逻辑
  while (p >= 0 && p1 >= 0) {
    if (nums1[p1] >= nums2[p]) {
      nums1[p2] = nums1[p1];
      p1--;
    } else {
      nums1[p2] = nums2[p];
      p--;
    }
    p2--;
  }
  // 可能其中一个数组的指针走到尽头了，而另一个还没走完
  // 因为我们本身就是在往 nums1 中放元素，所以只需考虑 nums2 是否剩元素即可
  while (p >= 0) {
    nums1[p2] = nums2[p];
    p--;
    p2--;
  }
};
```

:::

::: details [977. 有序数组的平方](https://leetcode.cn/problems/squares-of-a-sorted-array/description/)
::: code-group

```js [左右指针]
/**
 * v2 双指针（左右指针）
 * 合并两个有序数组的变体
 * 时间复杂度O(n)
 * @param {number[]} nums
 * @return {number[]}
 */
let sortedSquares = function (nums) {
  let n = nums.length;
  let left = 0; // 指向 nums 头
  let right = n - 1; // 指向 nums 尾
  let result = new Array(n); // 存放结果
  let p = n - 1; // 指向结果数组末尾,得到的有序结果是降序的

  // 执行双指针合并有序数组的逻辑
  while (left <= right) {
    let leftSquare = nums[left] ** 2;
    let rightSquare = nums[right] ** 2;
    if (rightSquare > leftSquare) {
      result[p] = rightSquare;
      right--;
    } else {
      result[p] = leftSquare;
      left++;
    }
    p--;
  }
  return result;
};
```

:::

## 滑动窗口

::: details 滑动窗口应用场景和核心解题步骤
滑动窗口主要用于解决**数组（字符串）**中与**子数组**相关的问题。核心思路是通过维护一个动态或固定大小的窗口，通过移动左右边界来寻找满足条件的解。

**适用场景：**

1.  **求最值**：寻找满足特定条件的**最长**或**最短**子数组/子串（如：无重复字符的最长子串、最小覆盖子串）。
2.  **定长窗口**：在固定长度的窗口内寻找满足条件的子串（如：字符串的排列、所有字母异位词）。
3.  **计数/存在性**：统计满足条件的子数组个数，或判断是否存在满足条件的子数组。

**核心步骤：**

1.  **入窗**：移动右指针 `right`，将元素加入窗口，更新窗口内数据。
2.  **出窗**：当窗口满足特定条件（或不再满足条件）时，移动左指针 `left`，将元素移出窗口，尝试更新结果。

:::

::: details [76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/description/)
::: code-group

```js [滑动窗口]
/**
 * v1 滑动窗口
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
let minWindow = function (s, t) {
  let need = {}; // 记录字符串 t 中的元素
  let window = {}; // 记录窗口内的元素
  for (let c of t) {
    need[c] = (need[c] || 0) + 1;
  }

  // 左闭右开
  let left = 0;
  let right = 0;
  let valid = 0; // 记录 window 中满足 need 的元素个数

  // 记录最小覆盖子串的起始索引及长度
  let start = 0;
  let len = Infinity;

  while (right < s.length) {
    // c 是将移入窗口的字符
    let c = s[right];
    right++; // 扩大窗口
    // 进行窗口内数据的一系列更新
    if (need[c]) {
      window[c] = (window[c] || 0) + 1;
      if (window[c] === need[c]) valid++;
    }

    // 满足 need 时缩小窗口
    while (valid === Object.keys(need).length) {
      if (right - left < len) {
        start = left;
        len = right - left;
      }
      // d 是将要移除窗口的元素
      let d = s[left];
      left++; // 缩小窗口
      // 进行窗口内数据的一系列更新
      if (need[d]) {
        if (window[d] === need[d]) {
          valid--; // 因为有重复元素，所以valid的减少需要判断
        }
        window[d]--;
      }
    }
  }
  // 返回最小覆盖子串
  return len === Infinity ? "" : s.substring(start, start + len);
};
```

:::

::: details [567. 字符串的排列](https://leetcode.cn/problems/permutation-in-string/description/)
::: code-group

```js [滑动窗口]
/**
 * v1 滑动窗口
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
let checkInclusion = function (s1, s2) {
  let need = new Map(); // 记录需要的元素
  let window = new Map(); // 记录窗口中的元素
  for (let c of s1) {
    need.set(c, (need.get(c) || 0) + 1);
  }

  let left = 0;
  let right = 0;
  let valid = 0; // window中满足need的元素个数
  while (right < s2.length) {
    let c = s2[right];
    right++;
    if (need.has(c)) {
      window.set(c, (window.get(c) || 0) + 1);
      if (window.get(c) === need.get(c)) {
        valid++;
      }
    }
    // 判断左侧窗口是否要收缩
    while (right - left >= s1.length) {
      // 在这里判断是否找到了合法的子串
      if (valid === need.size) {
        return true;
      }
      let d = s2[left];
      left++;
      if (need.has(d)) {
        if (window.get(d) === need.get(d)) {
          valid--;
        }
        window.set(d, window.get(d) - 1);
      }
    }
  }
  return false;
};
```

:::

::: details [438. 找到字符串中所有字母异位词](https://leetcode.cn/problems/find-all-anagrams-in-a-string/description/)
::: code-group

```js [滑动窗口]
/**
 * v1 滑动窗口
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
let findAnagrams = function (s, p) {
  let need = new Map(); // 记录p中的所有元素
  let window = new Map(); // 记录窗口中的所有元素
  for (let c of p) {
    need.set(c, (need.get(c) || 0) + 1);
  }

  let left = 0;
  let right = 0;
  let valid = 0; // 记录 window 中满足 need 个元素个数
  let result = [];
  while (right < s.length) {
    // 扩大窗口逻辑
    let c = s[right];
    right++;
    if (need.has(c)) {
      window.set(c, (window.get(c) || 0) + 1);
      if (need.get(c) === window.get(c)) {
        valid++;
      }
    }
    // 缩小窗口逻辑
    while (right - left >= p.length) {
      if (valid === need.size) {
        result.push(left);
      }

      let d = s[left];
      left++;
      if (need.has(d)) {
        if (need.get(d) === window.get(d)) {
          valid--;
        }
        window.set(d, window.get(d) - 1);
      }
    }
  }

  return result;
};
```

:::

::: details [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/description/)
::: code-group

```js [滑动窗口]
/**
 * v1 滑动窗口
 * @param {string} s
 * @return {number}
 */
let lengthOfLongestSubstring = function (s) {
  let window = new Map(); // 记录窗口内的元素

  let left = 0;
  let right = 0;
  let maxLen = 0;
  while (right < s.length) {
    // 扩大窗口
    let c = s[right];
    right++;
    window.set(c, (window.get(c) || 0) + 1);
    // 判断左侧窗口是否要收缩
    while (window.get(c) > 1) {
      let d = s[left];
      left++;
      window.set(d, window.get(d) - 1);
    }
    // 缩小窗口结束代表此时窗口内的就是无重复子串
    maxLen = Math.max(maxLen, right - left);
  }

  return maxLen;
};
```

:::

::: details [1658. 将 x 减到 0 的最小操作数](https://leetcode.cn/problems/minimum-operations-to-reduce-x-to-zero/description/)
::: code-group

```js [滑动窗口]
/**
 * v1 滑动窗口
 * @param {number[]} nums
 * @param {number} x
 * @return {number}
 */
let minOperations = function (nums, x) {
  let sum = nums.reduce((a, b) => a + b, 0);
  // 等价于寻找 nums 中元素和为 target 的最长子数组。
  let target = sum - x;
  if (target < 0) return -1; // 由于nums数组都为正数，因此 target 不可能小于等于0
  let window = 0; // 记录窗口内所有元素和
  let result = Infinity;

  let left = 0;
  let right = 0;
  while (right < nums.length) {
    window += nums[right];
    right++;

    // 缩小窗口
    while (window > target) {
      window -= nums[left];
      left++;
    }

    // 寻找目标子数组
    if (window === target) {
      result = Math.min(result, nums.length - (right - left));
    }
  }

  return result === Infinity ? -1 : result;
};
```

:::
::: details [713. 乘积小于 K 的子数组](https://leetcode.cn/problems/subarray-product-less-than-k/description/)
::: code-group

```js [滑动窗口]
/**
 * v1 滑动窗口
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
let numSubarrayProductLessThanK = function (nums, k) {
  let result = 0;
  let left = 0;
  let right = 0;
  let window = 1;

  while (right < nums.length) {
    window *= nums[right];
    right++;

    while (window >= k && left < right) {
      window /= nums[left];
      left++;
    }
    // 现在必然是一个合法的窗口，但注意思考这个窗口中的子数组个数怎么计算：
    // 比方说 left = 1, right = 4 划定了 [1, 2, 3] 这个窗口（right 是开区间）
    // 但不止 [left..right-1] 是合法的子数组，[left+1..right-1], [left+2..right-1] 等都是合法子数组
    // 所以我们需要把 [3], [2,3], [1,2,3] 这 right - left 个子数组都加上
    result += right - left;
  }

  return result;
};
```

:::

::: details [1004. 最大连续 1 的个数 III](https://leetcode.cn/problems/max-consecutive-ones-iii/description/)
::: code-group

```js [滑动窗口]
/**
 * v1 滑动窗口
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
let longestOnes = function (nums, k) {
  // 等价于求满足 最多k个0其他都是1的子数组的最大长度
  let window = 0; // 记录 window中0的个数
  let left = 0;
  let right = 0;
  let result = 0;
  while (right < nums.length) {
    let c = nums[right];
    right++;
    if (c === 0) {
      window++;
    }
    // 缩小窗口：窗口中的0的数量大于k
    while (window > k) {
      let d = nums[left];
      left++;
      if (d === 0) {
        window--;
      }
    }
    result = Math.max(result, right - left);
  }
  return result;
};
```

:::

::: details [424. 替换后的最长重复字符](https://leetcode.cn/problems/longest-repeating-character-replacement/description/)
::: code-group

```js [滑动窗口]
/**
 * v1 滑动窗口
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
let characterReplacement = function (s, k) {
  let result = 0; // 记录最长子字符串的长度
  let window = new Array(26).fill(0); // 记录窗口内字母出现的个数
  // 记录窗口中字符的最多重复次数
  // 记录这个值的意义在于，最划算的替换方法肯定是把其他字符替换成出现次数最多的那个字符
  let maxCount = 0;

  let left = 0;
  let right = 0;
  while (right < s.length) {
    // 扩大窗口
    let c = s.charCodeAt(right) - "A".charCodeAt(0);
    right++;
    window[c]++;
    maxCount = Math.max(maxCount, window[c]); // 更新最大字母出现数量

    while (right - left - maxCount > k) {
      // 杂牌字符数量 right - left - windowMaxCount 多于 k
      // 此时，k 次替换已经无法把窗口内的字符都替换成相同字符了
      // 必须缩小窗口
      let d = s.charCodeAt(left) - "A".charCodeAt(0);
      left++;
      window[d]--;
    }
    result = Math.max(result, right - left);
  }
  return result;
};
```

:::
::: details [219. 存在重复元素 II](https://leetcode.cn/problems/contains-duplicate-ii/description/)
::: code-group

```js [滑动窗口]
/**
 * v1 滑动窗口
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
let containsNearbyDuplicate = function (nums, k) {
  let window = new Set(); // 记录窗口内的元素
  let left = 0;
  let right = 0;
  while (right < nums.length) {
    let c = nums[right];
    right++;
    // 扩大窗口
    if (window.has(c)) {
      return true;
    }
    window.add(c);
    // 缩小窗口
    while (right - left > k) {
      let d = nums[left];
      left++;
      window.delete(d);
    }
  }
  return false;
};
```

:::
::: details ✨[220. 存在重复元素 III](https://leetcode.cn/problems/contains-duplicate-iii/description/)
::: code-group

```js [滑动窗口 + 桶排序]
/**
 * v1 滑动窗口 + 桶排序
 * @param {number[]} nums
 * @param {number} indexDiff
 * @param {number} valueDiff
 * @return {boolean}
 */
let containsNearbyAlmostDuplicate = function (nums, indexDiff, valueDiff) {
  // 找出长度小于等于 indexDiff + 1，且存在两个不同元素之差小于等于 valueDiff 的子数组
  let window = new Map();
  let bucketSize = valueDiff + 1;

  let left = 0;
  let right = 0;
  while (right < nums.length) {
    let num = nums[right];
    let bucketId = Math.floor(num / bucketSize);

    if (window.has(bucketId)) {
      return true;
    }
    if (
      window.has(bucketId - 1) &&
      Math.abs(num - window.get(bucketId - 1)) <= valueDiff
    ) {
      return true;
    }
    if (
      window.has(bucketId + 1) &&
      Math.abs(num - window.get(bucketId + 1)) <= valueDiff
    ) {
      return true;
    }

    window.set(bucketId, num);
    right++;

    // 当窗口大小大于 indexDiff 时，缩小窗口，减少窗口元素
    // 由于窗口缩小结束后，就要进行是否符合条件的判断，因此需要提前一步进行缩小
    while (right - left > indexDiff) {
      window.delete(Math.floor(nums[left] / bucketSize));
      left++;
    }
  }
  return false;
};
```

:::

::: details [209. 长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/description/)
::: code-group

```js [滑动窗口]
/**
 * v1 滑动窗口
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */
let minSubArrayLen = function (target, nums) {
  let windowSum = 0;
  let left = 0;
  let right = 0;
  let result = Infinity;
  while (right < nums.length) {
    // 总和小于 target 的时候扩大窗口
    windowSum += nums[right];
    right++;
    // 总和大于等于target的时候缩小窗口
    while (windowSum >= target && left < right) {
      result = Math.min(result, right - left);
      windowSum -= nums[left];
      left++;
    }
  }

  return result === Infinity ? 0 : result;
};
```

:::

::: details ✨[395. 至少有 K 个重复字符的最长子串](https://leetcode.cn/problems/longest-substring-with-at-least-k-repeating-characters/description/)
::: code-group

```js [滑动窗口]
/**
 * v1 滑动窗口
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
let longestSubstring = function (s, k) {
  let result = 0;
  for (let i = 1; i <= 26; i++) {
    if (i * k > s.length) break;
    result = Math.max(result, longestKSubstring(s, k, i));
  }
  return result;
};

// 通过添加限制条件来使用滑动窗口
// 寻找字符串s中出现count种不同字符，且每种字符个数都不少于 k，返回字符串的长度
function longestKSubstring(s, k, count) {
  let window = new Map();
  let left = 0;
  let right = 0;
  let result = 0;
  while (right < s.length) {
    let c = s[right];
    right++;
    window.set(c, (window.get(c) || 0) + 1);

    // 当窗口中出现的字符种类大于等于 count 时缩小窗口
    while (window.size > count) {
      let d = s[left];
      window.set(d, window.get(d) - 1);
      if (window.get(d) === 0) {
        window.delete(d);
      }
      left++;
    }
    // 判断子集是否符合
    if (window.values().every((item) => item >= k)) {
      result = Math.max(result, right - left);
    }
  }
  return result;
}
```

:::

::: details [1456. 定长子串中元音的最大数目](https://leetcode.cn/problems/maximum-number-of-vowels-in-a-substring-of-given-length/description/)
::: code-group

```js [滑动窗口]
/**
 * S1 滑动窗口（定长）
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
const maxVowels = function (s, k) {
  const vowels = ["a", "e", "i", "o", "u"];
  let window = 0; // 统计窗口中元音字母的数量
  let left = 0;
  let right = 0; // [left, right)表示当前窗口
  let ans = 0;
  while (right < s.length) {
    const rightVal = s[right];
    right++;
    if (vowels.includes(rightVal)) {
      window++;
    }
    // 因为right是开区间，所有right - left为字符串长度
    while (right - left > k) {
      const leftValue = s[left];
      left++;
      if (vowels.includes(leftValue)) {
        window--;
      }
    }

    // 此时窗口内字符串长度为k
    ans = Math.max(ans, window);
  }

  return ans;
};
```

:::

## 二分搜索

::: details 二分搜索的适用场景
什么问题可以运用二分搜索算法技巧？

首先，你要从题目中抽象出一个自变量 `x`，一个关于 `x` 的函数 `f(x)`，以及一个目标值 `target`。

同时，`x`, `f(x)`, `target` 还要满足以下条件：

1、`f(x)` 必须是在 `x` 上的单调函数（单调增单调减都可以）。

2、题目是让你计算满足约束条件 `f(x) == target` 时的 `x` 的值。
:::

### 二分查找的三种表现形式

::: details 有序数组的二分查找
::: code-group

```js [搜索目标值]
const search = function (nums, target) {
  // 标准的二分搜索框架，搜索目标元素的索引，若不存在则返回 -1
  let left = 0;
  // 注意
  let right = nums.length - 1;

  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      // 注意
      left = mid + 1;
    } else if (nums[mid] > target) {
      // 注意
      right = mid - 1;
    }
  }
  return -1;
};
```

```js [搜索左侧边界]
const left_bound = function (nums, target) {
  let left = 0;
  let right = nums.length - 1;
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

  // 判断一下 nums[left] 是不是 target
  return nums[left] == target ? left : -1;
};
```

```js [搜索右侧边界]
const right_bound = function (nums, target) {
  let left = 0;
  let right = nums.length - 1;
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

  return nums[right] == target ? right : -1;
};
```

:::

### 二分查找的实际运用

::: details [875. 爱吃香蕉的珂珂](https://leetcode.cn/problems/koko-eating-bananas/description/)
::: code-group

```js [二分查找]
/**
 * v1 二分查找
 * @param {number[]} piles
 * @param {number} h
 * @return {number}
 */
let minEatingSpeed = function (piles, h) {
  // 二分查找的思考：求单调函数f(x) === target的x取值边界
  // x : 吃掉香蕉的速度 k
  // f(x) : 吃完全部香蕉需要的时间与速度的关系函数，单调递减
  // target : h
  // 求最小的k所以是求左侧边界
  // x的取值范围：1-Max(pile[i])或者根据提示取 10**9

  // 使用左闭右开的搜索区间
  let left = 1;
  let right = 10 ** 9 + 1;

  while (left < right) {
    let mid = left + Math.floor((right - left) / 2); // 速度
    let time = piles.reduce((acc, pile) => acc + Math.ceil(pile / mid), 0); // 吃完全部香蕉需要的时间

    // 注意f(x)是单调递减
    if (time === h) {
      right = mid;
    } else if (time < h) {
      right = mid;
    } else if (time > h) {
      left = mid + 1;
    }
  }

  return left;
};
```

:::

::: details [1011. 在 D 天内送达包裹的能力](https://leetcode.cn/problems/capacity-to-ship-packages-within-d-days/description/)
::: code-group

```js [二分查找]
/**
 * @param {number[]} weights
 * @param {number} days
 * @return {number}
 */
let shipWithinDays = function (weights, days) {
  // 分析：
  // x: 运载能力
  // f(x): 运载能力x和需要的天数之间的关系，单调递减
  // target: days
  // x的取值范围：max(weights[i])-sum(weights[i])
  // 左侧还是右侧的二分查找：求最小x所以是左侧边界

  let left = Math.max(...weights);
  let right = weights.reduce((acc, weight) => acc + weight, 0) + 1; // 注意，right 是开区间，所以额外加一
  while (left < right) {
    let mid = left + Math.floor((right - left) / 2);
    let day = f(mid, weights);

    if (day <= days) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
};
// 范围当运载能力为 x 时送达所有包裹需要的天数
function f(x, weights) {
  let day = 1; // 总共需要的天数
  let currentLoad = 0; // 当前船上已经有的重量
  for (let weight of weights) {
    if (currentLoad + weight > x) {
      day++;
      currentLoad = weight;
    } else {
      currentLoad += weight;
    }
  }
  return day;
}
```

:::

::: details [410. 分割数组的最大值](https://leetcode.cn/problems/split-array-largest-sum/description/)
::: code-group

```js [二分查找]
/**
 * v1 二分查找
 * 代码同：1011 题「在 D 天内送达包裹的能力」
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
let splitArray = function (nums, k) {
  // 二分查找思考：
  // x : 分割后的数组和的最大值
  // x范围 : max(nums[i])-sum(nums[i])
  // f(x) : 随着最大值变化的子数组的个数，单调递减
  // target: k个非空子数组
  // 左右边界：求最小的和的最大值，因此是左边界

  let left = Math.max(...nums);
  let right = nums.reduce((acc, item) => acc + item, 0) + 1; // 左闭右开

  while (left < right) {
    let mid = left + Math.floor((right - left) / 2);
    let curK = f(nums, mid);

    if (curK <= k) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
};
// 输入分割后的数组和的最大值，得到分割后的数组个数
let f = function (nums, x) {
  let k = 1;
  let sum = 0;
  for (let item of nums) {
    if (item + sum > x) {
      k++;
      sum = item;
    } else {
      sum += item;
    }
  }
  return k;
};
```

:::

## 前缀和

::: details 前缀和代码模板

```js
const NumArray = function (nums) {
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

::: details [303. 区域和检索 - 数组不可变](https://leetcode.cn/problems/range-sum-query-immutable/description/)
::: code-group

```js [一维数组前缀和技巧]
/**
 * v1 一维数组前缀和技巧
 * @param {number[]} nums
 */
class NumArray {
  constructor(nums) {
    let preNum = new Array(nums.length + 1).fill(0);
    // 前缀和数组，利用preNum[i]来记录num[0,...i - 1]的累加和,从而降低时间复杂度到 O(1)
    for (let i = 1; i < preNum.length; i++) {
      preNum[i] = preNum[i - 1] + nums[i - 1];
    }
    this.preNum = preNum;
  }

  /**
   * 求区间[left,...,right]的数组和
   * @param {number} left
   * @param {number} right
   * @return {number}
   */
  sumRange(left, right) {
    if (left < 0 || right >= this.preNum.length - 1 || left > right) {
      return 0;
    }
    return this.preNum[right + 1] - this.preNum[left];
  }
}
```

:::

::: details [304. 二维区域和检索 - 矩阵不可变](https://leetcode.cn/problems/range-sum-query-2d-immutable/description/)
::: code-group

```js [二维数组的前缀和技巧]
/**
 * v1 二维数组的前缀和技巧
 * @param {number[][]} matrix
 */
class NumMatrix {
  constructor(matrix) {
    let m = matrix.length;
    let n = matrix[0].length;
    // 前缀和二维数组 preNum[i][j] 记录矩阵 [0, 0, i-1, j-1] 的元素和
    let preNum = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        // !如何计算面积
        preNum[i][j] =
          preNum[i - 1][j] +
          preNum[i][j - 1] +
          matrix[i - 1][j - 1] -
          preNum[i - 1][j - 1];
      }
    }
    this.preNum = preNum;
  }

  /**
   * 返回子矩形范围内元素的总和
   * 该子矩阵的 左上角 为 (row1, col1) ，右下角 为 (row2, col2)
   * @param {number} row1
   * @param {number} col1
   * @param {number} row2
   * @param {number} col2
   * @return {number}
   */
  sumRegion(row1, col1, row2, col2) {
    return (
      // !如何计算面积
      this.preNum[row2 + 1][col2 + 1] -
      this.preNum[row1][col2 + 1] -
      this.preNum[row2 + 1][col1] +
      this.preNum[row1][col1]
    );
  }
}
```

:::

::: details [724. 寻找数组的中心下标](https://leetcode.cn/problems/find-pivot-index/description/)
::: code-group

```js [前缀和]
const pivotIndex = function (nums) {
  let n = nums.length;
  let preSum = new Array(n + 1).fill(0);
  // 计算 nums 的前缀和
  for (let i = 1; i <= n; i++) {
    preSum[i] = preSum[i - 1] + nums[i - 1];
  }
  // 根据前缀和判断左半边数组和右半边数组的元素和是否相同
  for (let i = 1; i < preSum.length; i++) {
    // 计算 nums[i-1] 左侧和右侧的元素和
    let leftSum = preSum[i - 1] - preSum[0];
    let rightSum = preSum[n] - preSum[i];
    if (leftSum == rightSum) {
      // 相对 nums 数组，preSum 数组有一位索引偏移
      return i - 1;
    }
  }
  return -1;
};
```

:::
::: details [238. 除自身以外数组的乘积](https://leetcode.cn/problems/product-of-array-except-self/description/)
::: code-group

```js [前缀积+后缀积]
const productExceptSelf = function (nums) {
  let n = nums.length;
  // 从左到右的前缀积，prefix[i] 是 nums[0..i] 的元素积
  let prefix = new Array(n);
  prefix[0] = nums[0];
  for (let i = 1; i < nums.length; i++) {
    prefix[i] = prefix[i - 1] * nums[i];
  }
  // 从右到左的前缀积，suffix[i] 是 nums[i..n-1] 的元素积
  let suffix = new Array(n);
  suffix[n - 1] = nums[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    suffix[i] = suffix[i + 1] * nums[i];
  }
  // 结果数组
  let res = new Array(n);
  res[0] = suffix[1];
  res[n - 1] = prefix[n - 2];
  for (let i = 1; i < n - 1; i++) {
    // 除了 nums[i] 自己的元素积就是 nums[i] 左侧和右侧所有元素之积
    res[i] = prefix[i - 1] * suffix[i + 1];
  }
  return res;
};
```

:::

::: details [1352. 最后 K 个数的乘积](https://leetcode.cn/problems/product-of-the-last-k-numbers/description/)
::: code-group

```js []

```

:::

::: details [525. 连续数组](https://leetcode.cn/problems/contiguous-array/description/)
::: code-group

```js [前缀和 + 哈希表]
/**
 * v1 前缀和 + 哈希表
 * @param {number[]} nums
 * @return {number}
 */
let findMaxLength = function (nums) {
  let maxLength = 0;

  let preNum = new Array(nums.length + 1).fill(0);
  // 计算 nums 的前缀和
  for (let i = 1; i < preNum.length; i++) {
    preNum[i] = preNum[i - 1] + (nums[i - 1] === 0 ? -1 : 1); // 将问题转化为和为 0 的最长连续子数组
  }
  // 前缀和到索引的映射，方便快速查找所需的前缀和
  let valueToIndex = new Map();
  for (let i = 0; i < preNum.length; i++) {
    // 如果这个前缀和还没有对应的索引，说明这个前缀和第一次出现，记录下来
    if (!valueToIndex.has(preNum[i])) {
      valueToIndex.set(preNum[i], i);
    } else {
      // 这个前缀和已经出现过了，说明找到了一个和为 0 的子数组
      maxLength = Math.max(maxLength, i - valueToIndex.get(preNum[i]));
    }
  }
  return maxLength;
};
```

:::

::: details [523. 连续的子数组和](https://leetcode.cn/problems/continuous-subarray-sum/description/)
::: code-group

```js [前缀和 + 哈希表]
const checkSubarraySum = function (nums, k) {
  let n = nums.length;
  // 计算 nums 的前缀和
  let preSum = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    preSum[i] = preSum[i - 1] + nums[i - 1];
  }
  // 前缀和与 k 的余数到索引的映射，方便快速查找所需的前缀和
  let valToIndex = new Map();
  for (let i = 0; i < preSum.length; i++) {
    // 在哈希表中记录余数
    let val = preSum[i] % k;
    // 如果这个余数还没有对应的索引，则记录下来
    if (!valToIndex.has(val)) {
      valToIndex.set(val, i);
    }
    // 如果这个前缀和已经有对应的索引了，则什么都不做
    // 因为题目想找长度最大的子数组，所以前缀和索引应尽可能小
  }
  for (let i = 1; i < preSum.length; i++) {
    // 计算 need，使得 (preSum[i] - need) % k == 0
    let need = preSum[i] % k;
    if (valToIndex.has(need)) {
      if (i - valToIndex.get(need) >= 2) {
        // 这个子数组的长度至少为 2
        return true;
      }
    }
  }
  return false;
};
```

:::

::: details [560. 和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/description/)
::: code-group

```js [前缀和 + 哈希表]
/**
 * v1 前缀和 + 哈希表
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
let subarraySum = function (nums, k) {
  let result = 0;
  let preSum = new Array(nums.length + 1).fill(0);
  // 前缀和 到 该前缀和个数 的映射
  let valueToCount = new Map();
  valueToCount.set(0, 1);
  for (let i = 1; i < preSum.length; i++) {
    preSum[i] = preSum[i - 1] + nums[i - 1]; // 计算前缀和
    // 如果之前存在值为 need 的前缀和
    // 说明存在以 nums[i-1] 结尾的子数组的和为 k
    let need = preSum[i] - k;
    if (valueToCount.has(need)) {
      result += valueToCount.get(need);
    }
    if (!valueToCount.has(preSum[i])) {
      // 没有该前缀和
      valueToCount.set(preSum[i], 1);
    } else {
      // 有该前缀和
      valueToCount.set(preSum[i], valueToCount.get(preSum[i]) + 1);
    }
  }

  return result;
};
```

:::

::: details [1124. 表现良好的最长时间段](https://leetcode.cn/problems/longest-well-performing-interval/description/)
::: code-group

```js [前缀和 + 哈希表]
const longestWPI = function (hours) {
  let n = hours.length;
  let preSum = new Array(n + 1).fill(0);
  // 前缀和到索引的映射，方便快速查找所需的前缀和
  let valToIndex = new Map();
  let res = 0;
  for (let i = 1; i <= n; i++) {
    // 计算 nums[0..i-1] 的前缀和
    preSum[i] = preSum[i - 1] + (hours[i - 1] > 8 ? 1 : -1);
    // 如果这个前缀和还没有对应的索引，说明这个前缀和第一次出现，记录下来
    if (!valToIndex.has(preSum[i])) {
      valToIndex.set(preSum[i], i);
    } else {
      // 因为题目想找长度最大的子数组，valToIndex 中的索引应尽可能小，
      // 所以这里什么都不做
    }

    // 现在我们想找 hours[0..i-1] 中元素和大于 0 的子数组
    // 这就要根据 preSum[i] 的正负分情况讨论了
    if (preSum[i] > 0) {
      // preSum[i] 为正，说明 hours[0..i-1] 都是「表现良好的时间段」
      res = Math.max(res, i);
    } else {
      // preSum[i] 为负，需要寻找一个 j 使得 preSum[i] - preSum[j] > 0
      // 考虑到我们的 preSum 数组每两个相邻元素的差的绝对值都是 1 且 j 应该尽可能小，
      // 那么只要找到 preSum[j] == preSum[i] - 1，nums[j+1..i] 就是一个「表现良好的时间段」
      if (valToIndex.has(preSum[i] - 1)) {
        let j = valToIndex.get(preSum[i] - 1);
        res = Math.max(res, i - j);
      }
    }
  }
  return res;
};
```

:::

## 差分数组

## 二维数组

::: details [1329. 将矩阵按对角线排序](https://leetcode.cn/problems/sort-the-matrix-diagonally/description/)
::: code-group

```js [利用横纵坐标收集对角线元素]
/**
 * v1 判断两个元素坐标是否在同一个对角线
 * 在同一个对角线上的元素，其横纵坐标之差是相同的
 * @param {number[][]} mat
 * @return {number[][]}
 */
let diagonalSort = function (mat) {
  let m = mat.length;
  let n = mat[0].length;
  let map = new Map(); // 存放所有的对角线元素
  // 遍历矩阵
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // 横纵坐标之差可以作为一条对角线的 ID
      let id = i - j;
      if (!map.has(id)) {
        map.set(id, []);
      }
      map.get(id).push(mat[i][j]);
    }
  }

  // 给每条对角线元素排序
  for (let diagonal of map.values()) {
    diagonal.sort((a, b) => b - a); // 降序排序，方便后续填充
  }

  // 填充矩阵
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let id = i - j;
      mat[i][j] = map.get(id).pop();
    }
  }

  return mat;
};
```

:::

::: details [1260. 二维网格迁移](https://leetcode.cn/problems/shift-2d-grid/description/)
::: code-group

```js [转换为一维数组]
/**
 * v1 暴力法
 * @param {number[][]} grid
 * @param {number} k
 * @return {number[][]}
 */
let shiftGrid = function (grid, k) {
  let nums = [];
  let m = grid.length;
  let n = grid[0].length;
  // 计算迁移的步数
  k = k % (m * n);
  if (k === 0) return grid;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      nums.push(grid[i][j]);
    }
  }
  // 数组旋转 k 个单位
  while (k > 0) {
    nums.unshift(nums.pop());
    k--;
  }
  // 填充 grid
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      grid[i][j] = nums[i * n + j];
    }
  }

  return grid;
};
```

```js [抽象为一维数组并进行翻转操作]
/**
 * v1 反转数组
 * @param {number[][]} grid
 * @param {number} k
 * @return {number[][]}
 */
let shiftGrid = function (grid, k) {
  // 把二维 grid 抽象成一维数组
  let m = grid.length;
  let n = grid[0].length;
  let mn = m * n;
  k = k % mn;
  if (k === 0) return grid;
  // 先把最后 k 个数翻转
  reverse(grid, mn - k, mn - 1);
  // 然后把前 mn - k 个数翻转
  reverse(grid, 0, mn - k - 1);
  // 最后把整体翻转
  reverse(grid, 0, mn - 1);

  return grid;
};

// 通过一维数组的索引访问二维数组的元素
let get = function (grid, index) {
  let n = grid[0].length;
  let i = Math.floor(index / n);
  let j = index % n;
  return grid[i][j];
};

// 通过一维数组的索引修改二维数组的元素
let set = function (grid, index, val) {
  let n = grid[0].length;
  let i = Math.floor(index / n);
  let j = index % n;
  grid[i][j] = val;
};

// 翻转一维数组的索引区间元素
let reverse = function (grid, i, j) {
  while (i < j) {
    let temp = get(grid, i);
    set(grid, i, get(grid, j));
    set(grid, j, temp);
    i++;
    j--;
  }
};
```

:::

::: details [867. 转置矩阵](https://leetcode.cn/problems/transpose-matrix/description/)
::: code-group

```js [交换行列坐标]
/**
 * v1 直观解法
 * @param {number[][]} matrix
 * @return {number[][]}
 */
let transpose = function (matrix) {
  let m = matrix.length;
  let n = matrix[0].length;
  // 转置矩阵的长和宽颠倒
  let result = Array.from({ length: n }, () => new Array(m));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      result[j][i] = matrix[i][j];
    }
  }
  return result;
};
```

:::

::: details [14. 最长公共前缀](https://leetcode.cn/problems/longest-common-prefix/description/)
::: code-group

```js [利用startWith API]
/**
 * v2 利用startWith API
 * @param {string[]} strs
 * @return {string}
 */
let longestCommonPrefix = function (strs) {
  let prefix = strs[0]; // 假设最长前缀为第一个字符串
  for (let i = 0; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) {
      prefix = prefix.substring(0, prefix.length - 1); // 缩短前缀
      if (prefix === "") {
        return "";
      }
    }
  }
  return prefix;
};
```

```js [遍历二维数组判断列是否相同]
/**
 * v1 遍历二维数组，判断列是否相同
 * @param {string[]} strs
 * @return {string}
 */
let longestCommonPrefix = function (strs) {
  let m = strs.length;
  // 以第一行的列数为基准
  let n = strs[0].length;

  for (let col = 0; col < n; col++) {
    for (let row = 1; row < m; row++) {
      let thisStr = strs[row];
      let preStr = strs[row - 1];
      // 判断每个字符串的 col 索引是否都相同
      if (
        col >= thisStr.length ||
        col >= preStr.length ||
        thisStr[col] !== preStr[col]
      ) {
        // 发现不匹配的字符，只有 strs[row][0..col-1] 是公共前缀
        return thisStr.substring(0, col);
      }
    }
  }
  // 返回第一个字符串
  return strs[0];
};
```

:::

::: details [48. 旋转图像](https://leetcode.cn/problems/rotate-image/description/)
::: code-group

```js [对角线对称 + 数组反转]
/**
 * v1 二维数组操作（对角线对称 + 数组反转）
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
let rotate = function (matrix) {
  let n = matrix.length;
  // 先沿对角线镜像对称二维矩阵
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  // 然后反转二维矩阵的每一行
  matrix.forEach((row) => reverse(row));
};

// 反转一维数组
let reverse = function (nums) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    [nums[left], nums[right]] = [nums[right], nums[left]];
    left++;
    right--;
  }
};
```

:::

::: details [54. 螺旋矩阵](https://leetcode.cn/problems/spiral-matrix/description/)
::: code-group

```js [四个变量圈定未遍历元素的边界]
/**
 * v1 四个变量圈定未遍历元素的边界
 * @param {number[][]} matrix
 * @return {number[]}
 */
let spiralOrder = function (matrix) {
  let m = matrix.length;
  let n = matrix[0].length;
  let upBound = 0;
  let downBound = m - 1;
  let leftBound = 0;
  let rightBound = n - 1;
  let result = [];
  // result.length === m * n 表示遍历完了整个数组
  while (result.length < m * n) {
    if (upBound <= downBound) {
      // 在顶部从左向右遍历
      for (let i = leftBound; i <= rightBound; i++) {
        result.push(matrix[upBound][i]);
      }
      // 上边界下移
      upBound++;
    }
    // 在右边从上往下遍历
    if (leftBound <= rightBound) {
      for (let i = upBound; i <= downBound; i++) {
        result.push(matrix[i][rightBound]);
      }
      // 右边界左移
      rightBound--;
    }
    // 在底部从右往左遍历
    if (upBound <= downBound) {
      for (let i = rightBound; i >= leftBound; i--) {
        result.push(matrix[downBound][i]);
      }
      downBound--;
    }
    // 在左边从下往上遍历
    if (leftBound <= rightBound) {
      for (let i = downBound; i >= upBound; i--) {
        result.push(matrix[i][leftBound]);
      }
      // 左边界右移
      leftBound++;
    }
  }

  return result;
};
```

:::

::: details [59. 螺旋矩阵 II](https://leetcode.cn/problems/spiral-matrix-ii/description/)
::: code-group

```js [四个变量圈定元素的边界]
/**
 * v1 使用四个变量圈定元素的边界
 * @param {number} n
 * @return {number[][]}
 */
let generateMatrix = function (n) {
  let matrix = Array.from({ length: n }, () => new Array(n));
  let upperBound = 0;
  let lowerBound = n - 1;
  let leftBound = 0;
  let rightBound = n - 1;
  let index = 1;
  while (index <= n * n) {
    // 上边界从左到右遍历
    if (upperBound <= lowerBound) {
      for (let i = leftBound; i <= rightBound; i++) {
        matrix[upperBound][i] = index++;
      }
      upperBound++;
    }
    // 右边界从上到下遍历
    if (leftBound <= rightBound) {
      for (let i = upperBound; i <= lowerBound; i++) {
        matrix[i][rightBound] = index++;
      }
      rightBound--;
    }

    // 下边界从右到左遍历
    if (upperBound <= lowerBound) {
      for (let i = rightBound; i >= leftBound; i--) {
        matrix[lowerBound][i] = index++;
      }
      lowerBound--;
    }
    // 左边界从下到上遍历
    if (leftBound <= rightBound) {
      for (let i = lowerBound; i >= upperBound; i--) {
        matrix[i][leftBound] = index++;
      }
      leftBound++;
    }
  }
  return matrix;
};
```

:::

# 树

## 二叉树

解决二叉树问题的两种思维方式：

1. 遍历的思维：能否通过一次遍历（DFS、BFS）配合外部遍历解决问题
2. 分解问题的思维：

### 普通二叉树

::: details [111. 二叉树的最小深度](https://leetcode.cn/problems/minimum-depth-of-binary-tree/description/)
::: code-group

```js [BFS]
/**
 * S1 BFS
 * @param {TreeNode} root
 * @return {number}
 */
const minDepth = function (root) {
  if (root === null) return 0;

  let minDepth = 1;
  const queue = [root];
  while (queue.length > 0) {
    const sz = queue.length;
    for (let i = 0; i < sz; i++) {
      const cur = queue.shift();
      // 判断是否到达叶子结点
      if (cur.left === null && cur.right === null) return minDepth;
      // 加入下一层节点
      if (cur.left !== null) queue.push(cur.left);
      if (cur.right !== null) queue.push(cur.right);
    }
    minDepth++;
  }
  return minDepth;
};
```

```js [DFS]
/**
 * S2 DFS
 * @param {TreeNode} root
 * @return {number}
 */
const minDepth = function (root) {
  if (root === null) return 0;
  let minDepth = Infinity;

  function traverse(root, depth) {
    if (root === null) return;
    // 到达叶子节点之后更新最大深度
    if (root.left === null && root.right === null) {
      minDepth = Math.min(minDepth, depth);
    }
    traverse(root.left, depth + 1);
    traverse(root.right, depth + 1);
  }

  traverse(root, 1);
  return minDepth;
};
```

```js [分解问题思想]
/**
 * S3 分解问题思想
 * @param {TreeNode} root
 * @return {number}
 */
const minDepth = function (root) {
  // 空节点
  if (root === null) return 0;
  // 叶子节点
  if (root.left === null && root.right === null) return 1;
  let leftDep = Infinity; // 初始化为正无穷
  let rightDep = Infinity;
  if (root.left !== null) leftDep = minDepth(root.left);
  if (root.right !== null) rightDep = minDepth(root.right);
  return 1 + Math.min(leftDep, rightDep);
};
```

:::

### 二叉搜索树

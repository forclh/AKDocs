# 链表

## 双指针

::: details [83. 删除排序链表中的重复元素](https://leetcode.cn/problems/remove-duplicates-from-sorted-list/description/)
::: code-group

```js [快慢指针]
/**
 * v1 双指针（快慢指针）
 * @param {ListNode} head
 * @return {ListNode}
 */
let deleteDuplicates = function (head) {
  if (head === null) return null;
  let slow = head;
  let fast = head;
  while (fast !== null) {
    if (fast.val !== slow.val) {
      slow.next = fast;
      slow = slow.next;
    }
    fast = fast.next;
  }
  // 断开与后面重复元素的连接
  slow.next = null;
  return head;
};
```

:::

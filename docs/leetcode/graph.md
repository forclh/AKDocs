# 图论

## 图的性质

::: details [997. 找到小镇的法官](https://leetcode.cn/problems/find-the-town-judge/description)
::: code-group

```js [节点的入度和出度]
/**
 * v1 图论：利用节点的入度和出度
 * @param {number} n
 * @param {number[][]} trust
 * @return {number}
 */
const findJudge = function (n, trust) {
  const inDegree = new Array(n + 1).fill(0);
  const outDegree = new Array(n + 1).fill(0);
  for (let i = 0; i < trust.length; i++) {
    const [from, to] = trust[i];
    inDegree[to]++; // 入度
    outDegree[from]++; // 出度
  }

  for (let i = 1; i <= n; i++) {
    // 法官的入度为 n - 1，出度为0
    if (inDegree[i] === n - 1 && outDegree[i] === 0) {
      return i;
    }
  }
  return -1;
};
```

:::

::: details [1557. 可以到达所有点的最少点数目](https://leetcode.cn/problems/minimum-number-of-vertices-to-reach-all-nodes/description)
::: code-group

```js [节点的入度和出度]
/**
 * v1 图论（出入度）
 *
 * 算法思想：所有入度为 0 的节点必须作为起点；其余节点因为入度 > 0，
 * 至少有一个前驱可达，因此不必作为起点。选取全部入度为 0 的节点即可到达所有点，且集合最小。
 * @param {number} n
 * @param {number[][]} edges
 * @return {number[]}
 */
const findSmallestSetOfVertices = function (n, edges) {
  const inDegree = new Array(n).fill(0); // inDegree[i] 表示编号 i 的节点的入度
  for (const [from, to] of edges) {
    // 统计每个节点的入度（from 未使用，只需累加 to 的入度）
    inDegree[to]++;
  }
  const ans = []; // 收集所有入度为 0 的节点作为最少起点集合
  for (let i = 0; i < n; i++) {
    // 遍历所有节点，挑选入度为 0 的
    if (inDegree[i] === 0) {
      ans.push(i);
    }
  }
  return ans; // 返回可以到达所有点的最少点集合
};
```

:::

::: details [1615. 最大网络秩](https://leetcode.cn/problems/maximal-network-rank/description)
::: code-group

```js [节点的入度和出度]
/**
 * v1 枚举（出入度）
 *
 * 复杂度：时间 O(n^2 + |E|)，空间 O(n + |E|)。
 * @param {number} n
 * @param {number[][]} roads
 * @return {number}
 */
const maximalNetworkRank = function (n, roads) {
  const connected = Array.from({ length: n }, () => new Set()); // 邻接集合：connected[i] 存与 i 直连的城市
  const degrees = new Array(n).fill(0); // 度数组：degrees[i] 为 i 的连接数
  for (const [from, to] of roads) {
    // 无向边：两端度各加一，并记录互为直连
    degrees[from]++;
    degrees[to]++;
    connected[from].add(to);
    connected[to].add(from);
  }

  let maxRank = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // 若 i 与 j 直连，合计度需减 1，避免重复计数这条边
      const rank = degrees[i] + degrees[j] - (connected[i].has(j) ? 1 : 0);
      maxRank = Math.max(maxRank, rank);
    }
  }
  return maxRank;
};
```

:::

## 图的遍历

::: details [547. 省份数量](https://leetcode.cn/problems/number-of-provinces/description)
::: code-group

```js [DFS]
/**
 * v1 DFS
 * @param {number[][]} isConnected
 * @return {number}
 */
const findCircleNum = function (isConnected) {
  const n = isConnected.length;
  const visited = new Array(n).fill(false);
  let result = 0;

  // 遍历每一个省份
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      dfs(isConnected, i);
      result++;
    }
  }

  return result;

  function dfs(graph, i) {
    if (visited[i]) return;
    visited[i] = true;
    // 遍历邻居节点
    for (let j = 0; j < graph[i].length; j++) {
      if (graph[i][j] === 1 && i !== j) {
        dfs(graph, j);
      }
    }
  }
};
```

```js [BFS]
/**
 * v1 BFS
 * @param {number[][]} isConnected
 * @return {number}
 */
const findCircleNum = function (isConnected) {
  const n = isConnected.length;
  const visited = new Array(n).fill(0);
  let result = 0;
  // 遍历每一个城市
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      bfs(isConnected, i); // 遍历相连的省份
      result++;
    }
  }

  return result;

  function bfs(graph, i) {
    const queue = [i];
    visited[i] = true;
    while (queue.length > 0) {
      const cur = queue.shift();
      for (let j = 0; j < graph[cur].length; j++) {
        if (graph[cur][j] === 1 && !visited[j]) {
          visited[j] = true;
          queue.push(j);
        }
      }
    }
  }
};
```

```js [并查集]
/**
 * v1 并查集
 * @param {number[][]} isConnected
 * @return {number}
 */
const findCircleNum = function (isConnected) {
  const n = isConnected.length;
  const uf = new UF(n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // 如果两个城市是相连的，那么它们属于同一个连通分量
      if (isConnected[i][j] === 1) {
        uf.union(i, j);
      }
    }
  }

  return uf.size; // 返回联通分量的数量
};

class UF {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, index) => index);
    this.size = n;
  }

  union(i, j) {
    const rootI = this.find(i);
    const rootJ = this.find(j);
    if (rootI === rootJ) return;
    this.parent[rootI] = rootJ;
    // 两个连通分量合并成一个连通分量
    this.size--;
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }
}
```

:::

::: details [841. 钥匙和房间](https://leetcode.cn/problems/keys-and-rooms/description)
::: code-group

```js [DFS]
/**
 * v1 DFS
 * @param {number[][]} rooms
 * @return {boolean}
 */
let canVisitAllRooms = function (rooms) {
  const n = rooms.length;
  const visited = new Array(n).fill(false);

  const dfs = (room) => {
    if (visited[room]) return;
    //  前序位置，标记房间已访问
    visited[room] = true;
    for (const key of rooms[room]) {
      dfs(key);
    }
  };

  dfs(0);

  return visited.every((item) => item);
};
```

```js [BFS]
/**
 * v1 BFS
 * @param {number[][]} rooms
 * @return {boolean}
 */
let canVisitAllRooms = function (rooms) {
  const n = rooms.length;
  const visited = new Array(n).fill(false);
  const q = [0];
  visited[0] = true;

  while (q.length > 0) {
    let cur = q.shift();
    for (const key of rooms[cur]) {
      if (visited[key]) continue;
      visited[key] = true;
      q.push(key);
    }
  }

  return visited.every((item) => item);
};
```

:::

::: details [797. 所有可能的路径](https://leetcode.cn/problems/all-paths-from-source-to-target/description)
::: code-group

```js [DFS]
/**
 * v1 DFS
 * @param {number[][]} graph
 * @return {number[][]}
 */
const allPathsSourceTarget = function (graph) {
  const n = graph.length;
  const paths = []; // 记录所有路径
  const path = []; // 记录当前遍历中的路径
  dfs(0);
  return paths;

  function dfs(s) {
    // 添加节点 s 到路径
    path.push(s);
    if (s === n - 1) {
      // 到达终点
      paths.push([...path]);
      path.pop(); // 弹出最终节点
      return;
    }
    // 递归每个相邻节点
    for (const next of graph[s]) {
      dfs(next);
    }
    // 从路径移出节点 s
    path.pop();
  }
};
```

:::

::: details [1466. 重新规划路线](https://leetcode.cn/problems/reorder-routes-to-make-all-paths-lead-to-the-city-zero/description)
::: code-group

```js [DFS]
/**
 * v1 DFS
 * @param {number} n
 * @param {number[][]} connections
 * @return {number}
 */
const minReorder = function (n, connections) {
  const graph = Array.from({ length: n }, () => []);
  for (const [from, to] of connections) {
    // 构建无向图，并标记原始边1和反向边0
    graph[from].push([to, 1]);
    graph[to].push([from, 0]);
  }

  const visited = new Array(n).fill(false);

  let ans = 0;
  // 从0号节点出发遍历
  dfs(graph, 0);
  return ans;

  function dfs(graph, x) {
    visited[x] = true;
    for (const [next, type] of graph[x]) {
      if (!visited[next]) {
        if (type === 1) ans++;
        dfs(graph, next);
      }
    }
  }
};
```

```js [BFS]
/**
 * v1 BFS
 * @param {number} n
 * @param {number[][]} connections
 * @return {number}
 */
const minReorder = function (n, connections) {
  // 使用邻接表构建图
  // 由于是有向图，为了能遍历整棵树，我们将其视为无向图存储
  const graph = Array.from({ length: n }, () => []);
  for (const [from, to] of connections) {
    // 标记边的方向：1表示原始边，0表示新增的反向边
    graph[from].push([to, 1]);
    graph[to].push([from, 0]);
  }

  const visited = new Array(n).fill(false);
  let ans = 0;

  // BFS 队列，从节点 0 开始向外扩散
  const queue = [0];
  visited[0] = true;

  while (queue.length > 0) {
    const cur = queue.shift();
    // 遍历所有相邻节点（无论方向）
    for (const [next, type] of graph[cur]) {
      if (visited[next]) continue;

      visited[next] = true;
      // 如果 type === 1，说明原边方向是 cur -> next（背离 0 号节点）
      // 为了让所有节点都能到达 0，我们需要将这条边翻转为 next -> cur
      if (type === 1) ans++;

      // 继续将下一层节点加入队列
      queue.push(next);
    }
  }
  return ans;
};
```

:::

::: details ✨[802. 找到最终的安全状态](https://leetcode.cn/problems/find-eventual-safe-states/description)
::: code-group

```js [DFS-三色标记法]
/**
 * v1 DFS(三色标记法)
 * @param {number[][]} graph
 * @return {number[]}
 */
const eventualSafeNodes = function (graph) {
  // 如果起始节点位于一个环内，或者能到达一个环，则该节点不是安全的
  const n = graph.length;
  // 0: 未访问, 1: 访问中 (正在当前递归路径上), 2: 安全
  const colors = new Array(n).fill(0);

  const ans = [];
  for (let i = 0; i < n; i++) {
    if (dfs(i)) {
      ans.push(i);
    }
  }

  return ans;

  function dfs(i) {
    if (colors[i] > 0) {
      // 1 (灰色) -> false
      // 2 (黑色) -> true
      return colors[i] == 2;
    }

    colors[i] = 1; // 标记为访问中
    for (const next of graph[i]) {
      if (!dfs(next)) {
        return false;
      }
    }
    // 所有邻居都安全，标记为安全
    colors[i] = 2;
    return true;
  }
};
```

:::

::: details ✨[1129. 颜色交替的最短路径](https://leetcode.cn/problems/shortest-path-with-alternating-colors/description)
::: code-group

```js [BFS]
/**
 * @param {number} n
 * @param {number[][]} redEdges
 * @param {number[][]} blueEdges
 * @return {number[]}
 */
const shortestAlternatingPaths = function (n, redEdges, blueEdges) {
  const graph = buildGraph(n, redEdges, blueEdges);
  // 记录从节点0到节点i的最短路径，初始为-1表示无法到达
  const answer = new Array(n).fill(-1);

  // 在交替路径中，同一个节点可能需要被访问两次（分别通过红边和蓝边到达）
  // visited[node][color] 表示是否通过color颜色的边到达过node。
  // 0:red 1:blue
  const visited = Array.from({ length: n }, () => [false, false]);
  visited[0][0] = true;
  visited[0][1] = true;

  // [节点， 最短距离，上一条边的颜色(-1表示起始节点)]
  const queue = [[0, 0, -1]];

  while (queue.length > 0) {
    const [cur, dis, lastColor] = queue.shift();

    if (answer[cur] === -1) {
      answer[cur] = dis;
    }

    for (const [next, colorType] of graph[cur]) {
      // 只有当当前边的颜色与上一条边的颜色不同，且该状态未被访问过时才处理
      if (lastColor !== colorType && !visited[next][colorType]) {
        visited[next][colorType] = true;
        queue.push([next, dis + 1, colorType]);
      }
    }
  }
  return answer;
};

function buildGraph(n, redEdges, blueEdges) {
  // from,to,1/0 : 0标识red 1表示blue
  const graph = Array.from({ length: n }, () => []);

  for (const [from, to] of redEdges) {
    graph[from].push([to, 0]);
  }
  for (const [from, to] of blueEdges) {
    graph[from].push([to, 1]);
  }
  return graph;
}
```

:::

::: details ✨[1376. 通知所有员工所需的时间](https://leetcode.cn/problems/time-needed-to-inform-all-employees/description)
::: code-group

```js [DFS]
/**
 * v1 DFS
 * @param {number} n
 * @param {number} headID
 * @param {number[]} manager
 * @param {number[]} informTime
 * @return {number}
 */
const numOfMinutes = function (n, headID, manager, informTime) {
  let maxTime = 0;
  // 使用领接表优化下属的查找过程
  const graph = new Array(n).fill(0).map(() => []);
  for (let i = 0; i < manager.length; i++) {
    if (manager[i] !== -1) {
      graph[manager[i]].push(i);
    }
  }
  dfs(headID, 0);

  return maxTime;
  function dfs(id, currentTime) {
    // 如果是叶子节点（没有下属），更新最大时间
    if (graph[id].length === 0) {
      maxTime = Math.max(maxTime, currentTime);
      return;
    }
    // 前序位置
    currentTime += informTime[id];
    // 查找下属
    for (const next of graph[id]) {
      dfs(next, currentTime);
    }
    // 后序位置
    // 值传递不需要手动回溯
    // currentTime -= informTime[id]
  }
};
```

```js [BFS]
/**
 * v1 BFS
 * @param {number} n
 * @param {number} headID
 * @param {number[]} manager
 * @param {number[]} informTime
 * @return {number}
 */
const numOfMinutes = function (n, headID, manager, informTime) {
  // 构建邻接表
  const graph = new Array(n).fill(0).map(() => []);
  for (let i = 0; i < manager.length; i++) {
    if (manager[i] !== -1) {
      graph[manager[i]].push(i);
    }
  }
  let maxTime = 0;

  // 存放该员工id和通知到达他的时间
  const queue = [[headID, 0]];
  while (queue.length > 0) {
    const [cur, time] = queue.shift();
    if (time > maxTime) maxTime = time;
    for (const next of graph[cur]) {
      queue.push([next, time + informTime[cur]]);
    }
  }

  return maxTime;
};
```

:::

::: details [1306. 跳跃游戏 III](https://leetcode.cn/problems/jump-game-iii/description)
::: code-group

```js [DFS]
/**
 * v1 DFS
 * @param {number[]} arr
 * @param {number} start
 * @return {boolean}
 */
const canReach = function (arr, start) {
  let n = arr.length;
  const visited = new Array(n).fill(false);
  let canArrive = false;

  const dfs = (start) => {
    // 索引越界、已经遍历过、已经找到了
    if (start < 0 || start >= n || visited[start] || canArrive) return;

    visited[start] = true;

    const step = arr[start];
    if (step === 0) canArrive = true;

    dfs(start - step);
    dfs(start + step);
  };

  dfs(start);

  // 无法到达目标
  return canArrive;
};
```

```js [BFS]
/**
 * v1 BFS
 * @param {number[]} arr
 * @param {number} start
 * @return {boolean}
 */
const canReach = function (arr, start) {
  const n = arr.length;
  // 记录访问过的索引，防止重复访问导致死循环
  const visited = new Array(n).fill(false);
  // 初始化队列，将起始位置加入队列
  const queue = [start];
  visited[start] = true;

  while (queue.length > 0) {
    const cur = queue.shift(); // 取出当前位置

    // 如果当前位置的值为 0，说明找到了目标，返回 true
    if (arr[cur] === 0) return true;

    // 遍历当前位置能跳到的两个方向：向右跳 (cur + arr[cur]) 和 向左跳 (cur - arr[cur])
    for (const next of [cur + arr[cur], cur - arr[cur]]) {
      // 检查边界条件：索引不能越界，且未被访问过
      if (next < 0 || next >= n || visited[next]) continue;

      // 标记为已访问并加入队列
      visited[next] = true;
      queue.push(next);
    }
  }

  // 如果遍历完所有可能的路径都无法到达值为 0 的位置，返回 false
  return false;
};
```

:::

::: details [1926. 迷宫中离入口最近的出口](https://leetcode.cn/problems/nearest-exit-from-entrance-in-maze/description)
::: code-group

```js [BFS]
/**
 * v1 BFS
 * @param {character[][]} maze
 * @param {number[]} entrance
 * @return {number}
 */
const nearestExit = function (maze, entrance) {
  const m = maze.length;
  const n = maze[0].length;

  const visited = Array.from({ length: m }, () => new Array(n).fill(false));
  const q = [entrance];
  visited[entrance[0]][entrance[1]] = true;

  let directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  let step = 0;
  while (q.length > 0) {
    let sz = q.length;
    for (let i = 0; i < sz; i++) {
      let [row, col] = q.shift();

      // 到达出口
      if (
        (row === 0 || row === m - 1 || col === 0 || col === n - 1) &&
        (row !== entrance[0] || col !== entrance[1])
      ) {
        return step;
      }
      for (const dir of directions) {
        const nextRow = row + dir[0];
        const nextCol = col + dir[1];
        if (
          nextRow >= m ||
          nextRow < 0 ||
          nextCol >= n ||
          nextCol < 0 ||
          visited[nextRow][nextCol] ||
          maze[nextRow][nextCol] === "+"
        )
          continue;

        visited[nextRow][nextCol] = true;
        q.push([nextRow, nextCol]);
      }
    }
    step++;
  }

  return -1;
};
```

:::

::: details [1091. 二进制矩阵中的最短路径](https://leetcode.cn/problems/shortest-path-in-binary-matrix/description)
::: code-group

```js [BFS]
/**
 * v1 BFS
 * @param {number[][]} grid
 * @return {number}
 */
const shortestPathBinaryMatrix = function (grid) {
  if (grid[0][0] === 1) return -1;
  const n = grid.length;
  const visited = new Set();
  const q = [[0, 0]];
  visited.add("00");

  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];
  let step = 0;

  while (q.length > 0) {
    const sz = q.length;
    for (let i = 0; i < sz; i++) {
      const [row, col] = q.shift();

      if (row === n - 1 && col === n - 1) {
        return step + 1;
      }

      for (let dir of directions) {
        const nextRow = row + dir[0];
        const nextCol = col + dir[1];

        if (
          nextRow >= n ||
          nextRow < 0 ||
          nextCol >= n ||
          nextCol < 0 ||
          visited.has(`${nextRow}${nextCol}`) ||
          grid[nextRow][nextCol] === 1
        ) {
          continue;
        }
        visited.add(`${nextRow}${nextCol}`);
        q.push([nextRow, nextCol]);
      }
    }
    step++;
  }
  return -1;
};
```

:::

::: details [433. 最小基因变化](https://leetcode.cn/problems/minimum-genetic-mutation/description)
::: code-group

```js [BFS]
/**
 * @param {string} startGene
 * @param {string} endGene
 * @param {string[]} bank
 * @return {number}
 */
const minMutation = function (startGene, endGene, bank) {
  const visited = new Set();
  const q = [startGene];
  visited.add(startGene);
  let step = 0;
  while (q.length > 0) {
    const sz = q.length;

    for (let i = 0; i < sz; i++) {
      const curGene = q.shift();
      if (curGene === endGene) return step;
      for (const gene of getNeighbor(curGene)) {
        if (visited.has(gene) || !bank.includes(gene)) continue;
        visited.add(gene);
        q.push(gene);
      }
    }
    step++;
  }

  return -1;
};
/**
 *
 * @param {string} gene
 * @returns
 */
const getNeighbor = (gene) => {
  const res = [];
  for (let i = 0; i < 8; i++) {
    for (const g of ["A", "C", "G", "T"]) {
      if (g === gene[i]) continue;
      res.push(gene.slice(0, i) + g + gene.slice(i + 1));
    }
  }

  return res;
};
```

:::

::: details ✨[542. 01 矩阵](https://leetcode.cn/problems/01-matrix/description)
::: code-group

```js [BFS]
/**
 * v1 BFS
 *
 * 使用多源广度优先搜索
 * 从所有的 0 开始向外扩散，计算每个 1 到最近的 0 的距离
 * @param {number[][]} mat
 * @return {number[][]}
 */
const updateMatrix = function (mat) {
  const m = mat.length;
  const n = mat[0].length;

  // 初始化结果矩阵，全部填充为 -1 表示未访问
  // 这样可以区分哪些位置已经计算过最短距离
  const res = Array.from({ length: m }, () => new Array(n).fill(-1));
  const queue = [];

  // 1. 初始化队列：将所有值为 0 的点作为起点加入队列
  // 这些点的距离为 0
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (mat[i][j] === 0) {
        res[i][j] = 0;
        queue.push([i, j]);
      }
    }
  }

  // 定义上下左右四个方向
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  // 2. 开始 BFS
  while (queue.length > 0) {
    const [x, y] = queue.shift();

    // 遍历四个相邻方向
    for (const [dx, dy] of directions) {
      const nextX = x + dx;
      const nextY = y + dy;

      // 检查边界条件和是否已访问
      // 如果越界或者 res[nextX][nextY] !== -1 (说明已经求出更短距离了)，则跳过
      if (
        nextX < 0 ||
        nextX >= m ||
        nextY < 0 ||
        nextY >= n ||
        res[nextX][nextY] !== -1 // 跳过0
      ) {
        continue;
      }
      // 此时一定是1
      // 更新距离：当前点距离 + 1
      res[nextX][nextY] = res[x][y] + 1;
      // 将新访问的点加入队列
      queue.push([nextX, nextY]);
    }
  }

  return res;
};
```

:::

::: details ✨[863. 二叉树中所有距离为 K 的结点](https://leetcode.cn/problems/all-nodes-distance-k-in-binary-tree/description)
::: code-group

```js [BFS]
/**
 * v1 BFS
 * @param {TreeNode} root
 * @param {TreeNode} target
 * @param {number} k
 * @return {number[]}
 */
let distanceK = function (root, target, k) {
  // 1. 将树转化为图：构建子节点到父节点的映射
  // 这样我们可以从任意节点向父节点移动
  const parent = new Map();

  function traverse(node, parentNode) {
    if (node === null) return;
    parent.set(node.val, parentNode);
    traverse(node.left, node);
    traverse(node.right, node);
  }
  traverse(root, null);

  // 2. 使用 BFS 从 target 节点开始向外扩散搜索
  const visited = new Set(); // 记录访问过的节点值，避免回头
  const queue = [target];
  visited.add(target.val);

  let currentDistance = 0;
  while (queue.length > 0) {
    // 如果当前层级的距离等于 k，那么队列中所有的节点就是我们要找的结果
    if (currentDistance === k) {
      return queue.map((node) => node.val);
    }

    const sz = queue.length;
    for (let i = 0; i < sz; i++) {
      const cur = queue.shift();
      // 遍历当前节点的三个邻居：左子节点、右子节点、父节点
      const neighbors = [cur.left, cur.right, parent.get(cur.val)];
      for (const next of neighbors) {
        // 如果邻居存在且未被访问过
        if (next && !visited.has(next.val)) {
          visited.add(next.val);
          queue.push(next);
        }
      }
    }
    currentDistance++;
  }
  // 如果搜索结束还没找到，返回空数组
  return [];
};
```

:::

::: details ✨[934. 最短的桥](https://leetcode.cn/problems/shortest-bridge/description)
::: code-group

```js [DFS + BFS]
/**
 * v BFS(DFS标记岛屿，BFS记录最短路径)
 * @param {number[][]} grid
 * @return {number}
 */
const shortestBridge = function (grid) {
  const m = grid.length;
  const n = grid[0].length;
  // 标记已访问节点，避免重复处理
  const visited = Array.from({ length: m }, () => new Array(n).fill(false));
  const queue = [];

  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  // 1. 寻找第一座岛屿
  // 只要找到第一个为1的点，就通过DFS将整个岛屿找出并加入BFS队列
  let findFirstLand = false;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        dfs(i, j); // 启动DFS
        findFirstLand = true;
        break;
      }
    }
    if (findFirstLand) break;
  }

  // DFS: 标记第一座岛屿的所有节点，并将它们全部加入 BFS 队列作为起点
  function dfs(x, y) {
    // 边界检查 + 访问检查 + 是否为陆地检查
    if (
      x < 0 ||
      x >= m ||
      y < 0 ||
      y >= n ||
      visited[x][y] ||
      grid[x][y] === 0
    ) {
      return;
    }
    visited[x][y] = true;
    // 将第一座岛屿的节点入队，距离初始为 0
    queue.push([x, y, 0]);
    for (const dir of directions) {
      dfs(x + dir[0], y + dir[1]);
    }
  }

  // 2. 多源 BFS 向外层层扩展，寻找第二座岛屿
  while (queue.length > 0) {
    let [curX, curY, count] = queue.shift();
    for (const dir of directions) {
      const nextX = curX + dir[0];
      const nextY = curY + dir[1];

      // 越界或已访问过则跳过
      if (
        nextX < 0 ||
        nextX >= m ||
        nextY < 0 ||
        nextY >= n ||
        visited[nextX][nextY]
      )
        continue;

      visited[nextX][nextY] = true;

      // 如果遇到了未访问过的陆地(1)，说明触碰到了第二座岛屿
      // 当前的 count 即为最短桥的长度（跨越的水域数）
      if (grid[nextX][nextY] === 1) {
        return count;
      }

      // 遇到水域(0)，继续扩展，距离+1
      queue.push([nextX, nextY, count + 1]);
    }
  }
  return 0;
};
```

:::

::: details [127. 单词接龙](https://leetcode.cn/problems/word-ladder/description)
::: code-group

```js [BFS]
/**
 * v1 BFS
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
const ladderLength = function (beginWord, endWord, wordList) {
  // 将 wordList 转换为 Set 以提高查找效率 (O(1))
  const wordSet = new Set(wordList);
  // 如果 endWord 不在字典中，无法转换，直接返回 0
  if (!wordSet.has(endWord)) return 0;

  // BFS 队列，初始包含 beginWord
  const queue = [beginWord];
  // 记录已访问过的单词，避免重复处理
  const visited = new Set();
  visited.add(beginWord);
  // 序列长度初始化为 1 (包含 beginWord 本身)
  let len = 1;

  while (queue.length > 0) {
    const sz = queue.length;
    // 遍历当前层的所有节点
    for (let i = 0; i < sz; i++) {
      const cur = queue.shift();
      // 找到目标单词，返回当前序列长度
      if (cur === endWord) return len;
      // 尝试变换当前单词的每一个字符
      for (const next of getNeighbor(cur)) {
        // 如果变换后的单词在字典中且未访问过
        if (wordSet.has(next) && !visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }
    // 当前层遍历结束，长度 +1
    len++;
  }

  // 队列为空仍未找到 endWord，表示无法到达
  return 0;
};

// 辅助函数：生成所有可能的邻居节点（只改变一个字符）
function getNeighbor(word) {
  const chars = word.split("");
  const res = [];
  for (let i = 0; i < word.length; i++) {
    const originalChar = chars[i];
    for (let j = 0; j < 26; j++) {
      let char = String.fromCharCode(j + 97);
      if (char === originalChar) continue;
      // 拼接新单词
      chars[i] = char;
      const newWord = chars.join("");
      res.push(newWord);
    }
    chars[i] = originalChar;
  }
  return res;
}
```

:::

::: details [864. 获取所有钥匙的最短路径](https://leetcode.cn/problems/shortest-path-to-get-all-keys/description)
::: code-group

```js [BFS + 位操作]

```

:::

### 岛屿问题

::: details [200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/description)
::: code-group

```js [DFS]
/**
 * v1 DFS 遍历二维数组
 * 岛屿问题
 * @param {character[][]} grid
 * @return {number}
 */
let numIslands = function (grid) {
  let m = grid.length;
  let n = grid[0].length;
  let result = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === "1") {
        // 找到岛屿
        result += 1;
        dfs(grid, i, j);
      }
    }
  }

  return result;
};
// 从 (i, j) 开始，将与之相邻的陆地都变成海水
function dfs(grid, i, j) {
  let m = grid.length;
  let n = grid[0].length;
  // 超出索引边界
  if (i < 0 || j < 0 || i >= m || j >= n) {
    return;
  }

  if (grid[i][j] === "0") {
    // 已经是海水了
    return;
  }
  // 将grid[i][j]变成海水
  grid[i][j] = "0";
  dfs(grid, i - 1, j); // 上
  dfs(grid, i + 1, j); // 下
  dfs(grid, i, j - 1); // 左
  dfs(grid, i, j + 1); // 右
}
```

:::

::: details [1020. 飞地的数量](https://leetcode.cn/problems/number-of-enclaves/description)
::: code-group

```js [DFS]
/**
 * v1 dfs 岛屿问题
 * 封闭岛屿中陆地的数量
 * @param {number[][]} grid
 * @return {number}
 */
let numEnclaves = function (grid) {
  let m = grid.length;
  let n = grid[0].length;
  let result = 0;

  for (let i = 0; i < m; i++) {
    dfs(grid, i, 0); // 左边岛屿淹了
    dfs(grid, i, n - 1); // 右边岛屿淹了
  }

  for (let j = 0; j < n; j++) {
    dfs(grid, 0, j); // 上边岛屿淹了
    dfs(grid, m - 1, j); // 下边岛屿淹了
  }
  // 剩下的岛屿都是封闭岛屿
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        result++; // 统计封闭岛屿中陆地的个数
      }
    }
  }
  return result;
};

let directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

// 从 (i, j) 开始，将相邻的陆地都变成海水
function dfs(grid, i, j) {
  let m = grid.length;
  let n = grid[0].length;
  if (i < 0 || j < 0 || i >= m || j >= n) {
    return;
  }

  if (grid[i][j] === 0) {
    return;
  }

  grid[i][j] = 0;

  for (let dir of directions) {
    dfs(grid, i + dir[0], j + dir[1]);
  }
}
```

:::

::: details [1254. 统计封闭岛屿的数目](https://leetcode.cn/problems/number-of-closed-islands/description)
::: code-group

```js [DFS]
/**
 * v1 dfs 岛屿问题
 * @param {number[][]} grid
 * @return {number}
 */
let closedIsland = function (grid) {
  let result = 0;
  let m = grid.length;
  let n = grid[0].length;
  for (let j = 0; j < n; j++) {
    dfs(grid, 0, j); // 把靠上的岛屿淹掉
    dfs(grid, m - 1, j); // 把靠下的岛屿淹掉
  }

  for (let i = 0; i < m; i++) {
    dfs(grid, i, 0); // 把靠左的岛屿淹掉
    dfs(grid, i, n - 1); // 把靠右的岛屿淹掉
  }

  // 剩下的岛屿都是封闭岛屿
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 0) {
        result++;
        // 把周围陆地淹了
        dfs(grid, i, j);
      }
    }
  }
  return result;
};

let directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];
// 从 (i, j) 开始，将与之相邻的陆地都变成海水
function dfs(grid, i, j) {
  let m = grid.length;
  let n = grid[0].length;

  if (i < 0 || j < 0 || i >= m || j >= n) {
    return;
  }
  // 已经是海水了
  if (grid[i][j] === 1) {
    return;
  }
  // 将 (i, j) 变成海水
  grid[i][j] = 1;
  // 淹没上下左右的陆地
  for (const dir of directions) {
    nextI = i + dir[0];
    nextJ = j + dir[1];
    dfs(grid, nextI, nextJ);
  }
}
```

:::

::: details [695. 岛屿的最大面积](https://leetcode.cn/problems/max-area-of-island/description)
::: code-group

```js [DFS]
/**
 * v1 DFS 岛屿问题
 * @param {number[][]} grid
 * @return {number}
 */
let maxAreaOfIsland = function (grid) {
  let m = grid.length;
  let n = grid[0].length;
  let maxArea = 0; // 记录岛屿的最大面积

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        // 淹没岛屿，并更新最大岛屿面积
        let area = dfs(grid, i, j);
        maxArea = Math.max(maxArea, area);
      }
    }
  }
  return maxArea;
};

let directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];
// 淹没与 (i, j) 相邻的陆地，并返回淹没的陆地面积
function dfs(grid, i, j) {
  let m = grid.length;
  let n = grid[0].length;
  let area = 0;
  // 超出索引边界
  if (i < 0 || j < 0 || i >= m || j >= n) {
    return 0;
  }
  // 已经是海水了
  if (grid[i][j] === 0) {
    return 0;
  }

  area++;
  grid[i][j] = 0; // 将 (i, j) 变成海水

  for (let dir of directions) {
    area += dfs(grid, i + dir[0], j + dir[1]);
  }

  return area;
}
```

:::

::: details [417. 太平洋大西洋水流问题](https://leetcode.cn/problems/pacific-atlantic-water-flow/description)
::: code-group

```js [DFS]
/**
 * v1 BFS
 * @param {number[][]} heights
 * @return {number[][]}
 */
const pacificAtlantic = function (heights) {
  const m = heights.length;
  const n = heights[0].length;
  // 标记可以流入太平洋的坐标
  const visitedP = Array.from({ length: m }, () => new Array(n).fill(false));
  const queueP = [];
  // 第一行和第一列一定可以流入太平洋
  for (let i = 0; i < n; i++) {
    visitedP[0][i] = true;
    queueP.push([0, i]);
  }
  for (let j = 1; j < m; j++) {
    visitedP[j][0] = true;
    queueP.push([j, 0]);
  }

  // bfs搜索
  bfs(heights, queueP, visitedP);

  // 标记可以流入大西洋的坐标
  const visitedO = Array.from({ length: m }, () => new Array(n).fill(false));
  const queueO = [];
  // 最后一行和最后一列一定可以流入太平洋
  for (let i = 0; i < n; i++) {
    visitedO[m - 1][i] = true;
    queueO.push([m - 1, i]);
  }
  for (let j = 0; j < m - 1; j++) {
    visitedO[j][n - 1] = true;
    queueO.push([j, n - 1]);
  }
  // bfs搜索
  bfs(heights, queueO, visitedO);

  const res = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (visitedO[i][j] && visitedP[i][j]) {
        res.push([i, j]);
      }
    }
  }
  return res;
};

const bfs = (heights, queue, visited) => {
  const m = heights.length;
  const n = heights[0].length;
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  while (queue.length > 0) {
    const pos = queue.shift();
    for (const dir of directions) {
      const x = pos[0] + dir[0];
      const y = pos[1] + dir[1];

      if (x < 0 || x >= m || y < 0 || y >= n || visited[x][y]) continue;

      if (heights[x][y] < heights[pos[0]][pos[1]]) continue;

      visited[x][y] = true;
      queue.push([x, y]);
    }
  }
};
```

:::

## 环检测

::: details ✨[207. 课程表](https://leetcode.cn/problems/course-schedule/description)
::: code-group

```js [DFS]
/**
 * v1.1 环检测（DFS）
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
let canFinish = function (numCourses, prerequisites) {
  // 创建有向图
  let graph = buildGraph(numCourses, prerequisites);
  // 记录在当前路径上的节点
  let onPath = new Array(numCourses).fill(false);
  // 记录图中是否有环
  let hasCircle = false;

  // 记录遍历过的节点
  let visited = new Array(numCourses).fill(false);

  function dfs(graph, v, onPath) {
    // 如果存在环则返回
    if (hasCircle) {
      return;
    }
    // v 已经在递归路径上，说明成环了
    if (onPath[v]) {
      hasCircle = true;
      return;
    }

    // 如果该节点已经遍历过,代表从该节点出发进行的环检测已经完成,则直接返回
    if (visited[v]) {
      return;
    }

    visited[v] = true;
    // 前序位置:记录路径上的节点
    onPath[v] = true;
    for (let s of graph[v]) {
      dfs(graph, s, onPath);
    }
    // 后续位置:撤销节点记录
    onPath[v] = false;
  }
  // 因为不是强连通图,所以需要每个节点都检测一遍(存在重复需要剪枝)
  for (let i = 0; i < numCourses; i++) {
    if (!visited[i]) {
      dfs(graph, i, onPath);
    }
  }

  // 只要没有循环依赖可以完成所有课程
  return !hasCircle;
};

// 创建有向图
let buildGraph = function (numCourses, prerequisites) {
  // 节点:课程
  // 边:课程的依赖关系,先修课程 -> 课程
  let graph = Array.from({ length: numCourses }, () => []); // 邻接表
  for (let [to, from] of prerequisites) {
    graph[from].push(to);
  }
  return graph;
};
```

```js [BFS]
/**
 * v1 环检测（BFS）
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
let canFinish = function (numCourses, prerequisites) {
  // 创建有向图
  let graph = buildGraph(numCourses, prerequisites);

  // 记录所有节点的入度(依赖关系)
  let inDegree = new Array(numCourses).fill(0);
  for (let [to, from] of prerequisites) {
    inDegree[to]++;
  }

  let queue = [];
  for (let i = 0; i < inDegree.length; i++) {
    if (inDegree[i] === 0) {
      // 节点 i 没有入度，即没有依赖的节点
      // 可以作为拓扑排序的起点，加入队列
      queue.push(i);
    }
  }
  // 记录遍历的节点数量
  let count = 0;
  // 开始执行 BFS 循环
  while (queue.length !== 0) {
    let sz = queue.length;
    for (let i = 0; i < sz; i++) {
      // 弹出节点 cur,并将它指向的节点入度 -1
      let cur = queue.shift();
      count++;
      for (let next of graph[cur]) {
        inDegree[next]--;
        if (inDegree[next] === 0) {
          // 如果入度变为 0，说明 next 依赖的节点都已被遍历,可以入队
          queue.push(next);
        }
      }
    }
  }
  // 如果所有节点都被遍历过,说明不成环
  return count === numCourses;
};

// 创建有向图
let buildGraph = function (numCourses, prerequisites) {
  // 节点:课程
  // 边:课程的依赖关系,先修课程 -> 课程
  let graph = Array.from({ length: numCourses }, () => []); // 邻接表
  for (let [to, from] of prerequisites) {
    graph[from].push(to);
  }
  return graph;
};
```

:::

## 拓扑排序

::: details ✨[210. 课程表 II](https://leetcode.cn/problems/course-schedule-ii/description)
::: code-group

```js [DFS]
/**
 * v1 拓扑排序
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {number[]}
 */
let findOrder = function (numCourses, prerequisites) {
  // 记录是否成环
  let hasCycle = false;
  // 存放后续遍历结果
  let postorder = [];
  // 记录当前路径上的节点
  let onPath = new Array(numCourses).fill(false);
  // 记录遍历过的节点
  let visited = new Array(numCourses).fill(false);

  let graph = buildGraph(numCourses, prerequisites);

  function traverse(graph, v) {
    // 当前路径上存在已遍历节点,则说明存在环
    if (onPath[v]) {
      hasCycle = true;
      return;
    }
    // 存在环或者,已经该节点已经遍历过则直接返回
    // 已经遍历过表示,从该节点出发的环检测已经完成,不需要重复进行
    if (hasCycle || visited[v]) {
      return;
    }

    // 前序位置
    visited[v] = true;
    onPath[v] = true;
    for (let s of graph[v]) {
      traverse(graph, s);
    }
    // 后续位置
    onPath[v] = false;
    postorder.push(v);
  }

  for (let i = 0; i < numCourses; i++) {
    traverse(graph, i);
  }

  // 存在环则无法进行拓扑排序
  if (hasCycle) {
    return [];
  }
  // 逆后续遍历结果就是拓扑排序
  return postorder.reverse();
};

let buildGraph = function (numCourses, prerequisites) {
  // 节点:课程
  // 边:课程的依赖关系,先修课程->课程
  let graph = Array.from({ length: numCourses }, () => []); // 邻接表
  for (let [to, from] of prerequisites) {
    graph[from].push(to);
  }
  return graph;
};
```

```js [BFS]
/**
 * v1 拓扑排序(BFS)
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {number[]}
 */
let findOrder = function (numCourses, prerequisites) {
  // 记录拓扑排序结果
  let path = [];
  // 构建有向图
  let graph = buildGraph(numCourses, prerequisites);
  // 记录所有节点的入度
  let inDegree = new Array(numCourses).fill(0);
  for (let [to, from] of prerequisites) {
    inDegree[to]++;
  }

  // 初始化:将所有入度为零(无依赖)节点入队
  let queue = [];
  for (let i = 0; i < inDegree.length; i++) {
    if (inDegree[i] === 0) {
      queue.push(i);
    }
  }

  // 记录遍历过的节点数量
  let count = 0;
  // BFS算法模板
  while (queue.length !== 0) {
    let cur = queue.shift(); // 节点出队
    path.push(cur);
    count++;
    // 更新邻居节点的入度
    for (let next of graph[cur]) {
      inDegree[next]--;
      // 当节点入度为零(无依赖)就入队
      if (inDegree[next] === 0) {
        queue.push(next);
      }
    }
  }
  // 存在环，拓扑排序不存在
  if (count !== numCourses) {
    return [];
  }
  return path;
};

let buildGraph = function (numCourses, prerequisites) {
  // 节点:课程
  // 边:课程的依赖关系,先修课程->课程
  let graph = Array.from({ length: numCourses }, () => []); // 邻接表
  for (let [to, from] of prerequisites) {
    graph[from].push(to);
  }
  return graph;
};
```

:::

## 二分图判定

::: details ✨[785. 判断二分图](https://leetcode.cn/problems/is-graph-bipartite/description)
::: code-group

```js [DFS]
/**
 * v1 二分图判断问题 DFS
 * @param {number[][]} graph
 * @return {boolean}
 */
let isBipartite = function (graph) {
  // 记录图是否符合二分图性质
  let ok = true;
  let visited = new Array(graph.length).fill(false); // 记录访问过的节点,防止环

  // 记录每个节点的颜色: false 和 true 代表两种颜色
  let colors = new Array(graph.length).fill(false);

  function dfs(v) {
    // 如果已经确定不是二分图了，就不用浪费时间再递归遍历了
    if (!ok) return;

    // 前序位置
    visited[v] = true;

    let neighbors = graph[v];
    for (let next of neighbors) {
      // 没遍历过的领居
      if (!visited[next]) {
        // 那么应该给节点 next 涂上和节点 v 不同的颜色
        colors[next] = !colors[v];
        dfs(next); // 继续遍历
      } else {
        // 已经遍历过的邻居,根据颜色判断是否是二分图
        if (colors[next] === colors[v]) {
          ok = false;
          return;
        }
      }
    }
  }

  // 因为图不一定是联通的,可能存在多个子图
  // 所以要把每个节点都作为起点进行一次遍历
  // 如果发现任何一个子图不是二分图，整幅图都不算二分图
  for (let i = 0; i < graph.length; i++) {
    if (!visited[i]) {
      dfs(i);
    }
  }
  return ok;
};
```

```js [BFS]
/**
 * v1 二分图判断问题 BFS
 * @param {number[][]} graph
 * @return {boolean}
 */
let isBipartite = function (graph) {
  // 记录图是否符合二分图性质
  let ok = true;
  // 记录访问过的节点,防止环
  let visited = new Array(graph.length).fill(false);
  // 记录每个节点的颜色: false 和 true 代表两种颜色
  let colors = new Array(graph.length).fill(false);

  // 从 v 节点开始进行 BFS 遍历
  function bfs(v) {
    let queue = [v];
    visited[v] = true;
    while (queue.length !== 0 && ok) {
      let cur = queue.shift();

      // 从节点 cur 向所有相邻节点扩散
      for (let next of graph[cur]) {
        // 没遍历过的领居
        if (!visited[next]) {
          // 那么应该给节点 next 涂上和节点 v 不同的颜色
          colors[next] = !colors[cur];

          // 标记 w 节点，并放入队列
          visited[next] = true;
          queue.push(next);
        } else {
          // 已经遍历过的邻居,根据颜色判断是否是二分图
          if (colors[next] === colors[cur]) {
            ok = false;
            return;
          }
        }
      }
    }
  }

  // 因为图不一定是联通的,可能存在多个子图
  // 所以要把每个节点都作为起点进行一次遍历
  // 如果发现任何一个子图不是二分图，整幅图都不算二分图
  for (let i = 0; i < graph.length; i++) {
    if (!visited[i]) {
      bfs(i);
    }
  }
  return ok;
};
```

:::

::: details [886. 可能的二分法](https://leetcode.cn/problems/possible-bipartition/description/)
::: code-group

```js [DFS]
/**
 * v1 二分图判断 DFS
 * @param {number} n
 * @param {number[][]} dislikes
 * @return {boolean}
 */
let possibleBipartition = function (n, dislikes) {
  // 构建无向图
  let graph = buildGraph(n, dislikes);
  // 是否可以分组成功
  let ok = true;
  // 记录访问过的节点
  let visited = new Array(n).fill(false);
  // 记录节点的颜色
  let colors = new Array(n).fill(false);

  function dfs(v) {
    if (!ok) return;
    visited[v] = true;
    for (let next of graph[v]) {
      // 邻居节点为访问时,染上不同颜色
      if (!visited[next]) {
        colors[next] = !colors[v];
        dfs(next);
      } else {
        // 领居节点已经反问时,判断颜色是否相同
        if (colors[next] === colors[v]) {
          ok = false;
          return;
        }
      }
    }
  }

  // 可能存在多个子图,所有要遍历所有的节点
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      dfs(i);
    }
  }

  return ok;
};

// 构建无向图
let buildGraph = function (n, dislikes) {
  let graph = Array.from({ length: n }, () => []);
  for (let [v1, v2] of dislikes) {
    // 将图节点编号转换为 0 - n-1
    graph[v1 - 1].push(v2 - 1);
    graph[v2 - 1].push(v1 - 1);
  }
  return graph;
};
```

```js [BFS]
/**
 * v1 二分图判断 BFS
 * @param {number} n
 * @param {number[][]} dislikes
 * @return {boolean}
 */
let possibleBipartition = function (n, dislikes) {
  // 构建无向图
  let graph = buildGraph(n, dislikes);
  // 是否可以分组成功
  let ok = true;
  // 记录访问过的节点
  let visited = new Array(n).fill(false);
  // 记录节点的颜色
  let colors = new Array(n).fill(false);

  function bfs(v) {
    let queue = [v];
    visited[v] = true;
    while (queue.length !== 0 && ok) {
      let cur = queue.shift();
      for (let next of graph[cur]) {
        // 邻居节点为访问时,染上不同颜色
        if (!visited[next]) {
          colors[next] = !colors[cur];
          queue.push(next);
          visited[next] = true;
        } else {
          // 领居节点已经反问时,判断颜色是否相同
          if (colors[next] === colors[cur]) {
            ok = false;
            return;
          }
        }
      }
    }
  }

  // 可能存在多个子图,所有要遍历所有的节点
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      bfs(i);
    }
  }

  return ok;
};

// 构建无向图
let buildGraph = function (n, dislikes) {
  let graph = Array.from({ length: n }, () => []);
  for (let [v1, v2] of dislikes) {
    // 将图节点编号转换为 0 - n-1
    graph[v1 - 1].push(v2 - 1);
    graph[v2 - 1].push(v1 - 1);
  }
  return graph;
};
```

:::

## 并查集

::: details ✨[990. 等式方程的可满足性](https://leetcode.cn/problems/satisfiability-of-equality-equations/description)
::: code-group

```js [并查集]
/**
 * v1 并查集
 * @param {string[]} equations 等式数组，每个等式形如 "a==b" 或 "a!=b"
 * @return {boolean} 返回这些等式是否能同时成立
 */
let equationsPossible = function (equations) {
  // 创建并查集，大小为26（对应26个小写字母）
  let union = new UF(26);

  // 第一步：处理所有相等关系
  for (let equ of equations) {
    if (equ[1] === "=") {
      // 检查是否是相等关系
      // 将字母转换为0-25的索引
      let x = equ.charCodeAt(0) - "a".charCodeAt(0);
      let y = equ.charCodeAt(3) - "a".charCodeAt(0);
      // 将相等字母构成连通分量
      union.union(x, y);
    }
  }

  // 第二步：检查所有不等关系是否与已建立的相等关系冲突
  for (let equ of equations) {
    if (equ[1] === "!") {
      // 检查是否是不等关系
      let x = equ.charCodeAt(0) - "a".charCodeAt(0);
      let y = equ.charCodeAt(3) - "a".charCodeAt(0);
      // 如果不等关系的两个变量连通，说明产生矛盾
      if (union.connected(x, y)) {
        return false; // 发现矛盾，返回false
      }
    }
  }
  return true;
};

class UF {
  constructor(n) {
    // 连通分量的个数，初始时每个元素自成一个连通分量
    this._count = n;
    // 存储每个节点的父节点，初始时指向自己
    this.parent = Array.from({ length: n }, (_, index) => index);
  }

  union(p, q) {
    let rootP = this.find(p);
    let rootQ = this.find(q);
    if (rootP === rootQ) {
      return;
    }

    // 将p所在的树连接到q所在的树
    this.parent[rootP] = rootQ;
    // 两个连通分量合并成一个连通分量
    this._count--;
  }

  connected(p, q) {
    let rootP = this.find(p);
    let rootQ = this.find(q);
    return rootP === rootQ;
  }

  find(p) {
    if (this.parent[p] !== p) {
      // 路径压缩：将沿路的所有节点都直接指向根节点
      this.parent[p] = this.find(this.parent[p]);
    }
    return this.parent[p];
  }

  count() {
    return this._count;
  }
}
```

:::

::: details [684. 冗余连接](https://leetcode.cn/problems/redundant-connection/description/)
::: code-group

```js [并查集]
/**
 * 解题思路：使用并查集检测无向图中的环
 * 
 * 1. 问题分析：
 *    - 输入是一个包含 n 条边的无向图，节点编号从 1 到 n
 *    - 这些边中有一条是"多余的"，导致图中形成了环
 *    - 如果有多个答案，返回在输入中最后出现的那条边
 * 
 * 2. 并查集解法：
 *    - 并查集用于动态维护图中节点的连通性
 *    - 对于每条边(u,v)，如果 u 和 v 已经连通，则这条边导致了环
 *    - 由于只添加了一条边，则要找的边，就是发现环的这条边
 * 
 * 3. 实现细节：
 *    - 由于节点编号从 1 开始，使用时需要转换为 0-based 索引

 * @param {number[][]} edges 输入的边数组，每个元素是一个长度为2的数组 [from, to]
 * @return {number[]} 返回导致环的最后一条边
 */
let findRedundantConnection = function (edges) {
  // 获取最大节点编号
  const n = edges.reduce((max, [from, to]) => Math.max(max, from, to), 0);

  // 初始化并查集
  const union = new UF(n);

  // 遍历每条边，检查是否形成环
  for (const [from, to] of edges) {
    // 由于节点编号从 1 开始所以这里要 - 1
    if (union.connected(from - 1, to - 1)) {
      return [from, to]; // 如果已连通，该边即为所求
    }
    union.union(from - 1, to - 1);
  }
};

/**
 * 并查集（Union-Find）数据结构
 * 用于高效地维护元素的连通性关系
 */
class UF {
  /**
   * 初始化并查集
   * @param {number} n 节点个数（0-based）
   */
  constructor(n) {
    // 连通分量个数，初始时每个节点都是一个独立的连通分量
    this._count = n;
    // 存储每个节点的父节点，初始时每个节点的父节点是自己
    this.parent = Array.from({ length: n }, (_, index) => index);
  }

  /**
   * 将节点 p 和节点 q 连通
   * @param {number} p 第一个节点
   * @param {number} q 第二个节点
   */
  union(p, q) {
    const rootP = this.find(p);
    const rootQ = this.find(q);

    if (rootP === rootQ) {
      return;
    }

    this.parent[rootQ] = rootP;
    // 两个连通分量合并成一个连通分量
    this._count--;
  }

  // 判断节点 p 和节点 q 是否连通
  connected(p, q) {
    const rootP = this.find(p);
    const rootQ = this.find(q);
    return rootP === rootQ;
  }

  /**
   * 查找节点x的根节点
   * 使用路径压缩优化：在查找的同时，将路径上的所有节点都直接连接到根节点
   * @param {number} x 要查找的节点
   * @returns {number} 根节点的编号
   */
  find(x) {
    // 递归查找根节点，并在回溯时进行路径压缩
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  /**
   * 获取当前的连通分量数
   * 初始时为节点数，每次合并两个不同的连通分量时减1
   * @returns {number} 连通分量的个数
   */
  count() {
    return this._count;
  }
}
```

:::

::: details [130. 被围绕的区域](https://leetcode.cn/problems/surrounded-regions/description/)
::: code-group

```js [并查集]
/**
 * 解题思路：
 * 1. 本题可以转化为连通性问题：
 *    - 与边界相连的'O'永远不会被'X'包围
 *    - 所有未被包围的'O'都直接或间接与边界'O'相连
 *
 * 2. 使用并查集解决：
 *    - 创建一个虚拟节点dummy，作为所有边界'O'的根节点
 *    - 所有能与dummy连通的'O'都是不被包围的
 *    - 其余的'O'都是被包围的，需要变成'X'
 *
 * 3. 算法步骤：
 *    a) 将所有边界上的'O'与dummy连通
 *    b) 将内部的'O'与相邻的'O'连通
 *    c) 检查每个'O'是否与dummy连通，不连通则替换为'X'
 * @param {character[][]} board 输入的字符矩阵
 * @return {void} 直接修改输入矩阵，不返回值
 */
let solve = function (board) {
  let m = board.length;
  let n = board[0].length;

  // 虚拟节点 dummy 的索引设置为 m*n，确保不会与其他节点的索引冲突
  let dummy = m * n;
  // 创建大小为 m*n+1 的并查集，额外的1个位置用于 dummy 节点
  let union = new UF(m * n + 1);

  // 步骤1：处理边界情况
  // 将四个边界上的'O'都与 dummy 节点连通
  // 处理左右边界
  for (let i = 0; i < m; i++) {
    if (board[i][0] === "O") {
      // 左边界上的'O'
      union.union(getIndex(i, 0), dummy);
    }
    if (board[i][n - 1] === "O") {
      // 右边界上的'O'
      union.union(getIndex(i, n - 1), dummy);
    }
  }
  // 处理上下边界
  for (let i = 0; i < n; i++) {
    if (board[0][i] === "O") {
      // 上边界上的'O'
      union.union(getIndex(0, i), dummy);
    }
    if (board[m - 1][i] === "O") {
      // 下边界上的'O'
      union.union(getIndex(m - 1, i), dummy);
    }
  }

  // 定义四个方向：上、下、左、右
  let direction = [
    [-1, 0], // 上
    [1, 0], // 下
    [0, -1], // 左
    [0, 1], // 右
  ];

  // 步骤2：处理内部节点
  // 遍历除边界外的所有格子
  for (let i = 1; i < m - 1; i++) {
    for (let j = 1; j < n - 1; j++) {
      if (board[i][j] === "O") {
        // 对于每个'O'，检查其四个方向
        for (let dir of direction) {
          let x = i + dir[0];
          let y = j + dir[1];
          // 如果相邻位置也是'O'，则将两个位置连通
          if (board[x][y] === "O") {
            union.union(getIndex(i, j), getIndex(x, y));
          }
        }
      }
    }
  }

  // 步骤3：替换被包围的'O'
  // 遍历除边界外的所有格子
  for (let i = 1; i < m - 1; i++) {
    for (let j = 1; j < n - 1; j++) {
      if (board[i][j] === "O") {
        // 如果一个'O'和 dummy 不连通，说明它被包围了
        if (!union.connected(getIndex(i, j), dummy)) {
          board[i][j] = "X";
        }
      }
    }
  }

  function getIndex(i, j) {
    return i * n + j;
  }
};

class UF {
  // n 为图中节点的个数
  constructor(n) {
    // 连通分量个数
    this._count = n;
    // 存储每个节点的父节点
    this.parent = Array.from({ length: n }, (_, index) => index);
  }

  // 将节点 p 和节点 q 连通
  union(p, q) {
    const rootP = this.find(p);
    const rootQ = this.find(q);

    if (rootP === rootQ) {
      return;
    }

    this.parent[rootQ] = rootP;
    // 两个连通分量合并成一个连通分量
    this._count--;
  }

  // 判断节点 p 和节点 q 是否连通
  connected(p, q) {
    const rootP = this.find(p);
    const rootQ = this.find(q);
    return rootP === rootQ;
  }

  // !路径压缩
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  // 返回图中的连通分量个数
  count() {
    return this._count;
  }
}
```

```js [DFS]
/**
 * v1 DFS 岛屿问题
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
let solve = function (board) {
  let m = board.length;
  let n = board[0].length;

  // 标记无法捕获区域
  for (let i = 0; i < m; i++) {
    dfs(board, i, 0); // 标记左边界
    dfs(board, i, n - 1); // 标记有边界
  }

  for (let i = 0; i < n; i++) {
    dfs(board, 0, i); // 标记上边界
    dfs(board, m - 1, i); // 标记下边界
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // 将可以捕获的区域标记为X
      if (board[i][j] === "O") {
        board[i][j] = "X";
        // 将不能捕获E的区域标记为O
      } else if (board[i][j] === "E") {
        board[i][j] = "O";
      }
    }
  }
};

let dfs = function (board, i, j) {
  let m = board.length;
  let n = board[0].length;
  let direction = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  if (i < 0 || j < 0 || i >= m || j >= n) {
    return;
  }

  if (board[i][j] !== "O") return;

  board[i][j] = "E"; // 标记为无法捕获的区域

  for (let dir of direction) {
    dfs(board, i + dir[0], j + dir[1]);
  }
};
```

:::

## 最小生成树

将**所有边按照权重从小到大排序**，从权重最小的边开始遍历，如果这条边和 mst 中的其它边不会形成环，则这条边是最小生成树的一部分，将它加入 mst 集合；否则，这条边不是最小生成树的一部分，不要把它加入 mst 集合

::: details ✨[1584. 连接所有点的最小费用](https://leetcode.cn/problems/min-cost-to-connect-all-points/description/)
::: code-group

```js [Kruskal 最小生成树算法]
/**
 * 连接所有点的最小费用问题 - 最小生成树（Minimum Spanning Tree, MST）
 *
 * 1. 问题分析：
 *    - 给定平面上的n个点，需要用线段连接所有点
 *    - 线段的费用是两点间的曼哈顿距离
 *    - 要求所有点连通，且总费用最小
 *    - 本质是带权无向图的最小生成树问题
 *
 * 2. 解题思路：使用 Kruskal 算法
 *    a) 将所有可能的边生成并排序
 *    b) 使用并查集检测环，贪心选择最小费用的边
 *    c) 构建最小生成树直到所有点连通
 *
 * 3. 算法步骤：
 *    a) 生成所有可能的边及其权重（费用）
 *    b) 按照费用从小到大排序所有边
 *    c) 使用并查集，依次添加不会形成环的最小费用边
 *
 * @param {number[][]} points 坐标点数组，每个点是[x,y]格式
 * @return {number} 连接所有点的最小总费用
 */
let minCostConnectPoints = function (points) {
  let n = points.length;

  // 步骤1：生成所有可能的边及其费用
  let costs = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      let p1 = points[i];
      let p2 = points[j];
      // 计算曼哈顿距离作为边的权重
      let cost = Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
      // 用点的索引代替坐标
      costs.push([i, j, cost]);
    }
  }

  // 步骤2：按照费用升序排序（贪心策略）
  costs.sort((a, b) => a[2] - b[2]);

  // 步骤3：执行Kruskal算法构建最小生成树
  let mst = 0; // 最小生成树的总费用
  let uf = new UF(n); // 初始化并查集
  for (let [from, to, cost] of costs) {
    // 如果连接这条边会形成环，跳过
    if (uf.connected(from, to)) {
      continue;
    }
    // 若这条边不会产生环，则属于最小生成树
    mst += cost;
    uf.union(from, to);
  }

  return mst;
};

class UF {
  constructor(n) {
    // 连通分量的个数，初始时每个元素自成一个连通分量
    this._count = n;
    // 存储每个节点的父节点，初始时指向自己
    this.parent = Array.from({ length: n }, (_, index) => index);
  }

  union(p, q) {
    let rootP = this.find(p);
    let rootQ = this.find(q);
    if (rootP === rootQ) {
      return;
    }

    // 将p所在的树连接到q所在的树
    this.parent[rootP] = rootQ;
    // 两个连通分量合并成一个连通分量
    this._count--;
  }

  connected(p, q) {
    let rootP = this.find(p);
    let rootQ = this.find(q);
    return rootP === rootQ;
  }

  find(p) {
    if (this.parent[p] !== p) {
      // 路径压缩：将沿路的所有节点都直接指向根节点
      this.parent[p] = this.find(this.parent[p]);
    }
    return this.parent[p];
  }

  count() {
    return this._count;
  }
}
```

:::

## 最短路径算法

::: tip
Dijkstra 算法是一种用于计算图中**单源最短路径**的算法，其本质是标准 BFS 算法 + 贪心思想。

如果图中包含负权重边，会让贪心思想失效，所以 _Dijkstra 只能处理不包含负权重边的图_。

Dijkstra 算法和标准的 BFS 算法的区别只有两个：

1、标准 BFS 算法使用普通队列，**Dijkstra 算法使用优先级队列**，让距离起点更近的节点优先出队（贪心思想的体现）。

2、标准 BFS 算法使用一个 visited 数组记录访问过的节点，确保算法不会陷入死循环；**Dijkstra 算法使用一个 distTo 数组，确保算法不会陷入死循环，同时记录起点到其他节点的最短路径**。
:::

::: details 优先级队列实现代码

```js
// 优先级队列
class PriorityQueue {
  constructor(comparator) {
    this.heap = [];
    this.size = 0;
    this.comparator = comparator || ((a, b) => a - b); // 默认整型小顶堆
  }
  // 返回堆的大小
  getSize() {
    return this.size;
  }
  // 判断堆是否为空
  isEmpty() {
    return this.size === 0;
  }
  // 左子节点的索引
  left(node) {
    return node * 2 + 1;
  }
  // 右子节点的索引
  right(node) {
    return node * 2 + 2;
  }
  // 父节点的索引
  parent(node) {
    return Math.floor((node - 1) / 2);
  }
  // 交换数组的两个元素
  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
  // 查，返回堆顶元素，时间复杂度 O(1)
  peek() {
    if (this.isEmpty()) {
      throw new Error("heap is empty");
    }
    return this.heap[0];
  }
  // 删，删除堆顶元素，时间复杂度 O(logN)
  dequeue() {
    if (this.isEmpty()) {
      throw new Error("heap is empty");
    }
    let res = this.heap[0];
    // 把堆底元素放到堆顶
    this.swap(0, this.size - 1);
    // 避免对象游离
    this.heap[this.size - 1] = undefined;
    this.size--;
    // 然后下沉到正确位置
    this.sink(0);
    return res;
  }
  // 增，向堆中插入一个元素，时间复杂度 O(logN)
  enqueue(value) {
    // 把新元素追加到最后
    this.heap[this.size] = value; // this.heap.push(value);
    // 然后上浮到正确位置
    this.swim(this.size);
    this.size++;
  }
  // 下沉操作，时间复杂度是树高 O(logN)
  sink(node) {
    while (this.left(node) < this.size) {
      // 与左右子节点比较找到最小的
      let min = node;
      let left = this.left(node);
      let right = this.right(node);
      if (
        left < this.size &&
        this.comparator(this.heap[left], this.heap[min]) < 0
      ) {
        // 左子节点较小
        min = left;
      }

      if (
        right < this.size &&
        this.comparator(this.heap[right], this.heap[min]) < 0
      ) {
        // 右子节点较小
        min = right;
      }
      // 当前节点就是最小节点
      if (min === node) {
        break;
      }

      this.swap(node, min);
      node = min;
    }
  }
  // 上浮操作，时间复杂度是树高 O(logN)
  swim(node) {
    while (
      node > 0 &&
      this.comparator(this.heap[this.parent(node)], this.heap[node]) > 0
    ) {
      this.swap(node, this.parent(node));
      node = this.parent(node);
    }
  }
}
```

:::

::: details ✨[743. 网络延迟时间](https://leetcode.cn/problems/network-delay-time/description/)
::: code-group

```js [Dijkstra 算法]
/**
 * 网络延迟时间（Dijkstra算法）
 *
 * 1. 问题分析：
 *    - times[i] = [u, v, w] 表示从节点u到v需要w时间
 *    - 求从节点k出发，所有节点收到信号的最短时间，若有节点不可达返回-1
 *    - 本质是单源最短路径问题，且无负权边，适合用Dijkstra算法
 *
 * 2. 算法思路：
 *    a) 用邻接表构建有向图
 *    b) 用Dijkstra算法计算k到所有节点的最短路径
 *    c) 取所有最短路径的最大值作为答案
 *    d) 若有节点不可达，返回-1
 *
 * @param {number[][]} times 边信息数组 [u, v, w]
 * @param {number} n 节点总数
 * @param {number} k 起点编号（1-based）
 * @return {number} 所有节点收到信号的最短时间，若不可达返回-1
 */
let networkDelayTime = function (times, n, k) {
  // Dijkstra算法实现
  let dijkstra = function (graph, src) {
    // timeTo[i]: 从src到i的最短时间，-1表示未知
    let timeTo = new Array(graph.length).fill(-1);
    // 小顶堆优先队列，按累计时间从小到大出队
    let pq = new PriorityQueue((a, b) => a.timeFromStart - b.timeFromStart);

    // 起点入队，累计时间为0
    pq.enqueue(new State(src, 0));

    while (!pq.isEmpty()) {
      let cur = pq.dequeue();
      let node = cur.node;
      let timeFromStart = cur.timeFromStart;

      // 如果已确定最短时间，跳过
      if (timeTo[node] !== -1) continue;
      // 第一次出队即为最短路径
      timeTo[node] = timeFromStart;

      // 遍历邻居节点
      for (let [to, time] of graph[node]) {
        if (timeTo[to] !== -1) continue;
        pq.enqueue(new State(to, timeFromStart + time));
      }
    }
    return timeTo;
  };

  // 步骤1：构建邻接表
  let graph = buildGraph(times, n);
  // 步骤2：Dijkstra求最短路径
  let timeTo = dijkstra(graph, k);
  // 步骤3：取所有最短路径的最大值
  let res = 0;
  for (let i = 1; i < timeTo.length; i++) {
    // 节点编号从1开始
    if (timeTo[i] === -1) return -1; // 有节点不可达
    res = Math.max(res, timeTo[i]);
  }
  return res;
};

// 构造图
let buildGraph = function (times, n) {
  // 节点编号是从 1 开始的，所以要一个大小为 n + 1 的邻接表
  let graph = Array.from({ length: n + 1 }, () => []);
  for (let [from, to, time] of times) {
    // 邻接表存储图结构，同时存储权重信息
    graph[from].push([to, time]);
  }
  return graph;
};

class State {
  constructor(node, timeFromStart) {
    this.node = node;
    // 从起点 k 到当前节点需要的时间
    this.timeFromStart = timeFromStart;
  }
}
```

:::

::: details [1631. 最小体力消耗路径](https://leetcode.cn/problems/path-with-minimum-effort/description/)
::: code-group

```js [Dijkstra 算法]
/**
 * 最小体力消耗路径（Dijkstra变形）
 *
 * 1. 问题分析：
 *    - 给定一个高度矩阵，从左上角到右下角，每次只能上下左右移动
 *    - 每次移动的体力消耗为相邻格子的高度差的绝对值
 *    - 路径的总代价定义为路径上所有消耗的最大值
 *    - 求所有路径中总代价最小的那一条
 *
 * 2. 算法思路：
 *    - 本质是最短路问题，但路径权重是“最大边权”而不是“边权和”
 *    - 用 Dijkstra 算法，每次扩展的不是距离和，而是到当前点的最大体力消耗
 *    - distTo[node] 表示从起点到 node 的最小体力消耗（即最大边权的最小值）
 *
 * @param {number[][]} heights 高度矩阵
 * @return {number} 最小体力消耗
 */
let minimumEffortPath = function (heights) {
  let m = heights.length;
  let n = heights[0].length;
  // 记录从起点 (0, 0) 到每个节点的最小体力消耗
  let distTo = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  // 优先队列，按最大体力消耗从小到大出队
  let pq = new PriorityQueue((a, b) => a.effortFromStart - b.effortFromStart);
  pq.enqueue(new State(0, 0, 0));

  while (!pq.isEmpty()) {
    let { row, col, effortFromStart } = pq.dequeue();

    // 已经有更优解，跳过
    if (distTo[row][col] !== Infinity) continue;

    // 第一次出队即为最优体力消耗
    distTo[row][col] = effortFromStart;

    // 到达终点直接返回
    if (row === m - 1 && col === n - 1) {
      return effortFromStart;
    }

    // 扩展所有合法邻居
    for (let [x, y] of getNeighbor(heights, row, col)) {
      if (distTo[x][y] !== Infinity) continue;
      // 路径最大体力消耗取决于当前路径和新边的最大值
      let newFromStart = Math.max(
        effortFromStart,
        Math.abs(heights[x][y] - heights[row][col])
      );
      pq.enqueue(new State(x, y, newFromStart));
    }
  }

  function getNeighbor(heights, x, y) {
    let m = heights.length;
    let n = heights[0].length;
    let neighbors = [];

    // 四个方向
    let dirs = [
      [0, 1], // 右
      [0, -1], // 左
      [1, 0], // 下
      [-1, 0], // 上
    ];
    for (let [dx, dy] of dirs) {
      let nx = x + dx;
      let ny = y + dy;
      // 判断是否越界
      if (nx >= 0 && nx < m && ny >= 0 && ny < n) {
        neighbors.push([nx, ny]);
      }
    }
    return neighbors;
  }
};

class State {
  constructor(row, col, effortFromStart) {
    // 当前节点的横坐标
    this.row = row;
    // 当前节点的纵坐标
    this.col = col;
    // 从起点到节点 node 需要消耗的体力值
    this.effortFromStart = effortFromStart;
  }
}
```

:::

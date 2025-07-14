# _IndexedDB_

本文主要包含以下内容：

- _IndexedDB_ 简介
- _IndexedDB_ 重要概念
- _IndexedDB_ 实操
  - 操作数据库
  - 插入数据
  - 读取数据
  - 更新数据
  - 删除数据

## _IndexedDB_ 简介

随着浏览器的功能不断增强，越来越多的网站开始考虑，将**大量数据储存在客户端**，这样可以减少从服务器获取数据，直接从本地获取数据。

现有的浏览器数据储存方案，都不适合储存大量数据：_Cookie_ 的大小不超过 _4KB_，且每次请求都会发送回服务器；_LocalStorage_ 在 _2.5MB_ 到 _10MB_ 之间（各家浏览器不同），而且不提供搜索功能，不能建立自定义的索引。所以，需要一种新的解决方案，这就是 _IndexedDB_ 诞生的背景。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-01-015214.png" alt="image-20211201094954024" style="zoom:50%;" />

_MDN_ 官网是这样解释 _[IndexedDB](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API)_ 的：

> _IndexedDB_ 是一种底层 _API_，用于在客户端存储大量的结构化数据（也包括文件/二进制大型对象（_blobs_））。该 _API_ 使用索引实现对数据的高性能搜索。虽然 _Web Storage_ 在存储较少量的数据很有用，但对于存储更大量的结构化数据来说力不从心。而 _IndexedDB_ 提供了这种场景的解决方案。

通俗地说，_IndexedDB_ 就是浏览器提供的本地数据库，它可以被网页脚本创建和操作。**_IndexedDB_ 允许储存大量数据，提供查找接口，还能建立索引**。这些都是 _LocalStorage_ 所不具备的。**就数据库类型而言，_IndexedDB_ 不属于关系型数据库（不支持 _SQL_ 查询语句），更接近 _NoSQL_ 数据库。**

下表罗列出了几种常见的客户端存储方式的对比：

|          | 会话期 Cookie      | 持久性 Cookie            | sessionStorage   | localStorage             | IndexedDB      | WebSQL |
| :------- | :----------------- | :----------------------- | :--------------- | :----------------------- | :------------- | :----- |
| 存储大小 | 4kb                | 4kb                      | 2.5~10MB         | 2.5~10MB                 | >250MB         | 已废弃 |
| 失效时间 | 浏览器关闭自动清除 | 设置过期时间，到期后清除 | 浏览器关闭后清除 | 永久保存（除非手动清除） | 手动更新或删除 | 已废弃 |

_IndexedDB_ 具有以下特点。

- **键值对储存：**_IndexedDB_ 内部采用对象仓库（ _object store_ ）存放数据。所有类型的数据都可以直接存入，包括 _JavaScript_ 对象。对象仓库中，数据以“**键值对**”的形式保存，**每一个数据记录都有对应的主键，主键是独一无二的，不能有重复，否则会抛出一个错误。**

- **异步**：**_IndexedDB_ 操作时不会锁死浏览器，用户依然可以进行其他操作，这与 _LocalStorage_ 形成对比，后者的操作是同步的。**异步设计是为了防止大量数据的读写，拖慢网页的表现。

- **支持事务：** _IndexedDB_ 支持**事务（ _transaction_ ）**，**这意味着一系列操作步骤之中，只要有一步失败，整个事务就都取消，数据库回滚到事务发生之前的状态，不存在只改写一部分数据的情况。这和 _MySQL_ 等数据库的事务类似。**

- **同源限制：**_IndexedDB_ 受到**同源限制**，每一个数据库对应创建它的域名。网页只能访问自身域名下的数据库，而不能访问跨域的数据库。

- **储存空间大：** 这是 _IndexedDB_ **最显著的特点之一**。_IndexedDB_ 的储存空间比 _LocalStorage_ 大得多，一般来说**不少于 _250MB_**，甚至没有上限。

- **支持二进制储存：**_IndexedDB_ 不仅可以储存字符串，还可以储存二进制数据（ _ArrayBuffer_ 对象和 _Blob_ 对象）。

_IndexedDB_ 主要使用在于客户端需要存储大量的数据的场景下：

- **数据可视化等界面**，大量数据，每次请求会消耗很大性能。

- **即时聊天工具**，大量消息需要存在本地。

- 其它存储方式容量不满足时，不得已使用 _IndexedDB_

## _IndexedDB_ 重要概念

在正式开始之前，我们先来介绍一下 _IndexedDB_ 里面一些重要的概念。

_IndexedDB_ 是一个比较复杂的 _API_，涉及不少概念。它把不同的实体，抽象成一个个对象接口。学习这个 _API_，就是学习它的各种对象接口。

- 数据库：_IDBDatabase_ 对象

- 对象仓库：_IDBObjectStore_ 对象

- 索引：_IDBIndex_ 对象

- 事务：_IDBTransaction_ 对象

- 操作请求：_IDBRequest_ 对象

- 指针：_IDBCursor_ 对象

- 主键集合：_IDBKeyRange_ 对象

下面是一些主要的概念。

（1）数据库

数据库是一系列相关数据的容器。**每个域名（严格的说，是协议 + 域名 + 端口）都可以新建任意多个数据库。**

_IndexedDB_ 数据库有版本的概念。同一个时刻，只能有一个版本的数据库存在。如果要修改数据库结构（新增或删除表、索引或者主键），只能通过升级数据库版本完成。

（2）对象仓库

**每个数据库包含若干个对象仓库（ _object store_ ）。它类似于关系型数据库的表格。**

（3）数据记录

对象仓库保存的是数据记录。**每条记录类似于关系型数据库的行，但是只有主键和数据体两部分。**主键用来建立默认的索引，必须是不同的，否则会报错。**主键可以是数据记录里面的一个属性，也可以指定为一个递增的整数编号。**

```js
{ id: 1, text: 'foo' }
```

上面的对象中，_id_ 属性可以当作主键。

**数据体可以是任意数据类型，不限于对象。**

（4）索引

为了**加速数据的检索**，可以在对象仓库里面，为不同的属性建立索引。

在关系型数据库当中也有索引的概念，我们可以给对应的表字段添加索引，以便加快查找速率。在 _IndexedDB_ 中同样有索引，我们可以在**创建 _store_ 的时候同时创建索引，在后续对 _store_ 进行查询的时候即可通过索引来筛选**，给某个字段添加索引后，在后续插入数据的过成功，索引字段便不能为空。

（5）事务

**数据记录的读写和删改，都要通过事务完成。**事务对象提供 _error、abort_ 和 _complete_ 三个事件，用来监听操作结果。

（6）指针（游标）
游标是 _IndexedDB_ 数据库新的概念，大家可以把游标想象为一个指针，比如我们要查询满足某一条件的所有数据时，就需要用到游标，我们让游标一行一行的往下走，游标走到的地方便会返回这一行数据，此时我们便可对此行数据进行判断，是否满足条件。

## _IndexedDB_ 实操

_IndexedDB_ 所有针对仓库的操作都是基于事务的。

在正式开始之前，我们先创建如下的项目结构：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-01-015307.png" alt="image-20211201095256757" style="zoom:50%;" />

该项目目录下存在 _2_ 个文件，其中 _db.js_ 是用来封装各种数据库操作的。

### 操作数据库

首先第一步是创建以及连接数据库。

```js db.js
/**
 * 创建数据库
 * @param {string} dbName 数据库名称
 * @param {number} version 数据库版本
 */
function openDB(dbName, version = 1) {
  return new Promise((resolve, reject) => {
    let db; // 存储数据库对象
    // 打开数据库，如果没有该数据库，则创建该数据库
    const request = indexedDB.open(dbName, version);

    // 数据库打开或者创建成功的时候触发
    request.onsuccess = function (event) {
      // 存储数据库对象
      db = event.target.result;
      console.log("数据库打开成功");
      resolve(db);
    };
    // 数据库打开失败的时候触发
    request.onerror = function (event) {
      console.log("数据库打开失败");
      reject(event);
    };

    // 数据库发生更新的时候触发: 1. 版本号更新 2. 添加或删除对象仓库（表）3. 第一次调用open方法
    request.onupgradeneeded = function (event) {
      console.log("数据库更新");
      db = event.target.result;
      // 创建对象仓库(表)
      let objectStore = db.createObjectStore("stu", {
        keyPath: "stuId", // 主键（唯一值）
        autoIncrement: true, // 自增
      });
      // 创建索引
      objectStore.createIndex("stuId", "stuId", { unique: true });
      objectStore.createIndex("stuName", "stuName", { unique: false });
      objectStore.createIndex("stuAge", "stuAge", { unique: false });
    };
  });
}
```

在上面的代码中，我们封装了一个 _openDB_ 的函数，该函数调用 _indexedDB.open_ 方法来尝试打开一个数据库，如果该数据库不存在，就会创建。

_indexedDB.open_ 方法返回一个对象，我们在这个对象上面分别监听了成功、错误以及更新这三个事件。

**这里尤其要说一下 _upgradeneeded_ 更新事件。该事件会在数据库发生更新时触发，什么叫做数据库有更新时呢？就是添加或删除对象仓库（表），以及数据库版本号更新的时候。**

因为一开始创建数据库时，版本是从无到有，所以也会触发这个事件。

```html index.html
<body>
  <script src="./db.js"></script>
  <script>
    openDB("stuDB", 1);
  </script>
</body>
```

在 _index.html_ 文件中，我们引入了 _db.js_，然后调用了 _openDB_ 方法，效果如下图所示。

![image-20211201095341185](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-01-015341.png)

使用完数据库后，建议关闭数据库，以节约资源。

```js db.js
/**
 * 关闭数据库
 * @param {object} db 数据库实例
 */
function closeDB(db) {
  db.close();
  console.log("数据库已关闭");
}
```

如果要删除数据库，可以使用 _indexDB_ 的 _deleteDatabase_ 方法即可。

```js db.js
/**
 * 删除数据库
 * @param {string} dbName 数据库名称
 */
function deleteDBAll(dbName) {
  console.log(dbName);
  let deleteRequest = indexedDB.deleteDatabase(dbName);
  deleteRequest.onerror = function (event) {
    console.log("删除失败");
  };
  deleteRequest.onsuccess = function (event) {
    console.log("删除成功");
  };
}
```

### 插入数据

接下来是插入数据，我们仍然封装一个 _addData_ 方法，代码如下：

```js db.js
/**
 * 新增数据
 * @param {object} db 数据库实例
 * @param {string} storeName 对象仓库名称
 * @param {string} data 数据
 */
function addData(db, storeName, data) {
  let request = db
    .transaction([storeName], "readwrite") // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
    .objectStore(storeName) // 对象仓库
    .add(data);

  request.onsuccess = function (event) {
    console.log("数据写入成功");
  };

  request.onerror = function (event) {
    console.log("数据写入失败");
  };
}
```

_IndexedDB_ 插入数据需要通过**事务**来进行操作，插入的方法也很简单，利用 _IndexedDB_ 提供的 _add_ 方法即可，这里我们同样将插入数据的操作封装成了一个函数，接收三个参数，分别如下：

- _db_：在创建或连接数据库时，返回的 _db_ 实例，需要那个时候保存下来。
- _storeName_：仓库名称(或者表名)，在创建或连接数据库时我们就已经创建好了仓库。
- _data_：需要插入的数据，通常是一个对象。

接下来我们在 _index.html_ 中来测试。

```html
<body>
  <script src="./db.js"></script>
  <script>
    openDB("stuDB", 1).then((db) => {
      addData(db, "stu", { stuId: 1, stuName: "谢杰", stuAge: 18 });
      addData(db, "stu", { stuId: 2, stuName: "雅静", stuAge: 20 });
      addData(db, "stu", { stuId: 3, stuName: "谢希之", stuAge: 4 });
    });
  </script>
</body>
```

效果如下：

![image-20211201095402192](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-01-015402.png)

> 注意：插入的数据是一个对象，而且必须包含我们声明的索引键值对。

### 读取数据

读取数据根据需求的不同有不同的读取方式。

#### 通过主键读取数据

```js db.js
/**
 * 通过主键读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 对象仓库
 * @param {string} key 主键值
 */
function getDataByKey(db, storeName, key) {
  // 参数验证
  if (!db || !storeName || key === undefined) {
    return Promise.reject(new Error("参数无效"));
  }

  return new Promise((resolve, reject) => {
    let transaction = db.transaction([storeName], "readonly"); // 只读事务
    // 只读事务完成事件处理
    transaction.oncomplete = function () {
      console.log("事务完成");
    };

    // 事务失败事件处理
    transaction.onerror = function (event) {
      console.error("事务失败：", event.target.error);
      reject(event.target.error);
    };

    // 主键查询事件处理
    let objectStore = transaction.objectStore(storeName); // 获取对象仓库
    let request = objectStore.get(key); // 通过主键获取数据
    // 监听事件
    request.onsuccess = function (event) {
      resolve(request.result);
    };

    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}
```

在仓库对象上面调用 _get_ 方法从而通过主键获取数据。

```html
<body>
  <script src="./db.js"></script>
  <script>
    openDB("stuDB", 1)
      .then((db) => {
        addData(db, "stu", { stuId: 1, stuName: "谢杰", stuAge: 18 });
        addData(db, "stu", { stuId: 2, stuName: "雅静", stuAge: 20 });
        addData(db, "stu", { stuId: 3, stuName: "谢希之", stuAge: 4 });
        return getDataByKey(db, "stu", 2);
      })
      .then((stuInfo) => {
        console.log(stuInfo); // {stuId: 2, stuName: '雅静', stuAge: 20}
      });
  </script>
</body>
```

在 _index.html_ 中进行测试，调用上面封装的 _getDataByKey_ 方法，可以看到返回了主键 _stuId_ 为 _2_ 的学生数据。

#### 读取所有数据

仓库对象也提供了 _getAll_ 方法， 能够查询整张表的数据内容。

```js db.js
/**
 * 读取所有数据
 * @param {object} db 数据库实例
 * @param {string} storeName 对象仓库
 */
function getAllData(db, storeName) {
  // 参数验证
  if (!db || !storeName) {
    return Promise.reject(new Error("参数无效"));
  }

  return new Promise((resolve, reject) => {
    let transaction = db.transaction([storeName], "readonly"); // 只读事务
    // 只读事务完成事件处理
    transaction.oncomplete = function () {
      console.log("事务完成");
    };

    // 事务失败事件处理
    transaction.onerror = function (event) {
      console.error("事务失败：", event.target.error);
      reject(event.target.error);
    };

    // 主键查询事件处理
    let objectStore = transaction.objectStore(storeName); // 获取对象仓库
    let request = objectStore.getAll();
    // 监听事件
    request.onsuccess = function (event) {
      resolve(request.result);
    };

    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}
```

在 _index.html_ 中调用方法时就不需要再传递第三个参数作为 _key_ 了。

```js index.html
openDB("stuDB", 1)
  .then((db) => {
    addData(db, "stu", { stuId: 1, stuName: "谢杰", stuAge: 18 });
    addData(db, "stu", { stuId: 2, stuName: "雅静", stuAge: 20 });
    addData(db, "stu", { stuId: 3, stuName: "谢希之", stuAge: 4 });
    return getAllData(db, "stu");
  })
  .then((stuInfo) => {
    console.log(stuInfo); // 会查询到该表的所有数据
  });
```

#### 通过指针读取数据

还可以通过指针来进行查询，例如：

```js db.js
/**
 * 通过指针读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 */
function cursorGetData(db, storeName) {
  return new Promise((resolve, reject) => {
    let list = [];
    let store = db
      .transaction(storeName, "readwrite") // 事务
      .objectStore(storeName); // 对象仓库
    let request = store.openCursor(); // 指针对象
    // 指针开启成功，逐行读数据，只要指针有效，就一直读取触发success事件
    request.onsuccess = function (event) {
      let cursor = event.target.result; // 指针当前指向的数据
      if (cursor) {
        // 必须要检查
        list.push(cursor.value); // value存放当前数据
        cursor.continue(); // 移动到下一条数据，重新触发success回调，从而遍历了存储对象中的所有内容
      } else {
        resolve(list);
      }
    };
  });
}
```

在上面的代码中，我们通过仓库对象的 `openCursor` 方法开启了一个指针，这个指针会指向数据表的第一条数据，之后指针逐项进行偏移从而遍历整个数据表。

所以每次偏移拿到数据后，我们 _push_ 到 _list_ 数组里面，如果某一次没有拿到数据，说明已经读取完了所有的数据，那么我们就返回 _list_ 数组。

```js indx.html
openDB("stuDB", 1)
  .then((db) => {
    addData(db, "stu", { stuId: 1, stuName: "谢杰", stuAge: 18 });
    addData(db, "stu", { stuId: 2, stuName: "雅静", stuAge: 20 });
    addData(db, "stu", { stuId: 3, stuName: "谢希之", stuAge: 4 });
    return cursorGetData(db, "stu");
  })
  .then((stuInfo) => {
    console.log(stuInfo);
  });
```

目前为止，我们的精准查询只能通过主键来进行查询。但是更多的场景是我们压根儿就不知道某一条数据的主键。例如我们要查询学生姓名为“张三”的学生数据，对于我们来讲，我们知道的信息只有学生姓名“张三”。

此时我们就可以通过索引来查询数据。

#### 通过索引来读取数据

```js db.js
/**
 * 通过索引获取满足条件的第一条数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 */
function getDataByIndex(db, storeName, indexName, indexValue) {
  return new Promise((resolve, reject) => {
    let store = db.transaction(storeName, "readwrite").objectStore(storeName);
    let request = store.index(indexName).get(indexValue);
    request.onerror = function (event) {
      reject(event.target.error);
    };
    request.onsuccess = function (event) {
      let result = event.target.result;
      resolve(result);
    };
  });
}
```

在上面的方法中，我们通过仓库对象的 _index_ 方法传入了索引名称，然后链式调用 _get_ 方法传入索引的值来得到最终的查询结果。

```js index.html
openDB("stuDB", 1)
  .then((db) => {
    addData(db, "stu", { stuId: 4, stuName: "牛牛", stuAge: 4 });
    return getDataByIndex(db, "stu", "stuAge", 4);
  })
  .then((stuInfo) => {
    console.log(stuInfo); // {stuId: 3, stuName: '谢希之', stuAge: 4}
  });
```

在 _index.html_ 中我们新增了一条数据，年龄也为 _4_，当前的数据库表信息如下：

![image-20211201095425944](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-01-015426.png)

但是很奇怪的是我们查询出来的数据却只有第一条符合要求的。

如果我们想要查询出索引中满足某些条件的所有数据，可以将索引和游标结合起来。

#### 结合索引和游标读取所有满足条件的数据

```js db.js
/**
 * 通过索引和游标获取满足条件所有数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 */
function cursorGetDataByIndex(db, storeName, indexName, indexValue) {
  return new Promise((resolve, reject) => {
    let list = [];
    let store = db.transaction(storeName, "readwrite").objectStore(storeName); // 仓库对象
    let request = store
      .index(indexName) // 索引对象
      .openCursor(IDBKeyRange.only(indexValue)); // 指针对象
    request.onsuccess = function (event) {
      let cursor = event.target.result;
      if (cursor) {
        // 必须要检查
        list.push(cursor.value);
        cursor.continue(); // 继续遍历
      } else {
        resolve(list); // 遍历完成
      }
    };
    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}
```

在上面的方法中，我们仍然是**使用对象仓库的 _index_ 方法进行索引查询**，但是之后链式调用的时候不再是使用 _get_ 方法传入索引值，而是**调用了 _openCursor_ 来打开一个指针，并且让指针指向满足索引值的数据**，之后和前面一样，符合要求的数据推入到 _list_ 数组，最后返回 _list_ 数组。

当然，你可能很好奇 _IDBKeyRange_ 的 _only_ 方法是什么意思，除了 _only_ 方法还有其他方法么？

**_IDBKeyRange_ 对象代表对象仓库（_object store_）里面的一组主键。根据这组主键，可以获取对象仓库或索引里面的一组记录。**

_IDBKeyRange_ 可以只包含一个值，也可以指定上限和下限。它有四个静态方法，用来指定主键的范围。

- _IDBKeyRange.lowerBound( )_：指定下限。

- _IDBKeyRange.upperBound( )_：指定上限。

- _IDBKeyRange.bound( )_：同时指定上下限。

- _IDBKeyRange.only( )_：指定只包含一个值。

下面是一些代码实例。

```js
// All keys ≤ x
let r1 = IDBKeyRange.upperBound(x);

// All keys < x
let r2 = IDBKeyRange.upperBound(x, true);

// All keys ≥ y
let r3 = IDBKeyRange.lowerBound(y);

// All keys > y
let r4 = IDBKeyRange.lowerBound(y, true);

// All keys ≥ x && ≤ y
let r5 = IDBKeyRange.bound(x, y);

// All keys > x &&< y
let r6 = IDBKeyRange.bound(x, y, true, true);

// All keys > x && ≤ y
let r7 = IDBKeyRange.bound(x, y, true, false);

// All keys ≥ x &&< y
let r8 = IDBKeyRange.bound(x, y, false, true);

// The key = z
let r9 = IDBKeyRange.only(z);
```

例如我们来查询年龄大于 _4_ 岁的学生，其代码片段如下：

```js db.js
function cursorGetDataByIndex(db, storeName, indexName, indexValue) {
    return new Promise((resolve, reject) => {
        ...
        let request = store
            .index(indexName) // 索引对象
            .openCursor(IDBKeyRange.lowerBound(indexValue, true)); // 指针对象
        ...
    })

}
```

**利用索引和游标结合查询，我们可以查询出索引值满足我们传入函数值的所有数据对象，而不是只查询出一条数据或者所有数据。**

#### 分页查询数据

_IndexedDB_ 分页查询不像 _MySQL_ 分页查询那么简单，没有提供现成的 _API_，如 _limit_ 等，所以需要我们自己实现分页。

```js db.js
/**
 * 通过索引和游标分页查询记录
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 * @param {number} page 页码
 * @param {number} pageSize 查询条数
 */
function cursorGetDataByIndexAndPage(
  db,
  storeName,
  indexName,
  indexValue,
  page,
  pageSize
) {
  return new Promise((resolve, reject) => {
    let list = []; // 用于存储当前页的分页数据
    let counter = 0; // 计数器
    let isPass = true; // 是否跳过多少条查询
    let store = db.transaction(storeName, "readwrite").objectStore(storeName); // 对象仓库
    let request = store
      // .index(indexName) // 索引对象
      // .openCursor(IDBKeyRange.only(indexValue)); // 按照指定值分页查询（配合索引）
      .openCursor(); // 指针对象
    request.onsuccess = function (event) {
      let cursor = event.target.result;
      // 判断是否要跳过一些数据
      if (page > 1 && isPass) {
        isPass = false;
        cursor.advance((page - 1) * pageSize); // 跳过多少条数据
        return;
      }
      if (cursor) {
        // 必须要检查
        list.push(cursor.value);
        counter++; // 计数
        if (counter < pageSize) {
          cursor.continue(); // 遍历了存储对象中的所有内容
        } else {
          cursor = null;
          resolve(list);
        }
      } else {
        resolve(list);
      }
    };
    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}
```

这里用到了 _IndexedDB_ 的一个 _API_：_advance_。

**该函数可以让我们的游标跳过多少条开始查询。**假如我们的额分页是每页 _5_ 条数据，现在需要查询第 _2_ 页，那么我们就需要跳过前面 _5_ 条数据，从第 _6_ 条数据开始查询，直到计数器等于 _5_，那么我们就关闭游标，结束查询。

下面在 _index.html_ 中进行测试如下：

```html
<body>
  <script src="./db.js"></script>
  <script>
    openDB("stuDB", 1)
      .then((db) => {
        addData(db, "stu", { stuId: 5, stuName: "张三", stuAge: 23 });
        addData(db, "stu", { stuId: 6, stuName: "李四", stuAge: 24 });
        addData(db, "stu", { stuId: 7, stuName: "王武", stuAge: 32 });
        addData(db, "stu", { stuId: 8, stuName: "刘德华", stuAge: 34 });
        addData(db, "stu", { stuId: 9, stuName: "张学友", stuAge: 28 });
        addData(db, "stu", { stuId: 10, stuName: "郭富城", stuAge: 27 });
        addData(db, "stu", { stuId: 11, stuName: "黎明", stuAge: 17 });
        addData(db, "stu", { stuId: 12, stuName: "邓超", stuAge: 19 });
        addData(db, "stu", { stuId: 13, stuName: "刘翔", stuAge: 15 });
        addData(db, "stu", { stuId: 14, stuName: "洋洋", stuAge: 12 });
        addData(db, "stu", { stuId: 15, stuName: "林佳音", stuAge: 14 });
        addData(db, "stu", { stuId: 16, stuName: "袁进", stuAge: 34 });
        addData(db, "stu", { stuId: 17, stuName: "老闫", stuAge: 36 });
        addData(db, "stu", { stuId: 18, stuName: "沈爷", stuAge: 34 });
        return cursorGetDataByIndexAndPage(db, "stu", "", "", 3, 5);
      })
      .then((stuInfo) => {
        console.log(stuInfo);
      });
  </script>
</body>
```

在上面的代码中，我们为了实现分页效果，添加了一些数据。然后查询第 _3_ 页的内容。

![image-20211201095452722](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-01-015453.png)

查询结果如下：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-01-015510.png" alt="image-20211201095509714" style="zoom:50%;" />

### 更新数据

_IndexedDB_ 更新数据较为简单，直接使用 _put_ 方法，值得注意的是**如果数据库中没有该条数据，则会默认增加该条数据，否则更新。**

有些小伙伴喜欢更新和新增都是用 _put_ 方法，这也是可行的。

```js db.js
/**
 * 根据主键更新数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {object} data 数据
 */
function updateDB(db, storeName, data) {
  return new Promise((resolve, reject) => {
    let request = db
      .transaction([storeName], "readwrite") // 事务对象
      .objectStore(storeName) // 仓库对象
      .put(data); // 根据主键

    request.onsuccess = function () {
      resolve({
        status: true,
        message: "更新数据成功",
      });
    };

    request.onerror = function () {
      reject({
        status: false,
        message: "更新数据失败",
      });
    };
  });
}
```

在上面的方法中，我们使用仓库对象的 _put_ 方法来修改数据，所以在调用该方法时，需要传入整条数据对象，特别是主键。**因为是通过主键来查询到要修改的数据。如果传入的数据没有主键，则是一个新增数据的效果。**

```js index.html
openDB("stuDB", 1)
  .then((db) => {
    return updateDB(db, "stu", { stuId: 1, stuName: "谢杰2", stuAge: 19 });
  })
  .then(({ message }) => {
    console.log(message);
  });
```

效果如下：

![image-20211201095532213](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-01-015532.png)

### 删除数据

删除数据这里记录 _2_ 种方式，一个是**通过主键**来进行删除。

```js db.js
/**
 * 通过主键删除数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {object} id 主键值
 */
function deleteDB(db, storeName, id) {
  return new Promise((resolve, reject) => {
    let request = db
      .transaction([storeName], "readwrite")
      .objectStore(storeName)
      .delete(id);

    request.onsuccess = function () {
      resolve({
        status: true,
        message: "删除数据成功",
      });
    };

    request.onerror = function () {
      reject({
        status: true,
        message: "删除数据失败",
      });
    };
  });
}
```

```js index.html
openDB("stuDB", 1)
  .then((db) => {
    return deleteDB(db, "stu", 1);
  })
  .then(({ message }) => {
    console.log(message);
  });
```

执行上面的代码后 _stuId_ 为 _1_ 的学生被删除掉。

有时候我们拿不到主键值，只能**只能通过索引值来删除**。通过这种方式，我们可以删除一条数据（索引值唯一）或者所有满足条件的数据（索引值不唯一）。

```js db.js
/**
 * 通过索引和游标删除指定的数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名
 * @param {object} indexValue 索引值
 */
function cursorDelete(db, storeName, indexName, indexValue) {
  return new Promise((resolve, reject) => {
    let store = db.transaction(storeName, "readwrite").objectStore(storeName);
    let request = store
      .index(indexName) // 索引对象
      .openCursor(IDBKeyRange.only(indexValue)); // 指针对象
    request.onsuccess = function (event) {
      let cursor = event.target.result;
      let deleteRequest;
      if (cursor) {
        deleteRequest = cursor.delete(); // 请求删除当前项
        deleteRequest.onsuccess = function () {
          resolve({
            status: true,
            message: "游标删除该记录成功",
          });
        };
        deleteRequest.onerror = function () {
          reject({
            status: false,
            message: "游标删除该记录失败",
          });
        };
        cursor.continue();
      }
    };
    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}
```

```js index.html
openDB("stuDB", 1)
  .then((db) => {
    return cursorDelete(db, "stu", "stuName", "雅静");
  })
  .then(({ message }) => {
    console.log(message);
  });
```

在上面的示例中，我们就删除了所有 _stuName_ 值为 “雅静” 的同学。

---

以上，就是关于 _IndexedDB_ 的基本操作。

可以看到，在了解了它的几个基本概念后，上手还是比较容易的。

另外由于 _IndexedDB_ 所提供的原生 _API_ 比较复杂，所以现在也出现了基于 _IndexedDB_ 封装的库。例如 _[Dexie.js](https://dexie.org/)_。

![image-20211201095555138](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-01-015556.png)

该库和 _IndexedDB_ 之间的关系，就类似于 _jQuery_ 和 _JavaScript_ 之间的关系。有兴趣的同学可以自行进行研究，这里就不再做过多的赘述。

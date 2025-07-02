# keepalive生命周期

keep-alive 这个词借鉴于 HTTP 协议。在 HTTP 协议中，KeepAlive 被称之为 **HTTP持久连接（HTTP persistent connection）**，其作用是允许多个请求或响应共用一个 TCP 连接。

在没有 KeepAlive 的情况下，一个 HTTP 连接会在每次请求/响应结束后关闭，当下一次请求发生时，会建立一个新的 HTTP 连接。频繁地销毁、创建 HTTP 连接会带来额外的性能开销，KeepAlive 就是为了解决这个问题而诞生的。

HTTP 中的 KeepAlive 可以避免连接频繁地销毁/创建，与 HTTP 中的 KeepAlive 类似，Vue 里面的 keep-alive 组件也是用于**对组件进行缓存，避免组件被频繁的销毁/重建**。

**回顾基本使用**

简单回忆一下 keep-alive 的使用

```html
<template>
    <Tab v-if="currentTab === 1">...</Tab>
    <Tab v-if="currentTab === 2">...</Tab>
    <Tab v-if="currentTab === 3">...</Tab>
</template>
```

根据变量 currentTab 值的不同，会渲染不同的 <Tab> 组件。当用户频繁地切换 Tab 时，会导致不停地卸载并重建 <Tab> 组件。为了避免因此产生的性能开销，可以使用 keep-alive 组件来解决这个问题：

```html
<template>
    <keep-alive>
    <Tab v-if="currentTab === 1">...</Tab>
        <Tab v-if="currentTab === 2">...</Tab>
        <Tab v-if="currentTab === 3">...</Tab>
  </keep-alive>
</template>
```

这样，无论用户怎样切换 <Tab> 组件，都不会发生频繁的创建和销毁，因为会极大的优化对用户操作的响应，尤其是在大组件场景下，优势会更加明显。

另外 keep-alive 还可以设计一些属性来进行细节方面的把控：

- include：指定要缓存的组件，支持的书写方式有**字符串、正则表达式、数组**
- exclude：排除不缓存的组件
- max：指定最大缓存组件数。如果缓存的实例数量即将超过指定的那个最大数量，则最久没有被访问的缓存实例将被销毁，以便为新的实例腾出空间。

**keep-alive生命周期**

当一个组件挂载以及卸载的时候，是会触发相关的生命周期钩子方法。

当我们从组件 A 切换到组件 B 时，会依次触发：

- 组件 A beforeUnmount
- 组件 B created
- 组件 B beforeMount
- 组件 A unmounted
- 组件 B mounted

这就是没有使用 keep-alive 缓存的情况，组件频繁的创建、销毁，性能上面会有损耗。

当我们添加 keep-alive 之后，组件得以缓存。但是这也带来一个新的问题，就是我们不知道该组件是否处于激活状态。比如某些场景下，我们需要组件激活时执行某些任务，但是因为目前组件被缓存了，上面的那些生命周期钩子方法都不会再次执行了。

此时，和 keep-alive 相关的两个生命周期钩子方法可以解决这个问题：

- onActivated：首次挂载，以及组件激活时触发
- onDeactivated：组件卸载，以及组件失活时触发

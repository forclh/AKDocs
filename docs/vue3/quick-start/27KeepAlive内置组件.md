# KeepAlive内置组件

在 Vue 中也提供了一些内置组件，例如：

- Transition
- TransitionGroup
- KeepAlive
- Teleport
- Suspense

**component元素**

component **并非组件**，而是和 slot、template 等元素类似的一种特殊元素，这种元素是模板语法的一部分。但它们并非真正的组件，同时在模板编译期间会被编译掉。因此，它们通常在模板中用小写字母书写。

component 用于渲染动态组件，具体渲染的组件取决于 is 属性

文档地址：https://cn.vuejs.org/api/built-in-special-elements.html#component

**KeepAlive基本使用**

KeepAlive 是一个**内置组件**，该组件的主要作用是**缓存组件的状态**。

关键代码如下：

App.vue

```html
<router-view v-slot="{ Component }">
  <keep-alive>
    <component :is="Component" />
  </keep-alive>
</router-view>
```

router-view 组件通过作用域插槽拿到一个和当前路由所匹配的组件，然后将这个组件用于 component 元素的 is 属性。

最为关键的就是 component 元素外边包裹了 keep-alive 内置组件，该组件让状态得以保留。

**KeepAlive相关细节**

KeepAlive 是一个内置组件，该组件的主要作用是缓存组件的状态。

使用 KeepAlive 来保持组件状态的之后，可以使用**包含(include)/排除(exclude)**关键字来指定要缓存的组件，这两个 prop 的值都可以是一个以英文逗号分隔的字符串、一个正则表达式，或是包含这两种类型的一个数组：

```html
<!-- 以英文逗号分隔的字符串 -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- 正则表达式 (需使用 v-bind) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- 数组 (需使用 v-bind) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

例如：

```html
<router-view v-slot="{ Component }">
  <keep-alive include="Counter,Timer">
    <component :is="Component" />
  </keep-alive>
</router-view>
```

以英文逗号分隔的时候，注意中间不要添加空格。

还可以接收一个 max 属性，用于**指定最大缓存组件数**。如果缓存的实例数量即将超过指定的那个最大数量，则最久没有被访问的缓存实例将被销毁，以便为新的实例腾出空间。

```html
<router-view v-slot="{ Component }">
  <keep-alive :max="3">
    <component :is="Component" />
  </keep-alive>
</router-view>
```


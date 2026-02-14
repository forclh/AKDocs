## moduleResolution

在typescript5.x中，`moduleResolution`可以取值：

```shell
classic
node10/node
node16
nodenext
bundler
```

`classic`只是 `tsc`自身默认的模块寻找方式，但这个方式已经不常用了。这里就不纠结了

### node10/node

`tsc`会仿照早期 nodejs 的方式寻找模块。

简单来说，如果是相对路径，如果发现有文件，就会帮你补全`.js`后缀路径，如果没有，就再此查找有没有这个路径的文件夹，查找这个文件夹下的index.js文件

如果是`bare import`路径，那么就去查找`node_modules`路径，并且依次向上层追溯`node_modules`直到最顶层为止。

不过，需要注意的是，我们现在是typescript的配置，所以，这里又会有一些区别。

比如，在项目中，`/src/index.ts`相对路径引入`./myModule`(注意这其实还会受到`tsconfig.json`的配置`include`影响，以及`package.json`中一些其他配置的影响，这里就暂时不考虑了)

```shell
依次寻找:

/src/myModule.ts

/src/myModule.tsx

/src/myModule.d.ts

/src/myModule/package.json(访问 "types" 字段)

/src/myModule/index.ts

/src/myModule/index.tsx

/src/myModule/index.d.ts
```

这仅仅是相对路径的情况，如果是**bare import**引入第三方包的情况，就更加复杂，

```typescript
npm i axios
```

```typescript
import axios from "axios"
```

在module是ES6的情况下，如果没有指定`moduleResolution`这里就会报错，因为默认只是`classic`,我们最好指定为`moduleResolution:node`

```shell
Cannot find module 'axios'......
```



比如`/src/index.ts`引入`import axios from 'axios'`

```shell
/src/node_modules/axios.ts

/src/node_modules/axios.tsx

/src/node_modules/axios.d.ts

/src/node_modules/axios/package.json(访问"types"字段)

/src/node_modules/@types/axios.d.ts

/src/node_modules/axios/index.ts

/src/node_modules/axios/index.tsx

/src/node_modules/axios/index.d.ts

如果当前目录没找到，继续向上再来一次

/node_modules/axios.ts

/node_modules/axios.tsx

/node_modules/axios.d.ts

/node_modules/axios/package.json(访问"types"字段)

/node_modules/@types/axios.d.ts

/node_modules/axios/index.ts

/node_modules/axios/index.tsx

/node_modules/axios/index.d.ts

如果当前目录没找到，继续向上再来一次......
......
```



> **当然，你一定要清楚两件事情**：
>
> **1、相对路径在`.ts`代码中不报错，不一定在`.js`代码中就能运行**
>
> 我们现在配置的`tsconfig.json`是关联的typescript的编译环境，也就是说，确保在typescript的环境中不会报出错误，但是并不是说编译成js文件之后就是一定正确，能在node环境中直接运行的代码。
>
> 比如，如果设置为`module:ES6`，`moduleResolution:node`，这在编写typescript代码的时候确实可能没有什么问题，当模块的后缀名没有写的时候，不会有提示。如果我们是在有打包器的环境中，这不是什么问题。但是现在我们是直接在node环境中，当编译为`.js`代码之后，会找不到不带具体后缀的路径模块。
>
> 这就是我们上面说的typescript不会去处理模块说明符，其实要追根究底原因也很简单，那是因为早期 nodejs 是不支持 esModule 风格的代码，当然tsc在编译的时候，就不会对引用的路径自动做调整
>
> 所以，**为了减少歧义，如果`moduleResolution:node`，那么`module`字段最好要设置为`CommonJS`**
>
> **2、我们通过`.ts`关联的都是`.ts`或者`.d.ts`文件**
>
> 我们可能有时候会习惯性的认为当我按住**ctrl（command）+ 左键点击**的时候，就应该进入程序的具体实现中，但是，你会发现，大多数我们点击过去，进入的都是类型声明文件中，特别是在第三方包中，一是因为typescript的模块解析就是只找`.ts`和`.d.ts`文件，另外就是很多第三方包都是`.js+.d.ts类型声明文件`的方式，所以我们一般关联过去的都是`index.d.ts`文件，当然甚至有时候我们进入的是[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)的@types文件夹

### Node16 or NodeNext

`tsc`按照新版本 node 的方式寻找模块。

新 `node` 下，`esModule` 和 `commonJS` 都是支持的。

所以，这里解释起来就费劲了...因为需要区分两种不同的`module`取值的情况，因此，**在最新版本的typescript中，就直接做出了限定，如果`moduleResolution`的值是`Node16` 或者 `NodeNext`，那么`module`也只能在这两个值中选择**

而且，由于`Node16` or `NodeNext`是支持ESM的，所以，无论是commonjs还是es module，**如果没有跟随后缀，会直接提示错误**，（**注意：package.json文件中配置了"type": "module"会有如下提示**）：

```shell
import { show } from "./myModule"; // error

Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './myModule.js'?
```

所以，我们必须给上后缀，但是，根据我们理所应当的想法，这里加后缀的话，要加也应该是`./myModule.ts`，但是加上`.ts`后缀之后，同样报错：

```shell
An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled.ts(5097)
```

意思是让你加上`allowImportingTsExtensions:true`，但是在tsconfig.json中加上这个属性同样报错：

```shell
Option 'allowImportingTsExtensions' can only be used when either 'noEmit' or 'emitDeclarationOnly' is set.
```

意思是`allowImportingTsExtensions`这个属性，只能在`noEmit`或者`emitDeclarationOnly`属性为true的时候才能起作用。

`"noEmit":true`意思是不要生成`.js`文件

`"emitDeclarationOnly":true`意思是只生成`.d.ts`类型声明文件，不生成`.js`文件，当然这个属性还依赖于`"declaration": true`要打开

无论怎么样，也就是说，你要在模块引入中加上`.ts`后缀不是不行，但是不要生成`.js`文件，因为很容易造成误解。

所以，这里要加上后缀只能按照提示加上`./myModule.js`

**这是因为typescript的模块说明符只会原封不动的转译**，

### Typescript不会处理模块说明符

> **typescript不是也会编译.ts文件吗？typescript不会自动帮我们加上后缀吗？**
>
> **Typescript不会处理模块说明符**
>
> 是的，这个问题非常的关键，无论是Commonjs还是ESM，typescript并不会帮我们去转译任何的**模块说明符**(ESM模块化import xxx from后面的字符串，Commonjs中require里面的字符串)
>
> import { add } from **"./math.mjs"**;
>
> import { add } from **"./math.js"**;
>
> import { add } from **"./math.mts"**;
>
> import { add } from **"./math.ts"**;
>
> const math_1 = require(**"./math.mjs"**);
>
> ......

也就是你写成`"./myModule.ts"`，编译出来的还是`"./myModule.ts"`这样在node环境中同样运行不了，而写的是 `''./myModule.js"` 输出的 还是 `"./myModule.js"`

虽然在一个ts文件中，突然引入了一个`.js`的后缀，你会感觉有点突兀，但是其实这正是typescript处于类型安全的一个考虑。毕竟我们还能通过`outdir`属性去`.js`配置生成之后的路径。考虑到输出文件中的模块说明符将与输入文件中的模块说明符相同的约束， 正好验证了输出文件和输入文件的类型分配地址是统一的。

### main/module/unpkg/types与exports

其他的模块解析过程`Node16` or `NodeNext`与`node`的方式基本一致，只不过新支持了在`package.json`文件的新的字段`exports`。

当然要理解`exports`，首先要理解**`main`/`module`/`unpkg`/`types`**

先看看axios中[**package.json**](https://cdn.jsdelivr.net/npm/axios@1.6.7/package.json)的声明：

```json
{
	"main": "index.js",
  "exports": {
    ".": {
      "types": {
        "require": "./index.d.cts",
        "default": "./index.d.ts"
      },
      "browser": {
        "require": "./dist/browser/axios.cjs",
        "default": "./index.js"
      },
      "default": {
        "require": "./dist/node/axios.cjs",
        "default": "./index.js"
      }
    },
    ......
  },
  "type": "module",
  "types": "index.d.ts",
  "jsdelivr": "dist/axios.min.js",
  "unpkg": "dist/axios.min.js",
  ......  
}
```

**`main`** 我们知道是指定程序入口的字段，它是 CommonJS 时代的产物，也是最古老且最常用的入口文件。

随着 ESM 且打包工具的发展，许多 package 会打包 N 份模块化格式进行分发，如 `antd` 既支持 `ESM`，也支持 `Commonjs`，这个时候就出现了**`module`**字段。上面的axios没有这个字段，可以看看其他的库：

[vue的package.json](https://cdn.jsdelivr.net/npm/vue@3.4.9/package.json)

[antd的package.json](https://cdn.jsdelivr.net/npm/antd@5.12.8/package.json)

如果使用 `import` 对该库进行导入，则首次寻找 `module` 字段引入，否则引入 `main` 字段。

也就是说，`module` 字段作为 `es module` 入口，`main` 字段作为 `commonjs` 入口。

当然，如果这个第三方包还想提供`CDN`的引用，还有一些比如**`unpkg`**，**`jsdelivr`**这样的字段。主要是指定方便网页直接引用的文件。

这些都是指定可运行的js文件，如果要指定类型文件，那就需要**`types`**字段

**`exports`**这个字段对我们来说是相当好用的，一个比较好的形容就是这个字段就像一把瑞士军刀，可以很灵活的来为不同的环境公开你的模块，同时限制对其内部部分的访问。所以这个字段还有一个称呼就是`export map`，意思是可以把你希望对外暴露的模块像使用map一样，很方便的进行映射。

不过`exports`里面的语法和细节还有很多，大部分情况下我们不需要去研究里面的细节，除非你现在就想自己去写一个库或者框架。大概看一下这些库的`exports`字段，大概也能了解，其实就是将不同环境的`.js`文件和`.d.ts`文件直接结合起来了，甚至可以指定子目录。

当然，对于我们现在来说，最重要的，其实是exports中指定的类型声明的优先级，是高于types中指定的类型声明的。

所以最后，我想说的是，`Node16` or `NodeNext`对比`node`的模块解析策略，也就是在解析模块在读取`package.json`的时候多了`exports`这一块，而`exports`读取的优先级高于`types`，如果我们引入是第三方包，大致模块解析过程如下：

```shell
/src/node_modules/axios.ts

/src/node_modules/axios.tsx

/src/node_modules/axios.d.ts

/src/node_modules/axios/package.json(优先访问"exports"字段，后访问"types"/"main"/"module"字段)

/src/node_modules/@types/axios.d.ts

/src/node_modules/axios/index.ts

/src/node_modules/axios/index.tsx

/src/node_modules/axios/index.d.ts

如果当前目录没找到，继续向上再来一次

/node_modules/axios.ts

/node_modules/axios.tsx

/node_modules/axios.d.ts

/node_modules/axios/package.json(优先访问"exports"字段，后访问"types"/"main"/"module"字段)

/node_modules/@types/axios.d.ts

/node_modules/axios/index.ts

/node_modules/axios/index.tsx

/node_modules/axios/index.d.ts

如果当前目录没找到，继续向上再来一次......
......
```


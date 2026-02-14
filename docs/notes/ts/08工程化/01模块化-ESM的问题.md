## 模块的编译结果

**src/index.ts**

```typescript
import { show } from "./myModule";
show(); 
```

**src/myModule.ts**

```typescript
export function show() { 
  console.log("show")
}
```

当没有配置tsconfig的时候，直接使用命令 `tsc src/index.ts` 也能帮助我们编译模块化的代码，最后的结果大致为：

```typescript
// index.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var myModule_1 = require("./myModule");
(0, myModule_1.show)(); 

// myModule.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.show = void 0;
function show() {
	console.log("show:");
}
exports.show = show;
```

代码很明显是处理了为了`commonjs`模块化，因为默认`target`是`es3`，当`target`是`es3/es5`的时候，默认使用的模块化就是`commonjs`，也就是配置属性就是`module:commonjs`。

使用`tsc --init`生成`tsconfig.json`配置文件之后，默认生成的`target`是`es2016`，`module`是`commonjs`。

当然这些大家都能知道，就会以为，在typescript中，模块化是个小case，实际上，他是一个大boss，如果我们基础知识稍微有那么一点不牢固，就会给我们带来很多困扰。因为模块化还涉及到一个很基础，但是非常复杂的基础知识点，模块解析策略，再加上typescript给我们的一些干扰，会导致有时候出现了问题不知道如何排查。

来吧，我们看看会出现哪些问题：

## module

首先在typescript5.x的版本中，module能取如下的值：

```shell
none
commonjs
amd
umd
system
es6/es2015
es2020
es2022
esnext
node16
nodenext
```

## 默认值

当`target`取值为`ES3`或者`ES5`的时候，`module`的值默认为`commonjs`

当`target`取值为其他的时候，`module`的值默认为`ES6/ES2015 module`

在有打包器环境中，也就是有webpack，vite等大家常用的项目中，可能你知道commonjs和ESM的区别，但你并不会怎么留意这两个的一些细节。

## ES6 模块化所引发的问题

首先通过`tsc --init` 生成默认的`tsconfig.json`文件

```typescript
{
  "compilerOptions": {
    "target": "es2016",                                  
    "module": "commonjs",                                
    "outDir": "./dist",  // 编译后.js文件的位置                                 
    "esModuleInterop": true,                             
    "forceConsistentCasingInFileNames": true,            
    "strict": true,                                      
    "skipLibCheck": true                                 
  }
}
```

直接运行`tsc`,在dist目录下生成了编译之后的`index.js`文件和`myModule.js`文件。运行命令 `node dist/index.js`，是可以执行的。

如果注释`"module": "commonjs"`之后，生成的.js文件，很明显不再是commonjs模块化的了，而是支持ESM的。因为这时候`module`取值是默认的`ES6`，但是，这个时候我们是不能直接通过node运行的。

```shell
(node:15598) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.
(Use `node --trace-warnings ...` to show where the warning was created)
/Users/yingside/Desktop/ts/test4/dist/index.js:1
import { show } from "./myModule";
^^^^^^
......
```

虽然在 Node.js 中(>=12.20 版本)可以使用原生 ES Module，但必须遵循下面的规则。

- 文件以 `.mjs` 结尾；
- package.json 中声明`type: "module"`。

我们可以根据上面的两个规则，自行更改，这里当然最好是直接更改`package.json`，修改`.mjs`结尾的话，还需要将`.ts`文件修改为`.mts`，编译的时候才会自动编译为`.mjs`，这还会引发其他的一些问题，我们暂时不考虑。

但是就算是`package.json` 中加上了`type: "module"`了之后，运行还是报错：

```shell
node:internal/errors:496
    ErrorCaptureStackTrace(err);
    ^

Error [ERR_MODULE_NOT_FOUND]:......
```



当然了，你可以说我干脆不在node中运行还不行吗？我自己写个html页面，拿到浏览器中运行

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
</body>
<!-- 
  type="module" 会默认产生跨域请求，而file协议并不支持。
  可以使用 vscode 插件 Live Server 来启动一个本地服务器
-->  
<script type="module" src="index.js"></script>
</html>
```

其实还是报错:

```shell
Failed to load resource: the server responded with a status of 404 (Not Found)
```

`404`已经说的很明显了，找不到`myModule`啊。
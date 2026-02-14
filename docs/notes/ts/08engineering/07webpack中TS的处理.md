## 相关TS代码

**randomNumber.ts**

```typescript
const randomNumber = (min: number, max: number): number => {
  let num = Math.floor(Math.random() * (min - max) + max);
  return num;
}
export default randomNumber;
```

**index.ts**

```typescript
import randomNumber from "./randomNumber.ts";
console.log(randomNumber(1, 100));
export default { randomNumber };
```

## webpack依赖与基本设置

```shell
npm i webpack webpack-cli -D
```

**webpack.config.js**

```typescript
const path = require('path')
/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode:"development",
  entry: path.resolve(__dirname, './src/index.ts'), // 入口文件
  output: {
    path: path.resolve(__dirname, './dist'), // 打包后的目录
    filename: '[name].[contenthash:6].js', // 打包后的文件
    clean: true, // 清理打包目录 /dist 文件夹
    publicPath: "/"
  },
  resolve: {
    // 引入文件时不需要加后缀。
    extensions: ['.ts', '.js', '.json'],
  }
}
```

## tsconfig.json基本配置

```typescript
{
  "compilerOptions": {
    "target": "es2016",                                 
    "module": "ESNext",
    "moduleResolution": "node",
    "noEmit": true,
    "allowImportingTsExtensions": true,                           
    "esModuleInterop": true,                             
    "forceConsistentCasingInFileNames": true,            
    "strict": true,                                      
    "skipLibCheck": true,             
  },
  "include": ["src/**/*.ts","src/**/*.d.ts"]
}
```

webpack运行命令：

```typescript
npx webpack -c webpack.config.js
```

当然也能直接配置到`script`脚本中

```typescript
"scripts": {
	"build": "webpack -c webpack.config.js"
},
```



## ts-loader安装

webpack本身并不能支持处理ts文件，因此需要`ts-loader`支持

```typescript
npm i typescript ts-loader -D
```

配置：

```typescript
const path = require('path')
/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode:"development",
  entry: path.resolve(__dirname, './src/index.ts'), // 入口文件
  output: {
    path: path.resolve(__dirname, './dist'), // 打包后的目录
    filename: '[name].[contenthash:6].js', // 打包后的文件
    clean: true, // 清理打包目录 /dist 文件夹
    publicPath: "/"
  },
  resolve: {
    // 引入文件时不需要加后缀。
    // 这里只配置vue,ts,js和json, 其他文件引入都要求带后缀，可以稍微提升构建速度
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true, // 关闭类型检查，即只进行转译，不进行类型检查 
            }
          }
        ],
      }
    ]
  }
}
```

## babel预设

```typescript
npm i babel-loader @babel/core @babel/preset-env -D
```

配置：

```typescript
const path = require('path')
/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode:"development",
  entry: path.resolve(__dirname, './src/index.ts'), // 入口文件
  output: {
    path: path.resolve(__dirname, './dist'), // 打包后的目录
    filename: '[name].[contenthash:6].js', // 打包后的文件
    clean: true, // 清理打包目录 /dist 文件夹
    publicPath: "/"
  },
  resolve: {
    // 引入文件时不需要加后缀。
    // 这里只配置vue,ts,js和json, 其他文件引入都要求带后缀，可以稍微提升构建速度
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true, // 关闭类型检查，即只进行转译，不进行类型检查 
            }
          }
        ],
      }
    ]
  }
}
```

## babel的ts预设

```typescript
npm i @babel/preset-typescript -D
```

配置：

```typescript
const path = require('path')
/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode:"development",
  entry: path.resolve(__dirname, './src/index.ts'), // 入口文件
  output: {
    path: path.resolve(__dirname, './dist'), // 打包后的目录
    filename: '[name].[contenthash:6].js', // 打包后的文件
    clean: true, // 清理打包目录 /dist 文件夹
    publicPath: "/"
  },
  resolve: {
    // 引入文件时不需要加后缀。
    // 这里只配置vue,ts,js和json, 其他文件引入都要求带后缀，可以稍微提升构建速度
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          // {
          //   loader: 'ts-loader',
          //   options: {
          //     transpileOnly: true, // 关闭类型检查，即只进行转译，不进行类型检查 
          //   }
          // },
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  "@babel/preset-typescript",
                  {
                    allExtensions: true, 
                  },
                ],
              ]
            }
          }
        ],
      }
    ]
  }
}
```




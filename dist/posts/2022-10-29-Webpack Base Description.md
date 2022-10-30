<!-- ---
title: Webpack系列之基本概念
date: 2022-10-29
tags: Webpack系列
set: WebpackBase
--- -->

Webpack是一种前端资源构建工具，一个静态模块打包器，在webpack看来，前端的所有资源文件(`js`/`json`/`css`/`img`/`less`...)都会作为模块处理。它将根据模块的依赖关系进行静态分析，打包生成对应的静态资源。

#### 1. webpack五个核心概念

* **Entry**：指示`webpack`以哪个文件为入口起点开始打包，分析构建内部依赖图
* **Output**：指示`webpack`打包后的资源`bundles`输出到哪里，以及如何命名
* **Loader**：`webpack`只能理解`Javascript`和`Json`文件，这是`webpack`开箱可用的自带能力，`loader`让`webpack`能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用，以及被添加到依赖图中
* **Plugins**：可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量等。
* **Mode**：指定`webpack`使用相应模式的配置
  * **development**：能让代码本地调试的开发环境
  * **production**：能让代码优化上线运行的生产环境，生产环境比开发环境多一个压缩`js`代码

#### 2. webpack配置文件

```javascript
const { resolve } = require('path')

module.exports = {
    entry: './src/index.js', 
    output: {
        filename: 'build.js',
        path: resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    },
    plugins: [],
    module: 'development'
}
```
需要特别注意的是`loader`的执行顺序，`loader`的执行是从右到左，从下到上的，例如解析`less`文件，要先`less-loader`、`css-loader`到`style-loader`
<!-- ---
title: Webpack系列之包管理工具
date: 2022-11-01
tags: Webpack系列
set: WebpackBase
--- -->

这篇文章中针对`npm`、`pnpm`和`yarn`等主流的包管理工具进行分析和总结

### 一. npm 

**npm**是node.js自带的包管理器。它不仅作为包管理工具，在前端项目中我们也经常使用`npm`来管理我们的项目依赖。`npm`是围绕着**语义版本控制**的思想来设计的，使用一个名为`package.json`的文件，用户可以通过`npm install --save`命令把项目里所有的依赖保存在这个文件中。`npm`会依照`package.json`中的配置逐步加载对应版本的依赖包。

#### 1. npm存放的包在哪里

**npm**的包实际上是存放在`registry`里面的，我们自己发布的包也会保存在`registry`当中，当我们通过`npm`安装某个包的时候，其实是`npm`从`registry`中下载的

#### 2. npm版本缺陷

我们在`package.json`中会看到一些版本记录，
* `x.y.z`：表示一个明确的版本号
* `^x.y.z`：表示`x`的版本保持不变，`y`和`z`永远是最新的
* `~x.y.z`：表示`x`和`y`的版本保持不变，`z`永远是最新的

一般新版本是向下兼容的，安装最新版本是可以兼容旧版的。即使不同的开发人员使用了相同的`package.json`文件，在他们自己的机器上也可能会安装同一个库的不同版本，就会出现潜在的难以调试的错误。因此`npm`中的`package.json`中的依赖无法保持版本一致的缺陷，并且`npm`依赖很多的库，会导致嵌套依赖关系，增加无法匹配响应版本的几率。

**解决版本缺陷的问题**
* `npm config set save-exact true`：关闭版本号前面使用`^`默认行为，但**只会影响顶级依赖关系**，由于每个依赖的库都有自己的`package.json`文件，在他们自己的依赖关系前面可能会有`^`符号，所以无法通过`package.json`文件为嵌套依赖的内容提供保证。
* `shrinkwrap`命令：生成`npm-shrinkwrap.json`文件，为所有库和所有嵌套依赖的库记录确切的版本。但针对相同版本不同内容的库也是无法甄别和控制的。

#### 3. npm依赖结构

对`npm 2`来说，如果一个项目依赖了A模块，A模块又依赖了B模块，B模块又依赖了C模块，那么最终的依赖结构是：

```javascript
----node_modules
    ----modules A
        ----modules B
            ----modules C
```

**依赖地狱**，上面嵌套式的依赖结构，最终的依赖结构会很长，对`windows`来说，很多程序是无法处理超过260个字符的文件路径名。`npm 3`采用了**扁平化依赖树**的方式去解决这个问题

```javascript
----node_modules
    ----modules A
    ----modules B
    ----modules C
```

那么，`npm`必须首先遍历所有项目的依赖关系，然后再决定如何生成扁平的`node_modules`目录结构，`npm`必须为所有使用到的模块构建一个完整的依赖关系树，这是一个非常耗时的操作，这也是`npm`安装速度慢的一个很重要的原因。

**依赖不同版本的相同包**的情况`npm`又是如何处理的呢，了解一个例子，A如果依赖了B@1.0，C依赖B@2.0，对于`npm2`来说没什么问题，每个包的依赖包都是安装在自己的目录下的，对于`npm3`来说，是按照引用顺序，先加载对应版本作为扁平化最外层的包版本，在不相同版本处再仿造`npm2`的嵌套结构
```javascript
----node_modules
    ----modules A
    ----modules B@1.0
    ----modules C
        ----modules B@2.0
```

如果一个项目中必须要依赖不同版本的依赖包，可以用别名的方式来实现
```javascript
npm install vue
npm install vue3@npm:vue@^3.2.27
```
那么`package.json`文件中就会多
```javascript
"dependencies": {
    "vue": "^2.6.14",
    "vue3": "npm:vue@^3.2.27"
}
```
在使用的时候就可以
```javascript
const {Client: Client6} = require('es6')
const {Client: Client7} = require('es7')
```

#### 4. package-lock.json

**package-lock.json安装依赖**是`npm5.0`之后有的，在`npm install`之后就会自动生成。`npm install`时，如果`package.json`和`package-lock.json`中的版本兼容，则根据`package-lock.json`中的版本下载，如果不兼容，则会根据`package.json`，并更新`package-lock.json`，保证`package-lock.json`中的版本兼容`package.json`

**package-lock.json文件内容**，文件中的`name`、`version`和`package.json`的`name`和`version`是一样的，描述了当前包的名字和版本，`dependencies`是一个对象，该对象和`node_modules`中的包结构一一对应，对象的`key`是包的名称，值为包的一些描述信息，主要结构时
* version：包版本，这个包当前安装在`node_modules`中的版本
* resolved：包具体的安装来源
* integrity：包`hash`值，验证已安装的软件包是否被改动过，是否已失效
* requires：对应的子依赖的依赖，与子依赖的`package.json`中`dependencies`依赖项相同
* dependencies：结构和外层的`dependencies`属性，存储安装在子依赖`node_modules`中的依赖包，只要子依赖的依赖和当前已安装在根目录`node_modules`中的依赖冲突的时候，才会有这个属性

#### 5. npm离线缓存

当执行`npm install`时，通过`pacote`把相应的包解压到项目的`node_modules`中，`npm`下载依赖时，先下载到缓存中，再解压到`node_modules`中，`pacote`依赖`npm-registry-fetch`来下载包，可以根据`cache`属性，`integrity`、`verison`、`name` 相关信息会生成一个唯一的`key`;这个`key` 就能够对应上 `index-v5` 目录下的缓存记录; 如果发现有缓存资源,就会去找到 `tar` 包对应的`hash`值. 根据 `hash`再去找缓存中的`tar`包,然后再次通过 `pacote`将二进制文件解压缩进我们项目的 `node_modules`目录中，这样就省去了资源下载的网络开销。

<div style="display:flex;justify-content:center;"><img src="https://zhangmingemma.github.io/dist/images/2022-11-01/1.png" style="display:inline-block; margin-bottom:16px; width:500px;"></div>

### 二. yarn

2016年，`yarn`发布，`yarn`也采用**扁平化依赖结构**，它的出现是为了解决`npm v3`中的依赖安装速度慢，依赖安装版本不确定性等问题。`yarn`是一种新的`hadoop`资源管理器，可为上层应用系统提供统一的资源管理和调度。**基本思想**是将JobTracker的两个主要功能资源管理和作业调度/监控分离，**主要方法是**创建一个全局的ResourceManager和若干针对应用程序的ApplicationMaster，**主要优点是**减少了JobTracker的资源消耗，并且让每个Job子任务状态的程序分布式化了，更安全、更优美

#### 1. yarn版本问题

yarn解决了`npm`版本不确定性的问题，`yarn`默认有`yarn.lock`文件锁定版本，能保证`package.json`依赖安装的版本和实际的版本是一致的，保持环境统一，不会出现`npm`那样版本混乱的问题

#### 2. yarn安装依赖

**npm的安装是同步的**，在 npm 中安装依赖时，安装任务是串行的，会按包顺序逐个执行安装，这意味着它会等待一个包完全安装，然后再继续下一个。**yarn的安装依赖是异步的**，例如同时安装`axios`和`elementui`，`yarn`不会阻塞下载，会同时下载，因此不会因为某个依赖安装太费时间而导致后面的依赖一直处于等待下载的状态

#### 3. yarn离线缓存

当`yarn`安装重复的依赖时，`yarn`会从本地获取，`yarn`提供了离线模式，`yarn`会从缓存中下载依赖，

### 三. pnpm

`pnpm`是2017年正式发布的，定义为快速的，节省磁盘空间的包管理工具，开创了一套新的依赖管理机制，成为了包管理的后起之秀。与依赖提升和扁平化的`node_modules`不同，`pnpm`引入了另一套依赖管理策略：内容寻址存储。

#### 1. 内容寻址存储

该策略会将包安装在系统的全局`store`中，依赖的每个版本只会在系统中安装一次，在引用项目`node_modules`的依赖时，会通过**硬链接**和**符号链接**在全局`store`中找到这个文件。为了实现这个过程，`node_modules`下会多出`.pnpm`目录，而且是非扁平化结构。

* 硬链接：可以理解为源文件的副本，项目里安装其实是副本，它使得用户可以通过路径引用查找到全局`store`中的源文件，而且这个副本根本不占任何空间。同时，`pnpm`会在全局`store`里存储硬链接，不同的项目可以从全局`store`寻找到同一个依赖，大大节省了磁盘空间
* 符号链接：也叫软连接，可以理解为快捷方式，`pnpm`可以通过它找到对应磁盘目录下的依赖地址。

使用`pnpm`安装依赖后`node_modules`结构如下，其中`<store>/xxx`开头的路径是硬链接，指向全局`store`中安装的依赖。其余的是符号连接，指向依赖的快捷方式

```javascript
node_modules
----.pnpm
    ----A@1.0.0
        ----node_modules
            ----A => <store>/A@1.0.0
            ----B => ../../B@1.0.0
    ----B@1.0.0
        ----node_modules
            ----B => <store>/B@1.0.0
    ----B@2.0.0
        ----node_modules
            ----B => <store>/B@2.0.0
    ----C@1.0.0
        ----node_modules
            ----C => <store>/C@1.0.0
            ----B => ../../B@2.0.0
```

<div style="display:flex;justify-content:center;"><img src="https://zhangmingemma.github.io/dist/images/2022-11-01/2.png" style="display:inline-block; margin-bottom:16px; width:500px;"></div>

#### 2. 优缺点

**pnpm的优点**是可以解决：
* 幽灵依赖问题：也就是没有引用，但可以正常运行，也就是存在依赖提升的问题。在`pnpm`中只有直接依赖会平铺在`node_modules`下，子依赖不会被提升，不会产生幽灵依赖
* 依赖分身问题：相同的依赖只会`store`全局安装一次，项目中都是源文件的副本，几乎不占用任何空间。
* 下载速度问题：由于链接的优势，`pnpm`的安装速度在大多数场景下都比`npm`和`yarn`快2倍，节省的磁盘空间也更多

**pnpm的弊端**是：
* 由于`pnpm`创建的`node_modules`依赖软链接，因此在不支持软链接的环境中，无法使用`pnpm`
* 因为依赖源文件是安装在`store`中，调试依赖或`patch-package`给依赖打补丁也不太方便，可能会影响到其他项目
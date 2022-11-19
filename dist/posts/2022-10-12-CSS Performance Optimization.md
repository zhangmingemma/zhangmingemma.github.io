<!-- ---
title: CSS基础系列之性能优化
date: 2022-10-12
tags: CSS基础
set: CSSBase
--- -->

在打开一个页面后，页面首要内容出现在屏幕的时间影响着用户的体验，对CSS的性能优化非常必要
#### 1. 内联首屏关键CSS

通过内联`css`关键代码，能够使浏览器在下载完`html`后立刻开始渲染。如果外部引用`css`代码，在解析`html`结构过程中遇到外部`css`文件，才会开始下载`css`代码，再渲染。所以内联`css`代码能够使渲染事件提前

#### 2. 异步加载CSS

在`css`文件请求、下载、解析完成之前，`css`会阻塞渲染，浏览器将不会渲染任何已处理的内容。前面加载内联代码后，后面的外部引用`css`则没必要阻塞浏览器渲染，就可以采用异步加载的方案。用`javascript`将`link`标签插到`head`标签的最后

```javascript
const myCss = document.createElement('link')
myCss.rel = 'stylesheet'
myCss.href = 'myStyle.css'
document.head.insertBefore(myCss, document.head.childNodes[document.head.childNodes.length - 1].nextSibling)
```

#### 3. 资源压缩

利用`webpack`、`gulp`、`rollup`等模块化工具，将`css`代码进行压缩，使文件变小，大大降低浏览器的加载时间

#### 4. 去除冗余css

虽然文件压缩能够降低文件大小，但`css`压缩通常只会去除无用的空格，限制了`css`文件的压缩比例，因此去除冗余的`css`逻辑非常必要，可以借用`Uncss7`库来进行冗余`css`的删除

#### 5. 合理使用选择器

css选择器的匹配是从右向左进行的，这一策略导致了不同种类的选择器之间的性能也存在差异，相比于`#markdown-content-h3`，`#markdown .content h3`生成渲染树的耗时要更多，因此在编写选择器的时候要注意：

* 不要嵌套过多复杂选择器，最好不要三层以上
* 使用id选择器就没必要进行嵌套
* 通配符、属性选择器效率最低，避免使用

#### 6. 减少重排与重绘

重排会导致浏览器重新计算整个文档，重新构建渲染树，这一过程会降低浏览器的渲染速度。下面的这些操作会触发重排：
* 改变`font-size`和`font-family`
* 改变元素的内外边距
* 通过JS改变CSS类
* 通过JS获取DOM元素的位置相关的属性
* CSS伪类激活
* 滚动滚动条或改变窗口大小

当元素的外观(`color`、`background`、`visibility`)发生改变时，会触发重绘

#### 7. 不要使用@import

css样式文件有两种引入方式，一种是`link`，一种是`@import`，`@import`会影响浏览器的并行下载，使得页面在加载时增加额外的延迟，而且多个`@import`会导致下载顺序紊乱
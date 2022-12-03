<!-- ---
title: JS深入系列之大数据渲染
date: 2022-10-21
tags: JS深入系列
set: DeepJS
--- -->

页面性能对于前端来说是非常重要的一个话题，我们常常会遇到“直接给页面添加1w个div可以怎么做？”这样的问题，那这些问题应该如何解决，都与哪些具体的知识相关，是本文想要解释的关键点。

### 一. 懒加载与分页

**懒加载与分页**的方案用于JS资源和图片资源的按需动态加载，提高页面的渲染性能，但不适用于数据量太大，且不能分页的场景。

#### 1. webpack懒加载
**懒加载**又叫延时加载，在网页响应时不立刻请求资源，等待页面加载完毕或者按需响应时再加载资源，以达到提高页面响应速度以及节省服务器资源的目的。常用于图片、JS资源的懒加载实现上，提高页面加载速度。

* 配置babel
```javascript
module.exports = {
    plugins: [
        '@babel/plugin-syntax-dynamic-import'
    ]
}
```

* 配置chunkName 
```javascript
const Bar = () => import(/* webpackChunkName: "group-foo"*/ './Bar.vue')
```

#### 2. vue懒加载

使用`vue-lazyload`插件进行懒加载`npm i vue-lazyload`
```javascript
import Vue from 'vue'
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad)
Vue.use(VueLazyLoad, {
    preLoad: 1.3,
    error: 'dist/error.png',
    loading: 'dist/loading.gif',
    attempt: 1, // 默认尝试次数
})
<img v-lazy="item.iconUrl" alt="" width="100%" height="100%"/>
```

#### 3. 分页

分段分页向后台请求数据，移动端通过判断滚动条滚动的进度来判断是否需要分页加载下一页的数据，这种方式会牺牲部分前端交互体验，就是在列表页底给出页面编码，跳转后只渲染当前页码内的数据列表

### 二. 虚拟列表

长列表的数量一旦达到上千，页面渲染过程中会出现明显的卡顿，数量突破上万之后，网页可能直接奔溃，为了解决长列表造成的渲染压力，业界出现了相应的应对技术，就是**虚拟列表**，也叫**虚拟滚动**。**虚拟列表的本质，不管页面如何滚动，HTML文档只渲染当前屏幕视口展示出来的少量DOM元素**。

#### 1. 原理

**虚拟列表**其实是按需显示的一种实现，即只对可见区域进行渲染，对非可见区域中的数据不渲染或部分渲染的技术，从而达到极高的渲染性能。假设有1万条记录需要同时渲染，我们屏幕的可见区域的高度为500px,而列表项的高度为50px，则此时我们在屏幕中最多只能看到10个列表项，那么在首次渲染的时候，我们只需加载10条即可。**虚拟列表**的实现，实际上就是在首屏加载的时候，只加载**可视区域**内需要的列表项，当滚动发生时，动态通过计算获得**可视区域**内的列表项，并将非**可视区域**内存在的列表项删除。

实现**虚拟列表**就是在处理用户滚动时，改变列表在可视区域的渲染部分：
* 计算当前可视区域起始数据的startIndex
* 计算当前可视区域结束数据的endIndex
* 计算当前可视区域的数据，并渲染到页面中
* 计算startIndex对应的数据在整个列表中的偏移位置startOffset，并设置到列表上
* 计算endIndex对应的数据相对于可滚动区域最底部的偏移位置endOffset，并设置到列表上

<div style="display:flex;justify-content:center;"><img src="https://zhangmingemma.github.io/dist/images/2022-10-21/1.png" style="display:inline-block; margin-bottom:16px; width:500px;"></div>

#### 2. 实现

##### (1). 设计页面的DOM结构
```html
<div class="infinite-list-container"><!--可视区域-->
    <div class="infinite-list-phantom"></div><!--容器内的占位，高度为总列表高度，用于形成滚动条-->
    <div class="infinite-list"><!--渲染区域-->
        <!-- item-1 -->
        <!-- item-2 -->
        <!-- item-... -->
        <!-- item-n -->
    </div>
</div>
```

##### (2). 监听`scroll`事件，获取滚动位置`scrollTop`

在整个DOM结构中，我们假定每个数据项的高度是固定的`itemSize`，我们可以推算得到
* 列表总高度：`listHeight = listData.length * itemSize`
* 可显式的列表项数：`visibleCount = Math.ceil(screenHeight/itemSize)`
* 数据起始索引：`startIndex = Math.floor(scrollTop / itemSize)`
* 数据的结束索引：`endIndex = startIndex + visibleCount`
* 列表渲染的数据：`visibleData = listData.slice(startIndex, endIndex)`

最终的简易代码是：
```html
<template>
    <div ref="list" class="infinite-list-container" @scroll="scrollEvent($event)">
        <div class="infinite-list-phantom" :style="{ height: listHeight + 'px' }"></div>
        <div class="infinite-list" :style="{ transform: getTransform }">
            <div
                ref="items"
                class="infinite-list-item"
                v-for="item in visibleData"
                :key="item.id"
                :style="{ height: itemSize + 'px', lineHeight: itemSize + 'px' }"
            >{{ item.value }}</div>
        </div>
    </div>
</template>
```
```javascript
export default {
    name: 'VirtualList',
    props: {
        listData: Array,
        itemSize: Number
    },
    computed: {
        listHeight() {
            return this.listData.length * this.itemSize
        },
        visibleCount() {
            return Math.ceil(this.screenHeight / this.itemSize)
        },
        getTransform() {
            return `translate3d(0, ${this.startOffset}px, 0)`
        },
        visibleData() {
            return this.listData.slice(this.start, Math.min(this.end, this.listData.length))
        }
    },
    mounted() {
        this.screenHeight = this.$el.clientHeight
        this.start = 0
        this.end = this.start + this.visibleCount
    },
    data() {
        return {
            screenHeight: 0,
            start: 0,
            startOffset: 0,
            end: null
        }
    },
    methods: {
        scrollEvent() {
            // 当前滚动位置
            let scrollTop = this.$refs.list.scrollTop
            // 此时的开始索引
            this.start = Math.floor(scrollTop / this.itemSize)
            // 此时的结束索引
            this.end = this.start + this.visibleCount
            // 此时的偏移量
            this.startOffset = scrolllTop - (scrollTop % this.itemSize)
        }
    }
}
```

<div style="display:flex;justify-content:center;"><img src="https://zhangmingemma.github.io/dist/images/2022-10-21/2.gif" style="display:inline-block; margin-bottom:16px; width:500px;"></div>

#### 3. 优化

##### 1. 列表项动态高度

上面的简易实现，我们假定了列表项的高度是固定的，但实际情况列表项的高度往往不是固定的，是根据内容而动态撑开的。这里我们可以先设置**预估高度**进行渲染，然后获取**真实高度**进行缓存。

###### (1). 初始化配置

定义组件属性预估高度`estimatedItemSize`，用于接收预估高度
```javascript
{
    props: {
        estimatedItemSize: Number 
    }
}
```
定义`positions`，用于列表渲染后存储**每一项的高度以及位置**信息，
```javascript
this.positions = []
```
并在初始时根据`estimatedItemSize`对`positions`进行初始化
```javascript
initPositions() {
    this.positions = this.listData.map((item, index) => {
        return {
            index,
            height: this.estimatedItemSize,
            top: index * this.estimatedItemSize,
            bottom: (index + 1) * this.estimatedItemSize
        }
    })
}
```
那么我们之前写的列表高度就可以根据实际高度来计算得到了
```javascript
listHeight() {
    return this.positions[this.positions.length - 1].bottom
}
```

###### (2).更新实际位置信息

通过`updated`钩子函数，在渲染完成后，获取列表每项的位置信息并进行缓存
```javascript
updated() {
    let nodes = this.$refs.items
    nodes.forEach(node => {
        let rect = node.getBoundingClientRect()
        let height = rect.height
        let index = +node.id.slice(1)
        let oldHeight = this.positions[index].height
        let dValue = oldHeight - height
        if (dValue) {
            this.positions[index].bottom = this.positions[index].bottom - dValue
            this.positions[index].height = height
            for(let k=index+1;k<this.positions.length; k++) {
                this.positions[k].top = this.positions[k-1].bottom
                this.positions[k].bottom = this.positions[k].bottom - dValue
            }
        }
    })
```
滚动后获取列表**开始索引**方法通过**缓存**来获取：
```javascript
getStartIndex(scrollTop=0) {
    let item = this.positions.find(x => x && x.bottom > scrollTop)
    return item.index
}
```
这其中可以通过**二分查找**来优化查找效率
```javascript
getStartIndex(scrollTop=0) {
    return this.binarySearch(this.positions, scrollTop)
},
binarySearch(list, value) {
    let start = 0
    let end = list.length - 1
    let tempIndex = null
    while(start <= end) {
        let midIndex = parseInt((start+end) / 2)
        let midValue = list[midIndex].bottom
        if (midValue === value) {
            return midIndex + 1
        } else if (midValue > value) {
            if (tempIndex === null || tempIndex > midIndex) {
                tempIndex = midIndex
            }
            end = end - 1
        } else {
            start = midIndex + 1
        }
    }
    return tempIndex
}
```
滚动后的偏移量的获取方式变更：
```javascript
scrollEvent() {
    // ... 
    if (this.start >= 1) {
        this.startOffset  = this.positions[this.start - 1].bottom
    } else {
        this.startOffset = 0
    }
}
```

<div style="display:flex;justify-content:center;"><img src="https://zhangmingemma.github.io/dist/images/2022-10-21/3.gif" style="display:inline-block; margin-bottom:16px; width:500px;"></div>

##### 2. 滚动部分白屏的问题

可以看到**文字内容动态撑高列表项**可能在滚动过快的时候，出现短暂的白屏现象，我们可以在滚动的时候给予一些缓冲：
* 可视区域上方：`above`
* 可视区域：`screen`
* 可视区域下方：`below`

<div style="display:flex;justify-content:center;"><img src="https://zhangmingemma.github.io/dist/images/2022-10-21/4.png" style="display:inline-block; margin-bottom:16px; width:500px;"></div>

```javascript
{
    props: {
        bufferScale: {
            type: Number,
            default: 1
        }
    },
    computed: {
        aboveCount() {
            return Math.min(this.start, this.bufferScale * this.visibleCount)
        },
        belowCount() {
            return Math.min(this.listData.length - this.end, this.bufferScale * this.visibleCount)
        },
        visibleData() {
            let start = this.start - this.aboveCount
            let end = this.end + this.belowCount
            return this.listData.slice(start, end)
        }
    }
}
```

最终完整代码
```javascript
<template>
  <div
    ref="list"
    :style="{height}"
    class="infinite-list-container"
    @scroll="scrollEvent($event)"
  >
    <div ref="phantom" class="infinite-list-phantom"></div>
    <div ref="content" class="infinite-list">
      <div 
        class="infinite-list-item" 
        ref="items"
        :id="item._index"
        :key="item._index"
        v-for="item in visibleData"
      >
        <slot ref="slot" :item="item.item"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VirtualList',
  props: {
    listData: Array,
    estimateItemSize: Number,
    bufferScale: {
      type: Number,
      default: 1
    },
    height: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      screenHeight: 0,
      start: 0,
      end: 0
    }
  },
  computed: {
    visibleCount() {
      return Math.ceil(this.screenHeight / this.estimateItemSize)
    },
    aboveCount() {
      return Math.min(
        this.start,
        this.bufferScale * this.visibleCount
      )
    },
    belowCount() {
      return Math.min(
        this.listData.length - this.end,
        this.bufferScale * this.visibleCount
      )
    },
    visibleData() {
      let start = this.start - this.aboveCount
      let end = this.end + this.belowCount
      return this.listData.slice(start, end)
    }
  },
  created() {
    this.initPosition()
    window.vm = this
  },
  mounted() {
    this.screenHeight = screen.height
    this.start = 0
    this.end = this.start + this.visibleCount
  },
  updated() {
    this.$nextTick(function() {
      if (!this.$refs.items || !this.$refs.items.length) return
      this.updateItemSize()
      let height = this.positions[this.positions.length -1].bottom
      this.$refs.phantom.style.height = height + 'px'
      this.setStartOffset()
    });
  },
  methods: {
    initPosition() {
      this.positions = this.listData.map((item, index) => ({
        index,
        height: this.estimateItemSize,
        top: index * this.estimateItemSize,
        bottom: (index + 1) * this.estimateItemSize
      }))
    },
    updateItemSize() {
      let nodes = this.$refs.items
      nodes.forEach(node => {
        let rect = node.getBoundingClientRect()
        let height = rect.height
        let index = +node.id.slice(1)
        let oldHeight = this.positions[index].height
        let dValue = oldHeight - height

        if (dValue) {
          this.positions[index].bottom = this.positions[index].bottom - dValue
          this.positions[index].height = height
          for(let k = index + 1; k < this.positions.length; k++) {
            this.positions[k].top = this.positions[k-1].bottom
            this.positions[k].bottom = this.positions[k].bottom - dValue
          }
        }
      })
    },
    setStartOffset() {
      let startOffset;
      if (this.start >= 1) {
        let temp = this.positions[this.start - this.aboveCount]
          ? this.positions[this.start - this.aboveCount].top
          : 0
        let size = this.positions[this.start].top - temp
        startOffset = this.positions[this.start - 1].bottom - size
      } else {
        startOffset = 0
      }
      this.$refs.content.style.transform = `translate3d(0, ${startOffset}px, 0)`
    },
    scrollEvent() {
      let scrollTop = this.$refs.list.scrollTop
      this.start = this.getStartIndex(scrollTop)
      this.end = this.start + this.visibleCount
      this.setStartOffset()
    },
    getStartIndex(scrollTop = 0) {
      return this.binarySearch(this.positions, scrollTop)
    },
    binarySearch(list, value) {
      let start = 0;
      let end = list.length - 1;
      let tempIndex = null;

      while(start <= end){
        let midIndex = parseInt((start + end)/2);
        let midValue = list[midIndex].bottom;
        if(midValue === value){
          return midIndex + 1;
        }else if(midValue < value){
          start = midIndex + 1;
        }else if(midValue > value){
          if(tempIndex === null || tempIndex > midIndex){
            tempIndex = midIndex;
          }
          end = end - 1;
        }
      }
      return tempIndex;
    }
  }
}
</script>
<style scoped>
.infinite-list-container {
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}
.infinite-list-phantom {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
}
.infinite-list {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
}
.infinite-list-item {
  padding: 5px;
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
}
</style>
```

<div style="display:flex;justify-content:center;"><img src="https://zhangmingemma.github.io/dist/images/2022-10-21/5.gif" style="display:inline-block; margin-bottom:16px; width:500px;"></div>

##### 3. 更多优化

可以使用`IntersectionObserver`替换监听`scroll`事件，`IntersectionObserver`可以监听目标元素是否出现在可视区域内，在监听的回调事件中执行可视区域数据的更新，并且`IntersectionObserver`的监听回调是异步触发，不随着目标元素的滚动而触发，性能消耗极低。

### 三. DOM片段

**documentFragment**是一个保存多个`element`的容器对象，当更新其中的一个或多个`element`时，页面不会更新，只有当`documentFragment`容器中保存的所有`element`更新后再将其插入到页面中才能更新页面。用来批量更新是还不错的选择：
* 创建documentFragment对象
* 更新fragment所有的节点
* 将fragment插入到页面中展示

```javascript
const app = document.querySelector('.app')
const fragment = document.createDocumentFragment()
for(let i=0; i<5; i++) {
    let div = document.createElement('li')
    div.setAttribute('class', 'item')
    div.innerText = 6666
    fragment.appendChild(div)
}
app.appendChild(fragment)
```

### 参考文献

* <a href="https://juejin.cn/post/6844903982742110216" target="_blank">高性能渲染十万条数据(虚拟列表)</a>
* <a href="https://github.com/dwqs/blog/issues/70" target="_blank">浅说虚拟列表的实现原理</a>
* <a href="https://zhuanlan.zhihu.com/p/34585166" target="_blank">再谈前端虚拟列表的实现</a>


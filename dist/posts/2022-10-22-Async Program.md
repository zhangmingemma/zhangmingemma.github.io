<!-- ---
title: JS基础系列之异步编程
date: 2022-10-22
tags: JS基础系列
set: BaseJS
--- -->

异步，简单来说就是一个任务不是连续完成的，可以理解成该任务被人分成两段，先执行第一段，然后转而执行其他任务，等做好了准备，再回头执行第二段。接下来，我们就逐步介绍异步编程的几种方式。

### 1. 回调函数
把任务的第二段单独放在一个函数里面，等到重新执行这个任务的时候，就直接调用这个函数，例如读取文件进行处理时，第三个参数就是一个回调函数，读取文件之后才会执行回调函数
```javascript
fs.readFile('/etc/passwd', 'utf-8', function(err, data) {
    if (err) throw err
    console.log(data)
})
```

**优点**是简单、容易实现、容易理解。**缺点**是不利于代码的阅读和维护，各个部分之间高度耦合，使得程序结构混乱，流程难以追踪，特别是容易出现多个回调函数嵌套的情况，而且每个任务只能指定一个回调函数，此外，也不可以使用`try catch`捕获错误，不能直接`return`

### 2. 事件监听

设置事件触发和监听，在事件触发之后执行某段逻辑，只有在事件执行之后才会执行，而与代码的编写顺序无关。

```javascript
document.getElementById('div').addEventListener('click', (e) => {
    console.log('我被点击了‘)
}, false)
```

**优点**是比较容易理解，可以绑定多个事件，每个事件都可以指定多个回调函数，而且可以“去耦合”，有利于实现模块化。**缺点**是整个程序都要变成事件驱动，运行流程会变得不清晰，阅读代码的时候，很难看出主流程

### 3. 发布/订阅

发布-订阅者模式，我们在之前的<a href="https://zhangmingemma.github.io/#/post?file=2022-10-27-Observer%20Watcher"  target="_blank">《JS深入系列之发布-订阅者模式》</a>中有介绍，但是**优点**是可以在事件中心中看到每个信号的订阅者和观察者，从而监控程序的运行。但事件中心的缺点在这里也同样存在。

```javascript
Bus.$on('eventName', this.eventHandler)
Bus.$emit('eventName', value)
```

### 4. Promise

Promise的用法，我们在之前的<a href="https://zhangmingemma.github.io/#/post?file=2022-10-20-Promise"  target="_blank">《JS深入系列之手写Promise》</a>文章中有讲到

```javascript
ajax(url).then(res => {
    console.log(res)
    return ajax(url1)
}).then(res => {
    console.log(res)
    return ajax(url2)
}).then(res => {
    console.log(res)
})
```

**优点**是Promise能够实现异步变成，也能够捕获错误，也很好的解决了回调地狱的问题，但是**缺点**是无法取消Promise，错误需要通过回调函数来捕获

### 5. Generator

Generator函数是一个状态机，封装了多个内部状态，也是一个遍历器对象生成函数，其中`yield`可以暂停，`next`方法可以启动，每次返回的是`yield`后的表达结果。具体我们在之前的<a href="https://zhangmingemma.github.io/#/post?file=2022-10-21-Generator"  target="_blank">《JS深入系列之手写Promise》</a>文章中有讲到。

```javascript
function *fetch() {
    yield ajax(url, () => {})
    yield ajax(url1, () => {})
    yield ajax(url2, () => {})
}
const it = fetch()
let res1 = it.next()
let res2 = it.next()
let res3 = it.next()
```

**co模块**就是典型的用`Generator`和`Promise`封装的用于异步操作的方法，**co模块**的源码是：
* 会先检查`gen`是否为函数，是的话就执行，得到一个内部指针对象，如果不是的话就返回，将`Promise`对象的状态改为`resolved`
* 将`Generator`函数的内部指针对象的`next`方法封装成`onFulfilled`，方便捕捉抛出的错误
```javascript
function co(gen) {
    const ctx = this
    return new Promise((resolve, reject) => {
        if (typeof gen == 'function') {
            gen = gen.call(ctx)
        } else if (!gen) {
            return resolve(gen)
        }

        onFulfilled()
        function onFulfilled(res) {
            let ret
            try {
                ret = gen.next(res)
            } catch(e) {
                return reject(e)
            }
            next(ret)
        }

        function next(ret) {
            if (ret.done) {
                return resolve(ret.value)
            }
            // 确保每一步的返回值，都是Promise对象
            let value = toPromise.call(ctx, ret.value)
            // 使用then方法，为返回值加上回调函数，然后通过onFulfilled再次调用next函数
            if (value && isPromise(value)) {
                return value.then(onFulfilled, onRejected)
            }
            // 在参数不符合条件的前提下，抛出错误
            return onRejected(new TypeError())
        }
    })
}
```

### 6. async + await

我们使用`async`和`await`可以做到使用`Generator`和`co`函数所做的工作：
* 是基于`Promise`实现的，不能用于普通的回调函数
* 与`Promise`一样是非阻塞的
* 使得异步代码看起来像是同步的

```javascript
async function readResult(params) {
    let p1 = await read(params, 'utf8')
    let p2 = await read(p1, 'utf8')
    let p3 = await read(p2, 'utf8')
    return p3
}
```

这个方案可以说是异步编程的终极解决方案了，相比于`Promise`，它的优势是：
* 处理`then`的调用链，能够更清晰地写出代码
* 也能够优雅地解决回调地狱的问题
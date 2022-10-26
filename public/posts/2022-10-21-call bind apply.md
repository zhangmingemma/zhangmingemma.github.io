<!-- ---
title: JS深入系列之手写Call Apply和Bind
date: 2022-10-21
tags: JavaScript
set: DeepJS
--- -->

在JS中，`call`、`apply`和`bind`都是为了改变函数运行时的上下文而存在的，换句话说，是为了改变函数体内部的`this`的指向。举一个例子：
```javascript
var color = 'green'
function fruits() {}
fruits.prototype = {
    color: 'red',
    say: function() {
        console.log('color is: ', this.color)
    }
}
var apple = new fruits
apple.say() // color is: red
var banana = {
    color: 'yellow'
}
apple.say.apply(banana) // color is: yellow
```
可以看出`apple.say`在第一次执行的时候，`this`指向`fruits`本身，第二次执行的时候，`this`指向`banana`

## 一. apply、call

`call`和`apply`都用于改变函数执行的上下文，用法只有一个区别`call`方法接受的是一个参数列表，而`apply`方法接受的是一个数组

### 1. apply

apply的语法是`func.apply(thisArg, [argsArray])`，对参数的讲解是：

* **thisArg**：必选的。在`func`函数运行时指定使用的`this`值。如果没传，或者是指定为`null`或`undefined`时会自动替换为指向全局对象。
* **argsArray**：可选的。一个数组或者类数组对象，其中的数组元素将作为单独的参数传给`func`函数。如果这个参数没传，或者是指定为`null`或`undefined`时就不会传递参数给`func`

那手写`apply`的时候，应该如何改变`func`执行的上下文呢，我们可以将`func`赋值给一个对象的属性，这样`func`的上下文就是所属的对象了。

```javascript
Function.prototype._apply = function(context, args) {
    context = context || window
    context.fn = this

    var res
    if (!args || !args.length) {
        res = context.fn()
    } else {
        res = context.fn(...args)
    }
    delete context.fn
    return res
}
```

### 2. call

call的语法是`function.call(thisArgs, arg1, arg2, ...)`， 对参数的解读是：

* **thisArg**：必选的。在`func`函数运行时指定使用的`this`值。如果没传，或者是指定为`null`或`undefined`时会自动替换为指向全局对象。
* **arg1, arg2, ...**：可选的，指定的参数列表

```javascript
Function.prototype._call = function(context) {
    context = context || window
    context.fn = this

    const args = [...arguments].slice(1)
    var res = context.fn(args)
    delete context.fn
    return res
}
```

总结一下`call`和`apply`的区别：
* 相同点是二者都用于改变函数的执行上下文，并且调用的时候会立即执行函数。
* 区别是，`call`传入的参数是一个参数列表，`apply`传入的参数是一个数组，数组内包含多个参数。就性能而言，`apply`可能稍好一些，理解是少了一层传入参数的结构和判断过程

## 二. bind

bind会创建一个绑定上下文的函数，需要手动调用，可以在调用中传入参数，也就是说调用`bind`的函数不会立即执行，`bind`有几个特点：
* **函数不会立即执行**
* **函数柯里化**：`bind`后面传入的参数列表，可以分多次传入
* **做构造函数**：可以通过`new`创建对象，此时提供的`this`值被忽略，但传入的参数会被提供给模拟函数

首先，我们给出最简单的`bind`的实现，**调用`bind`的函数不会立即执行**，也就是说会返回一个函数，等待手动执行。
```javascript
Function.prototype._bind = function(context) {
    context = context || window
    const self = this
    return function() {
        self.apply(context)
    }
}
```

我们再来看`bind`传参的问题，**`bind`的传参可以分多次传入**，举个例子
```javascript
// 函数柯里化的应用示例
var max = Math.max.bind(null, 1, 2, 3)
console.log(max(4)) // 12
```
那我们的手动实现上就是：
```javascript
Function.prototype._bind = function(context) {
    context = context || window
    const self = this
    const outerArgs = [...arguments].slice(1)
    return function(args) {
        const innerArgs = [...arguments]
        const allArgs = outerArgs.concat(innerArgs)
        self.apply(context, allArgs)
    }
}
```

我们再来看`bind`在构造函数的方面，可以**通过`new`来创建实例，此时提供的`this`将被忽略，但参数还是传递下去继续进行执行**，举个例子：
```javascript
var value = 2
var foo = {
    value: 1
}
function bar(name, age) {
    this.habit = 'shopping'
    console.log(this.value)
    console.log(name)
    console.log(age)
}
bar.prototype.friend = 'kevin'
var bindFoo = bar.bind(foo, 'daisy')
var obj = new bindFoo('18')
// undefined
// daisy
// 18
console.log(obj.habit)
// shopping
console.log(obj.friend)
// kevin
```
可以看到`bind`返回的函数可以当做一个构造函数，使用`new`来创建实例的时候`this`已经指向了`obj`，而不是已经绑定的`foo`。在手动实现上：
```javascript
Function.prototype._bind = function(context) {
    context = context || window
    const self = this
    const outerArgs = [...arguments].slice(1)
    const ffound = function(args) {
        const innerArgs = [...arguments]
        const allArgs = outerArgs.concat(innerArgs)
        const ctx = this instanceof self ? this : context
        self.apply(context, allArgs)
    }
    ffound.prototype = this.prototype
    return ffound
}
``` 
但如果我们这样`ffound.prototype`改写的方式来写的话，会直接修改函数的`prototype`，可以通过一个空函数进行中转
```javascript
Function.prototype._bind = function(context) {
    context = context || window
    const self = this
    const outerArgs = [...arguments].slice(1)
    const ffound = function(args) {
        const innerArgs = [...arguments]
        const allArgs = outerArgs.concat(innerArgs)
        const ctx = this instanceof self ? this : context
        self.apply(context, allArgs)
    }
    const fNop = () => {}
    fNop.prototype = this.prototype
    ffound.prototype = new fNop()
    return ffound
}
```

总结一下`bind`和`call/apply`的区别：
* **执行**：`bind`返回一个函数，不会立即执行，需要手动调用；`call/apply`会立即执行
* **参数**：`bind`的参数可以多次传入；`call/apply`需要一次性传入所有的参数
* **构造函数**：`bind`返回的函数可以当做构造函数来用，`this`指向不会是最初传入的`this`，这个能力是`call/apply`不具备的



<!-- ---
title: JS基础系列之函数参数Arguments
date: 2022-10-29
tags: JS基础系列
set: BaseJS
--- -->

我们都知道函数的参数可以通过`arguments`来获取，那`arguments`是数组吗？怎么理解？怎么用呢？

#### 1. 类数组对象

对于普通的对象来说，所有的`property`名都为正整数，同时也有相应的`length`属性，对象也并不是由`Array`构造函数创建的，它依然呈现出数组的行为，这种对象被称为`类数组对象`。**arguments就是类数组对象**。

```javascript
function func(a,b) {
    console.log(arguments)
}
```
<div style="display:flex;justify-content:flex-start;"><img src="https://zhangmingemma.github.io/dist/images/2022-10-29/1.png" style="display:inline-block; margin-bottom:16px; width:500px;"></div>

arguments具有以下特点：
* **除了`length`属性和索引元素之外没有任何`Array`属性**。
* **arguments是所有函数（非箭头函数）中都可用的局部变量**，如果传递了两个参数，可以分别用`arguments[0]`和`arguments[1]`来引用。

#### 2. arguments用法

arguments虽然与数组类似，但是没有数组常见的`forEach`、`reduce`等方法属性，所以叫他们类数组，要遍历数组的话，有三个方法

* 将数组的方法应用到类数组上，可以用`call`和`apply`方法
```javascript
function foo() {
    console.log(Array.prototype.slice.call(arguments))
}
```

* 使用`Array.from`方法将类数组转化成数组
```javascript
function foo() {
    console.log(Array.from(arguments))
}
```

* 使用展开运算符将类数组转化成数组
```javascript
function foo() {
    console.log([...arguments])
}
```
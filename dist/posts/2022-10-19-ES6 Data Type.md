<!-- ---
title: ES6系列之数据类型
date: 2022-10-19
tags: ES6系列, JavaScript
set: ES6
--- -->

## 一. Symbol
ES6在原本的原生数据类型`Number`、`Null`、`String`、`Undefined`、`Boolean`中加入了`Symbol`，表示独一无二的值。Symbol常见的用法有：
* **`Symbol`可以用于作为对象的key**，可以有效防止键值被改写或是覆盖。但`Symbol`作为对象的key时，只能当做变量来对待，要用`[]`取值或赋值，不能用`.`运算符。
* **`Symbol`作为对象属性时，不会在对象属性遍历的时候`Object.keys`出现**。只能通过`Object.getOwnPropertySymbols`获取，可以通过这个特性定义对象的私有属性
* **`Symbol.for('foo')`可以创建相同的值

```javascript
// symbol创建
const a = Symbol()
// symbol类型
typeof a // symbol
// symbol添加描述
const b = Symbol('foo')
const c = Symbol('foo')
// symbol比较
c == b // false
// symbol作为属性
let d = {}
d[b] = 'hello!'
```

## 二. Set


## 三. Map
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
ES6提供了新的数据结构`Set`，`Set`成员的值都是唯一的，没有重复的值。

**Set与Array的区别**
* **成员值**：Array成员的值可重复，Set成员的值没有重复的
* **创建方法**：都可以通过`new`来创建
* **操作方法**：Array的操作方法是`length`/`push`/`splice`/`shift`/`unshift`/`pop`，Set的操作方法是`size`/`add`/`delete`/`has`/`clear`
* **遍历**：Set可以通过`keys()`、`values`、`entries`、`forEach`进行遍历

**WeakSet**
WeakSet的成员只能是对象，不能是其他类型的值。并且WeakSet内的对象都是弱引用，也就是说其他对象不再引用该对象，垃圾回收机制会自动回收该对象占用的内存，不考虑这个对象还存在于WeakSet中。因此WeakSet中的值是否还在取决于垃圾回收机制何时运行，ES6规定WeakSet不允许遍历

## 三. Map
ES6提供了新的数据结构`Map`，

**Map和Object的区别**
* **本质**：二者本质都是键值对的集合
* **键**：JS的对象`Object`传统上只能用字符串做键，但`Map`的键可以是各种类型，是一种更完善的Hash结构
* **操作方法**：Map的取值和赋值，是通过`get`/`set`来实现，Object的取值和赋值，是通过`.`/`[]`来实现，二者都可以通过`delete`删除键值对
* **创建**：任何具有Iterator接口、且每个成员都是一个双元素数组的数据结构都可以当做`Map`构造函数的参数

```javascript
const set = new Set([['foo', 1], ['bar', 2]])
const m1 = new Map(set)
m1.get('foo') // 1

const m2 = new Map().set(true, 7).set({foo: 3}, ['abc'])
[...myMap] // [[true, 7], [{foo: 3}, ['abc']]]

new Map([[true, 7], [{foo: 3}, ['abc']]])
// Map{true: 7, {foo:3}: ['abc']}
```

**Map和WeakMap的区别**
* WeakMap只接受对象作为键名，不接受其他类型的值作为键名
* WeakMap键名所指向的对象，不计入垃圾回收机制，也就是WeakMap的键名所引用的对象都是弱引用，垃圾回收机制不会将WeakMap与键名之间的引用考虑在内，一旦不再需要，就会被清除。鉴于此，WeakMap的键名随时都可能消失，所以不能取键名，没有`keys`、`values`、`entries`这些方法，也不能用`clear`清空，只能使用`get`/`set`/`has`/`delete`


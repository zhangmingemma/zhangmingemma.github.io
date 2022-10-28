<!-- ---
title: JS基础系列之原型与原型链
date: 2022-10-23
tags: JS基础系列
set: BaseJS
--- -->

### 原型与原型链

我们先来看一个例子
```javascript
function Person() {}
Person.prototype.name = 'Kevin'
const person = new Person()
console.log(person.name)                            // Kevin
console.log(person.__proto__ == Person.prototype)   // true
console.log(person.__proto__.constructor == Person) // true
```
从这个例子中，我们可以看到函数具备一个`prototype`的属性，实际上，每个函数都有一个`prototype`的属性，且只有函数才会有`prototype`的属性。函数的`prototype`指向的是一个对象，这个对象就是调用函数创建的实例对象的原型`obj.__proto__`。对于`__proto__`来讲是，每个JS对象（`null`除外）都有一个与之关联的对象，这个对象就是原型，也就是`__proto__`属性指向的，每个对象都会从原型“继承”属性，实力原型`constructor`指向构造函数

<div style="display:flex;justify-content:center;">
  <img src="https://zhangmingemma.github.io/dist/images/2022-10-23/1.png" style="display:inline-block; margin-bottom:16px; width:500px;">
</div>

当读取实例的属性时，在实例中找不到，就会去实例的原型中去寻找，如果还查不到就会去原型的原型，逐层向上，直至顶层。原型对象本质上也是一个对象，最原始是通过`Object`构造函数创建的，所以顶层的原型就是`Object.prototype`，而`Object.prototype.__proto__`的值就是`null`了，也就是`Object.prototype`是没有原型的，下面就是具体的关系图，蓝色的线就是原型链

<div style="display:flex;justify-content:center;">
  <img src="https://zhangmingemma.github.io/dist/images/2022-10-23/2.png" style="display:inline-block; margin-bottom:16px; width:500px;">
</div>

### 继承

继承就是一种拥有其他方法的一些属性和能力，来达到属性和方法的

#### 1. 原型链继承

核心原理是将父类实例作为子类的原型，优点是可以实现方法的复用，由于方法定义在父类的原型上，复用了父类构造函数的方法。

```javascript
function Parent(name) {
  this.name = name
  this.arr = [1]
}
Parent.prototype.say = function() {
  console.log('hello')
}
function Child(like) {
  this.like = like
}
Child.prototype = new Parent()
Child.prototype.constructor = Child
let boy1 = new Child()
let boy2 = new Child()
console.log(boy1.say(), boy2.say(), boy1.say() == boy2.say()) // hello hello true
console.log(boy1.name, boy2.name, boy1.name == boy2.name) // undefined undefined true
boy1.arr.push(2) 
console.log(boy1.arr, boy2.arr) // [1,2] [1,2]
console.log(boy1.constructor) // function
```

这种继承方式的缺点是：
* 创建子类实例的时候，不能传父类的参数
* 子类实例共享了父类构造函数的引用属性
* 无法实现多继承

#### 2. 借用构造函数

核心思想是借用父类的构造函数来增强子类实例，等于是复制父类的实例属性给子类

```javascript
function Parent(name) {
  this.name = name
  this.arr = [1]
}
Parent.prototype.say = function() {
  return 'hello'
}
function Child(name, like) {
  Parent.call(this, name)
  this.like = like
}
let boy1 = new Child('Kevin')
let boy2 = new Child('Gemma')
console.log(boy1.say(), boy2.say(), boy1.say() == boy2.say()) // say is not a function
console.log(boy1.name, boy2.name, boy1.name == boy2.name) // Kevin Gemma false
boy1.arr.push(2)
console.log(boy1.arr, boy2.arr) // [1,2] [1]
console.log(boy1.constructor) // function
```

这种继承方式的优点是：
* 实例之间可以独立
* 创建子类实例的时候，可以向父类构造函数传参
* 子类实例不共享父类构造函数的引用属性，如arr
* 可实现多继承

缺点是：
* 父类的方法不能复用
* 子类实例，继承不了父类原型上的属性

#### 3. 组合继承

核心是通过调用父类的构造函数，继承父类的属性并保留传参的优点，然后通过将父类实例作为子类原型，实现原型属性的继承和方法的复用

```javascript
function Parent(name) {
  this.name = name
  this.arr = [1]
}
Parent.prototype.say = function() {
  return 'hello'
}
function Child(name, like) {
  Parent.call(this, name)
  this.like = like
}
Child.prototype = new Parent()
Child.prototype.constructor = Child
let boy1 = new Child('Kevin')
let boy2 = new Child('Gemma')
console.log(boy1.say(), boy2.say(), boy1.say() == boy2.say()) // hello hello true
console.log(boy1.name, boy2.name, boy1.name == boy2.name) // Kevin Gemma false
boy1.arr.push(2)
console.log(boy1.arr, boy2.arr) // [1,2] [1]
console.log(boy1.constructor) // function Child
```

这种继承方式的优点是：
* 保留构造函数的优点：创建子类实例，可以向父类构造函数传参
* 保留原型链的优点：可继承父类原型对象的方法，也可以实现方法复用
* 不共享父类的引用属性，比如arr属性

这种继承方法的缺点是：
* 由于2次调用了父类的构造方法，会存在一份多余的父类实例属性

#### 4. 组合继承优化

能够完美的实现：
* 只调用一次父类的构造函数
* 可以保留构造函数的优点：创建子类实例，可以向父类构造函数传参
* 可以保留原型链的有点：可以继承父类原型对象的方法，也可以实现方法复用
* 但不会共享父类上的引用属性，能够实现不同实例的属性隔离

```javascript
function Parent(name) {
  this.name = name
  this.arr = [1]
}
Parent.prototype.say = function() {
  return 'hello'
}
function Child(name, like) {
  Parent.call(this, name)
  this.like = like
}
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child
let boy1 = new Child('Kevin')
let boy2 = new Child('Gemma')
console.log(boy1.say(), boy2.say(), boy1.say() == boy2.say()) // hello hello true
console.log(boy1.name, boy2.name, boy1.name == boy2.name) // Kevin Gemma false
boy1.arr.push(2)
console.log(boy1.arr, boy2.arr) // [1,2] [1]
console.log(boy1.constructor) // function Child
```


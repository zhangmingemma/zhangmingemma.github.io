<!-- ---
title: JS基础系列之原型与原型链
date: 2022-10-23
tags: JavaScript
set: BaseJS
--- -->

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

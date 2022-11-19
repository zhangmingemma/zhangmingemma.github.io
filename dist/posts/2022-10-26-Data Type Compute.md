<!-- ---
title: JS基础系列之数据类型
date: 2022-10-26
tags: JS基础系列
set: BaseJS
--- -->

JS中数据类型有很多种类型，我们这篇主要讲解的是数据类型的区分、存储以及判断

### 一. 数据类型区分

#### 1. 基本类型

JS的基本数据类型包括`null`、`undefined`、`number`、`string`、`boolean`，ES6加入了`symbol`，是第3版提案中还在修改的要加入的`bigInt`

##### 1) **基本类型的基本特点**
* **占用空间固定**，存放在**栈内存**中。当一个方法执行时，每个方法都会建立自己的内存栈，在这个方法内定义的变量将会逐个放入这块栈内存中，随着方法的执行结束，这个方法的内存栈自然销毁。因此所有在方法中定义的变量都是放在栈内存中的，栈中存储的是基础变量以及一些对象的引用变量，基础变量的值是存在栈中，而引用变量存储在栈中的是指向堆中的数组或对象的地址，所以修改引用类型会影响到其他指向这个地址的引用变量。
* **保存与复制的是值本身**
* **使用typeof检测数据的类型**
* **基本类型上不可以添加属性和方法**

> 栈会自动分配内存空间，会自动释放，存放基本类型，简单的数据段占据固定大小的空间。

##### 2) **BigInt**
**BigInt数据类型的目的是比`Number`数据类型支持的范围更大的整数值**，在对大整数执行数学运算时，以任意精度表示整数的能力尤为重要。使用`BigInt`，整数溢出将不再是问题。这是源于最初JS中的所有数字都以**双精度64位浮点格式**表示，在此标准下，无法精确表示的非常大的整数将自动四舍五入。确切的说，JS中的`Number`类型只能安全地表示某一范围内的证书，任何超出范围的整数值都可能会失去精度。`BigInt`就可以解决这个问题

**创建BigInt**只需要在整数的末尾追加一个`n`，或者用`BigInt()`构造函数传入字符串来生成
```javascript
console.log(9007199254740995n)
BigInt("9007199254740995")
```

**BigInt创建的数字不能与常规数字进行全等比较**，因为数据类型时不相同的，但可以用非全等进行比较
```javascript
console.log(10n == 10) // true
console.log(10n === 10) // false
```

##### 3) **NaN**

NaN是非数值是一个特殊的数值，这个数值表示一个本来要返回数值的操作数未返回数值的情况，以防影响其他代码的执行。

* 任何涉及`NaN`的运算，都会返回`NaN`
* `NaN`不等于任何值，包含`NaN`本身，`NaN == NaN`返回`false`
* `isNaN()`可以判断数字是不是`NaN`
  
#### 2. 引用类型

JS的引用类型主要包含`Function`、`Object`、`Array`、`Date`、`RegExp`等

* **占用空间不固定**，保存在**堆内存**中。当我们在程序中创建一个对象时，这个对象将被保存到运行时数据区中，以便反复利用（因为对象的创建成本通常比较大），这个运行时数据区就是堆内存。堆内存中的对象不会随方法的结束而销毁，即便是方法结束后，这个对象还可能被另一个引用变量引用，只有当一个对象没有任何引用变量引用时，系统的垃圾回收机制才会在核实的时候进行回收
* **保存与复制的是指向对象的一个指针**
* **使用instanceof检测数据类型**
* **使用new()方法构造出的对象是引用型**
* **引用类型上可以添加属性和方法**

> 堆内存是动态分配的内存，大小不定也不会自动释放，存放引用类型，指那些可能由多个值构成的对象，保存在堆内存中，包含引用类型的变量，实际上保存的不是变量本身，而是指向该对象的指针

#### 3. 包装类型

前面我们提到了基本数据类型**不能添加属性和方法**，也就是基本类型不存在属性和方法，但其实我们日常使用中字符串、数字、布尔值其实都能够调用一些属性和方法。可以看出`Number`、`String`、`Boolean`是**包装类型**，也就是**原始类型的包装对象**。

```javascript
const str = new String('asd')
const num = new Number('123')
const bool = new Boolean(true)

console.log(typeof str) // object
console.log(typeof num) // object
console.log(typeof bool) // object

str === 'asd' // false
num === 123 // false
bool === true // false
```

### 二. 数据类型判断


JS数据类型的判断有很多方法，常见的就有`typeof`和`instanceof`等

#### 1. typeof

对于基本数据类型，可以使用`typeof`来判断数据类型

```javascript
console.log(typeof 1)           // number
console.log(typeof '')          // string
console.log(typeof true)        // boolean
console.log(typeof null)        // object
console.log(typeof undefined)   // undefined
console.log(typeof {})          // object
console.log(typeof [])          // object
console.log(typeof (() => {}))  // function
```

#### 2. instanceof

从上面的例子中，可以看到`typeof`的判断结果有些差强人意，部分数据类型没有办法用来区分，引用类型都会返回`object`。于是`instanceof`应运而生，用来判断一个变量是否是某个对象的实例，所以对于引用类型我们可以使用`instanceof`来判断。**instanceof本质上就是用来检测构造函数的prototype属性是否出现在某个实例对象的原型链上**

```javascript
console.log(1 instanceof Number)             // false
console.log('' instanceof String)            // false
console.log(true instanceof Boolean)         // false
console.log({} instanceof Object)            // true
console.log([] instanceof Array)             // true
console.log( (() => {}) instanceof Function) // true
```

我们可以看到前三个非常怪，后面三个可以得到正确的结果，但是用数据类型对象创建的实例就是对应的类型

```javascript
console.log(new Number(1) instanceof Number)        // true
console.log(new String('') instanceof String)       // true
console.log(new Boolean(true) instanceof Boolean)   // true
```

我们可以试着手写一下`instanceof`

```javascript
function _instanceof(left, right) {
    let leftPrototype = Object.getPrototypeOf(left)
    let rightPrototype = right.prototype
    while(true) {
        if (!leftPrototype) return false
        if (leftPrototype == rightPrototype) return true
        leftPrototype = Object.getPrototypeOf(leftPrototype)
    }
}
```

#### 3. constructor

constructor的本质和`instanceof`差不多，是判断判断对象的构造函数
```javascript
console.log((1).constructor == Number)             // true
console.log(('').constructor == String)            // true
console.log((true).constructor == Boolean)         // true
console.log(({}).constructor == Object)            // true
console.log(([]).constructor == Array)             // true
console.log(( (() => {})).constructor == Function) // true
```

可以看到基本上可以准确地检验出最常见的数据类型

#### 4. Object.prototype.toString.call()

```javascript
const a = Object.prototype.toString
console.log(a.call(1))          // [object Number]         
console.log(a.call(''))         // [object String]
console.log(a.call(true))       // [object Boolean]
console.log(a.call({}))         // [object Object]
console.log(a.call([]))         // [object Array]
console.log(a.call( (() => {})))// [object Function]
console.log(a.call(null))       // [object Null]
console.log(a.call(undefined))  // [object Undefined]

function Fn() {}
Fn.prototype = new Array()
var f = new Fn()
console.log(a.call(f) == Fn)    // false
console.log(a.call(f) == Array) // false
```
可以看到所有的数据类型都可以准确判断

#### 5. isArray

**isArray**用于判断是不是数组，相比`instanceof`，`Array.isArray()`可以检测出`iframes`的数据类型，但`Array.isArray()`的兼容支持没有`instanceof`更宽泛。

```javascript
var iframe = document.createElement("iframe");
document.body.appendChild(iframe);
xArray = window.frames[window.frames.length - 1].Array;
var arr = new xArray(1, 2, 3); // [1,2,3]

// Correctly checking for Array
Array.isArray(arr); // true
Object.prototype.toString.call(arr); // true
// Considered harmful, because doesn't work though iframes
arr instanceof Array; // false
```

#### 6. 总结

最终总结出来：

* **typeof**，只能用来检测基本数据类型和函数，无法区分引用数据类型，对于`null`、`数组`、`对象`都会返回`Object`
* **instanceof**，可以使用`object instanceof constructor`用来检测构造函数的原型是否在参数`object`的原型链上。可以正常检测数组，对象和函数，不能检测对象字面量创建的基本类型，如字符串，数组和布尔值，通过`new`关键字创建的基本数据类型才能正常检测，也不能检测`null`和`undefined`
* **constructor**，返回对象的构造函数，可以检测基本数据类型和引用数据类型，但改变原型指向后，属性会跟着改变，检测也会变得不严谨，也不能检测`null`和`undefined`
* **Object.prototype.toString.call**，可以检测所有数据类型，包含`null`和`undefined`，并不会向`constructor`那样随着对象原型指向的改变而改变
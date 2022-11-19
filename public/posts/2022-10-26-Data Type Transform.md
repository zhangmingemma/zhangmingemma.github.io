<!-- ---
title: JS基础系列之数据类型隐式转换
date: 2022-10-26
tags: JS基础系列
set: BaseJS
--- -->

JS在一些操作符下类型会做一些变化，所以JS灵活，也易出错，并且难以理解。涉及隐式转换最多的是两个运算符`+`和`==`。其中`+`运算符即可数字相加，也可以字符串相加，所以转换的时候会很麻烦，`==`不同于`===`，故也存在隐式转换，但像`-*/`这些运算符只会针对`number`，因此转换的结果也只能是转换为`number`类型。

隐式转换中主要涉及到三种转换：
* 将值转为原始值，`ToPrimitive()`
* 将值转为数字，`ToNumber()`
* 将值转为字符串，`ToString()`

### 一. ToPrimitive将值转为原始值

JS引擎内部的抽象操作`ToPrimitive`的使用方法是`ToPrimitive(input, preferredType)` 其中`input`是要转换的值，`preferredType`是可选参数，可以是`Number`或`String`类型，只是一个转换标志，转换后的结果并不一定是这个参数所指的类型，但转换结果一定是一个原始值

#### 1. 如果`preferredType`是`Number`

* 如果输入的值已经是一个原始值，直接返回
* 如果输入的值是一个对象，调用对象的`valueOf()`。如果对象的`valueOf()`返回值是一个原始值，则直接返回；否则，调用对象的`toString()`，如果返回值是一个原始值，则返回这个原始值，否则抛出`TypeError`异常

#### 2. 如果`preferredType`是`String`

* 如果输入的值已经是一个原始值，直接返回
* 如果输入的值是一个对象，调用对象的`valueOf()`。如果对象的`valueOf()`返回值是一个原始值，则直接返回；否则，调用对象的`toString()`，如果返回值是一个原始值，则返回这个原始值，否则抛出`TypeError`异常

#### 3. 如果`preferredType`不填

* 如果对象为`Date`类型，则`preferredType`则设置为`String`，否则`preferredType`被设置为`Number`

#### 4. `valueOf`和`toString`

所有对象都有`valueOf`和`toString`的方法，在`Object.prototype`上面。首先我们来看看`valueOf`转换的结果是什么？

**1) `Number`、`Boolean`和`String`这三种构造函数生成的基础值对象形式，通过`valueOf`转换后会变成相应的原始值**

```javascript
const num = new Number('123')
num.valueOf() // 123

const str = new String('12df')
str.valueOf() // 12df

const bool = new Boolean('fd')
bool.valueOf() // true
```

**2) Date这种特殊对象，其原型`Date.prototype`内置`valueOf`函数将日期转换为日期的毫秒的形式的数值**

```javascript
const a = new Date()
a.valueOf() // 1668866962913
```

**3) 除`Number`、`Boolean`和`String`、`Date`之外，`valueOf`返回的都是`this`，即对象本身**

```javascript
const a = new Array()
a.valueOf() === a  // true

const b = new Object()
b.valueOf() === b  // true

const sym = Symbol()
sym.valueOf() === sym // true
```

**4) `Number`、`String`、`Boolean`、`Array`、`Date`、`RegExp`、`Function`、`Symbol`这几种构造函数生成的对象，通过`toString`转换后会变成相应的字符串的形式，因为这些构造函数上都封装了自己的`toString`方法。**

```javascript
Number.prototype.hasOwnProperty('toString') // true
String.prototype.hasOwnProperty('toString') // true
Boolean.prototype.hasOwnProperty('toString') // true
Array.prototype.hasOwnProperty('toString') // true
Date.prototype.hasOwnProperty('toString') // true
RegExp.prototype.hasOwnProperty('toString') // true
Function.prototype.hasOwnProperty('toString') // true

const num = new Number('123sd')
num.toString() // 'NaN'

const str = new String('12df')
str.toString() // '12df'

const bool = new Boolean('fd')
bool.toString() // 'true'

const arr = new Array(1,2)
arr.toString() // 1,2

const date = new Date()
date.toString() // Sat Nov 19 2022 22:47:59 GMT+0800 (中国标准时间)

const reg = new RegExp()
reg.toString() // /(?:)/

const func = function() {}
func.toString() // function() {}

const symbol = Symbol()
symbol.toString() // Symbol()
```

**5) 除`Number`、`String`、`Boolean`、`Array`、`Date`、`RegExp`、`Function`之外，其他对象都是返回`Object.prototype.toString`**

```javascript
const obj = new Object({})
obj.toString() // [object Object]

Math.toString() // [object Math]
```

总之，总结一下`ToPrimitive`转换数字的整体步骤是，`toPrimitive(input, preferredType)`有两个入参，第一个是转换的值，第二个是建议转换的类型，只能是`Number`或`String`。

* 当`preferredType`是`Number`时，`input`为原始值，则输出原始值，`input`为非原始值时，先用`valueOf`判断，`valueOf`还无法输出原始值，则利用`toString()`判断并输出原始值，否则输出`TypeError`
* 当`preferredType`是`String`时，`input`为原始值，则输出原始值，`input`为非原始值时，先用`valueOf`判断，`valueOf`还无法输出原始值，则利用`toString()`判断并输出原始值，否则输出`TypeError`
* 当`preferredType`不填时，`input`为`Date`类型，则设定`preferredType`为`String`，`input`为其他类型时，则设定`preferredType`为`Number`

其中需要`valueOf`来判断则：
* 针对`Number`、`String`和`Boolean`包装类型，`valueOf`将会转换为其原始值
* 针对`Date`类型，`valueOf`输出对应的毫秒时间戳
* 针对其他类型，`valueOf`输出对象本身

需要`toString`来判断则：
* 针对`Number`、`String`、`Boolean`、`Array`、`Date`、`RegExp`、`Function`、`Symbol`，`toString`输出对应的字符串
* 针对`Object`和`Math`，则`toString`输出对象类型

### 二. ToNumber

* `undefined`，输出`NaN`
* `null`，输出`+0`
* `布尔值`，`true`输出1，`false`转换为`+0`
* `数字`，无需转换
* `字符串`，有字符串解析为数字，否则转换为`NaN`
* `对象`，先进行`ToPrimitive(input, Number)`转换得到原始值，再转换为数字

### 三. ToString

* `undefined`，输出`undefined`
* `null`，输出`null`
* `布尔值`，输出`true`或`false`
* `数字`，输出数字转换的字符串
* `字符串`，无需转换
* `对象`，先进行`ToPrimitive(input, String)`转换得到原始值，再转换为字符串

举例来看，`({} + {}) == ?`
* 两个对象的值进行`+`运算符，肯定要先进行隐式转换为原始类型才能进行计算
* 进行`ToPrimitive`转换，由于没有指定类型，`{}`默认为`Number`
* 所以先执行`valueOf`，输出的是对象本身
* 再执行`toString`，输出`[object Object]`
* 所以最终结果是`[object Object][object Object]`

第二个例子`2 * {}`
* 首先`*`运算符，只能针对数字进行计算，因此先将`{}`执行`ToPrimitive({}, Number)`
* 首先执行`valueOf`，返回的是`{}`本身，还是个对象
* 再执行`toString`，返回`[object Object]`
* 最后，二者相乘，无法得出结果，所以最终输出`NaN`

### 四. ==隐式转换

隐式转换`x`和`y`的步骤是：

1. 如果`Type(x)`和`Type(y)`相同
    1). `Type(x)`和`Type(y)`都是`undefined`，则返回`true`
    2). `Type(x)`和`Type(y)`都是`null`，则返回`true`
    3). `Type(x)`和`Type(y)`都是`Number`，则
       * 如果`x`或`y`是`NaN`，则返回`false`
       * 如果`x`与`y`是相等数值，则返回`true`
       * 如果`x`为`+0`，`y`为`-0`，则返回`true`
       * 如果`x`为`-0`，`y`为`+0`，则返回`true`
       * 否则返回`false`
    4). `Type(x)`和`Type(y)`都是`String`，则必须是相同的字符串，返回`true`，否则返回`false`
    5). `Type(x)`和`Type(y)`都是`Boolean`，则当二者都是`false`或`true`，则返回`true`，否则返回`false`
    6). `x`和`y`为引用同一对象则返回`true`，否则返回`false`

如果`Type(x)`和`Type(y)`不同
2. `x`为`null`，`y`为`undefined`，则返回`true`
3. `x`为`undefined`，`y`为`null`，则返回`true`
4. `Type(x)`为`Number`，`Type(y)`为`String`，则返回`x == ToNumber(y)`
5. `Type(x)`为`String`，`Type(y)`为`Number`，则返回`ToNumber(x) == y`
6. `Type(x)`为`Boolean`，则返回`toNumber(x) == y`的结果
7. `Type(y)`为`Boolean`，则返回`x == toNumber(y)`的结果
8. `Type(x)`为`String`或`Number`，`Type(y)`为`Object`，则返回`x == ToPrimitive(y)`的结果
9. `Type(x)`为`Object`，`Type(y)`为`String`或`Number`，则返回`ToPrimitive(x) == y`
10. 否则返回`false`

### 五. 隐式转换例子

#### 1. [] == !{}

* `!`运算符优先于`==`，因此先进行`!`运算
* `!{}`输出结果为`false`，那么最终要比较的就是`[] == false`
* 按照第7条的规则，`Type(y)`为`Boolean`，则返回`[] == ToNumber(false)`即`[] == 0`
* 按照第9条的规则，`Type(y)`为`Number`，`Type(x)`为`Object`，则返回`ToPrimitive([], Number) == 0`，按照`ToPrimitive`的规则，则先按照`valueOf`转换为`[]`，再按照`toString`转换为`''`，则是比较`'' == 0`
* 再按照第5条的规则，`Type(x)`为`String`，`Type(y)`为`Number`，则返回`ToNumber('') == 0`，即比较`0==0`，输出最终结果`true`

#### 2. 0 == [0]

* 根据上面的第8条规则，`Type(x)`为`Number`，`Type(y)`为`Object`，则返回`0 == ToPrimitive([0])`
* `ToPrimitive([0])`需要对`[0]`调用`valueOf`，返回数组本身，再调用`toString`返回数组`join`后的值，即`0`，最终返回`0=='0'`
* 在根据第4条，`Type(x)`为`Number`，`Type(y)`为`String`，则返回`x == ToNumber(y)`，`ToNumber('0')`的值为`0`，则返回`0 == 0`
* 最终输出结果为`true`

#### 3. -1 == false

* 根据上面的第7条规则，`Type(y)`为`Boolean`，则返回`-1 == ToNumber(false)`
* `ToNumber(false)`值等于`0`，则返回`-1 == 0`
* 最终输出结果为`false`

#### 4. 如何让`a=[1,2,3]`，`a==1 && a==2 && a == 3`输出true

这个判断`a==1`、`a==2`和`a==3`，根据上面第9条的隐式转换规则，`Type(y)`为`Number`，`Type(x)`为`Object`，则判断`ToPrimitive(x) == y`，那需要先调用`valueOf`，再调用`toString`方法

因此要实现上面的输出，我们可以改写`a`的`valueOf`方法，或者也可以改写`a`的`toString`方法，改写本身的方法包含有几种解法，直接赋值，其次用`Object.defineProperty`和`Proxy`三种办法。

**解法一. 改写valueOf和toString方法**

```javascript
let a = {
    i: 1,
    valueOf() {
        return this.i++
    }
}
console.log(a == 1 && a == 2 && a == 3) // true
```

**解法二. 通过Object.defineProperty改写数组join**：按照上面说的，`a`调用`toString`，是将数组执行`join`，我们可以用`Object.defineProperty`来改写数组的`join`方法

```javascript
let a = Object.defineProperty([1,2,3], 'join', {
    get: function() {
        return () => this.shift()
    }
})
console.log(a == 1 && a == 2 && a == 3) // true
```

**解法三. 使用Proxy代理构造get**：利用`Proxy`来改写

```javascript
let a = new Proxy(
    { v : 1 },
    {
        get(target, property, receiver) {
            if (property === Symbol.toPrimitive) {
                return () => target.v++
            }
        }
    }
)
console.log(a == 1 && a == 2 && a == 3) // true
```


参考文献：
https://juejin.cn/post/6844903557968166926





**自我介绍**
我叫张敏，本科硕士都毕业于武汉大学，本硕期间学习的是遥感专业，毕业后入职腾讯微信事业部搜索应用部，之后就一直在这边工作，入职的时候是5级，2年半，也就是今年年初升到了9级。微信搜索应用部主要的业务范围就是微信内的搜索场景，常见的包含小程序、公众号、视频号的垂搜，还有搜索的前置教育页，还有发现页的搜一搜、看一看。工作的这三年中，最开始我是负责一些探索性的业务的微信小程序开发，后来负责看一看的业务迭代，今年年初开始负责发现-搜一搜的部分业务卡片的迭代，还有一部分前置搜索教育页，还有B端运营平台、辅助开发提效的白板系统。这三年来负责的业务线涉及到PC端、移动端两端，也涉及H5、小程序这两种载体。

**Vue**
1. 组件通信
父子组件通信：
* prop, emit
* $refs
* $parent, $children
* @hook:mounted

隔代组件通信：
* provide, inject
* $attrs, $listeners

任一组件通信：
* eventBus
* vuex

**CSS**

1. **CSS3的新特性**
* 边框：`border-radius` 
* 装饰：`text-decoration` `text-shadow` `box-shadow`
* 背景：`background-image` `linear-gradient`
* 动画：`transition` `translate` `transform` `scale` `rotate`

2. **BFC是什么？**
BFC，Blocking Formatted Context，块级格式化上下文，是一种格式化布局方式，BFC内的元素的布局不受外部环境影响，并且也不会影响外部环境。

BFC的生成方式包含：
* overflow的值，值不等于`hidden`，值等于`hidden/auto/scroll`
* 绝对定位，position的值等于`absolute/fixed`
* 浮动定位，float
* display的值，值等于`inline-block` `table-cells` `flex`
* html根元素

BFC的特点是：
* BFC内部的元素从顶到底依次排布，每个元素都贴BFC容器的左边排布
* BFC内部上下两个元素会存在margin塌陷的问题

BFC的应用场景：因为它不会受外部环境的影响，也不会影响外部环境，因此：
* 可以用来清除浮动，让浮动元素包裹在BFC中，避免因为浮动影响到页面内其他元素的布局
* 两个元素如果有margin塌陷，可以将其中一个用BFC包裹起来，避免margin塌陷的问题

BFC中的FC其实就是格式化上下文，其实就是一种布局模式，除了BFC，还有IFC和FFC，IFC就是行内格式化上下文，FFC是Flex格式化上下文。IFC是一个块级元素，如果里面包含的全部都是行内元素，就形成了一个IFC

IFC的特点是：
* IFC内部的元素从左到右顺次排列，放不下会换行，垂直方向由vertical-align来确定垂直对齐方向
* 高度的计算是通过内容来决定的，如果没有换行的话，由所有元素中最高的决定
* 一旦插入一个块级元素，就会换行，但不会彼此重叠

IFC的应用场景：
* 用来实现元素的对齐

3. **浮动是什么？为什么要清除？如何清除？**
浮动就是指使用`float`进行布局，让元素脱离了正常的文档流，导致承载浮动元素的父容器高度塌陷，从而影响到页面内其他元素的布局。所以要清除浮动来消除浮动元素对页面内其他元素的影响。清除的方法大致可以分为两种
* 父元素设置`overflow:hidden`
* 新增一个空白隐藏的元素，设置`clear:both`，新增空白元素有两种方式，一种是显式地直接新增；另一种就是通过伪类新增

```css
.container::after {
    content: '';
    visibility: hidden;
    height: 0;
    display: block;
    clear: both;
}
```

4. **隐藏元素的方法有哪些？**
隐藏元素的方法包含有：
* `opacity:0` 占据空间，可以交互
* `visibility:hidden` 占据空间，不可以交互
* `display:none` 不占据空间，不可以交互
* `z-index: -888` 置于底层，达到隐藏的目的
* `position:absolute` 通过绝对定位将元素的位置移至可视范围之外
* `overflow:hidden` 将元素设置成一个会被溢出的元素，通过`overflow`将其隐藏
* `transform:scale(0)` 将元素缩小成0，则可以隐藏掉

5. **行内元素是什么？块级元素是什么？替换元素是什么？**
行内元素就是元素都放在相同的行内，不会换行，设置`display:inline` 的元素就是行内元素，行内元素的宽度是由内容决定的，无法设置具体的宽度和高度，可以设置水平边距，但垂直边距不会生效。`span` `strong` `b` `strong` `input` `img` `textarea`

块级元素就是一行放一个元素，设置`display:block`的元素就是块级元素，块级元素可以自定义宽度和高度，也可以设置水平和垂直的边距，可以生效 `p` `h1-h5` `head` `div` `section` `li` `ul` `ol` `tr` `th` `td` `tbody` `table`

块级行内元素就是设置`display:inline-block`的元素，既可以都在一行内展示，水平垂直边距也可以生效，也可以自定义自己的宽度和高度

替换元素就是展示的样式不是标签决定的，而是由标签的属性决定的，`img` `input`

6. **css性能优化有哪些方式**
* 压缩css文件
* 去除冗余css样式，压缩css文件只能去除多余的空格，可以通过引用Uncss库来去除冗余的css样式
* 重要的与首屏渲染相关的样式用内联样式的写法写进去
* 与首屏渲染关联不大，可以引用外部文件异步加载，不去阻塞JS逻辑运行
* 选择器要用好，有id选择器的可以不用再嵌套其他的选择器，多层嵌套的选择器解析的效率较低
* 用link，不要用@import
  * 原因是因为link是顺着html的解析顺序解析的，@import是在页面加载完去加载解析的，可能会扰乱css的加载顺序
  * link还可以加载css文件之类的，@import只能加载一些css语法规则
  * link可以用JS来控制添加，但是@import不能
  * @import可能会有浏览器的兼容问题，但是link不存在兼容问题
* 减少重排和重绘，transform不会引发重排
  * 重排，是指元素的位置、大小发生变化之后，导致页面的布局发生改变
  * 重绘，是指元素的外观发生改变，比如背景色、透明度之类的
* 可以将一些小图标合并成一张雪碧图，可以合并图像的请求，但这样引用图标比较麻烦，并且其中一个图标发生改变，可能其他的图标的引用都会发生改变

7. **css的文字大小单位**
px是像素，是相对于浏览器屏幕大小的，是一种绝对的尺寸单位，更适用于固定宽高，不需要响应式的布局样式，比如说我们生成的活动卡片、海报等
em是相对于内容字体大小的，一种相对的尺寸单位，默认16px = 1em，比如一个元素的font-size:20px，那么它和它的子元素定义1em就是指20px。font-size是可以继承的
rem是相对于根节点字体大小的，一种相对的尺寸单位

8. **图像的格式**
png，是16进制，支持透明，但不支持动画，基于8位或24位索引色的位图格式，无损压缩的，相比于jpg尺寸较小
gif，也是基于索引色的位图格式，支持透明，支持动画，是无损压缩的
jpg，是基于直色的图片格式，有损压缩移除了人眼不可辨认的一些颜色值

**ES6**

1. 数据类型
基本数据类型：Null Undefined Number String Boolean

ES6新增数据类型
* Set，不重复的列表，和数组的区别是
 * 数组有重复值，set没有
 * 都可以通过new构造函数来创建，`const arr = new Array()`，`const set = new Set()`
 * 数组的访问方法有`push` `shift` `pop` `unshift` `length` `splice`，set的访问方法有`add` `delete` `size`
* Map，是一个映射表
 * 和数组的区别是，数组的key是索引值，就是下标，但map的key可以是任意值
 * 和对象的区别是
   * 对象的key是字符串，但map的key可以是任意值
   * 都可以通过new构造函数来创建
   * 对象设置属性是通过`[]``.`实现的，map设置属性是通过`get``set`来实现的，都可以通过delete来删除属性
   * 对象可以通过`keys``values`来获取键名和值，map也是一样的
   * map是可以通过二元数组来设置
* WeakSet，不重复的列表，和set相比，唯一的区别就是每个元素都是对象，但这个对象是弱引用的，用完了就会被回收，所以说WeakSet是不可以遍历的
* WeakMap，map的键名也只能是对象，但这个对象也是弱引用的，用完了会被回收，因此keys也是不可用的，也是不可以遍历的
* Symbol，代表独一无二的值，是ES6新增的基本数据类型，可以通过`Symbol()`来创建一个独一无二的值，因此symbol可以用作对象的属性，不会出现属性被覆盖的情况，symbol类型作为对象属性的时候，要通过`[]`来访问，不能用`.`来访问。`Symbol()`内可以传入一个字符串，表示Symbol的描述，但`const a = Symbol('foo') const b = Symbol('foo')`中`a`和`b`都不一样的，但是通过`Symbol.for('foo')`可以创建相同的值。

2. Class
ES5中定义可以在构造函数的原型上设置属性和方法进行扩展
```javascript
function Point(x, y) {
    this.x = x
    this.y = y
}
Point.prototype.getArea = function() {
    return this.x * this.y
}
const point = new Point()
```

Class是ES6提供的一种语法糖，能够将相同用途功能的方法属性集中在一起，方便管理
```javascript
class Point {
    constructor(x,y) {
        this.x = x
        this.y = y
    }
    getArea() {
        return this.x * this.y
    }
}
```

Class的几个特点：
* 也可以通过`new`来创建实例，但不能直接执行，也不存在变量提升，如果在声明class之前调用，会报错。但构造函数就可以有变量提升，也可以直接当成函数去调用
* constructor，在创建实例的时候就会自动执行
* static，静态属性，实例不能获取对应属性，`new Point().x`获取不到静态属性
* getter和setter，必须要成对出现，表示取值、更新值时执行的逻辑
* extends表示继承父类，constructor中必须要`super`执行父类，但`super`要在`this`之前，否则会报错

3. Promise
```javascript
class myPromise {
    static PENDING = 'pending'
    static FULFILLED = 'fulfilled'
    static REJECTED = 'rejected'

    constructor(fn) {
        this.promiseStatus = myPromise.PENDING
        this.promiseResult = null
        this.onFulfilledCallbacks = []
        this.onRejectedCallbacks = []
        try {
            fn(this.resolve.bind(this), this.reject.bind(this))
        } catch(e) {
            this.reject(e)
        }
    }

    resolve(result) {
        if (this.promiseStatus == myPromise.PENDING) {
            this.promiseStatus = myPromise.FULFILLED
            this.promiseResult = result
            this.onFulfilledCallbacks.forEach(callback => {
                callback(this.promiseResult)
            })
            
        }
    }
    
    reject(reason) {
        if (this.promiseStatus == myPromise.PENDING) {
            this.promiseStatus = myPromise.REJECTED
            this.promiseResult = reason
            this.onRejectedCallbacks.forEach(callback => {
                callback(this.promiseResult)
            })
        }
    }

    then(onFulfilled, onRejected) {
        const pro = new Promise((resolve, reject) => {
            if(this.promiseStatus == myPromise.FULFILLED) {
                setTimeout(() => {
                    try {
                        if (typeof onFulfilled == 'function') {
                            const res = onFulfilled(this.promiseResult)
                            resolvePromise(pro, res, resolve, reject)
                        } else {
                            resolve(this.promiseResult)
                        }
                    } catch(e) {
                        reject(e)
                    }
                })
            } else if (this.promiseStatus == myPromise.REJECTED) {
                setTimeout(() => {
                    try {
                        if (typeof onRejected == 'function') {
                            const res = onRejected(this.promiseResult)
                            resolvePromise(pro, res, resolve, reject)
                        } else {
                            reject(this.promiseResult)
                        }
                    } catch(e) {
                        reject(e)
                    }
                })
            } else if (this.promiseStatus == myPromise.PENDING) {
                this.onFulfilledCallbacks.push(
                    setTimeout(() => {
                        try {
                            if (typeof onFulfilled == 'function') {
                                const res = onFulfilled(this.promiseResult)
                                resolvePromise(pro, res, resolve, reject)
                            } else {
                                resolve(this.promiseResult)
                            }
                        } catch(e) {
                            reject(e)
                        }
                    })
                )
                this.onRejectedCallbacks.push(
                    setTimeout(() => {
                        try {
                            if (typeof onRejected == 'function') {
                                const res = onRejected(this.promiseResult)
                                resolvePromise(pro, res, resolve, reject)
                            } else {
                                reject(this.promiseResult)
                            }
                        } catch(e) {
                            reject(e)
                        }
                    })
                )
            }
        })
        return pro
    }

    catch(onRejected) {
        return this.then(null, onRejected)
    }

    finally(callback) {
        return this.then(callback, callback)
    }
}

function resolvePromise(promise, x, resolve, reject) {
    if (x instanceof myPromise) {
        x.then(y => resolvePromise(promise, y, resolve, reject), reject)
    } else if (x !=null && (typeof x == 'object' || typeof x == 'function')){
        try {
            var then = x.then
        } catch(e) {
            reject(e)
        }
        if (typeof then == 'function') {
            try {
                then.call(
                    x,
                    y => resolvePromise(promise, y, resolve, reject),
                    r => reject(r)
                )
            } catch(e) {
                reject(e)
            }
        } else {
            resolve(x)
        }
    } else {
        resolve(x)
    }
}
```
Promise的基本特点：
* Promise是一种异步方法，需要传入一个执行函数，会立即执行，执行结果出来之后，会执行then这个方法。
* Promise有三种状态，PENDING是初始状态，FULFILLED是成功执行后的状态，REJECTED是出错后的状态
* 状态一旦改变不会发生扭转和改变
* 执行过程出错，then中出错，都会触发catch方法
* then也是返回一个promise实例，第一个参数就是执行成功后的回调，第二个参数就是执行失败后的回调

```javascript
Promise.protype._all = function(promises) {
    return new Promise((resolve, reject) => {
        let count = 0, resArr = []
        promises.forEach(promise => {
            Promise.resolve(promise).then(res => {
                resArr.push(res)
                count += 1
                if (count == promises.length) resolve(resArr)
            }).catch(e => reject)
        })
    })
}
```

Promise的几个方法：
* all：返回Promise实例，接收一个Promise数组作为参数，数组中每个元素都要是一个Promise实例，所有实例执行完成才执行，所有实例的执行结果作为promise.all的结果，只要其中一个报错了，就会报错，第一个错误就是Promise.all的catch的结果
* any：返回promise实例，接收一个promise数组作为参数，数组中每个元素都要是一个promise实例，任一实例成功就会成功，所有失败才会失败，第一个成功执行的promise实例的结果就是promise.any的结果，所有的错误数组就是promise.any的结果
* race：只返回第一个的结果
* allSettled：返回一个数组，里面包含status，result的结果

**JS**

1. 判断JS数据类型的方法
typeof 用来判断基本类型 Object Number String Boolean Undefined Symbol
```javascript
typeof 1 // number
typeof '' // string
typeof ()=>{} // function
typeof true // boolean
typeof undefined // undefined
typeof null // object
typeof [] // object
typeof {} // object
typeof Symbol() // symbol
```
instanceof `a instanceof b`用来判断a是不是b的实例，一般用来区分引用类型， null, undefined不能用instanceof判断，基本数据类型也不能用instanceof来判断
```javascript
[] instanceof Array // true
{} instanceof Object // true
new Date() instanceof Date // true
new RegExp() instanceof RegExp // true
(1) instanceof Number // false
(null) instanceof Object // 报错
(null) instanceof Null // 报错
```
constructor `(a).constructor == b`用来判断a的构造函数是不是b，和`instanceof`差不多，但是可以判断基本类型，但null和undefined还是不行
```javascript
([]).constructor == Array // true
({}).constructor == Object // true
(1).constructor == Number // true
('').constructor == String // true
(true).constructor == Boolean // true
(() => {}).constructor == Function // true
```

Object.prototype.toString.call() 用来判断所有的，但是需要对结果进行一定的处理才能判断
```javascript
Object.prototype.toString.call(1) // [Object Number]
Object.prototype.toString.call('') // [Object String]
Object.prototype.toString.call(true) // [Object Boolean]
Object.prototype.toString.call(null) // [Object Null]
Object.prototype.toString.call(undefined) // [Object Undefined]
Object.prototype.toString.call([]) // [Object Array]
Object.prototype.toString.call({}) // [Object Object]
Object.prototype.toString.call(() => {}) // [Object Function]
```

2. 原型与原型链
每个函数都有一个属性`prototype`，它指向的是构造函数创建的实例的`__proto__`，每个对象都有一个属性时`__proto__`，这个属性就是自己的原型，`__proto__.constructor`指向构造函数，这个链条就是原型链，原型链的顶层是`Object`，`Object.prototype.__proto__`等于`null`，`null`没有原型

继承的方法：继承是为了让子类能够继承父类的属性和方法，实现方法的复用
* 可以借用构造函数：无法实现多继承，多个实例继承同一引用地址，引用类型的数据都相同，也不能向父类构造函数传参，
```javascript
function Person() {}
Person.prototype.say = function() {}
Person.prototype.name = ''
function Child() {}
Child.prototype = new Person()
Child.prototype.constructor = Child
```
* 可以在子类中调用父类：能够传参，实例之间也可以独立，不会共享引用类型，但是因为没有继承原型，所以没有办法继承原型上的方法和属性
```javascript
function Person(x) {}
Person.prototype.say = function() {}
Person.prototype.name = ''
function Child(x) {
    Person.call(this, x)
    ...
}
```
* 组合二者进行优化：
```javascript
function Person(x) {}
Person.prototype.say = function() {}
Person.prototype.name = ''
function Child(x) {
    Person.call(this, x)
}
Child.prototype = Object.create(Person.prototype)
Child.prototype.constructor = Child
```

3. call/bind/apply
三者都是为了改变函数执行的上下文，也就是this指向的。
* call: 第一个参数是this，之后的参数是函数的参数铺平
```javascript
Function.prototype._call = function(context) {
    context = context || window
    context.fn = this
    const args = [...arguments].slice(1)
    const res = context.fn(args)
    delete context.fn
    return res
}
```
* apply: 第一个参数是this，第二个参数的数组，数组中的元素就是函数执行的参数
```javascript
Function.prototype._apply = function(context, args) {
    context = context || window
    context.fn = this
    let res
    if (!args || !args.length) {
        res = context.fn()
    } else {
        res = context.fn(args)
    }
    delete context.fn
    return res
}
```
* bind: 
  * 不会立刻执行，而是返回一个改变执行上下文的函数，需要手动调用
  * 返回的函数可以当做构造函数来用
  * 函数参数柯里化，可以分次传入函数的参数

```javascript
Function.prototype._bind = function(context) {
    context = context || window
    const outer = [...arguments].slice(1)
    const self = this
    const foo = function(...args) {
        const final = outer.contact(args)
        const me = this instanceof self ? this : context
        return self.apply(me, final)
    }
    const fNop = () => {}
    fNop.prototype = this.prototype
    foo.prototype = new fNop()
    return foo
}
```

4. arguments的取法
类数组，有length，可以用索引取值，但是没有push/forEach之类的这些方法
```javascript
[...argument]
Array.prototype.slice.call(arguments)
Array.from(arguments)
```

5. new要做什么
为构造函数生成一个实例，这个实例能够继承构造函数的属性和方法，还能继承构造函数原型上的属性和方法
```javascript
function ObjectFactory(fn, args) {
    const constructor = fn
    const obj = new Object()
    obj.__proto__ = fn.prototype
    return fn.apply(obj, args)
}
```

6. 函数柯里化
就是函数可以分次传入参数，而不是一次性传入所有参数。一般是用于多次调用函数，但多次调用都有部分相同的参数，因此使用柯里化，能够更好的组织代码，提高代码的复用率和可读性
```javascript
function curry(fn) {
    function curried(...args) {
        if (fn.length < args.length) {
            return fn.apply(this, args)
        } else {
            function curried2(...args2) {
                return curried2.apply(this, [...args, ...args2])
            }
            return curried2
        }
    }
    return curried
}
```

7. 函数的节流和防抖

节流和防抖都是为了防止很短的时间内频繁地触发同一事件，导致页面逻辑阻塞，内存成本消耗太大

节流的原理是每隔一段事件就执行一次，适用于滑动条滚动过程中的限频、屏幕尺寸来回变化的限频
```javascript
function throttle(fn, delay) {
    let timer, lasttime = 0
    return function(args) {
        const self = this
        if (Date.now() - lasttime > delay) {
            fn()
            lasttime = Date.now()
        } else {
            if (timer) {
                clearTimeout(timer)
                timer = null
            } 
            timer = setTimeout(() => {
                fn.apply(self, args)
            },delay)
        }
    }
}
```

防抖debounce的原理是多次频繁调用同一事件，只触发最后一次，适用于输入字符之后进行验证，限制鼠标连击等
```javascript
function debounce(fn, delay) {
    let timer
    return function(...args) {
        if (timer) {
            clearTimeout(timer)
            timer = null
        }
        timer = setTimeout(() => {
            fn()
        }, delay)
    }
}
```

8. 闭包是指可以访问另一作用域内变量的函数，最常见的方法就是在一个函数中返回另一个函数。
可以用来创建共享的方法和私有方法和属性，在函数内返回共享的方法和属性，但是没有返回的就是外部不可访问的。但会导致内存泄漏，性能降低
```javascript
function foo() {
    let counter = 1
    function change(val) {
        counter = counter + val 
    }
    return {
        value() {
            return counter
        },
        incre() {
            change(1)
        },
        decre() {
            change(-1)
        }
    }
}
```

9. 事件流触发
是事件在触发元素和目标元素之间的触发顺序，先是捕获阶段，从顶层元素一直传递到目标元素的父元素，其次是目标阶段，触发事件到达目标元素，最后是冒泡阶段，触发事件从目标元素一直向上冒泡到根元素，可以用event.stopProganation, return false, event.preventDefault三种方式来阻止冒泡。

$ele.addEventListener('click', () => {}, false)，最后一位来定义事件在捕获阶段触发，还是在冒泡阶段触发，默认为在冒泡阶段触发，设为FALSE，

事件委托就是在顶层父容器绑定事件，通过event.target来区分执行不同的做法，很适用于一个列表用不同的参数去执行相同的方法，或者是有一些共同的参数，和逻辑，但是区分执行不同的方法逻辑这种场景

10. 发布者订阅者模式
发布者订阅者模式，就是在对象之间建立一对多的依赖关系，一个对象发布一个消息，依赖的多个对象都能接收到消息，执行对应的方法和逻辑，还可以撤销绑定
```javascript
class Observer {
    constrcutor() {
        this.listeners = {}
    }
    $on(key, fn) {
        if (!this.listeners[key]) {
            this.listeners[key] = []
        }
        this.listeners[key].push(fn)
    }   
    $off(key, fn) {
        if (!this.listeners[key]) return
        if (!fn) delete this.listeners[key]
        this.listeners[key] = this.listeners[key].filter(x => x != fn)
    }
    $emit(key, fn) {
        if (!this.listeners[key]) return 
        this.listeners[key].forEach(item => {
            if (typeof item == 'function') item()
        })
    }
}
```

11. 封装Ajax
```javascript
function Ajax(method, url, data) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onreadystatechange(() => {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    resolve(xhr.responseText)
                } else {
                    reject(xhr.statusText)
                }
            }
        })
        xhr.open(method, url)
        xhr.send(data)
    })
}
```
readyState:
* 0: 还没调用open
* 1: 调用open，还没send，已经初始化了，请求已经建立
* 2: 请求发送了，调用send
* 3: 请求已接收，已经收到部分相应数据
* 4: 请求已经完成，可以收到全部的响应数据

12. 深拷贝与浅拷贝
是针对引用类型的，基本类型都是深拷贝的，浅拷贝是指引用地址相同，只是两个不同的变量名，=就是浅拷贝；还有一种是不完全拷贝，就是第一层是深拷贝的，是不同的引用地址，但是第二层到里面都是浅拷贝的，是相同的引用地址，比如说.slice, Object.assign(), Object.create；深拷贝，就是从里面到最外层，所有的都是不同的引用地址
```javascript
function deepCopy(obj) {
    if (typeof obj != 'object' || obj == 'null') return obj
    let res = obj instanceof Array ? [] : {}
    for(let key in obj) {
        if (obj.hasOwnProperty(key)) {
            res[key] = deepCopy(obj[key])
        }
    }
    return res
}
```

13. 前端模块化
CommonJS：同步加载的，多用于服务端
* require，可以动态引入，首先根据路径去找到对应的模块并解析，然后引入的时候加载第一次之后就会标注已加载，并且会缓存，所以可以支持循环引用，循环引用也不会循环加载
* export，可以导出一个对象，但是是要用exports.变量逐个去命名对象中的变量，直接导出一个对象，在require中是拿不到值得，因为改变形参是不会有效果的
* module.export，可以导出一个方法，一个属性，比较灵活。

AMD：requireJS规范，是允许异步加载的，前置加载的
* define来定义模块，require来引入模块
* define引用模块之前，必须用[]来声明模块；require引用模块之前，也必须要用[]来声明模块，模块全部加载完会有一个回调函数，加载完才会执行回调函数
```javascript
define(['b'], function(b, require, export) {
    exports.a = function() {
        const b = require(b)
    }
})
```

CMD：SeaJS规范，是执行的时候才会去加载

ES6 Module：export 和 import
* export：
* import：支持模块的部分导入、混合导入、重命名，书写带来方便，会自动代码提升到顶层，所以不能写在判断语句，不能写在块级作用域，也不能参与运算

14.  垃圾回收
标记计数法：声明一个变量，就会被加上执行上下文的标记，然后离开上下文，就会被打上离开上下文的标记，然后就会被清除
引用计数法：声明变量的时候，赋予变量一个引用值，为1，每被引用一次，引用计数就加一，被引用的函数执行结束，就会减一，或引用该变量的上下文执行完了，变量被覆盖了，就会减一，引用数为0就会被回收


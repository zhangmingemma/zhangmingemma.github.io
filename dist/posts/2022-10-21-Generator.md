<!-- ---
title: ES6系列之Generator
date: 2022-10-21
tags: ES6系列
set: ES6
--- -->

Generator是一个状态机，封装了多个内部状态，执行`Generator`函数会返回一个遍历器对象，返回的遍历器对象可以依次遍历`Generator`函数内部的每一个状态。`Genrator`函数有两个特征：
* 函数体内部使用`yield`表达式，定义不同的内部状态
* `function`关键字和函数名之间有一个星号

```javascript
function* helloWorldGenerator() {
    yield 'hello';
    console.log('1')
    yield 'world';
    console.log('2')
    return 'ending';
}
const hw = helloWorldGenerator()
console.log(hw.next()) // {value:hello, done:false}
console.log(hw.next()) // 1 {value:world, done:false}
console.log(hw.next()) // 2 {value:end, done:true}
```

像上面的例子，`Generator`函数的调用方法与普通函数一样，可以在函数名后面加一对圆括号。不同的是，调用`helloWorldGenerator`之后，该函数并不执行，返回的也不是函数的执行结果，而是一个指向内部状态的指针对象，也就是我们在之前的<a href="https://zhangmingemma.github.io/#/post?file=2022-10-20-Iterator"  target="_blank">《ES6系列之Iterator》</a>文章中介绍的遍历器。下一步必须要调用遍历器对象的`next`方法，使得指针移向下一个状态，也就是调用`next`方法，内部指针就从函数头部或者上一次停下来的地方开始执行，直到遇到下一个`yield`表达式/`return`表达式。

### 1. Generator与Iterator

我们在之前的<a href="https://zhangmingemma.github.io/#/post?file=2022-10-20-Iterator"  target="_blank">《ES6系列之Iterator》</a>文章中说过任意一个对象的`System.iterator`方法，等于该对象的遍历器生成函数，调用该函数会返回对象的一个遍历器对象。`Genrator`函数就是遍历器生成函数，因此可以把`Generator`赋值给对象的`Symbol.iterator`属性，从而使得该对象具有`Iterator`接口。

```javascript
let myIterable = {}
myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
}
[...myIterable] // 1, 2, 3
```

### 2. next

**yield**表达式本身没有返回值，或者说总是返回`undefined`，`next`方法可以带一个参数，该参数就会被当做上一个`yield`的返回值

```javascript
function* f() {
    for(let i = 0; true; i++) {
        const reset = yield i
        console.log('reset', reset)
        if (reset) i = -1
    }
}
const g = f()
console.log(g.next()) 
console.log(g.next())
console.log(g.next(true)) 
// {value:0, done:false}
// reset undefined
// {value:1, done:false}
// reset true
// {value:0, done:false}
```

上面的例子中定义了一个会无限循环的`Generator`函数`f`，如果`next`方法没有参数，每次运行到`yield`，变量`reset`的值总是`undefined`，当`next`带一个参数`true`时，将上一次`yield`表达式，也就是变量`reset`的值设为`true`，那么`i=-1`，执行`i++`之后，下一次就是返回`0`了。

```javascript
function* dataConsumer() {
  console.log('Started');
  console.log(`1. ${yield}`);
  console.log(`2. ${yield}`);
  return 'result';
}

let genObj = dataConsumer();
console.log(genObj.next())
console.log(genObj.next('a'))
console.log(genObj.next('b'))
// Started
// {value:undefined, done:false}
// 1. a
// {value:undefined, done:false}
// 2. b
// {value:result, done:true}
```
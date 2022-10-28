<!-- ---
title: JS深入系列之发布-订阅者模式
date: 2022-10-27
tags: JS深入系列
set: DeepJS
--- -->

发布-订阅模式其实是一种对象间一对多的依赖关系，当一个对象的状态发送改变时，所有依赖与它的对象都将得到状态改变的通知。

* **订阅者**：把自己想订阅的事件注册到调度中心
* **发布者**：当发布者发布该事件到调度中心，也就是事件触发时，由调度中心统一调度度订阅者注册到调度中心的处理代码

发布-订阅者模式的优点是对象之间的解耦，异步编程中，可以更松耦合的代码编写，缺点就是创建订阅者本身需要消耗一定的事件和内存，虽然可以弱化对象之间的联系，多个发布-订阅者嵌套的时候，程序难以跟踪维护

### 1. 手写实现发布-订阅模式

整体的发布-订阅模式的实现思路如下：

* 创建一个类
* 在类里创建缓存列表（调度中心）
* `on`方法：用来把函数`fn`添加到缓存列表
* `emit`方法：取到`event`事件类型，根据`event`值去执行对应缓存列表中的函数
* `off`方法：可以根据`event`事件类型取消订阅

```javascript
class Observer {
    constructor() {
        this.message = {}
    }
    $on(type, callback) {
        if (!this.message[type]) {
            this.message[type] = []
        }
        this.message[type].push(callback)
    }
    $emit(type, callback) {
        if (!this.message[type]) return 
        this.message[type].forEach(item => {
            if (typeof item == 'function') {
                item()
            }
        })
    }
    $off(type, callback) {
        if (!this.message[type]) return 
        if (!callback) {
            this.message[type] = undefined
            return 
        }
        this.message[type] = this.message[type].filter(x => x != callback)
    }
}
```
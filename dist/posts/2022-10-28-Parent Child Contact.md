<!-- ---
title: Vue基础系列之父子组件通信
date: 2022-10-28
tags: Vue基础系列
set: BaseVue
--- -->

Vue的组件通信通常包含以下三类：父子组件通信、隔代组件通信和兄弟组件通信。

### 一. 父子组件通信

#### 1. props和$emit

父组件向子组件传递数据是通过`props`传递的，子组件传递数据给父组件是通过`$emit`来触发事件做到的

```javascript
// 父组件
<heading :title="title" @update="updateTitle"></heading>
export default {
    components: { heading },
    data() {
        return {
            title: '标签'
        }
    },
    methods: {
        updateTitle(data) {
            this.title = data
        }
    }
}
// 子组件
export default {
    props: ['title'],
    methods: {
        emitData() {
            this.$emit('update', '新标签')
        }
    }
}
```

#### 2. $parent和$children

可以通过`$parent`和`$children`访问父组件和子组件。但需要注意的是**Vue3.0已经移除了`$children`这个特性**，不过即使是`Vue2.0`也建议通过 `$children` 的方式来获取子组件，**因为$children不保证执行顺序，也不是响应式的**

```javascript
// 父组件
<children></children>
export default {
    components: { children },
    data() {
        return {
            parentKey: 'value'
        }
    },
    mounted() {
        this.$children[0].childrenSay('yes')
    },
    methods: {
        parentSay(value) {
            console.log('parent say', value)
        },
        saySelf() {
            console.log('parent say self', this.parentKey)
        }
    }
}
// 子组件
export default {
    mounted() {
        this.$parent.parentSay('no')
        this.$parent.parentKey = 'children parent'
        this.$parent.saySelf()
    },
    methods: {
        childrenSay(value) {
            console.log('children say', value)
        }
    }
}
```

#### 3. $refs

如果在普通`DOM`元素上使用，引用指向的就是`DOM`元素，如果用在子组件上，引用就是指向组件实例

```javascript
// 父组件
<children ref="childrenRef"></children>
export default {
    mounted() {
        this.$refs.childrenRef.childrenSay('yes')
    }
}
// 子组件
export default {
    methods: {
        childrenSay(value) {
            console.log('children say', value)
        }
    }
}
```

#### 4. 生命周期监听

```javascript
// 父组件
<children @hook:mounted="doSomething"></children>
export default {
    methods: {
        doSomething() {
            console.log('父组件监听到子组件的mounted')
        }
    }
}
// 子组件
export default {
    mounted() {
        console.log('子组件触发mounted')
    }
}
// 输出
// 子组件触发mounted
// 父组件监听到子组件的mounted
```

### 二. 隔代组件通信

#### 1. $attrs和$listeners

可以通过`this.$attrs`访问父作用域传递给组件的属性，`this.$listeners`访问负作用域传递给组件的事件监听器。具体的特征包含：
* **this.$attrs**：访问组件传递给子组件的属性，但这些属性中不包含`props`中已经声明的属性，`props`声明的属性不再通过`attrs`传递。父组件通过`v-bind='$attrs'` 传入内部组件，可以将属性绑定继续向下传递。如果中间层组件想要添加其他属性，可以继续绑定属性，但如果与$attr重复，则继续绑定的属性优先
* **this.$listeners**：访问父作用域传递给组件的事件监听器。也可以通过`v-on="$listeners"`传入内部组件，将事件监听器继续向下传递。如果想要添加其他事件监听器，可以继续绑定事件，同样的，如果有重读，不会被覆盖，重复绑定的事件都会被执行。

```javascript
// test1
<template>
    <div>
        <h1>我是test1组件</h1>
        <test2 
            :foo="foo" :boo="boo" :coo="coo" :doo="doo" 
            @log1="log1" @log2="log2"
        ></test2>
    </div>
</template>
<script>
export default{
    components: { test2 },
    data() {
        return {
            foo: 'foo',
            boo: 'boo',
            coo: 'coo',
            doo: 'doo'
        }
    },
    methods: {
        log1(val) {
            console.log('我是test1中的log1方法', val)
        },
        log2(val) {
            console.log('我是test1的log2方法', val)
        }
    }
}
</script>
// test2
<template>
    <div>
        <h1>我是test2组件</h1>
        <button @click="toParent1()">触发log1方法</button>
        <test3 
            v-bind="$attrs" :coo="coo"
            v-on="$listeners"
        ></test3>
    </div>
</template>
<script>
export default{
    components: { test3 },
    inheritAttrs: false, // 关闭自动挂在在组件根元素上的没有在props声明的属性
    props: ['foo'],
    data() {
        return {
            coo: 'test2的coo'
        }
    },
    created() {
        console.log("test2组件this.$attrs:", this.$attrs); // {boo:'boo', coo:'coo', doo:'doo'}
        console.log("test2组件this.$props:", this.$props); // {foo:'foo'}
    },
    methods: {
        toParent1(val) {
            this.$listeners.log1("test2组件 $listeners执行 log1方法");
        }
    }
}
</script>
//test3
<template>
    <div>
        <h1>我是test3组件</h1>
        <button @click="toParent1()">触发log1方法</button>
    </div>
</template>
<script>
export default{
    props: ['boo'],
    created() {
        console.log("test2组件this.$attrs:", this.$attrs); // {coo:'test2的coo', doo:'doo'}
        console.log("test2组件this.$props:", this.$props); // {boo:'boo'}
    },
    methods: {
        toParent1(val) {
            this.$listeners.log1("test3组件 $listeners执行 log1方法");
        }
    }
}
</script>
```

#### 2. provide和inject依赖注入

这对选项要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次多深，在其上下游关系成立的时间里始终生效，`provide`和`inject`是两个钩子，和`data`、`methods`是同级的，`provide`用来发送数据或方法，`inject`用来接收数据和方法。**provide和inject的绑定并不是可响应的，如果传入了一个可监听的对象，其对象的property还是可响应的**

```javascript
// 父组件
var Provider = {
    provide: {
        foo: 'bar'
    }
}
// 子组件
var Child = {
    inject: ['foo'],
    created() {
        console.log(this.foo) // bar
    }
}
```

### 三. 任何组件通信

#### 1. eventBus

这个方法就是通过一个空的`Vue`实例作为中央事件总线，用它来触发事件和监听事件，从而实现任何组件之间的通信，包括父子、隔代、兄弟组件。

```javascript
// eventBus.js
import Vue from 'vue'
const eventBus = new Vue()
export default eventBus
// 父组件
<first-comm></first-comm>
<second-comm></second-comm>
// first-comm
export default {
    data() {
        return {
            num: 0
        }
    },  
    methods: {
        add() {
            eventBus.$emit('addition', {
                num: this.num++
            })
        }
    }
}
// second-comm
export default {
    created() {
        eventBus.$on('addition', params => {
            console.log('children', params)
        })
    }
}
```

#### 2. Vuex

Vuex是一个专为`Vue.js`应用程序开发的状态管理模式，每一个`Vuex`的核心就是`store`，`store`基本上就是一个容器，包含着应用中大多数公共的状态，状态的存储就是响应的，所有引入`vuex`的组件都可以拿到最新的数据，唯一改变公共数据的方式就是调用`vuex`的`mutation`显式地提交修改。


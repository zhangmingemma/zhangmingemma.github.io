<!-- ---
title: Vue2.0原理理解 (三)：组件化
date: 2022-07-08
tags: JavaScript, Vue
set: VueSourceCode
--- -->

Vue.js的另一个核心思想就是组件化。所谓组件化就是把页面拆分成多个组件，每个组件依赖的CSS、Javascript、模板和图片等资源放在一起，方便开发和维护。组件是资源独立的，组件在系统内部可复用，组件与组件之间可以嵌套。

本章节我们将从源码来逐次分析Vue组件初始化的过程，当使用Vue-cli初始化一个工程时，会有这样的初始化代码。这里的`render`传入的便是一个组件。

```javascript
import Vue from 'vue'
import App from './App.vue'

var app = new Vue({
  el: '#app',
  // 这里的 h 是 createElement 方法
  render: h => h(App)
})
```

## 一. createComponent

上一章我们知道视图渲染主要依赖`render`方法，`render`中最核心的是调用`_createElement`创建虚拟节点。在这个方法中便有创建组件的方法`createComponent`的引用。

```javascript
let vnode, ns
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (
      (!data || !data.pre) &&
      isDef((Ctor = resolveAsset(context.$options, 'components', tag)))
    ) {
      vnode = createComponent(Ctor, data, context, children, tag)
    } 
  } else {
    vnode = createComponent(tag as any, data, context, children)
  }
```

方法`createComponent`的调用在`src/core/vdom/create-component.ts`中，我们分段逐次来分析这个方法所做的事情

```javascript
export function createComponent(
  Ctor: typeof Component | Function | ComponentOptions | void,
  data: VNodeData | undefined,
  context: Component,
  children?: Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
    ...
}
```

### 1. 构造子类构造函数

```javascript
const baseCtor = context.$options._base

// plain options object: turn it into a constructor
if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor as typeof Component)
}
```

我们在上一章一.1节中讲Vue的初始化中提到，初始化文件中有一个是`src/core/index.ts`，可以看到这个文件中调用了`initGlobalAPI(vue)`的方法。`initGlobalAPI`中定义了`Vue.options._base`。

```javascript
// src/core/global-api/index.ts
import builtInComponents from '../components/index'

export function initGlobalAPI(Vue: GlobalAPI) {
  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue
  ...
}
```

此外，在`src/core/instance/init.ts`中的`_init`方法的定义中还有一段合并配置的逻辑，将Vue的options都扩展到了`vm.$options`上，我们在`createComponent`中取的也是`context.$options._base`，也就是Vue这个构造函数。

```javascript
// merge options
vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor as any),
    options || {},
    vm
)
```

在了解了`baseCtr`的定义之后，可以看下`extend`方法的定义，了解其所做的事情，方法的定义在`src/core/global-api/extend.ts`中，它的主要作用就是构造一个Vue的子类，使用的是非常经典的原型继承的方式把一个纯对象转换为一个继承于Vue的构造器`Sub`并返回，然后对`Sub`本身做了一些扩展，比如扩展`options`、添加全局API等；并且对配置中的`props`和`computed`做了初始化工作，最后对`Sub`进行了缓存，避免多次extend的时候对同一个子组件重复构造。在实例化`Sub`的时候，就会执行`this._init`的逻辑对子组件进行实例化，这一部分逻辑会在后面的章节提到。

```javascript
Vue.extend = function (extendOptions: any): typeof Component {
    extendOptions = extendOptions || {}
    const Super = this
    const SuperId = Super.cid
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    const name = extendOptions.name || Super.options.name
    if (__DEV__ && name) {
      validateComponentName(name)
    }

    const Sub = function VueComponent(this: any, options: any) {
      this._init(options)
    } as unknown as typeof Component
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.cid = cid++
    Sub.options = mergeOptions(Super.options, extendOptions)
    Sub['super'] = Super

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // cache constructor
    cachedCtors[SuperId] = Sub
    return Sub
}
```

### 2. 安装组件钩子函数

看代码可以发现在构造子类构造函数后处理了异步组件、检验props数据、处理函数式组件，之后便创建了组件的钩子函数`installComponentHooks`，这个函数就是将`componentVNodeHooks`的定义合并到`data.hook`中，在VNode执行patch的过程中可以执行相关的钩子函数。

```javascript
function installComponentHooks(data: VNodeData) {
  const hooks = data.hook || (data.hook = {})
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i]
    const existing = hooks[key]
    const toMerge = componentVNodeHooks[key]
    // @ts-expect-error
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge
    }
  }
}
```

`componentVNodeHooks`的定义包含
* init: 初始化时，创建组件实例，挂载组件的子节点；否则调用`prepatch`钩子
* prepatch: 更新组件
* insert: 激活组件及其子组件，标识组件渲染完成，调用`mounted`、`activated`钩子
* destroy: 销毁组件及其子组件，调用`deactivated`钩子

```javascript
const componentVNodeHooks = {
  init(vnode: VNodeWithData, hydrating: boolean): boolean | void {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      const child = (vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      ))
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },

  prepatch(oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
    const options = vnode.componentOptions
    const child = (vnode.componentInstance = oldVnode.componentInstance)
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    )
  },

  insert(vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true
      callHook(componentInstance, 'mounted')
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance)
      } else {
        activateChildComponent(componentInstance, true /* direct */)
      }
    }
  },

  destroy(vnode: MountedComponentVNode) {
    const { componentInstance } = vnode
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy()
      } else {
        deactivateChildComponent(componentInstance, true /* direct */)
      }
    }
  }
}
```

### 3. 实例化VNode

最后一步就是创建VNode实例并返回，需要注意的是普通元素节点的vnode不同，组件的vnode是没有children的

```javascript
const name = Ctor.options.name || tag
const vnode = new VNode(
// @ts-expect-error
`vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
data,
undefined,
undefined,
undefined,
context,
// @ts-expect-error
{ Ctor, propsData, listeners, tag, children },
asyncFactory
)
return vnode
```

`createComponent`最终也是返回VNode，也一样会走到`vm._update`，进而执行`patch`方法，更新组件视图。









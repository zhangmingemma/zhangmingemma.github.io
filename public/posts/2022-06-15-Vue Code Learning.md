<!-- ---
title: Vue2.0原理理解 (一)：源码学习
date: 2022-06-15
tags: JavaScript, Vue
--- -->

Vue是目前最常用的开发框架之一，要理解透彻其内在机理，还需要从学习源码入手，理解其中每一个关键设计的具体实现，感受尤大神的代码风格，这里整理了我顺着一些参考文章学习源码的读书笔记，为了节省篇幅，源码的粘贴会去掉部分对当前段落的理解无重要意义的片段。单个方法内会涉及到不同方面的功能逻辑，但是为了更加清晰，我期望能够划分初始化、组件、响应式原理、生命周期、事件、组件这几部分分成不同的文章来进行介绍，在对应内容中会详细介绍包含的逻辑，在其他部分则忽略不相关内容。

参考资料：
* Vue.js技术揭秘 <a href="https://ustbhuangyi.github.io/vue-analysis/" target="_blank">[资料原地址]</a>
* Vue.js 2.x源码 <a href="https://github.com/vuejs/vue" target="_blank">[源码地址]</a>

# 一. Vue构建入口

## 1. 构建过程

Vue.js的源码是基于`Rollup`构建的，`package.json`中配置了构建时是执行`script/build.js`文件

```json
{
    "scripts": {
        "build": "node scripts/build.js",
        "build:ssr": "npm run build -- runtime-cjs,server-renderer",
    }
}
```

在`script/build.js`文件中就定义了整个构建的过程，从`./config`文件中读取所有的构建配置，通过命令行参数对构建配置进行过滤，再逐次进行不同用途`Vue.js`的构建。`build(builds)`函数就是整个构建过程，包含读取源文件、用`rollup`进行代码压缩、生成并写入输出目录中对应的文件三个主要步骤

> process是node中的一个模块，通过process.argv能够获取到命令执行node程序时所传入的参数，第一个参数是node.exe绝对路径，第二个参数是node执行的文件的绝对路径，其后的参数是命令行中所传的其他参数，例如上面的代码中`process.argv[2] = -- runtime-cjs,server-renderer`

```javascript
// scripts/build.js
let builds = require('./config').getAllBuilds()
if (process.argv[2]) { // 命令行参数
    const filters = process.argv[2].split(',')
    builds = builds.filter(b => {
        return filters.some(f => b.output.file.indexOf(f) > -1 || b._name.indexOf(f) > -1)
    })
}

build(builds)
```

从`./config`中可以看到构建配置都是遵循`rollup`的语法定义的，`entry`代表构建入口文件，`dest`代表构建后的JS文件地址，`format`代表构建格式，`cjs`代表构建出来的文件遵循`CommonJS`规范，`es`代表构建出来的文件遵循`ES Module`规范，`umd`代表构建出来的文件遵循`umd`规范。`banner`代表在打包好的文件的块的外部最顶部插入一段内容。

```javascript
// scripts/config.js
const aliases = require('./alias')
const resolve = p => {
    const base = p.split('/')[0]
    if (aliases[base]) {
        return path.resolve(aliases[base], p.slice(base.length + 1))
    } else {
        return path.resolve(__dirname, '../', p)
    }
}

const builds = {
    // Runtime only (CommonJS). Used by bundlers e.g. Webpack & Browserify
    'runtime-cjs-dev': {
        entry: resolve('web/entry-runtime.ts'),
        dest: resolve('dist/vue.runtime.common.dev.js'),
        format: 'cjs',
        env: 'development',
        banner
    }
}
```

`builds`定义的每一项路径中也都包含了`resolve`方法，`resolve`函数的实现是将传入的路径进行分割，取首位作为`base`，从`./alias`中的配置可以兑换得到一个别名，上面代码中的示例，入口为`src/platforms/web/entry-runtime.ts`，输出目录`dist/vue.runtime.common.dev.js`

```javascript
// scripts/alias.js
module.exports = {
    vue: resolve('src/platforms/web/entry-runtime-with-compiler'),
    compiler: resolve('src/compiler'),
    core: resolve('src/core'),
    shared: resolve('src/shared'),
    web: resolve('src/platforms/web'),
    server: resolve('packages/server-renderer/src'),
    sfc: resolve('packages/compiler-sfc/src')
}
```

> Runtime Only和Runtime Compiler版本的区别：
> * Runtime Only: 通常需要借助webpack的vue-loader把Vue编译成JavaScript，因为是在编译阶段做的，所以它只包含运行时的Vue.js代码，相对轻量。在将.vue文件编译为JS文件的过程中，会将组件中的`template`通过`vue-template-compiler`编译为`render`函数，运行过程中不带编译，编译是在离线的时候做的
> * Runtime Compiler: 没有对代码进行预编译，在运行时，将组件中的`template`编译为`render`函数，相对更重，编译过程会对性能有损耗
> 
> 下面是通过两种版本生成的新Vue工程main.ts的截图，可以看到`Runtime-Only`版本中主要参数是`render`方法，而`Runtime-Compiler`版本中的主要参数是`components`和`template`。在运行过程中，通过`template`传入字符串，则需要`Runtime-Compiler`版本，如果`template`都定义在.vue文件中，则使用`Runtime-Only`版本即可
<img style="width:600px;" class="center" src="https://zhangmingemma.github.io/dist/images/2022-06-15/1.png">

# 二. new Vue

## 1. Vue初始化定义

上一小节，我们可以从`scripts/alias.js`中看到，编译`vue.js`的入口文件是`src/platforms/web/entry-runtime-with-compiler`

```javascript
// src/platforms/web/entry-runtime-with-compiler.ts
import Vue from './runtime-with-compiler'
import * as vca from 'v3'
import { extend } from 'shared/util'

extend(Vue, vca)

import { effect } from 'v3/reactivity/effect'
Vue.effect = effect

export default Vue
```

这个文件代码很简单，就是从`src/platforms/web/runtime-with-compiler`目录引入了`Vue`，在`src/platforms/web/runtime-with-compiler`文件中，又从`src/platforms/web/runtime/index.ts`中引入了`Vue`

```javascript
import Vue from './runtime/index'
import { compileToFunctions } from './compiler/index'
import type { GlobalAPI } from 'types/global-api'

const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (){ ... }
Vue.compile = compileToFunctions
export default Vue as GlobalAPI
```

一路追踪，最后可以看到`Vue`的定义文件是在`src/core/instance/index.js`，可以看到这里还有很多`mixin`将`Vue`作为参数传入，都是在`Vue`的`prototype`上扩展方法，可以分散到不同的模块去实现，而不是在同一个模块内实现所有，这种方式ES6的Class很难实现，方便代码的维护和管理。这些`mixin`分则负责不同的模块功能：
* `initMixin`：定义了`_init`初始化Vue的方法，这个方法会在2.1中进行详细介绍
* `stateMixin`：数据相关的mixin，主要是`$data`、`$prop`的监听，初始化为`Vue.prototype`添加`$set`、`$delete`、`$watch`方法
* `eventsMixin`：初始化为`Vue.prototype`添加`$on`、`$once`、`$off`、`$emit`方法。
* `lifecycleMixin`：初始化为`Vue.prototype`添加`_update`、`$forceUpdate`、`$destroy`方法
* `renderMixin`：初始化渲染，将在3.1中进行详细介绍

```javascript
// src/core/instance/index.js
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import type { GlobalAPI } from 'types/global-api'

function Vue(options) {
    this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue as unknown as GlobalAPI
```

## 2. new Vue做了什么
上一章中讲到`Vue`是一个用`Function`实现的类，新建`Vue`实例，就是通过`new Vue()`来实现的，这个时候会执行函数中的`this._init(options)`方法。这个方法是定义在`src/core/instance/init.ts`中的，可以看到`new Vue`的时候就是做了一系列的初始化，包含
* 初始化组件 / 合并配置
* 初始化生命周期
* 初始化事件中心
* 初始化渲染
* 调用`beforeCreate`钩子
* 初始化`inject`
* 初始化数据
* 初始化`provide`
* 注册`create`钩子
* 挂载`vm`

```javascript
// src/core/instance/init.ts
Vue.prototype._init = function (options?: Record<string, any>) {
    const vm: Component = this
    vm._uid = uid++ // 保证vue创建实例的唯一性
    // effect scope
    vm._scope = new EffectScope(true /* detached */)
    // merge options
    if (options && options._isComponent) {
        // optimize internal component instantiation
        // since dynamic options merging is pretty slow, and none of the
        // internal component options needs special treatment.
        initInternalComponent(vm, options as any)
    } else {
        vm.$options = mergeOptions(
            resolveConstructorOptions(vm.constructor as any),
            options || {},
            vm
        )
    }
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    if (vm.$options.el) { // 如果存在el则将vm挂载在el上，如果没有el，则需要手动挂载
        vm.$mount(vm.$options.el)
    }
}
```

## 3. vm挂载
new Vue的过程中会挂载`vm`，其实挂载的过程就是将vue模板渲染为真实的DOM结构的过程。`$mount`的实现在`src/platforms/web/runtime-with-compiler.ts`。`$mount`需要传入两个参数，`el`代表的是挂载的元素，可以是字符串，也可以是DOM对象，如果是字符串在浏览器环境下会通过`query`方法转换为DOM对象。第二个参数`hydrating`与服务端渲染有关，在浏览器环境下我们不需要传第二个参数。

```javascript
// src/platforms/web/runtime-with-compiler.ts
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
    el?: string | Element,
    hydrating?: boolean
): Component {
    el = el && query(el)

    /* istanbul ignore if */
    if (el === document.body || el === document.documentElement) {
        __DEV__ &&
        warn(
            `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
        )
        return this
    }
    const options = this.$options
    // resolve template/el and convert to render function
    if (!options.render) {
        let template = options.template
        if (template) {
            if (typeof template === 'string') {
                if (template.charAt(0) === '#') {
                    template = idToTemplate(template) // 查找对应selector的节点作为template
                }
            } else if (template.nodeType) {
                template = template.innerHTML
            } else {
                return this
            }
        } else if (el) {
            template = getOuterHTML(el) // 找el的外层元素的innerHtml
        }
        if (template) {
            const { render, staticRenderFns } = compileToFunctions(
                template,
                {
                    outputSourceRange: __DEV__,
                    shouldDecodeNewlines,
                    shouldDecodeNewlinesForHref,
                    delimiters: options.delimiters,
                    comments: options.comments
                },
                this
            )
            options.render = render
            options.staticRenderFns = staticRenderFns
        }
    }
    return mount.call(this, el, hydrating)
}
```

这段代码中，首先，缓存了原型上的`$mount`方法，对`el`做了限制，Vue不能挂在在`html`和`body`这样的根节点上。接下来就是挂载的核心逻辑，如果没有`render`方法，就会把`el`和`template`转换为`render`方法。转换的过程需要先获取`template`，是根据定义的`template`、通过`query`方法解析字符串、获取`el`的外层节点`html`三种途径来实现的，最后通过`compileToFunctions`将`template`转换为`render`方法。在Vue2中，所有组件的渲染最后都要依赖`render`方法，不论是用单文件`.vue`方式开发组件，还是定义了`el`和`template`属性，最终都会转换为`render`方法。

再看原本原型上的`$mount`方法，这部分方法定义在`src/platforms/web/runtime/index.ts`，该方法中引用了方法`mountComponent`，定义在`src/core/instance/lifecycle.ts`。可以看到`mountComponent`所做的事情主要包含：
* 调用`beforeMount`钩子
* 实例化一个渲染`Watcher`，在回调中调用`updateComponent`方法，在该方法中调用`vm._render`方法生成虚拟Node，最终调用`vm._update`更新DOM，在更新之前调用`beforeUpdate`钩子。Watcher在初始化的时候会执行回调函数，在`vm`实例中监测的数据发生变化的时候也会执行回调函数。
* watcher都执行过，调用`mounted`钩子。其中`vm.$vnode`标识Vue实例的父虚拟Node，它为Null则标识当前是根Vue的实例，表示已经挂载完成

```javascript
// src/platforms/web/runtime/index.ts
Vue.prototype.$mount = function (
    el?: string | Element,
    hydrating?: boolean
): Component {
    el = el && inBrowser ? query(el) : undefined
    return mountComponent(this, el, hydrating)
}

// src/core/instance/lifecycle.ts
export function mountComponent(
    vm: Component,
    el: Element | null | undefined,
    hydrating?: boolean
): Component {
    vm.$el = el
    if (!vm.$options.render) {
        vm.$options.render = createEmptyVNode
    }
    callHook(vm, 'beforeMount')

    let updateComponent
    if (__DEV__ && config.performance && mark) {
        updateComponent = () => {
            const vnode = vm._render()
            vm._update(vnode, hydrating)
        }
    } else {
        updateComponent = () => {
            vm._update(vm._render(), hydrating)
        }
    }

    const watcherOptions: WatcherOptions = {
        before() {
            if (vm._isMounted && !vm._isDestroyed) {
                callHook(vm, 'beforeUpdate')
            }
        }
    }
    // we set this to vm._watcher inside the watcher's constructor
    // since the watcher's initial patch may call $forceUpdate (e.g. inside child
    // component's mounted hook), which relies on vm._watcher being already defined
    new Watcher(
        vm,
        updateComponent,
        noop,
        watcherOptions,
        true /* isRenderWatcher */
    )
    hydrating = false

    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
        const preWatchers = vm._preWatchers
        if (preWatchers) {
            for (let i = 0; i < preWatchers.length; i++) {
                preWatchers[i].run()
            }
        }
        vm._isMounted = true
        callHook(vm, 'mounted')
    }
    return vm
}
```

# 三. 渲染

初始化渲染的逻辑主要包含两个方面，一是`二.1`节中`new Vue`的`_init`方法中执行的`initRender`方法，二是上一节中挂载`vm`中调用的`vm._render`方法。

## 1. initRender

initRender方法定义在`src/core/instance/render.ts`中，这一部分做的主要的事情就是为vm绑定`$createElement`方法，这个方法会在我们下一小节中介绍的`_render`中调用到，其次就是处理插槽逻辑，绑定监听vm的`$attrs`和`$listeners`

```javascript
// src/core/instance/render.ts
export function initRender(vm: Component) {
    vm._vnode = null // the root of the child tree  // 存放虚拟Node
    vm._staticTrees = null // v-once cached trees // 缓存静态节点，只渲染元素和组件一次
    const options = vm.$options
    const parentVnode = (vm.$vnode = options._parentVnode!) // the placeholder node in parent tree
    const renderContext = parentVnode && (parentVnode.context as Component)
    // 插槽逻辑
    vm.$slots = resolveSlots(options._renderChildren, renderContext)
    vm.$scopedSlots = emptyObject
    // 创建虚拟Node
    vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
    vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

    // $attrs & $listeners are exposed for easier HOC creation.
    // they need to be reactive so that HOCs using them are always updated
    const parentData = parentVnode && parentVnode.data

    // 代理，监听绑定vm中的属性
    defineReactive(
        vm,
        '$attrs',
        (parentData && parentData.attrs) || emptyObject,
        null,
        true
    )
    // 代理，监听绑定vm的事件监听器
    defineReactive(
        vm,
        '$listeners',
        options._parentListeners || emptyObject,
        null,
        true
    )
}
```

## 2. _render

### 1). VNode
`_render`是实例的私有方法，作用是将实例渲染成一个虚拟Node。在正式了解渲染过程之前，首先需要掌握的是虚拟Node这个概念，其产生的前提是因为浏览器中的DOM是非常耗费成本的，更直观的感受是，打印一个`div`出来，会看到真正的DOM元素非常庞大，浏览器标准将DOM设计的非常复杂，频繁更新DOM会牵扯到性能问题。虚拟Node，Virtual Dom就是用一个原生的JS对象去描述一个DOM节点，所以比创建DOM代价要小，Vue中`VNode`的定义是在`src/core/vdom/vnode.ts`中，可以看到VNode的核心无非就是几个关键属性，但是要把虚拟Node映射到真实的DOM结构，还是需要经过`create`、`diff`、`patch`等过程，将在后续的文章内容中进行更加详细地解释和介绍。
```javascript
export default class VNode {
    tag?: string
    data: VNodeData | undefined
    children?: Array<VNode> | null
    text?: string
    elm: Node | undefined
    ns?: string
    context?: Component // rendered in this component's scope
    key: string | number | undefined
    componentOptions?: VNodeComponentOptions
    componentInstance?: Component // component instance
    parent: VNode | undefined | null // component placeholder node

    // strictly internal
    raw: boolean // contains raw HTML? (server only)
    isStatic: boolean // hoisted static node
    isRootInsert: boolean // necessary for enter transition check
    isComment: boolean // empty comment placeholder?
    isCloned: boolean // is a cloned node?
    isOnce: boolean // is a v-once node?
    asyncFactory?: Function // async component factory function
    asyncMeta: Object | void
    isAsyncPlaceholder: boolean
    ssrContext?: Object | void
    fnContext: Component | void // real context vm for functional nodes
    fnOptions?: ComponentOptions | null // for SSR caching
    devtoolsMeta?: Object | null // used to store functional render context for devtools
    fnScopeId?: string | null // functional scope id support

    // DEPRECATED: alias for componentInstance for backwards compat.
    /* istanbul ignore next */
    get child(): Component | void {
        return this.componentInstance
    }
}
```

### 2). _render
讲回`_render`，该方法定义在`src/core/instance/render.ts`里，这个方法主要做的是：
* 初始化`vm`的插槽节点
* 创建`vm`实例
* 用`$createElement`方法去生成`vm`的虚拟Node
* 兜底是创建空`VNode`

```javascript
// src/core/instance/render.ts
Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const { render, _parentVnode } = vm.$options

    if (_parentVnode) {
        vm.$scopedSlots = normalizeScopedSlots(
            vm.$parent!,
            _parentVnode.data!.scopedSlots,
            vm.$slots,
            vm.$scopedSlots
        )
        if (vm._slotsProxy) {
            syncSetupSlots(vm._slotsProxy, vm.$scopedSlots)
        }
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode!
    // render self
    let vnode
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      setCurrentInstance(vm)
      currentRenderingInstance = vm
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e: any) {
      handleError(e, vm, `render`)
    } finally {
        currentRenderingInstance = null
        setCurrentInstance()
    }
    // if the returned array contains only a single node, allow it
    if (isArray(vnode) && vnode.length === 1) {
        vnode = vnode[0]
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
        vnode = createEmptyVNode()
    }
    // set parent
    vnode.parent = _parentVnode
    return vnode
}
```
这里使用到的`$createElement`的方法最终的定义是在`src/core/vdom/create-element.ts`中，可以看到这个方法共5个参数，`context`代表VNode的上下文环境，是`Component`类型，`tag`表示标签，可以是多种类型，`data`表示VNode的数据，是`VNodeData`类型，`children`代表VNode的子节点，`normalizationType`表示子节点规范的类型，类型不同规范的方法就不同，主要是参考`render`方法是用户定义的，还是自动编译生成的。

```javascript
export function _createElement(
    context: Component,
    tag?: string | Component | Function | Object,
    data?: VNodeData,
    children?: any,
    normalizationType?: number
): VNode | Array<VNode> {
    if (isDef(data) && isDef((data as any).__ob__)) {
        return createEmptyVNode()
    }
    // object syntax in v-bind
    if (isDef(data) && isDef(data.is)) {
        tag = data.is
    }
    if (!tag) {
        // in case of component :is set to falsy value
        return createEmptyVNode()
    }
    // support single function children as default scoped slot
    if (isArray(children) && isFunction(children[0])) {
        data = data || {}
        data.scopedSlots = { default: children[0] }
        children.length = 0
    }
    if (normalizationType === ALWAYS_NORMALIZE) {
        children = normalizeChildren(children)
    } else if (normalizationType === SIMPLE_NORMALIZE) {
        children = simpleNormalizeChildren(children)
    }
    let vnode, ns
    if (typeof tag === 'string') {
        let Ctor
        ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
        if (config.isReservedTag(tag)) {
            vnode = new VNode(
                config.parsePlatformTagName(tag),
                data,
                children,
                undefined,
                undefined,
                context
            )
        } else if (
            (!data || !data.pre) &&
            isDef((Ctor = resolveAsset(context.$options, 'components', tag)))
        ) {
            // component
            vnode = createComponent(Ctor, data, context, children, tag)
        } else {
            // unknown or unlisted namespaced elements
            // check at runtime because it may get assigned a namespace when its
            // parent normalizes children
            vnode = new VNode(tag, data, children, undefined, undefined, context)
        }
    } else {
        // direct component options / constructor
        vnode = createComponent(tag as any, data, context, children)
    }
    if (isArray(vnode)) {
        return vnode
    } else if (isDef(vnode)) {
        if (isDef(ns)) applyNS(vnode, ns)
        if (isDef(data)) registerDeepBindings(data)
        return vnode
    } else {
        return createEmptyVNode()
    }
}
```
`createElement`做的主要事情可以概括为`children`的规范化、创建`VNode`实例两个主要部分。

#### 1. children规范化
由于Virtual Dom实际上是一个树形结构，每一个VNode会有若干子节点，子节点应该也是VNode类型的，但`_createElement`中接收的`children`是任意类型的，因此需要规范化children为`VNode`类型。从`_createElement`代码中可以看到规范化children有两种方法，`normalizeChildren`和`simpleNormalizeChildren`，他们的定义都在`src/core/helpers/normalize-children.ts`

`simpleNormalizeChildren`方法调用的场景是`render`函数编译生成的，理论上编译生成的children已经是`VNode`类型的，但有一个例外是，`functional component`函数式组件返回的是一个数组而不是根节点，所以需要通过`concat`方法，把数组拍平，让它的深度只有1层

```javascript
// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
export function simpleNormalizeChildren(children: any) {
  for (let i = 0; i < children.length; i++) {
    if (isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
export function normalizeChildren (children: any): ?Array<VNode> {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}
```

`normalizeChildren`调用场景有2中，其一是`render`函数是用户手写的，当`children`只有一个节点时，Vue.js从接口层面允许用户把`children`写成基础类型用来创建单个简单的文本节点，这种情况会调用`createTextNode`创建一个文本节点的VNode；另一个场景是当`slot`、`v-for`的时候会产生嵌套数组的情况，需要调用`normalizeArrayChildren`方法

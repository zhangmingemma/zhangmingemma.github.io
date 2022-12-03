<!-- ---
title: Vue基础系列之视图渲染
date: 2022-11-13
tags: Vue基础系列
set: BaseVue
--- -->

<img style="width:700px;" class="center" src="https://zhangmingemma.github.io/dist/images/2022-11-13/vue1.png">

Vue会根据Vue模板生成`VDOM`结构，然后用原生的DOM方法依次创建VDOM结构中的每一个节点，然后将它们挂载成一棵DOM子树，并插入页面，就可以得到真正的HTML。，它被传递给组件的`_update`方法执行渲染。这里所说的渲染包括首次绘制和更新，`_update`内部会根据旧的vnode是否存在来判断是首绘还是更新。`_update`的实现大致如下：
```javascript
Vue.prototype._update = function (vnode, hydrating){ 
    // ... 
    if (!prevVnode) { // initial render 
        vm.$el = vm.__patch__(vm.$el,vnode,hydrating,false)
    } else { // updates 
        vm.$el = vm.__patch__(prevVnode, vnode) 
    } 
    // ... 
}
```

当旧的vnode不存在，说明这是首次绘制，`__patch__`将依据虚拟DOM生成真实DOM并绘制到页面。如果旧的vnode是存在的，说明当前组件已经被绘制到页面上了，这时候`__patch__`将负责比对两个vnode，然后判断如何最高效地更新真实DOM，最后去更新视图。更新视图就是通过`insertBefore`、`createElement`、`appendChild`等方法，按照新的VNode的结构，来更新真实DOM的。

因此Vue视图渲染可以概括为两部分，首先是**diff**过程，比较新旧`VNode`的区别，找出变更点；其次是**patch**过程，根据虚拟DOM映射到真实DOM上。

### 1. diff

Vue的diff算法仅在统计的VNode间做`diff`，递归地进行同级`VNode`的`diff`，最终实现整个DOM树的更新。

<img style="width:400px;" class="center" src="https://zhangmingemma.github.io/dist/images/2022-11-13/vue-diff1.png">

```javascript
updateChildren (parentElm, oldCh, newCh) {
    let oldStartIdx = 0, newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx
    let idxInOld
    let elmToMove
    let before
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (oldStartVnode == null) {   
            oldStartVnode = oldCh[++oldStartIdx] 
        }else if (oldEndVnode == null) {
            oldEndVnode = oldCh[--oldEndIdx]
        }else if (newStartVnode == null) {
            newStartVnode = newCh[++newStartIdx]
        }else if (newEndVnode == null) {
            newEndVnode = newCh[--newEndIdx]
        }else if (sameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode)
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = newCh[++newStartIdx]
        }else if (sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode)
            oldEndVnode = oldCh[--oldEndIdx]
            newEndVnode = newCh[--newEndIdx]
        }else if (sameVnode(oldStartVnode, newEndVnode)) {
            patchVnode(oldStartVnode, newEndVnode)
            api.insertBefore(parentElm, oldStartVnode.el, api.nextSibling(oldEndVnode.el))
            oldStartVnode = oldCh[++oldStartIdx]
            newEndVnode = newCh[--newEndIdx]
        }else if (sameVnode(oldEndVnode, newStartVnode)) {
            patchVnode(oldEndVnode, newStartVnode)
            api.insertBefore(parentElm, oldEndVnode.el, oldStartVnode.el)
            oldEndVnode = oldCh[--oldEndIdx]
            newStartVnode = newCh[++newStartIdx]
        }else {
            // 使用key时的比较
            if (oldKeyToIdx === undefined) {
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx) // 有key生成index表
            }
            idxInOld = oldKeyToIdx[newStartVnode.key]
            if (!idxInOld) {
                api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
                newStartVnode = newCh[++newStartIdx]
            }
            else {
                elmToMove = oldCh[idxInOld]
                if (elmToMove.sel !== newStartVnode.sel) {
                    api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
                }else {
                    patchVnode(elmToMove, newStartVnode)
                    oldCh[idxInOld] = null
                    api.insertBefore(parentElm, elmToMove.el, oldStartVnode.el)
                }
                newStartVnode = newCh[++newStartIdx]
            }
        }
    }
    if (oldStartIdx > oldEndIdx) {
        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].el
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx)
    }else if (newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
}
```

从上面的**diff算法源代码**中可以看到，**diff**过程比较复杂，概括可以理解为：首先设置新旧虚拟DOM节点的孩子树``newCh``、``oldCh``的起始``StartIdx``、结尾索引``EndIdx``。它们的2个变量相互比较，一共有4种比较方式。举例说明，下面是一个对比前后的DOM树，具体过程是：

<img style="width:200px;display:inline-block;" src="https://zhangmingemma.
github.io/dist/images/2022-11-13/vue-diff2.png" /><img style="width:400px;display:inline-block;" src="https://zhangmingemma.github.io/dist/images/2022-11-13/vue-diff3.png" />

(1) 当新旧起始节点为``null``时，则将起始索引``++``,并更新起始节点；同样的，当新旧结尾节点为``null``时，则将结尾索引``--``，并更新结尾节点
(2) 当新旧起始节点相同时，则``patchVnode``进行patch，同时将新旧起始索引``++``；同样的，当新旧结尾节点相同时（即key和sel都相同），则``patchVnode``进行patch，同时将新旧结尾索引``--``，对于真实DOM而言，就是节点保留原地

<img style="width:400px;" class="center" src="https://zhangmingemma.github.io/dist/images/2022-11-13/vue-diff4.png">

(3) 当旧起始节点和新结尾节点相同时，``patchVnode``进行patch，将oldStartNode.elm移动到旧结尾节点oldEndNode.elm之后，旧起始索引``++``新结尾索引``--``；同理，当新起始节点和旧结尾节点相同时，``patchVnode``进行patch，将旧结尾节点oldEndNode.elm移动到旧起始节点oldStartNode.elm之后，旧结尾索引``--``新起始索引``++``;<br/>

<img style="width:400px;" class="center" src="https://zhangmingemma.github.io/dist/images/2022-11-13/vue-diff6.png">

<img style="width:400px;" class="center" src="https://zhangmingemma.github.io/dist/images/2022-11-13/vue-diff7.png">

(4) 以上情况都不是的时候，使用key进行比较，从用旧虚拟节点树key生成的对象oldKeyToIdx中查找匹配的节点，所以为节点设置key可以更高效的利用dom。
* 若新起始节点的key不在oldKeyToIdx中，在旧起始节点位置上插入新起始节点，同时新起始索引``++``
* 若新起始节点的key在oldKeyToIdx中，且key相同的两个虚拟节点sel相同，则``patchVnode``进行patch，把key相同的旧虚拟节点的elm移动到oldStartVnode.elm之前，新起始索引``++``
* 若新起始节点的key在oldKeyToIdx中，且key相同的两个虚拟节点sel不同，则在把新起始节点的elm插入到oldStartVnode.elm之前，新起始索引``++``

(5) 在比较的过程中，变量会往中间靠，一旦StartIdx>EndIdx表明oldCh和newCh至少有一个已经遍历完了，就会结束比较。结束时存在两种具体的情况：

* ``oldStartIdx > oldEndIdx``，可以认为oldCh先遍历完。当然也有可能newCh此时也正好完成了遍历，统一都归为此类。此时newStartIdx和newEndIdx之间的vnode是新增的，调用addVnodes，把这些虚拟node.elm全部插进before的后边.

* ``newStartIdx > newEndIdx``，可以认为newCh先遍历完。此时oldStartIdx和oldEndIdx之间的vnode在新的子节点里已经不存在了，调用removeVnodes将这些虚拟node.elm从dom里删除。

<img style="width:400px;" class="center" src="https://zhangmingemma.github.io/dist/images/2022-11-13/vue-diff8.png">

### 2. patch

**patch**就是将变化映射到真实DOM，对真实DOM进行操作
```javascript
function patchVnode (oldVnode, vnode, insertedVnodeQueue, ownerArray, index, removeOnly) {
    // ...... 
    const elm = vnode.elm = oldVnode.elm
    const oldCh = oldVnode.children
    const ch = vnode.children
    // 如果vnode没有文本节点
    if (isUndef(vnode.text)) {
        // 如果oldVnode的children属性存在且vnode的children属性也存在  
        if (isDef(oldCh) && isDef(ch)) {
            // updateChildren，对子节点进行diff  
            if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
        } else if (isDef(ch)) {
            if (process.env.NODE_ENV !== 'production') {
                checkDuplicateKeys(ch)
            }
            // 如果oldVnode的text存在，那么首先清空text的内容,然后将vnode的children添加进去  
            if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
            addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
        } else if (isDef(oldCh)) {
            // 删除elm下的oldchildren
            removeVnodes(elm, oldCh, 0, oldCh.length - 1)
        } else if (isDef(oldVnode.text)) {
            // oldVnode有子节点，而vnode没有，那么就清空这个节点  
            nodeOps.setTextContent(elm, '')
        }
    } else if (oldVnode.text !== vnode.text) {
        // 如果oldVnode和vnode文本属性不同，那么直接更新真是dom节点的文本元素
        nodeOps.setTextContent(elm, vnode.text)
    }
    // ......
}
```

参考文献：

1. <a href="https://blog.csdn.net/m6i37jk/article/details/78140159" target="__blank">深入Vue2.x的虚拟DOM diff原理</a>
2. <a href="https://segmentfault.com/a/1190000008782928" target="__blank">解析vue2.0的diff算法</a>
3. <a href="https://segmentfault.com/a/1190000008291645" target="__blank">Vue原理解析之Virtual Dom</a>
4. <a href="https://mp.weixin.qq.com/s?__biz=MzUxNjQ1NjMwNw==&mid=2247484449&idx=1&sn=7f346b97a177218cc09fc50562ed121c&chksm=f9a66e3dced1e72b8a88fd0d78b5a5b8bd2e0ec95552e675d44923d368bba2ec438c520cd7be&cur_album_id=1619085427984957440&scene=189#rd" target="__blank">Diff - 源码版 之 Diff 流程</a>
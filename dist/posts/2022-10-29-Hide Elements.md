<!-- ---
title: CSS基础系列之清除浮动
date: 2022-10-29
tags: CSS基础
set: CSSBase
--- -->

清除浮动是指清除由于子元素浮动带来的父元素高度塌陷的影响，我们先来看看存在浮动的样式。

```html
<style>
.container {
    margin: 50px;
    width: 400px;
    background: lightblue;
}
.big {
    float: left;
    width: 200px;
    height: 200px;
    background: orange;
}
.small {
    float: left;
    width: 100px;
    height: 100px;
    background: blueviolet;
}
</style>
<body>
    <div class="container">
        <div class="big">big</div>
        <div class="small">small</div>
    </div>
</body>
```

<div style="display:flex;"><img src="https://zhangmingemma.github.io/dist/images/2022-10-29/2.png" style="display:inline-block; margin-bottom:16px; width:500px;"></div>

可以看到因为浮动的元素，父容器没有被撑开，背景色没有展示出来

#### 1. `clear:both`

本质就是添加一个元素，这个元素设置成`clear:both`，来清除浮动

```html
<style>
    .clear {
        clear: both;
    }
</style>
<body>
    <div class="container">
        <div class="big">big</div>
        <div class="small">small</div>
        <div class="clear"></div>
    </div>
</body>
```

<div style="display:flex;"><img src="https://zhangmingemma.github.io/dist/images/2022-10-29/3.png" style="display:inline-block; margin-bottom:16px; width:500px;"></div>

显式添加元素，来设置`clear:both`可能不是很方便，那我们可以通过添加伪类来达到相同的目的

```css
.container:after {
    clear: both;
    content: '';
    display: block;
    height: 0;
    visibility: hidden;
}
```

#### 2. `overflow:hidden`

在父元素中设置`overflow:hidden`来形成一个`BFC`清除浮动的影响

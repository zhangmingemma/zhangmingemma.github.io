<!-- ---
title: Vue基础系列之MVVM与MVC的区别
date: 2022-11-12
tags: Vue基础系列
set: BaseVue
--- -->

MVVM(Model-View-ViewModel)，其中`Model`代表数据模型，定义数据操作的业务逻辑，`View`代表视图层，负责将数据模型渲染到页面上，`ViewModel`通过双向绑定把`View`和`Model`进行同步交互，不需要手动操作`DOM`的一种设计思想。

### 一. MVVM 

MVVM的核心是`ViewModel`层，它就像是一个中转站，负责转换`Model`中的数据对象，让数据变得更容易管理和使用，**该层向上与视图进行双向数据绑定，向下与Model层通过接口请求进行数据交互，起承上启下的作用。**

<div style="display:flex;justify-content:center;"><img src="https://zhangmingemma.github.io/dist/images/2022-11-12/1.png" style="display:inline-block; margin-bottom:16px; width:500px;"></div>

* **View层**：也就是视图层，也就是用户界面，前端主要由`HTML`、`CSS`来构建，为了更方便地展现`ViewModel`或`Model`层的数据，已经产生了各种各样的模板语言。
* **ViewModel层**：由前端开发人员组织生成和维护的视图数据层。在这一层，前端开发者对后端获取的`Model`层数据进行转换处理，做二次封装，以生成符合`View`层使用预期的视图数据模型。需要注意的是`ViewModel`所封装出来的数据模型包括视图的状态和行为两部分，比如页面这一块展示什么属于视图状态。而页面加载进来时发生什么，点击发生什么，这些都属于视图交互。由于`ViewModel`实现双向绑定，`ViewModel`的内容就会实时展现在`View`层，就再也不必通过操作`DOM`去更新视图了。
* **Model层**：指数据模型，泛指后端进行的业务逻辑处理和数据操控，主要是围绕数据库系统展开

### 二. MVC 

MVC(Model-View-Controller)，是模型-视图-控制器的缩写，一种软件设计的典范

* **Model模型**：处理应用程序数据逻辑的部分，通常模型对象负责在数据库中存取数据
* **View视图**：处理数据显示的部分，通常视图是依据数据模型创建的
* **Controller控制器**：数据模型和视图之间通信的桥梁，通常控制器负责从事图读取数据，控制用户输入，并向模型发送数据

MVC的思想：Controller负责将Model的数据用View显示出来，换句话说就是在Controller里面把Model的数据赋值给View。

MVC的特点：实现关注点分离，即应用程序中的数据模型与业务和展示逻辑解耦。就是将模型和视图之间实现代码分离，松散耦合，使之成为一个更容易开发、维护和测试的客户端应用程序。
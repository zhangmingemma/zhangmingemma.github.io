<template>
    <div class="cv">
        <div class="cv-header">
            <img style="width:140px;height:140px;transform: rotate(0) translate(0, 0);" src="../assets/me.jpeg"/>
            <div class="cv-header-contact">
                <h2 style="margin: .5rem 0;">张敏</h2>
                <div class="cv-header-info">
                    <div class="item">
                        <img src="../assets/github.png"/>
                        <a target="_blank" href="https://github.com/zhangmingemma">zhangmingemma</a>
                    </div>
                    <div class="item">
                        <img src="../assets/email.png"/>
                        <a>zh_min@aliyun.com</a>
                    </div>
                    <div class="item">
                        <img src="../assets/tel.png"/>
                        <a>18627750167</a>
                    </div>
                </div>
            </div>
        </div>
        <h3 class="cv-title">教育背景</h3>
        <div class="cv-seperate">
            <span>2016.09-2019.06</span>
            <span>武汉大学</span>
            <span>硕士</span>
            <span>测绘遥感信息工程国家重点实验室</span>
        </div>
        <div class="cv-seperate">
            <span>2012.09-2016.06</span>
            <span>武汉大学</span>
            <span>本科</span>
            <span>遥感信息工程学院</span>
        </div>
        <h3 class="cv-title">工作经历</h3>
        <div class="cv-seperate">
            <strong>腾讯科技有限公司—微信事业群—搜索应用部</strong>
            <strong>前端开发工程师</strong>
            <span>2019.07-至今</span>
        </div>
        <span class="cv-subtitle">1. 问一问在线咨询等<strong>微信小程序开发</strong></span>
        <ul>
            <li>负责问一问在线咨询、微信圈子小程序的业务迭代、需求开发和日常问题定位，参与小程序的基础组件建设、框架优化和性能优化。</li>
            <li>负责搜索结果中间页小程序的部分业务需求开发，如朋友圈音乐、微信群买菜等。</li>
            <li>小程序项目都使用原生的微信小程序开发，部分小程序配套ts开发。</li>
        </ul>
        <span class="cv-subtitle">2. 搜索结果中间页<strong>H5开发</strong></span>
        <ul>
            <li>H5页面涉及部分搜索结果中间页和运营活动，如春运优惠券福利页、高校排行榜页等。</li>
            <li>负责H5页面项目的初始化、业务迭代、基础组件建设，组件包含公共请求、曝光计算等基础工具，和svg图标、页面滚动、各类弹窗等样式组件。</li>
            <li>该项目使用vue3配套ts开发，并应用weui样式库。</li>
        </ul>
        <span class="cv-subtitle"><strong>3. 小程序首屏加载优化</strong></span>
        <ul>
            <li>优化目的是为了缩短冷启动小程序时，从搜索结果点击到小程序首屏数据加载完成的耗时，从而优化用户体 验，加快首屏渲染速度，提高小程序打开率。</li>
            <li>优化涉及小程序加载的各个环节，该优化已实际应用于服务中间页小程序，有效提高了小程序首屏渲染速度， 打开率一定程度提升。优化步骤已经形成方法论能应用于部门内部各类小程序的初始化加载优化。</li>
            <li>运用抓包工具和小程序配套的网络耗时分析工具，对小程序冷启动过程做详细分析，找出耗时严重链路;利 用搜一搜前置场景可以通过私有通道调取客户端接口，完成小程序资源的提前加载;配合小程序分包和数据预加载能力，加速首屏渲染。</li>
        </ul>
        <span class="cv-subtitle"><strong>4. 数据分析工作</strong></span>
        <ul>
            <li>负责微信圈子、问一问在线咨询的部分数据分析统计需求，如免费咨询到付费咨询的转化比率统计、发表帖子页面点击行为漏斗统计等。</li>
            <li>能够预估数据统计需求，进行前端数据上报，并运用公司配套分析工具进行数据日志测试、数据统计代码编写、数据图表编辑及最终的数据指标微信群推送全流程。</li>
        </ul>
        <h3 class="cv-title">实习经历</h3>
        <div class="cv-seperate">
            <strong>京东科技集团—微信手 Q 业务部—交易开发组</strong>
            <strong>前端开发实习生</strong>
            <span>2018.06-2018.08</span>
        </div>
        <ul>
            <li>所在团队负责微信/QQ内京东购物入口，购物车和订单的业务需求开发，技术栈为原生JS，重构后为vue2，通过 mpvue 适配小程序与 H5 应用。</li>
            <li>本人在其中负责学习代码架构，熟悉业务开发流程，并单独负责部分业务需求开发，参与购物车代码重构。</li>
        </ul>
        <h3 class="cv-title">校园经历</h3>
        <div class="cv-seperate">
            <strong>网络地图服务分类检索门户<a style="margin-left:0;" target="_blank" href="https://github.com/zhangmingemma/vue_leaflet_mysql_geoserver"><img src="../assets/link.png"/></a></strong>
            <strong>项目负责人</strong>
            <span>2018.01-2019.02</span>
        </div>
        <ul>
            <li>该项目目标为能按照领域主题对网络地图服务进行分类，并设计网站门户实现基于类别标签的服务检索。本人承担全部算法设计、网络门户设计与全部开发工作。</li>
            <li>设计网络地图服务的文本分类方法，基于Word2vec计算类别主题与文本特征间的空间距离，筛选最优文本特征;引入语料库计算文本特征与主题的语义相似度为文本特征权重，训练主题预测模型;将预测模型与 ML- KNN 相结合半监督协同训练，实现网络地图服务的多标签分类;并利用 LDA 进行二次主题提取，为网络地 图服务匹配双层分类主题。</li>
            <li>基于Vue2搭建网站门户支持网络地图服务的检索和浏览，融合LeafLet、Echarts等工具实现数据分析和地 图交互。大批量网格数据在地图中渲染卡顿和白屏的问题是网站门户的开发难点，基于 GeoServer 可发布 不同尺度网格数据的图层瓦片，可大幅缩短网格数据加载的速度。通过拾取屏幕点击坐标的方式，弥补图层 瓦片的交互困难。</li>
            <li>该项目为本人的
                <a target="_blank" href="https://xueshu.baidu.com/usercenter/paper/show?paperid=1a370t00km3c0ey02d4u0rh0uh094541&site=xueshu_se">
                    毕业论文<img src="../assets/link.png"/>
                </a>
                ，也是重点基金项目的重要环节，项目获得
                <a target="_blank" href="https://xueshu.baidu.com/usercenter/paper/show?paperid=1s0h0em0a82j0mn0n9050vs0cg062346&site=xueshu_se">
                    EI 论文<img src="../assets/link.png"/>
                </a>
                一篇，专利一项《一种基于协同训练的 WMS 元数据文本多标签 分类方法》(审批后期)。
            </li>
        </ul>   
        <div class="cv-seperate" style="margin-top:1.5rem;">
            <strong>GTWR 云计算平台<a style="margin-left:0;" target="_blank" href="https://github.com/zhangmingemma/gtwr_vue"><img src="../assets/link.png"/></a></strong>
            <strong>项目负责人</strong>
            <span>2017.01-2017.06</span>
        </div>
        <ul>
            <li>该项目旨在搭建在线计算平台，支持用户在线设置参数进行 GTWR 计算，并实时获取计算结果与精度评估报告，本人负责 Web 前端开发、项目管理、项目集成及版本更新迭代等工作。</li>
            <li>Web前端使用Vue2框架搭建，融合Echarts/Echarts-gl实现三维动态可视化的首屏效果，并融合mapbox、Echarts 实现地图、数据交互。</li>
        </ul>
        <div class="cv-seperate" style="margin-top:1.5rem;">
            <strong>测绘遥感信息工程国家重点实验室研究生会</strong>
            <strong>主席</strong>
            <span>2016.12-2017.12</span>
        </div>
        <ul>
            <li>负责实验室研究生会与校研究生会、实验室学生工作办公室的信息上传下达，负责各部门工作的统筹安排，负责策划并筹办安排体育、学术、文娱活动。</li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.cv {
    @include outer-container();
    color: $font-black;
    font-size: $font-size-h5-excerpt;
    a {
        color: $font-dark-grey;
        margin-left:.5rem
    }
    img {
        width: 1.2rem;
        height: 1.2rem;
        display: inline-block;
        transform: rotate(90deg) translate(4px, -4px);
    }
}
.cv-header {
    margin-top: 2rem;
    display: flex;
    align-items: flex-end;
    &-contact {
        margin-left: 1rem;
        .cv-header-info {
            @include flex-center(vert);
            .item {
                @include flex-center(vert);
                &:nth-of-type(n+2) {
                    margin-left: 2rem;
                    @include media-breakpoint-down($content-min-width) {
                        margin-top: .4rem;
                        margin-left: 0;
                    }
                }
                img {
                    width: 24px;
                    height: 24px;
                    transform: rotate(0) translate(0, 0);
                }
            }
            @include media-breakpoint-down($content-min-width) {
                flex-wrap: wrap;
            }
        }
    }
}
.cv-title {
    margin-top: 1.5rem;
    margin-bottom: .8rem;
    padding-bottom: .3rem;
    border: 0 solid $line-dark-grey;
    border-bottom-width: .2rem;
}
.cv-seperate {
    span:nth-of-type(n+2),strong:nth-of-type(n+2) {
        margin-left: 3rem;
        @include media-breakpoint-down($content-min-width) {
            margin-left: 1.5rem;
        }
    }
    strong:nth-of-type(n+2) {
        margin-right: 3rem;
        @include media-breakpoint-down($content-min-width) {
            margin-right: 1.5rem;
        }
    }
}
.cv-subtitle {
    margin-top: .4rem;
    display: inline-block;
    &:nth-of-type(n+2) {
        margin-top: 1.5rem;
    }
}
ul {
    line-height: $line-height; 
    margin: .2rem 0;
    padding-left: 1.2rem;
}
</style>
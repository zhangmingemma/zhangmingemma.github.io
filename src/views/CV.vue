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
        <h3 class="cv-title">个人简介</h3>
        <div class="cv-seperate">
            <span>硕士毕业后即加入腾讯微信事业群，承担前端开发工作至今，2.5 年从 5 级 ( T1-3 )晋升至 9 级 ( T3-1 )。深  度参与多个互联网产品的前端开发工作，包含小程序、H5 形态，涉及移动端和 PC 端。熟悉 JavaScript、CSS、 HTML、Node 等前端开发语言，熟练使用 Vue、微信小程序等前端开发框架，能够利用 SQL 进行数据统计， 分析、定位问题。</span>
        </div>
        <h3 class="cv-title">工作经历</h3>
        <div class="cv-seperate">
            <strong>浦江实验室</strong>
            <strong style="display:inline-block; margin-left: 261px;">前端开发工程师</strong>
            <span>2023.02-至今</span>
        </div>
        <ul>
            <span class="cv-desc" style="margin-left: -18px;">待更新</span>
        </ul>
        <div class="cv-seperate" style="margin-top: 24px">
            <strong>腾讯科技有限公司—微信事业群—搜索应用部</strong>
            <strong>前端开发工程师</strong>
            <span>2019.07-2023.02</span>
        </div>
        <span class="cv-subtitle"><strong>1. 微信看一看</strong><span class="cv-desc">技术栈：vue2</span></span>
        <ul>
            <li>项目内容： 支持看一看前端业务迭代，提升前端开发调试效率； 构建公共样式组件库，梳理整治冗余逻辑， 改善代码污染现状；解决业务 case 追溯难题，增强业务问题定位能力。</li>
            <li>业务职责：完成看一看业务需求开发，负责在看内容流的迭代维护，以及直播形态的改版，主导开发冬奥会、 春晚、疫情动态等限时热点会场。</li>
            <li>看一看还原平台：作为项目负责人主导开发系统平台支持看一看的开发调试和历史还原。通过 JSAPI hook、 调试工具挂载、自定义配置注入实现业务和工具逻辑完全剥离，支持看一看的在线调试；利用交互行为埋点、 上报数据整合构造历史数据，套用原始渲染逻辑还原用户浏览现场， 同时支持多版本管理；通过 Nginx 代 理、Ajax hook 拦截网络请求、样式注入等方式实现无侵入式还原 H5 外链历史现场； 开发白板系统，提供 大盘数据统计、用户行为下钻分析等能力。  目前白板系统已推广应用于看一看产研团队，日均访问 20 +，日 均搜索 50 +，是产品团队 case debug 的主要途径和前后端开发调试的必备工具。</li>
        </ul>
        <span class="cv-subtitle"><strong>2. 微信搜一搜</strong><span class="cv-desc">技术栈：vue2</span></span>
        <ul>
            <li>项目内容： 支持搜一搜 C 端、  B 端业务迭代， 改善前端代码质量；提升前端数据上报规范性，改善数据上报 冗余现状；解决首屏加载耗时长的困境，优化用户体验 ，增强耗时问题定位能力。</li>
            <li>业务职责：负责教育、政务垂类富展示大卡等搜索结果的业务开发，以及热点推荐、商业化广告等小程序垂 搜前置引导页的开发维护；协同制定全场景下搜索前置引导页数据上报规范，实现统一的数据上报 API；负 责公众号、小程序账号搜索相关 B 端平台的需求迭代，包含服务提供方的服务管理、数据看板等。</li>
            <li>耗时优化：主导推进客户端在前置场景提前加载渲染环境、数据预请求、  改造轻量化 webview 等来提升 webview 预加载率；整合改造通用组件，拆分主包，按需异步引入组件，缩短主代码包和组件依赖的加载耗 时；开发白板系统， 通过关键节点埋点、数据日志关联、加载时间流的方式还原首屏渲染过程，支持从耗时 数据大盘到单个用户下钻等能力。耗时优化策略将搜一搜结果页打开率提升 30%，安卓端平均耗时缩减 800ms，IOS 端缩减 380ms；白板系统已应用于产研团队监控版本迭代中的耗时概况以及定位耗时问题。</li>
        </ul>
        <span class="cv-subtitle"><strong>3. 问一问在线咨询</strong><span class="cv-desc">技术栈：微信小程序</span></span>
        <ul>
            <li>项目内容： 负责问一问在线咨询的业务迭代， 缩短小程序首屏渲染的加载耗时，提升小程序打开率。</li>
            <li>C 端职责：负责政务垂类咨询服务的前端开发， 包含但不限于政务服务人员列表浏览、索引以及订单状态扭 转场景的前端开发。</li>
            <li>耗时优化：运用抓包工具和网络耗时分析工具， 对小程序冷启动过程做详细分析，找出耗时严重链路；利用 搜一搜前置场景通过私有通道调取客户端接口，完成小程序资源的提前加载；配合小程序分包、数据预加载、 提前 login 等能力，加速首屏渲染。</li>
            <li>耗时优化效果：优化涉及小程序加载的各个环节，在搜索结果内小程序打开率提升 15%，首屏渲染平均耗时 缩短 200ms，优化步骤已经形成方法论应用于部门内部各类小程序的初始化加载优化。</li>
        </ul>
        <span class="cv-subtitle"><strong>4. 微信圈子</strong><span class="cv-desc">技术栈：微信小程序</span></span>
        <ul>
            <li>主要职能 ：负责微信圈子的业务迭代，包含但不限于帖子编辑、发布、浏览流程，视频推荐流的浏览与交互， 以及圈组的管理流程开发。</li>
            <li>数据分析：捞取用户行为日志，进行数据分析统计，摸底用户的行为规律和统计指标，并利用数据分析手段 进行用户投诉排查和问题定位。</li>
        </ul>
        <h3 class="cv-title">实习经历</h3>
        <div class="cv-seperate">
            <strong>京东科技集团—微信手 Q 业务部—交易开发组</strong>
            <strong>前端开发实习生</strong>
            <span>2018.06-2018.08</span>
        </div>
        <ul>
            <li>项目内容： 所在团队负责微信/QQ 内京东购物入口下，购物车和订单等交易流程线的前端开发。</li>
            <li>主要职责： 本人在实习期间负责学习代码架构， 熟悉业务开发流程， 并单独负责优惠礼包、订单状态扭转前 端样式改版等部分业务需求开发， 并参与购物车代码重构。</li>
        </ul>
        <h3 class="cv-title">校园经历</h3>
        <div class="cv-seperate">
            <strong>网络地图服务分类检索门户<a style="margin-left:0;" target="_blank" href="https://github.com/zhangmingemma/vue_leaflet_mysql_geoserver"><img src="../assets/link.png"/></a></strong>
            <strong>项目负责人</strong>
            <span>2018.01-2019.02</span>
        </div>
        <ul>
            <li>项目内容：按照领域主题对网络地图服务进行分类，构建网站实现基于类别标签的服务检索。该项目为本人 的硕士毕业论文，本人承担包含算法设计实现、前后端开发等全部开发工作。</li>
            <li>主要职责： 设计基于 ML-KNN 和地理语料库的半监督协同训练式的文本分类方法 ，实现网络地图服务的多  标签分类；利用 LDA 进行二次主题提取，为网络地图服务匹配双层分类主题；搭建网站支持主题垂类检索， 融合数据分析和地图交互能力支持服务数据的浏览和分析。小比例尺粒度的服务统计热图在地图中渲染导致  的卡顿、白屏问题是该网站的开发难点， 基于 GeoServer 发布图层瓦片，可大幅缩短网格数据加载的速度。</li>
            <li>基于Vue2搭建网站门户支持网络地图服务的检索和浏览，融合LeafLet、Echarts等工具实现数据分析和地 图交互。大批量网格数据在地图中渲染卡顿和白屏的问题是网站门户的开发难点，基于 GeoServer 可发布 不同尺度网格数据的图层瓦片，可大幅缩短网格数据加载的速度。通过拾取屏幕点击坐标的方式，弥补图层 瓦片的交互困难。</li>
            <li>该项目获得优秀<a target="_blank" href="https://xueshu.baidu.com/usercenter/paper/show?paperid=1a370t00km3c0ey02d4u0rh0uh094541&site=xueshu_se">
                    毕业论文<img src="../assets/link.png"/>
                </a>称号，其中的核心算法发表<a target="_blank" href="https://xueshu.baidu.com/usercenter/paper/show?paperid=1s0h0em0a82j0mn0n9050vs0cg062346&site=xueshu_se">
                    EI 论文<img src="../assets/link.png"/>
                </a>一篇，专利一项《一种基于协同训练的 WMS 元 数据文本多标签分类方法》。
            </li>
        </ul>   
        <div class="cv-seperate" style="margin-top:1.5rem;">
            <strong>GTWR 云计算平台<a style="margin-left:0;" target="_blank" href="https://github.com/zhangmingemma/gtwr_vue"><img src="../assets/link.png"/></a></strong>
            <strong>项目负责人</strong>
            <span>2017.01-2017.06</span>
        </div>
        <ul>
            <li>项目内容： 搭建在线计算平台，支持用户在线设置参数进行 GTWR 计算，并实时获取计算结果与精度评估 报告。</li>
            <li>主要职责：本人负责 Web 前端开发、项目管理、项目集成及版本更新迭代等工作。Web 前端使用 Vue2 框 架搭建， 基于 Echarts/Echarts-gl 实现三维动态可视化，基于 mapbox、  Echarts 实现地图和数据交互。</li>
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
.cv-desc {
    color: rgba($color: #000000, $alpha: 0.4);
    margin-left: 32px;
}
</style>
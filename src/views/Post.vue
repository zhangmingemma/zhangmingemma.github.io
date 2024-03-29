<template>
    <div class="post">
        <div class="post-body">
            <div class="post-body-header">
                <h1 class="title">{{post.title}}</h1>
                <div class="footer">
                    <div class="footer-tags">
                        <div class="blog-tag" v-for="tag in post.tags" :key="tag" :tag="tag" @click="tapTag(tag)">{{tag}}</div>
                    </div>
                    <span>{{post.date}}</span>
                </div>
            </div>
            <div class="markdown-body" id="js-markdown-body" v-html="postHtml"/>
            <div class="post-body-helper" v-if="prePost || nextPost">
                <div class="post-body-helper__item pre" v-if="prePost" @click.stop="goOtherPost(prePost)">
                    <img src="../assets/double-arrow-left.png"/>
                    <span class="prefix">上一篇：</span>
                    <span class="title">{{prePost.title}}</span>
                </div>
                <div class="post-body-helper__item next" v-if="nextPost" @click.stop="goOtherPost(nextPost)">
                    <span class="prefix">下一篇：</span>
                    <span class="title">{{nextPost.title}}</span>
                    <img src="../assets/double-arrow-right-blue.png"/>
                </div>
            </div>
            <div class="post-body-gitalk" id="gitalk-container"></div>
        </div>

        <div class="post-catalog" :id="`${isCatalogFixed? 'js-catalog':''}`" v-if="isCatalogFixed && catalogHtml" :style="`width:${catalogOffset.width}px`"></div>
        <div class="post-catalog" :id="`${isCatalogFixed? '':'js-catalog'}`" :class="{fixed: isCatalogFixed}" :style="`${isCatalogFixed ? 'left:'+catalogOffset.left+'px':''}`" v-if="catalogHtml">
            <div class="post-catalog-wrap">
                <div class="post-catalog-wrap__title">目录</div>
                <div class="post-catalog-wrap__body" v-html="catalogHtml" @click.prevent="anchor($event)"></div>
            </div>
            <div class="post-catalog-wrap" v-if="sameSetPostList && sameSetPostList.length > 1">
                <div class="post-catalog-wrap__title">同系列相关文章</div>
                <div class="post-catalog-wrap__body set-post-list">
                    <ul>
                        <li v-for="(item, itemIdx) in sameSetPostList.filter(x => x.name != post.name)" :key="itemIdx">
                            <a @click.stop="goOtherPost(item)">{{item.title}}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from '@vue/runtime-core'
import Gitalk from 'gitalk'
import { useRoute, useRouter } from 'vue-router'
import { GitHubOAuth, toTop } from '@tool/Tool'
import PostHandler from '@tool/PostHandler'
import catalogHandler from '@tool/CatalogHandler'
import 'gitalk/dist/gitalk.css'
import 'github-markdown-css'
const md5 = require('js-md5')

type IPost = typeof PostHandler.Post
export default defineComponent({
    setup() {
        let route = useRoute()
        let router = useRouter()
        let fileName:any = route.query.file
        let isCatalogFixed = ref<boolean>(false)
        let _postCompiler = PostHandler.postCompiler(fileName)
        
        const onScroll = () => {
            const pageY:number = window.pageYOffset
            const targetY:number = catalogHandler.getCatalogOffset().top
            isCatalogFixed.value = pageY > targetY
        }
        
        toTop()
        window.addEventListener('scroll', onScroll, false)

        watch(() => route.query.file, () => {
            if (route.query.file != fileName && route.path.includes('post')) {
                location.reload()
            }
        })

        // 初始化gitalk
        onMounted(() => {
            const gitalk = new Gitalk({
                clientID: GitHubOAuth.ClientID,
                clientSecret: GitHubOAuth.ClientSecret,
                repo: GitHubOAuth.Repo,
                owner: GitHubOAuth.Owner,
                admin: [GitHubOAuth.Owner],
                id: md5(fileName),
                distractionFreeMode: false
            })
            gitalk.render('gitalk-container')
        })

        const tapTag = (tag:string) => {
            if (!tag) return 
            toTop()
            setTimeout(() => {
                router.push(`/tag?tag=${tag}`)
            })
        }

        const goOtherPost = (item:IPost) => {
            if (!item.name) return
            router.push({
                path: `/post`,
                query: {
                    file: item.name
                }
            })
        }

        return {
            isCatalogFixed,
            ..._postCompiler,
            tapTag,
            goOtherPost
        }
    }
})
</script>
<style lang="scss" scoped>
.post {
    @include outer-container();
    max-width: $content-max-width + $aside-width;
    display: flex;
    &-body {
        flex: 1;
        width: 0;
        padding-top: 2rem;
        &-header {
            .title {
                padding: 0;
                margin: 0;
                font-size: $font-size-header-list;
            }
            .footer {
                @include flex-center(vert);
                margin: .8rem 0 1.5rem;
                &-tags {
                    flex: 1;
                    width: 0;
                }
                span {
                    color: $font-mid-grey;
                    margin: 0 0 0 .6rem;
                    flex-shrink: 0;
                }
            }
        }
        &-helper {
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid $line-grey;
            display: flex;
            align-items: center;
            justify-content: space-between;
            &__item {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                cursor: pointer;
                &:not(:first-of-type) {
                    margin-left: 1rem;
                }
                span {
                    color: $link-blue;
                }
                .prefix {
                    color: $font-mid-grey;
                    flex-shrink: 0;
                }
                .title {
                    @include singleLine;
                }
                img {
                    width: 1.5rem;
                    height: 1.5rem;
                    flex-shrink: 0;
                }
                &.next {
                    justify-content: flex-end;
                    flex: 1;
                }
            }
        }
    }
    &-catalog {
        max-width: $aside-width;
        box-sizing: border-box;
        flex-shrink: 0;
        padding-left: 4.5rem;
        padding-top: 2rem;
        &.fixed {
            position: fixed;
            z-index: 2;
            -webkit-font-smoothing: subpixel-antialiased;
            top: 0;
            left: 969px;
            padding-top: 2rem;
        }
        &.hide {
            opacity: 0;
        }

        @include media-breakpoint-down($content-width) {
            display: none;
        }

        &-wrap {
            background: $bg-light-grey;
            margin-bottom: 2rem;
            padding: 1rem;
            border-radius: 4px;
            box-shadow: 1.5px 1.5px rgba(0, 0, 0, 0.05);
            min-width: 240px;
            &__title {
                font-size: $font-size-h1-excerpt;
                font-weight: bold;
                padding-bottom: .75rem;
                border-bottom: 1px solid $line-grey;
            }
            &__body {
                margin-top: 1.5rem;
            }
            .set-post-list {
                margin-top: .75rem;
                ul{
                    padding: 0;
                    margin: 0;
                    padding-left: 1rem;
                    font-size: $font-size-h6-excerpt;
                    color: $link-blue;
                }
                li {
                    padding: .15rem 0;
                    a {
                      cursor: pointer;
                    }
                }
            }
        }      
    }
}

</style>
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
            <div class="post-body-gitalk" id="gitalk-container"></div>
        </div>

        <div class="post-catalog" :id="`${isCatalogFixed? 'js-catalog':''}`" v-if="isCatalogFixed && catalogHtml" :style="`width:${catalogOffset.width}px`"></div>
        <div class="post-catalog" :id="`${isCatalogFixed? '':'js-catalog'}`" :class="{fixed: isCatalogFixed}" :style="`${isCatalogFixed ? 'left:'+catalogOffset.left+'px':''}`" v-if="catalogHtml">
            <div class="catalog-title">目录</div>
            <div class="catalog-body" v-html="catalogHtml" @click.prevent="anchor($event)"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/runtime-core'
import Gitalk from 'gitalk'
import { useRoute, useRouter } from 'vue-router'
import { GitHubOAuth, toTop } from '@tool/Tool'
import PostHandler from '@tool/PostHandler'
import catalogHandler from '@tool/CatalogHandler'
import 'gitalk/dist/gitalk.css'
import 'github-markdown-css'
const md5 = require('js-md5')

export default defineComponent({
    setup() {
        const route = useRoute()
        const router = useRouter()
        const fileName:any = route.query.file
        const isCatalogFixed = ref<boolean>(false)
        const _postCompiler = PostHandler.postCompiler(fileName)

        const onScroll = () => {
            const pageY:number = window.pageYOffset
            const targetY:number = catalogHandler.getCatalogOffset().top
            isCatalogFixed.value = pageY > targetY
        }

        const tapTag = (tag:string) => {
            if (!tag) return 
            toTop()
            router.push(`/tag?tag=${tag}`)
        }

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
        window.addEventListener('scroll', onScroll, false)

        return {
            isCatalogFixed,
            ..._postCompiler,
            tapTag
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
        &-title {
            font-size: $font-size-h1-excerpt;
        }
        &-body {
            margin: 1rem 0;
        }
        @include media-breakpoint-down($content-width) {
            display: none;
        }
    }
}

</style>
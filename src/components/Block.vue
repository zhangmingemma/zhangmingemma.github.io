<template>
    <article v-if="post">
        <h1 @click="tapPost(post.name)">{{post.title}}</h1>
        <div class="abstract">{{post.abstract}}</div>
        <a @click="tapPost(post.name)">点我阅读更多...</a>
        <div class="footer">
            <div class="footer-tags">
                <div class="blog-tag" v-for="tag in post.tags" :key="tag" :tag="tag" @click="tapTag(tag)">{{tag}}</div>
            </div>
            <span>{{post.date}}</span>
        </div>
    </article>
</template>

<script lang="ts">
import { toTop } from '@/utils/tool/Tool'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
    props: ["post"],
    setup() {
        const router = useRouter()
        const tapPost = (name:string) =>{
            toTop()
            router.push(`/post?file=${name}`)
        }
        const tapTag = (tag:string) => {
            toTop()
            router.push(`/tag?tag=${tag}`)
        }
        return {
            tapTag,
            tapPost
        }
    }
})
</script>

<style scoped lang="scss">
article {
    padding-bottom: 1.3rem;
    margin: 2.6rem 0 1rem 0;
    &:not(:last-child) {
        border: 0 solid $line-grey;
        border-bottom-width: 1px;
    }
    h1 {
        font-size: $font-size-header-list;
        color: $font-dark-grey;
        font-weight: $font-weight-bold;
        margin: .5rem 0;
        cursor: pointer;
    }
    .abstract {
        font-size: $font-size-h5-excerpt;
        line-height: $line-height-large;
        word-wrap: break-word;
    }
    a {
        text-decoration: none;
        color: $link-red;
        font-size: $font-size-h5-excerpt;
        font-weight: $font-weight-bold;
        cursor: pointer;
    }
    .footer {
        @include flex-center(vert);
        margin: .8rem 0;
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
</style>

<template>
    <div class="list">
        <div class="list-tag">
            <div class="blog-tag" :class="{selected: !selectedTags.length}" @click="tapAll">All</div>
            <div class="blog-tag" :class="{selected: selectedTags.indexOf(item)>=0}" v-for="item in tagList" :key="item" @click="tapTag(item)">{{item}}</div>
        </div>
        <div class="list-main">
            <div class="list-main-item" v-for="(post,index) in postList" :key="index" @click="tapPost(post.name)">
                <span class="date">{{post.date}}</span>
                <span class="title">{{post.title}}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import ListHandler from '@/utils/tool/ListHandler'
import { toTop } from '@/utils/tool/Tool'
import { useRouter } from 'vue-router'

export default defineComponent({
    setup() {
        const router = useRouter()
        const state = reactive({
            tagList: [] as string[],
            selectedTags: [] as string[]
        })
        const _listCompiler = ListHandler.listCompiler({banPagination: true})
        state.tagList = ListHandler.getAllPostTag()

        const tapTag = (tag:string) => {
            if (!tag) return 
            const idx = state.selectedTags.indexOf(tag)
            if ( idx >= 0) {
                state.selectedTags.splice(idx,1)
            } else {
                state.selectedTags.push(tag)
            }
            _listCompiler.reloadList({
                tags: state.selectedTags
            })
        }

        const tapAll = () => {
            state.selectedTags = []
            _listCompiler.reloadList()
        }

        const tapPost = (name:string) => {
            if (!name) return 
            toTop()
            router.push(`/post?file=${name}`)
        }

        return {
            ...toRefs(state),
            ..._listCompiler,
            tapPost,
            tapTag,
            tapAll
        }
    }
})
</script>

<style lang="scss" scoped>
.list {
    @include outer-container();
    padding-bottom: 1.3rem;
    margin-top: 2.6rem;

    .blog-tag {
        &.selected {
            background: $link-red;
            color: $font-white;
        }
    }

    &-main {
        margin-top: 2.6rem;
        position: relative;
        &:before {
            content: '';
            position: absolute;
            top: 0;
            left: 7px;
            bottom: 0;
            width: .1rem;
            background: $line-catalog-grey;
            opacity: .5;
            @include media-breakpoint-down($content-min-width) {
                left: 5px;
            }
        }
        &-item {
            margin: .6rem 0;
            padding: .2rem 0 .2rem 2.6rem;
            position: relative;
            display: flex;
            flex-wrap: nowrap;
            @include item-dot(6px, 50%, 5px, .8rem);
            @include media-breakpoint-down($content-min-width) {
                padding-left: 2rem;
                @include item-dot(6px, 50%, 3px, .8rem);
            }

            .date {
                cursor: pointer;
                color: $font-mid-grey;
                width: 7rem;
                display: inline-block;
                flex-shrink: 0;
                @include media-breakpoint-down($content-min-width) {
                    width: 6rem;
                }
            }

            .title {
                cursor: pointer;
                @include media-breakpoint-down($content-min-width) {
                    @include singleLine();
                    word-break: break-all;
                }
                &:hover, &:active, &:focus, &:link {
                    color: $link-red;
                }
            }
        }
    }
}
</style>

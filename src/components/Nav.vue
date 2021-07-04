<template>
    <div class="header">
        <div class="header-inner clearfix" :class="{'larger-nav': isPost}">
            <div class="header-inner-logo">
                <img src="../assets/logo.png"/>
                <router-link class="title home" to="/">Gemma's Blog</router-link>
            </div>
            <div class="header-inner-nav">
                <router-link class="title" to="/">主页</router-link>
                <router-link class="title" to="/list">归档</router-link>
                <router-link class="title" to="/cv">CV</router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
    setup() {
        const route = useRoute()
        const isPost = ref(false as Boolean)
        watch(() => route.name, () => {
            isPost.value = route.name === 'Post'
        })

        return {
            isPost
        }
    }
})
</script>

<style scoped lang="scss">
.header {
    background-color: $bg-grey;
    border-bottom: 1px solid $line-grey;
    &-inner {
        @include outer-container();
        transition: all .3s ease;
        &.larger-nav {
            max-width: $content-max-width + $aside-width;
        }
        &-logo {
            float: left;
            flex-wrap: wrap;
            height: $header-height;
            @include flex-center(vert);
            @include media-breakpoint-down($content-min-width) {
                float: none;
                height: $header-height-small;
            }
            img {
                width: $font-size-h4 * 1.6;
                height: $font-size-h4 * 1.6;
                margin-right: .8rem;
                vertical-align: middle;
                @include media-breakpoint-down($content-max-width) {
                    margin-right: .5rem;
                    width: $font-size-h4 * 1.2;
                    height: $font-size-h4 * 1.2;
                }
            }
            .title {
                @include nav-link();
                font-size: $font-size-h4;
                display: inline-block;
                @include media-breakpoint-down($content-max-width) {
                    font-size: $font-size-h4-small;
                }
                &.home {
                    &.active, &:hover, &:focus {
                        color: $font-dark-grey;
                    }
                }
            }
        }
        &-nav {
            float: right;
            overflow-x: auto;
            white-space: nowrap;
            height: $header-height;
            flex-wrap: nowrap;
            @include flex-center(vert);
            @include media-breakpoint-down($content-min-width) {
                float: none;
                height: auto;
            }
            .title {
                @include nav-link();
                margin-top: .5rem;
                margin-bottom: .5rem;
                list-style-type: none;
                margin-right: 1rem;
            }
        }
    }
}
.clearfix:after {
    content: "";
    display: table;
    clear: both;
    height: 0;
    font-size: 0;
}
</style>

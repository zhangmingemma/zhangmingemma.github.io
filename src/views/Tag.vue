<template>
    <div class="tag">
        <div class="tag-header">
            <div>{{tag}}</div>
            <span>{{total}}篇文章</span>
        </div>
        <template v-for="(post, index) in postList" :key="index">
            <Block :post="post"/>
        </template>
    </div>
</template>

<script lang="ts">
import ListHandler from '@tool/ListHandler'
import { defineComponent, ref } from '@vue/runtime-core'
import Block from '@/components/Block.vue'
import { useRoute } from 'vue-router'

export default defineComponent({
    setup() {
        const tag = ref<any>('')
        const route = useRoute()
        tag.value = route.query.tag
        const _listCompiler = ListHandler.listCompiler({tags: [tag.value]})
        return {
            ..._listCompiler,
            tag
        }
    },
    components: { Block }
})
</script>

<style lang="scss" scoped>
.tag {
    @include outer-container();
    padding: 0;
    &-header {
        height: $header-height-large;
        background: $bg-light-grey;
        @include flex-center();
        flex-direction: column;
        font-size: $font-size-h3-small;
        font-weight: $font-weight-bold;
        span {
            margin-top: .2rem;
            font-size: $font-size-h4-excerpt;
            font-weight: $font-weight;
        }
    }
}
</style>
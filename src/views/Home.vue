<template>
    <div class="home">
        <template v-for="(post, index) in postList">
            <Block  :key="index" :post="post"/>
        </template>
        <Pagination :total="total" :onPageChange="onPageChange"/>
    </div>
</template>

<script lang="ts">
import ListHandler from '@tool/ListHandler'
import { defineComponent } from '@vue/runtime-core'
import Block from '@/components/Block.vue'
import Pagination from '@/components/Pagination.vue'
import { toTop } from '@/utils/tool/Tool'

export default defineComponent({
    setup() {
        const _listCompiler = ListHandler.listCompiler()

        const onPageChange = (startIndex:number, endIndex:number) => {
            toTop()
            _listCompiler.reloadList({startIndex, endIndex})
        }

        return {
            ..._listCompiler,
            onPageChange
        }
    },
    components: { Block, Pagination }
})
</script>

<style lang="scss" scoped>
.home {
    @include outer-container();
}
</style>

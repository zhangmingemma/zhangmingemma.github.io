<template>
    <div class="pagination" v-if="total > pageSize">
        <div class="pagination-title">共计{{total}}篇文章，{{pageCount}}页</div>
        <div class="pagination-main">
            <div class="pagination-main-item break start" :class="{disable: curPage === 1}" @click="toPre"></div>
            <div 
                class="pagination-main-item" 
                :class="{active:page === curPage, empty:page === '...'}" 
                v-for="page in pageLine" 
                :key="page" 
                @click="toJump(page)">{{page}}</div>
            <div class="pagination-main-item break" :class="{disable: curPage === pageCount}" @click="toNext"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { PageConfig } from '@/utils/tool/Tool'
import { computed, defineComponent, reactive, Ref, ref, toRefs, watch } from 'vue'

export default defineComponent({
    props: {
        total: {
            type: Number,
            default: 0
        },
        onPageChange: {
            type: Function,
            default: () => () => {}
        }
    },
    setup(props) {
        const pageSize:number = PageConfig.PageSie
        const paginationSize:number = 6
        const curPage = ref<number>(1)
        const state = reactive({
            pageLine: [] as (number|string)[]
        })

        const getPageLine = () => {
            if (pageCount.value <= paginationSize) {
                const list = Array.from(new Array(pageCount.value).keys())
                return list.map(n => n+1)
            }
            let pageLine:(number|string)[] = []
            if (curPage.value - 1 > 1) {
                pageLine.push(curPage.value - 1)
            } 
            pageLine.push(curPage.value)
            if (curPage.value + 1 < pageCount.value) {
                pageLine.push(curPage.value + 1)
            }
            if (pageLine[0] > 2) {
                pageLine.unshift('...')
            }
            if (pageLine[0] != 1) {
                pageLine.unshift(1)
            }
            if (pageLine[pageLine.length - 1] < pageCount.value - 1) {
                pageLine.push('...')
            }
            if (pageLine[pageLine.length - 1] != pageCount.value) {
                pageLine.push(pageCount.value)
            }
            return pageLine
        }

        const pageCount:Ref<number> = computed(() => Math.ceil(props.total / pageSize))
        state.pageLine = getPageLine()
        watch(() => curPage.value, ()=> {
            state.pageLine = getPageLine()
            const startIndex = (curPage.value - 1)*pageSize
            const endIndex = startIndex + pageSize
            props.onPageChange && props.onPageChange(startIndex, endIndex)
        })

        watch(() => pageCount.value, () => {
            state.pageLine = getPageLine()
        })

        const toPre = () => {
            const pre:number = curPage.value - 1
            curPage.value = pre >= 1 ? pre : curPage.value
        }

        const toNext = () => {
            const next:number = curPage.value + 1
            curPage.value = next <=  pageCount.value ? next : curPage.value
        }

        const toJump = (to:string|number) => {
            if (typeof to === 'string') return 
            curPage.value = to >= 1 && to <= pageCount.value ? to : curPage.value
        }
        
        return {
            curPage,
            pageCount,
            pageSize,
            ...toRefs(state),
            toPre,
            toNext,
            toJump
        }
    }
})
</script>

<style scoped lang="scss">
.pagination-title {
    margin: .5rem 0;
}
.pagination-main {
    @include flex-center(vert);
    flex-wrap: wrap;
    &-item {
        @include flex-center();
        margin: .2rem .25rem .2rem 0;
        color: $font-dark-grey;
        background: $bg-grey;
        width: $font-size-h1-small;
        height: $font-size-h1-small;
        border-radius: 50%;
        font-weight: $font-weight-bold;
        line-height: 1;
        box-sizing: border-box;
        position: relative;
        cursor: pointer;
        transition: all .3s ease;
        &.empty {
            background: transparent;
        }
        &.break {
            &:after {
                position: absolute;
                content: '';
                width: $font-size-h6-excerpt;
                height: $font-size-h6-excerpt;
                background-image: url('../assets/arrow.png');
                background-repeat: no-repeat;
                background-size: contain;
            }
            &.start {
                &:after {
                    transform: rotate(180deg);
                }
            }
            &.disable {
                cursor: not-allowed;
                &:after {
                    background-image: url('../assets/arrow_disable.png') !important;
                }
                &:hover, &:active, &:focus {
                    color: $font-opacity-grey;
                    background: $bg-grey;
                }
            }
            &:hover, &:active, &:focus, &.active {
                &:after {
                    background-image: url('../assets/arrow_white.png');
                }
            }
        }
        &:hover, &:active, &:focus, &.active {
            color: $font-white;
            background: $link-red;
        }
    }
}
</style>

import { reactive, ref, toRefs, watchEffect} from "@vue/runtime-core"
import PostHandler from "./PostHandler"
import { intersect, PageConfig, promiseSync } from "./Tool"

type IPost = typeof PostHandler.Post
class ListHandler {
    TotalPost:IPost[] = []

    listCompiler({tags=[], banPagination=false}:{tags?:string[], banPagination?:boolean}={}) {
        const total = ref<number>(0)
        const state = reactive({
            postList: [] as IPost[]
        })
        const reloadList = ({tags=[], startIndex=0, endIndex=0}:{tags?:string[], startIndex?:number, endIndex?:number}={}) => {
            let tagList = this.filterPost({list:this.TotalPost.slice(), tags})
            total.value = tagList.length
            state.postList = this.filterPost({
                list:tagList, 
                startIndex, 
                endIndex
            })         
        }

        const { res } = this.getAllPostContent() 
        watchEffect(() => {
            if (res.value) {
                this.TotalPost = this.sortPost(res.value.slice())
                if (banPagination) {
                    reloadList({tags})
                } else {
                    reloadList({tags, endIndex: PageConfig.PageSie})
                }
            }
        })

        return {
            total,
            reloadList,
            ...toRefs(state)
        }
    }

    // 根据条件过滤
    filterPost({list, tags=[], startIndex=0, endIndex=0}:{list:IPost[] ,tags?:string[], startIndex?:number, endIndex?:number}) {
        let _endIndex = endIndex || list.length
        let _list = list.slice()
        if (tags && tags.length) {
            _list = list.filter((post:IPost) => post && post.tags && intersect(post.tags, tags).length)
        } 
        return _list.slice(startIndex, _endIndex)
    }

    // 文章时间升序
    sortPost(list: IPost[]) {
        const _list = list.slice()
        _list.sort((a:IPost,b:IPost) => {
            const dateA:string = a.date?.replaceAll('-','') || ''
            const dateB:string = b.date?.replaceAll('-','') || ''
            return parseInt(dateB) - parseInt(dateA)
        })
        return _list
    }

    // 获取所有文章文件名
    getAllPostPath() {
        const files = require.context("../../../public/posts", true, /\.md/)
        return files.keys() 
    }

    // 获取所有文章内容
    getAllPostContent() {
        if (this.TotalPost.length) {
            const res = ref<IPost[]>([])
            res.value = this.TotalPost
            return {
                res
            }
        }
        const files = this.getAllPostPath()
        return promiseSync<IPost[]>(
            Promise.all(files.map(async (path:string) => {
                const fileName:string = PostHandler.getPostName(path)
                const info:IPost = await PostHandler.getPostInfo(fileName)
                return info
            }))
        )
    }

    // 获取所有文章tag
    getAllPostTag() {
        const tagList:string[] = []
        this.TotalPost.map((post:IPost) => {
            post.tags?.map((tag:string) => {
                if (tagList.indexOf(tag) < 0) {
                    tagList.push(tag)
                }
            })
        })
        return tagList
    }
}

export default new ListHandler()
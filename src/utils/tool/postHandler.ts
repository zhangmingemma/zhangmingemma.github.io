import { nextTick, reactive, ref, toRefs, watchEffect} from "@vue/runtime-core"
import axios, { AxiosResponse } from "axios"
import CatalogHandler from "./CatalogHandler"
import { promiseSync, getPostPath } from "./Tool"
import hljs from 'highlight.js'
import ListHandler from "./ListHandler"
const marked = require('marked')
const markedAST = require('marked-ast')

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true, //默认为true。 允许 Git Hub标准的markdown.
    tables: true, //默认为true。 允许支持表格语法。该选项要求 gfm 为true。
    breaks: true, //默认为false。 允许回车换行。该选项要求 gfm 为true。
    pedantic: false, //默认为false。 尽可能地兼容 markdown.pl的晦涩部分。不纠正原始模型任何的不良行为和错误。
    smartLists: true,
    smartypants: true, //使用更为时髦的标点，比如在引用语法中加入破折号。
    highlight: function (code:any) {
        return hljs.highlightAuto(code).value;
    },
});

type IPost = {
    title?:string, 
    date?:string, 
    tags?:string[], 
    name?: string,
    abstract?:string,
    content?: string,
    set?: string
}

class PostHandler {
    Post:IPost = {}
    postCompiler(fileName:string) {
        const postHtml = ref<string>('')
        const catalogHtml = ref<string>('')
        const state = reactive({
            catalogOffset: null as typeof CatalogHandler.CatalogOffset,
            post: {} as IPost,
            prePost: null as IPost|null,
            nextPost: null  as IPost|null,
            sameSetPostList: [] as any
        })
        const { res } = promiseSync<IPost>(this.getPostInfo(fileName))      
        watchEffect(async() => {
            if (res.value && res.value.content) {
                state.post = res.value
                postHtml.value = marked(res.value.content)
                await nextTick()
                catalogHtml.value = CatalogHandler.getCatalogHtml()
                CatalogHandler.setHId()
                await nextTick()
                state.catalogOffset = CatalogHandler.getCatalogOffset(true)
            }
        })

        const _listCompiler = ListHandler.listCompiler({ banPagination: true })

        watchEffect(() => {
            if (_listCompiler.postList) {
                const curIndex = _listCompiler.postList.value.findIndex((item:IPost) => item.name == fileName)
                state.prePost = _listCompiler.postList.value?.[curIndex + 1] || null
                state.nextPost = _listCompiler.postList.value?.[curIndex - 1] || null
                if (state.post.set) {
                    state.sameSetPostList = _listCompiler.postList.value.filter((item:IPost) => item.set == state.post.set)
                }
            }
        })
        
        window.onresize = () => {
            state.catalogOffset = CatalogHandler.getCatalogOffset(true)
        }

        return {
            postHtml,
            catalogHtml,
            ...toRefs(state),
            anchor: CatalogHandler.anchor
        }
    }

    // 获取文章信息
    async getPostInfo(fileName:string) {
        if (!fileName) return {}
        const post:AxiosResponse = await axios.get(`${getPostPath()}/${fileName}.md`)
        const data:string = post.data
        const info:IPost = {}
        if (data) {
            info['content'] = data
            info['abstract'] = this.getPostAbstract(data)
            info['name'] = this.getPostName(fileName)
            const layout = this.matchPostBase(data)
            if (layout && layout.length >= 4) {
                info['title'] = layout[1]
                info['date'] = layout[2]
                info['tags'] = layout[3].split(',').map(s => s.trim())
                info['set'] = (layout?.[4] || '').replace('set: ', '')
            }
        }
        return info
    }

    // 获取文章文件名
    getPostName(filePath:string) {
        if (filePath) {
            const paths:string[] = filePath.split('/')
            if (paths && paths.length) {
                const fileName:string|undefined = paths.pop()
                if (fileName) {
                    return fileName.replace(/\.\w+$/, '')
                }
            }
        }
        return ''
    }

    // 匹配文章头部文本
    matchPostBase(data:string) {
        const content:string = data.split('\n').map(s => s.trim()).join('')
        return content.match(/-+title: (.*?)date: (.*?)tags: (.*?)((set: (.*?))?)-+/)
    }

    // 匹配文章摘要
    getPostAbstract(data:string) {
        const content:RegExpMatchArray|null = data.match(/--- -->(\s+(.*))+/)
        if (content && content.length >= 1) {
            const text:string = content?.[0].replace('--- -->', '')
            const ast:object[] = markedAST.parse(text.trim())
            const abstract:string = this.parseMarkAst(ast).slice(0, 500)
            return abstract+'...'
        }
        return ''
    }

    parseMarkAst(ast:object[]) {
        let result:string = ''
        if (ast && ast.length) {
            ast.map((astItem:any) => {
                if (['paragraph', 'heading', 'strong', 'em'].indexOf(astItem?.type) >= 0) {
                    if (astItem.text && astItem.text.length) {
                        astItem.text.map((textItem:any) => {
                            if (typeof textItem === 'string') {
                                result += this.getAstText(textItem)
                            } else if (typeof textItem === 'object') {
                                const text = textItem?.text?.[0]
                                if( text && typeof text === 'string') {
                                    result += text.replaceAll('\n','').trim()
                                }
                            }
                        })
                    }
                }

                if (astItem?.type === 'list' && astItem?.body?.length) {
                    astItem.body.map((listItem:any) => {
                        if (listItem.type === 'listitem') {
                            result += this.parseMarkAst(astItem)
                        }
                    })
                } 
            })
        }
        return result
    }

    getAstText(text:string) {
        const noSpaceText = text.replaceAll('\n', '').trim()
        const noHtmlText = noSpaceText.replace(/<[^>]+>/g, ' ')
        return noHtmlText
    }
}

export default new PostHandler()

class CatalogHandler {
    CatalogMaxLevels:number = 3
    CatalogList:string[] | null = []
    CatalogOffset:null | {
        left:number, 
        top:number, 
        width:number
    } = null

    // 获取目录位置
    getCatalogOffset(reload:boolean=false) {
        if (!this.CatalogOffset || reload) {
            const catalogEle:HTMLElement|null = document.getElementById('js-catalog')
            this.CatalogOffset = {
                left: catalogEle?.offsetLeft || 0,
                top: catalogEle?.offsetTop || 0,
                width: catalogEle?.offsetWidth || 0
            }
        }
        return this.CatalogOffset
    }

    // 获取当前文章的目录html
    getCatalogHtml() {
        let tocs = this.getAllH()!
        let levelStack:string[] = [] 
        let htmlResult:string = ''
        this.CatalogList = tocs
        if(!tocs || !tocs.length) {
            return htmlResult
        }
        tocs.forEach((toc:string, index:number) => {
            let itemText:string = this.getHText(toc)   //匹配h标签的文字
            let itemLabel:string = this.getHLabel(toc)    //匹配h标签的级别<h?>
            let levelIndex:number = levelStack.indexOf(itemLabel)
            if (levelIndex < 0 ) {
                if (levelStack.length < this.CatalogMaxLevels) {
                    levelStack.unshift(itemLabel)
                    htmlResult += this.addStartUl()
                    htmlResult += this.addLi(itemText, index)
                }
            } 
            else if (levelIndex === 0) {
                htmlResult += this.addLi(itemText, index)
            }
            else {
                while(levelIndex--) {
                    levelStack.shift()
                    htmlResult += this.addEndUl()
                }
                htmlResult += this.addLi(itemText, index)
            }
        })
        while(levelStack.length) {
            levelStack.shift()
            htmlResult += this.addEndUl()
        }
        return htmlResult
    } 

    // 避免vue-router路由变化与a标签锚定冲突
    anchor(event:any) {
        if(event?.target.nodeName === 'A') {
            const href:string = event.target.attributes?.href?.value
            const anchorName:string = href.substring(1, href.length)
            let anchorEle = document.getElementById(anchorName)
            if ( anchorEle ) {
                anchorEle.scrollIntoView({behavior: "smooth"})
            }
        }
    }

    // 获取文章的h标签数组
    getAllH() {
        const markdownBody:(HTMLElement | null) = document.getElementById('js-markdown-body')!
        const tocs:(string[] | null) = markdownBody.innerHTML.match(/<[hH][1-6](\s.*?)>.*?<\/[hH][1-6]>/g)
        return tocs
    }  
    
    // 匹配h标签的级别<h?>
    getHLabel(toc:string) {
        const tag = toc.match(/<\w+?(\s.*?)>/)?.[0]!
        return tag.replace(/id=\"(.*?)\"/,'').replaceAll(/\s/g,'')
    }

    // 匹配h标签的文本
    getHText(toc:string) {
        return toc.replace(/<[^>]+>/g, '')
    }

    // 插入标题块起始标签
    addStartUl() {
        return `<ul class="catalog-list">`
    }

    // 插入标题块闭合标签
    addEndUl() {
        return `</ul>\n`
    }

    // 插入标题行
    addLi(text:string, index:number) {
        return `<li class="item"><a href="#heading-${index}" title="${text}">${text}</a></li>\n`
    }

    // 设置H标签id， id需要重写，不能包含特殊符号
    setHId() {  
        if (!this.CatalogList) return 
        this.CatalogList.map((catalog:string, index:number) => {
            const text:string = this.getHText(catalog)
            const label:string = this.getHLabel(catalog)
            const tagName:string = label.replace('<', '').replace('>', '')
            const tagEles:HTMLCollection = document.getElementsByTagName(tagName)
            for(let i=0; i<tagEles.length; i++) {
                    const tag:any = tagEles[i]
                    if (tag.innerHTML === text) {
                            const id:string = `heading-${index}`
                            tag.setAttribute('id', id)
                    } 
            }
        })
    }
}

export default new CatalogHandler()
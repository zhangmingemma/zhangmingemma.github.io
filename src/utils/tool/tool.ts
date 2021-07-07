import { ref, Ref } from "@vue/reactivity"

export const GitHubOAuth = {
    ClientID: 'f2fc4c018508a76889b4',
    ClientSecret: 'c61f4feab775f95de8af0e4e215e1a5b2b54707c',
    Repo: 'zhangmingemma.github.io',
    Owner: 'zhangmingemma',
}

export const PageConfig = {
    PageSie: 5
}

export const promiseSync = <U>(fn:Promise<U>) => {
    const res:Ref<U | null> = ref(null)
    fn.then((result:U) => {
        res.value = result
    })
    return {
        res
    }
}

export const toTop = () => {
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth'})
    })
}

export const intersect = (listA:(string|number)[], listB:(string|number)[]) => {
    if (listA instanceof Array && listB instanceof Array) {
        return listA.filter(x => listB.indexOf(x) >= 0) || []
    }
    return []
}

export const getPostPath = () => {
    return process.env.NODE_ENV === "production" ? "./dist/posts" : "./posts"
}

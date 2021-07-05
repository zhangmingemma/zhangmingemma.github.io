import { ref, Ref } from "@vue/reactivity"

export const GitHubOAuth = {
    ClientID: 'f58ae97977cacfb0fd1a',
    ClientSecret: '30e8b9f65e708c38db48206cbbea8d80a5a2e128',
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
    return listA.filter(x => listB.indexOf(x) >= 0) || []
}

export const getPostPath = () => {
    return process.env.NODE_ENV === "production" ? "./dist/posts" : "./posts"
}

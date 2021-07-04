import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import List from '@/views/List.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/list',
        name: 'List',
        component: List
    },
    {
        path: '/cv',
        name: 'CV',
        component: () => import('../views/CV.vue')
    },
    {
        path: '/post',
        name: 'Post',
        component: () => import('../views/Post.vue')
    },
    {
        path: '/tag',
        name: 'Tag',
        component: () => import('../views/Tag.vue')
    },
]

const router = createRouter({
    // history: createWebHistory(process.env.BASE_URL), // history模式
    history: createWebHashHistory(),
    routes
})

export default router

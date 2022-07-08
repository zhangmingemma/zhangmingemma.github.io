import { createApp } from 'vue'
import App from './views/App.vue'
import router from './router'
import Nav from '@/components/Nav.vue'
import '@style/_common.scss'
import 'highlight.js/styles/github.css'
import 'highlight.js/styles/atom-one-dark.css'

const app = createApp(App)
app.component('Nav', Nav)
app.use(router).mount('#app')

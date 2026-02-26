import { createApp } from 'vue'
import '@/app/styles/global.scss'
import { router } from '@/app/providers/router'
import App from './App.vue'

createApp(App).use(router).mount('#app')

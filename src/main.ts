import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import { ElButton, ElInput } from 'element-plus'
import 'element-plus/theme-chalk/index.css'
const store = createPinia()
const app = createApp(App)
app.use(ElButton).use(ElInput).use(router).use(store).mount('#app')

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import './themes.css'
import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/themeStore'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
useThemeStore(pinia).hydrate()
app.mount('#app')
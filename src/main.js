import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router' // Tambahkan ini

const app = createApp(App)
app.use(router) // Tambahkan ini
app.mount('#app')

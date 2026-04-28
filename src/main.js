import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'

// --- OH-VUE-ICONS SETUP ---
import { OhVueIcon, addIcons } from 'oh-vue-icons'
// Pilih Ikon yang kita gunakan (dari FontAwesome pack: Fa...)
import { FaChartPie, FaStar, FaCogs, FaDatabase, FaBars, FaTimes } from 'oh-vue-icons/icons/fa'

// Tambahkan ikon ke pustaka
addIcons(FaChartPie, FaStar, FaCogs, FaDatabase, FaBars, FaTimes)

const app = createApp(App)
app.component('v-icon', OhVueIcon) // Daftarkan komponen v-icon secara global
app.use(router)
app.mount('#app')
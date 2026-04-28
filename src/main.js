import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'

// --- OH-VUE-ICONS SETUP ---
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { 
  FaChartPie, FaStar, FaCogs, FaDatabase, FaBars, FaTimes, FaSearch,
  FaSort, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight 
} from 'oh-vue-icons/icons/fa'

addIcons(
  FaChartPie, FaStar, FaCogs, FaDatabase, FaBars, FaTimes, FaSearch,
  FaSort, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight
)

const app = createApp(App)
app.component('v-icon', OhVueIcon)
app.use(router)
app.mount('#app')
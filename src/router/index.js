import { createRouter, createWebHistory } from 'vue-router'
import Overview from '../views/Overview.vue'
import Ratings from '../views/Ratings.vue'
import Technical from '../views/Technical.vue' // Tambahkan ini
import Database from '../views/Database.vue' // Import view baru

const routes = [
  { path: '/', component: Overview },
  { path: '/ratings', component: Ratings },       // Sambungkan ke Ratings
  { path: '/technical', component: Technical },    // Sambungkan ke Technical
  { path: '/database', component: Database } // Daftarkan rute
]

export const router = createRouter({
  // Tambahkan BASE_URL di dalam kurung createWebHistory
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

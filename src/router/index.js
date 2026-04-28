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
  history: createWebHistory(),
  routes,
})

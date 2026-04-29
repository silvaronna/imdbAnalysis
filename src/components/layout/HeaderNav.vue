<template>
  <header class="sticky top-0 z-50 bg-slate-900/70 backdrop-blur-xl border-b border-slate-700/50 shadow-lg shadow-black/20">
    <div class="container mx-auto px-4 lg:px-8">
      <div class="flex items-center justify-between h-20">
        
        <div class="flex items-center gap-3">
          <img src="/IMDB_Logo_2016.svg" alt="Logo" class="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]">
          <h1 class="font-bold text-2xl text-white tracking-wide font-mono hidden sm:block">IMDB<span class="text-accent">PRO</span></h1>
        </div>

        <nav class="hidden md:flex items-center gap-1 bg-slate-800/40 p-1.5 rounded-2xl border border-slate-700/50">
          <router-link to="/" class="nav-item" active-class="nav-active"><v-icon name="fa-chart-pie" scale="1"/> Overview</router-link>
          <router-link to="/ratings" class="nav-item" active-class="nav-active"><v-icon name="fa-star" scale="1"/> Ratings</router-link>
          <router-link to="/technical" class="nav-item" active-class="nav-active"><v-icon name="fa-cogs" scale="1"/> Technical</router-link>
          <router-link to="/database" class="nav-item" active-class="nav-active"><v-icon name="fa-database" scale="1"/> Database</router-link>
        </nav>

        <div class="flex items-center gap-4">
          
          <TimeFrameFilter class="hidden lg:flex" />

          <div class="hidden lg:flex flex-col items-end">
            <span class="text-sm font-bold text-white">{{ currentRouteName }}</span>
            <span class="text-[10px] text-accent font-mono tracking-widest flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span> ONLINE
            </span>
          </div>

          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden p-2 rounded-xl bg-slate-800 text-accent border border-slate-700 hover:bg-slate-700">
            <v-icon :name="isMobileMenuOpen ? 'fa-times' : 'fa-bars'" scale="1.2"/>
          </button>
        </div>
      </div>
    </div>

    <transition name="slide-down">
      <nav v-if="isMobileMenuOpen" class="md:hidden border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-3xl absolute w-full shadow-2xl flex flex-col">
        <div class="p-4 flex flex-col gap-2">
          <router-link to="/" @click="isMobileMenuOpen = false" class="mobile-nav-item" active-class="mobile-nav-active"><v-icon name="fa-chart-pie"/> Overview</router-link>
          <router-link to="/ratings" @click="isMobileMenuOpen = false" class="mobile-nav-item" active-class="mobile-nav-active"><v-icon name="fa-star"/> Ratings</router-link>
          <router-link to="/technical" @click="isMobileMenuOpen = false" class="mobile-nav-item" active-class="mobile-nav-active"><v-icon name="fa-cogs"/> Technical</router-link>
          <router-link to="/database" @click="isMobileMenuOpen = false" class="mobile-nav-item" active-class="mobile-nav-active"><v-icon name="fa-database"/> Database</router-link>
        </div>
        
        <div class="p-4 border-t border-slate-700/50 bg-slate-800/30">
          <span class="text-xs text-slate-500 font-mono mb-2 block tracking-wider">TIME FRAME FILTER</span>
          <TimeFrameFilter class="justify-between" />
        </div>
      </nav>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import TimeFrameFilter from '../ui/TimeFrameFilter.vue' // Import komponen mungil kita!

const isMobileMenuOpen = ref(false)
const route = useRoute()

const currentRouteName = computed(() => {
  if (route.path === '/') return 'Overview'
  if (route.path === '/ratings') return 'Ratings'
  if (route.path === '/technical') return 'Technical'
  if (route.path === '/database') return 'Database'
  return 'Dashboard'
})
</script>

<style scoped>
/* Class CSS Navigasi tetap sama */
.nav-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1.25rem; border-radius: 0.75rem; font-size: 0.875rem; font-weight: 600; color: #94a3b8; transition: all 0.3s ease; }
.nav-item:hover { color: #ffffff; background-color: rgba(51, 65, 85, 0.5); }
.nav-active { background-color: rgba(14, 165, 233, 0.15); color: #00f0ff !important; box-shadow: inset 0 0 10px rgba(0, 240, 255, 0.15); }
.mobile-nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 0.75rem; font-size: 1rem; font-weight: 500; color: #94a3b8; transition: background-color 0.2s ease; }
.mobile-nav-item:hover { background-color: rgba(30, 41, 59, 1); }
.mobile-nav-active { background-color: rgba(14, 165, 233, 0.1); color: #00f0ff; border: 1px solid rgba(14, 165, 233, 0.2); }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s ease-in-out; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
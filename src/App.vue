<template>
  <div class="flex h-screen bg-darkbg text-slate-200 overflow-hidden relative">
    
    <transition name="fade">
      <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"></div>
    </transition>

    <Sidebar 
      class="fixed h-screen z-50 transition-all duration-300 ease-in-out"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'" 
      @closeSidebar="isSidebarOpen = false"
    />

    <main 
      class="flex-1 flex flex-col h-screen transition-all duration-300 w-full"
      :class="isSidebarOpen ? 'ml-0 lg:ml-64' : 'ml-0'"
    >
      
      <header class="flex justify-between items-center p-6 lg:p-8 border-b border-slate-700/50 bg-darkbg/80 backdrop-blur-md sticky top-0 z-30">
        <div class="flex items-center gap-4">
          <button 
            @click="isSidebarOpen = !isSidebarOpen" 
            class="p-2.5 rounded-xl bg-cardbg border border-slate-700 text-primary hover:text-white hover:bg-primary/20 hover:border-primary/50 transition-all cursor-pointer"
          >
            <v-icon name="fa-bars" scale="1.2"/>
          </button>
          
          <div>
            <h2 class="text-2xl font-bold text-white tracking-tight">{{ currentRouteName }}</h2>
            <p class="text-xs sm:text-sm text-slate-400 mt-1">Live Database Analytics</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 border-2 border-cardbg shadow-lg cursor-pointer hover:scale-105 transition-transform"></div>
        </div>
      </header>

      <div class="p-6 lg:p-8 overflow-y-auto flex-1 relative z-10">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import { OhVueIcon as VIcon } from 'oh-vue-icons'

// Sidebar default terbuka di desktop
const isSidebarOpen = ref(window.innerWidth >= 1024)

const route = useRoute()
const currentRouteName = computed(() => {
  if (route.path === '/') return 'Dashboard Overview'
  if (route.path === '/ratings') return 'Ratings Analysis'
  if (route.path === '/technical') return 'Technical Specifications'
  if (route.path === '/database') return 'Movie Database'
  return 'Dashboard'
})
</script>

<style>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; transform: translateY(10px); }
</style>
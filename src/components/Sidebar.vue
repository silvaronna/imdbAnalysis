<template>
  <aside class="w-64 bg-cardbg backdrop-blur-xl border-r border-slate-700/50 h-screen fixed left-0 top-0 p-6 flex flex-col shadow-2xl">
    
    <div class="flex justify-between items-center mb-10">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-xl shadow-lg shadow-primary/30">🎬</div>
        <h1 class="font-bold text-xl text-white tracking-wide">IMDB Pro</h1>
      </div>
      <button @click="$emit('closeSidebar')" class="lg:hidden text-slate-400 hover:text-white">
        <v-icon name="fa-times" scale="1.2"/>
      </button>
    </div>
    
    <nav class="space-y-2.5 flex-1">
      <router-link to="/" @click="$emit('closeSidebar')" class="flex items-center gap-4 px-4 py-3 text-slate-400 rounded-xl transition-all hover:bg-slate-800 hover:text-white" active-class="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10 hover:text-primary">
        <v-icon name="fa-chart-pie" scale="1.1"/>
        <span>Overview</span>
      </router-link>
      
      <router-link to="/ratings" @click="$emit('closeSidebar')" class="flex items-center gap-4 px-4 py-3 text-slate-400 rounded-xl transition-all hover:bg-slate-800 hover:text-white" active-class="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10 hover:text-primary">
        <v-icon name="fa-star" scale="1.1"/>
        <span>Ratings</span>
      </router-link>
      
      <router-link to="/technical" @click="$emit('closeSidebar')" class="flex items-center gap-4 px-4 py-3 text-slate-400 rounded-xl transition-all hover:bg-slate-800 hover:text-white" active-class="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10 hover:text-primary">
        <v-icon name="fa-cogs" scale="1.1"/>
        <span>Technical</span>
      </router-link>

      <router-link to="/database" @click="$emit('closeSidebar')" class="flex items-center gap-4 px-4 py-3 text-slate-400 rounded-xl transition-all hover:bg-slate-800 hover:text-white" active-class="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10 hover:text-primary">
        <v-icon name="fa-database" scale="1.1"/>
        <span>Database</span>
      </router-link>
    </nav>
    
    <div class="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 mt-auto text-xs text-slate-400">
      <p class="font-medium text-slate-300">Engine</p>
      <p class="font-semibold text-white mt-0.5">Vue 3 + Tailwind v4 Serverless</p>
    </div>
  </aside>
</template>

<script setup>
import { OhVueIcon as VIcon } from 'oh-vue-icons'
// Mendaftarkan event emit agar App.vue tahu kapan menutup sidebar
defineEmits(['closeSidebar'])
</script>
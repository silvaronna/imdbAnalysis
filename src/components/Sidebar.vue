<template>
  <aside class="w-64 bg-cardbg border-r border-slate-700 h-screen fixed left-0 top-0 p-6 flex flex-col shadow-2xl">
    
    <div class="flex justify-between items-center mb-10">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-xl shadow-lg shadow-primary/30">🎬</div>
        <h1 class="font-bold text-xl text-white tracking-wide">IMDB Pro</h1>
      </div>
      <button @click="$emit('closeSidebar')" class="lg:hidden text-slate-400 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
    
    <nav class="space-y-2 flex-1">
      <router-link to="/" @click="$emit('closeSidebar')" class="flex items-center gap-3 px-4 py-3 text-slate-400 rounded-xl transition-all hover:bg-slate-800 hover:text-white" active-class="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10 hover:text-primary">
        <span>📊</span> Overview
      </router-link>
      
      <router-link to="/ratings" @click="$emit('closeSidebar')" class="flex items-center gap-3 px-4 py-3 text-slate-400 rounded-xl transition-all hover:bg-slate-800 hover:text-white" active-class="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10 hover:text-primary">
        <span>⭐</span> Ratings
      </router-link>
      
      <router-link to="/technical" @click="$emit('closeSidebar')" class="flex items-center gap-3 px-4 py-3 text-slate-400 rounded-xl transition-all hover:bg-slate-800 hover:text-white" active-class="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10 hover:text-primary">
        <span>⚙️</span> Technical
      </router-link>

      <router-link to="/database" @click="$emit('closeSidebar')" class="flex items-center gap-3 px-4 py-3 text-slate-400 rounded-xl transition-all hover:bg-slate-800 hover:text-white" active-class="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10 hover:text-primary">
        <span>🗄️</span> Database
      </router-link>
    </nav>
    
    <div class="p-4 bg-slate-800/50 rounded-xl border border-slate-700 mt-auto">
      <p class="text-xs text-slate-400 font-medium mb-1">Engine</p>
      <p class="text-sm text-white font-semibold">Vue 3 + Tailwind v4</p>
    </div>
  </aside>
</template>

<script setup>
// Mendefinisikan event emit agar App.vue tahu kapan harus menutup sidebar
defineEmits(['closeSidebar'])
</script>

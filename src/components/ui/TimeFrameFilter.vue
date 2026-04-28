<template>
  <div class="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-inner transition-all duration-300 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent group">
    
    <span class="text-primary text-sm group-focus-within:text-accent transition-colors pl-3">📅</span>
    
    <select v-model="yearFrom" class="bg-transparent text-slate-200 text-xs sm:text-sm font-bold focus:outline-none w-full cursor-pointer py-2">
      <option value="All" class="bg-slate-800 text-white font-medium">Start: All</option>
      <option v-for="y in availableYears" :key="'from'+y" :value="y" class="bg-slate-800 text-white font-medium">{{ y }}</option>
    </select>
    
    <span class="text-slate-500 font-bold">-</span>
    
    <select v-model="yearTo" class="bg-transparent text-slate-200 text-xs sm:text-sm font-bold focus:outline-none w-full cursor-pointer py-2 pr-3">
      <option value="All" class="bg-slate-800 text-white font-medium">2023</option>
      <option v-for="y in availableYears" :key="'to'+y" :value="y" class="bg-slate-800 text-white font-medium">{{ y }}</option>
    </select>
    
  </div>
</template>

<script setup>
import { useMovies } from '../../composables/useMovies'
// Komponen ini mandiri, dia mengambil data sendiri langsung dari "otak" useMovies
const { yearFrom, yearTo, availableYears } = useMovies()
</script>
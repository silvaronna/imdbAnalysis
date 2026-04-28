<template>
  <div class="animate-fade-in relative z-10">
    <div class="flex flex-col lg:flex-row justify-between lg:items-end mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-white tracking-tight">🗄️ Tech Database</h2>
        <p class="text-primary text-sm mt-1 font-mono tracking-wide">QUERYING {{ movies.length.toLocaleString() }} RECORDS</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
        <div class="relative w-full sm:w-auto group">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-primary group-focus-within:text-accent transition-colors">🔍</span>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search payload..." 
            class="bg-slate-900/50 backdrop-blur-md border border-slate-700/80 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent w-full sm:w-64 text-white transition-all shadow-inner"
          >
        </div>

        <div class="flex items-center justify-between sm:justify-start gap-3 bg-slate-900/50 backdrop-blur-md border border-slate-700/80 px-4 py-2 rounded-xl focus-within:border-primary transition-colors">
          <span class="text-sm text-slate-400 font-mono">LIMIT:</span>
          <select v-model="entriesLimit" class="bg-transparent text-accent text-sm font-bold focus:outline-none cursor-pointer">
            <option :value="20">20</option>
            <option :value="30">30</option>
            <option :value="40">40</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>
    </div>

    <div class="bg-cardbg backdrop-blur-xl rounded-2xl border border-slate-700/50 tech-card overflow-hidden">
      <div v-if="isLoading" class="p-16 flex flex-col items-center justify-center text-accent">
        <div class="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="font-mono tracking-widest text-sm animate-pulse">FETCHING DATA...</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-300 whitespace-nowrap">
          <thead class="bg-slate-900/60 text-slate-400 border-b border-slate-700/80 uppercase text-xs tracking-wider font-mono">
            <tr>
              <th class="px-6 py-4 font-semibold w-1/3">Title</th>
              <th class="px-6 py-4 font-semibold">Year</th>
              <th class="px-6 py-4 font-semibold">Genre</th>
              <th class="px-6 py-4 font-semibold">Rating</th>
              <th class="px-6 py-4 font-semibold text-right">Votes</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/30">
            <tr v-for="movie in paginatedMovies" :key="movie.title + movie.releaseyear" 
                class="hover:bg-primary/10 hover:shadow-[inset_0_0_15px_rgba(0,240,255,0.15)] transition-all duration-300 group">
              <td class="px-6 py-4 font-bold text-white group-hover:text-accent transition-colors">{{ movie.title }}</td>
              <td class="px-6 py-4 text-slate-400">{{ movie.releaseyear }}</td>
              <td class="px-6 py-4 text-xs text-slate-500">{{ movie.genres || '-' }}</td>
              <td class="px-6 py-4">
                <span class="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2.5 py-1 rounded-md font-bold text-xs shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  ⭐ {{ movie.imdbrating || 'N/A' }}
                </span>
              </td>
              <td class="px-6 py-4 font-mono text-right text-slate-400 group-hover:text-white transition-colors">
                {{ movie.numvotes ? parseInt(movie.numvotes).toLocaleString() : '0' }}
              </td>
            </tr>
            <tr v-if="paginatedMovies.length === 0">
              <td colspan="5" class="px-6 py-16 text-center text-slate-500">
                <div class="text-4xl mb-3 opacity-50">🤖</div>
                <p class="font-mono text-accent">404: RECORD NOT FOUND</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="p-4 border-t border-slate-700/50 bg-slate-900/40 text-xs sm:text-sm text-slate-400 flex justify-between items-center font-mono">
        <p>DISPLAYING <span class="text-accent">{{ paginatedMovies.length }}</span> OF <span class="text-white">{{ filteredMovies.length.toLocaleString() }}</span> RECORDS</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMovies } from '../composables/useMovies'
import { OhVueIcon as VIcon } from 'oh-vue-icons' // Ensure OhVueIcon is imported

const { movies, isLoading, fetchMovies } = useMovies()

const searchQuery = ref('')
const entriesLimit = ref(20)

onMounted(() => fetchMovies())

const filteredMovies = computed(() => {
  if (!movies.value || movies.value.length === 0) return []
  if (!searchQuery.value.trim()) return movies.value
  const query = searchQuery.value.toLowerCase().trim()
  return movies.value.filter(movie => movie.title && String(movie.title).toLowerCase().includes(query))
})

const paginatedMovies = computed(() => filteredMovies.value.slice(0, entriesLimit.value))
</script>
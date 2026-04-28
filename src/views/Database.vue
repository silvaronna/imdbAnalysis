<template>
  <div class="animate-fade-in relative z-10 flex flex-col h-full">
    <div class="mb-6 space-y-4">
      <div>
        <h2 class="text-2xl font-bold text-white">🗄️ Tech Database</h2>
        <p class="text-primary text-sm font-mono">EXPLORING {{ movies.length.toLocaleString() }} RECORDS</p>
      </div>

      <div class="bg-cardbg backdrop-blur-xl border border-slate-700/50 p-4 rounded-2xl flex flex-wrap gap-4">
        <div class="relative flex-1 min-w-[200px]">
          <v-icon name="fa-search" class="absolute left-3 top-3 text-primary" scale="0.9" />
          <input v-model="filters.title" placeholder="Search title..." class="bg-slate-900/50 border border-slate-700/80 pl-10 pr-4 py-2 rounded-xl text-sm w-full text-white focus:border-accent outline-none">
        </div>
        <input v-model="filters.cast" placeholder="Filter by Actor..." class="bg-slate-900/50 border border-slate-700/80 px-4 py-2 rounded-xl text-sm flex-1 min-w-[150px] text-white focus:border-accent outline-none">
        <select v-model="filters.type" class="bg-slate-900/50 border border-slate-700/80 px-4 py-2 rounded-xl text-sm text-slate-300 min-w-[120px] outline-none">
          <option value="">All Types</option><option value="Movie">Movie</option><option value="TV Show">TV Show</option>
        </select>
        <select v-model="filters.minRating" class="bg-slate-900/50 border border-slate-700/80 px-4 py-2 rounded-xl text-sm text-slate-300 min-w-[140px] outline-none">
          <option value="0">All Ratings</option><option value="9">⭐ 9.0+</option><option value="8">⭐ 8.0+</option><option value="7">⭐ 7.0+</option>
        </select>
        <button @click="resetFilters" class="px-4 py-2 bg-slate-800 text-slate-300 border border-slate-600 rounded-xl text-sm">Reset</button>
      </div>
    </div>

    <div class="bg-cardbg backdrop-blur-xl rounded-2xl border border-slate-700/50 flex flex-col flex-1 overflow-hidden">
      <div v-if="isLoading" class="p-16 text-center text-accent animate-pulse font-mono">FETCHING DATA...</div>
      
      <div v-else class="overflow-x-auto flex-1">
        <table class="w-full text-left text-sm text-slate-300 whitespace-nowrap">
          <thead class="bg-slate-900/80 text-slate-400 border-b border-slate-700/80 uppercase text-xs tracking-wider font-mono select-none">
            <tr>
              <th @click="sortBy('title')" class="px-6 py-4 cursor-pointer hover:text-white">Title <v-icon :name="getSortIcon('title')" scale="0.8"/></th>
              <th @click="sortBy('type')" class="px-6 py-4 cursor-pointer hover:text-white">Type <v-icon :name="getSortIcon('type')" scale="0.8"/></th>
              <th @click="sortBy('releaseyear')" class="px-6 py-4 cursor-pointer hover:text-white">Year <v-icon :name="getSortIcon('releaseyear')" scale="0.8"/></th>
              <th class="px-6 py-4">Duration</th>
              <th class="px-6 py-4">Genre</th>
              <th class="px-6 py-4">Cast</th>
              <th @click="sortBy('imdbrating')" class="px-6 py-4 cursor-pointer hover:text-white">Rating <v-icon :name="getSortIcon('imdbrating')" scale="0.8"/></th>
              <th @click="sortBy('numvotes')" class="px-6 py-4 cursor-pointer hover:text-white text-right">Votes <v-icon :name="getSortIcon('numvotes')" scale="0.8"/></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/30">
            <tr v-for="m in paginatedData" :key="m.showid" class="hover:bg-primary/10 transition-colors">
              <td class="px-6 py-4 font-bold text-white max-w-[250px] truncate">{{ m.title }}</td>
              <td class="px-6 py-4 text-xs font-mono" :class="m.type === 'Movie' ? 'text-blue-400' : 'text-purple-400'">{{ m.type }}</td>
              <td class="px-6 py-4">{{ m.releaseyear }}</td>
              <td class="px-6 py-4 text-xs">{{ m.duration || '-' }}</td>
              <td class="px-6 py-4 text-xs max-w-[150px] truncate" :title="m.genres">{{ m.genres || '-' }}</td>
              <td class="px-6 py-4 text-xs max-w-[200px] truncate" :title="m.cast">{{ m.cast || '-' }}</td>
              <td class="px-6 py-4"><span class="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-1 rounded-md font-bold text-xs">⭐ {{ m.imdbrating || 'N/A' }}</span></td>
              <td class="px-6 py-4 font-mono text-right">{{ m.numvotes ? parseInt(m.numvotes).toLocaleString() : '0' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <TablePagination 
        v-model="itemsPerPage" 
        :current-page="currentPage" :total-pages="totalPages" 
        :start-index="startIndex" :end-index="endIndex" :total-items="processedData.length"
        @prev="currentPage--" @next="currentPage++" 
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMovies } from '../composables/useMovies'
import { useDataTable } from '../composables/useDataTable'
import TablePagination from '../components/ui/TablePagination.vue'

const { movies, isLoading, fetchMovies } = useMovies()
onMounted(() => fetchMovies())

// Panggil "mesin" tabel dari composable
const { 
  filters, currentPage, itemsPerPage, resetFilters, 
  processedData, totalPages, startIndex, endIndex, paginatedData, sortBy, getSortIcon 
} = useDataTable(movies)
</script>

<style scoped> .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } </style>
<template>
  <div class="animate-fade-in">
    <div class="flex justify-between items-end mb-6">
      <div>
        <h2 class="text-2xl font-bold text-white">🎬 Movie Database</h2>
        <p class="text-slate-400 text-sm mt-1">Cari dan jelajahi {{ movies.length.toLocaleString() }} data film</p>
      </div>

      <div class="flex gap-4">
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari judul film..." 
            class="bg-cardbg border border-slate-700 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-primary w-64 text-white transition-all"
          >
        </div>

        <div class="flex items-center gap-2 text-sm text-slate-400">
          <span>Show:</span>
          <select 
            v-model="entriesLimit" 
            class="bg-cardbg border border-slate-700 py-2 px-3 rounded-xl text-white focus:outline-none focus:border-primary cursor-pointer"
          >
            <option :value="20">20</option>
            <option :value="30">30</option>
            <option :value="40">40</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>
    </div>

    <div class="bg-cardbg rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
      <div v-if="isLoading" class="p-10 text-center text-primary animate-pulse">
        Memuat Database...
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-300">
          <thead class="bg-slate-800/50 text-slate-400 border-b border-slate-700 uppercase text-xs">
            <tr>
              <th class="px-6 py-4 font-semibold">Title</th>
              <th class="px-6 py-4 font-semibold">Year</th>
              <th class="px-6 py-4 font-semibold">Genre</th>
              <th class="px-6 py-4 font-semibold">IMDB Rating</th>
              <th class="px-6 py-4 font-semibold">Votes</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/50">
            <tr v-for="movie in paginatedMovies" :key="movie.showid" class="hover:bg-slate-800/30 transition-colors">
              <td class="px-6 py-4 font-medium text-white">{{ movie.title }}</td>
              <td class="px-6 py-4">{{ movie.releaseyear }}</td>
              <td class="px-6 py-4 text-xs text-slate-400">{{ movie.genres }}</td>
              <td class="px-6 py-4">
                <span class="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-1 rounded-md font-bold">
                  ⭐ {{ movie.imdbrating }}
                </span>
              </td>
              <td class="px-6 py-4">{{ movie.numvotes ? movie.numvotes.toLocaleString() : '0' }}</td>
            </tr>
            <tr v-if="paginatedMovies.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-slate-500">
                Data tidak ditemukan untuk pencarian "{{ searchQuery }}"
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="p-4 border-t border-slate-700 bg-slate-800/20 text-sm text-slate-400 flex justify-between">
        <p>Menampilkan {{ paginatedMovies.length }} dari {{ filteredMovies.length }} data (Pencarian)</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMovies } from '../composables/useMovies'

const { movies, isLoading, fetchMovies } = useMovies()

// State untuk Search dan Limit
const searchQuery = ref('')
const entriesLimit = ref(20)

onMounted(() => fetchMovies())

// 1. Logic Pencarian (SUPER AMAN)
const filteredMovies = computed(() => {
  // Cegah error jika movies belum di-load
  if (!movies.value || movies.value.length === 0) return []
  
  // Jika kotak pencarian kosong (sudah di-trim dari spasi), tampilkan semua
  if (!searchQuery.value.trim()) return movies.value
  
  const query = searchQuery.value.toLowerCase().trim()
  
  return movies.value.filter(movie => {
    // Pastikan title tidak null/undefined sebelum di-cek
    if (!movie.title) return false
    
    // Ubah paksa ke String agar aman dari error tipe data CSV, lalu cek
    return String(movie.title).toLowerCase().includes(query)
  })
})

// 2. Logic Pembatasan Jumlah Entri
const paginatedMovies = computed(() => {
  return filteredMovies.value.slice(0, entriesLimit.value)
})
</script>

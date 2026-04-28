<template>
  <div class="animate-fade-in">
    <div v-if="isLoading" class="flex items-center justify-center h-64 text-primary animate-pulse text-xl font-semibold">
      Menyinkronkan Data dari Server...
    </div>
    
    <div v-else-if="error" class="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-xl">
      {{ error }}
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-cardbg p-6 rounded-2xl border border-slate-700 shadow-lg">
          <p class="text-sm text-slate-400">Total Database</p>
          <h3 class="text-3xl font-bold text-white mt-2">{{ totalMovies.toLocaleString() }}</h3>
        </div>
        <div class="bg-cardbg p-6 rounded-2xl border border-slate-700 shadow-lg">
          <p class="text-sm text-slate-400">Avg IMDB Rating</p>
          <h3 class="text-3xl font-bold text-green-400 mt-2">{{ avgRating }}</h3>
        </div>
        <div class="bg-gradient-to-br from-primary to-blue-700 p-6 rounded-2xl shadow-lg shadow-primary/20">
          <p class="text-sm text-blue-200">Top Genre</p>
          <h3 class="text-3xl font-bold text-white mt-2">{{ topGenre }}</h3>
        </div>
        <div class="bg-cardbg p-6 rounded-2xl border border-slate-700 shadow-lg">
          <p class="text-sm text-slate-400">Total Votes Analisa</p>
          <h3 class="text-3xl font-bold text-purple-400 mt-2">{{ totalVotes }}M+</h3>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-cardbg p-6 rounded-2xl border border-slate-700 shadow-xl col-span-1">
          <h4 class="text-lg font-semibold text-white mb-4">1. Distribusi Tipe Konten</h4>
          <div class="h-64">
            <Doughnut :data="typeChartData" :options="chartOptions" />
          </div>
        </div>

        <div class="bg-cardbg p-6 rounded-2xl border border-slate-700 shadow-xl col-span-2">
          <h4 class="text-lg font-semibold text-white mb-4">3. Tren Rilis Konten</h4>
          <div class="h-64">
            <Line :data="trendChartData" :options="chartOptions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useMovies } from '../composables/useMovies'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
import { Doughnut, Line } from 'vue-chartjs'

// Register elemen Chart.js yang akan digunakan
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement)

// Panggil state global
const { movies, isLoading, error, fetchMovies } = useMovies()

// Jalankan fetch saat halaman dibuka
onMounted(() => {
  fetchMovies()
})

// ==========================================
// LOGIKA AGREGASI DATA (COMPUTED PROPERTIES)
// ==========================================

// 1. Hitung Nilai Kartu (KPIs)
const totalMovies = computed(() => movies.value.length)

const avgRating = computed(() => {
  if (movies.value.length === 0) return 0
  const sum = movies.value.reduce((acc, curr) => acc + (parseFloat(curr.imdbrating) || 0), 0)
  return (sum / movies.value.length).toFixed(1)
})

const totalVotes = computed(() => {
  const sum = movies.value.reduce((acc, curr) => acc + (parseInt(curr.numvotes) || 0), 0)
  return (sum / 1000000).toFixed(1) // Konversi ke Juta (Million)
})

const topGenre = computed(() => {
  // Logic simpel mencari genre terbanyak
  const counts = {}
  movies.value.forEach(m => {
    if(m.genres) {
      m.genres.split(',').forEach(g => {
        const clean = g.trim()
        counts[clean] = (counts[clean] || 0) + 1
      })
    }
  })
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, '')
})

// 2. Data untuk Doughnut Chart
const typeChartData = computed(() => {
  let movieCount = 0, tvCount = 0
  movies.value.forEach(m => {
    if (m.type === 'Movie') movieCount++
    else if (m.type === 'TV Show') tvCount++
  })
  return {
    labels: ['Movie', 'TV Show'],
    datasets: [{
      data: [movieCount, tvCount],
      backgroundColor: ['#3b82f6', '#ef4444'],
      borderWidth: 0,
      hoverOffset: 10
    }]
  }
})

// 3. Data untuk Line Chart (Tren)
const trendChartData = computed(() => {
  let yearCounts = {}
  movies.value.forEach(d => {
    let yr = d.releaseyear
    if (yr >= 1980 && yr <= 2023) {
      yearCounts[yr] = (yearCounts[yr] || 0) + 1
    }
  })
  const sortedYears = Object.keys(yearCounts).sort((a,b) => a - b)
  return {
    labels: sortedYears,
    datasets: [{
      label: 'Total Rilis',
      data: sortedYears.map(y => yearCounts[y]),
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      fill: true,
      tension: 0.4
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#cbd5e1' } } },
  scales: {
    x: { ticks: { color: '#64748b' }, grid: { display: false } },
    y: { ticks: { color: '#64748b' }, grid: { color: '#334155', borderDash: [5, 5] } }
  }
}
</script>

<style>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

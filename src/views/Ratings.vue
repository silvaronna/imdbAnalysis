<template>
  <div class="animate-fade-in">
    <div v-if="isLoading" class="flex items-center justify-center h-64 text-primary animate-pulse text-xl">
      Memproses Data Rating...
    </div>
    
    <div v-else>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-cardbg p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h4 class="text-lg font-semibold text-white mb-4">⭐ Top 10 Title Berdasarkan Votes</h4>
          <div class="h-80">
            <Bar :data="topVotesData" :options="horizontalBarOptions" />
          </div>
        </div>

        <div class="bg-cardbg p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h4 class="text-lg font-semibold text-white mb-4">🏆 Highest Rated (Min. 500k Votes)</h4>
          <div class="h-80">
            <Bar :data="highestRatedData" :options="horizontalBarOptions" />
          </div>
        </div>
      </div>

      <div class="bg-cardbg p-6 rounded-2xl border border-slate-700 shadow-xl">
        <h4 class="text-lg font-semibold text-white mb-4">📊 Distribusi Skor IMDB</h4>
        <div class="h-64">
          <Bar :data="scoreDistributionData" :options="verticalBarOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useMovies } from '../composables/useMovies'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const { movies, isLoading, fetchMovies } = useMovies()

onMounted(() => fetchMovies())

// 1. Data Top 10 by Votes
const topVotesData = computed(() => {
  const sorted = [...movies.value].sort((a, b) => b.numvotes - a.numvotes).slice(0, 10)
  return {
    labels: sorted.map(m => m.title),
    datasets: [{
      label: 'Total Votes',
      data: sorted.map(m => m.numvotes),
      backgroundColor: '#8b5cf6', // Warna Ungu
      borderRadius: 4
    }]
  }
})

// 2. Data Highest Rated
const highestRatedData = computed(() => {
  const filtered = movies.value.filter(m => m.numvotes > 500000)
  const sorted = filtered.sort((a, b) => b.imdbrating - a.imdbrating).slice(0, 10)
  return {
    labels: sorted.map(m => m.title),
    datasets: [{
      label: 'IMDB Rating',
      data: sorted.map(m => m.imdbrating),
      backgroundColor: '#f59e0b', // Warna Kuning/Emas
      borderRadius: 4
    }]
  }
})

// 3. Data Distribusi Skor (Histogram Simulator)
const scoreDistributionData = computed(() => {
  const bins = { '< 5.0': 0, '5.0 - 5.9': 0, '6.0 - 6.9': 0, '7.0 - 7.9': 0, '8.0 - 8.9': 0, '9.0+': 0 }
  
  movies.value.forEach(m => {
    const score = parseFloat(m.imdbrating)
    if (score < 5.0) bins['< 5.0']++
    else if (score < 6.0) bins['5.0 - 5.9']++
    else if (score < 7.0) bins['6.0 - 6.9']++
    else if (score < 8.0) bins['7.0 - 7.9']++
    else if (score < 9.0) bins['8.0 - 8.9']++
    else bins['9.0+']++
  })

  return {
    labels: Object.keys(bins),
    datasets: [{
      label: 'Jumlah Film',
      data: Object.values(bins),
      backgroundColor: '#10b981', // Warna Hijau
      borderRadius: 6
    }]
  }
})

// Options untuk Chart Horizontal
const horizontalBarOptions = {
  responsive: true, maintainAspectRatio: false, indexAxis: 'y',
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: '#334155', borderDash: [5,5] }, ticks: { color: '#94a3b8' } },
    y: { grid: { display: false }, ticks: { color: '#e2e8f0' } }
  }
}

// Options untuk Chart Vertikal
const verticalBarOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#e2e8f0' } },
    y: { grid: { color: '#334155', borderDash: [5,5] }, ticks: { color: '#94a3b8' } }
  }
}
</script>

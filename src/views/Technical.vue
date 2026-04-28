<template>
  <div class="animate-fade-in">
    <div v-if="isLoading" class="flex items-center justify-center h-64 text-primary animate-pulse text-xl">
      Memproses Spesifikasi Teknis...
    </div>
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <div class="bg-cardbg p-6 rounded-2xl border border-slate-700 shadow-xl">
        <h4 class="text-lg font-semibold text-white mb-4">⏱️ Tren Durasi Rata-rata Film (Menit)</h4>
        <div class="h-80">
          <Line :data="durationData" :options="lineOptions" />
        </div>
      </div>

      <div class="bg-cardbg p-6 rounded-2xl border border-slate-700 shadow-xl">
        <h4 class="text-lg font-semibold text-white mb-4">🎭 Top 10 Aktor Paling Produktif</h4>
        <div class="h-80">
          <Bar :data="actorsData" :options="horizontalBarOptions" />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useMovies } from '../composables/useMovies'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
import { Bar, Line } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend)

const { movies, isLoading, fetchMovies } = useMovies()
onMounted(() => fetchMovies())

// 1. Data Tren Durasi
const durationData = computed(() => {
  const yearDurations = {}
  
  movies.value.forEach(m => {
    if (m.type === 'Movie' && m.releaseyear >= 1980 && m.releaseyear <= 2023) {
      const durMatch = String(m.duration).match(/(\d+)/)
      if (durMatch) {
        const dur = parseInt(durMatch[0])
        const yr = m.releaseyear
        if (!yearDurations[yr]) yearDurations[yr] = { sum: 0, count: 0 }
        yearDurations[yr].sum += dur
        yearDurations[yr].count++
      }
    }
  })

  const sortedYears = Object.keys(yearDurations).sort((a,b) => a - b)
  const avgDurations = sortedYears.map(y => (yearDurations[y].sum / yearDurations[y].count).toFixed(1))

  return {
    labels: sortedYears,
    datasets: [{
      label: 'Rata-rata Durasi (Menit)',
      data: avgDurations,
      borderColor: '#ec4899', // Warna Pink
      backgroundColor: 'rgba(236, 72, 153, 0.2)',
      tension: 0.3,
      fill: true
    }]
  }
})

// 2. Data Top Actors
const actorsData = computed(() => {
  const actorCounts = {}
  movies.value.forEach(m => {
    if (m.cast) {
      m.cast.split(',').forEach(actor => {
        const cleanName = actor.trim()
        actorCounts[cleanName] = (actorCounts[cleanName] || 0) + 1
      })
    }
  })

  // Convert & Sort
  const sortedActors = Object.keys(actorCounts)
    .map(name => ({ name, count: actorCounts[name] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return {
    labels: sortedActors.map(a => a.name),
    datasets: [{
      label: 'Jumlah Film',
      data: sortedActors.map(a => a.count),
      backgroundColor: '#3b82f6',
      borderRadius: 4
    }]
  }
})

// Konfigurasi Options
const horizontalBarOptions = {
  responsive: true, maintainAspectRatio: false, indexAxis: 'y',
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
    y: { grid: { display: false }, ticks: { color: '#e2e8f0' } }
  }
}

const lineOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
    y: { grid: { color: '#334155', borderDash: [5,5] }, ticks: { color: '#94a3b8' } }
  }
}
</script>

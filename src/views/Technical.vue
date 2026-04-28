<template>
  <div class="animate-fade-in relative z-10">
    <div v-if="isLoading" class="flex flex-col items-center justify-center h-64 text-accent">
      <div class="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="font-semibold tracking-widest uppercase text-sm animate-pulse">Initializing Specs...</p>
    </div>
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-cardbg backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 tech-card col-span-1 lg:col-span-2 group">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">⏱️</div>
          <h4 class="text-lg font-bold text-white tracking-wide">Movie Duration Trend (Average Minutes)</h4>
        </div>
        <div class="h-80"><Line :data="durationData" :options="lineOptions" /></div>
      </div>

      <div class="bg-cardbg backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 tech-card group">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">⏳</div>
          <h4 class="text-lg font-bold text-white tracking-wide">Movie Duration Distribution (Minutes)</h4>
        </div>
        <div class="h-80"><Bar :data="durationDistData" :options="verticalBarOptions" /></div>
      </div>

      <div class="bg-cardbg backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 tech-card group">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">🎭</div>
          <h4 class="text-lg font-bold text-white tracking-wide">Top 10 Most Prolific Actors</h4>
        </div>
        <div class="h-80"><Bar :data="actorsData" :options="horizontalBarOptions" /></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useMovies } from '../composables/useMovies'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js'
import { Bar, Line } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler)

const { movies, isLoading, fetchMovies } = useMovies()
onMounted(() => fetchMovies())

const colorBlue = 'rgba(59, 130, 246, 0.8)'
const colorCyan = 'rgba(6, 182, 212, 0.8)'
const colorIndigo = 'rgba(99, 102, 241, 0.8)'
const colorHover = 'rgba(0, 240, 255, 1)'

const durationData = computed(() => {
  const yearDurations = {}
  movies.value.forEach(m => {
    if (m.type === 'Movie' && m.releaseyear >= 1980 && m.releaseyear <= 2023) {
      const durMatch = String(m.duration).match(/(\d+)/)
      if (durMatch) {
        const dur = parseInt(durMatch[0]); const yr = m.releaseyear
        if (!yearDurations[yr]) yearDurations[yr] = { sum: 0, count: 0 }
        yearDurations[yr].sum += dur; yearDurations[yr].count++
      }
    }
  })
  const sortedYears = Object.keys(yearDurations).sort((a,b) => a - b)
  const avgDurations = sortedYears.map(y => (yearDurations[y].sum / yearDurations[y].count).toFixed(1))
  return { labels: sortedYears, datasets: [{ label: 'Average Minutes', data: avgDurations, borderColor: colorBlue, backgroundColor: 'rgba(59, 130, 246, 0.15)', tension: 0.4, fill: true, pointBackgroundColor: colorBlue, pointHoverBackgroundColor: colorHover, pointHoverRadius: 6 }] }
})

const durationDistData = computed(() => {
  const bins = { 'Short (< 60m)': 0, 'Standard (60-120m)': 0, 'Long (120-180m)': 0, 'Epic (> 180m)': 0 }
  movies.value.forEach(m => {
    if (m.type === 'Movie') {
      const durMatch = String(m.duration).match(/(\d+)/)
      if (durMatch) {
        const dur = parseInt(durMatch[0])
        if (dur < 60) bins['Short (< 60m)']++
        else if (dur <= 120) bins['Standard (60-120m)']++
        else if (dur <= 180) bins['Long (120-180m)']++
        else bins['Epic (> 180m)']++
      }
    }
  })
  return { labels: Object.keys(bins), datasets: [{ label: 'Number of Movies', data: Object.values(bins), backgroundColor: colorIndigo, hoverBackgroundColor: colorHover, borderRadius: 6 }] }
})

const actorsData = computed(() => {
  const actorCounts = {}
  movies.value.forEach(m => { if (m.cast) m.cast.split(',').forEach(actor => { actorCounts[actor.trim()] = (actorCounts[actor.trim()] || 0) + 1 }) })
  const sortedActors = Object.keys(actorCounts).map(name => ({ name, count: actorCounts[name] })).sort((a, b) => b.count - a.count).slice(0, 10)
  return { labels: sortedActors.map(a => a.name), datasets: [{ label: 'Number of Movies', data: sortedActors.map(a => a.count), backgroundColor: colorCyan, hoverBackgroundColor: colorHover, borderRadius: 6 }] }
})

const commonTooltip = { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#00f0ff', bodyColor: '#e2e8f0', borderColor: 'rgba(6, 182, 212, 0.3)', borderWidth: 1, padding: 12, cornerRadius: 8, displayColors: false }

const horizontalBarOptions = { responsive: true, maintainAspectRatio: false, indexAxis: 'y', animation: { duration: 1500, easing: 'easeOutQuart' }, interaction: { mode: 'index', axis: 'y', intersect: false }, plugins: { legend: { display: false }, tooltip: commonTooltip }, scales: { x: { grid: { color: 'rgba(51, 65, 85, 0.3)' }, ticks: { color: '#94a3b8' } }, y: { grid: { display: false }, ticks: { color: '#e2e8f0', font: { weight: '500' } } } } }
const verticalBarOptions = { responsive: true, maintainAspectRatio: false, animation: { duration: 1500, easing: 'easeOutQuart' }, plugins: { legend: { display: false }, tooltip: commonTooltip }, scales: { x: { grid: { display: false }, ticks: { color: '#e2e8f0', font: { weight: '500' } } }, y: { grid: { color: 'rgba(51, 65, 85, 0.3)', borderDash: [5,5] }, ticks: { color: '#94a3b8' } } } }
const lineOptions = { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, animation: { duration: 1500, easing: 'easeOutQuart' }, plugins: { legend: { display: false }, tooltip: commonTooltip }, scales: { x: { grid: { display: false }, ticks: { color: '#94a3b8' } }, y: { grid: { color: 'rgba(51, 65, 85, 0.3)', borderDash: [5,5] }, ticks: { color: '#94a3b8' } } } }
</script>
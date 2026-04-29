<template>
  <div class="animate-fade-in relative z-10">
    <div v-if="isLoading" class="flex flex-col items-center justify-center h-64 text-accent">
      <div class="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="font-semibold tracking-widest uppercase text-sm animate-pulse">Initializing Data...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-xl backdrop-blur-md">
      {{ error }}
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KpiCard label="Elite Content (8.0+)" :value="highTierContentPercentage" icon="🏆" />
        <KpiCard label="Avg IMDB Rating" :value="avgRating" icon="⭐" textValueClass="text-accent" iconBgClass="bg-cyan-500/20" iconTextClass="text-cyan-400" />
        <KpiCard :label="topGenreLabel" :value="topGenre" icon="🎭" bgClass="bg-gradient-to-br from-primary/80 to-indigo-600/80 border-white/10 shadow-primary/20" textLabelClass="text-blue-100" iconBgClass="bg-white/20" iconTextClass="text-white" />
        <KpiCard label="Most Popular Title" :value="topVotedTitle" icon="👑" textValueClass="text-indigo-400 text-sm truncate" iconBgClass="bg-indigo-500/20" iconTextClass="text-indigo-400" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Content Type" icon="🍪" heightClass="h-64">
          <Doughnut :data="typeChartData" :options="chartOptions" />
        </ChartCard>

        <ChartCard title="Content Release Trend" icon="📉" heightClass="h-64" colSpanClass="col-span-1 lg:col-span-2" iconBgClass="bg-cyan-500/20" iconTextClass="text-cyan-400">
          <Line :data="trendChartData" :options="lineOptions" />
        </ChartCard>

        <ChartCard title="Top 10 Genres" icon="📊" heightClass="h-80" colSpanClass="col-span-1 lg:col-span-3" iconBgClass="bg-indigo-500/20" iconTextClass="text-indigo-400">
          <Bar :data="genreChartData" :options="horizontalBarOptions" />
        </ChartCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import KpiCard from '../components/ui/KpiCard.vue'
import ChartCard from '../components/ui/ChartCard.vue'
import { onMounted, computed } from 'vue'
import { useMovies, formatLargeNumber } from '../composables/useMovies'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler } from 'chart.js'
import { Doughnut, Line, Bar } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler)

// 🔥 AMBIL filteredMoviesByTime DARI STATE GLOBAL
const { filteredMoviesByTime, isLoading, error, fetchMovies, yearFrom, yearTo } = useMovies()
onMounted(() => fetchMovies())

// Semuanya sekarang bereaksi terhadap filteredMoviesByTime
const highTierContentPercentage = computed(() => {
  if (filteredMoviesByTime.value.length === 0) return '0%'
  const highTier = filteredMoviesByTime.value.filter(m => parseFloat(m.imdbrating) >= 8.0)
  return ((highTier.length / filteredMoviesByTime.value.length) * 100).toFixed(1) + '%'
})
const avgRating = computed(() => {
  if (filteredMoviesByTime.value.length === 0) return 0
  const sum = filteredMoviesByTime.value.reduce((acc, curr) => acc + (parseFloat(curr.imdbrating) || 0), 0)
  return (sum / filteredMoviesByTime.value.length).toFixed(1)
})
const topGenreLabel = computed(() => {
  const from = yearFrom.value === 'All' ? '1980' : yearFrom.value
  const to = yearTo.value === 'All' ? '2023' : yearTo.value
  return from === '1980' && to === '2023' ? 'Top Genre (All Time)' : `Top Genre (${from}-${to})`
})
const topGenre = computed(() => {
  const counts = {}
  filteredMoviesByTime.value.forEach(m => { if(m.genres) m.genres.split(',').forEach(g => { counts[g.trim()] = (counts[g.trim()] || 0) + 1 }) })
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, '') || '-'
})
const topVotedTitle = computed(() => {
  if (filteredMoviesByTime.value.length === 0) return '-'
  const top = filteredMoviesByTime.value.reduce((prev, current) => {
    return (parseInt(prev.numvotes) || 0) > (parseInt(current.numvotes) || 0) ? prev : current
  })
  return top.title || '-'
})

const colorBlue = 'rgba(59, 130, 246, 0.8)'
const colorCyan = 'rgba(6, 182, 212, 0.8)'
const colorIndigo = 'rgba(99, 102, 241, 0.8)'
const colorHover = 'rgba(0, 240, 255, 1)'

const typeChartData = computed(() => {
  let movieCount = 0, tvCount = 0
  filteredMoviesByTime.value.forEach(m => { if (m.type === 'Movie') movieCount++; else if (m.type === 'TV Show') tvCount++ })
  const total = movieCount + tvCount || 1 // Hindari divide by zero
  return {
    labels: [`Movie (${((movieCount / total) * 100).toFixed(1)}%)`, `TV Show (${((tvCount / total) * 100).toFixed(1)}%)`],
    datasets: [{ data: [movieCount, tvCount], backgroundColor: [colorBlue, colorCyan], hoverBackgroundColor: [colorHover, colorHover], borderWidth: 0, hoverOffset: 15 }]
  }
})

const trendChartData = computed(() => {
  let yearCounts = {}
  filteredMoviesByTime.value.forEach(d => { let yr = d.releaseyear; if (yr >= 1980 && yr <= 2023) yearCounts[yr] = (yearCounts[yr] || 0) + 1 })
  const sortedYears = Object.keys(yearCounts).sort((a,b) => a - b)
  return { labels: sortedYears, datasets: [{ label: 'Content Released', data: sortedYears.map(y => yearCounts[y]), borderColor: colorCyan, backgroundColor: 'rgba(6, 182, 212, 0.15)', fill: true, tension: 0.4, pointBackgroundColor: colorCyan, pointHoverBackgroundColor: colorHover, pointRadius: 0, pointHoverRadius: 6 }] }
})

const genreChartData = computed(() => {
  const counts = {}
  filteredMoviesByTime.value.forEach(m => { if(m.genres) m.genres.split(',').forEach(g => { counts[g.trim()] = (counts[g.trim()] || 0) + 1 }) })
  const sorted = Object.keys(counts).map(k => ({name: k, count: counts[k]})).sort((a,b) => b.count - a.count).slice(0, 10)
  return { labels: sorted.map(g => g.name), datasets: [{ label: 'Number of Titles', data: sorted.map(g => g.count), backgroundColor: colorIndigo, hoverBackgroundColor: colorHover, borderRadius: 4 }] }
})

// Options
const commonTooltip = { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#00f0ff', bodyColor: '#e2e8f0', borderColor: 'rgba(6, 182, 212, 0.3)', borderWidth: 1, padding: 12, cornerRadius: 8 }
const chartOptions = { responsive: true, maintainAspectRatio: false, animation: { duration: 1500, easing: 'easeOutQuart' }, plugins: { legend: { position: 'right', labels: { color: '#cbd5e1' } }, tooltip: commonTooltip }, scales: { x: { display: false }, y: { display: false } } }
const lineOptions = { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, animation: { duration: 1500, easing: 'easeOutQuart' }, plugins: { legend: { display: false }, tooltip: commonTooltip }, scales: { x: { ticks: { color: '#64748b' }, grid: { display: false } }, y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(51, 65, 85, 0.3)', borderDash: [5, 5] } } } }
const horizontalBarOptions = { responsive: true, maintainAspectRatio: false, indexAxis: 'y', animation: { duration: 1500, easing: 'easeOutQuart' }, interaction: { mode: 'index', axis: 'y', intersect: false }, plugins: { legend: { display: false }, tooltip: commonTooltip }, scales: { x: { grid: { color: 'rgba(51, 65, 85, 0.3)', borderDash: [5,5] }, ticks: { color: '#94a3b8' } }, y: { grid: { display: false }, ticks: { color: '#e2e8f0', font: { weight: '500' } } } } }
</script>
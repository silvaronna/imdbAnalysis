<template>
  <div class="animate-fade-in relative z-10">
    <div v-if="isLoading" class="flex flex-col items-center justify-center h-64 text-accent">
      <div class="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="font-semibold tracking-widest uppercase text-sm animate-pulse">Initializing Data...</p>
    </div>
    
    <div v-else>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Top 10 Highest Voted Titles" icon="⭐" heightClass="h-80" iconBgClass="bg-blue-500/20" iconTextClass="text-blue-400">
          <Bar :data="topVotesData" :options="horizontalBarOptions" />
        </ChartCard>

        <ChartCard title="Top 10 Highest Rated Titles (Min. 500k Votes)" icon="🏆" heightClass="h-80" iconBgClass="bg-cyan-500/20" iconTextClass="text-cyan-400">
          <Bar :data="highestRatedData" :options="horizontalBarOptions" />
        </ChartCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="IMDB Score Distribution" icon="📊" heightClass="h-80" iconBgClass="bg-indigo-500/20" iconTextClass="text-indigo-400">
          <Pie :data="scorePieChartData" :options="pieOptions" />
        </ChartCard>

        <ChartCard title="Correlation: Votes vs Rating" icon="📈" heightClass="h-80" iconBgClass="bg-sky-500/20" iconTextClass="text-sky-400">
          <Scatter :data="scatterData" :options="scatterOptions" />
        </ChartCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import ChartCard from '../components/ui/ChartCard.vue' // Import UI Component
import { onMounted, computed } from 'vue'
import { useMovies } from '../composables/useMovies'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, ArcElement, Tooltip, Legend } from 'chart.js'
import { Bar, Scatter, Pie } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, ArcElement, Tooltip, Legend)
const { movies, isLoading, fetchMovies } = useMovies()
onMounted(() => fetchMovies())

const colorBlue = 'rgba(59, 130, 246, 0.8)', colorCyan = 'rgba(6, 182, 212, 0.8)', colorIndigo = 'rgba(99, 102, 241, 0.8)', colorHover = 'rgba(0, 240, 255, 1)'

const topVotesData = computed(() => {
  const sorted = [...movies.value].sort((a, b) => b.numvotes - a.numvotes).slice(0, 10)
  return { labels: sorted.map(m => m.title), datasets: [{ label: 'Total Votes', data: sorted.map(m => m.numvotes), backgroundColor: colorBlue, hoverBackgroundColor: colorHover, borderRadius: 6 }] }
})
const highestRatedData = computed(() => {
  const sorted = movies.value.filter(m => m.numvotes > 500000).sort((a, b) => b.imdbrating - a.imdbrating).slice(0, 10)
  return { labels: sorted.map(m => m.title), datasets: [{ label: 'IMDB Rating', data: sorted.map(m => m.imdbrating), backgroundColor: colorCyan, hoverBackgroundColor: colorHover, borderRadius: 6 }] }
})
const scorePieChartData = computed(() => {
  const bins = { 'Low (< 5.0)': 0, 'Average (5.0-6.9)': 0, 'Good (7.0-7.9)': 0, 'Great (8.0-8.9)': 0, 'Excellent (9.0+)': 0 }
  movies.value.forEach(m => {
    const score = parseFloat(m.imdbrating)
    if (score < 5.0) bins['Low (< 5.0)']++; else if (score < 7.0) bins['Average (5.0-6.9)']++; else if (score < 8.0) bins['Good (7.0-7.9)']++; else if (score < 9.0) bins['Great (8.0-8.9)']++; else bins['Excellent (9.0+)']++
  })
  const total = Object.values(bins).reduce((a,b) => a+b, 0)
  return { labels: Object.keys(bins).map(k => `${k} (${((bins[k]/total)*100).toFixed(1)}%)`), datasets: [{ data: Object.values(bins), backgroundColor: ['#ef4444', '#f59e0b', colorBlue, colorCyan, colorIndigo], hoverBackgroundColor: colorHover, borderWidth: 0, hoverOffset: 15 }] }
})
const scatterData = computed(() => {
  const points = movies.value.filter(m => m.numvotes > 10000 && m.imdbrating).map(m => ({ x: m.numvotes, y: parseFloat(m.imdbrating) }))
  return { datasets: [{ label: 'Movies', data: points, backgroundColor: 'rgba(14, 165, 233, 0.4)', borderColor: 'rgba(14, 165, 233, 0.8)', borderWidth: 1, pointRadius: 4, pointHoverRadius: 8, pointHoverBackgroundColor: colorHover }] }
})

const commonTooltip = { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#00f0ff', bodyColor: '#e2e8f0', borderColor: 'rgba(6, 182, 212, 0.3)', borderWidth: 1, padding: 12, cornerRadius: 8, displayColors: false }
const pieOptions = { responsive: true, maintainAspectRatio: false, animation: { duration: 1500, easing: 'easeOutQuart' }, plugins: { legend: { position: 'right', labels: { color: '#cbd5e1' } }, tooltip: commonTooltip }, interaction: { mode: 'index', intersect: false } }
const horizontalBarOptions = { responsive: true, maintainAspectRatio: false, indexAxis: 'y', animation: { duration: 1500, easing: 'easeOutQuart' }, interaction: { mode: 'index', axis: 'y', intersect: false }, plugins: { legend: { display: false }, tooltip: commonTooltip }, scales: { x: { grid: { color: 'rgba(51, 65, 85, 0.3)', borderDash: [5,5] }, ticks: { color: '#94a3b8' } }, y: { grid: { display: false }, ticks: { color: '#e2e8f0', font: { weight: '500' } } } } }
const scatterOptions = { responsive: true, maintainAspectRatio: false, interaction: { mode: 'nearest', intersect: true }, animation: { duration: 1500, easing: 'easeOutQuart' }, plugins: { legend: { display: false }, tooltip: commonTooltip }, scales: { x: { type: 'linear', position: 'bottom', title: { display: true, text: 'Number of Votes', color: '#94a3b8' }, grid: { color: 'rgba(51, 65, 85, 0.3)' }, ticks: { color: '#94a3b8' } }, y: { title: { display: true, text: 'IMDB Rating', color: '#94a3b8' }, grid: { color: 'rgba(51, 65, 85, 0.3)' }, ticks: { color: '#94a3b8' } } } }
</script>
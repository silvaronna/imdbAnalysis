<template>
  <div class="animate-fade-in relative z-10">
    <div v-if="isLoading" class="flex flex-col items-center justify-center h-64 text-accent">
      <div class="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="font-semibold tracking-widest uppercase text-sm animate-pulse">Analyzing Ratings Patterns...</p>
    </div>
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <ChartCard title="IMDB Rating vs. Total Votes" icon="🎯" heightClass="h-96" colSpanClass="col-span-1 lg:col-span-2" iconBgClass="bg-cyan-500/20" iconTextClass="text-cyan-400">
        <template #header-actions>
          <div class="relative group w-full sm:w-64">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500 group-focus-within:text-cyan-400"><v-icon name="fa-search" scale="0.8"/></span>
            <input v-model="searchTitle" type="text" placeholder="Highlight specific title..." class="bg-slate-900/50 border border-slate-700/80 pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-cyan-500 text-white w-full shadow-inner transition-colors">
          </div>
        </template>
        <Scatter :data="scatterData" :options="scatterOptions" />
      </ChartCard>

      <ChartCard title="Duration Impact on Average Rating" icon="⏱️" heightClass="h-96" iconBgClass="bg-amber-500/20" iconTextClass="text-amber-400">
        <Bar :data="durationImpactData" :options="barOptions" />
      </ChartCard>

      <ChartCard title="Movie vs TV Show: Quality Evolution" icon="📺" heightClass="h-96" iconBgClass="bg-pink-500/20" iconTextClass="text-pink-400">
        <Line :data="typeEvolutionData" :options="interactiveLineOptions" />
      </ChartCard>

      <ChartCard title="Average Rating by Genre" icon="🏆" heightClass="h-96" colSpanClass="col-span-1 lg:col-span-2" iconBgClass="bg-indigo-500/20" iconTextClass="text-indigo-400">
        <template #header-actions>
          <div class="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
            <div class="relative group w-full sm:w-56">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 group-focus-within:text-indigo-400"><v-icon name="fa-search" scale="0.8"/></span>
              <input v-model="searchGenre" type="text" placeholder="Search genre..." class="bg-slate-900/50 border border-slate-700/80 pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-white w-full shadow-inner transition-colors">
            </div>
            <div class="flex items-center gap-2">
              <button @click="genrePage--" :disabled="genrePage === 1" class="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-50 transition-colors flex items-center justify-center"><v-icon name="fa-chevron-left" scale="0.8"/></button>
              <span class="text-xs font-mono text-slate-400">{{ genrePage }} / {{ genreTotalPages || 1 }}</span>
              <button @click="genrePage++" :disabled="genrePage >= genreTotalPages" class="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-50 transition-colors flex items-center justify-center"><v-icon name="fa-chevron-right" scale="0.8"/></button>
            </div>
          </div>
        </template>
        <Bar :data="genreBenchmarkData" :options="horizontalBarOptions" />
      </ChartCard>

    </div>
  </div>
</template>

<script setup>
import ChartCard from '../components/ui/ChartCard.vue'
import { onMounted } from 'vue'
import { useMovies } from '../composables/useMovies'
import { useRatingsData } from '../composables/useRatingsData'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js'
import { Bar, Line, Scatter } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler)

const { filteredMoviesByTime, isLoading, fetchMovies } = useMovies()
onMounted(() => fetchMovies())

// Memastikan semua state dari composable diekstrak dengan benar
const { scatterData, searchTitle, durationImpactData, typeEvolutionData, genreBenchmarkData, searchGenre, genrePage, genreTotalPages } = useRatingsData(filteredMoviesByTime)

const commonTooltip = { backgroundColor: 'rgba(15, 23, 42, 0.95)', titleColor: '#00f0ff', bodyColor: '#e2e8f0', borderColor: 'rgba(6, 182, 212, 0.3)', borderWidth: 1, padding: 12, cornerRadius: 8 }
const interactiveLegend = { display: true, position: 'bottom', labels: { color: '#cbd5e1', usePointStyle: true, padding: 20 } }
const gridLines = { color: 'rgba(51, 65, 85, 0.3)', borderDash: [5,5] }

const scatterOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { ...commonTooltip, callbacks: { label: (ctx) => `${ctx.raw.title}: ⭐${ctx.raw.y} (${ctx.raw.x.toLocaleString()} votes)` } } }, scales: { x: { type: 'linear', title: { display: true, text: 'Total Votes', color: '#64748b' }, grid: gridLines, ticks: { color: '#94a3b8', callback: (value) => value >= 1000000 ? (value / 1000000) + 'M' : value >= 1000 ? (value / 1000) + 'k' : value } }, y: { title: { display: true, text: 'IMDB Rating', color: '#64748b' }, grid: gridLines, ticks: { color: '#e2e8f0' } } } }
const barOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: commonTooltip }, scales: { x: { grid: { display: false }, ticks: { color: '#94a3b8' } }, y: { title: { display: true, text: 'Avg Rating' }, grid: gridLines, ticks: { color: '#e2e8f0' }, min: 5, max: 10 } } }
const interactiveLineOptions = { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: interactiveLegend, tooltip: commonTooltip }, scales: { x: { ticks: { color: '#94a3b8' }, grid: { display: false } }, y: { title: { display: true, text: 'Avg IMDB Rating', color: '#64748b' }, ticks: { color: '#e2e8f0' }, grid: gridLines } } }
const horizontalBarOptions = { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false }, tooltip: commonTooltip }, scales: { x: { title: { display: true, text: 'Avg Rating' }, grid: gridLines, ticks: { color: '#94a3b8' }, min: 5 }, y: { grid: { display: false }, ticks: { color: '#e2e8f0' } } } }
</script>
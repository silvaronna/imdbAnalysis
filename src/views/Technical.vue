<template>
  <div class="animate-fade-in relative z-10">
    <div v-if="isLoading" class="flex flex-col items-center justify-center h-64 text-accent">
      <div class="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="font-semibold tracking-widest uppercase text-sm animate-pulse">Processing Advanced Metrics...</p>
    </div>
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <ChartCard title="Genre Quality Evolution (2000-2023)" icon="📈" heightClass="h-96" colSpanClass="col-span-1 lg:col-span-2" iconBgClass="bg-indigo-500/20" iconTextClass="text-indigo-400">
        <Line :data="genreTrendData" :options="interactiveLineOptions" />
      </ChartCard>

      <ChartCard title="Quality vs Quantity Paradox" icon="⚖️" heightClass="h-96" colSpanClass="col-span-1 lg:col-span-2" iconBgClass="bg-blue-500/20" iconTextClass="text-blue-400">
        <Bar :data="qualityQuantityData" :options="mixedOptions" />
      </ChartCard>

      <ChartCard title="Elite Actor Profile (Rating vs Total Movies)" icon="🎯" heightClass="h-96" iconBgClass="bg-cyan-500/20" iconTextClass="text-cyan-400">
        <template #header-actions>
          <div class="relative group w-full sm:w-64">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500 group-focus-within:text-cyan-400"><v-icon name="fa-search" scale="0.8"/></span>
            <input v-model="searchActorScatter" type="text" placeholder="Highlight actor..." class="bg-slate-900/50 border border-slate-700/80 pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-cyan-500 text-white w-full shadow-inner transition-colors">
          </div>
        </template>
        <Scatter :data="actorQualityData" :options="scatterOptions" />
      </ChartCard>

      <ChartCard title="Actor Genre Specialization" icon="🎭" heightClass="h-96" iconBgClass="bg-pink-500/20" iconTextClass="text-pink-400">
        <template #header-actions>
          <div class="relative group w-full sm:w-64">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500 group-focus-within:text-pink-400"><v-icon name="fa-search" scale="0.8"/></span>
            <input v-model="searchedActor" type="text" placeholder="Search specific actor..." class="bg-slate-900/50 border border-slate-700/80 pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-pink-500 text-white w-full shadow-inner transition-colors">
          </div>
        </template>
        <Bar :data="actorPortfolioData" :options="stackedBarOptions" />
      </ChartCard>

    </div>
  </div>
</template>

<script setup>
import ChartCard from '../components/ui/ChartCard.vue'
import { onMounted } from 'vue'
import { useMovies } from '../composables/useMovies'
import { useTechnicalData } from '../composables/useTechnicalData'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
import { Bar, Line, Scatter } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend)

const { filteredMoviesByTime, isLoading, fetchMovies } = useMovies()
onMounted(() => fetchMovies())

// Memastikan searchActorScatter terekstrak dengan benar
const { genreTrendData, actorQualityData, actorPortfolioData, qualityQuantityData, searchedActor, searchActorScatter } = useTechnicalData(filteredMoviesByTime)

const commonTooltip = { backgroundColor: 'rgba(15, 23, 42, 0.95)', titleColor: '#00f0ff', bodyColor: '#e2e8f0', borderColor: 'rgba(6, 182, 212, 0.3)', borderWidth: 1, padding: 12, cornerRadius: 8 }
const interactiveLegend = { display: true, position: 'bottom', labels: { color: '#cbd5e1', usePointStyle: true, padding: 20 } }
const gridLines = { color: 'rgba(51, 65, 85, 0.3)', borderDash: [5,5] }

const interactiveLineOptions = { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: interactiveLegend, tooltip: commonTooltip }, scales: { x: { ticks: { color: '#94a3b8' }, grid: { display: false } }, y: { title: { display: true, text: 'Avg IMDB Rating', color: '#64748b' }, ticks: { color: '#e2e8f0' }, grid: gridLines } } }
const scatterOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { ...commonTooltip, callbacks: { label: (ctx) => `${ctx.raw.actorName}: ${ctx.raw.x} movies, ⭐ ${ctx.raw.y}` } } }, scales: { x: { type: 'linear', position: 'bottom', title: { display: true, text: 'Total Movies', color: '#64748b' }, grid: gridLines, ticks: { color: '#94a3b8' } }, y: { title: { display: true, text: 'Avg IMDB Rating', color: '#64748b' }, grid: gridLines, ticks: { color: '#e2e8f0' } } } }
const stackedBarOptions = { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: interactiveLegend, tooltip: commonTooltip }, scales: { x: { stacked: true, grid: { display: false }, ticks: { color: '#94a3b8' } }, y: { stacked: true, title: { display: true, text: 'Number of Movies', color: '#64748b' }, grid: gridLines, ticks: { color: '#e2e8f0' } } } }
const mixedOptions = { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: interactiveLegend, tooltip: commonTooltip }, scales: { x: { grid: { display: false }, ticks: { color: '#94a3b8' } }, 'y-count': { type: 'linear', position: 'left', title: { display: true, text: 'Total Released', color: '#818cf8' }, ticks: { color: '#818cf8' }, grid: gridLines }, 'y-rating': { type: 'linear', position: 'right', title: { display: true, text: 'Avg Rating', color: '#00f0ff' }, ticks: { color: '#00f0ff' }, grid: { display: false } } } }
</script>
<template>
  <div class="animate-fade-in relative z-10">
    <div v-if="isLoading" class="flex flex-col items-center justify-center h-64 text-accent">
      <div class="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="font-semibold tracking-widest uppercase text-sm animate-pulse">Initializing Data...</p>
    </div>
    
    <div v-else>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-cardbg backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 tech-card group">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">⭐</div>
            <h4 class="text-lg font-bold text-white tracking-wide">6. Top 10 Highest Voted Titles</h4>
          </div>
          <div class="h-80"><Bar :data="topVotesData" :options="horizontalBarOptions" /></div>
        </div>

        <div class="bg-cardbg backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 tech-card group">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">🏆</div>
            <h4 class="text-lg font-bold text-white tracking-wide">12. Top 10 Highest Rated Titles (Min. 500k Votes)</h4>
          </div>
          <div class="h-80"><Bar :data="highestRatedData" :options="horizontalBarOptions" /></div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-cardbg backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 tech-card group">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">📊</div>
            <h4 class="text-lg font-bold text-white tracking-wide">2. IMDB Score Distribution</h4>
          </div>
          <div class="h-80"><Pie :data="scorePieChartData" :options="pieOptions" /></div>
        </div>

        <div class="bg-cardbg backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 tech-card group">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">📈</div>
            <h4 class="text-lg font-bold text-white tracking-wide">7. Correlation: Votes vs Rating</h4>
          </div>
          <div class="h-80"><Scatter :data="scatterData" :options="scatterOptions" /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useMovies } from '../composables/useMovies'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, ArcElement, Tooltip, Legend } from 'chart.js'
import { Bar, Scatter, Pie } from 'vue-chartjs' // Import Pie component

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, ArcElement, Tooltip, Legend) // Register ArcElement

const { movies, isLoading, fetchMovies } = useMovies()
onMounted(() => fetchMovies())

// --- WARNA TEMA TECH BLUE ---
const colorBlue = 'rgba(59, 130, 246, 0.8)'
const colorCyan = 'rgba(6, 182, 212, 0.8)'
const colorIndigo = 'rgba(99, 102, 241, 0.8)'
const colorHover = 'rgba(0, 240, 255, 1)'

// --- DATA LOGIC (English) ---
const topVotesData = computed(() => {
  const sorted = [...movies.value].sort((a, b) => b.numvotes - a.numvotes).slice(0, 10)
  return { labels: sorted.map(m => m.title), datasets: [{ label: 'Total Votes', data: sorted.map(m => m.numvotes), backgroundColor: colorBlue, hoverBackgroundColor: colorHover, borderRadius: 6 }] }
})

const highestRatedData = computed(() => {
  const sorted = movies.value.filter(m => m.numvotes > 500000).sort((a, b) => b.imdbrating - a.imdbrating).slice(0, 10)
  return { labels: sorted.map(m => m.title), datasets: [{ label: 'IMDB Rating', data: sorted.map(m => m.imdbrating), backgroundColor: colorCyan, hoverBackgroundColor: colorHover, borderRadius: 6 }] }
})

// Logic Chart 2: Ganti ke Pie Chart ( English bins)
const scorePieChartData = computed(() => {
  const bins = { 'Low (< 5.0)': 0, 'Average (5.0-6.9)': 0, 'Good (7.0-7.9)': 0, 'Great (8.0-8.9)': 0, 'Excellent (9.0+)': 0 }
  movies.value.forEach(m => {
    const score = parseFloat(m.imdbrating)
    if (score < 5.0) bins['Low (< 5.0)']++
    else if (score < 7.0) bins['Average (5.0-6.9)']++ // Gabungkan 5-6 agar pie tidak terlalu banyak porsi kecil
    else if (score < 8.0) bins['Good (7.0-7.9)']++
    else if (score < 9.0) bins['Great (8.0-8.9)']++
    else bins['Excellent (9.0+)']++
  })
  
  const total = Object.values(bins).reduce((a,b) => a+b, 0)
  
  return { 
    labels: Object.keys(bins).map(k => `${k} (${((bins[k]/total)*100).toFixed(1)}%)`), 
    datasets: [{ data: Object.values(bins), backgroundColor: ['#ef4444', '#f59e0b', colorBlue, colorCyan, colorIndigo], hoverBackgroundColor: colorHover, borderWidth: 0, hoverOffset: 15 }] 
  }
})

const scatterData = computed(() => {
  const points = movies.value.filter(m => m.numvotes > 10000 && m.imdbrating).map(m => ({ x: m.numvotes, y: parseFloat(m.imdbrating) }))
  return { datasets: [{ label: 'Movies', data: points, backgroundColor: 'rgba(14, 165, 233, 0.4)', borderColor: 'rgba(14, 165, 233, 0.8)', borderWidth: 1, pointRadius: 4, pointHoverRadius: 8, pointHoverBackgroundColor: colorHover }] }
})

// --- CHART OPTIONS ---
const commonTooltip = { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#00f0ff', bodyColor: '#e2e8f0', borderColor: 'rgba(6, 182, 212, 0.3)', borderWidth: 1, padding: 12, cornerRadius: 8, displayColors: false }

const pieOptions = {
  responsive: true, maintainAspectRatio: false, animation: { duration: 1500, easing: 'easeOutQuart' },
  plugins: { legend: { position: 'right', labels: { color: '#cbd5e1' } }, tooltip: commonTooltip },
  interaction: { mode: 'index', intersect: false }
}

const horizontalBarOptions = {
  responsive: true, maintainAspectRatio: false, indexAxis: 'y', animation: { duration: 1500, easing: 'easeOutQuart' },
  interaction: { mode: 'index', intersect: false },
  plugins: { legend: { display: false }, tooltip: commonTooltip },
  scales: { x: { grid: { color: 'rgba(51, 65, 85, 0.3)', borderDash: [5,5] }, ticks: { color: '#94a3b8' } }, y: { grid: { display: false }, ticks: { color: '#e2e8f0', font: { weight: '500' } } } }
}

const scatterOptions = {
  responsive: true, maintainAspectRatio: false, interaction: { mode: 'nearest', intersect: true }, animation: { duration: 1500, easing: 'easeOutQuart' },
  plugins: { legend: { display: false }, tooltip: commonTooltip },
  scales: {
    x: { type: 'linear', position: 'bottom', title: { display: true, text: 'Number of Votes', color: '#94a3b8' }, grid: { color: 'rgba(51, 65, 85, 0.3)' }, ticks: { color: '#94a3b8' } },
    y: { title: { display: true, text: 'IMDB Rating', color: '#94a3b8' }, grid: { color: 'rgba(51, 65, 85, 0.3)' }, ticks: { color: '#94a3b8' } }
  }
}
</script>
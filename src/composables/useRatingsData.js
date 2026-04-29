import { computed, ref, watch } from 'vue'

export function useRatingsData(movies) {
  const colors = ['rgba(6, 182, 212, 0.8)', 'rgba(99, 102, 241, 0.8)', 'rgba(236, 72, 153, 0.8)', 'rgba(245, 158, 11, 0.8)']

  // 1. DATA SCATTER (Dengan Highlighting)
  const searchTitle = ref('')
  const scatterData = computed(() => {
    if (!movies.value) return { datasets: [] }
    const rawPoints = movies.value
      .filter(m => m.numvotes > 5000 && m.imdbrating)
      .map(m => ({ x: m.numvotes, y: parseFloat(m.imdbrating), title: m.title }))
    
    const bgColors = []
    const radii = []
    const query = searchTitle.value.toLowerCase().trim()
    
    rawPoints.forEach(p => {
      const isMatch = query === '' || String(p.title).toLowerCase().includes(query)
      bgColors.push(isMatch ? 'rgba(6, 182, 212, 0.8)' : 'rgba(51, 65, 85, 0.15)')
      radii.push(isMatch ? (query === '' ? 4 : 8) : 2)
    })

    return { datasets: [{ label: 'Movies', data: rawPoints, backgroundColor: bgColors, borderWidth: 0, pointRadius: radii, pointHoverRadius: 10 }] }
  })

  // 2. DURATION IMPACT
  const durationImpactData = computed(() => {
    if (!movies.value) return { labels: [], datasets: [] }
    const bins = { 'Short (<90m)': { sum: 0, count: 0 }, 'Standard (90-120m)': { sum: 0, count: 0 }, 'Long (120-150m)': { sum: 0, count: 0 }, 'Epic (>150m)': { sum: 0, count: 0 } }
    movies.value.forEach(m => {
      const durMatch = String(m.duration).match(/(\d+)/)
      if (durMatch && m.imdbrating) {
        const d = parseInt(durMatch[0]); const r = parseFloat(m.imdbrating); let key = ''
        if (d < 90) key = 'Short (<90m)'; else if (d <= 120) key = 'Standard (90-120m)'; else if (d <= 150) key = 'Long (120-150m)'; else key = 'Epic (>150m)'
        bins[key].sum += r; bins[key].count++
      }
    })
    const labels = Object.keys(bins)
    const averages = labels.map(k => bins[k].count ? (bins[k].sum / bins[k].count).toFixed(2) : 0)
    return { labels, datasets: [{ label: 'Avg Rating', data: averages, backgroundColor: colors, borderRadius: 8 }] }
  })

  // 3. MOVIE VS TV SHOW EVOLUTION
  const typeEvolutionData = computed(() => {
    if (!movies.value || movies.value.length === 0) return { labels: [], datasets: [] }
    const years = movies.value.map(m => parseInt(m.releaseyear)).filter(y => !isNaN(y))
    const minYear = Math.min(...years) || 2000; const maxYear = Math.max(...years) || 2023
    const yearRange = Array.from({length: maxYear - minYear + 1}, (_, i) => minYear + i)

    const movieData = yearRange.map(y => {
      const f = movies.value.filter(m => m.releaseyear === y && m.type === 'Movie' && m.imdbrating)
      return f.length ? (f.reduce((a,b)=>a+parseFloat(b.imdbrating),0)/f.length).toFixed(2) : null
    })
    const tvData = yearRange.map(y => {
      const f = movies.value.filter(m => m.releaseyear === y && m.type === 'TV Show' && m.imdbrating)
      return f.length ? (f.reduce((a,b)=>a+parseFloat(b.imdbrating),0)/f.length).toFixed(2) : null
    })
    return {
      labels: yearRange,
      datasets: [
        { label: 'Movie', data: movieData, borderColor: 'rgba(59, 130, 246, 1)', backgroundColor: 'rgba(59, 130, 246, 0.1)', tension: 0.4, spanGaps: true, pointBackgroundColor: 'rgba(59, 130, 246, 1)' },
        { label: 'TV Show', data: tvData, borderColor: 'rgba(236, 72, 153, 1)', backgroundColor: 'rgba(236, 72, 153, 0.1)', tension: 0.4, spanGaps: true, pointBackgroundColor: 'rgba(236, 72, 153, 1)' }
      ]
    }
  })

  // 4. GENRES BY CONSISTENCY (Pagination & Search)
  const searchGenre = ref('')
  const genrePage = ref(1)
  const genreItemsPerPage = 10
  
  watch(searchGenre, () => { genrePage.value = 1 })

  const processedGenres = computed(() => {
    if (!movies.value) return []
    const genreStats = {}
    movies.value.forEach(m => {
      if (m.genres && m.imdbrating) {
        m.genres.split(',').forEach(g => {
          const name = g.trim()
          if (!genreStats[name]) genreStats[name] = { sum: 0, count: 0 }
          genreStats[name].sum += parseFloat(m.imdbrating); genreStats[name].count++
        })
      }
    })

    let list = Object.keys(genreStats)
      .filter(g => genreStats[g].count > 5)
      .map(g => ({ name: g, avg: (genreStats[g].sum / genreStats[g].count).toFixed(2) }))
      .sort((a, b) => b.avg - a.avg)

    if (searchGenre.value.trim()) {
      const q = searchGenre.value.toLowerCase().trim()
      list = list.filter(g => g.name.toLowerCase().includes(q))
    }
    return list
  })

  const genreTotalPages = computed(() => Math.ceil(processedGenres.value.length / genreItemsPerPage))
  
  const genreBenchmarkData = computed(() => {
    const start = (genrePage.value - 1) * genreItemsPerPage
    const sliced = processedGenres.value.slice(start, start + genreItemsPerPage)
    return {
      labels: sliced.map(g => g.name),
      datasets: [{ label: 'Average Rating', data: sliced.map(g => g.avg), backgroundColor: 'rgba(99, 102, 241, 0.7)', hoverBackgroundColor: 'rgba(99, 102, 241, 1)', borderRadius: 5 }]
    }
  })

  return { scatterData, searchTitle, durationImpactData, typeEvolutionData, genreBenchmarkData, searchGenre, genrePage, genreTotalPages }
}
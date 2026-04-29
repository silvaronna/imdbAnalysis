import { computed, ref } from 'vue'

export function useTechnicalData(movies) {
  const colors = [ 'rgba(6, 182, 212, 0.8)', 'rgba(99, 102, 241, 0.8)', 'rgba(236, 72, 153, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(139, 92, 246, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(20, 184, 166, 0.8)', 'rgba(249, 115, 22, 0.8)', 'rgba(100, 116, 139, 0.8)' ]
  const hoverColors = [ 'rgba(0, 240, 255, 1)', 'rgba(129, 140, 248, 1)', 'rgba(244, 114, 182, 1)', 'rgba(251, 191, 36, 1)', 'rgba(96, 165, 250, 1)', 'rgba(52, 211, 153, 1)', 'rgba(167, 139, 250, 1)', 'rgba(248, 113, 113, 1)', 'rgba(45, 212, 191, 1)', 'rgba(251, 146, 60, 1)', 'rgba(148, 163, 184, 1)' ]

  const getTopGenres = (limit = 10) => {
    const counts = {}
    movies.value.forEach(m => { if (m.genres) m.genres.split(',').forEach(g => { counts[g.trim()] = (counts[g.trim()] || 0) + 1 }) })
    return Object.keys(counts).sort((a,b) => counts[b] - counts[a]).slice(0, limit)
  }

  const dynamicYearRange = computed(() => {
    if (!movies.value || movies.value.length === 0) return []
    const years = movies.value.map(m => parseInt(m.releaseyear)).filter(y => !isNaN(y))
    if (years.length === 0) return []
    const minYear = Math.min(...years)
    const maxYear = Math.max(...years)
    return Array.from({length: maxYear - minYear + 1}, (_, i) => minYear + i)
  })

  // 1. GENRE TREND
  const genreTrendData = computed(() => {
    if (!movies.value || !movies.value.length) return { labels: [], datasets: [] }
    const targetGenres = getTopGenres(10)
    const yearRange = dynamicYearRange.value
    
    const datasets = targetGenres.map((genre, index) => {
      const dataPoints = yearRange.map(year => {
        const filtered = movies.value.filter(m => m.releaseyear === year && m.genres && m.genres.includes(genre) && m.imdbrating)
        if (filtered.length === 0) return null
        return (filtered.reduce((acc, curr) => acc + parseFloat(curr.imdbrating), 0) / filtered.length).toFixed(2)
      })
      return { label: genre, data: dataPoints, borderColor: colors[index], backgroundColor: colors[index].replace('0.8', '0.1'), pointBackgroundColor: colors[index], pointHoverBackgroundColor: hoverColors[index], pointRadius: 3, pointHoverRadius: 6, tension: 0.4, spanGaps: true }
    })
    return { labels: yearRange, datasets }
  })

  // 2. SCATTER ACTOR (DENGAN SEARCH)
  const searchActorScatter = ref('')
  const actorQualityData = computed(() => {
    if (!movies.value || !movies.value.length) return { datasets: [] }
    const actorStats = {}
    movies.value.forEach(m => {
      if (m.cast && m.imdbrating) m.cast.split(',').forEach(a => {
        const name = a.trim()
        if (!actorStats[name]) actorStats[name] = { count: 0, sumRating: 0 }
        actorStats[name].count++; actorStats[name].sumRating += parseFloat(m.imdbrating)
      })
    })
    
    const rawPoints = Object.keys(actorStats).filter(name => actorStats[name].count >= 5).map(name => ({ x: actorStats[name].count, y: parseFloat((actorStats[name].sumRating / actorStats[name].count).toFixed(2)), actorName: name }))

    const bgColors = []
    const radii = []
    const query = searchActorScatter.value.toLowerCase().trim()
    
    rawPoints.forEach(p => {
      const isMatch = query === '' || String(p.actorName).toLowerCase().includes(query)
      bgColors.push(isMatch ? 'rgba(6, 182, 212, 0.8)' : 'rgba(51, 65, 85, 0.15)')
      radii.push(isMatch ? (query === '' ? 5 : 10) : 2)
    })

    return { datasets: [{ label: 'Actor Profile', data: rawPoints, backgroundColor: bgColors, borderWidth: 0, pointRadius: radii, pointHoverRadius: 10 }] }
  })

  // 3. ACTOR PORTFOLIO 
  const searchedActor = ref('') 
  const actorPortfolioData = computed(() => {
    if (!movies.value || !movies.value.length) return { labels: [], datasets: [] }
    const actorCounts = {}
    movies.value.forEach(m => { if (m.cast) m.cast.split(',').forEach(a => { actorCounts[a.trim()] = (actorCounts[a.trim()] || 0) + 1 }) })
    
    let targetActors = []
    if (!searchedActor.value.trim()) {
      targetActors = Object.keys(actorCounts).sort((a, b) => actorCounts[b] - actorCounts[a]).slice(0, 10)
    } else {
      const query = searchedActor.value.toLowerCase().trim()
      targetActors = Object.keys(actorCounts).filter(a => a.toLowerCase().includes(query)).sort((a, b) => actorCounts[b] - actorCounts[a]).slice(0, 10)
    }

    const targetGenres = getTopGenres(10)
    const categories = [...targetGenres, 'Others']
    
    const portfolio = targetActors.map(name => {
      let stats = {}; categories.forEach(c => stats[c] = 0)
      movies.value.filter(m => m.cast && m.cast.includes(name)).forEach(m => {
        let found = false; targetGenres.forEach(g => { if (m.genres && m.genres.includes(g)) { stats[g]++; found = true } })
        if (!found) stats.Others++
      })
      return stats
    })
    
    const datasets = categories.map((genre, index) => ({ label: genre, data: portfolio.map(p => p[genre]), backgroundColor: colors[index], hoverBackgroundColor: hoverColors[index], borderRadius: 4 }))
    return { labels: targetActors, datasets }
  })

  // 4. MIXED CHART
  const qualityQuantityData = computed(() => {
    if (!movies.value || !movies.value.length) return { labels: [], datasets: [] }
    const yearRange = dynamicYearRange.value
    const counts = [], ratings = []
    yearRange.forEach(year => {
      const yearlyData = movies.value.filter(m => m.releaseyear === year && m.imdbrating)
      counts.push(yearlyData.length)
      const sum = yearlyData.reduce((a, b) => a + parseFloat(b.imdbrating), 0)
      ratings.push(yearlyData.length ? (sum / yearlyData.length).toFixed(2) : null)
    })
    return {
      labels: yearRange,
      datasets: [
        { type: 'line', label: 'Avg Rating (Kualitas)', data: ratings, borderColor: 'rgba(0, 240, 255, 1)', backgroundColor: 'rgba(0, 240, 255, 0.2)', borderWidth: 3, pointBackgroundColor: '#00f0ff', pointRadius: 4, yAxisID: 'y-rating', tension: 0.4, spanGaps: true },
        { type: 'bar', label: 'Total Rilis (Kuantitas)', data: counts, backgroundColor: 'rgba(99, 102, 241, 0.5)', hoverBackgroundColor: 'rgba(99, 102, 241, 0.8)', borderRadius: 4, yAxisID: 'y-count' }
      ]
    }
  })

  return { genreTrendData, actorQualityData, actorPortfolioData, qualityQuantityData, searchedActor, searchActorScatter }
}
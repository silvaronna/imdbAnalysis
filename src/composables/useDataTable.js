import { ref, computed, watch } from 'vue'

export function useDataTable(sourceData) {
  const filters = ref({ title: '', cast: '', type: '', minRating: '0' })
  const sortCol = ref(null)
  const sortDesc = ref(false)
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  // Kembali ke hal 1 jika filter/sort berubah
  watch([filters, sortCol, sortDesc, itemsPerPage], () => { currentPage.value = 1 }, { deep: true })

  const resetFilters = () => {
    filters.value = { title: '', cast: '', type: '', minRating: '0' }; sortCol.value = null; sortDesc.value = false
  }

  // 1. Filter & Sort Data
  const processedData = computed(() => {
    if (!sourceData.value) return []
    let result = sourceData.value.filter(m => {
      if (filters.value.title && !String(m.title).toLowerCase().includes(filters.value.title.toLowerCase())) return false
      if (filters.value.cast && (!m.cast || !String(m.cast).toLowerCase().includes(filters.value.cast.toLowerCase()))) return false
      if (filters.value.type && m.type !== filters.value.type) return false
      if (filters.value.minRating !== '0' && (parseFloat(m.imdbrating) || 0) < parseFloat(filters.value.minRating)) return false
      return true
    })

    if (sortCol.value) {
      result.sort((a, b) => {
        let valA = a[sortCol.value], valB = b[sortCol.value]
        if (['imdbrating', 'numvotes', 'releaseyear'].includes(sortCol.value)) {
          valA = parseFloat(valA) || 0; valB = parseFloat(valB) || 0
        } else {
          valA = String(valA || '').toLowerCase(); valB = String(valB || '').toLowerCase()
        }
        if (valA < valB) return sortDesc.value ? 1 : -1
        if (valA > valB) return sortDesc.value ? -1 : 1
        return 0
      })
    }
    return result
  })

  // 2. Pagination Logic
  const totalPages = computed(() => Math.ceil(processedData.value.length / itemsPerPage.value))
  const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
  const endIndex = computed(() => startIndex.value + itemsPerPage.value)
  const paginatedData = computed(() => processedData.value.slice(startIndex.value, endIndex.value))

  // 3. Helper Table Headers
  const sortBy = (column) => {
    if (sortCol.value === column) {
      if (sortDesc.value) { sortCol.value = null; sortDesc.value = false } else { sortDesc.value = true }
    } else { sortCol.value = column; sortDesc.value = false }
  }
  const getSortIcon = (col) => sortCol.value !== col ? 'fa-sort' : (sortDesc.value ? 'fa-sort-down' : 'fa-sort-up')

  return { filters, currentPage, itemsPerPage, resetFilters, processedData, totalPages, startIndex, endIndex, paginatedData, sortBy, getSortIcon }
}
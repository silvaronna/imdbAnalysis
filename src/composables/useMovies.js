import { ref } from 'vue'
import Papa from 'papaparse'

// State global
const movies = ref([])
const isLoading = ref(true)
const error = ref(null)

// UTILITY FUNCTION: Memformat angka besar (misal 1206.4M -> 1.2B)
export const formatLargeNumber = (num) => {
  if (num === null || num === undefined) return '0'
  const value = parseInt(num)
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + 'B+'
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M+'
  } else {
    return value.toLocaleString()
  }
}

export function useMovies() {
  const fetchMovies = () => {
    // Kalau data sudah ada, jangan fetch ulang (save bandwidth)
    if (movies.value.length > 0) return

    isLoading.value = true
    error.value = null

    // GANTI Tembak Langsung URL lengkap repository-mu di GitHub!
    // Contoh: 'https://username_kamu.github.io/nama_repo/imdb_data.csv'
    const csvPath = 'https://silvaronna.github.io/imdbAnalysis/imdb_data.csv'

    // Gunakan PapaParse untuk membaca CSV lokal
    Papa.parse(csvPath, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        // Membersihkan data kosong
        movies.value = results.data.filter(row => row.title)
        isLoading.value = false
      },
      error: (err) => {
        console.error("Error PapaParse:", err)
        error.value = "Failed to load CSV dataset."
        isLoading.value = false
      }
    })
  }

  return { movies, isLoading, error, fetchMovies }
}
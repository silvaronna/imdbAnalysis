import { ref } from 'vue'
import Papa from 'papaparse'

const movies = ref([])
const isLoading = ref(true)
const error = ref(null)

export function useMovies() {
  const fetchMovies = () => {
    if (movies.value.length > 0) return

    isLoading.value = true
    error.value = null

    // TRIK PALING SEMPURNA: Gunakan BASE_URL bawaan Vite.
    // Di lokal ini akan menjadi '/imdbAnalysis/imdb_data.csv'
    // Di GitHub ini juga akan menjadi '/imdbAnalysis/imdb_data.csv'
    const csvPath = import.meta.env.BASE_URL + 'imdb_data.csv'

    Papa.parse(csvPath, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        movies.value = results.data.filter(row => row.title)
        isLoading.value = false
      },
      error: (err) => {
        console.error("Error PapaParse:", err)
        error.value = "Gagal memuat dataset CSV."
        isLoading.value = false
      }
    })
  }

  return { movies, isLoading, error, fetchMovies }
}

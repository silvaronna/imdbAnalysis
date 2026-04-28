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

    // Mengambil file CSV dari folder public/ tanpa butuh backend Node.js!
    Papa.parse('/imdb_data.csv', {
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
        error.value = "Gagal memuat dataset CSV."
        isLoading.value = false
      }
    })
  }

  return { movies, isLoading, error, fetchMovies }
}

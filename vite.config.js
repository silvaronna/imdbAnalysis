import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // GANTI tulisan 'imdb-dashboard' di bawah dengan nama repo GitHub-mu!
  // Jangan lupa garis miring di awal dan akhir.
  base: '/imdbAnalysis/', 
  plugins: [
    vue(),
    tailwindcss(),
  ],
})

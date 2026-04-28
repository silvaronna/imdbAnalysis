import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // WAJIB sama persis dengan nama repo di GitHub!
  base: '/imdbAnalysis/', 
  plugins: [
    vue(),
    tailwindcss(),
  ],
})

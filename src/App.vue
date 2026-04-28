<template>
  <div class="min-h-screen bg-darkbg text-slate-200 flex flex-col relative overflow-hidden">
    
    <div class="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

    <HeaderNav />

    <main class="flex-1 container mx-auto px-4 lg:px-8 py-8 w-full max-w-7xl relative z-10">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

  </div>
</template>

<script setup>
import HeaderNav from './components/layout/HeaderNav.vue'
</script>

<style>
/* Transisi Ganti Halaman Global */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }
</style>
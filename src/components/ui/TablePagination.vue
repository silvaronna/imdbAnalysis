<template>
  <div class="p-4 border-t border-slate-700/50 bg-slate-900/40 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-sm">
    <div class="flex items-center gap-3 text-slate-400">
      <span>Show</span>
      <select :value="modelValue" @change="$emit('update:modelValue', Number($event.target.value))" class="bg-slate-800 border border-slate-700 text-accent font-bold py-1 px-2 rounded-lg focus:outline-none cursor-pointer">
        <option :value="10">10</option><option :value="20">20</option><option :value="50">50</option>
      </select>
      <span>entries</span>
    </div>

    <div class="text-slate-400">
      Showing <span class="text-white">{{ startIndex + 1 }}</span> to <span class="text-white">{{ Math.min(endIndex, totalItems) }}</span> of <span class="text-accent">{{ totalItems }}</span> records
    </div>

    <div class="flex items-center gap-2">
      <button @click="$emit('prev')" :disabled="currentPage === 1" class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-primary/20 hover:text-accent disabled:opacity-50">
        <v-icon name="fa-chevron-left" scale="0.8" />
      </button>
      <span class="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold">{{ currentPage }} / {{ totalPages || 1 }}</span>
      <button @click="$emit('next')" :disabled="currentPage >= totalPages" class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-primary/20 hover:text-accent disabled:opacity-50">
        <v-icon name="fa-chevron-right" scale="0.8" />
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(['modelValue', 'currentPage', 'totalPages', 'startIndex', 'endIndex', 'totalItems'])
defineEmits(['update:modelValue', 'prev', 'next'])
</script>
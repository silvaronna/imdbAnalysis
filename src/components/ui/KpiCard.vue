<template>
  <div :class="['backdrop-blur-xl p-6 rounded-2xl border tech-card shadow-lg', bgClass]">
    <div class="flex justify-between items-start">
      <div>
        <p :class="['text-sm font-medium', textLabelClass]">{{ label }}</p>
        <h3 :class="['text-3xl font-bold mt-1.5', textValueClass]">{{ value }}</h3>
      </div>
      <div :class="['p-2 rounded-lg', iconBgClass, iconTextClass]">
        {{ icon }}
      </div>
    </div>
  </div>
</template>

<script setup>
// Mendefinisikan 'Props' agar data bisa disuntikkan dari luar
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, required: true },
  bgClass: { type: String, default: 'bg-cardbg border-slate-700/50' },
  textLabelClass: { type: String, default: 'text-slate-400' },
  textValueClass: { type: String, default: 'text-white' },
  iconBgClass: { type: String, default: 'bg-blue-500/20' },
  iconTextClass: { type: String, default: 'text-blue-400' }
})
</script>
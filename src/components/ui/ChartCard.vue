<template>
  <div :class="['bg-cardbg backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 tech-card group', colSpanClass]">
    <div class="flex items-center gap-3 mb-6">
      <div :class="['w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110', iconBgClass, iconTextClass]">
        {{ icon }}
      </div>
      <h4 class="text-lg font-bold text-white tracking-wide">{{ title }}</h4>
    </div>
    
    <div :class="heightClass">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  icon: { type: String, required: true },
  colSpanClass: { type: String, default: 'col-span-1' },
  heightClass: { type: String, default: 'h-64' },
  iconBgClass: { type: String, default: 'bg-blue-500/20' },
  iconTextClass: { type: String, default: 'text-blue-400' }
})
</script>
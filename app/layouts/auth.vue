<template>
  <div class="min-h-dvh flex flex-col items-center justify-center gap-6 p-4 bg-elevated">
    <div class="text-center">
      <!-- TBD-7: nama UKM dan logo diambil dari konfigurasi, bukan hardcode -->
      <h1 class="text-2xl font-bold text-highlighted">
        {{ config.public.appName }}
      </h1>
      <p class="text-sm text-muted">
        {{ config.public.appSubtitle }}
      </p>
    </div>
    <main class="w-full max-w-sm">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
</script>

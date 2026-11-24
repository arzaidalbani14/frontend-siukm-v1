<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold text-highlighted">
      Selamat datang, {{ auth.pengguna?.nama ?? auth.pengguna?.email }}
    </h1>
    <p class="text-muted">
      Ringkasan dashboard sesuai peran Anda akan tampil di sini.
    </p>
    <!-- TODO (KF-13, Sprint 1 kerangka, Sprint 3 lengkap): StatCard/ChartCard setelah kontrak GET /dashboard jelas -->
  </div>
</template>

<script setup lang="ts">
definePageMeta({ permissions: ['DASHBOARD'] })
useHead({ title: 'Dashboard' })

const auth = useAuthStore()
</script>

<template>
  <div class="mx-auto max-w-md py-16 text-center space-y-4">
    <UIcon name="i-lucide-shield-alert" class="size-12 text-muted mx-auto" />
    <h1 class="text-2xl font-bold text-highlighted">
      Akses ditolak
    </h1>
    <p class="text-muted">
      Anda tidak memiliki hak akses ke halaman tersebut. Hubungi Admin bila Anda merasa ini keliru.
    </p>
    <UButton to="/" label="Kembali ke beranda" icon="i-lucide-house" />
  </div>
</template>

<script setup lang="ts">
// KF-15.2: halaman 403. Hanya butuh login (tanpa `permissions`).
useHead({ title: 'Akses ditolak' })
</script>

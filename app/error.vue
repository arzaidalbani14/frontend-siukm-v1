<template>
  <UApp :locale="id">
    <div class="min-h-dvh flex items-center justify-center p-6 bg-default">
      <div class="max-w-md text-center space-y-4">
        <UIcon :name="ikon" class="size-12 text-muted mx-auto" />
        <p class="text-sm font-semibold text-primary">
          {{ error.statusCode }}
        </p>
        <h1 class="text-2xl font-bold text-highlighted">
          {{ judul }}
        </h1>
        <p class="text-muted">
          {{ pesan }}
        </p>
        <UButton label="Kembali ke beranda" icon="i-lucide-house" @click="clearError({ redirect: '/' })" />
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'
import { id } from '@nuxt/ui/locale'

const props = defineProps<{ error: NuxtError }>()

const kode = computed(() => props.error.statusCode)
const judul = computed(() => {
  if (kode.value === 404) return 'Halaman tidak ditemukan'
  if (kode.value === 403) return 'Akses ditolak'
  return 'Terjadi kesalahan'
})
const pesan = computed(() => {
  if (kode.value === 404) return 'Alamat yang Anda buka tidak tersedia atau sudah dipindahkan.'
  if (kode.value === 403) return 'Anda tidak memiliki hak akses ke halaman ini.'
  // Jangan tampilkan detail teknis ke pengguna.
  return 'Terjadi kesalahan tak terduga. Silakan coba lagi nanti.'
})
const ikon = computed(() => (kode.value === 404 ? 'i-lucide-search-x' : 'i-lucide-triangle-alert'))
</script>

<template>
  <slot v-if="diizinkan" />
  <slot v-else name="ditolak" />
</template>

<script setup lang="ts">
// Menampilkan isi hanya bila pengguna punya salah satu kode hak akses.
// Hanya kenyamanan UI; back-end tetap penentu akhir.
const props = defineProps<{ permissions: string[] }>()
const { punya } = usePermission()
const diizinkan = computed(() => punya(props.permissions))
</script>

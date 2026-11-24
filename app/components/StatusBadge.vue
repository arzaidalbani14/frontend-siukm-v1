<template>
  <UBadge :color="tampilan.warna" variant="subtle" :label="tampilan.label" />
</template>

<script setup lang="ts">
const props = defineProps<{ status: string | null | undefined }>()
const tampilan = computed(() => tampilanStatus(props.status))
</script>

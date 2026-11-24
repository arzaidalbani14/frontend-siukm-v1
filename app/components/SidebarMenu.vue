<template>
  <nav aria-label="Menu utama" class="flex flex-col gap-1">
    <NuxtLink
      v-for="m in item"
      :key="m.to"
      :to="m.to"
      class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-default hover:bg-elevated"
      active-class="bg-elevated text-primary"
      exact-active-class="bg-elevated text-primary"
      @click="emit('pilih')"
    >
      <UIcon :name="m.ikon" class="size-5 shrink-0" />
      {{ m.label }}
    </NuxtLink>
    <p v-if="item.length === 0" class="px-3 py-2 text-sm text-muted">
      Belum ada menu yang tersedia.
    </p>
  </nav>
</template>

<script setup lang="ts">
import type { ItemMenu } from '~/utils/navigasi'

defineProps<{ item: ItemMenu[] }>()
const emit = defineEmits<{ pilih: [] }>()
</script>

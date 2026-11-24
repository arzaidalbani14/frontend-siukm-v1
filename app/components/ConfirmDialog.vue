<template>
  <UModal
    :open="state.terbuka"
    :title="state.judul"
    :description="state.pesan || undefined"
    :dismissible="false"
    :close="false"
  >
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton color="neutral" variant="outline" :label="state.labelBatal" @click="jawab(false)" />
        <UButton
          :color="state.jenis === 'bahaya' ? 'error' : 'primary'"
          :label="state.labelYa"
          @click="jawab(true)"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
// Dipasang sekali di app.vue. Dipanggil lewat useConfirm().konfirmasi(...).
const { state, jawab } = useConfirm()
</script>

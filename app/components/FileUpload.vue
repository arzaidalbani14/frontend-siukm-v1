<template>
  <div class="space-y-2">
    <input
      ref="input"
      type="file"
      class="hidden"
      :accept="ACCEPT_BUKTI"
      :disabled="disabled"
      @change="saatPilih"
    >
    <div class="flex flex-wrap items-center gap-2">
      <UButton
        type="button"
        color="neutral"
        variant="outline"
        icon="i-lucide-paperclip"
        :label="modelValue ? 'Ganti berkas' : 'Pilih berkas'"
        :disabled="disabled"
        @click="input?.click()"
      />
      <UButton
        v-if="modelValue"
        type="button"
        color="neutral"
        variant="ghost"
        icon="i-lucide-x"
        label="Hapus"
        :disabled="disabled"
        @click="kosongkan"
      />
    </div>
    <p v-if="modelValue" class="text-sm text-default break-all">
      {{ modelValue.name }} <span class="text-muted">({{ formatUkuranBerkas(modelValue.size) }})</span>
    </p>
    <p v-else class="text-xs text-muted">
      Format JPG, PNG, atau PDF. Maksimal 5 MB. Di ponsel Anda dapat memotret langsung.
    </p>
    <p v-if="galatLokal || error" class="text-sm text-error" role="alert">
      {{ galatLokal || error }}
    </p>
  </div>
</template>

<script setup lang="ts">
// Validasi klien hanya kenyamanan; back-end tetap penentu akhir (maks 5 MB, JPG/PNG/PDF).
defineProps<{
  modelValue: File | null
  error?: string
  disabled?: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [File | null] }>()

const input = ref<HTMLInputElement | null>(null)
const galatLokal = ref('')

function saatPilih(e: Event) {
  const berkas = (e.target as HTMLInputElement).files?.[0]
  if (!berkas) return
  const galat = validasiBukti(berkas)
  galatLokal.value = galat ?? ''
  emit('update:modelValue', galat ? null : berkas)
  if (galat && input.value) input.value.value = ''
}

function kosongkan() {
  galatLokal.value = ''
  if (input.value) input.value.value = ''
  emit('update:modelValue', null)
}
</script>

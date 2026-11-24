<template>
  <UFormField
    :name="name"
    :label="label"
    :help="help"
    :error="error || undefined"
    :required="required"
  >
    <slot />
  </UFormField>
</template>

<script setup lang="ts">
// Label, petunjuk, dan pesan galat tepat di bawah field (KNF-01).
defineProps<{
  name: string
  label: string
  help?: string
  error?: string
  required?: boolean
}>()
</script>

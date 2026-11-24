<template>
  <UApp :locale="id">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ConfirmDialog />
  </UApp>
</template>

<script setup lang="ts">
import { id } from '@nuxt/ui/locale'

const config = useRuntimeConfig()

useHead({
  htmlAttrs: { lang: 'id' },
  titleTemplate: judul => (judul ? `${judul} | ${config.public.appName}` : config.public.appName)
})
</script>

<template>
  <div class="min-h-dvh flex flex-col bg-default">
    <header class="sticky top-0 z-30 flex items-center gap-3 border-b border-default bg-default px-4 h-14">
      <UButton
        class="lg:hidden"
        icon="i-lucide-menu"
        color="neutral"
        variant="ghost"
        aria-label="Buka menu"
        @click="menuTerbuka = true"
      />
      <NuxtLink to="/" class="font-semibold text-highlighted">
        {{ config.public.appName }}
      </NuxtLink>
      <div class="ml-auto flex items-center gap-2">
        <div class="hidden sm:block text-right leading-tight">
          <p class="text-sm font-medium text-highlighted">
            {{ auth.pengguna?.nama ?? auth.pengguna?.email }}
          </p>
          <p v-if="auth.pengguna?.peran" class="text-xs text-muted">
            {{ auth.pengguna.peran }}
          </p>
        </div>
        <UButton
          icon="i-lucide-log-out"
          color="neutral"
          variant="outline"
          label="Keluar"
          :loading="sedangKeluar"
          @click="keluar"
        />
      </div>
    </header>

    <div class="flex flex-1">
      <aside class="hidden lg:block w-60 shrink-0 border-r border-default p-3">
        <SidebarMenu :item="menu" />
      </aside>
      <main class="flex-1 min-w-0 p-4 sm:p-6">
        <slot />
      </main>
    </div>

    <USlideover v-model:open="menuTerbuka" side="left" title="Menu" description="Navigasi aplikasi">
      <template #body>
        <SidebarMenu :item="menu" @pilih="menuTerbuka = false" />
      </template>
    </USlideover>

    <UModal :open="peringatan" :dismissible="false" :close="false" title="Sesi hampir berakhir">
      <template #body>
        <p class="text-sm text-default">
          Anda tidak aktif cukup lama. Demi keamanan, Anda akan keluar otomatis dalam
          <strong>{{ sisaMenit }}</strong>.
        </p>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton color="neutral" variant="outline" label="Keluar sekarang" @click="keluar" />
          <UButton label="Tetap masuk" @click="tetapMasuk" />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const auth = useAuthStore()
const route = useRoute()
const { peringatan, sisaDetik, tetapMasuk } = useIdleLogout()

const menuTerbuka = ref(false)
const sedangKeluar = ref(false)
const menu = computed(() => menuUntuk(auth.hakAkses))

const sisaMenit = computed(() => {
  const m = Math.floor(sisaDetik.value / 60)
  const d = sisaDetik.value % 60
  return `${m} menit ${String(d).padStart(2, '0')} detik`
})

watch(() => route.fullPath, () => {
  menuTerbuka.value = false
})

async function keluar() {
  sedangKeluar.value = true
  await auth.logout()
}
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold text-highlighted">
        Masuk
      </h2>
      <p class="text-sm text-muted">
        Gunakan email dan kata sandi akun Anda.
      </p>
    </template>

    <UAlert
      v-if="infoSesi"
      class="mb-4"
      color="warning"
      variant="subtle"
      icon="i-lucide-clock"
      :description="infoSesi"
    />
    <UAlert
      v-if="galatUmum"
      class="mb-4"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      :description="galatUmum"
    />

    <UForm ref="form" :schema="skema" :state="state" class="space-y-4" @submit="kirim">
      <FormField name="email" label="Email" required :error="galatServer.email">
        <UInput
          v-model="state.email"
          type="email"
          autocomplete="email"
          inputmode="email"
          placeholder="nama@contoh.ac.id"
          class="w-full"
        />
      </FormField>
      <FormField name="kata_sandi" label="Kata sandi" required :error="galatServer.kata_sandi">
        <UInput
          v-model="state.kata_sandi"
          :type="tampilSandi ? 'text' : 'password'"
          autocomplete="current-password"
          placeholder="Masukkan kata sandi"
          class="w-full"
        >
          <template #trailing>
            <UButton
              type="button"
              color="neutral"
              variant="link"
              size="sm"
              :icon="tampilSandi ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="tampilSandi ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
              @click="tampilSandi = !tampilSandi"
            />
          </template>
        </UInput>
      </FormField>
      <UButton type="submit" block label="Masuk" :loading="memuat" />
    </UForm>
    <!-- TODO (Sprint 1, KF-02.1): tautan ke /daftar setelah halaman registrasi dibuat -->
  </UCard>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ layout: 'auth' })
useHead({ title: 'Masuk' })

const skema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  kata_sandi: z.string().min(1, 'Kata sandi wajib diisi')
})
type Isian = z.output<typeof skema>

const auth = useAuthStore()
const route = useRoute()

const state = reactive<Isian>({ email: '', kata_sandi: '' })
const memuat = ref(false)
const tampilSandi = ref(false)
const galatUmum = ref('')
const galatServer = ref<Record<string, string>>({})

const infoSesi = computed(() => {
  if (route.query.sesi === 'berakhir') return 'Sesi Anda berakhir. Silakan masuk kembali.'
  if (route.query.sesi === 'tidak-aktif') return 'Anda keluar otomatis karena tidak aktif selama 1 jam.'
  return ''
})

async function kirim(_e: FormSubmitEvent<Isian>) {
  memuat.value = true
  galatUmum.value = ''
  galatServer.value = {}
  try {
    await auth.login({ email: state.email.trim(), kata_sandi: state.kata_sandi })
    await navigateTo(amankanRedirect(route.query.redirect))
  } catch (e) {
    if (!isApiError(e)) {
      galatUmum.value = 'Terjadi kesalahan tak terduga. Silakan coba lagi.'
      return
    }
    // KF-01.3: tampilkan pesan back-end apa adanya (tidak menyebut bagian kredensial yang salah).
    galatServer.value = e.galat
    if (Object.keys(e.galat).length === 0 || e.status !== 400) galatUmum.value = e.message
  } finally {
    memuat.value = false
  }
}
</script>

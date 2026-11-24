import { useIdle, useIntervalFn } from '@vueuse/core'

const BATAS_TIDAK_AKTIF_MS = 60 * 60 * 1000 // 1 jam (keputusan Sprint 0)
const PERINGATAN_SEBELUM_MS = 5 * 60 * 1000 // peringatan 5 menit sebelum logout

/**
 * Peringatan idle lalu logout otomatis setelah 1 jam tanpa aktivitas.
 * Aktivitas apa pun (termasuk menekan "Tetap masuk") mereset timer.
 * Setiap 401 tetap menutup sesi di plugin api, apa pun status timer ini.
 */
export function useIdleLogout() {
  const auth = useAuthStore()
  const { idle, lastActive, reset } = useIdle(BATAS_TIDAK_AKTIF_MS - PERINGATAN_SEBELUM_MS)
  const sisaDetik = ref(Math.floor(PERINGATAN_SEBELUM_MS / 1000))
  const peringatan = computed(() => idle.value && auth.sudahLogin)

  useIntervalFn(() => {
    if (!idle.value) {
      sisaDetik.value = Math.floor(PERINGATAN_SEBELUM_MS / 1000)
      return
    }
    const berlalu = Date.now() - lastActive.value
    const sisa = Math.ceil((BATAS_TIDAK_AKTIF_MS - berlalu) / 1000)
    sisaDetik.value = Math.max(sisa, 0)
    if (sisa <= 0 && auth.sudahLogin) {
      auth.bersihkanSesi()
      keHalamanLogin('tidak-aktif')
    }
  }, 1000)

  /** Dipanggil tombol "Tetap masuk". */
  function tetapMasuk() {
    reset()
  }

  return { peringatan, sisaDetik, tetapMasuk }
}

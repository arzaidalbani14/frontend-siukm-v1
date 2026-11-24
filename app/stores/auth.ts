import { authApi } from '~/api/auth'
import { normalisasiSesi, type LoginRequest, type Sesi } from '~/api/contract'

const MASA_TOKEN_DETIK = 60 * 60 // 1 jam (keputusan Sprint 0)

export const useAuthStore = defineStore('auth', () => {
  // Cookie terbaca JavaScript: cegah XSS dengan disiplin (CLAUDE.md bagian 7.1 dan 11).
  const token = useCookie<string | null>('siukm_token', {
    maxAge: MASA_TOKEN_DETIK,
    sameSite: 'strict',
    secure: !import.meta.dev,
    default: () => null
  })
  const pengguna = ref<Sesi['pengguna'] | null>(null)
  const hakAkses = ref<string[]>([])
  const sesiDimuat = ref(false)

  const sudahLogin = computed(() => !!token.value)

  function terapkanSesi(sesi: Sesi) {
    if (sesi.token) token.value = sesi.token
    pengguna.value = sesi.pengguna
    hakAkses.value = sesi.hakAkses
    sesiDimuat.value = true
  }

  function setToken(nilai: string) {
    token.value = nilai
  }

  async function login(body: LoginRequest) {
    const { data } = await authApi.login(body)
    terapkanSesi(normalisasiSesi(data))
  }

  /** Memulihkan data pengguna dan hak akses dari token yang ada (mis. setelah refresh). */
  async function muatSesi() {
    if (!token.value || sesiDimuat.value) return
    const { data } = await authApi.me()
    terapkanSesi(normalisasiSesi(data))
  }

  function bersihkanSesi() {
    token.value = null
    pengguna.value = null
    hakAkses.value = []
    sesiDimuat.value = false
  }

  /** Logout: panggil API, hapus token, lalu muat ulang agar seluruh state Pinia bersih. */
  async function logout() {
    try {
      await authApi.logout()
    } catch {
      // Apa pun hasilnya, sesi lokal tetap ditutup (docs/acuan.md bagian 12.5).
    } finally {
      bersihkanSesi()
      keHalamanLogin()
    }
  }

  return { token, pengguna, hakAkses, sesiDimuat, sudahLogin, setToken, login, muatSesi, bersihkanSesi, logout }
})

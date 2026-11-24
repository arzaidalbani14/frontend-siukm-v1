// Membaca `definePageMeta({ permissions: ['KODE'] })` (salah satu kode cukup).
// Dibuat global (.global) agar tidak ada halaman yang lupa memasangnya; berjalan setelah auth.global.
// Menyembunyikan menu bukan keamanan: back-end tetap penentu akhir.
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  if (!auth.sudahLogin) return // ditangani auth.global

  const alihan = tentukanAlihan({
    path: to.path,
    sudahLogin: true,
    hakAkses: auth.hakAkses,
    dibutuhkan: to.meta.permissions
  })
  // Pengalihan login/beranda sudah diurus auth.global; di sini hanya 403.
  if (alihan === HALAMAN_AKSES_DITOLAK) return navigateTo(HALAMAN_AKSES_DITOLAK)
})

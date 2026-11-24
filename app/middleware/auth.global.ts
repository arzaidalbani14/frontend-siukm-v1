// Wajib login kecuali halaman publik (/login, /daftar). KF-01, KF-15.2.
export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  // Setelah refresh, token masih ada di cookie tetapi data pengguna/hak akses perlu dimuat ulang.
  if (auth.sudahLogin && !auth.sesiDimuat) {
    try {
      await auth.muatSesi()
    } catch {
      // 401 sudah ditangani plugin api (hapus sesi + ke /login). Galat lain: anggap belum login.
      auth.bersihkanSesi()
    }
  }

  const alihan = tentukanAlihan({
    path: to.path,
    sudahLogin: auth.sudahLogin,
    hakAkses: auth.hakAkses,
    // Pemeriksaan hak dilakukan di permission.global.ts
    dibutuhkan: null
  })
  if (alihan) {
    const query = alihan === '/login' && to.path !== '/' ? { redirect: to.fullPath } : undefined
    return navigateTo({ path: alihan, query })
  }
})

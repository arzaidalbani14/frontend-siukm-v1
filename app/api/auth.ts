import type { LoginRequest, LoginRespons, MeRespons } from './contract'

// Endpoint auth (KF-01, KF-02). Komponen/halaman memanggil lewat modul ini, bukan $fetch langsung.
export const authApi = {
  login: (body: LoginRequest) =>
    useNuxtApp().$api<LoginRespons>('/auth/login', {
      method: 'POST',
      body,
      tanpaAlihan401: true // 401 di sini = kredensial salah, bukan sesi berakhir
    }),

  logout: () =>
    useNuxtApp().$api<null>('/auth/logout', { method: 'POST', tanpaAlihan401: true, senyap: true }),

  me: () => useNuxtApp().$api<MeRespons>('/auth/me')
}

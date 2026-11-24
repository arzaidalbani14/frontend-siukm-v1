// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: false },
  devServer: { port: 3001 },
  modules: ['@nuxt/ui', '@pinia/nuxt', '@vueuse/nuxt', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      // Semua NUXT_PUBLIC_* terlihat publik: jangan isi rahasia (bagian 11 CLAUDE.md).
      apiBase: '/api/v1',
      // TBD-7: nama UKM diambil dari konfigurasi, tidak di-hardcode.
      appName: 'Siukm',
      appSubtitle: 'Sistem Informasi Manajemen Komunitas UKM'
    }
  },
  // Proxy hanya untuk dev (produksi: Nginx meneruskan /api/). Terbukti jalan di nitropack 2.14;
  // `as never` karena tipe NitroConfig yang di-resolve Nuxt belum memuat `devProxy`.
  nitro: {
    devProxy: {
      '/api': {
        target: `${process.env.NUXT_DEV_API_TARGET ?? 'http://localhost:3000'}/api`,
        changeOrigin: true
      }
    }
  } as never,
  typescript: { strict: true }
})

# Siukm Front-end

Front-end **Siukm** (Sistem Informasi Manajemen Komunitas UKM Berbasis Web): SPA statis Nuxt 4 yang disajikan Nginx. Back-end ada di repositori terpisah (`sim-ukm`).

Acuan kerja: [CLAUDE.md](CLAUDE.md) dan [docs/acuan.md](docs/acuan.md).

## Versi terpasang

| Paket | Versi |
|---|---|
| Node.js (dipakai saat scaffold) | 24.13 (minimal 20 LTS) |
| nuxt | 4.5.2 |
| @nuxt/ui | 4.13.1 (Tailwind CSS 4.3.5) |
| pinia / @pinia/nuxt | 4.1.0 / 1.0.3 |
| @vueuse/nuxt | 15.1.0 |
| zod | 4.6.7 |
| typescript | 5.9.3 (strict) |
| vitest | 5.1.1 |
| eslint / @nuxt/eslint | 9.39.5 / 1.17.0 |

Chart.js dan `vue-chartjs` belum dipasang; ditambahkan di Sprint 3 saat grafik dibutuhkan.

## Instalasi dan perintah

```bash
npm install
cp .env.example .env     # sesuaikan bila perlu
npm run dev              # http://localhost:3001 (port 3000 dipakai back-end)
npm run lint
npm run typecheck
npm run test             # Vitest, logika murni
npm run generate         # build statis -> .output/public
npm run preview          # cek hasil generate secara lokal
```

Back-end lokal harus berjalan di `http://localhost:3000` (cek `GET /api/v1/health`).

## Variabel lingkungan

| Variabel | Fungsi | Bawaan |
|---|---|---|
| `NUXT_PUBLIC_API_BASE` | Basis URL API (relatif) | `/api/v1` |
| `NUXT_DEV_API_TARGET` | Target proxy saat dev | `http://localhost:3000` |
| `NUXT_PUBLIC_APP_NAME` | Nama UKM di header/judul (TBD-7) | `Siukm` |

Semua `NUXT_PUBLIC_*` terlihat publik: jangan isi rahasia. `.env` tidak di-commit.

Saat dev, request `/api/*` diteruskan oleh proxy Nuxt ke back-end (tanpa CORS). Bila browser mengakses back-end langsung, samakan `CORS_ORIGIN` back-end dengan `http://localhost:3001`.

## Build statis dan deploy (Nginx)

```bash
npm run generate
# salin isi .output/public ke root Nginx, mis. /var/www/siukm/public
```

Nginx: teruskan `/api/` ke Express (`127.0.0.1:3000`), `/` memakai `try_files $uri $uri/ /index.html` (fallback SPA), `client_max_body_size 6m`, TLS aktif. Contoh konfigurasi: [docs/acuan.md](docs/acuan.md) bagian 16.2 (sketsa, uji saat deploy). Penyedia hosting masih TBD-2; jangan hardcode domain.

## Struktur singkat

```
app/api/        modul API per domain + contract.ts (semua asumsi kontrak)
app/plugins/    api.ts ($fetch kustom: token, envelope, pemetaan galat, 401/403)
app/stores/     auth.ts (token via useCookie 1 jam, hak akses)
app/middleware/ auth.global.ts, permission.global.ts
app/utils/      format, galat, berkas, izin, status, navigasi (logika murni, diuji)
shared/types/   envelope respons API
tests/unit/     Vitest
```

## Status

Fondasi (tugas awal CLAUDE.md bagian 17) selesai: scaffold, lapisan API, auth, layout, komponen bersama, halaman `/login`, `/akses-ditolak`, dan kerangka `/`. Sprint 1 menunggu penutupan celah kontrak (lihat komentar `// ASUMSI:` di `app/api/contract.ts`).

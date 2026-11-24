# CLAUDE.md - Siukm (FRONT-END)

Acuan utama untuk Claude Code pada **front-end** aplikasi **Siukm** (Sistem Informasi Manajemen Komunitas UKM Berbasis Web).
Baca file ini sepenuhnya sebelum menulis kode. Jika instruksi pengguna bertentangan dengan file ini, tanyakan dulu.

Bahasa komunikasi dengan pengguna: **Bahasa Indonesia**. Seluruh teks UI, pesan galat, label, dan placeholder: **Bahasa Indonesia**. Identifier kode (variabel, fungsi, composable) memakai `camelCase`; komponen `PascalCase`; route dan nama berkas halaman memakai Bahasa Indonesia `kebab-case`. Nama field data mengikuti kontrak API back-end (Indonesia `snake_case`), jangan diterjemahkan ulang.

Repositori ini **hanya front-end**. Back-end ada di repositori terpisah (`sim-ukm`) dan sudah disiapkan. Jangan menulis atau mengubah kode back-end dari sini.

---

## 1. Ringkasan Proyek

Aplikasi web untuk mendigitalisasi administrasi Unit Kegiatan Mahasiswa (UKM): keanggotaan, kegiatan, presensi, dan kas iuran. Metode: **Scrum, 3 Sprint x 2 pekan**. Fitur prioritas **Tinggi** selesai sebelum **Sedang**.

Tiga modul:
1. **Autentikasi & Keanggotaan**: login/logout, registrasi, data induk anggota, RBAC (KF-01, 02, 03, 15)
2. **Kegiatan & Presensi**: jadwal, pengumuman, self check-in, rekap (KF-04, 05, 06, 07)
3. **Keuangan & Pelaporan**: kategori/periode iuran, tagihan, transaksi + bukti, laporan, dashboard, ekspor (KF-08 s.d. KF-14)

Pengguna: **Admin/Pengurus**, **Bendahara**, **Anggota** (mayoritas lewat smartphone), dan **Calon Anggota** (publik, hanya login dan registrasi).

Dokumen sumber ada di `docs/`:
- `Siukm_Acuan_Terpadu_Backend_Frontend.md` (**rujukan utama lintas back-end dan front-end**)
- `kelompok_7_SRS.pdf`, `use-case.puml`, `activity-diagram.puml`, `ClassDiagram_SIM_UKM_Kelompok7.puml`, `CommunicationDiagram_SIM_UKM_Kelompok7.puml`
- `CLAUDE.backend.md` (salinan CLAUDE.md back-end, sumber kontrak API)

Rujuk kode **KF-xx / KNF-xx** di komentar commit dan nama test agar traceable.

---

## 2. Tech Stack

| Kebutuhan | Pilihan |
|---|---|
| Framework | **Nuxt 4** (Vue 3), Node.js 20 LTS atau lebih baru |
| Mode render | **SPA statis**: `ssr: false`, build dengan `nuxt generate`, disajikan Nginx |
| Bahasa | **TypeScript** (strict) |
| UI | **Nuxt UI** + Tailwind CSS (pakai versi yang kompatibel dengan Nuxt 4) |
| State | Pinia (`@pinia/nuxt`) |
| HTTP | `$fetch` kustom lewat plugin + wrapper `useFetch` |
| Validasi form | Zod |
| Grafik | Chart.js + `vue-chartjs`, dimuat lazy |
| Utilitas | VueUse (`@vueuse/nuxt`) |
| Format Rupiah/tanggal | `Intl` bawaan (`id-ID`, `IDR`, `Asia/Jakarta`), tanpa library tanggal tambahan kecuali benar-benar perlu |
| Lint/test | `@nuxt/eslint`, Vitest (logika murni); Playwright opsional |
| VCS | Git |

**Penting soal versi:** API Nuxt 4 dan Nuxt UI berubah antar-versi (nama komponen, prop, struktur folder `app/`). Saat ragu, **cek dokumentasi resmi versi yang terpasang** (atau `package.json`), jangan menebak dari ingatan. Pasang versi stabil terbaru yang saling kompatibel dan catat versinya di README.

Dilarang: payment gateway, integrasi SIAKAD, aplikasi mobile native, SSR (kecuali pengguna memutuskan lain), library UI kedua yang tumpang tindih dengan Nuxt UI, dependensi besar tanpa bertanya.

---

## 3. Keputusan yang Berlaku

### 3.1 Keputusan Sprint 0 (FINAL, berdampak ke UI)

| Item | Keputusan | Dampak di front-end |
|---|---|---|
| Registrasi mandiri | Status awal langsung `AKTIF` | Setelah sukses, tampilkan konfirmasi lalu arahkan ke login. **Tidak ada** pesan "menunggu verifikasi". |
| Bukti pembayaran | Maks **5 MB**, JPG/PNG/PDF | Validasi klien di `FileUpload` |
| Notifikasi | Hanya dalam aplikasi, **tanpa email** | Jangan tampilkan opsi/teks notifikasi email |
| Sesi tidak aktif | **1 jam** | Peringatan idle dan logout otomatis |
| Target pengguna | Hingga 50 bersamaan | Tidak perlu optimasi ekstrem, cukup lazy-load dan paginasi |

### 3.2 Item terbuka (JANGAN diasumsikan atau dibangun, tanyakan pengguna)

- **Verifikasi pendaftaran oleh Admin (KF-02.4)**: karena registrasi langsung `AKTIF`, nasibnya belum diputuskan. **Jangan membuat halaman atau menu verifikasi/penolakan pendaftaran.**
- **Notifikasi dalam aplikasi**: skema back-end belum punya tabel notifikasi. **Jangan membuat panel/lonceng notifikasi.** Untuk sekarang pakai **toast** saja. Beri komentar `// TODO: panel notifikasi menunggu tabel notifikasi back-end`.
- **`ANGGOTA_LIHAT` untuk Bendahara**: hak akses ini belum ada di seed back-end. Jangan membuat halaman daftar anggota yang bergantung padanya untuk Bendahara sampai back-end siap.
- **Koreksi transaksi**: belum ada mekanisme yang disetujui. **Jangan membuat tombol hapus/ubah transaksi.**
- **TBD-2** (hosting) dan **TBD-7** (nama UKM): jangan hardcode nama UKM, domain, atau logo; ambil dari konfigurasi.
- **Wireframe/mockup**: belum diketahui. Jika belum ada, tanyakan atau usulkan rancangan halaman dulu sebelum membangun halaman kompleks.

---

## 4. Struktur Repositori

```
siukm-frontend/
├── CLAUDE.md
├── README.md                  # instalasi, build statis, deploy (Nginx)
├── nuxt.config.ts
├── package.json
├── .env.example               # .env tidak di-commit
├── docs/                      # SRS, diagram, dokumen acuan terpadu, CLAUDE.backend.md
├── app/
│   ├── app.vue
│   ├── error.vue              # tampilan galat/403/404
│   ├── assets/css/main.css
│   ├── api/                   # satu berkas per modul + contract.ts (asumsi kontrak)
│   │   ├── contract.ts
│   │   ├── auth.ts  anggota.ts  kegiatan.ts  presensi.ts
│   │   └── iuran.ts  laporan.ts  dashboard.ts
│   ├── components/            # DataTable, FormField, ConfirmDialog, FileUpload,
│   │                          # StatCard, ChartCard, StatusBadge, PermissionGate, ...
│   ├── composables/           # useApi, useConfirm, useIdleLogout, useFormat, usePermission
│   ├── layouts/
│   │   ├── auth.vue           # login, registrasi
│   │   └── default.vue        # header + sidebar dinamis
│   ├── middleware/
│   │   ├── auth.global.ts     # wajib login kecuali halaman publik
│   │   └── permission.ts      # cek kode hak akses dari definePageMeta
│   ├── pages/                 # lihat bagian 9
│   ├── plugins/api.ts         # $fetch kustom
│   ├── stores/auth.ts
│   └── utils/                 # format, validator berkas, pemeta galat
├── shared/types/              # tipe entitas dan envelope respons API
├── tests/
└── public/
```

Pola alur data: `halaman -> composable/API module -> plugin $fetch -> back-end`. Halaman tipis; logika format, validasi, dan pemetaan galat di `utils/` dan `composables/`. Komponen tidak memanggil `$fetch` langsung; lewat modul di `app/api/`.

---

## 5. Perintah Umum

```bash
npm install
npm run dev          # http://localhost:3001 (port 3000 dipakai back-end)
npm run lint
npm run test         # Vitest
npm run generate     # build statis -> .output/public
npm run preview      # cek hasil generate secara lokal
```

Back-end lokal (di repo lain): `http://localhost:3000`, cek `GET /api/v1/health`.

Environment (`.env` di root, jangan di-commit; sediakan `.env.example`):
```
NUXT_PUBLIC_API_BASE=/api/v1
NUXT_DEV_API_TARGET=http://localhost:3000
```

Konfigurasi dasar `nuxt.config.ts` (sketsa, sesuaikan dengan versi terpasang):
```ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devServer: { port: 3001 },
  runtimeConfig: { public: { apiBase: '/api/v1' } },
  nitro: {
    devProxy: { '/api': { target: 'http://localhost:3000/api', changeOrigin: true } }
  },
  modules: ['@nuxt/ui', '@pinia/nuxt', '@vueuse/nuxt', '@nuxt/eslint']
})
```

- `base URL` API **relatif** (`/api/v1`). Saat dev diteruskan oleh proxy Nuxt (tanpa CORS); di produksi Nginx meneruskan `/api/` ke Express pada domain yang sama.
- Jika browser pernah diarahkan langsung ke `localhost:3000`, `CORS_ORIGIN` back-end (default `http://localhost:5173`) harus disamakan dengan origin Nuxt. Jangan mengubah back-end dari sini; beri tahu pengguna.

---

## 6. Kontrak API (dari back-end, lihat `docs/CLAUDE.backend.md` bagian 9)

- Prefix `/api/v1`. JSON; unggah `multipart/form-data`.
- Respons sukses: `{ "sukses": true, "data": ..., "meta": {...} }`
- Respons galat: `{ "sukses": false, "pesan": "...", "galat": [{ "field": "email", "pesan": "..." }] }`
- Paginasi: `?page=1&limit=20`. Cari/filter anggota: `?q=nama&status=AKTIF`.

### Penanganan kode status (di plugin `api.ts`)

| Kode | Penanganan |
|---|---|
| 200/201 | Buka envelope, kembalikan `data` dan `meta`; toast sukses bila relevan |
| 400 | Petakan `galat[]` menjadi `{ field: pesan }` untuk error di bawah field |
| 401 | Hapus sesi, arahkan ke `/login` dengan pesan "sesi berakhir" |
| 403 | Tampilkan halaman `/akses-ditolak` |
| 404 | Tampilkan pesan tidak ditemukan |
| 409 | Duplikat (mis. presensi ganda, email terdaftar): toast peringatan atau error field email |
| 422 | Aturan bisnis (mis. nominal melebihi sisa tagihan): error di dekat field terkait atau banner formulir |
| 429 | Rate limit login/registrasi: pesan "coba lagi beberapa saat" |
| 500 | Toast galat umum (jangan tampilkan detail teknis) |

Tampilkan `pesan` dari back-end apa adanya (sudah Bahasa Indonesia). Pesan gagal login **tidak boleh** diubah menjadi pesan yang menyebut bagian kredensial yang salah (KF-01.3).

### Peta endpoint (rancangan awal back-end)

| Modul | Endpoint | Hak | KF |
|---|---|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` | publik / login | 01, 02 |
| Peran | `GET/PUT /pengguna/:id/peran` | `ROLE_KELOLA` | 15 |
| Anggota | `GET/POST /anggota`, `GET/PUT/DELETE /anggota/:id` | `ANGGOTA_KELOLA` | 02.5, 03 |
| Profil | `GET/PUT /profil` | `ANGGOTA_PROFIL` | 03.3 |
| Kegiatan | `GET /kegiatan`, `GET /kegiatan/:id`; `POST/PUT/DELETE` | `KEGIATAN_LIHAT` / `KEGIATAN_KELOLA` | 04 |
| Pengumuman | `GET /pengumuman`; `POST /pengumuman`, `POST /pengumuman/:id/terbitkan` | `PENGUMUMAN_LIHAT` / `PENGUMUMAN_KELOLA` | 05 |
| Presensi | `POST /kegiatan/:id/checkin`; `POST/PUT /kegiatan/:id/presensi` | `PRESENSI_MANDIRI` / `PRESENSI_KELOLA` | 06 |
| Rekap | `GET /rekap/kegiatan/:id`, `GET /rekap/periode?awal=&akhir=` | `PRESENSI_KELOLA` | 07 |
| Iuran | `/kategori-iuran`, `/periode-iuran` (kategori **dinonaktifkan**, bukan dihapus) | `IURAN_KELOLA` | 08 |
| Tagihan | `POST /tagihan` (generate per periode), `GET /tagihan/status` | `IURAN_KELOLA` | 10 |
| Transaksi | `POST /transaksi` (multipart + bukti) | `IURAN_KELOLA` | 09 |
| Pribadi | `GET /iuran/saya` | `IURAN_PRIBADI` | 12 |
| Laporan | `GET /laporan/arus-kas?jenis=bulanan&bulan=&tahun=` | `LAPORAN_KEUANGAN` | 11 |
| Dashboard | `GET /dashboard` | `DASHBOARD` | 13 |
| Ekspor | `GET /ekspor/keuangan?format=pdf\|xlsx`, `GET /ekspor/presensi?format=pdf\|xlsx` | `LAPORAN_KEUANGAN` / `LAPORAN_PRESENSI` | 14 |

### Celah kontrak yang BELUM diketahui (jangan menebak diam-diam)

Bentuk detail (struktur `data` tiap endpoint) belum tertulis di dokumen back-end. Aturan kerja:

1. **Minta pengguna** contoh request/respons nyata (output Swagger/OpenAPI, ringkasan dari Claude Code di repo back-end, atau panggilan ke back-end yang berjalan) sebelum menulis tipe untuk modul terkait.
2. Jika perlu lanjut sebelum kontrak jelas, **tulis asumsi di satu tempat**: `app/api/contract.ts`, setiap asumsi diberi komentar `// ASUMSI: ...`. Jangan menyebar asumsi di komponen atau halaman. Laporkan daftar asumsi ke pengguna di akhir tugas.
3. Tipe di `shared/types/` ditulis dari kontrak nyata, bukan dari class diagram. Nilai enum di class diagram **belum diverifikasi** terhadap `schema.sql`; konfirmasi sebelum dipakai.

Celah yang sudah teridentifikasi:

| Sebelum | Celah |
|---|---|
| Sprint 1 | Isi respons login dan `GET /auth/me` (data pengguna, peran, **daftar kode hak akses**) |
| Sprint 1 | Cara token dikirim (dugaan `Authorization: Bearer`) dan cara **token baru** dikirim saat sliding expiration (header respons seperti `X-New-Token`, atau body) |
| Sprint 1 | Endpoint daftar pengguna dan daftar peran untuk halaman manajemen peran; apakah `GET /anggota` memuat `id_pengguna` |
| Sprint 2 | Cara membaca daftar presensi per kegiatan (peta hanya memuat POST/PUT presensi) |
| Sprint 2 | Endpoint riwayat kehadiran pribadi Anggota (diminta SRS, belum ada di peta) |
| Sprint 3 | Rute endpoint untuk menampilkan bukti pembayaran |
| Sprint 3 | Bentuk `GET /dashboard` per peran, `GET /laporan/arus-kas` (data grafik), daftar tagihan untuk form transaksi |

---

## 7. Autentikasi, Sesi, dan RBAC

### 7.1 Sesi
- JWT berlaku **1 jam** dengan sliding expiration di back-end. Logout = hapus token di klien (juga panggil `POST /auth/logout`).
- Token disimpan lewat `useCookie` (`maxAge` 1 jam, `SameSite=Strict`, `Secure` di produksi). Cookie ini terbaca JavaScript, jadi cegah XSS dengan disiplin (lihat bagian 11).
- `useIdleLogout` (VueUse `useIdle`): tampilkan peringatan sebelum satu jam tanpa aktivitas, lalu logout otomatis. **Setiap 401 selalu menutup sesi** apa pun status timer.
- Logout membersihkan token dan **seluruh state Pinia**.
- Halaman publik hanya `/login` dan `/daftar`. Pengguna yang sudah login dan membuka `/login` diarahkan ke `/`.

### 7.2 RBAC berbasis kode hak akses
Back-end menegakkan RBAC lewat **kode hak akses**; front-end mengikuti kode itu, **bukan nama peran**. Menyembunyikan menu bukan keamanan; back-end tetap penentu akhir.

| Peran | Kode hak akses |
|---|---|
| Admin/Pengurus | `ANGGOTA_KELOLA`, `ROLE_KELOLA`, `KEGIATAN_KELOLA`, `KEGIATAN_LIHAT`, `PENGUMUMAN_KELOLA`, `PENGUMUMAN_LIHAT`, `PRESENSI_KELOLA`, `LAPORAN_PRESENSI`, `DASHBOARD` |
| Bendahara | `IURAN_KELOLA`, `LAPORAN_KEUANGAN`, `DASHBOARD` (+ baca daftar anggota, menunggu `ANGGOTA_LIHAT`) |
| Anggota | `ANGGOTA_PROFIL`, `KEGIATAN_LIHAT`, `PENGUMUMAN_LIHAT`, `PRESENSI_MANDIRI`, `IURAN_PRIBADI`, `DASHBOARD` |

Penerapan:
- Tiap halaman: `definePageMeta({ permissions: ['KODE'] })`. Middleware `permission.ts` membacanya; tidak cocok -> `/akses-ditolak`.
- Sidebar disaring dari daftar hak akses yang sama. `PermissionGate`/`usePermission` untuk tombol aksi.
- Admin tidak punya `LAPORAN_KEUANGAN`; Bendahara tidak punya `LAPORAN_PRESENSI`. Tombol ekspor dipisah sesuai itu.
- Anggota hanya melihat data **miliknya**. **Jangan mengirim `id_anggota` dari klien** untuk fitur pribadi (`/profil`, `/iuran/saya`, check-in); back-end mengambilnya dari token.
- Daftar kode hak akses dibaca dari respons login/`GET /auth/me` (lihat celah kontrak bagian 6).

---

## 8. Aturan Bisnis yang Memengaruhi UI

1. Pengumuman dan kegiatan hanya dibuat Admin/Pengurus.
2. Transaksi iuran hanya dicatat Bendahara. Nominal harus sesuai tagihan; **validasi ditegakkan trigger database (422)**. **Jangan menduplikasi logika ini di front-end**; tampilkan pesan dari back-end.
3. Status `LUNAS`/`SEBAGIAN` diubah otomatis oleh trigger. Front-end **tidak** menghitung atau mengubah status; muat ulang data tagihan setelah transaksi.
4. Satu presensi per anggota per kegiatan. Duplikat -> 409 "Presensi sudah tercatat".
5. Self check-in hanya saat kegiatan berlangsung. Tombol aktif hanya saat itu (kenyamanan UI), tetapi **back-end penentu akhir**; tangani penolakan "sesi presensi belum dibuka atau telah berakhir".
6. Hapus anggota/kegiatan wajib **konfirmasi dialog**. Transaksi **tidak** punya tombol hapus. Kategori iuran **dinonaktifkan**, bukan dihapus.
7. Hanya anggota berstatus `AKTIF` yang mengakses fitur anggota penuh.
8. Perubahan peran hanya oleh Admin.

---

## 9. Peta Halaman

| Route | Isi | Hak akses | KF | Sprint |
|---|---|---|---|---|
| `/login` | Form login | publik | 01 | 1 |
| `/daftar` | Registrasi mandiri (sukses -> login) | publik | 02.1-02.2 | 1 |
| `/` | Dashboard sesuai hak akses | `DASHBOARD` | 13 | 1 (kerangka), 3 (lengkap) |
| `/profil` | Profil pribadi | `ANGGOTA_PROFIL` | 03.3 | 1 |
| `/anggota` | Tabel, cari/filter, hapus dengan konfirmasi | `ANGGOTA_KELOLA` | 03 | 1 |
| `/anggota/tambah` | Form anggota baru | `ANGGOTA_KELOLA` | 02.5 | 1 |
| `/anggota/[id]` | Detail dan ubah | `ANGGOTA_KELOLA` | 03.1 | 1 |
| `/pengaturan/peran` | Atur peran pengguna | `ROLE_KELOLA` | 15 | 1 |
| `/kegiatan` | Daftar/kalender; buat kegiatan (Admin) | `KEGIATAN_LIHAT` / `KEGIATAN_KELOLA` | 04 | 2 |
| `/kegiatan/[id]` | Detail; check-in (Anggota); daftar/koreksi presensi (Admin) | lihat bagian 7 | 04, 06 | 2 |
| `/pengumuman` | Daftar; buat/terbitkan (Admin), penanda draf | `PENGUMUMAN_LIHAT` / `PENGUMUMAN_KELOLA` | 05 | 2 |
| `/presensi/rekap` | Rekap per kegiatan/periode + ekspor presensi | `PRESENSI_KELOLA` / `LAPORAN_PRESENSI` | 07, 14 | 2-3 |
| `/iuran/kategori` | CRUD kategori; **Nonaktifkan** | `IURAN_KELOLA` | 08 | 3 |
| `/iuran/periode` | CRUD periode | `IURAN_KELOLA` | 08 | 3 |
| `/iuran/tagihan` | Generate tagihan per periode; status lunas/menunggak | `IURAN_KELOLA` | 10 | 3 |
| `/iuran/transaksi` | Form transaksi + unggah bukti | `IURAN_KELOLA` | 09 | 3 |
| `/iuran/saya` | Riwayat dan status iuran pribadi | `IURAN_PRIBADI` | 12 | 3 |
| `/laporan/arus-kas` | Laporan bulanan/tahunan, grafik, ekspor keuangan | `LAPORAN_KEUANGAN` | 11, 14 | 3 |
| `/akses-ditolak` | Halaman 403 | login | 15.2 | 1 |

**Tidak dibuat:** halaman verifikasi pendaftaran, panel notifikasi, tombol hapus transaksi/kategori (lihat bagian 3.2 dan 8).

---

## 10. Konvensi UI dan Komponen

### Prinsip (SRS 3.1, KNF-01, KNF-02)
- **Mobile-first.** Self check-in harus minim langkah. Tabel lebar berubah menjadi kartu di layar kecil.
- Layout konsisten: header (logo komunitas, nama pengguna, navigasi) + sidebar modul sesuai hak akses.
- Galat validasi tampil **di dekat field** dengan petunjuk perbaikan.
- Aksi ubah/hapus data penting meminta **konfirmasi** dialog (`ConfirmDialog` + `useConfirm`).
- Bantuan kontekstual: placeholder, tooltip, pesan validasi (SRS 2.6).
- Setiap halaman punya state **memuat**, **kosong**, dan **galat**.

### Komponen bersama
`DataTable` (cari, filter, paginasi dari `meta`, mode kartu), `FormField`, `ConfirmDialog`, `FileUpload` (JPG/PNG/PDF, maks 5 MB, kamera di HP), `StatCard`, `ChartCard` (Chart.js lazy), `StatusBadge` (Lunas/Menunggak/Sebagian/Belum bayar, Hadir/Izin/Sakit/Alpa, Aktif/Nonaktif, Terjadwal/Berlangsung/Selesai/Dibatalkan, Draf/Terbit), `PermissionGate`.

### Berkas
- **Unggah bukti:** validasi tipe dan ukuran di klien hanya untuk kenyamanan; back-end tetap penentu.
- **Tampil bukti:** hanya lewat endpoint terautentikasi. Karena butuh token, ambil sebagai **blob dengan header Authorization**, **bukan** `<img src>` langsung. (Rute endpoint belum diketahui; lihat celah kontrak.)
- **Ekspor PDF/Excel:** unduh sebagai blob dengan token, lalu picu penyimpanan; tampilkan status memuat.

---

## 11. Keamanan Front-end (KNF-03, UU PDP No. 27/2022)

- Tidak memakai `v-html` untuk data dari server. Pakai interpolasi bawaan Vue yang meng-escape.
- Tidak menyimpan data pribadi atau keuangan di `localStorage`/`sessionStorage`. Tidak menulis data pribadi ke `console`.
- Jangan menaruh rahasia, kunci, atau kredensial di kode atau `public` runtimeConfig. Semua `NUXT_PUBLIC_*` terlihat oleh publik.
- Validasi klien tidak menggantikan validasi server.
- Anggota tidak boleh melihat data pribadi atau keuangan anggota lain; jangan buat UI yang mengandalkan id dari klien untuk data pribadi.
- Seluruh komunikasi lewat HTTPS di produksi.

---

## 12. Lokalisasi, Uang, dan Waktu

- Seluruh teks UI dan label dalam **Bahasa Indonesia**.
- Rupiah: `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })`. Kolom uang di database `NUMERIC(14,2)`, kemungkinan dikirim sebagai **string**. **Jangan menghitung uang dengan float di front-end**; sisa tagihan dan total berasal dari back-end.
- Tanggal tampil `DD/MM/YYYY`, zona **Asia/Jakarta (WIB)**. Data `timestamptz` dikonversi saat tampil. Pusatkan di `useFormat` agar konsisten.
- Input nominal: kirim sebagai angka desimal tervalidasi, tanpa pemisah ribuan.

---

## 13. Performa dan Kompatibilitas

- Halaman termuat paling lama **3 detik** pada jaringan normal (KNF-04): lazy-load route (bawaan Nuxt), paginasi, komponen grafik dengan prefix `Lazy`.
- Browser: Chrome 100+, Firefox 100+, Edge 100+, Safari 15+. OS klien: Windows 10+, macOS, Linux, Android 9+, iOS 14+.
- Responsif tanpa aplikasi native.

---

## 14. Pengujian

- Vitest untuk logika murni: format Rupiah dan tanggal WIB, validator berkas (tipe, 5 MB), pemeta `galat[]` ke field, logika guard hak akses.
- Uji manual per peran (Admin, Bendahara, Anggota, publik) memakai akun dari `db/test_data.sql` back-end (minta kredensial dari pengguna; jangan commit).
- Uji lebar HP dan desktop, serta lintas browser.
- Nama test memuat kode KF, mis. `KF-09.2: menampilkan galat 422 di field nominal`.
- Playwright (opsional) untuk alur utama: login, check-in, catat transaksi, ekspor.

---

## 15. Deployment

- `npm run generate` menghasilkan aset statis di `.output/public`, disalin ke root Nginx.
- Nginx: `/api/` diteruskan ke Express (`127.0.0.1:3000`), `/` memakai `try_files $uri $uri/ /index.html` (fallback SPA agar refresh di route dalam tidak 404), `client_max_body_size` sedikit di atas 5 MB (mis. 6m), TLS aktif.
- Contoh konfigurasi Nginx ada di `docs/Siukm_Acuan_Terpadu_Backend_Frontend.md` (Bagian 16.2); itu sketsa yang perlu diuji saat deploy.
- Penyedia hosting masih **TBD-2**; jangan hardcode domain.
- Lengkapi `README.md`: instalasi, variabel lingkungan, build statis, deploy.

---

## 16. Rencana Sprint (front-end)

| Sprint | Cakupan | Prioritas |
|---|---|---|
| **Fondasi** | Scaffold Nuxt 4, plugin API, store auth, layouts, middleware, komponen bersama | (persiapan) |
| **1** | Login/logout, registrasi, guard hak akses, dashboard kerangka, CRUD anggota, profil, manajemen peran | Tinggi |
| **2** | Kegiatan, pengumuman, check-in, kelola presensi, rekap | Tinggi |
| **3** | Kategori/periode, generate tagihan, transaksi + bukti, tunggakan, iuran pribadi, laporan, dashboard lengkap, ekspor | Tinggi lalu Sedang |
| **Penutup** | Uji lintas browser, build produksi, README deployment | |

Selesaikan prioritas Tinggi sebelum Sedang.

---

## 17. Tugas Awal untuk Claude Code (urutan inisialisasi)

Kerjakan berurutan, **berhenti dan laporkan** di akhir. Jangan lanjut ke halaman modul sebelum fondasi selesai dan pengguna menyetujui.

1. **Periksa konteks:** baca bagian relevan di `docs/`. Jika `docs/` belum berisi dokumen sumber, minta pengguna menyalinnya.
2. **Scaffold** proyek Nuxt 4 (TypeScript strict) di root repo. Pasang modul pada bagian 2 dengan versi yang kompatibel. Catat versi.
3. **Konfigurasi:** `nuxt.config.ts` (SPA, port 3001, `runtimeConfig`, `devProxy`), `.env.example`, `.gitignore` (`.env`, `.nuxt`, `.output`, `node_modules`), ESLint.
4. **Tema dasar:** Nuxt UI, `app.vue`, `error.vue`, `main.css`. Warna netral; jangan hardcode nama UKM atau logo (ambil dari konfigurasi).
5. **Lapisan API:** `plugins/api.ts` (baseURL, header Authorization, pembukaan envelope, pemetaan galat sesuai bagian 6, 401 -> logout), `composables/useApi.ts`, `shared/types/api.ts` (tipe envelope sukses/galat/paginasi), `app/api/contract.ts` (asumsi kontrak, komentar `// ASUMSI:`).
6. **Auth:** `stores/auth.ts` (token via `useCookie`, daftar hak akses, bersihkan state saat logout), `middleware/auth.global.ts`, `middleware/permission.ts`, `composables/usePermission.ts`.
7. **Layouts:** `auth.vue` dan `default.vue` (header + sidebar yang disaring dari hak akses, responsif).
8. **Komponen bersama dasar:** `FormField`, `ConfirmDialog` + `useConfirm`, `StatusBadge`, `DataTable` versi awal, `FileUpload`. Utilitas: `useFormat` (Rupiah, tanggal WIB), pemeta galat, validator berkas, dengan **tes Vitest** untuk bagian logika murni.
9. **Halaman `/login`** dan halaman `/akses-ditolak`. Uji dengan back-end yang berjalan (`/api/v1/health` lalu login). Jika bentuk respons login belum jelas, minta contoh respons nyata; jangan menebak.
10. **README.md** awal (instalasi, perintah, env, port) dan jalankan `npm run lint` serta `npm run test`.
11. **Laporkan:** ringkasan yang selesai, daftar asumsi di `contract.ts`, celah kontrak yang menghambat Sprint 1, dan pertanyaan terbuka.

---

## 18. Konvensi Kerja untuk Claude Code

**Lakukan**
- Baca bagian relevan SRS/diagram/dokumen acuan di `docs/` sebelum membuat fitur; sebut kode KF di commit dan komentar.
- Kerjakan per fitur kecil; jalankan lint dan test sebelum menyatakan selesai.
- Conventional Commits: `feat(presensi): tombol check-in (KF-06.1)`. Satu branch per fitur: `feat/kf-06-presensi`.
- Cek dokumentasi resmi Nuxt/Nuxt UI untuk versi terpasang bila ragu.
- Beri tahu pengguna jika menemukan inkonsistensi antara SRS, diagram, skema, kontrak API, dan dokumen ini; jangan diam-diam memilih salah satu.
- Kumpulkan semua asumsi kontrak di `app/api/contract.ts`.

**Jangan**
- Mengubah keputusan di bagian 3 atau stack di bagian 2 tanpa persetujuan eksplisit.
- Membuat halaman/menu verifikasi pendaftaran, panel notifikasi, atau tombol hapus transaksi/kategori.
- Menduplikasi logika bisnis yang sudah di back-end/trigger (validasi nominal, status pembayaran, presensi ganda).
- Menghitung uang dengan float, atau mengirim `id_anggota` dari klien untuk fitur pribadi.
- Menggunakan `v-html` untuk data dari server, atau menyimpan data pribadi/keuangan di storage browser.
- Meng-commit `.env`, kredensial akun uji, atau berkas upload.
- Menambah dependensi besar atau library UI kedua tanpa bertanya.
- Mengubah kode atau skema back-end dari repo ini.
- Menulis teks UI dalam bahasa Inggris.
- Menebak bentuk respons API; minta contoh nyata atau catat sebagai `// ASUMSI:`.

**Saat ragu:** tanyakan, satu pertanyaan ringkas, sertakan rekomendasi Anda.

---

## 19. Daftar Periksa "Selesai" per Fitur

- [ ] Sesuai kebutuhan KF terkait dan aturan bisnis (bagian 8)
- [ ] Guard hak akses benar dan tombol aksi mengikuti kode hak akses
- [ ] State memuat, kosong, dan galat tersedia; galat validasi tampil di dekat field
- [ ] Konfirmasi dialog untuk aksi ubah/hapus penting
- [ ] Teks Bahasa Indonesia; format Rp, tanggal, WIB benar
- [ ] Tidak ada data pribadi atau rahasia di console, storage, atau repo
- [ ] Teruji pada lebar HP dan desktop
- [ ] Lint dan test lulus
- [ ] README dan komentar KF diperbarui bila perlu

# Siukm: Dokumen Acuan Terpadu (Back-end dan Front-end)

| Item | Isi |
|---|---|
| Aplikasi | Siukm (Sistem Informasi Manajemen Komunitas UKM Berbasis Web) |
| Versi dokumen | 1.0 (draf acuan sebelum inisialisasi front-end) |
| Tanggal | 24/11/2026 |
| Sumber | SRS v1.0 (`kelompok_7_SRS.pdf`), `use-case.puml`, `activity-diagram.puml`, `ClassDiagram_SIM_UKM_Kelompok7.puml`, `CommunicationDiagram_SIM_UKM_Kelompok7.puml`, `CLAUDE.md` back-end, `README.md` back-end |

## Legenda status

Setiap keputusan di dokumen ini diberi status agar jelas mana yang boleh dipegang dan mana yang masih harus dikonfirmasi.

| Status | Arti |
|---|---|
| **[FINAL]** | Sudah diputuskan (Sprint 0 atau tertulis tegas di SRS/CLAUDE.md back-end). Jangan diubah tanpa konfirmasi. |
| **[USULAN]** | Rekomendasi untuk front-end. Belum dikonfirmasi pengguna. |
| **[TERBUKA]** | Belum diputuskan atau belum diketahui. Jangan diasumsikan di kode produksi. |
| **[ASUMSI]** | Dugaan sementara agar pekerjaan bisa berjalan. Harus diverifikasi saat integrasi. |

Bila dokumen ini bertentangan dengan `CLAUDE.md` back-end atau `db/schema.sql`, **yang berlaku untuk back-end adalah CLAUDE.md dan schema.sql**. Pertentangan harus dilaporkan, bukan dipilih diam-diam (lihat Bagian 15).

---

## 1. Tujuan dan Cara Memakai Dokumen

Dokumen ini menyatukan seluruh kebutuhan, keputusan, kontrak, dan rancangan untuk dua repositori:

- `sim-ukm` (back-end/API, sudah disiapkan)
- `siukm-frontend` (front-end, akan diinisialisasi)

Kegunaannya:

1. Satu sumber acuan sebelum scaffold front-end.
2. Dasar penulisan `CLAUDE.md` front-end.
3. Daftar celah kontrak API yang harus ditutup sebelum modul terkait dikerjakan (Bagian 15).
4. Matriks keterlacakan KF/KNF ke endpoint dan halaman (Bagian 13).

Pembaca: pengembang back-end, pengembang front-end, penguji, dan Product Owner.

---

## 2. Ringkasan Proyek

### 2.1 Latar belakang

Administrasi UKM masih manual dan tersebar: pengumuman tenggelam di grup chat, presensi dicatat lewat Google Forms atau kertas, dan kas dicatat di buku atau satu spreadsheet. Sistem ini menyatukan semuanya dalam satu aplikasi web dengan satu basis data relasional.

### 2.2 Tujuan

- Sistem terpusat berbasis web untuk keanggotaan dan kegiatan.
- Presensi digital yang cepat, akurat, dan terintegrasi dengan basis data.
- Modul kas yang mencatat iuran, melacak tunggakan, dan menyajikan laporan arus kas secara transparan.

### 2.3 Tiga modul

| Modul | Cakupan | KF |
|---|---|---|
| Autentikasi dan Keanggotaan | Login/logout, registrasi, data induk anggota, RBAC | 01, 02, 03, 15 |
| Kegiatan dan Presensi | Jadwal, pengumuman, self check-in, rekap otomatis | 04, 05, 06, 07 |
| Keuangan dan Pelaporan | Kategori/periode iuran, transaksi + bukti, tunggakan, laporan, dashboard, ekspor | 08 sampai 14 |

### 2.4 Kelas pengguna

| Kelas | Hak akses | Frekuensi | Catatan UI |
|---|---|---|---|
| Admin/Pengurus | Tertinggi pada keanggotaan, kegiatan, presensi, hak akses | Tinggi | Tabel dan formulir yang intuitif |
| Bendahara | Penuh pada modul keuangan, baca daftar anggota | Menengah-Tinggi | Mirip spreadsheet, tidak teknis |
| Anggota | Terbatas, hanya data milik sendiri | Menengah | Mayoritas lewat smartphone, **minim langkah** |
| Calon Anggota | Publik, hanya login dan registrasi | Sangat rendah | Petunjuk pengisian dan pesan validasi jelas |

### 2.5 Metode kerja

Scrum, **3 Sprint x 2 pekan** (6 pekan efektif). Fitur prioritas **Tinggi** selesai sebelum **Sedang**. Semua fitur fungsional berprioritas Tinggi kecuali Laporan/Dashboard/Ekspor (Sedang, Sprint 3).

---

## 3. Keputusan

### 3.1 Keputusan Sprint 0 **[FINAL]**

| Item | Keputusan |
|---|---|
| Status awal registrasi mandiri | Langsung `AKTIF` (menyimpang dari SRS KF-02.3; mengikuti activity/communication diagram) |
| Batas ukuran bukti pembayaran | 5 MB, format JPG/PNG/PDF |
| Notifikasi email | Tidak dipakai, hanya notifikasi dalam aplikasi |
| Batas sesi tidak aktif | 1 jam |
| Frekuensi backup database | Sebulan sekali (ada catatan risiko di Bagian 16.3) |
| Target pengguna bersamaan | Hingga 50 pengguna |

### 3.2 Keputusan front-end

| Item | Keputusan | Status |
|---|---|---|
| Framework | Nuxt 4 (Vue 3) | **[FINAL]** (keputusan pengguna; menggantikan asumsi Vue 3 + Vite di SRS/CLAUDE.md) |
| Mode render | SPA statis (`ssr: false`, `nuxt generate`) | **[USULAN]** |
| Library komponen | Nuxt UI (Tailwind CSS) | **[USULAN]** |
| Bahasa | TypeScript | **[USULAN]** |
| Repo | Terpisah dari back-end (`siukm-frontend`) | **[FINAL]** (README back-end: repo itu hanya API) |
| Wireframe/mockup | Belum diketahui | **[TERBUKA]** |

### 3.3 Item terbuka **[TERBUKA]**

| Kode | Isi |
|---|---|
| TBD-2 | Penyedia dan spesifikasi hosting |
| TBD-7 | Nama UKM studi kasus dan jumlah anggotanya |
| Verifikasi Admin | Karena registrasi langsung `AKTIF`, nasib KF-02.4 (Admin menyetujui/menolak pendaftaran) dan use case "Memverifikasi Pendaftaran Anggota" belum diputuskan. **Back-end tidak boleh membuat endpoint verifikasi/penolakan, dan front-end tidak membuat halamannya, sampai ada keputusan.** Kolom `anggota.diverifikasi_oleh` dan nilai enum `MENUNGGU_VERIFIKASI` tetap ada di skema sebagai cadangan. |
| Tabel notifikasi | SRS (KF-05, Bab 3.4) dan communication diagram mensyaratkan notifikasi dalam aplikasi, tetapi skema belum punya tabelnya. Usulan back-end: `notifikasi(id_notifikasi, id_pengguna, judul, pesan, sudah_dibaca, dibuat_pada)`. Menunggu persetujuan. Sampai ada, front-end hanya memakai toast. |
| `ANGGOTA_LIHAT` | Bendahara perlu membaca daftar anggota (SRS 2.3), tetapi kode hak akses ini belum ada di seed. Perlu migrasi dan persetujuan. |
| Koreksi transaksi | Hard-delete transaksi dihindari. Mekanisme koreksi yang disetujui pengguna belum ada. |

---

## 4. Arsitektur dan Stack

### 4.1 Gambaran arsitektur

```
Peramban (Chrome/Firefox/Edge/Safari, HP atau komputer)
        |  HTTPS (443)
        v
Nginx  ---------------------------------------------+
  |  /          -> aset statis hasil `nuxt generate` |  satu domain,
  |  /api/      -> proxy_pass ke Express (:3000)     |  tanpa CORS
  v                                                  |  di produksi
Express.js (RESTful API, JWT)  <---------------------+
  |  SQL berparameter (pg)
  v
PostgreSQL 15+   +   folder uploads/ (bukti bayar, di luar webroot)
```

Arsitektur tiga lapis sesuai SRS 2.1: antarmuka web, logika aplikasi, basis data relasional.

### 4.2 Stack back-end **[FINAL]**

| Lapisan | Teknologi |
|---|---|
| Runtime | Node.js 20 LTS atau lebih baru |
| Framework | Express.js, RESTful API, JSON |
| Database | PostgreSQL 15+ (diuji lokal pada 16) |
| Auth | JWT (`jsonwebtoken`) + bcrypt |
| Upload | `multer`, `multipart/form-data` |
| Validasi | `zod` atau `joi` |
| Keamanan | `helmet`, `cors`, `express-rate-limit` |
| Ekspor | `exceljs` (Excel), `pdfkit` atau `pdfmake` (PDF) |
| Pengujian | Jest + Supertest, ESLint |
| Web server | Nginx (reverse proxy, TLS), proses Node lewat PM2 atau systemd |

### 4.3 Stack front-end

| Kebutuhan | Pilihan | Status |
|---|---|---|
| Framework | Nuxt 4 (Vue 3), Node 20 LTS | **[FINAL]** |
| Mode | SPA statis | **[USULAN]** |
| UI | Nuxt UI + Tailwind CSS | **[USULAN]** |
| State | Pinia (`@pinia/nuxt`) | **[USULAN]** |
| HTTP | `$fetch` kustom lewat plugin + wrapper `useFetch` | **[USULAN]** |
| Validasi form | Zod | **[USULAN]** |
| Grafik | Chart.js + `vue-chartjs`, dimuat lazy | **[USULAN]** |
| Utilitas | VueUse (idle, dll.) | **[USULAN]** |
| Format Rupiah/tanggal | `Intl` bawaan (`id-ID`, `IDR`, `Asia/Jakarta`) | **[USULAN]** |
| Lint/test | `@nuxt/eslint`, Vitest (logika murni), Playwright opsional | **[USULAN]** |

### 4.4 Alasan SPA statis

SRS 2.4 menyatakan front-end dikompilasi menjadi aset statis yang disajikan Nginx, sementara Express hanya melayani API. Aplikasi berada di balik login dan tidak butuh SEO, sehingga SSR tidak memberi manfaat nyata dan menambah satu proses Node. Dengan `ssr: false`, Nuxt tetap memberi file-based routing, auto-import, layouts, dan middleware.

Bila nanti dipilih SSR, SRS 2.4 dan 2.5 perlu direvisi.

### 4.5 Dilarang **[FINAL]**

Payment gateway, integrasi SIAKAD, aplikasi mobile native, ORM yang mengubah skema otomatis (`sync()` dan sejenisnya).

### 4.6 Catatan penyimpangan dari dokumen sumber

SRS 2.5 dan CLAUDE.md back-end (Bagian 2 dan 12) menyebut Vue.js 3 + Vite + Axios. Nuxt 4 mode SPA statis tetap memenuhi inti syaratnya (Vue 3, build statis, disajikan Nginx, responsif), tetapi bagian tersebut sebaiknya diperbarui supaya dokumen sumber tidak bertentangan dengan implementasi.

---

## 5. Struktur Repositori

### 5.1 Back-end (`sim-ukm`) **[FINAL]**

```
sim-ukm/
├── CLAUDE.md
├── README.md
├── package.json
├── .env.example                # .env tidak di-commit
├── docs/                       # SRS + diagram PlantUML
├── db/
│   ├── schema.sql              # HANYA untuk DB kosong/dev (diawali DROP SCHEMA)
│   ├── test_data.sql           # data uji trigger/constraint
│   └── migrations/             # NNN_deskripsi.sql
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/                 # env, db pool
│   ├── middleware/             # auth, rbac, upload, errorHandler, validate
│   ├── modules/
│   │   ├── auth/ anggota/ kegiatan/ (+pengumuman) presensi/
│   │   ├── iuran/              # kategori, periode, tagihan, transaksi
│   │   └── laporan/            # arus kas, dashboard, ekspor
│   ├── utils/
│   └── scripts/seedAdmin.js
├── tests/
└── uploads/                    # bukti bayar, .gitignore
```

Pola per modul: `routes -> controller -> service -> repository (SQL)`.

### 5.2 Front-end (`siukm-frontend`) **[USULAN]**

```
siukm-frontend/
├── CLAUDE.md                   # acuan Claude Code untuk front-end
├── README.md                   # instalasi, build, deploy statis
├── nuxt.config.ts
├── package.json
├── .env.example
├── docs/                       # salinan SRS + diagram + dokumen ini
├── app/
│   ├── app.vue
│   ├── error.vue               # tampilan 403/404
│   ├── assets/css/main.css
│   ├── components/             # DataTable, FormField, ConfirmDialog, FileUpload,
│   │                           # StatCard, ChartCard, StatusBadge, ...
│   ├── composables/            # useApi, useConfirm, useIdleLogout, useFormat, usePermission
│   ├── layouts/
│   │   ├── auth.vue            # login, registrasi
│   │   └── default.vue         # header + sidebar dinamis
│   ├── middleware/
│   │   ├── auth.global.ts      # wajib login kecuali halaman publik
│   │   └── permission.ts       # cek kode hak akses dari definePageMeta
│   ├── pages/                  # lihat Bagian 12.2
│   ├── plugins/api.ts          # $fetch kustom: baseURL, token, envelope, error mapping
│   ├── stores/auth.ts
│   └── utils/                  # format, validator berkas, pemeta error
├── shared/types/               # tipe entitas dan respons API
├── tests/
└── public/
```

---

## 6. Lingkungan dan Konfigurasi

### 6.1 Variabel lingkungan back-end **[FINAL]**

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://user:pass@localhost:5432/sim_ukm
JWT_SECRET=<acak min. 32 karakter>
JWT_EXPIRES_IN=1h
BCRYPT_ROUNDS=12
UPLOAD_DIR=./uploads
UPLOAD_MAX_BYTES=5242880
CORS_ORIGIN=http://localhost:5173
TEST_DATABASE_URL=...            # database terpisah sim_ukm_test
```

Pembuat `JWT_SECRET`: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.

### 6.2 Variabel lingkungan front-end **[USULAN]**

| Variabel | Fungsi | Contoh |
|---|---|---|
| `NUXT_PUBLIC_API_BASE` | Basis URL API | `/api/v1` (relatif, dev dan produksi) |
| `NUXT_DEV_API_TARGET` | Target proxy saat dev | `http://localhost:3000` |

### 6.3 Port dan CORS

- Back-end memakai port **3000**, sama dengan default dev server Nuxt. Front-end dipindah ke **3001** (`devServer.port`).
- `CORS_ORIGIN` di `.env.example` back-end berisi `http://localhost:5173` (default Vite). Dengan proxy dev Nuxt, request ke API berasal dari server proxy sehingga CORS biasanya tidak terpicu. Bila browser mengakses back-end langsung, samakan `CORS_ORIGIN` dengan origin Nuxt (`http://localhost:3001`).
- Produksi: satu domain lewat Nginx, tidak butuh CORS.

### 6.4 Menjalankan di lokal

```bash
# Database (HANYA DB kosong/dev; schema.sql diawali DROP SCHEMA public CASCADE)
createdb sim_ukm
psql -d sim_ukm -v ON_ERROR_STOP=1 -f db/schema.sql
psql -d sim_ukm -v ON_ERROR_STOP=1 -f db/test_data.sql    # opsional

# Back-end
cp .env.example .env
npm install
npm run dev                                    # http://localhost:3000
curl http://localhost:3000/api/v1/health       # cek

# Front-end (setelah diinisialisasi)
npm install
npm run dev                                    # http://localhost:3001
```

---

## 7. Database **[FINAL]**

Sumber kebenaran: `db/schema.sql`. PostgreSQL, PK `INTEGER GENERATED ALWAYS AS IDENTITY`, waktu `TIMESTAMPTZ`, uang `NUMERIC(14,2)`.

### 7.1 Tabel

| Modul | Tabel |
|---|---|
| Auth dan Anggota | `peran`, `hak_akses`, `peran_hak_akses` (M:N), `pengguna`, `anggota` |
| Kegiatan dan Presensi | `kegiatan`, `pengumuman` (`tanggal_terbit` NULL = draf), `presensi` |
| Keuangan | `kategori_iuran`, `periode_iuran`, `tagihan_iuran`, `transaksi_pembayaran` |

Catatan: SRS menyebut "tujuh entitas utama", sedangkan implementasi memakai lebih banyak tabel (`peran`, `hak_akses`, `periode_iuran`, `tagihan_iuran`). Class diagram dan skema adalah acuan terbaru.

### 7.2 Relasi penting

- `pengguna` N-1 `peran`; `pengguna` 1-0..1 `anggota` (`anggota.id_pengguna` UNIQUE).
- `presensi` menghubungkan `anggota` dan `kegiatan` (M:N) dengan `UNIQUE (id_kegiatan, id_anggota)`.
- `tagihan_iuran` unik per `(id_anggota, id_kategori, id_periode)`; `transaksi_pembayaran` N-1 `tagihan_iuran`.

### 7.3 View (data turunan, bukan tabel)

`v_rekap_kehadiran` (KF-07), `v_status_iuran` (KF-10.2; status `MENUNGGAK` dihitung dari jatuh tempo), `v_laporan_arus_kas_bulanan`, `v_laporan_arus_kas_tahunan` (KF-11).

**Jangan membuat tabel `rekap_kehadiran` atau `laporan_arus_kas`.** `DashboardRingkasan` dan `EksporLaporan` adalah komponen aplikasi.

### 7.4 Trigger (logika sudah di DB, jangan diduplikasi)

| Trigger | Fungsi | Dampak ke API/UI |
|---|---|---|
| `trg_validasi_transaksi` (BEFORE INSERT) | Tolak jika `jumlah_bayar` lebih besar dari sisa tagihan (KF-09.2) | API mengembalikan **422**; UI menampilkan pesan di dekat field nominal |
| `trg_perbarui_status_pembayaran` (AFTER INSERT) | Menambah `total_dibayar`, set `SEBAGIAN`/`LUNAS` (KF-10.1) | Aplikasi tidak meng-UPDATE status; UI cukup memuat ulang data tagihan |

### 7.5 Nilai enum (menurut class diagram)

> Verifikasi terhadap `db/schema.sql` sebelum dipakai di tipe front-end. Class diagram bukan sumber kebenaran untuk nilai enum.

| Enum | Nilai |
|---|---|
| `StatusAkun` | `AKTIF`, `NONAKTIF` |
| `StatusKeanggotaan` | `MENUNGGU_VERIFIKASI`, `AKTIF`, `NONAKTIF` |
| `StatusKegiatan` | `TERJADWAL`, `BERLANGSUNG`, `SELESAI`, `DIBATALKAN` |
| `StatusKehadiran` | `HADIR`, `IZIN`, `SAKIT`, `ALPA` |
| `MetodePresensi` | `MANDIRI`, `MANUAL_ADMIN` |
| `StatusPembayaran` | `BELUM_BAYAR`, `SEBAGIAN`, `LUNAS`, `MENUNGGAK` |
| `JenisPeriodeLaporan` | `BULANAN`, `TAHUNAN` |
| `FormatEkspor` | `PDF`, `EXCEL` |

### 7.6 Aturan perubahan skema

- `schema.sql` **tidak boleh** dijalankan pada database berisi data (staging/produksi).
- Setelah Sprint 1 dimulai, perubahan skema lewat `db/migrations/NNN_deskripsi.sql`, idempoten bila memungkinkan.
- Perubahan skema memerlukan persetujuan pengguna dan dicatat ke class diagram.

---

## 8. RBAC **[FINAL]**

Tiga peran sistem plus pengunjung publik. Penegakan di **back-end** lewat middleware (`authenticate` lalu `requirePermission('KODE')`). Menyembunyikan menu di front-end bukan keamanan.

### 8.1 Pemetaan peran ke hak akses

| Peran | Kode hak akses |
|---|---|
| Admin/Pengurus | `ANGGOTA_KELOLA`, `ROLE_KELOLA`, `KEGIATAN_KELOLA`, `KEGIATAN_LIHAT`, `PENGUMUMAN_KELOLA`, `PENGUMUMAN_LIHAT`, `PRESENSI_KELOLA`, `LAPORAN_PRESENSI`, `DASHBOARD` |
| Bendahara | `IURAN_KELOLA`, `LAPORAN_KEUANGAN`, `DASHBOARD` (+ baca daftar anggota, menunggu `ANGGOTA_LIHAT`) |
| Anggota | `ANGGOTA_PROFIL`, `KEGIATAN_LIHAT`, `PENGUMUMAN_LIHAT`, `PRESENSI_MANDIRI`, `IURAN_PRIBADI`, `DASHBOARD` |

### 8.2 Prinsip

- 401: tidak login atau token kedaluwarsa. 403: peran tidak berhak (KF-15.2).
- Anggota hanya membaca/mengubah data **miliknya**. `id_anggota` diambil dari token/sesi, **bukan** dari body atau query (cegah IDOR).
- Hanya Admin yang boleh mengubah peran pengguna.
- Hanya anggota berstatus `AKTIF` yang mengakses fitur anggota penuh.

### 8.3 Penerapan di front-end **[USULAN]**

- Guard dan menu mengikuti **kode hak akses**, bukan nama peran, agar selaras dengan back-end.
- Tiap halaman mendeklarasikan `definePageMeta({ permissions: ['KODE', ...] })`. Middleware `permission.ts` membacanya dan mengalihkan ke 403 bila tidak cocok.
- Sidebar disaring dari daftar hak akses yang sama.
- Daftar hak akses pengguna diambil dari `GET /auth/me` atau respons login **[ASUMSI, lihat Bagian 15]**.
- Tombol aksi (Tambah, Ubah, Hapus) disembunyikan bila hak tidak ada, tetapi back-end tetap penentu akhir.

---

## 9. Aturan Bisnis (wajib ditegakkan) **[FINAL]**

| No | Aturan | Penegak |
|---|---|---|
| 1 | Pengumuman dan kegiatan hanya dibuat Admin/Pengurus | Back-end (RBAC) |
| 2 | Transaksi iuran hanya dicatat Bendahara; nominal sesuai tagihan | Back-end + trigger |
| 3 | Status `LUNAS` otomatis, bukan manual | Trigger |
| 4 | Satu presensi per anggota per kegiatan (tangkap `23505`, pesan "Presensi sudah tercatat") | UNIQUE + back-end |
| 5 | Self check-in hanya saat kegiatan berlangsung (`status_kegiatan = 'BERLANGSUNG'` atau waktu sekarang di antara mulai dan selesai); di luar jadwal ditolak dengan pesan "sesi presensi belum dibuka atau telah berakhir" | Back-end (UI hanya membantu) |
| 6 | `metode_presensi` = `MANDIRI` untuk check-in, `MANUAL_ADMIN` untuk input/koreksi Admin (isi `dicatat_oleh`) | Back-end |
| 7 | Hapus anggota/kegiatan/transaksi wajib konfirmasi; hindari hard-delete transaksi; bukti bayar yang diunggah tetap tersimpan | UI dialog + back-end |
| 8 | Hanya anggota `AKTIF` yang mengakses fitur anggota penuh | Back-end |
| 9 | Pesan gagal login tidak menyebut bagian kredensial yang salah (KF-01.3) | Back-end (UI menampilkan apa adanya) |
| 10 | Perubahan peran hanya oleh Admin | Back-end |

---

## 10. Kontrak API

### 10.1 Konvensi **[FINAL]**

- Prefix `/api/v1`. Format JSON; unggah berkas `multipart/form-data`.
- Respons sukses:
  ```json
  { "sukses": true, "data": "...", "meta": { } }
  ```
- Respons galat:
  ```json
  { "sukses": false, "pesan": "...", "galat": [ { "field": "email", "pesan": "..." } ] }
  ```
- Paginasi: `?page=1&limit=20`. Pencarian/filter anggota: `?q=nama&status=AKTIF` (KF-03.2).
- Validasi server untuk semua endpoint. Pesan galat dalam Bahasa Indonesia dan diarahkan ke field bermasalah.

### 10.2 Kode status dan penanganan di front-end

| Kode | Arti | Penanganan UI **[USULAN]** |
|---|---|---|
| 200/201 | Sukses | Toast sukses, perbarui data |
| 400 | Validasi | Petakan `galat[]` ke error di bawah field |
| 401 | Tidak login/token kedaluwarsa | Hapus sesi, arahkan ke `/login` dengan pesan |
| 403 | Peran tidak berhak | Tampilkan halaman akses ditolak |
| 404 | Tidak ditemukan | Halaman/toast tidak ditemukan |
| 409 | Duplikat/UNIQUE (mis. presensi ganda, email terdaftar) | Toast peringatan atau error field (email) |
| 422 | Aturan bisnis (mis. nominal melebihi tagihan) | Error di dekat field terkait atau banner formulir |
| 429 | Rate limit (login/registrasi) | Pesan "coba lagi beberapa saat" |
| 500 | Galat server (pesan generik) | Toast galat umum |

### 10.3 Peta endpoint **[FINAL sebagai rancangan awal; sesuaikan saat Sprint Planning]**

| Modul | Endpoint | Hak | KF |
|---|---|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` | publik / login | 01, 02 |
| Peran | `GET/PUT /pengguna/:id/peran` | `ROLE_KELOLA` | 15 |
| Anggota | `GET/POST /anggota`, `GET/PUT/DELETE /anggota/:id` | `ANGGOTA_KELOLA` | 02.5, 03.1, 03.2 |
| Profil | `GET/PUT /profil` | `ANGGOTA_PROFIL` | 03.3 |
| Kegiatan | `GET /kegiatan`, `GET /kegiatan/:id`; `POST/PUT/DELETE` | `KEGIATAN_LIHAT` / `KEGIATAN_KELOLA` | 04 |
| Pengumuman | `GET /pengumuman`; `POST /pengumuman`, `POST /pengumuman/:id/terbitkan` | `PENGUMUMAN_LIHAT` / `PENGUMUMAN_KELOLA` | 05 |
| Presensi | `POST /kegiatan/:id/checkin`; `POST/PUT /kegiatan/:id/presensi` | `PRESENSI_MANDIRI` / `PRESENSI_KELOLA` | 06 |
| Rekap | `GET /rekap/kegiatan/:id`, `GET /rekap/periode?awal=&akhir=` | `PRESENSI_KELOLA` | 07 |
| Iuran | `/kategori-iuran`, `/periode-iuran` (CRUD; kategori **dinonaktifkan**, bukan dihapus) | `IURAN_KELOLA` | 08 |
| Tagihan | `POST /tagihan` (generate per periode), `GET /tagihan/status` (tunggakan) | `IURAN_KELOLA` | 10 |
| Transaksi | `POST /transaksi` (multipart + bukti) | `IURAN_KELOLA` | 09 |
| Pribadi | `GET /iuran/saya` | `IURAN_PRIBADI` | 12 |
| Laporan | `GET /laporan/arus-kas?jenis=bulanan&bulan=&tahun=` | `LAPORAN_KEUANGAN` | 11 |
| Dashboard | `GET /dashboard` (isi menyesuaikan peran) | `DASHBOARD` | 13 |
| Ekspor | `GET /ekspor/keuangan?format=pdf\|xlsx`, `GET /ekspor/presensi?format=pdf\|xlsx` | `LAPORAN_KEUANGAN` / `LAPORAN_PRESENSI` | 14 |
| Kesehatan | `GET /health` | publik | (operasional) |

### 10.4 Autentikasi

Yang sudah pasti:

- JWT dengan kedaluwarsa **1 jam** (`JWT_EXPIRES_IN=1h`).
- Sliding expiration: token baru diterbitkan pada request terautentikasi bila sisa masa berlaku tinggal separuh (CLAUDE.md Bagian 10).
- Logout: token dihapus di klien (denylist hanya bila diminta).
- Rate limit pada `/auth/login` dan `/auth/register`.

Belum pasti **[TERBUKA]**:

- Pengiriman token ke klien dan dari klien (dugaan: `Authorization: Bearer`).
- Cara token baru dikirim saat sliding (header respons seperti `X-New-Token`, atau body).
- Isi respons login dan `GET /auth/me` (data pengguna, peran, daftar kode hak akses).

### 10.5 Berkas

- **Unggah bukti**: `multipart/form-data` pada `POST /transaksi`. Validasi MIME dan ekstensi (JPG/PNG/PDF), maksimal 5 MB, nama berkas diganti UUID, disimpan di `UPLOAD_DIR` di luar webroot.
- **Tampil bukti**: hanya lewat endpoint terautentikasi dengan cek hak akses (Anggota hanya bukti miliknya). Rute endpoint belum tercantum **[TERBUKA]**. Karena butuh token, front-end menampilkannya lewat fetch blob, **bukan** `<img src>` langsung.
- **Unduh ekspor**: `GET /ekspor/...` mengembalikan berkas (PDF/Excel). Front-end mengunduh sebagai blob dengan token lalu memicu penyimpanan.

---

## 11. Keamanan dan Privasi (KNF-03, SRS 5.3, UU PDP No. 27/2022)

### 11.1 Back-end **[FINAL]**

- Kata sandi di-hash bcrypt (rounds minimal 10, default 12). Tidak pernah di-log, dikembalikan, atau disimpan polos. `kata_sandi_hash` tidak ikut di respons API (jangan `SELECT *` pada `pengguna` ke klien).
- Query SQL selalu berparameter (`$1, $2`).
- `helmet`, CORS dibatasi ke origin front-end, `express-rate-limit` pada login dan registrasi.
- Data pribadi (nama, nomor anggota, email, telepon): minimalkan, jangan di-log.
- Anggota tidak boleh melihat data pribadi atau keuangan anggota lain.
- Seluruh komunikasi lewat HTTPS. `.env` tidak di-commit.
- Catatan operasional **[ASUMSI]**: bila Express berada di belakang Nginx, `express-rate-limit` perlu `app.set('trust proxy', 1)` agar membaca IP klien yang benar. Verifikasi di back-end.

### 11.2 Front-end **[USULAN]**

- Token disimpan lewat `useCookie` (`maxAge` 1 jam, `SameSite=Strict`, `Secure` di produksi). Cookie ini dapat dibaca JavaScript, jadi pencegahan XSS tetap penting.
- Tidak memakai `v-html` untuk data dari server. Pakai interpolasi bawaan Vue yang meng-escape.
- Tidak menyimpan data pribadi atau keuangan di `localStorage`, dan tidak menuliskannya ke `console`.
- Validasi klien (format email, ukuran/tipe berkas) hanya untuk kenyamanan. Back-end tetap penentu.
- Logout membersihkan token dan semua state Pinia.
- Halaman publik hanya `/login` dan `/daftar`.

---

## 12. Rancangan Front-end **[USULAN, kecuali dinyatakan lain]**

### 12.1 Prinsip UI (SRS 3.1, KNF-01, KNF-02)

- **Mobile-first**. Mayoritas Anggota memakai smartphone, dan self check-in harus minim langkah.
- Layout konsisten: header (logo komunitas, nama pengguna, navigasi), sidebar modul yang **menyesuaikan hak akses**.
- Galat validasi tampil **di dekat field** disertai petunjuk perbaikan.
- Setiap aksi ubah/hapus data penting meminta **konfirmasi** dialog.
- Bantuan kontekstual: placeholder, tooltip, pesan validasi (SRS 2.6).
- Seluruh teks UI, pesan galat, dan label dalam **Bahasa Indonesia**.
- Tabel besar berubah menjadi kartu di layar kecil.
- Performa: halaman termuat paling lama 3 detik pada jaringan normal (KNF-04), lewat lazy-load route, paginasi, dan grafik dimuat lazy.

### 12.2 Peta halaman

| Route | Isi | Endpoint | Hak akses | KF | Sprint |
|---|---|---|---|---|---|
| `/login` | Form login | `POST /auth/login` | publik | 01 | 1 |
| `/daftar` | Registrasi mandiri; sukses langsung `AKTIF`, arahkan ke login | `POST /auth/register` | publik | 02.1-02.2 | 1 |
| `/` | Dashboard sesuai hak akses | `GET /dashboard` | `DASHBOARD` | 13 | 1 (kerangka), 3 (lengkap) |
| `/profil` | Profil pribadi, dapat diperbarui | `GET/PUT /profil` | `ANGGOTA_PROFIL` | 03.3 | 1 |
| `/anggota` | Tabel anggota, cari dan filter, hapus dengan konfirmasi | `GET/DELETE /anggota` | `ANGGOTA_KELOLA` | 03 | 1 |
| `/anggota/tambah` | Form anggota baru | `POST /anggota` | `ANGGOTA_KELOLA` | 02.5 | 1 |
| `/anggota/[id]` | Detail dan ubah anggota | `GET/PUT /anggota/:id` | `ANGGOTA_KELOLA` | 03.1 | 1 |
| `/pengaturan/peran` | Atur peran pengguna | `GET/PUT /pengguna/:id/peran` | `ROLE_KELOLA` | 15 | 1 |
| `/kegiatan` | Daftar/kalender kegiatan, tombol buat kegiatan (Admin) | `GET/POST /kegiatan` | `KEGIATAN_LIHAT` / `KEGIATAN_KELOLA` | 04 | 2 |
| `/kegiatan/[id]` | Detail; tombol check-in (Anggota); daftar dan koreksi presensi (Admin) | `GET/PUT/DELETE /kegiatan/:id`, `POST /kegiatan/:id/checkin`, `POST/PUT /kegiatan/:id/presensi` | lihat Bagian 8 | 04, 06 | 2 |
| `/pengumuman` | Daftar pengumuman; buat dan terbitkan (Admin), penanda draf | `GET/POST /pengumuman`, `POST /pengumuman/:id/terbitkan` | `PENGUMUMAN_LIHAT` / `PENGUMUMAN_KELOLA` | 05 | 2 |
| `/presensi/rekap` | Rekap per kegiatan dan per periode | `GET /rekap/kegiatan/:id`, `GET /rekap/periode` | `PRESENSI_KELOLA` | 07 | 2 |
| `/iuran/kategori` | CRUD kategori; **Nonaktifkan** (bukan hapus) | `/kategori-iuran` | `IURAN_KELOLA` | 08 | 3 |
| `/iuran/periode` | CRUD periode iuran | `/periode-iuran` | `IURAN_KELOLA` | 08 | 3 |
| `/iuran/tagihan` | Generate tagihan per periode; status lunas/menunggak | `POST /tagihan`, `GET /tagihan/status` | `IURAN_KELOLA` | 10 | 3 |
| `/iuran/transaksi` | Form transaksi dan unggah bukti | `POST /transaksi` | `IURAN_KELOLA` | 09 | 3 |
| `/iuran/saya` | Riwayat dan status iuran pribadi | `GET /iuran/saya` | `IURAN_PRIBADI` | 12 | 3 |
| `/laporan/arus-kas` | Laporan bulanan/tahunan, grafik, tombol ekspor | `GET /laporan/arus-kas`, `GET /ekspor/keuangan` | `LAPORAN_KEUANGAN` | 11, 14 | 3 |
| Ekspor presensi (di `/presensi/rekap`) | Tombol PDF/Excel | `GET /ekspor/presensi` | `LAPORAN_PRESENSI` | 14 | 3 |
| `/akses-ditolak` | Halaman 403 | (tanpa) | login | 15.2 | 1 |

**Tidak dibuat:**

- Halaman verifikasi/penolakan pendaftaran (menunggu keputusan, Bagian 3.3).
- Panel notifikasi dalam aplikasi (menunggu tabel notifikasi). Sementara pakai toast.
- Tombol hapus transaksi dan tombol hapus kategori iuran.

### 12.3 Komponen bersama

| Komponen | Fungsi |
|---|---|
| `DataTable` | Cari, filter, paginasi (membaca `meta`), state kosong dan memuat, mode kartu di layar kecil |
| `FormField` | Label, petunjuk, pesan error tepat di bawah field |
| `ConfirmDialog` + `useConfirm` | Konfirmasi seragam untuk ubah/hapus |
| `FileUpload` | Pilih JPG/PNG/PDF, maksimal 5 MB, pratinjau nama/ukuran, pesan error jelas; di HP dapat membuka kamera |
| `StatCard`, `ChartCard` | Kartu statistik dan grafik (Chart.js lazy) |
| `StatusBadge` | Badge status (Lunas/Menunggak/Sebagian/Belum bayar, Hadir/Izin/Sakit/Alpa, Aktif/Nonaktif, Terjadwal/Berlangsung/Selesai/Dibatalkan, Draf/Terbit) |
| `PermissionGate` / `usePermission` | Tampilkan elemen hanya bila hak ada |
| Toast | Notifikasi sementara (pengganti panel notifikasi) |

### 12.4 Lapisan API

- Plugin `api.ts` menyediakan `$fetch` kustom dengan:
  - `baseURL` dari `runtimeConfig.public.apiBase`
  - penyisipan header `Authorization`
  - pembukaan envelope: mengembalikan `data` dan `meta`
  - pemetaan galat: `galat[]` menjadi objek `{ field: pesan }` untuk form
  - penanganan 401 (logout + redirect), 403, 429, 500 sesuai Bagian 10.2
  - penangkapan token baru dari sliding expiration **[bergantung Bagian 15]**
- Composable `useApi` membungkus `useFetch` dengan key yang jelas per halaman.
- Satu file API per modul (`auth`, `anggota`, `kegiatan`, `presensi`, `iuran`, `laporan`) dan tipe di `shared/types/`.

### 12.5 Sesi dan idle

- Token berlaku 1 jam dengan sliding expiration di back-end.
- Front-end memakai `useIdle` (VueUse) untuk menampilkan peringatan sebelum satu jam tanpa aktivitas, lalu logout otomatis.
- Setiap respons 401 selalu menutup sesi, apa pun status timer.
- Logout memanggil `POST /auth/logout`, lalu menghapus token dan state apa pun hasilnya.

### 12.6 Data uang dan waktu

- Nilai `NUMERIC` dianggap string. **Tidak ada perhitungan uang dengan float** di front-end. Sisa tagihan dan total berasal dari back-end.
- Tampilan Rupiah: `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })`.
- Tampilan tanggal DD/MM/YYYY, zona `Asia/Jakarta`. Data `timestamptz` dikonversi saat tampil.
- Input nominal: kirim sebagai angka desimal yang divalidasi, tanpa pemisah ribuan.

### 12.7 Perilaku per fitur penting

- **Check-in:** tombol aktif hanya saat kegiatan berlangsung. Hasil: sukses (waktu tercatat), 409 "Presensi sudah tercatat", atau penolakan di luar jadwal. Tombol dinonaktifkan sesudah berhasil.
- **Registrasi:** setelah sukses, tampilkan konfirmasi dan arahkan ke login. Status awal `AKTIF`.
- **Pengumuman:** daftar Admin menandai draf (belum terbit). Aksi Terbitkan meminta konfirmasi.
- **Transaksi:** pilih tagihan, isi nominal, unggah bukti. Error 422 (nominal melebihi sisa) tampil di field nominal. Setelah sukses, status tagihan dimuat ulang dari server.
- **Iuran pribadi:** hanya data milik pengguna login, tanpa parameter id dari klien.
- **Ekspor:** tombol menampilkan status memuat, mengunduh blob, lalu menyimpan berkas dengan nama yang jelas.

### 12.8 Responsif dan kompatibilitas (SRS 2.4)

- Browser: Chrome 100+, Firefox 100+, Edge 100+, Safari 15+. OS klien: Windows 10+, macOS, Linux, Android 9+, iOS 14+.
- Layout mobile-first, target sentuh memadai, tanpa instalasi aplikasi tambahan.

### 12.9 Skeleton konfigurasi (sketsa, belum diuji)

```ts
// nuxt.config.ts (sketsa)
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devServer: { port: 3001 },
  runtimeConfig: {
    public: { apiBase: '/api/v1' }
  },
  nitro: {
    devProxy: {
      '/api': { target: 'http://localhost:3000/api', changeOrigin: true }
    }
  },
  modules: ['@nuxt/ui', '@pinia/nuxt', '@vueuse/nuxt', '@nuxt/eslint']
})
```

---

## 13. Matriks Keterlacakan

### 13.1 Kebutuhan fungsional

| KF | Kebutuhan | Back-end | Front-end |
|---|---|---|---|
| KF-01.1 | Verifikasi email dan sandi | `POST /auth/login`, bcrypt | `/login` |
| KF-01.2 | Dashboard dan menu sesuai peran | `GET /auth/me`, `GET /dashboard` | Layout, sidebar berbasis hak akses |
| KF-01.3 | Pesan gagal tidak menyebut bagian yang salah | Pesan generik | Tampilkan pesan apa adanya |
| KF-01.4 | Logout mengakhiri sesi | `POST /auth/logout` | Hapus token dan state |
| KF-02.1 | Formulir registrasi mandiri | `POST /auth/register` | `/daftar` |
| KF-02.2 | Validasi kelengkapan dan format | Validasi server (zod/joi) | Validasi klien + tampil `galat[]` |
| KF-02.3 | Simpan pendaftaran baru | **Langsung `AKTIF`** (Sprint 0, menggantikan "menunggu verifikasi") | Arahkan ke login |
| KF-02.4 | Admin menyetujui/menolak | **[TERBUKA]** tidak dibangun | Tidak dibuat |
| KF-02.5 | Admin input anggota baru | `POST /anggota` | `/anggota/tambah` |
| KF-03.1 | CRUD data induk anggota | `/anggota`, `/anggota/:id` | `/anggota`, `/anggota/[id]` |
| KF-03.2 | Cari dan filter | `?q=&status=` | Kontrol di `DataTable` |
| KF-03.3 | Anggota perbarui profil sendiri | `GET/PUT /profil` | `/profil` |
| KF-04.1 | CRUD kegiatan | `/kegiatan` | `/kegiatan`, form kegiatan |
| KF-04.2 | Daftar/kalender + status | `GET /kegiatan` | Tampilan daftar/kalender |
| KF-04.3 | Anggota lihat jadwal dan detail | `GET /kegiatan`, `/kegiatan/:id` | `/kegiatan`, `/kegiatan/[id]` |
| KF-05.1 | Buat dan terbitkan pengumuman | `POST /pengumuman`, `.../terbitkan` | `/pengumuman` |
| KF-05.2 | Pengumuman terbaru di dashboard dan halaman anggota | `GET /pengumuman`, `GET /dashboard` | Dashboard, `/pengumuman` |
| KF-06.1 | Self check-in | `POST /kegiatan/:id/checkin` | Tombol di `/kegiatan/[id]` |
| KF-06.2 | Admin catat dan koreksi presensi | `POST/PUT /kegiatan/:id/presensi` | `/kegiatan/[id]` (Admin) |
| KF-06.3 | Catat waktu, cegah presensi ganda | UNIQUE + `23505`, `waktu_presensi` | Tampilkan pesan 409 |
| KF-07.1 | Rekap otomatis saat presensi dicatat | View `v_rekap_kehadiran` | (tanpa aksi; data selalu terbaru) |
| KF-07.2 | Rekap per kegiatan dan periode | `GET /rekap/...` | `/presensi/rekap` |
| KF-08.1 | Kelola kategori, nominal, periode | `/kategori-iuran`, `/periode-iuran` | `/iuran/kategori`, `/iuran/periode` |
| KF-09.1 | Catat transaksi + bukti | `POST /transaksi` (multipart) | `/iuran/transaksi` |
| KF-09.2 | Validasi nominal terhadap tagihan | Trigger -> 422 | Error di field nominal |
| KF-10.1 | Status pembayaran otomatis | Trigger | Muat ulang data tagihan |
| KF-10.2 | Status lunas/menunggak real-time | `GET /tagihan/status`, `v_status_iuran` | `/iuran/tagihan` |
| KF-11.1 | Laporan arus kas bulanan/tahunan | `GET /laporan/arus-kas` | `/laporan/arus-kas` |
| KF-12.1 | Anggota lihat riwayat iuran sendiri | `GET /iuran/saya` | `/iuran/saya` |
| KF-13.1 | Dashboard ringkasan | `GET /dashboard` | `/` |
| KF-13.2 | Grafik kehadiran dan arus kas | `GET /dashboard` (data grafik) | `ChartCard` |
| KF-14.1 | Ekspor PDF/Excel | `GET /ekspor/...` | Tombol ekspor |
| KF-15.1 | Admin atur peran | `GET/PUT /pengguna/:id/peran` | `/pengaturan/peran` |
| KF-15.2 | Tolak akses di luar peran | `requirePermission` -> 403 | Guard + `/akses-ditolak` |

### 13.2 Kebutuhan non-fungsional

| KNF | Atribut | Penerapan |
|---|---|---|
| KNF-01 | Usability | Layout konsisten, error di dekat field, bantuan kontekstual, alur minim langkah untuk Anggota |
| KNF-02 | Portability | Responsif mobile-first, tanpa aplikasi native |
| KNF-03 | Security | bcrypt, JWT, RBAC, HTTPS, aturan Bagian 11 |
| KNF-04 | Performance | Halaman termuat paling lama 3 detik; lazy-load, paginasi, grafik lazy |
| KNF-05 | Availability | PM2/systemd (restart otomatis), hosting dengan uptime tinggi |
| KNF-06 | Backup/Safety | `pg_dump` terjadwal + salinan `uploads/`, konfirmasi hapus |
| KNF-07 | Maintainability | Git, arsitektur berlapis, kode terdokumentasi, README teknis |
| KNF-08 | Scalability | Paginasi, view/SQL efisien, responsif saat data bertambah |

(Pemetaan nomor KNF mengikuti rujukan di SRS Bab 5.)

---

## 14. Pengujian

### 14.1 Back-end **[FINAL]**

- Jest + Supertest. Setiap endpoint minimal: sukses, validasi gagal, tanpa login (401), peran salah (403).
- Wajib: trigger nominal berlebih (422), presensi ganda (409), check-in di luar jadwal, Anggota mengakses data anggota lain (ditolak), unggah di atas 5 MB atau tipe salah.
- Database uji terpisah `sim_ukm_test` (`TEST_DATABASE_URL`). Nama test memuat kode KF, mis. `KF-06.3: menolak presensi ganda`.

### 14.2 Front-end **[USULAN]**

- Vitest untuk logika murni: format Rupiah dan tanggal WIB, validator berkas (tipe dan 5 MB), pemeta `galat[]` ke field, logika guard hak akses.
- Uji manual per peran (Admin, Bendahara, Anggota, publik) memakai akun dari `db/test_data.sql`.
- Uji responsif pada lebar HP dan desktop, serta lintas browser (Chrome, Firefox, Edge, Safari).
- Playwright untuk alur utama (login, check-in, catat transaksi, ekspor) bila waktu memungkinkan.
- Nama test memuat kode KF yang sama dengan back-end.

### 14.3 Penerimaan

Kualitas (SRS 5.4) diverifikasi pada tiap Sprint Review dan User Acceptance Testing bersama perwakilan pengurus.

---

## 15. Inkonsistensi Dokumen Sumber dan Celah Kontrak

### 15.1 Inkonsistensi yang perlu dirapikan

| No | Temuan | Usulan |
|---|---|---|
| 1 | SRS KF-02.3 menyebut status "menunggu verifikasi"; Sprint 0 menetapkan langsung `AKTIF`. KF-02.4, Bab 5.5, dan Lampiran C (TBD-3 sampai TBD-6) juga ikut berubah. | Revisi SRS (sudah menjadi langkah berikutnya proyek) |
| 2 | SRS 2.5 menyebut "tujuh entitas" dan ERD di "Bab 6", sedangkan ERD ada di Lampiran B dan implementasi memakai lebih banyak tabel | Perbarui SRS agar sesuai class diagram dan skema |
| 3 | SRS dan CLAUDE.md menulis front-end Vue 3 + Vite + Axios; keputusan sekarang Nuxt 4 | Perbarui SRS 2.4/2.5 dan CLAUDE.md Bagian 2 dan 12 |
| 4 | SRS Lampiran C masih memuat TBD yang sudah diputuskan di Sprint 0 (TBD-1, 3, 4, 5, 6) | Tandai selesai dan isi nilainya |
| 5 | Use case "Memverifikasi Pendaftaran Anggota" (KF-02.4) masih ada di use-case diagram, padahal alurnya belum diputuskan | Putuskan: dihapus, atau dipertahankan sebagai verifikasi opsional |

### 15.2 Celah kontrak API (perlu dipastikan dengan back-end)

**Sebelum Sprint 1**

1. Isi respons login dan `GET /auth/me`: data pengguna, peran, dan daftar kode hak akses.
2. Pengiriman token dan cara token baru dikirim saat sliding expiration.
3. Endpoint daftar pengguna dan daftar peran untuk halaman manajemen peran, serta apakah `GET /anggota` memuat `id_pengguna`.

**Sebelum Sprint 2**

4. Cara front-end membaca daftar presensi per kegiatan (peta endpoint hanya memuat POST/PUT presensi).
5. Endpoint riwayat kehadiran pribadi Anggota (diminta SRS 2.3 dan 3.1, belum ada di peta).

**Sebelum Sprint 3**

6. Rute endpoint untuk menampilkan bukti pembayaran.
7. Bentuk data `GET /dashboard` per peran, `GET /laporan/arus-kas` (untuk grafik), dan daftar tagihan yang dipakai form transaksi.
8. Migrasi `ANGGOTA_LIHAT` (Bendahara) dan tabel notifikasi menunggu persetujuan.

Cara menutup celah: jalankan back-end, lalu minta Claude Code di repo back-end membuat ringkasan kontrak (contoh request/respons tiap endpoint), atau tambahkan Swagger/OpenAPI. Tipe TypeScript di `shared/types/` ditulis dari kontrak itu, bukan dari tebakan.

---

## 16. Deployment dan Operasional

### 16.1 Server **[FINAL sebagai target; penyedia TBD-2]**

- Linux (Ubuntu Server 22.04 LTS atau lebih baru), Node.js 20, PostgreSQL 15+, Nginx dengan TLS.
- Proses Node lewat PM2 atau systemd agar restart otomatis (KNF-05).
- Penyedia hosting dan spesifikasi: **[TERBUKA]** (TBD-2).

### 16.2 Deploy front-end **[USULAN]**

```bash
npm run generate            # hasil statis di .output/public
# salin isi .output/public ke direktori root Nginx (mis. /var/www/siukm/public)
```

Contoh konfigurasi Nginx (sketsa, perlu diuji saat deploy):

```nginx
server {
    listen 443 ssl;
    server_name contoh.domain.ac.id;          # TBD-2
    # ssl_certificate ... ssl_certificate_key ...

    root /var/www/siukm/public;
    client_max_body_size 6m;                  # bukti bayar maks. 5 MB + overhead multipart

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;     # fallback SPA agar refresh di route dalam tidak 404
    }
}
```

### 16.3 Backup **[FINAL, dengan catatan risiko]**

- `pg_dump` terjadwal via cron + salinan folder `uploads/`. Disepakati **sebulan sekali**.
- **Risiko:** data kas dapat hilang hingga sebulan. Disarankan minimal mingguan (biaya nyaris nol). Frekuensi tidak diubah tanpa persetujuan, tetapi skrip dibuat agar frekuensi berubah lewat satu baris cron.
- Prosedur backup dan restore wajib ada di README sebelum UAT (syarat SRS 2.6.3).

### 16.4 Migrasi data awal

Data anggota dan saldo kas dari pengurus dan bendahara diimpor **setelah deployment dan sebelum UAT**. Skrip impor CSV disediakan bila diminta.

### 16.5 Dokumentasi pengguna (SRS 2.6)

- Buku panduan PDF per peran (Admin, Bendahara, Anggota) dengan tangkapan layar.
- Bantuan kontekstual dalam aplikasi.
- README teknis (instalasi, variabel lingkungan, backup) untuk pengurus periode berikutnya.

---

## 17. Rencana Sprint

| Sprint | Back-end | Front-end | Prioritas |
|---|---|---|---|
| **0 / fondasi** | Scaffold, skema, keputusan, `CLAUDE.md` | Inisialisasi Nuxt 4, plugin API, store auth, layouts, middleware izin, komponen bersama, `CLAUDE.md` front-end | (persiapan) |
| **1** | Login/logout (KF-01), RBAC (KF-15), registrasi (KF-02 sesuai Sprint 0), CRUD anggota dan profil (KF-03) | Login, registrasi, guard hak akses, dashboard kerangka, CRUD anggota, profil, manajemen peran | Tinggi |
| **2** | Kegiatan dan pengumuman (KF-04, 05), presensi dan rekap (KF-06, 07) | Kegiatan, pengumuman, check-in, kelola presensi, rekap | Tinggi |
| **3** | Kategori/periode iuran, transaksi, tunggakan, riwayat pribadi (KF-08, 09, 10, 12); laporan, dashboard, ekspor (KF-11, 13, 14) | Kategori/periode, generate tagihan, transaksi + bukti, tunggakan, iuran pribadi, laporan, dashboard lengkap, ekspor | Tinggi lalu Sedang |
| **Penutup** | README deployment, backup/restore | Uji lintas browser, build produksi, contoh Nginx | |

Selesaikan prioritas Tinggi sebelum Sedang. Dashboard, laporan, dan ekspor (Sedang) dikerjakan setelah inti keuangan stabil.

---

## 18. Konvensi Kerja dan Daftar Periksa

### 18.1 Konvensi (berlaku di kedua repo)

- Komunikasi dan seluruh teks UI: **Bahasa Indonesia**.
- Back-end: identifier tabel/kolom `snake_case` Indonesia sesuai skema; fungsi/variabel `camelCase`, konsisten per modul.
- Front-end: komponen `PascalCase`, composable `useXxx`, route berbahasa Indonesia.
- Git dengan Conventional Commits, sebut kode KF: `feat(presensi): cegah presensi ganda (KF-06.3)`. Satu branch per fitur: `feat/kf-06-presensi`.
- Kerjakan per fitur kecil, jalankan test dan lint sebelum menyatakan selesai.
- Jika menemukan inkonsistensi antara SRS, diagram, skema, atau kontrak API, laporkan, jangan diam-diam memilih salah satu.
- Saat ragu: satu pertanyaan ringkas dengan rekomendasi.

### 18.2 Larangan

- Mengubah keputusan Sprint 0, skema, atau enum tanpa persetujuan.
- Membuat endpoint atau halaman verifikasi pendaftaran sebelum ada keputusan.
- Menduplikasi logika trigger (status tagihan, validasi nominal) di aplikasi, termasuk di front-end.
- Meng-commit `.env`, kredensial, berkas upload, atau dump database.
- Menambah dependensi besar atau mengubah stack wajib tanpa bertanya.
- Menulis teks UI dalam bahasa Inggris.
- Menjalankan `db/schema.sql` pada database berisi data.

### 18.3 Daftar periksa "selesai" per fitur

- [ ] Sesuai kebutuhan KF terkait dan aturan bisnis (Bagian 9)
- [ ] Validasi server, hak akses, dan kepemilikan data (IDOR) teruji
- [ ] Pesan galat Bahasa Indonesia; format Rp, tanggal, dan WIB benar
- [ ] Test lulus (sukses, validasi, 401, 403) dan lint bersih
- [ ] Tidak ada rahasia atau data pribadi di log, respons, atau penyimpanan klien
- [ ] Tampilan teruji pada lebar HP dan desktop
- [ ] Dokumentasi/README dan komentar KF diperbarui bila perlu

---

## Lampiran A: Glosarium

| Istilah | Arti |
|---|---|
| UKM | Unit Kegiatan Mahasiswa |
| KF / KNF | Kode Kebutuhan Fungsional / Non-Fungsional |
| RBAC | Role-Based Access Control |
| JWT | JSON Web Token |
| IDOR | Insecure Direct Object Reference (akses data milik orang lain lewat manipulasi id) |
| Self check-in | Presensi yang dilakukan sendiri oleh anggota |
| Sliding expiration | Masa berlaku token diperpanjang selama pengguna aktif |
| SPA | Single Page Application |
| SRS | Software Requirements Specification |
| UAT | User Acceptance Testing |
| TBD | To Be Determined |
| WIB | Waktu Indonesia Barat (UTC+7) |

## Lampiran B: Ringkasan Perintah

```bash
# Back-end
npm install && npm run dev
npm test
npm run lint
node src/scripts/seedAdmin.js

# Front-end (setelah inisialisasi)
npm install && npm run dev        # port 3001
npm run lint
npm run test
npm run generate                  # build statis untuk Nginx
```

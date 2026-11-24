// SATU-SATUNYA tempat asumsi kontrak API (CLAUDE.md bagian 6).
// Semua asumsi diberi komentar `// ASUMSI:` dan harus diverifikasi terhadap back-end
// yang berjalan (atau Swagger) sebelum dipindah ke shared/types/.

// ASUMSI: token dikirim sebagai `Authorization: Bearer <token>`.
export const SKEMA_AUTH = 'Bearer'

// ASUMSI: token baru (sliding expiration) dikirim lewat header respons ini.
// Alternatif yang mungkin: field di body. Header dibaca tanpa peka huruf besar/kecil.
export const HEADER_TOKEN_BARU = 'x-new-token'

// ASUMSI: nama field kata sandi pada body login/registrasi (mengikuti kolom kata_sandi_hash).
export interface LoginRequest {
  email: string
  kata_sandi: string
}

// ASUMSI: bentuk data pengguna pada respons login dan GET /auth/me.
export interface PenggunaRespons {
  id_pengguna?: number
  email: string
  nama?: string
  peran?: string
}

// ASUMSI: respons login = { token, pengguna, hak_akses: string[] }.
export interface LoginRespons {
  token: string
  pengguna: PenggunaRespons
  hak_akses: string[]
}

// ASUMSI: respons GET /auth/me = { pengguna, hak_akses: string[] } (tanpa token).
export interface MeRespons {
  pengguna: PenggunaRespons
  hak_akses: string[]
}

// ASUMSI: meta paginasi. `total_halaman` opsional; dihitung dari total/limit bila tidak ada.
export interface PaginasiMeta {
  page: number
  limit: number
  total: number
  total_halaman?: number
}

/** Bentuk sesi yang dipakai aplikasi, dinormalkan dari respons di atas. */
export interface Sesi {
  token: string | null
  pengguna: { email: string, nama: string | null, peran: string | null }
  hakAkses: string[]
}

/**
 * Menormalkan respons login/me ke bentuk internal. Bila kontrak nyata berbeda,
 * cukup ubah fungsi ini; store dan halaman tidak ikut berubah.
 */
export function normalisasiSesi(data: LoginRespons | MeRespons): Sesi {
  const token = 'token' in data && typeof data.token === 'string' ? data.token : null
  return {
    token,
    pengguna: {
      email: data.pengguna.email,
      nama: data.pengguna.nama ?? null,
      peran: data.pengguna.peran ?? null
    },
    hakAkses: Array.isArray(data.hak_akses) ? [...data.hak_akses] : []
  }
}

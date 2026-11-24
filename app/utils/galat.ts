// Pemetaan galat API (CLAUDE.md bagian 6). Fungsi murni agar mudah diuji.

export interface GalatItem {
  field: string
  pesan: string
}

/** `galat[]` -> `{ field: pesan }`. Pesan pertama per field yang dipakai. */
export function petakanGalat(galat: GalatItem[] | null | undefined): Record<string, string> {
  const hasil: Record<string, string> = {}
  if (!Array.isArray(galat)) return hasil
  for (const g of galat) {
    if (g && typeof g.field === 'string' && typeof g.pesan === 'string' && !(g.field in hasil)) {
      hasil[g.field] = g.pesan
    }
  }
  return hasil
}

/** Bentuk yang dibaca `UForm` (`setErrors` / prop `errors`). */
export function keGalatForm(galat: Record<string, string>): { name: string, message: string }[] {
  return Object.entries(galat).map(([name, message]) => ({ name, message }))
}

/** Pesan bawaan bila body galat tidak memuat `pesan`. Pesan back-end selalu didahulukan. */
export function pesanBawaanStatus(status: number): string {
  switch (status) {
    case 0: return 'Tidak dapat terhubung ke server. Periksa koneksi Anda.'
    case 400: return 'Data yang dikirim tidak valid. Periksa kembali isian Anda.'
    case 401: return 'Sesi Anda berakhir. Silakan masuk kembali.'
    case 403: return 'Anda tidak memiliki hak akses untuk tindakan ini.'
    case 404: return 'Data yang dicari tidak ditemukan.'
    case 409: return 'Data sudah ada atau bentrok dengan data lain.'
    case 422: return 'Permintaan tidak dapat diproses.'
    case 429: return 'Terlalu banyak percobaan. Coba lagi beberapa saat.'
    default: return 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'
  }
}

/**
 * 500 tidak boleh menampilkan detail teknis (CLAUDE.md bagian 6), jadi pesan server
 * diabaikan untuk status >= 500.
 */
export function pesanUntukPengguna(status: number, pesanServer?: string | null): string {
  if (status >= 500) return pesanBawaanStatus(500)
  if (status === 429) return pesanServer?.trim() || pesanBawaanStatus(429)
  return pesanServer?.trim() || pesanBawaanStatus(status)
}

export class ApiError extends Error {
  status: number
  galat: Record<string, string>

  constructor(status: number, pesan: string, galat: Record<string, string> = {}) {
    super(pesan)
    this.name = 'ApiError'
    this.status = status
    this.galat = galat
  }
}

export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError
}

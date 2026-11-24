// Envelope respons API (CLAUDE.md bagian 6). Bentuk `meta` dan `data` per endpoint
// ditulis di app/api/contract.ts selama kontrak belum terverifikasi.

export interface ApiGalatItem {
  field: string
  pesan: string
}

export interface ApiSukses<T = unknown, M = unknown> {
  sukses: true
  data: T
  meta?: M
}

export interface ApiGalat {
  sukses: false
  pesan: string
  galat?: ApiGalatItem[]
}

/** Hasil setelah envelope dibuka oleh plugin `api.ts`. */
export interface ApiResult<T = unknown, M = unknown> {
  data: T
  meta?: M
}

/** Galat per field untuk form: `{ email: 'Format email tidak valid' }`. */
export type GalatField = Record<string, string>

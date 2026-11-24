// Validator bukti pembayaran (keputusan Sprint 0: maks 5 MB, JPG/PNG/PDF).
// Validasi klien hanya kenyamanan; back-end tetap penentu akhir.

export const UKURAN_MAKS_BUKTI = 5 * 1024 * 1024
export const MIME_BUKTI = ['image/jpeg', 'image/png', 'application/pdf'] as const
export const EKSTENSI_BUKTI = ['.jpg', '.jpeg', '.png', '.pdf'] as const
export const ACCEPT_BUKTI = [...MIME_BUKTI, ...EKSTENSI_BUKTI].join(',')

export interface BerkasMinimal {
  name: string
  size: number
  type: string
}

export function formatUkuranBerkas(byte: number): string {
  if (byte < 1024) return `${byte} B`
  if (byte < 1024 * 1024) return `${(byte / 1024).toFixed(1)} KB`
  return `${(byte / (1024 * 1024)).toFixed(1)} MB`
}

/** Mengembalikan pesan galat Bahasa Indonesia, atau `null` bila berkas lolos. */
export function validasiBukti(berkas: BerkasMinimal): string | null {
  if (berkas.size <= 0) return 'Berkas kosong. Pilih berkas lain.'
  const nama = berkas.name.toLowerCase()
  const ekstensiOk = EKSTENSI_BUKTI.some(e => nama.endsWith(e))
  const mimeOk = (MIME_BUKTI as readonly string[]).includes(berkas.type)
  if (!ekstensiOk || !mimeOk) return 'Format berkas harus JPG, PNG, atau PDF.'
  if (berkas.size > UKURAN_MAKS_BUKTI) {
    return `Ukuran berkas ${formatUkuranBerkas(berkas.size)} melebihi batas 5 MB.`
  }
  return null
}

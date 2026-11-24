// Format Rupiah dan tanggal WIB (CLAUDE.md bagian 12). Tanpa perhitungan uang dengan float.

const ZONA_WIB = 'Asia/Jakarta'

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
})

/**
 * Menampilkan nilai uang. Kolom NUMERIC(14,2) dikirim sebagai string; Intl menerima string
 * numerik langsung sehingga tidak ada konversi ke float oleh kode ini.
 */
export function formatRupiah(nilai: string | number | null | undefined): string {
  if (nilai === null || nilai === undefined || nilai === '') return '-'
  if (typeof nilai === 'number' ? !Number.isFinite(nilai) : !/^-?\d+(\.\d+)?$/.test(nilai.trim())) return '-'
  return rupiah.format(typeof nilai === 'number' ? nilai : (nilai.trim() as Intl.StringNumericLiteral))
}

function bagianTanggal(tanggal: Date) {
  const bagian = new Intl.DateTimeFormat('id-ID', {
    timeZone: ZONA_WIB,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(tanggal)
  const ambil = (jenis: string) => bagian.find(b => b.type === jenis)?.value ?? ''
  return {
    dd: ambil('day'),
    mm: ambil('month'),
    yyyy: ambil('year'),
    jam: ambil('hour'),
    menit: ambil('minute')
  }
}

function keDate(nilai: string | Date | null | undefined): Date | null {
  if (nilai === null || nilai === undefined || nilai === '') return null
  const d = nilai instanceof Date ? nilai : new Date(nilai)
  return Number.isNaN(d.getTime()) ? null : d
}

/** DD/MM/YYYY pada zona Asia/Jakarta. */
export function formatTanggal(nilai: string | Date | null | undefined): string {
  const d = keDate(nilai)
  if (!d) return '-'
  const { dd, mm, yyyy } = bagianTanggal(d)
  return `${dd}/${mm}/${yyyy}`
}

/** DD/MM/YYYY HH:mm WIB. */
export function formatTanggalWaktu(nilai: string | Date | null | undefined): string {
  const d = keDate(nilai)
  if (!d) return '-'
  const { dd, mm, yyyy, jam, menit } = bagianTanggal(d)
  return `${dd}/${mm}/${yyyy} ${jam}:${menit} WIB`
}

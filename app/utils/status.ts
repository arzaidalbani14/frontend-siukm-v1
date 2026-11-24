// Peta tampilan StatusBadge.
// ASUMSI: nilai enum mengikuti class diagram dan BELUM diverifikasi terhadap db/schema.sql
// (docs/acuan.md bagian 7.5). Nilai tak dikenal tampil apa adanya dengan warna netral.

export type WarnaBadge = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

export interface TampilanStatus {
  label: string
  warna: WarnaBadge
}

const PETA: Record<string, TampilanStatus> = {
  // Keanggotaan / akun
  AKTIF: { label: 'Aktif', warna: 'success' },
  NONAKTIF: { label: 'Nonaktif', warna: 'neutral' },
  // Kegiatan
  TERJADWAL: { label: 'Terjadwal', warna: 'info' },
  BERLANGSUNG: { label: 'Berlangsung', warna: 'success' },
  SELESAI: { label: 'Selesai', warna: 'neutral' },
  DIBATALKAN: { label: 'Dibatalkan', warna: 'error' },
  // Presensi
  HADIR: { label: 'Hadir', warna: 'success' },
  IZIN: { label: 'Izin', warna: 'info' },
  SAKIT: { label: 'Sakit', warna: 'warning' },
  ALPA: { label: 'Alpa', warna: 'error' },
  // Iuran
  LUNAS: { label: 'Lunas', warna: 'success' },
  SEBAGIAN: { label: 'Sebagian', warna: 'warning' },
  MENUNGGAK: { label: 'Menunggak', warna: 'error' },
  BELUM_BAYAR: { label: 'Belum bayar', warna: 'neutral' },
  // Pengumuman (turunan dari tanggal_terbit NULL = draf)
  DRAF: { label: 'Draf', warna: 'warning' },
  TERBIT: { label: 'Terbit', warna: 'success' }
}

function manusiawi(nilai: string): string {
  const teks = nilai.replace(/_/g, ' ').toLowerCase()
  return teks.charAt(0).toUpperCase() + teks.slice(1)
}

export function tampilanStatus(status: string | null | undefined): TampilanStatus {
  if (!status) return { label: '-', warna: 'neutral' }
  const kunci = status.trim().toUpperCase()
  return PETA[kunci] ?? { label: manusiawi(status.trim()), warna: 'neutral' }
}

// Menu sidebar. Disaring dari kode hak akses yang sama dengan guard halaman.
// `siap: false` = halaman belum dibangun (sprint berikutnya), tidak ditampilkan.
// Tidak ada menu verifikasi pendaftaran dan panel notifikasi (CLAUDE.md bagian 3.2).

export interface ItemMenu {
  label: string
  to: string
  ikon: string
  /** Salah satu kode cukup; kosong = semua pengguna login. */
  izin?: string[]
  siap: boolean
}

export const MENU: ItemMenu[] = [
  { label: 'Dashboard', to: '/', ikon: 'i-lucide-layout-dashboard', izin: ['DASHBOARD'], siap: true },
  { label: 'Profil Saya', to: '/profil', ikon: 'i-lucide-user', izin: ['ANGGOTA_PROFIL'], siap: false },
  { label: 'Anggota', to: '/anggota', ikon: 'i-lucide-users', izin: ['ANGGOTA_KELOLA'], siap: false },
  { label: 'Atur Peran', to: '/pengaturan/peran', ikon: 'i-lucide-shield-check', izin: ['ROLE_KELOLA'], siap: false },
  { label: 'Kegiatan', to: '/kegiatan', ikon: 'i-lucide-calendar-days', izin: ['KEGIATAN_LIHAT'], siap: false },
  { label: 'Pengumuman', to: '/pengumuman', ikon: 'i-lucide-megaphone', izin: ['PENGUMUMAN_LIHAT'], siap: false },
  { label: 'Rekap Presensi', to: '/presensi/rekap', ikon: 'i-lucide-clipboard-check', izin: ['PRESENSI_KELOLA', 'LAPORAN_PRESENSI'], siap: false },
  { label: 'Kategori Iuran', to: '/iuran/kategori', ikon: 'i-lucide-tags', izin: ['IURAN_KELOLA'], siap: false },
  { label: 'Periode Iuran', to: '/iuran/periode', ikon: 'i-lucide-calendar-range', izin: ['IURAN_KELOLA'], siap: false },
  { label: 'Tagihan', to: '/iuran/tagihan', ikon: 'i-lucide-receipt', izin: ['IURAN_KELOLA'], siap: false },
  { label: 'Transaksi', to: '/iuran/transaksi', ikon: 'i-lucide-wallet', izin: ['IURAN_KELOLA'], siap: false },
  { label: 'Iuran Saya', to: '/iuran/saya', ikon: 'i-lucide-hand-coins', izin: ['IURAN_PRIBADI'], siap: false },
  { label: 'Arus Kas', to: '/laporan/arus-kas', ikon: 'i-lucide-chart-column', izin: ['LAPORAN_KEUANGAN'], siap: false }
]

export function menuUntuk(hakAkses: readonly string[]): ItemMenu[] {
  return MENU.filter(m => m.siap && punyaAkses(hakAkses, m.izin))
}

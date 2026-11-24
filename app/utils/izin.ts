// Logika guard hak akses (CLAUDE.md bagian 7.2): mengikuti KODE hak akses, bukan nama peran.

export const HALAMAN_PUBLIK = ['/login', '/daftar'] as const
export const HALAMAN_AKSES_DITOLAK = '/akses-ditolak'

/**
 * Pencocokan "salah satu": pengguna lolos bila memiliki minimal satu kode yang dibutuhkan.
 * Tanpa kode yang dibutuhkan, halaman terbuka untuk semua pengguna yang sudah login.
 */
export function punyaAkses(dimiliki: readonly string[], dibutuhkan?: readonly string[] | null): boolean {
  if (!dibutuhkan || dibutuhkan.length === 0) return true
  return dibutuhkan.some(kode => dimiliki.includes(kode))
}

export function halamanPublik(path: string): boolean {
  return (HALAMAN_PUBLIK as readonly string[]).includes(path)
}

export interface MasukanGuard {
  path: string
  sudahLogin: boolean
  hakAkses: readonly string[]
  dibutuhkan?: readonly string[] | null
}

/**
 * Keputusan navigasi. `null` = lanjut. Selain itu, path tujuan pengalihan.
 * - Belum login di halaman non-publik -> /login
 * - Sudah login membuka /login atau /daftar -> /
 * - Login tetapi tidak punya hak -> /akses-ditolak
 */
export function tentukanAlihan(m: MasukanGuard): string | null {
  if (halamanPublik(m.path)) return m.sudahLogin ? '/' : null
  if (!m.sudahLogin) return '/login'
  if (m.path === HALAMAN_AKSES_DITOLAK) return null
  return punyaAkses(m.hakAkses, m.dibutuhkan) ? null : HALAMAN_AKSES_DITOLAK
}

/** Mencegah open redirect: hanya path internal yang diterima. */
export function amankanRedirect(nilai: unknown, bawaan = '/'): string {
  if (typeof nilai !== 'string') return bawaan
  if (!nilai.startsWith('/') || nilai.startsWith('//') || nilai.startsWith('/\\')) return bawaan
  if (halamanPublik(nilai.split('?')[0] ?? '')) return bawaan
  return nilai
}

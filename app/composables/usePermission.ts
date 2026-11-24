/** Cek hak akses untuk tombol aksi. Mengikuti kode hak akses, bukan nama peran. */
export function usePermission() {
  const auth = useAuthStore()

  /** `true` bila pengguna memiliki salah satu kode. */
  function punya(kode: string | readonly string[]): boolean {
    return punyaAkses(auth.hakAkses, typeof kode === 'string' ? [kode] : kode)
  }

  return { punya, hakAkses: computed(() => auth.hakAkses) }
}

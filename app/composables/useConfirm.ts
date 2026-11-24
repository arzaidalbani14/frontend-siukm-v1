export interface OpsiKonfirmasi {
  judul: string
  pesan?: string
  labelYa?: string
  labelBatal?: string
  /** `bahaya` untuk hapus; mewarnai tombol konfirmasi merah. */
  jenis?: 'biasa' | 'bahaya'
}

interface StateKonfirmasi extends Required<OpsiKonfirmasi> {
  terbuka: boolean
}

// Resolver tidak serializable, jadi disimpan di luar useState.
let selesaikan: ((nilai: boolean) => void) | null = null

export function useConfirm() {
  const state = useState<StateKonfirmasi>('konfirmasi', () => ({
    terbuka: false,
    judul: '',
    pesan: '',
    labelYa: 'Ya, lanjutkan',
    labelBatal: 'Batal',
    jenis: 'biasa'
  }))

  /** Menampilkan dialog; resolve `true` bila pengguna setuju. */
  function konfirmasi(opsi: OpsiKonfirmasi): Promise<boolean> {
    selesaikan?.(false)
    state.value = {
      terbuka: true,
      judul: opsi.judul,
      pesan: opsi.pesan ?? '',
      labelYa: opsi.labelYa ?? 'Ya, lanjutkan',
      labelBatal: opsi.labelBatal ?? 'Batal',
      jenis: opsi.jenis ?? 'biasa'
    }
    return new Promise<boolean>((resolve) => {
      selesaikan = resolve
    })
  }

  function jawab(nilai: boolean) {
    state.value.terbuka = false
    selesaikan?.(nilai)
    selesaikan = null
  }

  return { state, konfirmasi, jawab }
}

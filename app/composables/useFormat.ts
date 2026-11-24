/** Titik masuk format tampilan (Rupiah, tanggal WIB) agar konsisten di seluruh aplikasi. */
export function useFormat() {
  return { rupiah: formatRupiah, tanggal: formatTanggal, tanggalWaktu: formatTanggalWaktu }
}

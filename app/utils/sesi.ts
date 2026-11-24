/**
 * Pindah ke /login dengan muat ulang penuh. Muat ulang ini sengaja: seluruh state Pinia
 * di memori ikut terhapus (CLAUDE.md bagian 7.1). Token sudah dihapus sebelum dipanggil.
 */
export function keHalamanLogin(alasan?: 'berakhir' | 'tidak-aktif') {
  if (!import.meta.client) return
  const query = alasan ? `?sesi=${alasan}` : ''
  window.location.assign(`/login${query}`)
}

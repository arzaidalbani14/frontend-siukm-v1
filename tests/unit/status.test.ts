import { describe, expect, it } from 'vitest'
import { tampilanStatus } from '../../app/utils/status'

describe('tampilan StatusBadge', () => {
  it('memetakan status iuran dan presensi', () => {
    expect(tampilanStatus('BELUM_BAYAR')).toEqual({ label: 'Belum bayar', warna: 'neutral' })
    expect(tampilanStatus('lunas')).toEqual({ label: 'Lunas', warna: 'success' })
    expect(tampilanStatus('ALPA').warna).toBe('error')
  })
  it('nilai tak dikenal tampil apa adanya, netral', () => {
    expect(tampilanStatus('MENUNGGU_VERIFIKASI')).toEqual({ label: 'Menunggu verifikasi', warna: 'neutral' })
  })
  it('kosong menjadi "-"', () => {
    expect(tampilanStatus(null).label).toBe('-')
  })
})

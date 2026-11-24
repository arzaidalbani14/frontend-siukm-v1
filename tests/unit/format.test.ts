import { describe, expect, it } from 'vitest'
import { formatRupiah, formatTanggal, formatTanggalWaktu } from '../../app/utils/format'

describe('format Rupiah', () => {
  it('KF-09: memformat string NUMERIC tanpa float', () => {
    expect(formatRupiah('50000.00').replace(/\s/g, ' ')).toBe('Rp 50.000')
    expect(formatRupiah('1250000.50').replace(/\s/g, ' ')).toBe('Rp 1.250.000,5')
  })
  it('menerima angka', () => {
    expect(formatRupiah(10000).replace(/\s/g, ' ')).toBe('Rp 10.000')
  })
  it('nilai kosong atau tidak valid menjadi "-"', () => {
    expect(formatRupiah(null)).toBe('-')
    expect(formatRupiah(undefined)).toBe('-')
    expect(formatRupiah('')).toBe('-')
    expect(formatRupiah('bukan angka')).toBe('-')
  })
})

describe('format tanggal WIB', () => {
  it('KF-04: mengonversi timestamptz UTC ke Asia/Jakarta (lintas hari)', () => {
    expect(formatTanggal('2026-11-23T20:00:00Z')).toBe('24/11/2026')
    expect(formatTanggalWaktu('2026-11-23T20:05:00Z')).toBe('24/11/2026 03:05 WIB')
  })
  it('tanggal murni (DATE) tidak bergeser', () => {
    expect(formatTanggal('2026-11-24')).toBe('24/11/2026')
  })
  it('tengah malam WIB tampil 00:00, bukan 24:00', () => {
    expect(formatTanggalWaktu('2026-11-23T17:00:00Z')).toBe('24/11/2026 00:00 WIB')
  })
  it('nilai kosong atau tidak valid menjadi "-"', () => {
    expect(formatTanggal(null)).toBe('-')
    expect(formatTanggal('xyz')).toBe('-')
  })
})

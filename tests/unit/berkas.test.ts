import { describe, expect, it } from 'vitest'
import { UKURAN_MAKS_BUKTI, formatUkuranBerkas, validasiBukti } from '../../app/utils/berkas'

const berkas = (name: string, size: number, type: string) => ({ name, size, type })

describe('validator bukti pembayaran', () => {
  it('KF-09.1: menerima JPG, PNG, PDF di bawah 5 MB', () => {
    expect(validasiBukti(berkas('a.jpg', 1000, 'image/jpeg'))).toBeNull()
    expect(validasiBukti(berkas('a.PNG', 1000, 'image/png'))).toBeNull()
    expect(validasiBukti(berkas('a.pdf', 1000, 'application/pdf'))).toBeNull()
  })
  it('menerima tepat 5 MB, menolak 1 byte lebih', () => {
    expect(validasiBukti(berkas('a.pdf', UKURAN_MAKS_BUKTI, 'application/pdf'))).toBeNull()
    expect(validasiBukti(berkas('a.pdf', UKURAN_MAKS_BUKTI + 1, 'application/pdf'))).toMatch(/melebihi batas 5 MB/)
  })
  it('menolak tipe selain JPG/PNG/PDF', () => {
    expect(validasiBukti(berkas('a.gif', 1000, 'image/gif'))).toMatch(/JPG, PNG, atau PDF/)
    expect(validasiBukti(berkas('a.exe', 1000, 'application/octet-stream'))).toMatch(/JPG, PNG, atau PDF/)
  })
  it('menolak ekstensi yang tidak cocok dengan MIME', () => {
    expect(validasiBukti(berkas('a.exe', 1000, 'image/png'))).not.toBeNull()
  })
  it('menolak berkas kosong', () => {
    expect(validasiBukti(berkas('a.pdf', 0, 'application/pdf'))).toMatch(/kosong/)
  })
  it('memformat ukuran', () => {
    expect(formatUkuranBerkas(512)).toBe('512 B')
    expect(formatUkuranBerkas(2048)).toBe('2.0 KB')
    expect(formatUkuranBerkas(5 * 1024 * 1024)).toBe('5.0 MB')
  })
})

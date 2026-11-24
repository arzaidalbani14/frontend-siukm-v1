import { describe, expect, it } from 'vitest'
import { ApiError, isApiError, keGalatForm, pesanUntukPengguna, petakanGalat } from '../../app/utils/galat'

describe('pemeta galat[] ke field', () => {
  it('KF-02.2: memetakan galat per field', () => {
    const hasil = petakanGalat([
      { field: 'email', pesan: 'Format email tidak valid' },
      { field: 'kata_sandi', pesan: 'Minimal 8 karakter' }
    ])
    expect(hasil).toEqual({ email: 'Format email tidak valid', kata_sandi: 'Minimal 8 karakter' })
  })
  it('memakai pesan pertama bila field berulang', () => {
    expect(petakanGalat([{ field: 'a', pesan: '1' }, { field: 'a', pesan: '2' }])).toEqual({ a: '1' })
  })
  it('aman untuk input kosong atau rusak', () => {
    expect(petakanGalat(undefined)).toEqual({})
    expect(petakanGalat(null)).toEqual({})
    expect(petakanGalat([{ field: 1, pesan: 'x' }] as never)).toEqual({})
  })
  it('mengubah ke bentuk UForm', () => {
    expect(keGalatForm({ email: 'salah' })).toEqual([{ name: 'email', message: 'salah' }])
  })
})

describe('pesan galat pengguna', () => {
  it('KF-01.3: menampilkan pesan back-end apa adanya', () => {
    expect(pesanUntukPengguna(401, 'Email atau kata sandi salah')).toBe('Email atau kata sandi salah')
  })
  it('500 tidak membocorkan detail teknis', () => {
    expect(pesanUntukPengguna(500, 'error: relation "x" does not exist')).not.toMatch(/relation/)
  })
  it('429 memakai pesan bawaan bila server tidak mengirim', () => {
    expect(pesanUntukPengguna(429)).toMatch(/Coba lagi beberapa saat/)
  })
  it('ApiError dapat dikenali', () => {
    const e = new ApiError(422, 'Nominal melebihi sisa tagihan', { jumlah_bayar: 'Terlalu besar' })
    expect(isApiError(e)).toBe(true)
    expect(e.galat.jumlah_bayar).toBe('Terlalu besar')
    expect(isApiError(new Error('x'))).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'
import { amankanRedirect, halamanPublik, punyaAkses, tentukanAlihan } from '../../app/utils/izin'
import { normalisasiSesi } from '../../app/api/contract'

const ANGGOTA = ['ANGGOTA_PROFIL', 'KEGIATAN_LIHAT', 'DASHBOARD']

describe('guard hak akses', () => {
  it('KF-15.2: lolos bila memiliki salah satu kode', () => {
    expect(punyaAkses(ANGGOTA, ['ANGGOTA_KELOLA', 'DASHBOARD'])).toBe(true)
    expect(punyaAkses(ANGGOTA, ['ANGGOTA_KELOLA'])).toBe(false)
  })
  it('tanpa kode yang dibutuhkan, semua pengguna login lolos', () => {
    expect(punyaAkses([], undefined)).toBe(true)
    expect(punyaAkses([], [])).toBe(true)
  })
  it('KF-01: belum login diarahkan ke /login', () => {
    expect(tentukanAlihan({ path: '/anggota', sudahLogin: false, hakAkses: [] })).toBe('/login')
  })
  it('halaman publik terbuka tanpa login; sudah login diarahkan ke /', () => {
    expect(halamanPublik('/login')).toBe(true)
    expect(tentukanAlihan({ path: '/login', sudahLogin: false, hakAkses: [] })).toBeNull()
    expect(tentukanAlihan({ path: '/daftar', sudahLogin: true, hakAkses: ANGGOTA })).toBe('/')
  })
  it('KF-15.2: Anggota ke halaman Admin -> /akses-ditolak', () => {
    expect(tentukanAlihan({ path: '/anggota', sudahLogin: true, hakAkses: ANGGOTA, dibutuhkan: ['ANGGOTA_KELOLA'] }))
      .toBe('/akses-ditolak')
  })
  it('/akses-ditolak hanya butuh login', () => {
    expect(tentukanAlihan({ path: '/akses-ditolak', sudahLogin: true, hakAkses: [], dibutuhkan: ['X'] })).toBeNull()
  })
})

describe('redirect aman', () => {
  it('menerima path internal', () => {
    expect(amankanRedirect('/kegiatan?x=1')).toBe('/kegiatan?x=1')
  })
  it('menolak URL eksternal dan halaman publik', () => {
    expect(amankanRedirect('https://jahat.example')).toBe('/')
    expect(amankanRedirect('//jahat.example')).toBe('/')
    expect(amankanRedirect('/\\jahat.example')).toBe('/')
    expect(amankanRedirect('/login')).toBe('/')
    expect(amankanRedirect(undefined)).toBe('/')
  })
})

describe('normalisasi sesi (ASUMSI kontrak)', () => {
  it('membaca respons login', () => {
    const s = normalisasiSesi({ token: 't', pengguna: { email: 'a@b.c', nama: 'A', peran: 'ADMIN' }, hak_akses: ['DASHBOARD'] })
    expect(s).toEqual({ token: 't', pengguna: { email: 'a@b.c', nama: 'A', peran: 'ADMIN' }, hakAkses: ['DASHBOARD'] })
  })
  it('respons me tanpa token', () => {
    expect(normalisasiSesi({ pengguna: { email: 'a@b.c' }, hak_akses: [] }).token).toBeNull()
  })
})

import type { FetchOptions } from 'ofetch'
import type { ApiResult } from '#shared/types/api'
import { HEADER_TOKEN_BARU, SKEMA_AUTH } from '~/api/contract'

export interface ApiOptions extends Omit<FetchOptions<'json' | 'blob'>, 'baseURL' | 'onRequest' | 'onResponse' | 'onResponseError'> {
  /** Jangan alihkan ke /login saat 401 (login gagal, logout). */
  tanpaAlihan401?: boolean
  /** Jangan tampilkan toast otomatis; penanganan galat diserahkan ke pemanggil. */
  senyap?: boolean
}

function bentukEnvelope(nilai: unknown): nilai is { sukses: boolean, data?: unknown, meta?: unknown, pesan?: string, galat?: GalatItem[] } {
  return typeof nilai === 'object' && nilai !== null && 'sukses' in nilai
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const toast = useToast()

  const klien = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      const auth = useAuthStore()
      if (auth.token) {
        const headers = new Headers(options.headers)
        headers.set('Authorization', `${SKEMA_AUTH} ${auth.token}`)
        options.headers = headers
      }
    },
    onResponse({ response }) {
      // Token baru dari sliding expiration (lihat ASUMSI di contract.ts).
      const tokenBaru = response.headers.get(HEADER_TOKEN_BARU)
      if (tokenBaru) useAuthStore().setToken(tokenBaru)

      // Buka envelope; respons biner (blob) dibiarkan.
      if (response.ok && bentukEnvelope(response._data) && response._data.sukses) {
        response._data = { data: response._data.data, meta: response._data.meta }
      }
    }
  })

  async function api<T = unknown, M = unknown>(url: string, opsi: ApiOptions = {}): Promise<ApiResult<T, M>> {
    const { tanpaAlihan401, senyap, ...opsiFetch } = opsi
    try {
      return await klien<ApiResult<T, M>>(url, opsiFetch as Parameters<typeof klien>[1])
    } catch (e) {
      throw tangani(e, { tanpaAlihan401, senyap })
    }
  }

  function tangani(e: unknown, o: { tanpaAlihan401?: boolean, senyap?: boolean }): ApiError {
    const respons = (e as { response?: { status: number, _data?: unknown } }).response
    if (!respons) {
      const err = new ApiError(0, pesanBawaanStatus(0))
      if (!o.senyap) toast.add({ title: err.message, color: 'error' })
      return err
    }

    const status = respons.status
    const badan = bentukEnvelope(respons._data) ? respons._data : null
    const pesan = pesanUntukPengguna(status, badan?.pesan)
    const galat = petakanGalat(badan?.galat)
    const err = new ApiError(status, pesan, galat)
    const adaGalatField = Object.keys(galat).length > 0

    switch (status) {
      case 401:
        if (!o.tanpaAlihan401) {
          useAuthStore().bersihkanSesi()
          keHalamanLogin('berakhir')
        }
        break
      case 403:
        if (!o.senyap) void navigateTo(HALAMAN_AKSES_DITOLAK)
        break
      case 409:
        if (!o.senyap && !adaGalatField) toast.add({ title: pesan, color: 'warning' })
        break
      case 429:
        if (!o.senyap) toast.add({ title: pesan, color: 'warning' })
        break
      default:
        if (status >= 500 && !o.senyap) toast.add({ title: pesan, color: 'error' })
    }
    // 400, 404, 422: ditampilkan oleh pemanggil (di dekat field atau banner formulir).
    return err
  }

  return { provide: { api } }
})

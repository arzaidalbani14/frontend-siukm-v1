import type { AsyncDataOptions } from '#app'
import type { ApiResult } from '#shared/types/api'

/**
 * Pembungkus `useAsyncData` untuk data bacaan halaman. `key` wajib jelas per halaman
 * (mis. 'anggota-daftar'). Pemanggilan API tetap lewat modul di app/api/.
 */
export function useApi<T, M = unknown>(
  key: string,
  ambil: () => Promise<ApiResult<T, M>>,
  opsi: AsyncDataOptions<ApiResult<T, M>> = {}
) {
  return useAsyncData(key, ambil, opsi)
}

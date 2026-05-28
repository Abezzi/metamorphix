import ApiService from './ApiService'

// job history
export async function apiGetJob<T, U extends Record<string, unknown>>(
  params: U,
) {
  return ApiService.fetchData<T>({
    url: '/jobs',
    method: 'get',
    params,
  })
}

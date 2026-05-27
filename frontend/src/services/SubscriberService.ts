import ApiService from './ApiService'

export async function apiGetSubscribers<T, U extends Record<string, unknown>>(
  params: U,
) {
  return ApiService.fetchData<T>({
    url: '/subscribers',
    method: 'get',
    params,
  })
}

export async function apiGetSubscriber<T, U extends Record<string, unknown>>(
  params: U,
) {
  return ApiService.fetchData<T>({
    url: `/subscribers/${params.id}`,
    method: 'get',
    params,
  })
}

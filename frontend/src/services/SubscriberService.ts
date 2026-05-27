import ApiService from './ApiService'

// create
export async function apiCreateSubscriber<T, U extends Record<string, unknown>>(
  data: U,
) {
  return ApiService.fetchData<T>({
    url: '/subscribers',
    method: 'post',
    data,
  })
}

// read one
export async function apiGetSubscriber<T, U extends Record<string, unknown>>(
  params: U,
) {
  return ApiService.fetchData<T>({
    url: `/subscribers/${params.id}`,
    method: 'get',
    params,
  })
}

// read many
export async function apiGetSubscribers<T, U extends Record<string, unknown>>(
  params: U,
) {
  return ApiService.fetchData<T>({
    url: '/subscribers',
    method: 'get',
    params,
  })
}

// update
export async function apiPutSubscriber<T, U extends Record<string, unknown>>(
  data: U,
) {
  return ApiService.fetchData<T>({
    url: `/subscribers/${data.id}`,
    method: 'patch',
    data,
  })
}

// delete
export async function apiDeleteSubscriber<T, U extends Record<string, unknown>>(
  data: U,
) {
  return ApiService.fetchData<T>({
    url: `/subscribers/${data.id}`,
    method: 'delete',
  })
}

// statistics
export async function apiGetSubscribersStatistic<T>() {
  return ApiService.fetchData<T>({
    url: '/subscribers/subscribers-statistic',
    method: 'get',
  })
}

import ApiService from './ApiService'

// create
export async function apiCreateDeliveryAttempt<
  T,
  U extends Record<string, unknown>,
>(data: U) {
  return ApiService.fetchData<T>({
    url: '/delivery-attempts',
    method: 'post',
    data,
  })
}

// read one
export async function apiGetDeliveryAttempt<
  T,
  U extends Record<string, unknown>,
>(params: U) {
  return ApiService.fetchData<T>({
    url: `/delivery-attempts/${params.id}`,
    method: 'get',
    params,
  })
}

// read many
export async function apiGetDeliveryAttempts<
  T,
  U extends Record<string, unknown>,
>(params: U) {
  return ApiService.fetchData<T>({
    url: '/delivery-attempts',
    method: 'get',
    params,
  })
}

// update
export async function apiPutDeliveryAttempt<
  T,
  U extends Record<string, unknown>,
>(data: U) {
  return ApiService.fetchData<T>({
    url: `/delivery-attempts/${data.id}`,
    method: 'patch',
    data,
  })
}

// delete
export async function apiDeleteDeliveryAttempt<
  T,
  U extends Record<string, unknown>,
>(data: U) {
  return ApiService.fetchData<T>({
    url: `/delivery-attempts/${data.id}`,
    method: 'delete',
  })
}

// statistics
export async function apiGetDeliveryAttemptsStatistic<T>() {
  return ApiService.fetchData<T>({
    url: '/delivery-attempts/delivery-attempts-statistic',
    method: 'get',
  })
}

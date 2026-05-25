import ApiService from './ApiService'

export async function apiGetDashboardData<T>() {
  return ApiService.fetchData<T>({
    url: '/pipelines/dashboard',
    method: 'get',
  })
}

export async function apiGetPipelines<T, U extends Record<string, unknown>>(
  params: U,
) {
  return ApiService.fetchData<T>({
    url: '/pipelines',
    method: 'get',
    params,
  })
}

export async function apiGetPipeline<T, U extends Record<string, unknown>>(
  params: U,
) {
  return ApiService.fetchData<T>({
    url: `/pipelines/${params.id}`,
    method: 'get',
    params,
  })
}

export async function apiCreatePipeline<T, U extends Record<string, unknown>>(
  data: U,
) {
  return ApiService.fetchData<T>({
    url: '/pipelines',
    method: 'post',
    data,
  })
}

export async function apiGetPipelinesStatistic<T>() {
  return ApiService.fetchData<T>({
    url: '/pipelines/pipelines-statistic',
    method: 'get',
  })
}

export async function apiPutPipeline<T, U extends Record<string, unknown>>(
  data: U,
) {
  return ApiService.fetchData<T>({
    url: `/pipelines/${data.id}`,
    method: 'patch',
    data,
  })
}

export async function apiGetPipelineDetails<
  T,
  U extends Record<string, unknown>,
>(params: U) {
  return ApiService.fetchData<T>({
    url: '/pipeline-details',
    method: 'get',
    params,
  })
}

export async function apiDeletePipeline<T, U extends Record<string, unknown>>(
  data: U,
) {
  return ApiService.fetchData<T>({
    url: `/pipelines/${data.id}`,
    method: 'delete',
  })
}

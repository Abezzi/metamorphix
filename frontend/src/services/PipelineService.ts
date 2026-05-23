import ApiService from './ApiService'

export async function apiGetDashboardData<T>() {
  return ApiService.fetchData<T>({
    url: '/pipelines/dashboard',
    method: 'get',
  })
}

export async function apiGetCalendar<T>() {
  return ApiService.fetchData<T>({
    url: '/pipelines/calendar',
    method: 'get',
  })
}

export async function apiGetPipelines<T, U extends Record<string, unknown>>(
  data: U,
) {
  return ApiService.fetchData<T>({
    url: '/pipelines',
    method: 'get',
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
    url: '/pipelines',
    method: 'put',
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
    url: '/crm/pipeline/delete',
    method: 'delete',
    data,
  })
}

export async function apiGetMails<T, U extends Record<string, unknown>>(
  params: U,
) {
  return ApiService.fetchData<T>({
    url: '/crm/mails',
    method: 'get',
    params,
  })
}

export async function apiGetMail<T, U extends Record<string, unknown>>(
  params: U,
) {
  return ApiService.fetchData<T>({
    url: '/crm/mail',
    method: 'get',
    params,
  })
}

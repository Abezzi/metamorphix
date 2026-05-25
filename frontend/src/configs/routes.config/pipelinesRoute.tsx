import { lazy } from 'react'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'
import { PIPELINES_PREFIX_PATH } from '@/constants/route.constant'

const pipelinesRoute: Routes = [
  // get pipelines (read)
  {
    key: 'pipelines.allPipelines',
    path: `${PIPELINES_PREFIX_PATH}/list`,
    component: lazy(() => import('@/views/pipelines/AllPipelines')),
    authority: [ADMIN, USER],
  },
  // new pipeline (create)
  {
    key: 'pipelines.new',
    path: `${PIPELINES_PREFIX_PATH}/new`,
    component: lazy(() => import('@/views/pipelines-new/PipelineNew')),
    authority: [ADMIN, USER],
    meta: {
      header: 'Add New Pipeline',
    },
  },
  // edit pipeline (update)
  {
    key: 'pipelines.edit',
    path: `${PIPELINES_PREFIX_PATH}/edit/:pipelineId`,
    component: lazy(() => import('@/views/pipelines-edit/PipelineEdit')),
    authority: [ADMIN, USER],
    meta: {
      header: 'Edit Pipeline',
    },
  },
]

export default pipelinesRoute

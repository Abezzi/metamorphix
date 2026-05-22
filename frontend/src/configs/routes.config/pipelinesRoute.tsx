import { lazy } from 'react'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'
import { PIPELINES_PREFIX_PATH } from '@/constants/route.constant'

const pipelinesRoute: Routes = [
  {
    key: 'pipelines.allPipelines',
    path: `${PIPELINES_PREFIX_PATH}/all-pipelines`,
    component: lazy(() => import('@/views/pipelines/AllPipelines')),
    authority: [ADMIN, USER],
  },
]

export default pipelinesRoute

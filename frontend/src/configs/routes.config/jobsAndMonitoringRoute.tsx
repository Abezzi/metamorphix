import { lazy } from 'react'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'
import { JOBS_AND_MONITORING_PREFIX_PATH } from '@/constants/route.constant'

const jobsAndMonitoringRoute: Routes = [
  // get job history
  {
    key: 'jobsAndMonitoring.jobHistory',
    path: `${JOBS_AND_MONITORING_PREFIX_PATH}/job-history`,
    component: lazy(() => import('@/views/job-history/JobHistory')),
    authority: [ADMIN, USER],
  },
]

export default jobsAndMonitoringRoute

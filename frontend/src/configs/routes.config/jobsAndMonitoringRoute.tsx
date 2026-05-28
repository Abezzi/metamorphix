import { lazy } from 'react'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'
import { JOBS_AND_MONITORING_PREFIX_PATH } from '@/constants/route.constant'

const jobsAndMonitoringRoute: Routes = [
  // get delivery attempts (read)
  {
    key: 'subscribers.allSubscribers',
    path: `${JOBS_AND_MONITORING_PREFIX_PATH}/list`,
    component: lazy(() => import('@/views/subscribers/AllSubscribers')),
    authority: [ADMIN, USER],
  },
  // new delivery attempt (create)
  {
    key: 'subscribers.new',
    path: `${JOBS_AND_MONITORING_PREFIX_PATH}/new`,
    component: lazy(() => import('@/views/subscribers-new/SubscriberNew')),
    authority: [ADMIN, USER],
    meta: {
      header: 'Add New Subscriber',
    },
  },
  // edit delivery attempt (update)
  {
    key: 'subscribers.edit',
    path: `${JOBS_AND_MONITORING_PREFIX_PATH}/edit/:pipelineId`,
    component: lazy(
      () => import('@/views/subscribers-edit/SubscriberEdit'),
    ),
    authority: [ADMIN, USER],
    meta: {
      header: 'Edit Subscriber',
    },
  },
]

export default jobsAndMonitoringRoute

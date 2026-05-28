import { lazy } from 'react'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'
import { DELIVERY_ATTEMPTS_PREFIX_PATH } from '@/constants/route.constant'

const deliveryAttemptsRoute: Routes = [
  // get delivery attempts (read)
  {
    key: 'jobsAndMonitoring.deliveryAttempts',
    path: `${DELIVERY_ATTEMPTS_PREFIX_PATH}/list`,
    component: lazy(
      () => import('@/views/delivery-attempts/AllDeliveryAttempts'),
    ),
    authority: [ADMIN, USER],
  },
]

export default deliveryAttemptsRoute

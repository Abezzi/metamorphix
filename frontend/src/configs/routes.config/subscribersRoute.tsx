import { lazy } from 'react'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'
import { SUBSCRIBERS_PREFIX_PATH } from '@/constants/route.constant'

const subscribersRoute: Routes = [
  // get subscribers (read)
  {
    key: 'subsribers.allSubscribers',
    path: `${SUBSCRIBERS_PREFIX_PATH}/list`,
    component: lazy(() => import('@/views/subscribers/AllSubscribers')),
    authority: [ADMIN, USER],
  },
]

export default subscribersRoute

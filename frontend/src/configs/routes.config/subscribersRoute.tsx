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
  // new subscriber (create)
  {
    key: 'subscribers.new',
    path: `${SUBSCRIBERS_PREFIX_PATH}/new`,
    component: lazy(() => import('@/views/subscribers-new/SubscriberNew')),
    authority: [ADMIN, USER],
    meta: {
      header: 'Add New Subscriber',
    },
  },
  // edit subscriber (update)
  {
    key: 'subscribers.edit',
    path: `${SUBSCRIBERS_PREFIX_PATH}/edit/:pipelineId`,
    component: lazy(
      () => import('@/views/subscribers-edit/SubscriberEdit'),
    ),
    authority: [ADMIN, USER],
    meta: {
      header: 'Edit Subscriber',
    },
  },
]

export default subscribersRoute

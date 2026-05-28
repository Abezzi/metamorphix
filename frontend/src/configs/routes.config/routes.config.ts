import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'
import pipelinesRoute from './pipelinesRoute'
import subscribersRoute from './subscribersRoute'
import deliveryAttemptsRoute from './deliveryAttemptsRoute'
import jobsAndMonitoringRoute from './jobsAndMonitoringRoute'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },
    ...pipelinesRoute,
    ...subscribersRoute,
    ...deliveryAttemptsRoute,
    ...jobsAndMonitoringRoute,
]

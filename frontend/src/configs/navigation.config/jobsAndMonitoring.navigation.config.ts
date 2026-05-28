import type { NavigationTree } from '@/@types/navigation'
import { NAV_ITEM_TYPE_TITLE } from '@/constants/navigation.constant'
import {
  DELIVERY_ATTEMPTS_PREFIX_PATH,
  JOBS_AND_MONITORING_PREFIX_PATH,
} from '@/constants/route.constant'

const jobsAndMonitoringNavigationConfig: NavigationTree[] = [
  {
    key: 'jobsAndMonitoring',
    path: '',
    title: 'Jobs & Monitoring',
    translateKey: 'nav.jobsAndMonitoring.jobsAndMonitoring',
    icon: 'home',
    type: NAV_ITEM_TYPE_TITLE,
    authority: [],
    subMenu: [
      {
        key: 'jobsAndMonitoring.jobHistory',
        path: `${JOBS_AND_MONITORING_PREFIX_PATH}/job-history`,
        title: 'Job History',
        translateKey: 'nav.jobsAndMonitoring.jobHistory',
        icon: 'jobHistory',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [],
      },
      {
        key: 'jobsAndMonitoring.deliveryAttempts',
        path: `${DELIVERY_ATTEMPTS_PREFIX_PATH}/list`,
        title: 'Delivery Attempts',
        translateKey: 'nav.jobsAndMonitoring.deliveryAttempts',
        icon: 'deliveryAttempts',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [],
      },
    ],
  },
]

export default jobsAndMonitoringNavigationConfig

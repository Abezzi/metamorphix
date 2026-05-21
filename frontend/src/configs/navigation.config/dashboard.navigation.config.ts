import type { NavigationTree } from '@/@types/navigation'
import { NAV_ITEM_TYPE_TITLE } from '@/constants/navigation.constant'

const dashboardNavigationConfig: NavigationTree[] = [
  {
    key: 'dashboard',
    path: '',
    title: 'Dashboard',
    translateKey: 'nav.dashboard.dashboard',
    icon: 'home',
    type: NAV_ITEM_TYPE_TITLE,
    authority: [],
    subMenu: [
      {
        key: 'dashboard.overview',
        path: '/overview',
        title: 'Overview',
        translateKey: 'nav.dashboard.overview',
        icon: 'home',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [],
      },
    ],
  },
]

export default dashboardNavigationConfig

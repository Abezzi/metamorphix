import type { NavigationTree } from '@/@types/navigation'
import { NAV_ITEM_TYPE_TITLE } from '@/constants/navigation.constant'
import { SETTINGS_PREFIX_PATH } from '@/constants/route.constant'

const settingsNavigationConfig: NavigationTree[] = [
  {
    key: 'settings',
    path: '',
    title: 'Settings',
    translateKey: 'nav.settings.settings',
    icon: 'home',
    type: NAV_ITEM_TYPE_TITLE,
    authority: [],
    subMenu: [
      {
        key: 'settings.apiAndWebhooks',
        path: `${SETTINGS_PREFIX_PATH}/api-and-webhooks`,
        title: 'API & Webhooks',
        translateKey: 'nav.settings.apiAndWebhooks',
        icon: 'apiAndWebhooks',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [],
      },
      {
        key: 'settings.workersAndInfrastructure',
        path: `${SETTINGS_PREFIX_PATH}/workers-and-infrastructure`,
        title: 'Workers & Infrastructure',
        translateKey: 'nav.settings.workersAndInfrastructure',
        icon: 'workersAndInfrastructure',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [],
      },
      {
        key: 'settings.notifications',
        path: `${SETTINGS_PREFIX_PATH}/notifications`,
        title: 'Notification',
        translateKey: 'nav.settings.notifications',
        icon: 'notifications',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [],
      },
      {
        key: 'settings.general',
        path: `${SETTINGS_PREFIX_PATH}/general`,
        title: 'General',
        translateKey: 'nav.settings.general',
        icon: 'general',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [],
      },
    ],
  },
]

export default settingsNavigationConfig

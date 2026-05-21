import type { NavigationTree } from '@/@types/navigation'
import { NAV_ITEM_TYPE_TITLE } from '@/constants/navigation.constant'
import { ACTIONS_PREFIX_PATH } from '@/constants/route.constant'

const actionsNavigationConfig: NavigationTree[] = [
  {
    key: 'actions',
    path: '',
    title: 'Actions',
    translateKey: 'nav.actions.actions',
    icon: 'home',
    type: NAV_ITEM_TYPE_TITLE,
    authority: [],
    subMenu: [
      {
        key: 'actions.library',
        path: `${ACTIONS_PREFIX_PATH}/library`,
        title: 'Library',
        translateKey: 'nav.actions.library',
        icon: 'library',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [],
      },
      {
        key: 'actions.templates',
        path: `${ACTIONS_PREFIX_PATH}/templates`,
        title: 'Templates',
        translateKey: 'nav.actions.templates',
        icon: 'template',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [],
      },
    ],
  },
]

export default actionsNavigationConfig

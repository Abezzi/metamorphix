import type { NavigationTree } from '@/@types/navigation'
import { NAV_ITEM_TYPE_TITLE } from '@/constants/navigation.constant'
import { SUBSCRIBERS_PREFIX_PATH } from '@/constants/route.constant'

const subscribersNavigationConfig: NavigationTree[] = [
  {
    key: 'subscribers',
    path: '',
    title: 'Subscribers',
    translateKey: 'nav.subscribers.subscribers',
    icon: 'home',
    type: NAV_ITEM_TYPE_TITLE,
    authority: [],
    subMenu: [
      {
        key: 'subscribers.allSubscribers',
        path: `${SUBSCRIBERS_PREFIX_PATH}/all-subscribers`,
        title: 'All Subscribers',
        translateKey: 'nav.subscribers.allSubscribers',
        icon: 'allSubscribers',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [],
      },
      {
        key: 'subscribers.deliveryRules',
        path: `${SUBSCRIBERS_PREFIX_PATH}/deliveryRules`,
        title: 'Delivery Rules',
        translateKey: 'nav.subscribers.deliveryRules',
        icon: 'deliveryRules',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [],
      },
    ],
  },
]

export default subscribersNavigationConfig

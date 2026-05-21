import type { NavigationTree } from '@/@types/navigation'
import { NAV_ITEM_TYPE_TITLE } from '@/constants/navigation.constant'
import { PIPELINES_PREFIX_PATH } from '@/constants/route.constant'

const pipelineNavigationConfig: NavigationTree[] = [
  {
    key: 'pipelines',
    path: '',
    title: 'Pipelines',
    translateKey: 'nav.pipelines.pipelines',
    icon: 'home',
    type: NAV_ITEM_TYPE_TITLE,
    authority: [],
    subMenu: [
      {
        key: 'pipelines.allPipelines',
        path: `${PIPELINES_PREFIX_PATH}/all-pipelines`,
        title: 'All Pipelines',
        translateKey: 'nav.pipelines.allPipelines',
        icon: 'pipelines',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [],
      },
      {
        key: 'pipelines.sources',
        path: `${PIPELINES_PREFIX_PATH}/sources`,
        title: 'Sources',
        translateKey: 'nav.pipelines.sources',
        icon: 'sources',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [],
      },
    ],
  },
]

export default pipelineNavigationConfig

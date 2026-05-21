import type { NavigationTree } from '@/@types/navigation'
import dashboardNavigationConfig from './dashboard.navigation.config'
import pipelineNavigationConfig from './pipelines.navigation.config'
import actionsNavigationConfig from './actions.navigation.config'
import subscribersNavigationConfig from './subscribers.navigation.config'
import jobsAndMonitoringNavigationConfig from './jobsAndMonitoring.navigation.config'
import settingsNavigationConfig from './settings.navigation.config'

const navigationConfig: NavigationTree[] = [
    ...dashboardNavigationConfig,
    ...pipelineNavigationConfig,
    ...actionsNavigationConfig,
    ...jobsAndMonitoringNavigationConfig,
    ...subscribersNavigationConfig,
    ...settingsNavigationConfig,
]

export default navigationConfig

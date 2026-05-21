import { HiOutlineHome } from 'react-icons/hi'
import { SiJfrogpipelines } from 'react-icons/si'
import { GrResources } from 'react-icons/gr'
import { IoLibraryOutline } from 'react-icons/io5'
import { GoProjectTemplate } from 'react-icons/go'
import { VscVmRunning } from 'react-icons/vsc'
import { MdOutlineWorkHistory } from 'react-icons/md'
import { LuMonitorUp } from 'react-icons/lu'
import { MdRule } from 'react-icons/md'
import { CiDeliveryTruck, CiSettings } from 'react-icons/ci'
import { TbCloudDataConnection } from 'react-icons/tb'
import { GiDigDug } from 'react-icons/gi'

import type { JSX } from 'react'
import { CgNotifications } from 'react-icons/cg'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    pipelines: <SiJfrogpipelines />,
    sources: <GrResources />,
    library: <IoLibraryOutline />,
    template: <GoProjectTemplate />,
    activeJobs: <VscVmRunning />,
    jobHistory: <MdOutlineWorkHistory />,
    deliveryAttempts: <LuMonitorUp />,
    deliveryRules: <MdRule />,
    allSubscribers: <CiDeliveryTruck />,
    apiAndWebhooks: <TbCloudDataConnection />,
    workersAndInfrastructure: <GiDigDug />,
    notifications: <CgNotifications />,
    general: <CiSettings />,
}

export default navigationIcon

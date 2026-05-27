import { injectReducer } from '@/store'
import SubscribersTable from './components/SubscribersTable'
import reducer from './store'
import { AdaptableCard } from '@/components/shared'
import SubscribersTableTools from './components/SubscribersTableTools'
// import SubscriberStatistic from './components/PipelineStatistic'

injectReducer('subscribers', reducer)

const AllSubscribers = () => {
  return (
    <>
      <h3>All Subscribers</h3>
      <AdaptableCard className="h-full" bodyClass="h-full">
        <SubscribersTableTools />
        <SubscribersTable />
      </AdaptableCard>
    </>
  )
}
export default AllSubscribers

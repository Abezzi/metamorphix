import { injectReducer } from '@/store'
import DeliveryAttemptsTable from './components/DeliveryAttemptsTable'
import reducer from './store'
import { AdaptableCard } from '@/components/shared'
// import PipelinesTableTools from './components/PipelinesTableTools'
// import PipelineStatistic from './components/PipelineStatistic'

injectReducer('deliveryAttempts', reducer)

const AllDeliveryAttempts = () => {
  return (
    <>
      <h3>Delivery Attempts</h3>
      {/* <PipelineStatistic /> */}
      <AdaptableCard className="h-full" bodyClass="h-full">
        {/* <PipelinesTableTools /> */}
        <DeliveryAttemptsTable />
      </AdaptableCard>
    </>
  )
}
export default AllDeliveryAttempts

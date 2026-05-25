import { injectReducer } from '@/store'
import PipelinesTable from './components/PipelinesTable'
import reducer from './store'
import { AdaptableCard } from '@/components/shared'
import PipelinesTableTools from './components/PipelinesTableTools'
import PipelineStatistic from './components/PipelineStatistic'

injectReducer('crmPipelines', reducer)

const AllPipelines = () => {
  return (
    <>
      <h3>All Pipelines</h3>
      <PipelineStatistic />
      <AdaptableCard className="h-full" bodyClass="h-full">
        <PipelinesTableTools />
        <PipelinesTable />
      </AdaptableCard>
    </>
  )
}
export default AllPipelines

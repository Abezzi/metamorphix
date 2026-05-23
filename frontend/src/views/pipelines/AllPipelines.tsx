import { injectReducer } from '@/store'
import PipelinesTable from './components/PipelinesTable'
import reducer from './store'

injectReducer('crmPipelines', reducer)

const AllPipelines = () => {
  return (
    <>
      <h1>All pipelines</h1>
      <PipelinesTable />
    </>
  )
}
export default AllPipelines

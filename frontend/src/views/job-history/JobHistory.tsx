import { injectReducer } from '@/store'
import reducer from './store'
import { AdaptableCard } from '@/components/shared'
import JobsHistory from './components/JobsTable'

injectReducer('jobs', reducer)

const JobHistory = () => {
  return (
    <>
      <h3>Job History</h3>
      <AdaptableCard className="h-full" bodyClass="h-full">
        <JobsHistory />
      </AdaptableCard>
    </>
  )
}
export default JobHistory

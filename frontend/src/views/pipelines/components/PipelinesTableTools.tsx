import { useRef } from 'react'
import Button from '@/components/ui/Button'
import {
  getPipelines,
  setTableData,
  setFilterData,
  useAppDispatch,
  useAppSelector,
} from '../store'
import PipelineTableSearch from './PipelineTableSearch'
import PipelineTableFilter from './PipelineTableFilter'
import cloneDeep from 'lodash/cloneDeep'
import type { TableQueries } from '@/@types/common'
import { Link } from 'react-router-dom'

const PipelinesTableTools = () => {
  const dispatch = useAppDispatch()

  const inputRef = useRef<HTMLInputElement>(null)

  const tableData = useAppSelector(
    (state) => state.crmPipelines.data.tableData,
  )

  const handleInputChange = (val: string) => {
    const newTableData = cloneDeep(tableData)
    newTableData.query = val
    newTableData.pageIndex = 1
    if (typeof val === 'string' && val.length > 1) {
      fetchData(newTableData)
    }

    if (typeof val === 'string' && val.length === 0) {
      fetchData(newTableData)
    }
  }

  const fetchData = (data: TableQueries) => {
    dispatch(setTableData(data))
    dispatch(getPipelines(data))
  }

  const onClearAll = () => {
    const newTableData = cloneDeep(tableData)
    newTableData.query = ''
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    dispatch(setFilterData({ status: '' }))
    fetchData(newTableData)
  }

  return (
    <div className="md:flex items-center justify-between">
      <div className="md:flex items-center gap-4">
        <PipelineTableSearch
          ref={inputRef}
          onInputChange={handleInputChange}
        />
        <PipelineTableFilter />

        <div className="pb-4">
          <Button size="sm" onClick={onClearAll}>
            Clear All
          </Button>
        </div>
      </div>

      <div className="md:flex items-center gap-4 pb-4">
        <Link
          className="block lg:inline-block md:mb-0 mb-4"
          to="/pipelines/new"
        >
          <Button size="sm" variant="solid">
            Create Pipeline
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default PipelinesTableTools

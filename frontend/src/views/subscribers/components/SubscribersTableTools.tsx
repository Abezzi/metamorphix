import { useRef } from 'react'
import Button from '@/components/ui/Button'
import {
  getSubscribers,
  setTableData,
  setFilterData,
  useAppDispatch,
  useAppSelector,
} from '../store'
import SubscriberTableSearch from './SubscriberTableSearch'
import SubscriberTableFilter from './SubscriberTableFilter'
import cloneDeep from 'lodash/cloneDeep'
import type { TableQueries } from '@/@types/common'
import { Link } from 'react-router-dom'

const SubscribersTableTools = () => {
  const dispatch = useAppDispatch()

  const inputRef = useRef<HTMLInputElement>(null)

  const tableData = useAppSelector(
    (state) => state.subscribers.data.tableData,
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
    dispatch(getSubscribers(data))
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
        <SubscriberTableSearch
          ref={inputRef}
          onInputChange={handleInputChange}
        />
        <SubscriberTableFilter />

        <div className="pb-4">
          <Button size="sm" onClick={onClearAll}>
            Clear All
          </Button>
        </div>
      </div>

      <div className="md:flex items-center gap-4 pb-4">
        <Link
          className="block lg:inline-block md:mb-0 mb-4"
          to="/subscribers/new"
        >
          <Button size="sm" variant="solid">
            Create Subscriber
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default SubscribersTableTools

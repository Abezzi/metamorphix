import { useEffect, useCallback, useMemo } from 'react'
import DataTable from '@/components/shared/DataTable'
import {
  getSubscribers,
  setTableData,
  setSelectedSubscriber,
  useAppDispatch,
  useAppSelector,
  toggleDeleteConfirmation,
  Subscriber,
} from '../store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
import type { OnSortParam, ColumnDef } from '@/components/shared/DataTable'
import { useNavigate } from 'react-router-dom'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import SubscriberDeleteConfirmation from './SubscriberDeleteConfirmation'

const ActionColumn = ({ row }: { row: Subscriber }) => {
  const { textTheme } = useThemeClass()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onEdit = () => {
    navigate(`/subscribers/edit/${row.id}`)
  }

  const onDelete = () => {
    dispatch(toggleDeleteConfirmation(true))
    dispatch(setSelectedSubscriber(row.id))
  }

  return (
    <div className="flex justify-end text-lg">
      <span
        className={`cursor-pointer p-2 hover:${textTheme}`}
        onClick={onEdit}
      >
        <HiOutlinePencil />
      </span>
      <span
        className="cursor-pointer p-2 hover:text-red-500"
        onClick={onDelete}
      >
        <HiOutlineTrash />
      </span>
    </div>
  )
}

const AllSubscribers = () => {
  const dispatch = useAppDispatch()
  const data = useAppSelector(
    (state) => state.subscribers.data.subscriberList,
  )
  const loading = useAppSelector((state) => state.subscribers.data.loading)
  const filterData = useAppSelector(
    (state) => state.subscribers.data.filterData,
  )

  const { pageIndex, pageSize, sort, query, total } = useAppSelector(
    (state) => state.subscribers.data.tableData,
  )

  const fetchData = useCallback(() => {
    dispatch(
      getSubscribers({ pageIndex, pageSize, sort, query, filterData }),
    )
  }, [pageIndex, pageSize, sort, query, filterData, dispatch])

  useEffect(() => {
    fetchData()
  }, [fetchData, pageIndex, pageSize, sort, filterData])

  const tableData = useMemo(
    () => ({ pageIndex, pageSize, sort, query, total }),
    [pageIndex, pageSize, sort, query, total],
  )

  const columns: ColumnDef<Subscriber>[] = useMemo(
    () => [
      {
        header: 'Url',
        accessorKey: 'url',
      },
      {
        header: 'Method',
        accessorKey: 'method',
      },
      {
        header: 'Headers',
        accessorKey: 'headers',
        cell: (props) => {
          const headers = props.row.original.headers as Record<
            string,
            string
          > | null

          if (!headers || Object.keys(headers).length === 0) {
            return (
              <span className="text-gray-400 italic">
                No headers
              </span>
            )
          }

          return (
            <div className="max-w-xs">
              <div className="flex flex-wrap gap-1">
                {Object.entries(headers).map(([key, value]) => (
                  <div
                    key={key}
                    className="inline-flex items-center rounded bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-mono"
                    title={`${key}: ${value}`}
                  >
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {key}:
                    </span>{' '}
                    <span className="truncate max-w-[180px]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        },
      },
      {
        header: 'Pipeline ID',
        accessorKey: 'pipelineId',
      },
      {
        header: 'Created At',
        accessorKey: 'createdAt',
        cell: (props) => {
          const row = props.row.original
          return (
            <div className="flex items-center">
              {dayjs(row.createdAt).format('MM/DD/YYYY')}
            </div>
          )
        },
      },
      {
        header: '',
        id: 'action',
        cell: (props) => <ActionColumn row={props.row.original} />,
      },
    ],
    [],
  )

  const onPaginationChange = (page: number) => {
    const newTableData = cloneDeep(tableData)
    newTableData.pageIndex = page
    dispatch(setTableData(newTableData))
  }

  const onSelectChange = (value: number) => {
    const newTableData = cloneDeep(tableData)
    newTableData.pageSize = Number(value)
    newTableData.pageIndex = 1
    dispatch(setTableData(newTableData))
  }

  const onSort = (sort: OnSortParam) => {
    const newTableData = cloneDeep(tableData)
    newTableData.sort = sort
    dispatch(setTableData(newTableData))
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ width: 28, height: 28 }}
        loading={loading}
        pagingData={{
          total: tableData.total as number,
          pageIndex: tableData.pageIndex as number,
          pageSize: tableData.pageSize as number,
        }}
        onPaginationChange={onPaginationChange}
        onSelectChange={onSelectChange}
        onSort={onSort}
      />
      <SubscriberDeleteConfirmation />
    </>
  )
}

export default AllSubscribers

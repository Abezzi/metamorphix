import { useEffect, useCallback, useMemo } from 'react'
import DataTable from '@/components/shared/DataTable'
import {
  getJobs,
  setTableData,
  useAppDispatch,
  useAppSelector,
  Job,
} from '../store'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
import type { OnSortParam, ColumnDef } from '@/components/shared/DataTable'

const JobsHistory = () => {
  const dispatch = useAppDispatch()
  const data = useAppSelector((state) => state.jobs.data.jobList)
  const loading = useAppSelector((state) => state.jobs.data.loading)
  const filterData = useAppSelector((state) => state.jobs.data.filterData)

  const { pageIndex, pageSize, sort, query, total } = useAppSelector(
    (state) => state.jobs.data.tableData,
  )

  const fetchData = useCallback(() => {
    dispatch(getJobs({ pageIndex, pageSize, sort, query, filterData }))
  }, [pageIndex, pageSize, sort, query, filterData, dispatch])

  useEffect(() => {
    fetchData()
  }, [fetchData, pageIndex, pageSize, sort, filterData])

  const tableData = useMemo(
    () => ({ pageIndex, pageSize, sort, query, total }),
    [pageIndex, pageSize, sort, query, total],
  )

  const formatJson = (value: any): string => {
    if (!value) return '—'
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value)
        return JSON.stringify(parsed, null, 2)
      } catch {
        return value
      }
    }
    return JSON.stringify(value, null, 2)
  }

  const columns: ColumnDef<Job>[] = useMemo(
    () => [
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (props) => {
          const status = props.row.original.status
          const color =
            status === 'completed'
              ? 'text-emerald-500'
              : status === 'failed'
                ? 'text-red-500'
                : status === 'processing'
                  ? 'text-amber-500'
                  : 'text-blue-500'
          return (
            <span className={`font-medium capitalize ${color}`}>
              {status}
            </span>
          )
        },
      },
      {
        header: 'Input Payload',
        accessorKey: 'inputPayload',
        cell: (props) => {
          const payload = props.row.original.inputPayload
          const formatted = formatJson(payload)
          return (
            <div className="max-h-32 overflow-auto font-mono text-xs whitespace-pre bg-gray-50 dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700">
              {formatted}
            </div>
          )
        },
      },
      {
        header: 'Output Payload',
        accessorKey: 'outputPayload',
        cell: (props) => {
          const payload = props.row.original.outputPayload
          const formatted = formatJson(payload)
          return (
            <div className="max-h-32 overflow-auto font-mono text-xs whitespace-pre bg-gray-50 dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700">
              {formatted}
            </div>
          )
        },
      },
      {
        header: 'Error',
        accessorKey: 'error',
        cell: (props) => {
          const error = props.row.original.error
          return error ? (
            <div
              className="text-red-600 dark:text-red-400 text-sm max-w-xs truncate"
              title={error}
            >
              {error}
            </div>
          ) : (
            '—'
          )
        },
      },
      {
        header: 'Created At',
        accessorKey: 'createdAt',
        cell: (props) => {
          const row = props.row.original
          return dayjs(row.createdAt).format('MM/DD/YYYY HH:mm')
        },
      },
      {
        header: 'Completed At',
        accessorKey: 'completedAt',
        cell: (props) => {
          const row = props.row.original
          return row.completedAt
            ? dayjs(row.completedAt).format('MM/DD/YYYY HH:mm')
            : '—'
        },
      },
      {
        header: 'Started At',
        accessorKey: 'startedAt',
        cell: (props) => {
          const row = props.row.original
          return row.startedAt
            ? dayjs(row.startedAt).format('MM/DD/YYYY HH:mm')
            : '—'
        },
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
    </>
  )
}

export default JobsHistory

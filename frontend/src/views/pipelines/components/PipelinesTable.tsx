import { useEffect, useCallback, useMemo } from 'react'
import Badge from '@/components/ui/Badge'
import DataTable from '@/components/shared/DataTable'
import {
  getPipelines,
  setTableData,
  setSelectedPipeline,
  setDrawerOpen,
  useAppDispatch,
  useAppSelector,
  Pipeline,
} from '../store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import PipelineEditDialog from './PipelineEditDialog'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
import type { OnSortParam, ColumnDef } from '@/components/shared/DataTable'

const ActionColumn = ({ row }: { row: Pipeline }) => {
  const { textTheme } = useThemeClass()
  const dispatch = useAppDispatch()

  const onEdit = () => {
    dispatch(setDrawerOpen())
    dispatch(setSelectedPipeline(row))
  }

  return (
    <div
      className={`${textTheme} cursor-pointer select-none font-semibold`}
      onClick={onEdit}
    >
      Edit
    </div>
  )
}

const AllPipelines = () => {
  const dispatch = useAppDispatch()
  const data = useAppSelector((state) => state.crmPipelines.data.pipelineList)
  const loading = useAppSelector((state) => state.crmPipelines.data.loading)
  const filterData = useAppSelector(
    (state) => state.crmPipelines.data.filterData,
  )

  const { pageIndex, pageSize, sort, query, total } = useAppSelector(
    (state) => state.crmPipelines.data.tableData,
  )

  const fetchData = useCallback(() => {
    dispatch(getPipelines({ pageIndex, pageSize, sort, query, filterData }))
  }, [pageIndex, pageSize, sort, query, filterData, dispatch])

  useEffect(() => {
    fetchData()
  }, [fetchData, pageIndex, pageSize, sort, filterData])

  const tableData = useMemo(
    () => ({ pageIndex, pageSize, sort, query, total }),
    [pageIndex, pageSize, sort, query, total],
  )

  const columns: ColumnDef<Pipeline>[] = useMemo(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Source URL',
        accessorKey: 'sourceUrl',
      },
      {
        header: 'Action Type',
        accessorKey: 'actionType',
      },
      {
        header: 'Active',
        accessorKey: 'isActive',
        cell: (props) => {
          const row = props.row.original
          return (
            <div className="flex items-center">
              <Badge
                className={
                  row.isActive
                    ? 'bg-emerald-500'
                    : 'bg-red-500'
                }
              />
              <span className="ml-2 rtl:mr-2 capitalize">
                {row.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          )
        },
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
        header: 'Updated At',
        accessorKey: 'updatedAt',
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
      <PipelineEditDialog />
    </>
  )
}

export default AllPipelines

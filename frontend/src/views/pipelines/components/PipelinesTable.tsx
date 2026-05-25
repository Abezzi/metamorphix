import { useEffect, useCallback, useMemo } from 'react'
import Badge from '@/components/ui/Badge'
import DataTable from '@/components/shared/DataTable'
import {
  getPipelines,
  setTableData,
  setSelectedPipeline,
  useAppDispatch,
  useAppSelector,
  toggleDeleteConfirmation,
  Pipeline,
} from '../store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
import type { OnSortParam, ColumnDef } from '@/components/shared/DataTable'
import { useNavigate } from 'react-router-dom'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import PipelineDeleteConfirmation from './PipelineDeleteConfirmation'

const ActionColumn = ({ row }: { row: Pipeline }) => {
  const { textTheme } = useThemeClass()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onEdit = () => {
    navigate(`/pipelines/edit/${row.id}`)
  }

  const onDelete = () => {
    dispatch(toggleDeleteConfirmation(true))
    dispatch(setSelectedPipeline(row.id))
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
      <PipelineDeleteConfirmation />
    </>
  )
}

export default AllPipelines

import { useEffect, useCallback, useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
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
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
import type { OnSortParam, ColumnDef } from '@/components/shared/DataTable'

const statusColor: Record<string, string> = {
  active: 'bg-emerald-500',
  blocked: 'bg-red-500',
}

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

const NameColumn = ({ row }: { row: Pipeline }) => {
  const { textTheme } = useThemeClass()

  return (
    <div className="flex items-center">
      <Avatar size={28} shape="circle" src={row.img} />
      <Link
        className={`hover:${textTheme} ml-2 rtl:mr-2 font-semibold`}
        to={`/app/crm/pipeline-details?id=${row.id}`}
      >
        {row.name}
      </Link>
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
        cell: (props) => {
          const row = props.row.original
          return <NameColumn row={row} />
        },
      },
      {
        header: 'Email',
        accessorKey: 'email',
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (props) => {
          const row = props.row.original
          return (
            <div className="flex items-center">
              <Badge className={statusColor[row.status]} />
              <span className="ml-2 rtl:mr-2 capitalize">
                {row.status}
              </span>
            </div>
          )
        },
      },
      {
        header: 'Last online',
        accessorKey: 'lastOnline',
        cell: (props) => {
          const row = props.row.original
          return (
            <div className="flex items-center">
              {dayjs.unix(row.lastOnline).format('MM/DD/YYYY')}
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

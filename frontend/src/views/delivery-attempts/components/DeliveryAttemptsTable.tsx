import { useEffect, useCallback, useMemo } from 'react'
import Badge from '@/components/ui/Badge'
import DataTable from '@/components/shared/DataTable'
import {
  getDeliveryAttempts,
  setTableData,
  // setSelectedDeliveryAttempt,
  useAppDispatch,
  useAppSelector,
  // toggleDeleteConfirmation,
  DeliveryAttempt,
} from '../store'
// import useThemeClass from '@/utils/hooks/useThemeClass'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
import type { OnSortParam, ColumnDef } from '@/components/shared/DataTable'
// import { useNavigate } from 'react-router-dom'
// import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
// import DeliveryAttemptDeleteConfirmation from './DeliveryAttemptDeleteConfirmation'

// const ActionColumn = ({ row }: { row: DeliveryAttempt }) => {
//   const { textTheme } = useThemeClass()
//   const dispatch = useAppDispatch()
//   const navigate = useNavigate()

// const onEdit = () => {
//   navigate(`/delivery-attempts/edit/${row.id}`)
// }

// const onDelete = () => {
//   dispatch(toggleDeleteConfirmation(true))
//   dispatch(setSelectedDeliveryAttempt(row.id))
// }
//
// return (
//   <div className="flex justify-end text-lg">
//     <span
//       className={`cursor-pointer p-2 hover:${textTheme}`}
//       onClick={onEdit}
//     >
//       <HiOutlinePencil />
//     </span>
//     <span
//       className="cursor-pointer p-2 hover:text-red-500"
//       onClick={onDelete}
//     >
//       <HiOutlineTrash />
//     </span>
//   </div>
// )
// }

const AllDeliveryAttempts = () => {
  const dispatch = useAppDispatch()
  const data = useAppSelector(
    (state) => state.deliveryAttempts.data.deliveryAttemptList,
  )
  const loading = useAppSelector(
    (state) => state.deliveryAttempts.data.loading,
  )
  const filterData = useAppSelector(
    (state) => state.deliveryAttempts.data.filterData,
  )

  const { pageIndex, pageSize, sort, query, total } = useAppSelector(
    (state) => state.deliveryAttempts.data.tableData,
  )

  const fetchData = useCallback(() => {
    dispatch(
      getDeliveryAttempts({
        pageIndex,
        pageSize,
        sort,
        query,
        filterData,
      }),
    )
  }, [pageIndex, pageSize, sort, query, filterData, dispatch])

  useEffect(() => {
    fetchData()
  }, [fetchData, pageIndex, pageSize, sort, filterData])

  const tableData = useMemo(
    () => ({ pageIndex, pageSize, sort, query, total }),
    [pageIndex, pageSize, sort, query, total],
  )

  const columns: ColumnDef<DeliveryAttempt>[] = useMemo(
    () => [
      {
        header: 'Job ID',
        accessorKey: 'jobId',
      },
      {
        header: 'Subscriber ID',
        accessorKey: 'subscriberId',
      },
      {
        header: 'Attempt Number',
        accessorKey: 'attemptNumber',
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (props) => {
          const row = props.row.original
          return (
            <div className="flex items-center">
              <Badge
                className={
                  row.status ? 'bg-emerald-500' : 'bg-red-500'
                }
              />
              <span className="ml-2 rtl:mr-2 capitalize">
                {row.status ? 'Active' : 'Inactive'}
              </span>
            </div>
          )
        },
      },
      {
        header: 'Status',
        accessorKey: 'status',
      },
      {
        header: 'Response Status',
        accessorKey: 'responseStatus',
      },
      {
        header: 'Response Body',
        accessorKey: 'responseBody',
      },
      {
        header: 'Error',
        accessorKey: 'error',
      },
      {
        header: 'Attempted At',
        accessorKey: 'attemptedAt',
        cell: (props) => {
          const row = props.row.original
          return (
            <div className="flex items-center">
              {dayjs(row.attemptedAt).format('MM/DD/YYYY')}
            </div>
          )
        },
      },
      // {
      //   header: '',
      //   id: 'action',
      //   cell: (props) => <ActionColumn row={props.row.original} />,
      // },
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
      {/* <DeliveryAttemptDeleteConfirmation /> */}
    </>
  )
}

export default AllDeliveryAttempts

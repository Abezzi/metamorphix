import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  apiGetDeliveryAttempts,
  // apiPutDeliveryAttempt,
  // apiGetDeliveryAttemptsStatistic,
  // apiDeleteDeliveryAttempt,
} from '@/services/DeliveryAttemptsService'
import type { TableQueries } from '@/@types/common'

export type DeliveryAttempt = {
  id: string
  jobId: string
  subscriberId: string
  attemptNumber: number
  status: string
  responseStatus: number
  responseBody: string
  error: string
  attemptedAt: string
}

type Statistic = {
  value: number
  growShrink: number
}

type DeliveryAttemptStatistic = {
  totalDeliveryAttempts: Statistic
  activeDeliveryAttempts: Statistic
  newDeliveryAttempts: Statistic
}

type Filter = {
  status: string
}

type GetDeliveryAttemptsResponse = {
  data: DeliveryAttempt[]
  total: number
}

// type GetDeliveryAttemptsStatisticResponse = DeliveryAttemptStatistic

export type DeliveryAttemptsState = {
  loading: boolean
  statisticLoading: boolean
  deliveryAttemptList: DeliveryAttempt[]
  statisticData: Partial<DeliveryAttemptStatistic>
  tableData: TableQueries
  filterData: Filter
  selectedDeliveryAttempt: string
  deleteConfirmation: boolean
}

export const SLICE_NAME = 'deliveryAttempts'

// export const getDeliveryAttemptStatistic = createAsyncThunk(
//   'deliveryAttempts/data/getDeliveryAttemptStatistic',
//   async () => {
//     const response =
//       await apiGetDeliveryAttemptsStatistic<GetDeliveryAttemptsStatisticResponse>()
//     return response.data
//   },
// )

export const getDeliveryAttempts = createAsyncThunk(
  'deliveryAttempts/data/getDeliveryAttempts',
  async (data: TableQueries & { filterData?: Filter }) => {
    const response = await apiGetDeliveryAttempts<
      GetDeliveryAttemptsResponse,
      TableQueries & { filterData?: Filter }
    >(data)
    return response.data
  },
)

// export const putDeliveryAttempt = createAsyncThunk(
//   'deliveryAttempts/data/putDeliveryAttempt',
//   async (data: DeliveryAttempt) => {
//     const response = await apiPutDeliveryAttempt(data)
//     return response.data
//   },
// )

// export const deleteDeliveryAttempt = async (data: {
//   id: string | string[]
// }) => {
//   const response = await apiDeleteDeliveryAttempt<
//     boolean,
//     { id: string | string[] }
//   >(data)
//   return response.data
// }

export const initialTableData: TableQueries = {
  total: 0,
  pageIndex: 1,
  pageSize: 10,
  query: '',
  sort: {
    order: '',
    key: '',
  },
}

export const initialFilterData = {
  status: '',
}

const initialState: DeliveryAttemptsState = {
  loading: false,
  statisticLoading: false,
  deliveryAttemptList: [],
  statisticData: {},
  tableData: initialTableData,
  filterData: initialFilterData,
  deleteConfirmation: false,
  selectedDeliveryAttempt: '',
}

const deliveryAttemptsSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    setTableData: (state, action) => {
      state.tableData = action.payload
    },
    setDeliveryAttemptList: (state, action) => {
      state.deliveryAttemptList = action.payload
    },
    setFilterData: (state, action) => {
      state.filterData = action.payload
    },
    setSelectedDeliveryAttempt: (state, action) => {
      state.selectedDeliveryAttempt = action.payload
    },
    toggleDeleteConfirmation: (state, action) => {
      state.deleteConfirmation = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDeliveryAttempts.fulfilled, (state, action) => {
        state.deliveryAttemptList = action.payload.data
        state.tableData.total = action.payload.total
        state.loading = false
      })
      .addCase(getDeliveryAttempts.pending, (state) => {
        state.loading = true
      })
    // .addCase(getDeliveryAttemptStatistic.fulfilled, (state, action) => {
    //   state.statisticData = action.payload
    //   state.statisticLoading = false
    // })
    // .addCase(getDeliveryAttemptStatistic.pending, (state) => {
    //   state.statisticLoading = true
    // })
  },
})

export const {
  setTableData,
  setDeliveryAttemptList,
  setFilterData,
  setSelectedDeliveryAttempt,
  toggleDeleteConfirmation,
} = deliveryAttemptsSlice.actions

export default deliveryAttemptsSlice.reducer

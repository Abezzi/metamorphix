import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetSubscribers } from '@/services/SubscriberService'
import type { TableQueries } from '@/@types/common'

export type Subscriber = {
  id: string
  pipelineId: string
  url: string
  method: string
  headers: object
  createdAt: string
}

type Statistic = {
  value: number
  growShrink: number
}

type SubscriberStatistic = {
  totalSubscribers: Statistic
  activeSubscribers: Statistic
  newSubscribers: Statistic
}

type Filter = {
  method: string
}

type GetSubscribersResponse = {
  data: Subscriber[]
  total: number
}

// type GetSubscribersStatisticResponse = SubscriberStatistic

export type SubscribersState = {
  loading: boolean
  statisticLoading: boolean
  subscriberList: Subscriber[]
  statisticData: Partial<SubscriberStatistic>
  tableData: TableQueries
  filterData: Filter
  selectedSubscriber: string
  deleteConfirmation: boolean
}

export const SLICE_NAME = 'subscribers'

// export const getSubscriberStatistic = createAsyncThunk(
//   'subscribers/data/getSubscriberStatistic',
//   async () => {
//     const response =
//       await apiGetSubscribersStatistic<GetSubscribersStatisticResponse>()
//     return response.data
//   },
// )

export const getSubscribers = createAsyncThunk(
  'subscribers/data/getSubscribers',
  async (data: TableQueries & { filterData?: Filter }) => {
    const response = await apiGetSubscribers<
      GetSubscribersResponse,
      TableQueries & { filterData?: Filter }
    >(data)
    return response.data
  },
)

// export const putSubscriber = createAsyncThunk(
//   'subscribers/data/putSubscriber',
//   async (data: Subscriber) => {
//     const response = await apiPutSubscriber(data)
//     return response.data
//   },
// )

// export const deleteSubscriber = async (data: { id: string | string[] }) => {
//   const response = await apiDeleteSubscriber<
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
  method: 'POST',
}

const initialState: SubscribersState = {
  loading: false,
  statisticLoading: false,
  subscriberList: [],
  statisticData: {},
  tableData: initialTableData,
  filterData: initialFilterData,
  deleteConfirmation: false,
  selectedSubscriber: '',
}

const subscribersSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    setTableData: (state, action) => {
      state.tableData = action.payload
    },
    setSubscriberList: (state, action) => {
      state.subscriberList = action.payload
    },
    setFilterData: (state, action) => {
      state.filterData = action.payload
    },
    setSelectedSubscriber: (state, action) => {
      state.selectedSubscriber = action.payload
    },
    toggleDeleteConfirmation: (state, action) => {
      state.deleteConfirmation = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubscribers.fulfilled, (state, action) => {
        state.subscriberList = action.payload.data
        state.tableData.total = action.payload.total
        state.loading = false
      })
      .addCase(getSubscribers.pending, (state) => {
        state.loading = true
      })
    // .addCase(getSubscriberStatistic.fulfilled, (state, action) => {
    //   state.statisticData = action.payload
    //   state.statisticLoading = false
    // })
    // .addCase(getSubscriberStatistic.pending, (state) => {
    //   state.statisticLoading = true
    // })
  },
})

export const {
  setTableData,
  setSubscriberList,
  setFilterData,
  setSelectedSubscriber,
  toggleDeleteConfirmation,
} = subscribersSlice.actions

export default subscribersSlice.reducer

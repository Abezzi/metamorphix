import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  apiGetPipelines,
  apiPutPipeline,
  apiGetPipelinesStatistic,
} from '@/services/PipelineService'
import type { TableQueries } from '@/@types/common'

export type Pipeline = {
  id: string
  name: string
  description: string
  sourceUrl: string
  actionType: string
  actionConfig: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

type Statistic = {
  value: number
  growShrink: number
}

type PipelineStatistic = {
  totalPipelines: Statistic
  activePipelines: Statistic
  newPipelines: Statistic
}

type Filter = {
  isActive: string
}

type GetPipelinesResponse = {
  data: Pipeline[]
  total: number
}

type GetPipelinesStatisticResponse = PipelineStatistic

export type PipelinesState = {
  loading: boolean
  statisticLoading: boolean
  pipelineList: Pipeline[]
  statisticData: Partial<PipelineStatistic>
  tableData: TableQueries
  filterData: Filter
  drawerOpen: boolean
  selectedPipeline: Partial<Pipeline>
}

export const SLICE_NAME = 'crmPipelines'

export const getPipelineStatistic = createAsyncThunk(
  'crmPipelines/data/getPipelineStatistic',
  async () => {
    const response =
      await apiGetPipelinesStatistic<GetPipelinesStatisticResponse>()
    return response.data
  },
)

export const getPipelines = createAsyncThunk(
  'crmPipelines/data/getPipelines',
  async (data: TableQueries & { filterData?: Filter }) => {
    const response = await apiGetPipelines<
      GetPipelinesResponse,
      TableQueries & { filterData?: Filter }
    >(data)
    return response.data
  },
)

export const putPipeline = createAsyncThunk(
  'crmPipelines/data/putPipeline',
  async (data: Pipeline) => {
    const response = await apiPutPipeline(data)
    return response.data
  },
)

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
  isActive: '',
}

const initialState: PipelinesState = {
  loading: false,
  statisticLoading: false,
  pipelineList: [],
  statisticData: {},
  tableData: initialTableData,
  filterData: initialFilterData,
  drawerOpen: false,
  selectedPipeline: {},
}

const pipelinesSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    setTableData: (state, action) => {
      state.tableData = action.payload
    },
    setPipelineList: (state, action) => {
      state.pipelineList = action.payload
    },
    setFilterData: (state, action) => {
      state.filterData = action.payload
    },
    setSelectedPipeline: (state, action) => {
      state.selectedPipeline = action.payload
    },
    setDrawerOpen: (state) => {
      state.drawerOpen = true
    },
    setDrawerClose: (state) => {
      state.drawerOpen = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPipelines.fulfilled, (state, action) => {
        state.pipelineList = action.payload.data
        state.tableData.total = action.payload.total
        state.loading = false
      })
      .addCase(getPipelines.pending, (state) => {
        state.loading = true
      })
      .addCase(getPipelineStatistic.fulfilled, (state, action) => {
        state.statisticData = action.payload
        state.statisticLoading = false
      })
      .addCase(getPipelineStatistic.pending, (state) => {
        state.statisticLoading = true
      })
  },
})

export const {
  setTableData,
  setPipelineList,
  setFilterData,
  setSelectedPipeline,
  setDrawerOpen,
  setDrawerClose,
} = pipelinesSlice.actions

export default pipelinesSlice.reducer

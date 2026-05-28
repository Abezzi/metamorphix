import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetJob } from '@/services/JobService'
import type { TableQueries } from '@/@types/common'

export type Job = {
  id: string
  pipelineId: string
  status: string
  inputPayload: object
  outputPayload: object
  error: string
  startedAt: string
  completedAt: string
  createdAt: string
}

type Statistic = {
  value: number
  growShrink: number
}

type JobStatistic = {
  totalJobs: Statistic
  activeJobs: Statistic
  newJobs: Statistic
}

type Filter = {
  status: string
}

type GetJobsResponse = {
  data: Job[]
  total: number
}

export type JobsState = {
  loading: boolean
  statisticLoading: boolean
  jobList: Job[]
  statisticData: Partial<JobStatistic>
  tableData: TableQueries
  filterData: Filter
  selectedJob: string
  deleteConfirmation: boolean
}

export const SLICE_NAME = 'jobs'

export const getJobs = createAsyncThunk(
  'jobs/data/getJobs',
  async (data: TableQueries & { filterData?: Filter }) => {
    const response = await apiGetJob<
      GetJobsResponse,
      TableQueries & { filterData?: Filter }
    >(data)
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
  status: 'completed',
}

const initialState: JobsState = {
  loading: false,
  statisticLoading: false,
  jobList: [],
  statisticData: {},
  tableData: initialTableData,
  filterData: initialFilterData,
  deleteConfirmation: false,
  selectedJob: '',
}

const jobsSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    setTableData: (state, action) => {
      state.tableData = action.payload
    },
    setJobList: (state, action) => {
      state.jobList = action.payload
    },
    setFilterData: (state, action) => {
      state.filterData = action.payload
    },
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getJobs.fulfilled, (state, action) => {
        state.jobList = action.payload.data
        state.tableData.total = action.payload.total
        state.loading = false
      })
      .addCase(getJobs.pending, (state) => {
        state.loading = true
      })
  },
})

export const { setTableData, setJobList, setFilterData, setSelectedJob } =
  jobsSlice.actions

export default jobsSlice.reducer

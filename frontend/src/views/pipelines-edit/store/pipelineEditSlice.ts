import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  apiGetPipeline,
  apiPutPipeline,
  apiDeletePipeline,
} from '@/services/PipelineService'

type PipelineData = {
  id?: string
  name?: string
  description?: string
  sourceUrl?: string
  actionType?: string
  actionConfig?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export type PipelineEditState = {
  loading: boolean
  pipelineData: PipelineData
}

type GetPipelineResponse = PipelineData

export const SLICE_NAME = 'pipelineEdit'

export const getPipeline = createAsyncThunk(
  SLICE_NAME + '/getPipelines',
  async (data: { id: string }) => {
    const response = await apiGetPipeline<
      GetPipelineResponse,
      { id: string }
    >(data)
    return response.data
  },
)

export const updatePipeline = async <T, U extends Record<string, unknown>>(
  data: U,
) => {
  const response = await apiPutPipeline<T, U>(data)
  return response.data
}

export const deletePipeline = async <T, U extends Record<string, unknown>>(
  data: U,
) => {
  const response = await apiDeletePipeline<T, U>(data)
  return response.data
}

const initialState: PipelineEditState = {
  loading: true,
  pipelineData: {},
}

const pipelineEditSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPipeline.fulfilled, (state, action) => {
        state.pipelineData = action.payload
        state.loading = false
      })
      .addCase(getPipeline.pending, (state) => {
        state.loading = true
      })
  },
})

export default pipelineEditSlice.reducer

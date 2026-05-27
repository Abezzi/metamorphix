import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  apiGetSubscriber,
  apiPutSubscriber,
  apiDeleteSubscriber,
} from '@/services/SubscriberService'

type SubscriberData = {
  id?: string
  url?: string
  method?: string
  headers?: string
  createdAt?: string
  updatedAt?: string
}

export type SubscriberEditState = {
  loading: boolean
  subscriberData: SubscriberData
}

type GetSubscriberResponse = SubscriberData

export const SLICE_NAME = 'subscriberEdit'

export const getSubscriber = createAsyncThunk(
  SLICE_NAME + '/getSubscribers',
  async (data: { id: string }) => {
    const response = await apiGetSubscriber<
      GetSubscriberResponse,
      { id: string }
    >(data)
    return response.data
  },
)

export const updateSubscriber = async <T, U extends Record<string, unknown>>(
  data: U,
) => {
  const response = await apiPutSubscriber<T, U>(data)
  return response.data
}

export const deleteSubscriber = async <T, U extends Record<string, unknown>>(
  data: U,
) => {
  const response = await apiDeleteSubscriber<T, U>(data)
  return response.data
}

const initialState: SubscriberEditState = {
  loading: true,
  subscriberData: {},
}

const subscriberEditSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSubscriber.fulfilled, (state, action) => {
        state.subscriberData = action.payload
        state.loading = false
      })
      .addCase(getSubscriber.pending, (state) => {
        state.loading = true
      })
  },
})

export default subscriberEditSlice.reducer

import { combineReducers } from '@reduxjs/toolkit'
import reducers, { SLICE_NAME, PipelinesState } from './pipelinesSlice'
import reducers_subscribers, {
  SLICE_NAME as SUBSCRIBER_SLICE_NAME,
  SubscribersState,
} from '../../subscribers/store/subscribersSlice'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
  data: reducers,
  data_subscribers: reducers_subscribers,
})

export const useAppSelector: TypedUseSelectorHook<
  RootState & {
    [SLICE_NAME]: {
      data: PipelinesState
    }
    [SUBSCRIBER_SLICE_NAME]: {
      data_subscribers: SubscribersState
    }
  }
> = useSelector

export * from './pipelinesSlice'
export { useAppDispatch } from '@/store'
export default reducer

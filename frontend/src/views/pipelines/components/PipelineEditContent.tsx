import { forwardRef } from 'react'
import {
  setPipelineList,
  putPipeline,
  setDrawerClose,
  useAppDispatch,
  useAppSelector,
  Pipeline,
} from '../store'
import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
import PipelineForm, { FormikRef, FormModel } from '@/views/pipelines-form'
import dayjs from 'dayjs'

const PipelineEditContent = forwardRef<FormikRef>((_, ref) => {
  const dispatch = useAppDispatch()

  const pipeline = useAppSelector(
    (state) => state.crmPipelines.data.selectedPipeline,
  )
  const data = useAppSelector((state) => state.crmPipelines.data.pipelineList)
  const { id } = pipeline

  const onFormSubmit = (values: FormModel) => {
    const {
      name,
      birthday,
      email,
      img,
      location,
      title,
      phoneNumber,
      facebook,
      twitter,
      pinterest,
      linkedIn,
    } = values

    const basicInfo = { name, email, img }
    const personalInfo = {
      location,
      title,
      birthday: dayjs(birthday).format('DD/MM/YYYY'),
      phoneNumber,
      facebook,
      twitter,
      pinterest,
      linkedIn,
    }
    let newData = cloneDeep(data)
    let editedPipeline: Partial<Pipeline> = {}
    newData = newData.map((elm) => {
      if (elm.id === id) {
        elm = { ...elm, ...basicInfo }
        elm.personalInfo = { ...elm.personalInfo, ...personalInfo }
        editedPipeline = elm
      }
      return elm
    })
    if (!isEmpty(editedPipeline)) {
      dispatch(putPipeline(editedPipeline as Pipeline))
    }
    dispatch(setDrawerClose())
    dispatch(setPipelineList(newData))
  }

  return (
    <PipelineForm
      ref={ref}
      pipeline={pipeline}
      onFormSubmit={onFormSubmit}
    />
  )
})

PipelineEditContent.displayName = 'PipelineEditContent'

export type { FormikRef }

export default PipelineEditContent

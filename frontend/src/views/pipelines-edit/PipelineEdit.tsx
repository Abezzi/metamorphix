import { useEffect } from 'react'
import Loading from '@/components/shared/Loading'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import reducer, {
  getPipeline,
  updatePipeline,
  deletePipeline,
  useAppSelector,
  useAppDispatch,
} from './store'
import { injectReducer } from '@/store'
import { useLocation, useNavigate } from 'react-router-dom'

import PipelineForm, {
  FormModel,
  SetSubmitting,
  OnDeleteCallback,
} from '@/views/pipelines-form/PipelineForm'
import isEmpty from 'lodash/isEmpty'

injectReducer('pipelineEdit', reducer)

const PipelineEdit = () => {
  const dispatch = useAppDispatch()

  const location = useLocation()
  const navigate = useNavigate()

  const pipelineData = useAppSelector(
    (state) => state.pipelineEdit.data.pipelineData,
  )
  const loading = useAppSelector((state) => state.pipelineEdit.data.loading)

  const fetchData = (data: { id: string }) => {
    dispatch(getPipeline(data))
  }

  const handleFormSubmit = async (
    values: FormModel,
    setSubmitting: SetSubmitting,
  ) => {
    setSubmitting(true)
    const success = await updatePipeline(values)
    setSubmitting(false)
    if (success) {
      popNotification('updated')
    }
  }

  const handleDiscard = () => {
    navigate('/pipelines/list')
  }

  const handleDelete = async (setDialogOpen: OnDeleteCallback) => {
    setDialogOpen(false)
    const success = await deletePipeline({ id: pipelineData.id })
    if (success) {
      popNotification('deleted')
    }
  }

  const popNotification = (keyword: string) => {
    toast.push(
      <Notification
        title={`Successfuly ${keyword}`}
        type="success"
        duration={2500}
      >
        Pipeline successfuly {keyword}
      </Notification>,
      {
        placement: 'top-center',
      },
    )
    navigate('/pipelines/list')
  }

  useEffect(() => {
    const path = location.pathname.substring(
      location.pathname.lastIndexOf('/') + 1,
    )
    const rquestParam = { id: path }
    fetchData(rquestParam)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <>
      <Loading loading={loading}>
        {!isEmpty(pipelineData) && (
          <>
            <PipelineForm
              type="edit"
              initialData={pipelineData}
              onFormSubmit={handleFormSubmit}
              onDiscard={handleDiscard}
              onDelete={handleDelete}
            />
          </>
        )}
      </Loading>
      {!loading && isEmpty(pipelineData) && (
        <div className="h-full flex flex-col items-center justify-center">
          <DoubleSidedImage
            src="/img/others/img-2.png"
            darkModeSrc="/img/others/img-2-dark.png"
            alt="No pipeline found!"
          />
          <h3 className="mt-8">No pipeline found!</h3>
        </div>
      )}
    </>
  )
}

export default PipelineEdit

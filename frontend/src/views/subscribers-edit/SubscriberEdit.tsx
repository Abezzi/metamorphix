import { useEffect } from 'react'
import Loading from '@/components/shared/Loading'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import reducer, {
  getSubscriber,
  updateSubscriber,
  deleteSubscriber,
  useAppSelector,
  useAppDispatch,
} from './store'
import { injectReducer } from '@/store'
import { useLocation, useNavigate } from 'react-router-dom'

import SubscriberForm, {
  FormModel,
  SetSubmitting,
  OnDeleteCallback,
} from '@/views/subscribers-form/SubscriberForm'
import isEmpty from 'lodash/isEmpty'

injectReducer('subscriberEdit', reducer)

const SubscriberEdit = () => {
  const dispatch = useAppDispatch()

  const location = useLocation()
  const navigate = useNavigate()

  const subscriberData = useAppSelector(
    (state) => state.subscriberEdit.data.subscriberData,
  )
  const loading = useAppSelector((state) => state.subscriberEdit.data.loading)

  const fetchData = (data: { id: string }) => {
    dispatch(getSubscriber(data))
  }

  const handleFormSubmit = async (
    values: FormModel,
    setSubmitting: SetSubmitting,
  ) => {
    setSubmitting(true)
    const success = await updateSubscriber(values)
    setSubmitting(false)
    if (success) {
      popNotification('updated')
    }
  }

  const handleDiscard = () => {
    navigate('/subscribers/list')
  }

  const handleDelete = async (setDialogOpen: OnDeleteCallback) => {
    setDialogOpen(false)
    const success = await deleteSubscriber({ id: subscriberData.id })
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
        Subscriber successfuly {keyword}
      </Notification>,
      {
        placement: 'top-center',
      },
    )
    navigate('/subscribers/list')
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
        {!isEmpty(subscriberData) && (
          <>
            <SubscriberForm
              type="edit"
              initialData={subscriberData}
              onFormSubmit={handleFormSubmit}
              onDiscard={handleDiscard}
              onDelete={handleDelete}
            />
          </>
        )}
      </Loading>
      {!loading && isEmpty(subscriberData) && (
        <div className="h-full flex flex-col items-center justify-center">
          <DoubleSidedImage
            src="/img/others/img-2.png"
            darkModeSrc="/img/others/img-2-dark.png"
            alt="No subscriber found!"
          />
          <h3 className="mt-8">No subscriber found!</h3>
        </div>
      )}
    </>
  )
}

export default SubscriberEdit

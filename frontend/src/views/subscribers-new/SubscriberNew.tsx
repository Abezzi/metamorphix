import SubscriberForm, {
  FormModel,
  SetSubmitting,
} from '@/views/subscribers-form/SubscriberForm'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'
import { apiCreateSubscriber } from '@/services/SubscriberService'

const SubscriberNew = () => {
  const navigate = useNavigate()

  const addSubscriber = async (data: FormModel) => {
    const response = await apiCreateSubscriber<boolean, FormModel>(data)
    return response.data
  }

  const handleFormSubmit = async (
    values: FormModel,
    setSubmitting: SetSubmitting,
  ) => {
    setSubmitting(true)
    const success = await addSubscriber(values)
    setSubmitting(false)
    if (success) {
      toast.push(
        <Notification
          title={'Successfully added'}
          type="success"
          duration={2500}
        >
          Subscriber successfully added
        </Notification>,
        {
          placement: 'top-center',
        },
      )
      navigate('/subscribers/all-subscribers')
    }
  }

  const handleDiscard = () => {
    navigate('/subscribers/all-subscribers')
  }

  return (
    <>
      <SubscriberForm
        type="new"
        onFormSubmit={handleFormSubmit}
        onDiscard={handleDiscard}
      />
    </>
  )
}

export default SubscriberNew

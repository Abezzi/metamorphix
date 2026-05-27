import PipelineForm, {
  FormModel,
  SetSubmitting,
} from '@/views/pipelines-form/PipelineForm'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'
import { apiCreatePipeline } from '@/services/PipelineService'

const PipelineNew = () => {
  const navigate = useNavigate()

  const addPipeline = async (data: FormModel) => {
    const response = await apiCreatePipeline<boolean, FormModel>(data)
    return response.data
  }

  const handleFormSubmit = async (
    values: FormModel,
    setSubmitting: SetSubmitting,
  ) => {
    setSubmitting(true)
    const success = await addPipeline(values)
    setSubmitting(false)
    if (success) {
      toast.push(
        <Notification
          title={'Successfully added'}
          type="success"
          duration={2500}
        >
          Pipeline successfully added
        </Notification>,
        {
          placement: 'top-center',
        },
      )
      navigate('/pipelines/all-pipelines')
    }
  }

  const handleDiscard = () => {
    navigate('/pipelines/all-pipelines')
  }

  return (
    <>
      <PipelineForm
        type="new"
        onFormSubmit={handleFormSubmit}
        onDiscard={handleDiscard}
      />
    </>
  )
}

export default PipelineNew

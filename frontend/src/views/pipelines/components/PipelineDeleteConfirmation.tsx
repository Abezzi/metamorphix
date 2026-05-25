import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
  toggleDeleteConfirmation,
  deletePipeline,
  getPipelines,
  useAppDispatch,
  useAppSelector,
} from '../store'

const PipelineDeleteConfirmation = () => {
  const dispatch = useAppDispatch()
  const dialogOpen = useAppSelector(
    (state) => state.crmPipelines.data.deleteConfirmation,
  )
  const selectedPipeline = useAppSelector(
    (state) => state.crmPipelines.data.selectedPipeline,
  )
  const tableData = useAppSelector(
    (state) => state.crmPipelines.data.tableData,
  )

  const onDialogClose = () => {
    dispatch(toggleDeleteConfirmation(false))
  }

  const onDelete = async () => {
    dispatch(toggleDeleteConfirmation(false))
    const success = await deletePipeline({ id: selectedPipeline })

    if (success) {
      dispatch(getPipelines(tableData))
      toast.push(
        <Notification
          title={'Successfuly Deleted'}
          type="success"
          duration={2500}
        >
          Pipeline successfuly deleted
        </Notification>,
        {
          placement: 'top-center',
        },
      )
    }
  }

  return (
    <ConfirmDialog
      isOpen={dialogOpen}
      type="danger"
      title="Delete pipeline"
      confirmButtonColor="red-600"
      onClose={onDialogClose}
      onRequestClose={onDialogClose}
      onCancel={onDialogClose}
      onConfirm={onDelete}
    >
      <p>
        Are you sure you want to delete this pipeline? All record
        related to this pipeline will be deleted as well. This action
        cannot be undone.
      </p>
    </ConfirmDialog>
  )
}

export default PipelineDeleteConfirmation

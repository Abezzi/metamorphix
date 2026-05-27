import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
  toggleDeleteConfirmation,
  deleteSubscriber,
  getSubscribers,
  useAppDispatch,
  useAppSelector,
} from '../store'

const SubscriberDeleteConfirmation = () => {
  const dispatch = useAppDispatch()
  const dialogOpen = useAppSelector(
    (state) => state.subscribers.data.deleteConfirmation,
  )
  const selectedSubscriber = useAppSelector(
    (state) => state.subscribers.data.selectedSubscriber,
  )
  const tableData = useAppSelector(
    (state) => state.subscribers.data.tableData,
  )

  const onDialogClose = () => {
    dispatch(toggleDeleteConfirmation(false))
  }

  const onDelete = async () => {
    dispatch(toggleDeleteConfirmation(false))
    const success = await deleteSubscriber({ id: selectedSubscriber })

    if (success) {
      dispatch(getSubscribers(tableData))
      toast.push(
        <Notification
          title={'Successfuly Deleted'}
          type="success"
          duration={2500}
        >
          Subscriber successfuly deleted
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
      title="Delete subscriber"
      confirmButtonColor="red-600"
      onClose={onDialogClose}
      onRequestClose={onDialogClose}
      onCancel={onDialogClose}
      onConfirm={onDelete}
    >
      <p>
        Are you sure you want to delete this subscriber? All record
        related to this subscriber will be deleted as well. This action
        cannot be undone.
      </p>
    </ConfirmDialog>
  )
}

export default SubscriberDeleteConfirmation

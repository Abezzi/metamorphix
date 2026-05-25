import { forwardRef, useMemo, useState } from 'react'
import { FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import hooks from '@/components/ui/hooks'
import StickyFooter from '@/components/shared/StickyFooter'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Form, Formik, FormikProps } from 'formik'
import BasicInformationFields from './BasicInformationFields'
// import PricingFields from './PricingFields'
// import OrganizationFields from './OrganizationFields'
// import PipelineImages from './PipelineImages'
import cloneDeep from 'lodash/cloneDeep'
import { HiOutlineTrash } from 'react-icons/hi'
import { AiOutlineSave } from 'react-icons/ai'
import * as Yup from 'yup'

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type FormikRef = FormikProps<any>

type InitialData = {
  id?: string
  name?: string
  description?: string
  actionType?: string
  actionConfig?: any
  isActive?: boolean
}

export type FormModel = {
  id?: string
  name: string
  description: string
  actionType: string
  actionConfig: object
  isActive: boolean
}

export type SetSubmitting = (isSubmitting: boolean) => void

export type OnDeleteCallback = React.Dispatch<React.SetStateAction<boolean>>

type OnDelete = (callback: OnDeleteCallback) => void

type PipelineForm = {
  initialData?: InitialData
  type: 'edit' | 'new'
  onDiscard?: () => void
  onDelete?: OnDelete
  onFormSubmit: (formData: FormModel, setSubmitting: SetSubmitting) => void
}

const { useUniqueId } = hooks

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Pipeline Name Required'),
  actionConfig: Yup.string().test(
    'valid-json',
    'Action Config must be valid JSON',
    (value) => {
      if (!value) return true
      try {
        JSON.parse(value)
        return true
      } catch {
        return false
      }
    },
  ),
})

const DeletePipelineButton = ({ onDelete }: { onDelete: OnDelete }) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const onConfirmDialogOpen = () => {
    setDialogOpen(true)
  }

  const onConfirmDialogClose = () => {
    setDialogOpen(false)
  }

  const handleConfirm = () => {
    onDelete?.(setDialogOpen)
  }

  return (
    <>
      <Button
        className="text-red-600"
        variant="plain"
        size="sm"
        icon={<HiOutlineTrash />}
        type="button"
        onClick={onConfirmDialogOpen}
      >
        Delete
      </Button>
      <ConfirmDialog
        isOpen={dialogOpen}
        type="danger"
        title="Delete pipeline"
        confirmButtonColor="red-600"
        onClose={onConfirmDialogClose}
        onRequestClose={onConfirmDialogClose}
        onCancel={onConfirmDialogClose}
        onConfirm={handleConfirm}
      >
        <p>
          Are you sure you want to delete this pipeline? All record
          related to this pipeline will be deleted as well. This
          action cannot be undone.
        </p>
      </ConfirmDialog>
    </>
  )
}

const PipelineForm = forwardRef<FormikRef, PipelineForm>((props, ref) => {
  const {
    type,
    initialData = {
      id: '',
      name: '',
      description: '',
      actionType: '',
      actionConfig: '{}',
      isActive: false,
    },
    onFormSubmit,
    onDiscard,
    onDelete,
  } = props

  const newId = useUniqueId('pipeline-')

  // converts actionConfig from object to string for the form
  const initialValues = useMemo(() => {
    const data = cloneDeep(initialData)

    let actionConfigString = '{}'

    if (data.actionConfig) {
      if (typeof data.actionConfig === 'object') {
        actionConfigString = JSON.stringify(data.actionConfig, null, 2)
      } else if (typeof data.actionConfig === 'string') {
        actionConfigString = data.actionConfig
      }
    }

    return {
      ...data,
      actionConfig: actionConfigString,
    }
  }, [initialData])

  const handleSubmit = (values: any, { setSubmitting }: any) => {
    const formData = cloneDeep(values)

    // transform actionConfig string to object before sending to backend
    let actionConfigObject = {}

    try {
      if (formData.actionConfig?.trim()) {
        actionConfigObject = JSON.parse(formData.actionConfig)
      }
    } catch (error) {
      // this should rarely happen due to Yup validation, but just in case
      alert('Invalid JSON in Action Config')
      setSubmitting(false)
      return
    }

    const payload: FormModel = {
      ...formData,
      actionConfig: actionConfigObject,
    }

    if (type === 'new') {
      payload.id = newId
    }

    onFormSubmit(payload, setSubmitting)
  }

  return (
    <>
      <Formik
        innerRef={ref}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <BasicInformationFields
                    touched={touched}
                    errors={errors}
                  />
                  {/*
                  <PricingFields
                    touched={touched}
                    errors={errors}
                  />
                  <OrganizationFields
                    touched={touched}
                    errors={errors}
                    values={values}
                  />
                */}
                </div>
                {/*
                <div className="lg:col-span-1">
                  <PipelineImages values={values} />
                </div>
                */}
              </div>
              <StickyFooter
                className="-mx-8 px-8 flex items-center justify-between py-4"
                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <div>
                  {type === 'edit' && (
                    <DeletePipelineButton
                      onDelete={onDelete as OnDelete}
                    />
                  )}
                </div>
                <div className="md:flex items-center">
                  <Button
                    size="sm"
                    className="ltr:mr-3 rtl:ml-3"
                    type="button"
                    onClick={() => onDiscard?.()}
                  >
                    Discard
                  </Button>
                  <Button
                    size="sm"
                    variant="solid"
                    loading={isSubmitting}
                    icon={<AiOutlineSave />}
                    type="submit"
                  >
                    Save
                  </Button>
                </div>
              </StickyFooter>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </>
  )
})

PipelineForm.displayName = 'PipelineForm'

export default PipelineForm

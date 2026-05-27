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
// import SubscriberImages from './SubscriberImages'
import cloneDeep from 'lodash/cloneDeep'
import { HiOutlineTrash } from 'react-icons/hi'
import { AiOutlineSave } from 'react-icons/ai'
import * as Yup from 'yup'

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type FormikRef = FormikProps<any>

type InitialData = {
  id?: string
  url?: string
  method?: string
  headers?: any
}

export type FormModel = {
  id?: string
  url: string
  method: string
  headers: object
}

export type SetSubmitting = (isSubmitting: boolean) => void

export type OnDeleteCallback = React.Dispatch<React.SetStateAction<boolean>>

type OnDelete = (callback: OnDeleteCallback) => void

type SubscriberForm = {
  initialData?: InitialData
  type: 'edit' | 'new'
  onDiscard?: () => void
  onDelete?: OnDelete
  onFormSubmit: (formData: FormModel, setSubmitting: SetSubmitting) => void
}

const { useUniqueId } = hooks

const validationSchema = Yup.object().shape({
  url: Yup.string()
    .url('Must be a valid URL')
    .required('Subscriber url Required'),
  method: Yup.string().oneOf(
    ['POST', 'GET', 'DELETE', 'PUT', 'PATCH'],
    'Method must be one of: POST, GET, DELETE, PUT, PATCH',
  ),
  headers: Yup.string().test(
    'valid-json',
    'Headers must be valid JSON',
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

const DeleteSubscriberButton = ({ onDelete }: { onDelete: OnDelete }) => {
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

const SubscriberForm = forwardRef<FormikRef, SubscriberForm>((props, ref) => {
  const {
    type,
    initialData = {
      id: '',
      url: '',
      method: '',
      headers: '{}',
    },
    onFormSubmit,
    onDiscard,
    onDelete,
  } = props

  const newId = useUniqueId('pipeline-')

  // converts headers from object to string for the form
  const initialValues = useMemo(() => {
    const data = cloneDeep(initialData)

    let headersString = '{}'

    if (data.headers) {
      if (typeof data.headers === 'object') {
        headersString = JSON.stringify(data.headers, null, 2)
      } else if (typeof data.headers === 'string') {
        headersString = data.headers
      }
    }

    return {
      ...data,
      headers: headersString,
    }
  }, [initialData])

  const handleSubmit = (values: any, { setSubmitting }: any) => {
    const formData = cloneDeep(values)

    // transform headers string to object before sending to backend
    let headersObject = {}

    try {
      if (formData.headers?.trim()) {
        headersObject = JSON.parse(formData.headers)
      }
    } catch (error) {
      // this should rarely happen due to Yup validation, but just in case
      alert('Invalid JSON in Headers')
      setSubmitting(false)
      return
    }

    const payload: FormModel = {
      ...formData,
      headers: headersObject,
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
                  <SubscriberImages values={values} />
                </div>
                */}
              </div>
              <StickyFooter
                className="-mx-8 px-8 flex items-center justify-between py-4"
                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <div>
                  {type === 'edit' && (
                    <DeleteSubscriberButton
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

SubscriberForm.displayName = 'SubscriberForm'

export default SubscriberForm

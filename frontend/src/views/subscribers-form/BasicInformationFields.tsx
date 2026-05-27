import AdaptableCard from '@/components/shared/AdaptableCard'
import RichTextEditor from '@/components/shared/RichTextEditor'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik'

type FormFieldsName = {
  url: string
  method: string
  headers: string
}

type BasicInformationFields = {
  touched: FormikTouched<FormFieldsName>
  errors: FormikErrors<FormFieldsName>
}

const BasicInformationFields = (props: BasicInformationFields) => {
  const { touched, errors } = props

  return (
    <AdaptableCard divider className="mb-4">
      <h5>Basic Information</h5>
      <p className="mb-6">
        Section to config basic subscriber information
      </p>
      <FormItem
        label="Subscriber URL"
        invalid={(errors.url && touched.url) as boolean}
        errorMessage={errors.url}
      >
        <Field
          type="text"
          autoComplete="off"
          name="url"
          placeholder="www.my-url.com/api/information"
          component={Input}
        />
      </FormItem>
      <FormItem
        label="Method"
        invalid={(errors.method && touched.method) as boolean}
        errorMessage={errors.method}
      >
        <Field
          type="text"
          autoComplete="off"
          name="method"
          placeholder="POST"
          component={Input}
        />
      </FormItem>
      <FormItem
        label="Headers"
        invalid={(errors.headers && touched.headers) as boolean}
        errorMessage={errors.headers}
      >
        <Field
          textArea
          type="text"
          autoComplete="off"
          name="headers"
          placeholder="{}"
          component={Input}
        />
      </FormItem>
    </AdaptableCard>
  )
}

export default BasicInformationFields

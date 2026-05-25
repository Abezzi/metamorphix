import AdaptableCard from '@/components/shared/AdaptableCard'
import RichTextEditor from '@/components/shared/RichTextEditor'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik'
import { Switcher } from '@/components/ui'

type FormFieldsName = {
  name: string
  description: string
  actionType: string
  actionConfig: string
  isActive: boolean
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
      <p className="mb-6">Section to config basic pipeline information</p>
      <FormItem
        label="Pipeline Name"
        invalid={(errors.name && touched.name) as boolean}
        errorMessage={errors.name}
      >
        <Field
          type="text"
          autoComplete="off"
          name="name"
          placeholder="Name"
          component={Input}
        />
      </FormItem>
      <FormItem
        label="Description"
        labelClass="justify-start!"
        invalid={(errors.description && touched.description) as boolean}
        errorMessage={errors.description}
      >
        <Field name="description">
          {({ field, form }: FieldProps) => (
            <RichTextEditor
              value={field.value}
              onChange={(val) =>
                form.setFieldValue(field.name, val)
              }
            />
          )}
        </Field>
      </FormItem>
      <FormItem
        label="Action Type"
        invalid={(errors.actionType && touched.actionType) as boolean}
        errorMessage={errors.actionType}
      >
        <Field
          type="text"
          autoComplete="off"
          name="actionType"
          placeholder="transform"
          component={Input}
        />
      </FormItem>
      <FormItem
        label="Action Config"
        invalid={
          (errors.actionConfig && touched.actionConfig) as boolean
        }
        errorMessage={errors.actionConfig}
      >
        <Field
          textArea
          type="text"
          autoComplete="off"
          name="actionConfig"
          placeholder="{}"
          component={Input}
        />
      </FormItem>
      <FormItem
        label="Active"
        invalid={(errors.isActive && touched.isActive) as boolean}
        errorMessage={errors.isActive}
      >
        <Field name="isActive">
          {({ field, form }: FieldProps) => (
            <Switcher
              checked={field.value}
              checkedContent="Active"
              unCheckedContent="Inactive"
              onChange={(checked: boolean) =>
                form.setFieldValue('isActive', !checked)
              }
            />
          )}
        </Field>
      </FormItem>
    </AdaptableCard>
  )
}

export default BasicInformationFields

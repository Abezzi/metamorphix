import { forwardRef } from 'react'
import Tabs from '@/components/ui/Tabs'
import { FormContainer } from '@/components/ui/Form'
import { Form, Formik, FormikProps } from 'formik'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import * as Yup from 'yup'
import PersonalInfoForm from './PersonalInfoForm'
import SocialLinkForm from './SocialLinkForm'

type BasePipelineInfo = {
  name: string
  email: string
  img: string
}

type PipelinePersonalInfo = {
  location: string
  title: string
  phoneNumber: string
  birthday: string
  facebook: string
  twitter: string
  pinterest: string
  linkedIn: string
}

export type Pipeline = BasePipelineInfo & PipelinePersonalInfo

export interface FormModel extends Omit<Pipeline, 'birthday'> {
  birthday: Date
}

export type FormikRef = FormikProps<FormModel>

export type PipelineProps = Partial<
  BasePipelineInfo & { personalInfo: PipelinePersonalInfo }
>

type PipelineFormProps = {
  pipeline: PipelineProps
  onFormSubmit: (values: FormModel) => void
}

dayjs.extend(customParseFormat)

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email Required'),
  name: Yup.string().required('User Name Required'),
  location: Yup.string(),
  title: Yup.string(),
  phoneNumber: Yup.string().matches(
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
    'Phone number is not valid',
  ),
  birthday: Yup.string(),
  facebook: Yup.string(),
  twitter: Yup.string(),
  pinterest: Yup.string(),
  linkedIn: Yup.string(),
  img: Yup.string(),
})

const { TabNav, TabList, TabContent } = Tabs

const PipelineForm = forwardRef<FormikRef, PipelineFormProps>((props, ref) => {
  const { pipeline, onFormSubmit } = props

  return (
    <Formik<FormModel>
      innerRef={ref}
      initialValues={{
        name: pipeline.name || '',
        email: pipeline.email || '',
        img: pipeline.img || '',
        location: pipeline?.personalInfo?.location || '',
        title: pipeline?.personalInfo?.title || '',
        phoneNumber: pipeline?.personalInfo?.phoneNumber || '',
        birthday: (pipeline?.personalInfo?.birthday &&
          dayjs(
            pipeline.personalInfo.birthday,
            'DD/MM/YYYY',
          ).toDate()) as Date,
        facebook: pipeline?.personalInfo?.facebook || '',
        twitter: pipeline?.personalInfo?.twitter || '',
        pinterest: pipeline?.personalInfo?.pinterest || '',
        linkedIn: pipeline?.personalInfo?.linkedIn || '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onFormSubmit?.(values)
        setSubmitting(false)
      }}
    >
      {({ touched, errors }) => (
        <Form>
          <FormContainer>
            <Tabs defaultValue="personalInfo">
              <TabList>
                <TabNav value="personalInfo">
                  Personal Info
                </TabNav>
                <TabNav value="social">Social</TabNav>
              </TabList>
              <div className="p-6">
                <TabContent value="personalInfo">
                  <PersonalInfoForm
                    touched={touched}
                    errors={errors}
                  />
                </TabContent>
                <TabContent value="social">
                  <SocialLinkForm
                    touched={touched}
                    errors={errors}
                  />
                </TabContent>
              </div>
            </Tabs>
          </FormContainer>
        </Form>
      )}
    </Formik>
  )
})

PipelineForm.displayName = 'PipelineForm'

export default PipelineForm

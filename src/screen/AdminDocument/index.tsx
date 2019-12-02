import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { RootState } from 'internal/interface'
import { Redirect } from 'react-router-dom'
import { AppHeader } from 'internal/Header'
import { AppBody } from 'internal/AppWrapper'
import { DetailsList, DetailsListLayoutMode, PrimaryButton, Icon, Modal, PanelType, Panel, Stack, TextField } from 'office-ui-fabric-react'
import { api } from 'internal/ky'
import { Form, Formik, Field } from 'formik'
import { FormikTextField } from 'formik-office-ui-fabric-react'

export const AdminDocument = () => {
  const [docs, setDocs] = React.useState([])
  const [isOpen, setIsOpen] = React.useState(false)

  useEffect(() => {
    let params = new URLSearchParams()
    params.set('documentID', '')

    api
      .get('document', {
        searchParams: params,
      })
      .json()
      .then(({ data }: any) => {
        setDocs(data)
      })
  }, [])

  return (
    <>
      <AppHeader />
      <AppBody>
        <PrimaryButton onClick={() => setIsOpen(true)}>
          <Icon iconName='Add'></Icon>
          <span style={{ marginLeft: 5 }}>Tạo mới</span>
        </PrimaryButton>
        <Panel
          type={PanelType.medium}
          isLightDismiss
          headerText='Tạo tài khoản mới.'
          isOpen={isOpen}
          onDismiss={() => setIsOpen(false)}
          closeButtonAriaLabel='Close'
        >
          <Stack>
            <Formik
              initialValues={{ name: '', file: null }}
              onSubmit={values => {
                let form = new FormData()
                form.append('file', values.file!)
                form.append('attachment', values.name)
                form.append('fields', JSON.stringify([]))
                api.post('/document/create', { body: form })
              }}
            >
              {({ setFieldValue }) => {
                return (
                  <Form>
                    <Stack tokens={{ childrenGap: 20 }}>
                      <Stack.Item>
                        <Field component={FormikTextField} required={true} label={'Tên văn bản'} name='name' />
                      </Stack.Item>
                      <Stack.Item>
                        <input
                          type='file'
                          onChange={event => {
                            setFieldValue('file', event.target.files![0])
                          }}
                        />
                      </Stack.Item>
                      <Stack.Item>
                        <PrimaryButton type='submit' text='Lưu' />
                      </Stack.Item>
                    </Stack>
                  </Form>
                )
              }}
            </Formik>
          </Stack>
        </Panel>
        <DetailsList
          items={docs}
          columns={[
            {
              key: 'column_username',
              name: '#',
              onRender(_, i) {
                return ++i!
              },
              minWidth: 100,
              maxWidth: 200,
              isResizable: true,
            },
            {
              key: 'column_name',
              name: 'Document Name',
              fieldName: 'name',
              minWidth: 100,
              maxWidth: 200,
              isResizable: true,
            },
          ]}
          setKey='set'
          layoutMode={DetailsListLayoutMode.justified}
          selectionPreservedOnEmptyClick={true}
          ariaLabelForSelectionColumn='Toggle selection'
          ariaLabelForSelectAllCheckbox='Toggle selection for all items'
          checkButtonAriaLabel='Row checkbox'
        />
      </AppBody>
    </>
  )
}

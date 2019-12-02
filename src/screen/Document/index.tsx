import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { RootState } from 'internal/interface'
import { Redirect } from 'react-router-dom'
import { AppHeader } from 'internal/Header'
import {
  DocumentCard,
  DocumentCardType,
  DocumentCardPreview,
  IDocumentCardPreviewProps,
  getTheme,
  DocumentCardDetails,
  DocumentCardTitle,
  DocumentCardActivity,
  Stack,
  PrimaryButton,
  SearchBox,
  FontClassNames,
  ProgressIndicator,
} from 'office-ui-fabric-react'
import { api } from 'internal/ky'
import { Card } from '@uifabric/react-cards'
import { AppBody } from 'internal/AppWrapper'
import { Formik, Field, Form } from 'formik'
import { FormikTextField } from 'formik-office-ui-fabric-react'
import iziToast from 'izitoast'

const theme = getTheme()
const { palette, fonts } = theme

class AutoForm extends React.Component<{ selected: any }, any> {
  public state: any = { loading: false, loadingFilling: false, currentFilling: {} }

  public componentWillReceiveProps(nextProps: any) {
    if (nextProps.selected && nextProps.selected._id) {
      let query = new URLSearchParams()
      query.set('documentID', nextProps.selected._id)
      this.setState({ loadingFilling: true })
      api
        .get('filling/getByDocumentID', { searchParams: query })
        .json()
        .then(({ data }: any) => {
          this.setState({ currentFilling: data[0] || {} })
          this.setState({ loadingFilling: false })
        })
    }
  }

  public render(): JSX.Element {
    const { selected } = this.props
    const { currentFilling, loadingFilling } = this.state

    if (!selected) return <>Loading...</>
    if (!currentFilling) return <>Loading...</>
    let fields = currentFilling.fields || []

    return (
      <Card tokens={{ childrenMargin: 30, width: '90%', maxWidth: '90%' }} styles={{ root: { marginLeft: 20 } }}>
        <Card.Section>
          <h1 className={FontClassNames.large}>Bạn đang chọn: {selected.name}</h1>
        </Card.Section>
        <Card.Section>
          <Formik
            enableReinitialize={true}
            initialValues={{
              ...(selected.fields as any[]).reduce(
                (a, b) => {
                  let field = fields.find((v: any) => v && v.key === b.key)
                  a[b.key] = field ? field.value : ''
                  return a
                },
                {} as any,
              ),
              id: selected._id,
            }}
            onSubmit={values => {
              this.setState({ loading: true })
              api
                .post('filling/create', {
                  json: { documentID: selected._id, fields: Object.keys(values).map(v => ({ key: v, value: values[v] })) },
                })
                .json()
                .then(({ success, message }: any) => {
                  if (!success) {
                    iziToast.error({ message })
                  } else {
                    iziToast.success({ message })
                  }
                  this.setState({ loading: false })
                })
            }}
          >
            {props => {
              if (loadingFilling) return <ProgressIndicator />
              const fields = selected.fields.map((field: any) => {
                return (
                  <Stack.Item key={field._id}>
                    <Field component={FormikTextField} required={true} label={field.name} name={field.key} />
                  </Stack.Item>
                )
              })
              return (
                <Stack>
                  <Form>
                    <Stack tokens={{ childrenGap: '20 0' }}>
                      {fields}
                      <Stack.Item>
                        {!currentFilling._id && (
                          <PrimaryButton
                            disabled={this.state.loading}
                            styles={{ root: { marginRight: '3px' } }}
                            type='submit'
                            text='Nhập thông tin'
                          />
                        )}
                        {currentFilling._id && (
                          <PrimaryButton
                            disabled={this.state.loading}
                            type='button'
                            onClick={async () => {
                              this.setState({ loading: true })
                              await api.post('filling/update', {
                                json: {
                                  fillingID: currentFilling._id,
                                  fields: Object.keys(props.values).map(v => ({ key: v, value: props.values[v] })),
                                },
                              })

                              iziToast.info({ message: 'Cập nhật thành công!!' })

                              this.setState({ loading: false })
                            }}
                            text='Cập nhật'
                          />
                        )}
                      </Stack.Item>
                    </Stack>
                  </Form>
                </Stack>
              )
            }}
          </Formik>
        </Card.Section>
      </Card>
    )
  }
}

function DocumentList(props: any) {
  const [docs, setDocs] = React.useState([])
  const [selected, setSelected] = React.useState<any | null>(null)
  const [filterText, setFilterText] = React.useState<string>('')

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
        setSelected(data[0])
      })
  }, [])

  const docsView = (filterText.trim() !== ''
    ? docs.filter((v: any) => v.name.toLowerCase().includes(filterText.trim().toLowerCase()))
    : docs
  ).map((doc: any) => {
    const previewPropsUsingIcon: IDocumentCardPreviewProps = {
      previewImages: [
        {
          previewIconProps: {
            iconName: 'WordDocument',
            styles: {
              root: {
                fontSize: fonts.superLarge.fontSize,
                color: selected && selected._id === doc._id ? palette.white : palette.themePrimary,
              },
            },
          },
          width: 144,
        },
      ],
      styles: {
        previewIcon: { backgroundColor: selected && selected._id === doc._id ? palette.themePrimary : palette.white },
      },
    }

    return (
      <DocumentCard
        key={doc._id}
        aria-label='Document Card with icon. View and share files. Created by Aaron Reid a few minutes ago'
        type={DocumentCardType.compact}
        styles={{ root: { marginBottom: 10, height: '70px' } }}
        onClick={() => {
          setSelected(doc)
          iziToast.info({ message: 'Đã chọn' })
        }}
      >
        <DocumentCardPreview {...previewPropsUsingIcon} />
        <DocumentCardDetails>
          <DocumentCardTitle title={doc.name} shouldTruncate={true} styles={{ root: { marginTop: 16 } }} />
          {/* <DocumentCardActivity activity='Created a few minutes ago' people={[]} /> */}
        </DocumentCardDetails>
      </DocumentCard>
    )
  })

  return (
    <Stack tokens={{ childrenGap: 5 }} horizontal>
      <Stack grow={1}>
        <SearchBox
          styles={{ root: { marginBottom: 10 } }}
          placeholder='Tìm kiếm văn bản'
          onSearch={val => {
            setFilterText(val)
          }}
          onChange={event => {
            let value = event!.target!.value
            if (value.trim() == '') {
              setFilterText('')
            }
          }}
        />
        {docsView}
      </Stack>
      <Stack grow={4}>
        <AutoForm selected={selected} />
      </Stack>
    </Stack>
  )
}

export const DocumentRoute = () => {
  return (
    <>
      <AppHeader />
      <AppBody>
        <DocumentList />
      </AppBody>
    </>
  )
}

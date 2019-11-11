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
} from 'office-ui-fabric-react'
import { api } from 'internal/ky'
import { Card } from '@uifabric/react-cards'
import { AppWrapper } from 'internal/AppWrapper'
import { Formik, Field, Form } from 'formik'
import { FormikTextField } from 'formik-office-ui-fabric-react'
import iziToast from 'izitoast'

const theme = getTheme()
const { palette, fonts } = theme

const previewPropsUsingIcon: IDocumentCardPreviewProps = {
  previewImages: [
    {
      previewIconProps: { iconName: 'WordDocument', styles: { root: { fontSize: fonts.superLarge.fontSize, color: palette.white } } },
      width: 144,
    },
  ],
  styles: { previewIcon: { backgroundColor: palette.themePrimary } },
}

class AutoForm extends React.Component<{ selected: any }, any> {
  public state: any = { loading: false, currentFilling: {} }

  public componentWillReceiveProps(nextProps: any) {
    if (nextProps.selected && nextProps.selected._id) {
      let query = new URLSearchParams()
      query.set('documentID', nextProps.selected._id)
      api
        .get('filling/getByDocumentID', { searchParams: query })
        .json()
        .then(({ data }: any) => this.setState({ currentFilling: data[0] || {} }))
    }
  }

  private async _onUpdateForm(values: any) {
    this.setState({ loading: true })
  }

  public render(): JSX.Element {
    const { selected } = this.props
    const { currentFilling } = this.state

    if (!selected) return <>Loading...</>
    if (!currentFilling) return <>Loading...</>
    let fields = currentFilling.fields || []

    return (
      <Card tokens={{ childrenMargin: 30, width: '100%', maxWidth: '100%' }} styles={{ root: { marginLeft: 20 } }}>
        <Card.Section>
          <h1 className={FontClassNames.large}>Bạn đang chọn: {selected.name}</h1>
        </Card.Section>
        <Card.Section>
          <Formik
            initialValues={(selected.fields as any[]).reduce(
              (a, b) => {
                let field = fields.find((v: any) => v && v.key === b.key)
                a[b.key] = field ? field.value : ''
                return a
              },
              {} as any,
            )}
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
                        <PrimaryButton disabled={this.state.loading} type='submit' text='Nhập thông tin' />
                        <PrimaryButton
                          disabled={this.state.loading}
                          type='button'
                          onClick={() => this._onUpdateForm(props.values)}
                          text='Cập nhật'
                        />
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
    <Stack tokens={{ childrenGap: 5, padding: '0 40px' }} horizontal>
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
      <AppWrapper>
        <DocumentList />
      </AppWrapper>
    </>
  )
}

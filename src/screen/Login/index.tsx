import React from 'react'
import { Stack, Text, DefaultButton, ProgressIndicator, ColorClassNames } from 'office-ui-fabric-react'

import { Formik, Form, Field, FormikProps } from 'formik'
import { FormikTextField } from 'formik-office-ui-fabric-react'
import { accountsPassword, accountsClient } from 'internal/account'
import { Wrapper } from './styles'
import { connect } from 'react-redux'
import Toast from 'internal/toast'
import { AuthAction } from 'internal/interface'

class Values {
  username: string = ''
  password: string = ''
}

class State {
  errors: Partial<Error>[] = []
}

function mapState(state: any) {
  return { isLoggedIn: state.authentication.isLoggedIn }
}

type Props = ReturnType<typeof mapState> & any

export const Login = connect(
  mapState,
  dispatch => ({ dispatch }),
)(
  class Login extends React.Component<Props, State> {
    public state: State = new State()

    public componentDidMount() {
      if (this.props.isLoggedIn) {
        this.props.history.push('/')
      }
    }

    private _onSubmit = async (values: Values, { setSubmitting }: any) => {
      const { username, password } = values

      try {
        await accountsPassword.login({ user: { username }, password })

        // const {
        //   data: { me: user },
        // } = await apolloClient.query({ query: MeDocument })
        const user = await accountsClient.getUser()

        Toast.success({ message: 'Đăng nhập thành công' })

        this.props.dispatch({ type: AuthAction.LOGIN, user })
        this.props.history.push('/')
      } catch (err) {
        this.setState({ errors: [err] })
      }

      setSubmitting(false)
    }

    public render(): JSX.Element {
      return (
        <Wrapper>
          <Stack horizontal horizontalAlign='center'>
            <Text block variant='xxLarge'>
              Chào mừng trở lại
            </Text>
          </Stack>

          <br />

          <Formik initialValues={{ ...new Values() }} onSubmit={this._onSubmit} validateOnChange validateOnBlur>
            {(props: FormikProps<Values>) => {
              return (
                <Form>
                  <Stack tokens={{ childrenGap: '35 0' }}>
                    <Stack.Item>
                      {this.state.errors.map(err => (
                        <span key={`err` + err.message} className={ColorClassNames.red}>
                          {err.message}
                        </span>
                      ))}
                      <p />

                      <Field component={FormikTextField} required={true} underlined placeholder='Tài khoản đăng nhập' name='username' />
                    </Stack.Item>
                    <Stack.Item>
                      <Field
                        component={FormikTextField}
                        required={true}
                        underlined
                        placeholder='Mật khẩu'
                        type='password'
                        name='password'
                      />
                    </Stack.Item>

                    {/* <Stack horizontal horizontalAlign='end'> */}
                    <DefaultButton
                      styles={{ root: { width: '100%' } }}
                      text='Đăng nhập'
                      type='submit'
                      primary
                      onClick={props.submitForm}
                      disabled={props.isSubmitting || !props.isValid}
                    />
                    {/* </Stack> */}

                    {props.isSubmitting ? <ProgressIndicator /> : <hr style={{ marginTop: '9px', marginBottom: '7px' }} />}
                  </Stack>
                </Form>
              )
            }}
          </Formik>
        </Wrapper>
      )
    }
  },
)

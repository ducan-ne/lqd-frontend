import React from 'react'
import { Switch, HashRouter, Route, Redirect, withRouter, BrowserRouter } from 'react-router-dom'
import { Fabric, Nav } from 'office-ui-fabric-react'
import { Login } from './screen/Login'
import { Provider, connect } from 'react-redux'
import { store } from 'internal/store'
import { Home } from 'screen/Home'
import { RootState, AuthAction } from 'internal/interface'
import { accountsClient } from 'internal/account'
import { DocumentRoute } from 'screen/Document'
import { AdminUser } from 'screen/AdminUser'
import { AdminDocument } from 'screen/AdminDocument'
import { QuanLyDiemDanh } from 'screen/QuanLyDiemDanh'

// const AppRoute

const AppRouter = connect(
  (state: RootState) => ({
    isLoggedIn: state.authentication.isLoggedIn,
    loading: state.authentication.loading,
    user: state.authentication.user,
  }),
  dispatch => ({ dispatch }),
)(
  class View extends React.Component<any> {
    public componentDidMount() {
      accountsClient.getUser().then((user: any) => {
        if (user && user._id) {
          this.props.dispatch({ type: AuthAction.UPDATE, user: user })
        }
      })
    }
    public render(): JSX.Element | string {
      const { props } = this

      if (props.loading) return 'Loading...'

      return (
        <BrowserRouter>
          <Switch>
            {props.isLoggedIn ? (
              <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/docs' component={DocumentRoute} />
                <Route path='/admin/user' component={AdminUser} />
                <Route path='/admin/docs' component={AdminDocument} />
                <Route path='/quan-ly-diem-danh' component={QuanLyDiemDanh} />
                <Route path='*' render={() => <Redirect to='/' />} />
              </Switch>
            ) : (
              <Switch>
                <Route path='/login' component={Login} />
                <Route path='*' render={() => <Redirect to='/login' />} />
                {props.isLoggedIn && <Redirect to={window.location.hash.substr(1)} />}
              </Switch>
            )}
          </Switch>
        </BrowserRouter>
      )
    }
  },
)

const App: React.FC = () => {
  return (
    <Fabric>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </Fabric>
  )
}

export default App

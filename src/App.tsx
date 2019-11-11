import React from 'react'
import { Switch, HashRouter, Route, Redirect, withRouter } from 'react-router-dom'
import { Fabric } from 'office-ui-fabric-react'
import { Login } from './screen/Login'
import { Provider, connect } from 'react-redux'
import { store } from 'internal/store'
import { Home } from 'screen/Home'
import { RootState, AuthAction } from 'internal/interface'
import { accountsClient } from 'internal/account'
import { DocumentRoute } from 'screen/Document'

const AppRouter = connect(
  (state: RootState) => ({
    isLoggedIn: state.authentication.isLoggedIn,
    user: state.authentication.user,
  }),
  dispatch => ({ dispatch }),
)(
  withRouter(
    class View extends React.Component<any> {
      public componentDidMount() {
        accountsClient.getUser().then((user: any) => {
          if (user && user._id) {
            this.props.dispatch({ type: AuthAction.UPDATE, user: user })
            this.props.history.push('/')
          }
        })
      }
      public render(): JSX.Element {
        const { props } = this

        return props.isLoggedIn ? (
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/docs' component={DocumentRoute} />
            <Route path='*' render={() => <Redirect to='/' />} />
          </Switch>
        ) : (
          <Switch>
            <Route path='/login' component={Login} />
            <Route path='*' render={() => <Redirect to='/login' />} />
            {props.isLoggedIn && <Redirect to={window.location.hash.substr(1)} />}
          </Switch>
        )
      }
    },
  ),
)

const App: React.FC = () => {
  return (
    <Fabric>
      <Provider store={store}>
        <HashRouter>
          <AppRouter />
        </HashRouter>
      </Provider>
    </Fabric>
  )
}

export default App

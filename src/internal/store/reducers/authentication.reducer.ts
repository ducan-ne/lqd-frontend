import { AuthState, AuthAction, User } from '../../interface'

export function authentication(state: AuthState = new AuthState(), action: { type: AuthAction; user: User }): AuthState {
  switch (action.type) {
    case AuthAction.LOGOUT:
      return { loading: false, isLoggedIn: false, user: null }
    case AuthAction.LOGIN:
      return { loading: false, isLoggedIn: true, user: action.user }
    case AuthAction.UPDATE:
      return { loading: false, isLoggedIn: !!action.user, user: action.user || null }
    default:
      return state
  }
}

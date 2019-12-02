export type User = { id: string; username: string; balance: number } | any

export class AuthState {
  isLoggedIn: boolean = false
  loading: boolean = true
  user: User | null = null
}

export enum AuthAction {
  LOGOUT = 'logout',
  LOGIN = 'login',
  UPDATE = 'update',
}

export type RootState = { authentication: AuthState }

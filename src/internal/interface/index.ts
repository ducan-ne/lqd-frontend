export type User = { id: string; username: string; balance: number } | any

export class AuthState {
  public isLoggedIn: boolean = false
  public user: User | null = null
}

export enum AuthAction {
  LOGOUT = 'logout',
  LOGIN = 'login',
  UPDATE = 'update',
}

export type RootState = { authentication: AuthState }

import { combineReducers } from 'redux'

import { authentication } from './authentication.reducer'
import { RootState } from 'internal/interface'

export const rootReducer = combineReducers<RootState>({
  authentication,
})

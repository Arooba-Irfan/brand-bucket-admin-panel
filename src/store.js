import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'

import { composeWithDevTools } from 'redux-devtools-extension'
import { save, load } from 'redux-localstorage-simple'
import rootReducer from './redux/reducers/rootReducer'

const initialState = {
  sidebarShow: true,
}
const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(
  rootReducer,
  load(),
  composeWithDevTools(applyMiddleware(thunk, save({ ignoreStates: ['query'] }))),
)
export default store

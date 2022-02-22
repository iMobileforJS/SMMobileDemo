import AsyncStorage from '@react-native-community/async-storage'
import { applyMiddleware, createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import thunk from 'redux-thunk'
import reducers from './reducers'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [],
  blacklist: [],
}

const persistedReducers = persistReducer(persistConfig, reducers)
const store = createStore(persistedReducers, applyMiddleware(thunk))
const persistor = persistStore(store)

export {store, persistor}

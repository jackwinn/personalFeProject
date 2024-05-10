import { AnyAction, PayloadAction, combineReducers, configureStore } from '@reduxjs/toolkit'
import user from './features/userSlice'

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const appReducer = combineReducers({
  user: user,
  
})

const rootReducer = (state: any, action: AnyAction) => {
  if (action.type === 'USER_LOGOUT') {
    // remove data in all keys defined in persistConfig(s)
    localStorage.setItem('logoutFlag', Date.now().toString());
    storage.removeItem('persist:root')
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

// These types are commonly used in a Redux setup to provide type safety and enable better
// code completion and error checking when working with the Redux store and dispatching actions.

// This creates a Redux store, and also automatically configure the Redux DevTools extension
// so that you can inspect the store while developing.








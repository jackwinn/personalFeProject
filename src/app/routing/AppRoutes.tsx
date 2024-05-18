/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import {lazy, FC, useState, useEffect} from 'react'
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
import {PrivateRoutes} from './PrivateRoutes'
// import {ErrorsPage} from '../modules/errors/ErrorsPage'
import {AuthPage} from '../modules/auth'
import {App} from '../App'
import {useSelector, useDispatch} from 'react-redux'
import {RootState} from '../redux/store'
import {AppDispatch} from './../redux/store'
import axios from 'axios'
import {updateUserSlice} from '../redux/features/userSlice'

// page import

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
// const {PUBLIC_URL} = process.env

const AppRoutes: FC = () => {
  const userSlice = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch<AppDispatch>()

  const authorization = async () => {
    const url = `${process.env.REACT_APP_BACKEND}/protected-route`
    const config = {
      headers: {
        Authorization: 'Bearer ' + userSlice.token,
      },
    }
    try {
      const result = await axios.get(url, config)
      console.log(result.data)
      dispatch(updateUserSlice(result.data.user))   
    } catch (err) {
      console.error(err)    
    }
  }

  useEffect(() => {
    if (userSlice.token) {
      authorization()
    }
  }, [userSlice.token])

  return (
    <BrowserRouter basename={'/'}>
      <Routes>
        <Route element={<App />}>
          {userSlice._id ? (
            <>
              <Route path='/*' element={<PrivateRoutes />} />
            </>
          ) : (
            <>
              <Route path='/' element={<AuthPage />} />
              {/* any route doest match will fall back to / which is the login page*/}
              <Route path='*' element={<Navigate to='/' />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export {AppRoutes}

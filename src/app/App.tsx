import { Suspense, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { I18nProvider } from '../_metronic/i18n/i18nProvider'
import { LayoutProvider, LayoutSplashScreen } from '../_metronic/layout/core'
import { MasterInit } from '../_metronic/layout/MasterInit'
import { useDispatch, useSelector } from 'react-redux'
// import { RootState } from './redux/store'
import { Slide, ToastContainer } from 'react-toastify';

// import { updateUserSlice, logOut } from './redux/features/userSlice'
import lib from './biz/lib'

// biz
import sharedBiz from './biz/sharedBiz'

const App = () => {
  // const userSlice = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()


  useEffect(() => {
    const handleStorageChange = (event: any) => {
      if (event.key === 'logoutFlag') {
        dispatch({ type: 'USER_LOGOUT' })
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      // Clean up the event listener when the component is unmounted
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch])

  // const logoutAgent = () => {
  //   dispatch({ type: 'USER_LOGOUT' })
  //   //@ts-ignore
  //   window.location = '/'
  // }



  return (
    <>
      <Suspense fallback={<LayoutSplashScreen />}>
        <I18nProvider>
          <LayoutProvider>
            <ToastContainer autoClose={2000} draggable={false} transition={Slide} />           
            <Outlet />
            <MasterInit />
          </LayoutProvider>
        </I18nProvider>
      </Suspense>
    </>
  )
}

export { App }

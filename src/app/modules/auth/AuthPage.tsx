/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Login } from './components/Login'
// import { ForgotPassword } from './components/ForgotPassword'
// import { ResetPassword } from './components/ResetPassword'
import { toAbsoluteUrl } from '../../../_metronic/helpers'
import clsx from 'clsx'
// import IRoomzAuthLogo from '../../components/IRoomzAuthLogo';

const AuthPage = () => {
  const navigate = useNavigate();
  const STATE_LOGIN = 'LOGIN'
  const STATE_FORGOT = 'FORGOT'
  // const STATE_RESET = 'RESET'
  const [authState, setAuthState] = useState(STATE_LOGIN)

  useEffect(() => {
    document.body.classList.add('bg-body')
    return () => {
      document.body.classList.remove('bg-body')
    }
  }, [])

  const Outlet = () => {
    const handleChildData = (data: string) => {
      setAuthState(data)
    }

    // if (authState === STATE_FORGOT) return <ForgotPassword authState={handleChildData} />
    return <Login authState={handleChildData} />
  }

  return (
    <>
      <div className='d-flex flex-column flex-column-fluid auth-layout-wrapper'>
        {/* <img className='auth-layout-wrapper-layer' src={toAbsoluteUrl('/media/auth/auth-page-background-layer.png')} alt='coffee table' /> */}
        <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
          <div className={clsx('w-lg-500px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto auth-outlet-wrapper')}>
            <div className='text-center mb-11 auth-iroom-logo-wrapper'>
              {/* <IRoomzAuthLogo /> */}
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}

export { AuthPage }

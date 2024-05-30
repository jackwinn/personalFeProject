/* eslint-disable jsx-a11y/anchor-is-valid */
//packages
import { useEffect, useState, } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
// import {Link} from 'react-router-dom'
import { useFormik } from 'formik'

//redux
import { updateUserSlice } from '../../../redux/features/userSlice'
import { RootState } from '../../../redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'

//biz
import { userBiz } from '../../../biz/userBiz'

//setup data 
import { setupData } from '../../../data/setupData'

const loginSchema = Yup.object().shape({
  // email: Yup.string()
  //   .email('Wrong email format')
  //   .min(3, 'Minimum 3 symbols')
  //   .max(50, 'Maximum 50 symbols')
  //   .required('User name / email is required'),
  // password: Yup.string()
  //   .min(3, 'Minimum 3 symbols')
  //   .max(50, 'Maximum 50 symbols')
  //   .required('Password is required'),
})

const initialValues = {
  email: '',
  password: '',
}

export function Login(props: any) {
  const dispatch = useDispatch<AppDispatch>()
  const userSlice = useSelector((state: RootState) => state.user)
  const [loading, setLoading] = useState(false)


  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      if (!values.email) setStatus(`Email address is required`)
      else if (!values.password) setStatus(`Password is required`)
      else {
        setLoading(true)
        try {
          const loginParams = {
            email: values.email,
            password: values.password,
            role: "Admin"
          }
          const currentUser = await userBiz.login(loginParams)
          console.log(currentUser)
          if (currentUser.token) dispatch(updateUserSlice(currentUser))
          else if (currentUser.message) setStatus(currentUser.message)
          // lib.log("logged in user:")
          setLoading(false)
        } catch (err: any) {
          console.log(err)
          setStatus(setupData.systemErrorMessage)
        }
      }
    }
  })

  const handleAuthState = () => {
    props.authState('FORGOT')
    formik.setSubmitting(false)
  }

  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      <div className='separator separator-content my-14'>
        <span className='auth-title'>{"Admin"}</span>
      </div>
      {formik.status && (
        <div className='mb-lg-12 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      )}
      <div className='fv-row mb-8'>
        <div className='auth-input-box'>
          <label className='form-label '>Email Address</label>
          <input
            placeholder='Email address'
            {...formik.getFieldProps('email')}
            className={clsx('form-control bg-transparent auth-input-field')}
            type='email'
            name='email'
            autoComplete='on'
          />
        </div>
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>
      <div className='fv-row mb-3'>
        <div className='auth-input-box'>
          <label className='form-label '>Password</label>
          <input
            {...formik.getFieldProps('password')}
            className={clsx('form-control bg-transparent auth-input-field')}
            placeholder='password'
            type='password'
            autoComplete='off'
          />
        </div>
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>

      <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
        <span></span>
        <button onClick={handleAuthState} className='auth-forgot-button' type='button'>
          forgot password
        </button>
      </div>

      <div className='d-grid mb-10'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn auth-sign-in-button'
        // disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Login</span>}
          {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
    </form>
  )
}

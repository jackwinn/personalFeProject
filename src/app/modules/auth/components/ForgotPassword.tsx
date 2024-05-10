import { useState, useEffect } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
// import {Link} from 'react-router-dom'
import { useFormik } from 'formik'
import userComponent from '../../../biz/userBiz'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { RootState } from '../../../redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import { updateUserSlice } from '../../../redux/features/userSlice'

const initialValues = {
  // email: 'jack.nextsix@gmail.com',
  email: '',
}

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    // .email('Wrong email format')
    .required('Email is required'),
})

export function ForgotPassword(props: any) {
  const userSlice = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState("")
  const currentUrl = window.location.hostname;

  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      setSubmitting(false)
      try {
        // console.log(values)
        const result = await userComponent.forgotPassword({ ...values, role: userSlice.role ?? role })
        if (result) {
          setStatus(result.message)
          setHasErrors(false)
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setStatus(err.response.data.message)
          setHasErrors(true)
        }
      } finally {
        setLoading(false)
        setSubmitting(false)
      }
    },
  })

  const handleAuthState = () => {
    props.authState('LOGIN')
  }

  useEffect(() => {
    let newRole = "";

    if (currentUrl.includes('admin')) newRole = "Admin";
    else if (currentUrl.includes('landlord')) newRole = "Landlord";
    else if (currentUrl.includes('tenant')) newRole = "Tenant";
    else if (currentUrl.includes('operator')) newRole = "Operator";

    if (newRole !== userSlice.role) dispatch(updateUserSlice({ _id: null, role: newRole }));

    setRole(newRole)
  }, [currentUrl, userSlice.role, dispatch]);

  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_password_reset_form'
      onSubmit={formik.handleSubmit}
    >
      <div className='text-center mb-11 auth-nextsix-agent-logo'>
        <img src={`${toAbsoluteUrl('/media/auth/nextsix-agent-logo.png')}`} alt='' />
      </div>

      <div className='separator separator-content my-14'>
        <span className='auth-title'>{role}</span>
      </div>

      {/* begin::Title */}
      {hasErrors === true && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      )}

      {hasErrors === false && (
        // <div className='mb-10 bg-light-info p-8 rounded'>
        <div className='mb-lg-12 alert alert-success'>
          <div className='text-success'>{formik.status}</div>
        </div>
      )}
      {/* end::Title */}

      {/* begin::Form group */}
      <p className='form-label mb-3 auth-forgot-reminder'>
        Enter your email address and we will send you a password reset link.
      </p>
      <div className='fv-row mb-3'>
        <div className='auth-input-box'>
          <label className='form-label'>Email Address</label>
          <input
            type='email'
            placeholder='Email address'
            autoComplete='off'
            {...formik.getFieldProps('email')}
            className={clsx(
              'form-control bg-transparent auth-input-field',
              // { 'is-invalid': formik.touched.username && formik.errors.username },
              // {
              //   'is-valid': formik.touched.username && !formik.errors.username,
              // }
            )}
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
      {/* end::Form group */}

      <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
        <span></span>
        <button onClick={handleAuthState} className='auth-forgot-button' type='button'>
          back to sign in
        </button>
      </div>

      {/* begin::Form group */}
      <div className='d-grid mb-10'>
        <button
          type='submit'
          id='kt_password_reset_submit'
          className='btn auth-sign-in-button'
        // disabled={formik.isSubmitting || !formik.isValid}
        >
          <span className='indicator-label'>Submit</span>
          {loading && (
            <span className='indicator-progress'>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Form group */}
    </form>
  )
}

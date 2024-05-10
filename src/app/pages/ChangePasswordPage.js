// packages
import React, { useState } from 'react'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Spinner from 'react-bootstrap/Spinner';

// components

import lib from '../biz/lib'
import userProfileComponent from '../biz/userBiz'

const ChangePasswordPage = () => {
  const user = useSelector((state) => state.user);
  const [toast, setToast] = useState({ show: false, title: '', content: '' });
  const [loading, setLoading] = useState(false);

  const FormikHandler = () => {
    const formik = useFormik({
      initialValues: {
        oldPassword: '',
        newPassword: '',
        repeatNewPassword: ''
      },
      validationSchema: Yup.object({
        oldPassword: Yup.string()
          .trim()
          .required('Old password is required'),
        newPassword: Yup.string()
          .trim()
          .required('New password is required')
          .matches(
            /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}|:"<>?`\-=[\];',.]).{8,}$/,
            'Minimum eight characters, at least one uppercase letter, one number and one special character'
          )
        ,
        repeatNewPassword: Yup.string()
          .trim()
          .required('Repeat new password is required')
          .oneOf([Yup.ref('newPassword'), null], 'Passwords must match new password')
      }),
      onSubmit: async (values, { resetForm }) => {
        // console.log(values)
        setLoading(true);
        try {
          const { newPassword, oldPassword } = values;
          const param = {
            _id: user._id,
            newPassword,
            oldPassword
          }
          const result = await userProfileComponent.passwordCompare(param);
          // lib.log(result)
          let toastObj = {}
          if (result) {
            toastObj = { show: true, title: 'Password changed', content: 'Your password has been changed successfully' }
          } else {
            toastObj = { show: true, title: 'Password change Failed', content: 'Please check your passwords and try again' };
          }
          setToast(toastObj);
          resetForm()
        } catch (err) {
          lib.log(err);
        } finally {
          setLoading(false);
        }
      },
    })

    return (
      <form className='card card-custom card-shadow card-profile-right' onSubmit={formik.handleSubmit}>
        <div className='card-body'>
          <div>
            <div className='profile-edit-title'>Change Password</div>
            <div className='profile-edit-title-below'>Change your account password</div>
            <div className='edit-info-divider'>
              <hr />
            </div>
          </div>
          <div>
            <div className='profile-change-password-input'>
              <label className='personal-input-label form-label'>Old Password<span className='required'></span></label>
              <div className='profile-change-password-formik'>
                <input
                  type='password'
                  className='form-control personal-input-edit'
                  placeholder='Old Password'
                  name='oldPassword'
                  {...formik.getFieldProps('oldPassword')}
                  onblur={formik.handleBlur}
                />
                {formik.touched.oldPassword && formik.errors.oldPassword ? (
                  <span className='formik-error-msg' >{formik.errors.oldPassword}</span>
                ) : null}
              </div>
            </div>
            <div className='profile-change-password-input'>
              <label className='personal-input-label form-label'>New Password<span className='required'></span></label>
              <div className='profile-change-password-formik'>
                <input
                  type='password'
                  className='form-control personal-input-edit'
                  placeholder='New Password'
                  name='newPassword'
                  {...formik.getFieldProps('newPassword')}
                  onblur={formik.handleBlur}
                />
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <span className='formik-error-msg'>{formik.errors.newPassword}</span>
                )}
              </div>
            </div>

            <div className='profile-change-password-input'>
              <label className='personal-input-label form-label'>Repeat New Password<span className='required'></span></label>
              <div className='profile-change-password-formik'>
                <input
                  type='password'
                  className='form-control personal-input-edit'
                  placeholder='Repeat New Password'
                  name='repeatNewPassword'
                  {...formik.getFieldProps('repeatNewPassword')}
                />
                {formik.touched.repeatNewPassword && formik.errors.repeatNewPassword && (
                  <span className='formik-error-msg'>{formik.errors.repeatNewPassword}</span>
                )}
              </div>
            </div>
          </div>

          <div className='edit-info-divider' style={{ marginTop: '50px' }}>
            <hr />
          </div>
          <div className='profile-save-btn'>
            <button
              type='submit'
              className='btn btn-warning btn-lg right-drawer-sign-out'
            >
              {
                loading ?
                  <div className='profile-edit-loading'>
                    <div>
                      Please wait...
                    </div>
                    <Spinner animation="border" variant="light" />
                  </div>
                  : 'Save'
              }
            </button>
          </div>
        </div>
      </form>
    )
  }

  const ToastStrap = () => {
    return (
      <ToastContainer
        className="p-3 fixed-top"
        position={'top-center'}
        style={{ zIndex: 1 }}
      >
        <Toast
          onClose={() => setToast({ show: false })} show={toast.show} delay={5000} autohide>
          <Toast.Header className='toast-header-orange'>
            <h4 className="me-auto text-white">{toast.title}</h4>
          </Toast.Header>
          <Toast.Body>{toast.content}</Toast.Body>
        </Toast>
      </ToastContainer>
    );
  }

  return (
    <>
      <div className='profile-container'>
           <FormikHandler />
        <ToastStrap />
      </div>
    </>
  )
}

export default ChangePasswordPage

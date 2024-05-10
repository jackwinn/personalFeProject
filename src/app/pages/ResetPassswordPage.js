// packages
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from 'yup'
import clsx from 'clsx'
import { useFormik } from 'formik'
import OtpInput from 'react-otp-input';

// businesses
import credentialBiz from '../biz/credentialBiz'
import landlordDataBiz from '../biz/landlordDataBiz';

// libs
import lib from '../biz/lib';

// components
// import IRoomzAuthLogo from '../components/IRoomzAuthLogo';

const initialValues = {
    password: "",
    confirmPassword: ""
}

const resetPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .trim()
        .required('Password is required')
        .matches(
            /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}|:"<>?`\-=[\];',.]).{8,}$/,
            'Minimum eight characters, at least one uppercase letter, one number and one special character'
        ),
    confirmPassword: Yup.string().required('Confirm password is required')
})

export default function ResetPasswordPage(props) {
    const navigate = useNavigate()

    const [disableSubmit, setDisableSubmit] = useState(false)
    const [isLinkExpired, setIsLinkExpired] = useState(false)
    const [hasErrors, setHasErrors] = useState(undefined)

    const { secretKey } = useParams();
    const [userProfile, setUSerProfile] = useState(null);

    const [role, setRole] = useState("")
    const currentUrl = window.location.hostname;

    const [otp, setOtp] = useState("")

    const validateKey = async () => {
        const result = await credentialBiz.hashKey(secretKey);
        lib.log("keyProfile")
        lib.log(result?.isEmailExist);
        if (result) {
            setUSerProfile(result);
        } else {
            setIsLinkExpired(true)
        }
    };

    useEffect(() => {
        // console.log(`key? ${secretKey}`);
        if (secretKey) {
            validateKey();
        }
    }, []);

    useEffect(() => {
        let newRole = "";

        if (currentUrl.includes('admin')) newRole = "Admin";
        else if (currentUrl.includes('landlord')) newRole = "Landlord";
        else if (currentUrl.includes('tenant')) newRole = "Tenant";
        else if (currentUrl.includes('operator')) newRole = "Operator";

        setRole(newRole)
    }, [currentUrl]);

    const formik = useFormik({
        initialValues,
        validationSchema: resetPasswordSchema,
        onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
            setSubmitting(false)
            if (values.password !== values.confirmPassword) {
                setStatus('New password and confirm password do not match.')
                setHasErrors(true)
            }
            else if (userProfile?.isEmailExist === false) {
                if (!otp) {
                    setStatus('OTP is required.')
                    setHasErrors(true)
                } else {
                    try {
                        const validateOtp = await landlordDataBiz.validateOtp({ otp: otp, _id: userProfile.userId })
                        lib.log("OTP validation:")
                        lib.log(validateOtp)
                        if (validateOtp.ok) {
                            const result = await credentialBiz.save({ _id: userProfile._id, newPassword: values.confirmPassword, otp: otp })
                            // console.log(result)
                            if (result) {
                                setStatus('Password reset successfully. Sign in to continue.')
                                setDisableSubmit(true)
                                setHasErrors(false)
                            }
                        } else setStatus('Invalid OTP. Please try again')
                    } catch (err) {
                        setStatus('Password reset unsuccessful. Please try again later.')
                    } finally {
                        setSubmitting(false)
                    }
                }
            }
            else if (userProfile?.isEmailExist === true) {
                try {
                    const result = await credentialBiz.save({ _id: userProfile._id, newPassword: values.confirmPassword, otp: otp })
                    // console.log(result)
                    if (result) {
                        setStatus('Password reset successfully. Sign in to continue.')
                        setDisableSubmit(true)
                        setHasErrors(false)
                    }
                } catch (err) {
                    setStatus('Password reset unsuccessful. Please try again later.')
                } finally {
                    setSubmitting(false)
                }
            }
        }
    })

    const handleAuthState = () => {
        navigate("/")
    }

    return (
        <div className='d-flex flex-column flex-column-fluid auth-layout-wrapper'>
            <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
                <div className={clsx('w-lg-500px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto auth-outlet-wrapper')}>
                    <div className='separator separator-content my-14'>
                        <span className='auth-title'>{role}</span>
                    </div>
                    <div className='text-center mb-11 auth-iroom-logo-wrapper'>
                        {/* <IRoomzAuthLogo /> */}
                    </div>
                    <div>
                        {isLinkExpired === false ?
                            <form
                                className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
                                noValidate
                                id='kt_login_password_reset_form'
                                onSubmit={formik.handleSubmit}
                            >
                                <div className='text-center mb-11 auth-nextsix-agent-logo'>
                                    {/* <img src={`${toAbsoluteUrl('/media/auth/nextsix-agent-logo.png')}`} alt='' /> */}
                                </div>

                                {hasErrors === true && (
                                    <div className='mb-lg-15 alert alert-danger'>
                                        <div className='alert-text font-weight-bold'>{formik.status}</div>
                                    </div>
                                )}

                                {hasErrors === false && (
                                    <div className='mb-lg-12 alert alert-success'>
                                        <div className='text-success'>{formik.status}</div>
                                    </div>
                                )}

                                <p className='form-label mb-3 auth-forgot-reminder'>
                                    Enter your new password and confirm password
                                </p>
                                <div className='fv-row mb-8'>
                                    <div className='auth-input-box'>
                                        <label className='form-label '>New Password</label>
                                        <input
                                            type='password'
                                            placeholder='Password'
                                            autoComplete='off'
                                            {...formik.getFieldProps('password')}
                                            className={clsx(
                                                'form-control bg-transparent auth-input-field',
                                            )}
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

                                <div className='fv-row mb-3'>
                                    <div className='auth-input-box'>
                                        <label className='form-label '>Confirm New Password</label>
                                        <input
                                            type='password'
                                            placeholder='Password'
                                            autoComplete='off'
                                            {...formik.getFieldProps('confirmPassword')}
                                            className={clsx(
                                                'form-control bg-transparent auth-input-field',
                                            )}
                                        />
                                    </div>
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert'>{formik.errors.confirmPassword}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {role === "Landlord" && userProfile?.isEmailExist === false && <>
                                    <p className='form-label  eSign-tenant-mobile mt-6'>OTP</p>
                                    <OtpInput
                                        containerStyle={{ justifyContent: "center" }}
                                        inputStyle={{
                                            width: "40px",
                                            height: "40px",
                                            margin: '6px',
                                            border: '1px solid #e1e3ea',
                                            borderRadius: "5px",
                                            backgroundColor: '#fff'
                                        }}
                                        value={otp}
                                        onChange={setOtp}
                                        numInputs={6}
                                        // renderSeparator={<span>-</span>}
                                        renderInput={(props) => <input {...props} />}
                                    />
                                </>}

                                <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
                                    <span></span>
                                    <button onClick={handleAuthState} className='auth-forgot-button' type='button'>
                                        back to sign in
                                    </button>
                                </div>

                                <div className='d-grid mb-10'>
                                    <button
                                        type='submit'
                                        id='kt_sign_in_submit'
                                        className='btn auth-sign-in-button'
                                        disabled={disableSubmit}
                                    >
                                        <span className='indicator-label'>Confirm</span>
                                    </button>
                                </div>

                            </form> :
                            <p className='resetpassword-link-expired' >Sorry, the link has expired.</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import OtpInput from 'react-otp-input';
import SignatureCanvas from 'react-signature-canvas';

//biz
import eTenanciesBiz from '../biz/eTenanciesBiz';

//lib
import lib from '../biz/lib';

// import IRoomzAuthLogo from '../components/IRoomzAuthLogo';

function ESignAuthPage(props) {
    const { secretKey } = useParams();

    const [disableSubmit, setDisableSubmit] = useState(false)
    const [isLinkExpired, setIsLinkExpired] = useState(true)
    const [status, setStatus] = useState({
        error: '',
        success: ''
    })

    const [otp, setOtp] = useState("")
    const [refSign, setRefSign] = useState();
    const [accessKeyData, setETenancyData] = useState({})

    useEffect(() => {
        lib.log(otp)
    }, [otp])

    useEffect(() => {
        validateSecretKey()
    }, []);


    const validateSecretKey = async () => {
        const params = {
            secretKey: secretKey
        }
        const result = await eTenanciesBiz.validateSecretKey(params)
        lib.log('Secretkey validation:')
        lib.log(result)

        if (result) {
            setETenancyData(result)
            setIsLinkExpired(false)
        }
    }

    const handleSignAgreement = async () => {
        if (!refSign.isEmpty()) {
            const signature = refSign.getTrimmedCanvas().toDataURL('image/png');

            const params = {
                _id: accessKeyData._id,
                role: 'Tenant',
                signature: signature,
                otp: otp,
                mobile: accessKeyData.tenantMobile
            }
            lib.log("Tenant eSign Params")
            lib.log(params)

            try {
                const result = await eTenanciesBiz.signAgreement(params)
                lib.log("Tenant eSign result")
                lib.log(result)
                if (result) {
                    setStatus({ success: 'Thank You! Our friendly agent will reach out you shortly.' })
                    setDisableSubmit(true)
                }
            } catch (err) {
                setStatus({ error: err.response.data.message })
            }
        } else setStatus({ error: 'Signature is required.' })
    }

    return (
        <div className='d-flex flex-column flex-column-fluid auth-layout-wrapper'>
            <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
                <div className={clsx('w-lg-500px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto auth-outlet-wrapper')}>
                    <div className='separator separator-content my-14'>
                        <span className='auth-title'>{"Tenant E-Sign"}</span>
                    </div>
                    <div className='text-center mb-11 auth-iroom-logo-wrapper'>
                        {/* <IRoomzAuthLogo /> */}
                    </div>

                    {status.error && (
                        <div className='mb-lg-12 alert alert-danger'>
                            <div className='alert-text font-weight-bold'>{status.error}</div>
                        </div>
                    )}

                    {status.success && (
                        <div className='mb-lg-12 alert alert-success'>
                            <div className='text-success'>{status.success}</div>
                        </div>
                    )}

                    <p className='form-label eSign-tenant-mobile mb-6'>Mobile: {accessKeyData.tenantMobile}</p>

                    {isLinkExpired === false && <>
                        <div className='fv-row mb-8'>
                            <p className='form-label  eSign-tenant-mobile'>Signature</p>
                            <div className='eSign-canvas-wrap'>
                                <SignatureCanvas
                                    ref={(ref) => { setRefSign(ref) }}
                                    minWidth={1}
                                    maxWidth={1.3}
                                    canvasProps={{ className: 'signature-canvas' }} />
                            </div>
                            <div className='d-flex justify-content-center flex-wrap gap-3 fs-base fw-semibold mb-8'>
                                <button
                                    className='auth-forgot-button'
                                    type='button'
                                    onClick={() => refSign.clear()}
                                >
                                    clear
                                </button>
                            </div>

                            <p className='form-label  eSign-tenant-mobile mt-3'>OTP</p>
                            <OtpInput
                                containerStyle={{ justifyContent: "center", marginBottom: '2rem' }}
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
                        </div>
                        <div className='d-grid mb-10'>
                            <button
                                type='button'
                                className='btn auth-sign-in-button'
                                disabled={disableSubmit}
                                onClick={handleSignAgreement}
                            >
                                <span className='indicator-label'>Confirm</span>
                            </button>
                        </div>
                    </>}
                    {isLinkExpired === true && <p className='resetpassword-link-expired' >Sorry, the link has expired.</p>}
                </div>
            </div>
        </div>
    )
}

export default ESignAuthPage;
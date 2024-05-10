// packages
import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import Spinner from 'react-bootstrap/Spinner'
import { toast } from 'react-toastify';
import * as Yup from 'yup'
import AvatarEditor from 'react-avatar-editor'
import imageCompression from 'browser-image-compression'
import SignatureCanvas from 'react-signature-canvas';

// components


// redux 
import { updateUserSlice } from '../redux/features/userSlice'

// businesses
import regex from '../biz/regex'
import userBiz from '../biz/userBiz'
import sharedBiz from '../biz/sharedBiz';
import lib from '../biz/lib'
import clsx from 'clsx';

const UserProfilePage = () => {

    return (
        <div className='profile-container'>            
            <ProfileForm />
        </div >
    )
}

export default UserProfilePage;

const ProfileForm = () => {
    // redux
    const userSlice = useSelector((state) => state.user)
    const dispatch = useDispatch()

    // formik
    const requiredMsg = "This field is required";
    const initialValues = {
        personalName: userSlice?.personal?.name,
        personalGender: userSlice?.personal?.gender,
        personalIdentityNo: userSlice?.personal?.identity?.number,
        personalIdentityType: userSlice?.personal?.identity?.type,
        personalEmail: userSlice?.personal?.email,
        personalMobile: userSlice?.personal?.mobile,
        companyLogo: userSlice?.company?.logo,
        companyName: userSlice?.company?.name,
        companyContact: userSlice?.company?.contact,
        companyEmail: userSlice?.company?.email,
        companyRegNo: userSlice?.company?.regNo,
        companyLine1: userSlice?.company?.address?.line1,
        companyLine2: userSlice?.company?.address?.line2,
        companyPostcode: userSlice?.company?.address?.postcode,
        companyCity: userSlice?.company?.address?.city,
        companyState: userSlice?.company?.address?.state,
        companyArea: userSlice?.company?.address?.area,
        companyCountry: userSlice?.company?.address?.country || "Malaysia",
    }

    // yup
    const validationSchema = Yup.object({
        personalName: Yup.string().required(requiredMsg).test("", "Only alphabetic characters, /, @, and . are allowed", regex.isName),
        personalIdentityNo: Yup.string().when('personalIdentityType', {
            is: (val) => val === "NRIC",
            then: () => Yup.string().required(requiredMsg).test("", "Please enter in format: 123456-XX-XXXX", regex.isMalaysianIC),
            otherwise: () => Yup.string().required(requiredMsg)
        }),
        personalEmail: userSlice.role !== "Landlord" && Yup.string().required(requiredMsg).test("", "Please enter in format: name@example.com", regex.isValidEmail),
        personalMobile: Yup.string().required(requiredMsg).test("", "Only numbers are allowed", regex.isNumeric),
    })

    // avatar editor     
    const logoEditorRef = useRef();
    const logoInputRef = useRef()
    const logoTimeStamp = new Date().getTime();

    const [logoLoading, setLogoLoading] = useState(false)
    const [logoFile, setLogoFile] = useState("");
    const [companyLogo, setCompanyLogo] = useState(() => {
        return userSlice?.company?.logo ? `${userSlice?.company?.logo}?${logoTimeStamp}` : `${process.env.PUBLIC_URL}/media/profile/blank_avatar.svg`
    });

    // signature 
    const [refSign, setRefSign] = useState();
    const [editSignature, setEditSignature] = useState(false);

    const compressionOptions = {
        maxWidthOrHeight: 250,
        useWebWorker: true,
        initialQuality: 0.8,
    }

    // useEffect(() => {
    //     lib.log("user.company.logo")
    //     lib.log(user.company.logo)
    // }, [user.company.logo])

    // useEffect(() => {
    //     lib.log("editSignature")
    //     lib.log(editSignature)
    // }, [editSignature])

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {

            for (let key in values) {
                if (values[key]) {
                    values[key] = values[key].trim()
                }
            }

            let params = { _id: userSlice._id, ...values }

            if (editSignature === true) {
                if (!refSign.isEmpty()) {
                    params.personalSignature = refSign.getTrimmedCanvas().toDataURL('image/png');
                }
            }

            try {
                const verifyEmail = await isEmailsUnique("personal", "save")
                if (verifyEmail === true) {
                    const result = await userBiz.updateProfile(params)
                    if (result) {
                        let userData = {
                            ...result,
                            access: userSlice.access
                        }
                        toast.success("Profile saved successfully")
                        dispatch(updateUserSlice(userData))
                    }
                    setEditSignature(false)
                }
            } catch (err) {
                toast.error('Sorry, please try again later')
            }
        }
    })

    const isEmailsUnique = async (emailType, funcType) => {
        let result
        const params = {
            _id: userSlice._id,
            email: formik.values.personalEmail,
            role: userSlice.role
        }
        // console.log(params)
        if (emailType === "personal") result = await sharedBiz.isEmailUnique(params)
        // else result = await userBiz.isCompanyEmailUnique(params) // to be confirm

        if (result === true) {
            if (funcType === "check") { // do no need to display if save
                toast.success('Email is available')
            }
        }
        else toast.error('Sorry, email has been taken')

        return result
    }

    const handleLogoInputRefClick = () => {
        if (logoInputRef.current) {
            logoInputRef.current.click()
        }
    }

    const handleImageUpload = async (event) => {
        const imageFile = event.target.files[0] || null;
        if (imageFile?.size > 4194304) {
            toast.error('The image you selected exceeded 4MB')
        } else {
            setLogoFile(imageFile)
        }
    }

    const cropAndSave = async () => {
        const cropped = logoEditorRef.current.getImage().toDataURL();
        const response = await fetch(cropped);
        const blob = await response.blob();
        const file = new File([blob], "profile", { type: 'image/png' });

        const compressed = await imageCompression(file, compressionOptions)
        const reader = new FileReader();
        reader.readAsDataURL(compressed);
        reader.onload = async () => {
            setLogoLoading(true)
            try {
                const result = await userBiz.uploadCompanyLogo(userSlice._id, reader.result)
                if (result) {
                    // lib.log("saved result")
                    // lib.log(result)
                    setLogoFile("")
                    const companyLogo = `${result}?${logoTimeStamp}`
                    toast.success('Company logo has been uploaded')
                    setCompanyLogo(companyLogo)
                    dispatch(updateUserSlice({
                        ...userSlice,
                        company: {
                            ...userSlice.company,
                            logo: companyLogo
                        }
                    }))

                }
            } catch (err) {
                lib.log(err)
            } finally {
                setLogoLoading(false)
            }
        }
    }

    const toggleEditSignature = () => {
        setEditSignature(!editSignature)
    }

    return (
        <>
            <form
                className='card card-custom card-shadow card-profile-right'
                onSubmit={formik.handleSubmit}
            >
                <div className='card-body'>
                    <div>
                        <div className='profile-edit-title'>Personal Information</div>
                        <div className='profile-edit-title-below'>Update your personal information</div>
                        <div className='edit-info-divider'>
                            <hr />
                        </div>
                    </div>
                    <div>
                        <div className='profile-change-password-input'>
                            <label className='personal-input-label form-label required'>Full Name</label>
                            <div className='profile-change-password-formik'>
                                <input
                                    type='text'
                                    name='personalName'
                                    className='form-control personal-input-edit'
                                    placeholder='Full Name'
                                    defaultValue={formik.values.personalName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <span className='formik-error-msg'>{formik.errors.personalName}</span>
                            </div>
                        </div>

                        <div className='profile-container-personal-input'>
                            <label className='personal-input-label form-label' htmlFor='contactInput'>
                                Gender
                            </label>
                            <div className='personal-input-edit profile-gender'>
                                <div className='form-check'>
                                    <input
                                        className='form-check-input'
                                        type='radio'
                                        name='personalGender'
                                        value='Male'
                                        checked={formik.values.personalGender === 'Male'}
                                        onChange={formik.handleChange}
                                    />
                                    <label htmlFor='Male'>Male</label>
                                </div>

                                <div className='form-check'>
                                    <input
                                        className='form-check-input'
                                        type='radio'
                                        name='personalGender'
                                        value='Female'
                                        checked={formik.values.personalGender === 'Female'}
                                        onChange={formik.handleChange}
                                    />
                                    <label htmlFor='Female'>Female</label>
                                </div>
                                <span className='formik-error-msg'>{formik.errors.personalGender}</span>
                            </div>
                        </div>

                        <div className='profile-change-password-input'>
                            <label className='personal-input-label form-label required'>NRIC/Passport</label>
                            <div className='profile-change-password-formik'>
                                <input
                                    name='personalIdentityNo'
                                    type='text'
                                    className='form-control personal-input-edit'
                                    placeholder='NRIC/Passport'
                                    defaultValue={formik.values.personalIdentityNo}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <div className='profile-ic-passport-radio-container'>
                                    <div className='form-check'>
                                        <input
                                            className='form-check-input'
                                            type='radio'
                                            name='personalIdentityType'
                                            value='NRIC'
                                            checked={formik.values.personalIdentityType === 'NRIC'}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        <label htmlFor='NRIC'>NRIC</label>
                                    </div>
                                    <div className='form-check'>
                                        <input
                                            className='form-check-input'
                                            type='radio'
                                            name='personalIdentityType'
                                            value='Passport'
                                            checked={formik.values.personalIdentityType === 'Passport'}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        <label htmlFor='Passport'>Passport</label>
                                    </div>
                                    <span className='formik-error-msg'>{formik.errors.personalIdentityNo}</span>
                                </div>
                            </div>
                        </div>

                        <div className='profile-change-password-input'>
                            <label className={clsx('personal-input-label form-label', {
                                'required': userSlice.role !== "Landlord",
                            })}>Email</label>
                            <div className='profile-change-password-formik' style={{ position: "relative" }}>
                                <input
                                    name='personalEmail'
                                    type='email'
                                    className='form-control personal-input-edit'
                                    placeholder='Email'
                                    value={formik.values.personalEmail}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <button type="button" className='isEmailUnique' disabled={!formik.values.personalEmail} onClick={() => isEmailsUnique("personal", "check")}>Check</button>
                                <span className='formik-error-msg'>{formik.errors.personalEmail}</span>

                            </div>
                        </div>

                        <div className='profile-change-password-input'>
                            <label className='personal-input-label form-label required'>Contact Number</label>
                            <div className='profile-change-password-formik'>
                                <input
                                    type='text'
                                    name='personalMobile'
                                    className='form-control personal-input-edit'
                                    placeholder='Contact Number'
                                    defaultValue={formik.values.personalMobile}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <span className='formik-error-msg'>{formik.errors.personalMobile}</span>
                            </div>
                        </div>

                        <div className='profile-change-password-input'>
                            <label className='personal-input-label form-label'>Signature</label>
                            <div className='profile-change-password-formik' style={{ alignItems: 'flex-start' }}>
                                {editSignature === false ?
                                    <>
                                        {userSlice.personal?.signature && <img className="profile-personal-signature" src={userSlice.personal?.signature} alt='' />}
                                    </> :
                                    <SignatureCanvas
                                        ref={(ref) => { setRefSign(ref) }}
                                        minWidth={1}
                                        maxWidth={1.3}
                                        canvasProps={{ className: 'profile-personal-signature' }}
                                        disabled={true} />
                                }
                                <button
                                    className='profile-signature-btn'
                                    type='button'
                                    onClick={toggleEditSignature}
                                >
                                    {editSignature === false ? "Edit" : "Clear"} Signature
                                </button>
                            </div>
                        </div>

                    </div>
                    {userSlice?.role !== 'Tenant' && (
                        <>
                            <div>
                                <div className='profile-edit-title' style={{ marginTop: '60px' }}>
                                    Company Information
                                </div>
                                <div className='profile-edit-title-below'>
                                    Company details will be shown on receipts or agreements.
                                </div>
                                <div className='edit-info-divider'>
                                    <hr />
                                </div>
                            </div>

                            <div>
                                <div className='profile-container-personal-input'>
                                    <div className='form-label personal-input-label'>Company Logo</div>
                                    <div className='personal-input-edit'>
                                        <div className=''>
                                            {logoFile ?
                                                <div>
                                                    {
                                                        logoLoading &&
                                                        <Spinner
                                                            className='logo-upload-spinner'
                                                            animation='border'
                                                            variant='warning'
                                                            size='lg'
                                                        />
                                                    }
                                                    {
                                                        !logoLoading && <>
                                                            <div className='userProfile-avatarEditor'>
                                                                <AvatarEditor
                                                                    image={logoFile}
                                                                    ref={logoEditorRef}
                                                                    width={150}
                                                                    height={150}
                                                                    scale={1.2}
                                                                    color={[255, 255, 255, 0.6]}
                                                                />
                                                                <button type="button" className='userProfile-companyLogo-save' onClick={cropAndSave}>Crop & Save</button>

                                                            </div>
                                                        </>
                                                    }
                                                </div> :
                                                <div
                                                    className='profile-image-upload-container'
                                                    onClick={handleLogoInputRefClick}
                                                >
                                                    <img className='userProfile-companyLogo' src={`${companyLogo}`} alt="company logo" />
                                                    <input
                                                        className='profile-hidden-input'
                                                        type='file'
                                                        ref={logoInputRef}
                                                        accept="image/x-png,image/jpeg"
                                                        onChange={handleImageUpload}
                                                    />
                                                    <div className='profile-edit-title-below'>Click on image to change logo</div>
                                                    <div className='profile-edit-title-below'>Accepted Format: png, jpg, jpeg</div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className='profile-container-personal-input'>
                                    <label className='form-label personal-input-label'>Company Name</label>
                                    <input
                                        type='text'
                                        className='form-control personal-input-edit'
                                        placeholder='Company Name'
                                        name='companyName'
                                        defaultValue={formik.values.companyName}
                                        onChange={formik.handleChange}
                                    />
                                </div>

                                <div className='profile-container-personal-input'>
                                    <label className='form-label personal-input-label'>Company Reg. No</label>
                                    <input
                                        type='text'
                                        className='form-control personal-input-edit'
                                        placeholder='Company Reg. No'
                                        name='companyRegNo'
                                        defaultValue={formik.values.companyRegNo}
                                        onChange={formik.handleChange}
                                    />
                                </div>

                                <div className='profile-change-password-input'>
                                    <label className='form-label personal-input-label'>Company Contact</label>
                                    <div className='profile-change-password-formik'>
                                        <input
                                            name='companyContact'
                                            type='text'
                                            className='form-control personal-input-edit'
                                            placeholder='Company Contact'
                                            defaultValue={formik.values.companyContact}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                </div>

                                <div className='profile-change-password-input'>
                                    <label className='form-label personal-input-label'>Company Email</label>
                                    <div className='profile-change-password-formik' style={{ position: "relative" }}>
                                        <input
                                            type='text'
                                            className='form-control personal-input-edit'
                                            placeholder='Company Email'
                                            name='companyEmail'
                                            defaultValue={formik.values.companyEmail}
                                            onChange={formik.handleChange}
                                            onBlur={formik.onBlur}
                                        />
                                        {/* <button type="button" className='isEmailUnique' onClick={() => isEmailsUnique("company")}>Check</button> */}
                                        <span className='formik-error-msg'>{formik.errors.companyEmail}</span>
                                    </div>
                                </div>

                                <div className='profile-container-personal-input'>
                                    <label className='form-label personal-input-label'>Address Line 1</label>
                                    <input
                                        type='text'
                                        className='form-control personal-input-edit'
                                        placeholder='Address Line 1'
                                        name='companyLine1'
                                        defaultValue={formik.values.companyLine1}
                                        onChange={formik.handleChange}
                                    />
                                </div>

                                <div className='profile-container-personal-input'>
                                    <label className='form-label personal-input-label'>Address Line 2</label>
                                    <input
                                        type='text'
                                        className='form-control personal-input-edit'
                                        placeholder='Address Line 2'
                                        name='companyLine2'
                                        defaultValue={formik.values.companyLine2}
                                        onChange={formik.handleChange}
                                    />
                                </div>

                                <div className='profile-container-personal-input'>
                                    <label className='form-label personal-input-label'>Postcode</label>
                                    <div className='profile-change-password-formik'>
                                        <input
                                            type='text'
                                            className='form-control personal-input-edit'
                                            placeholder='Postcode'
                                            name='companyPostcode'
                                            defaultValue={formik.values.companyPostcode}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        <span className='formik-error-msg'>{formik.errors.companyPostcode}</span>
                                    </div>
                                </div>

                                <div className='profile-container-personal-input'>
                                    <label className='form-label personal-input-label'>City</label>
                                    <input
                                        type='text'
                                        className='form-control personal-input-edit'
                                        placeholder='City'
                                        name='companyCity'
                                        defaultValue={formik.values.companyCity}
                                        onChange={formik.handleChange}
                                    />
                                </div>

                                <div className='profile-container-personal-input'>
                                    <label className='form-label personal-input-label'>Area</label>
                                    <input
                                        type='text'
                                        className='form-control personal-input-edit'
                                        placeholder='Area'
                                        name='companyArea'
                                        defaultValue={formik.values.companyArea}
                                        onChange={formik.handleChange}
                                    />
                                </div>

                                <div className='profile-container-personal-input'>
                                    <label className='form-label personal-input-label'>State</label>
                                    <input
                                        type='text'
                                        className='form-control personal-input-edit'
                                        placeholder='State'
                                        name='companyState'
                                        defaultValue={formik.values.companyState}
                                        onChange={formik.handleChange}
                                    />
                                </div>

                                <div className='profile-container-personal-input'>
                                    <label className='form-label personal-input-label'>Country</label>
                                    <input
                                        type='text'
                                        className='form-control personal-input-edit'
                                        placeholder='Country'
                                        name='companyCountry'
                                        defaultValue={formik.values.companyCountry}
                                        onChange={formik.handleChange}
                                        disabled
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    <div className='edit-info-divider' style={{ marginTop: '50px' }}>
                        <hr />
                    </div>
                    <div className='profile-save-btn'>
                        <button type='submit' className='btn btn-warning btn-lg right-drawer-sign-out'>
                            Save
                        </button>
                    </div>
                </div>
            </form >
        </>
    )
}



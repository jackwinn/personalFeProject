//packages 
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { Dropdown, DropdownButton, Col, Row, Modal, Form } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import ReactSelect, { components } from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import InfiniteScroll from 'react-infinite-scroll-component';
import regex from '../biz/regex';
import DatePicker from "react-datepicker";
import { parsePhoneNumberFromString } from "libphonenumber-js";

//metronic components
import { StepperComponent } from "../../_metronic/assets/ts/components";
import { KTIcon } from "../../_metronic/helpers";

//businesses
import lib from '../biz/lib';
import eTenanciesBiz from '../biz/eTenanciesBiz';

//setup data
import SetupData from '../data/SetupData';

function ETenanciesPage() {
    // router 
    const navigate = useNavigate()
    //slice
    const userSlice = useSelector((state) => state.user)
    //modal
    const [formModal, setFormModal] = useState(false)
    const [signModal, setSignModal] = useState(false)
    //form
    const [eTenancies, setEtenancies] = useState([]);
    const [formData, setFormData] = useState({})
    const modeEdit = "edit"
    const modeCreate = "create"
    const [formMode, setFormMode] = useState('')
    //search
    const [search, setSearch] = useState({});
    const [prevSearch, setPrevSearch] = useState({});
    const [page, setPage] = useState(0);
    const [pageSummary, setPageSummary] = useState({})
    //loading
    const [loading, setLoading] = useState(false);
    //sign
    const [signData, setSignData] = useState({})
    //yup
    const requiredMsg = 'This field is required'
    //pdf preview
    const [agreementPDF, setAgreementPDF] = useState(null)
    const [reservationPDF, setReservationPDF] = useState(null)
    //action access
    const [action, setAction] = useState({
        sign: false
    });
    //disable field
    const [disable, setDisable] = useState({
        field: false
    });
    //stepper
    const [stepper, setStepper] = useState(null);
    // Use state to manage the stepper element reference
    const [stepperElement, setStepperElement] = useState(null);
    //formik 
    const initialValues1 = {
        propertyRoomName: formData.propertyRoomName || ''
    }
    const validationSchema1 = Yup.object().shape({
        propertyRoomName: Yup.string().required('Rental Room │ Tenant Name is required')
    });
    const initialValues2 = {
        propertyAddress: formData?.propertyAddress,
        propertyCode: formData?.propertyCode || '',
        propertyRoomType: formData?.propertyRoomType || '',
        numberOfCarpark: formData?.numberOfCarpark || '',
        numberOfTenant: formData?.numberOfTenant || '',
        carParkRental: formData?.carParkRental || '',
        basicMonthlyRental: formData?.basicMonthlyRental || '',

        propertyRoomName: formData?.propertyRoomName,

        tenantId1: formData?.tenantId1,
        tenantName1: formData?.tenantName1,
        tenantTitle1: formData?.tenantTitle1 || '',
        tenantIdentityNo1: formData?.tenantIdentityNo1,
        tenantIdentityType1: formData?.tenantIdentityType1,
        tenantGender1: formData?.tenantGender1,
        tenantMobile1: formData?.tenantMobile1,
        tenantEmail1: formData?.tenantEmail1,
        tenantRace1: formData?.tenantRace1 || '',
        tenantOtherRace1: formData?.tenantOtherRace1 || '',

        tenantName2: formData?.tenantName2 || '',
        tenantTitle2: formData?.tenantTitle2 || '',
        tenantIdentityNo2: formData?.tenantIdentityNo2 || '',
        tenantIdentityType2: formData?.tenantIdentityType2 || '',
        tenantGender2: formData?.tenantGender2 || '',
        tenantMobile2: formData?.tenantMobile2 || '',
        tenantEmail2: formData?.tenantEmail2 || '',
        tenantRace2: formData?.tenantRace2 || '',
        tenantOtherRace2: formData?.tenantOtherRace2 || '',

        advanceRentalMonth: formData?.advanceRentalMonth || '2',
        advanceRental: formData?.advanceRental || '',
        securityDepositMonth: formData?.securityDepositMonth || '1',
        securityDeposit: formData?.securityDeposit || '',
        accessCardDeposit: formData?.accessCardDeposit || '',
        assuranceAgreement: formData?.assuranceAgreement || '',
        utilityDepositMonth: formData?.utilityDepositMonth || '1',
        utilityDeposit: formData?.utilityDeposit || '',
        depositTotalToBePaid: formData?.depositTotalToBePaid || '',

        accessCardNo: formData?.accessCardNo || '',

        tenantPaidAmount: formData.tenantPaidAmount || '',
        tenantPaidDate: formData.tenantPaidDate || '',
        balanceAmount: formData.balanceAmount || '',

        tenancyPeriod: formData?.tenancyPeriod || '',
        tenancyOtherPeriod: formData?.tenancyOtherPeriod || '',
        tenancyEndDate: formData?.tenancyEndDate || '',
        tenancyStartDate: formData?.tenancyStartDate || '',

        dateOfAgreement: formData?.dateOfAgreement || '',
        hostSignDate: formData?.hostSignDate || '',
        tenantSignDate1: formData?.tenantSignDate1 || '',

        emergencyContactName: formData?.emergencyContactName || '',
        emergencyContactTitle: formData?.emergencyContactTitle || '',
        emergencyContactMobile: formData?.emergencyContactMobile || '',
        emergencyContactRelationWithTenant: formData?.emergencyContactRelationWithTenant || '',

        refereeName: formData?.refereeName || '',
        refereeTitle: formData?.refereeTitle || '',
        refereeMobile: formData?.refereeMobile || '',
        refereeRelationWithTenant: formData?.refereeRelationWithTenant || '',
    }


    const validationSchema2 = Yup.object().shape({
        numberOfTenant: Yup.number()
            .required(requiredMsg)
            .test('isValidNumberofTenant', 'Only numbers are allowed', regex.isNumeric),
        propertyRoomType: Yup.string().required(requiredMsg),
        propertyCode: Yup.string().required(requiredMsg),
        tenantTitle1: Yup.string().required(requiredMsg),
        tenantRace1: Yup.string().required(requiredMsg),
        tenantName2: Yup.string().test("", "Only alphabetic characters, /, @, and . are allowed", (value) => {
            if (value) {
                return regex.isName(value)
            }
            return true
        }),
        tenantEmail2: Yup.string().test("", "Please enter in format: name@example.com", (value) => {
            if (value) {
                return regex.isValidEmail(value)
            }
            return true
        }),
        tenantMobile2: Yup.string().test("", "Only numbers are allowed", (value) => {
            if (value) return regex.isNumeric(value)
            return true
        }),
        // tenantIdentityType2: values.tenantIdentityType2 !== '' ? Yup.string().oneOf(['NRIC', 'Passport']) : Yup.string(),
        tenantIdentityNo2: Yup.string().when('tenantIdentityType2', {
            is: (val) => val === "NRIC",
            then: () => Yup.string().test("", "Please enter in format: 123456-XX-XXXX",
                (val) => {
                    if (val) return regex.isMalaysianIC(val)
                    else return true
                }
            ),
            otherwise: () => Yup.string()
        }),
        tenancyPeriod: Yup.string().required(requiredMsg),
        tenancyStartDate: Yup.string().required(requiredMsg),
        tenancyEndDate: Yup.string().required(requiredMsg),
        // accessCardNo: Yup.string().required(requiredMsg),
        advanceRental: Yup.string()
            .required(requiredMsg),
        securityDeposit: Yup.string()
            .required(requiredMsg),
        utilityDeposit: Yup.string()
            .required(requiredMsg),
        accessCardDeposit: Yup.string()
            .required(requiredMsg),
        assuranceAgreement: Yup.string()
            .required(requiredMsg),
        emergencyContactName: Yup.string()
            .required(requiredMsg)
            .test('isValidName', "Only alphabetic characters, /, @, and . are allowed", regex.isName),
        emergencyContactTitle: Yup.string().required(requiredMsg),
        emergencyContactMobile: Yup.string()
            .required(requiredMsg)
            .test(
                'isValidPhone',
                "Only numbers are allowed",
                regex.isNumeric
            ),
        emergencyContactRelationWithTenant: Yup.string()
            .required(requiredMsg)
            .test('isValideEmergencyRelationship', "Only alphabetic characters are allowed", regex.isAlphabetWithSpace),
        refereeName: Yup.string()
            .test('isValidName', "Only alphabetic characters, /, @, and . are allowed", regex.isName),
        // refereeTitle: Yup.string().required(requiredMsg),   
        refereeMobile: Yup.string().test('', 'Only numbers are allowed',
            (val) => {
                if (val) return regex.isNumeric(val)
                return true
            }
        ),
        refereeRelationWithTenant: Yup.string()
            .test('isValidtRefereeRelationship', "Only alphabetic characters are allowed", regex.isAlphabetWithSpace),
    })

    const getFilteredETenancies = async () => {
        window.scrollTo(0, 0)
        setEtenancies([])
        setPrevSearch(search)

        let searchParams
        searchParams = {
            search: search,
            paging: { page: 0 }
        }
        if (userSlice.role === 'Landlord') {
            searchParams.userId = userSlice._id
            searchParams.role = 'Landlord'

        } else if (userSlice.role === 'Operator') {
            searchParams.userId = userSlice._id
            searchParams.role = 'Operator'
        }
        lib.log(searchParams)

        const result = await eTenanciesBiz.search(searchParams)
        lib.log("filtered data")
        lib.log(result)
        setEtenancies(result?.data)
        setPageSummary(result?.summary)
        setPage(1)
    }

    const actionValidation = useCallback(() => {
        const result = userSlice.access.modules.find(module => module.name === "E-Tenancies");
        if (result && result.sign !== action.sign) {
            setAction({ sign: result.sign });
        }
    }, [userSlice.access.modules, action.sign]);

    useEffect(() => {
        actionValidation();
    }, [actionValidation]);

    useEffect(() => {
        lib.log("search")
        lib.log(search)
        getFilteredETenancies()
    }, [search])

    useEffect(() => {
        lib.log("formData")
        lib.log(formData)
    }, [formData])


    const toggleFormModal = () => {
        setFormModal(!formModal)
    }

    const toggleSignModal = () => {
        setSignModal(!signModal)
    }

    const createETenancy = () => {
        setFormData({})
        setDisable(prev => ({
            ...prev,
            field: false
        }));
        setFormMode(modeCreate)
        toggleFormModal()
    }

    const populateEtenancyData = async (id, isHostSigned, isTenantSigned) => {
        const bothSigned = isHostSigned && isTenantSigned
        let result = {}
        if (bothSigned) result = await eTenanciesBiz.getSignedRecord(id)
        else result = await eTenanciesBiz.getById(id)
        lib.log("populateEtenancyData")
        lib.log(result)
        let selectedFormData = {
            _id: result._id,
            hostId: result?.contract?.host,

            propertyUnit: result?.propertyUnit._id,
            propertyAddress: result?.propertyUnit?.fullAddress,
            propertyCode: (bothSigned) ? result?.propertyUnit.code : result?.propertyRoom?.name,
            propertyRoomType: result?.propertyUnit?.roomType,
            numberOfCarpark: result?.propertyUnit?.numberOfCarpark,
            numberOfTenant: result?.propertyUnit?.numberOfTenant,
            carParkRental: result?.propertyUnit?.carParkRental,
            basicMonthlyRental: (bothSigned) ? result?.propertyUnit?.basicMonthlyRental : result?.propertyRoom?.rental,

            propertyRoomName: result?.propertyRoom?.name,

            tenantId1: result?.mainTenant?._id,
            tenantName1: (bothSigned) ? result?.mainTenant?.name : result?.mainTenant?.personal.name,
            tenantIdentityNo1: (bothSigned) ? result?.mainTenant?.identity?.number : result?.mainTenant?.personal.identity?.number,
            tenantIdentityType1: (bothSigned) ? result?.mainTenant?.identity?.type : result?.mainTenant?.personal.identity?.type,
            tenantGender1: (bothSigned) ? result?.mainTenant?.gender : result?.mainTenant?.personal.gender,
            tenantMobile1: (bothSigned) ? result?.mainTenant?.mobile : result?.mainTenant?.personal.mobile,
            tenantEmail1: (bothSigned) ? result?.mainTenant?.email : result?.mainTenant?.personal.email,
            tenantTitle1: result?.mainTenant?.title,
            tenantRace1: result?.mainTenant?.race,
            tenantOtherRace1: result?.mainTenant?.otherRace,

            tenantName2: result?.subTenant?.name,
            tenantTitle2: result?.subTenant?.title,
            tenantIdentityNo2: result?.subTenant?.identity?.number,
            tenantIdentityType2: result?.mainTenant?.identity?.type,
            tenantGender2: result?.subTenant?.gender,
            tenantMobile2: result?.subTenant?.mobile,
            tenantEmail2: result?.subTenant?.email,
            tenantRace2: result?.subTenant?.race,
            tenantOtherRace2: result?.subTenant?.otherRace,

            advanceRentalMonth: result?.deposit?.advanceRentalMonth,
            advanceRental: String(result?.deposit?.advanceRental),
            securityDepositMonth: result?.deposit?.securityMonth,
            securityDeposit: String(result?.deposit?.security),
            accessCardDeposit: String(result?.deposit?.accessCard),
            assuranceAgreement: String(result?.deposit?.assuranceAgreement),
            utilityDepositMonth: result?.deposit?.utilityMonth,
            utilityDeposit: String(result?.deposit?.utility),
            depositTotalToBePaid: String(result?.deposit?.totalToBePaid),

            accessCardNo: result?.accessCardNo,

            tenantPaidAmount: String(result?.tenantPayment?.amount),
            tenantPaidDate: result?.tenantPayment?.date,
            balanceAmount: result?.balanceAmount,

            tenancyPeriod: result?.tenancy?.period,
            tenancyOtherPeriod: result?.tenancy?.otherPeriod,
            tenancyEndDate: result?.tenancy?.endDate,
            tenancyStartDate: result?.tenancy?.startDate,

            dateOfAgreement: result?.dateOfAgreement,
            hostSignDate: result?.contract?.hostSignDate,
            hostSignatureImage: result?.contract?.hostSignatureImage,
            tenantSignatureImage: result?.contract?.tenantSignatureImage,
            tenantSignDate1: result?.contract?.tenantSignDate,

            emergencyContactName: result?.emergencyContact?.name,
            emergencyContactTitle: result?.emergencyContact?.title,
            emergencyContactMobile: result?.emergencyContact?.mobile,
            emergencyContactRelationWithTenant: result?.emergencyContact?.relationWithTenant,

            refereeName: result?.referee?.name,
            refereeTitle: result?.referee?.title,
            refereeMobile: result?.referee?.mobile,
            refereeRelationWithTenant: result?.referee?.relationWithTenant,
        }

        if (result) {
            if (result.contract?.isHostSigned && result.contract?.isTenantSigned) {
                setDisable(prev => ({
                    ...prev,
                    field: true
                }));
            }
            setFormData(selectedFormData)
        }
        return selectedFormData
    }

    useEffect(() => {
        lib.log(disable.field)
    }, [disable.field])


    const asyncSelectStyles = {
        control: (base, state) => ({
            ...base,
            border: '1px solid #e1e3ea',
            background: '#ffffff',
            boxShadow: 'none', //to remove focus blue border
            paddingLeft: '2px' //to align padding with placeholder
        }),
        valueContainer: (base) => ({
            ...base,
            padding: '0px',
            fontSize: '16px',
        }),
        input: (baseStyles) => ({
            ...baseStyles,
            fontSize: '16px',
            color: '#333333',
        }),
        placeholder: (base) => ({
            ...base,
            fontSize: '14px',
            color: '#5e6278'
        }),
        menu: (base) => ({
            ...base,
            boxShadow: "0px 0px 6px #75757529",
            borderRadius: "7px",
            border: "none",
            padding: "13px 13px 5px 13px",
        }),
        menuList: (base) => ({
            ...base,
            paddingTop: "0",
            paddingBottom: "0",
        }),
        option: (base) => ({
            ...base,
            color: "#A7A9AC",
            padding: "8px 0 8px 4px",
            backgroundColor: "transparent",
            borderBottom: "1px solid #e1e2eb",
            ":hover": {
                backgroundColor: "#F5F6FA",
                borderBottom: "1px solid #e1e2eb",
            },
            ":last-child": {
                borderBottom: "none",
            },
        }),
        // noOptionsMessage: (base) => ({
        //     ...base,
        //     color: "#BCBEC0",
        //     ":hover": {
        //         textDecoration: "underline"
        //     }
        // }),
        loadingMessage: (base) => ({
            ...base,
            color: "#BCBEC0",
        })
    }

    const promiseOptions = async (inputValue) => {
        let params = {
            keyValue: inputValue
        }
        //if landlord logged in he can only search tenant under his unit/room
        if (userSlice.role === 'Landlord') {
            params.userId = userSlice._id
            params.role = 'Landlord'

        } else if (userSlice.role === 'Operator') {
            params.userId = userSlice._id
            params.role = 'Operator'
        }
        if (inputValue) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const result = eTenanciesBiz.quickSearchActiveTenant(params);
            // console.log(result)
            if (result) return result;
        }
        return null;
    };

    const formatOptionLabel = (obj, { inputValue }) => {
        // console.log(obj)
        return (
            <div>
                <p>{obj.name} | {obj?.tenant?.personal?.name}</p >
            </div >
        )
    };

    const SingleValue = ({ ...props }) => {
        // console.log('Single Value')
        return (
            //to display value, defaultValue in AsyncSelect must follow singleValue data structure
            <components.SingleValue {...props}>{props.data.name} | {props.data?.tenant?.personal?.name}</components.SingleValue>
        )
    }

    const DropdownIndicator = null

    const MenuList = (props) => {
        // console.log(props)
        return (
            <components.MenuList {...props}>
                {props.options.length > 0 && <div className='db-header-search-recom' style={{ fontSize: "16px" }}>Recommendation</div>}
                {props.children}
            </components.MenuList>
        );
    };

    const NoOptionsMessage = () => {
        return (
            <>
                <div className="propForm-async-noOptions">Not Found</div>
            </>
        );
    };

    useEffect(() => {
        const loadStepper = () => {
            // Create an instance of the stepper when the component mounts
            const newStepper = StepperComponent.createInsance(stepperElement);
            setStepper(newStepper);
        };

        loadStepper();

        // Cleanup: Destroy the stepper instance when the component unmounts
        return () => {
            if (stepper) {
                stepper.destroy();
            }
        };
    }, [stepperElement]);

    const prevStep = () => {
        if (stepper) {
            stepper.goPrev();
        }
    };

    const nextStep = () => {
        if (stepper) {
            stepper.goNext();
        }
    };

    const handleSetFormData = (obj) => {
        setFormData((formData) => ({
            ...formData,
            ...obj
        }))
    }

    // const handleCloseModal = () => {
    //     //    setSelectedId(null)
    //     toggleFormModal()
    // }

    //FORM MODAL END

    //TABLE SECTION START 
    useEffect(() => {
        if (page > 1) {
            const fetchMore = async () => {
                let searchParams = {
                    search: prevSearch,
                    paging: {
                        page: page
                    }
                }
                if (userSlice.role === 'Landlord') {
                    searchParams.userId = userSlice._id
                    searchParams.role = 'Landlord'

                } else if (userSlice.role === 'Operator') {
                    searchParams.userId = userSlice._id
                    searchParams.role = 'Operator'
                }
                const result = await eTenanciesBiz.search(searchParams)

                if (result && result.data)
                    setEtenancies((eTenancies) => [
                        ...eTenancies,
                        ...result.data,
                    ]);
            };

            fetchMore();
        }
    }, [page]);

    const handleLoadMore = () => {
        setPage((page) => page + 1);
    }

    const handleSelected = async (id, contract) => {
        setDisable(prev => ({
            ...prev,
            field: false
        }));
        const selectedformData = await populateEtenancyData(id, contract.isHostSigned, contract.isTenantSigned)
        if (selectedformData) setFormData(selectedformData)
        setFormMode(modeEdit);
        toggleFormModal();
    }

    const handleDownloadPDF = async (id, type) => {
        // setSelectedId(id)
        const selectedformData = await populateEtenancyData(id)
        // console.log(type)
        let result
        if (type === "Reservation Form") {
            result = await eTenanciesBiz.previewReservationForm(selectedformData)
        } else {
            result = await eTenanciesBiz.previewAgreement(selectedformData)
        }
        // console.log(formData)
        // console.log(result)

        var fileIMG = new Blob([result], { type: 'application/pdf' });
        var fileIMGURL = window.URL.createObjectURL(fileIMG);

        window.open(fileIMGURL) //open in new window to prevent blank pdf

        // const a = document.createElement('a')
        // a.style.display = 'none'
        // a.href = fileIMGURL
        // // the filename you want
        // a.download = `${type}`
        // document.body.appendChild(a)
        // a.click()
        // // cleanup
        // a.remove()
        // window.URL.revokeObjectURL(fileIMGURL)
    }

    useEffect(() => {
        lib.log('signData')
        lib.log(signData)
    }, [signData])

    const handleSignModal = async (tenancyId, role, tenantName1, tenantMobile1) => {
        setSignData({
            _id: tenancyId,
            role: role,
            tenantName1: tenantName1,
            tenantMobile1: tenantMobile1
        })
        toggleSignModal()
    }

    const handleSignAgreement = async () => {
        const params = {
            ...signData,
            signature: userSlice.personal?.signature
        }
        const result = await eTenanciesBiz.signAgreement(params)
        if (result) {
            toast.success(`Manager signature updated successfully`)
            getFilteredETenancies()
        }
        toggleSignModal()
    }

    const handleSendSignatureLink = async () => {
        const params = {
            _id: signData._id
        }
        // lib.log(params)
        const result = await eTenanciesBiz.generateSignatureLink(params)
        lib.log("Generated Signature Link:")
        lib.log(result)
        if (result.status === '200') {
            const phone = parsePhoneNumberFromString(signData.tenantMobile1, "MY").nationalNumber;
            const message = `Click on the link: ${result.authenticatedLink} for iRoomz tenant signature access. The temporary otp is ${result.otp}. Valid for 24 hours`;
            window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
        } else {
            toast.error(result.message)
            getFilteredETenancies()
        }
        toggleSignModal()
    }

    //TABLE SECTION END

    //FILTER SECTION START
    const statusRef = useRef('');
    const inputRef = useRef('');

    const statusOptions = [
        { label: 'Status', value: '' },
        { label: 'New', value: 'New' },
        { label: 'Processing', value: 'Processing' },
        { label: 'Completed', value: 'Completed' }
    ]

    const assignSearchValue = (name, value) => {
        setSearch(searchs => ({
            ...searchs,
            [name]: value
        }))
    }

    const handleSearch = async () => {
        assignSearchValue("status", statusRef ? statusRef.current?.value : null)
        assignSearchValue("name", inputRef ? inputRef.current?.value : null)
    }

    const handleSearchEnter = (e) => {
        if (e.key.toLowerCase() === 'enter')
            handleSearch()
    }

    const getSignatureStatus = (status, record) => {
        let recordLabel = ''
        if (record.isHostSigned) {
            recordLabel += 'Manager Signed'
            if (record.isTenantSigned) {
                recordLabel += ', Tenant Signed'
            }
        } else if (record.isTenantSigned) {
            recordLabel += 'Tenant Signed'
        }
        return <>
            {status}<br />
            <p style={{ color: '#6f42c1' }}>{recordLabel}</p>
        </>;
    };

    const ManagerModalContent = () => (
        <>
            {userSlice.personal?.signature && <>
                <div className='signature-modal-header'>
                    <span className='mb-3'>
                        Do you wish to sign the agreement with this signature?
                    </span>
                    <img className="signature-canvas" src={userSlice.personal?.signature} alt="" />
                </div>
                <div className='d-flex pt-10'>
                    <button
                        type='button'
                        className='btn btn-lg btn-light-primary me-3'
                        onClick={handleSignAgreement}
                    >
                        Confirm
                    </button>
                    <button
                        type='button'
                        className='btn btn-lg btn-primary'
                        onClick={toggleSignModal}
                    >
                        Cancel
                    </button>
                </div>
            </>}
            {!userSlice.personal?.signature && <>
                <div className='signature-modal-header'>
                    <span>
                        Signature is required. Do you wish to create your signature ?
                    </span>
                </div>
                <div className='d-flex pt-10'>
                    <button
                        type='button'
                        className='btn btn-lg btn-light-primary me-3'
                        onClick={() => navigate('/profile')}
                    >
                        Create
                    </button>
                    <button
                        type='button'
                        className='btn btn-lg btn-primary'
                        onClick={toggleSignModal}
                    >
                        Cancel
                    </button>
                </div>
            </>}
        </>
    )

    const TenantModalContent = () => (
        <>
            <div className='signature-modal-header'>
                <span>Do you wish to send signature link to tenant ?</span>
                <span className='pt-5'>{signData.tenantName1}</span>
                <span className='pt-1'>{signData.tenantMobile1}</span>
            </div>
            <div className='d-flex pt-10'>
                <button
                    type='button'
                    className='btn btn-lg btn-light-primary me-3'
                    onClick={handleSendSignatureLink}
                >
                    Send
                </button>
                <button
                    type='button'
                    className='btn btn-lg btn-primary'
                    onClick={toggleSignModal}
                >
                    Cancel
                </button>
            </div>
        </>
    )


    return (
        <div className='etenant-page'>
            <div className='td-filter-group'>
                <select
                    defaultValue={statusOptions[0]}
                    className='form-select td-filter-select'
                    ref={statusRef}
                >
                    {statusOptions.map((status, index) => {
                        return (
                            <option key={index} value={status.value}>
                                {status.label}
                            </option>
                        )
                    })}
                </select>
                <KTIcon
                    className='fs-2 td-filter-icon input-group-text'
                    iconName='magnifier'
                    iconType='outline'
                />
                <input
                    className='form-control td-filter-input'
                    placeholder='Search Property Room Name / Tenant Name'
                    type='text'
                    ref={inputRef}
                    onKeyDown={handleSearchEnter}
                />
                <div className='form-control td-filter-search-group'>
                    <button className='td-filter-search-btn' type='submit' onClick={handleSearch}>
                        Search
                    </button>
                </div>
            </div>

            <div className='td-header-btn-group'>
                <button className='btn btn-primary' onClick={createETenancy}>
                    New E-Tenancy
                </button>
            </div>

            <div className='table-overflow'>
                <InfiniteScroll
                    dataLength={eTenancies.length}
                    hasMore={page < pageSummary?.pages}
                    next={handleLoadMore}
                    loader={
                        <p style={{ textAlign: 'center' }} className='text-muted text-center'>
                            Loading data...
                        </p>
                    }
                    endMessage={
                        <p className='text-muted text-center'>
                            <small> Looks like you've reached the end </small>
                        </p>
                    }
                // style={{ overflow: "hidden" }}
                >
                    <table
                        id='kt_datatable_vertical_scroll'
                        className='table table-striped table-row-bordered gy-5 gs-7'
                    >
                        <thead>
                            <tr className='fw-semibold fs-6 text-gray-800'>
                                <th
                                // className="pe-7"
                                >
                                    Property Code
                                </th>
                                <th>Tenant Details</th>
                                <th>Tenancy Period</th>
                                <th>Created</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {eTenancies.map((obj) => {
                                return (
                                    <tr key={obj._id}>
                                        <td>{(obj.contract?.isHostSigned && obj.contract?.isTenantSigned) ? obj?.propertyUnit?.code : obj?.propertyRoom?.name}</td>
                                        <td>
                                            {(obj.contract?.isHostSigned && obj.contract?.isTenantSigned) ? obj?.mainTenant?.name : obj?.mainTenant?.personal?.name}<br />
                                            {(obj.contract?.isHostSigned && obj.contract?.isTenantSigned) ? obj?.mainTenant?.mobile : obj?.mainTenant?.personal?.mobile}<br />
                                            {(obj.contract?.isHostSigned && obj.contract?.isTenantSigned) ? obj?.mainTenant?.email : obj?.mainTenant?.personal?.email}
                                        </td>
                                        <td>
                                            {lib.formatDateDMY(obj?.tenancy?.startDate)} -{' '}
                                            {lib.formatDateDMY(obj?.tenancy?.endDate)}
                                        </td>
                                        <td>{lib.formatDateDMY(obj?.created)}</td>
                                        <td>{getSignatureStatus(obj?.status, obj?.contract)}</td>
                                        <td>
                                            <DropdownButton variant='primary' id="dropdown-basic-button" title="Action">
                                                <Dropdown.Item onClick={() => handleSelected(obj?._id, obj?.contract)}>Edit E-Tenancy</Dropdown.Item>
                                                {action.sign &&
                                                    <Dropdown.Item
                                                        onClick={() => handleSignModal(obj?._id, 'Manager')}
                                                        disabled={obj?.contract.isHostSigned}
                                                    >
                                                        Manager Signature
                                                    </Dropdown.Item>}
                                                {action.sign &&
                                                    <Dropdown.Item
                                                        onClick={() => handleSignModal(obj?._id, 'Tenant', obj?.mainTenant?.personal.name, obj?.mainTenant?.personal.mobile)}
                                                        disabled={obj?.contract.isTenantSigned}
                                                    >
                                                        Send Signature Link To Tenant
                                                    </Dropdown.Item>}
                                                <Dropdown.Item onClick={() => handleDownloadPDF(obj?._id, 'Tenancy Agreement')}>Download Tenancy Agreement</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleDownloadPDF(obj?._id, 'Reservation Form')}>Download Reservation Form</Dropdown.Item>
                                            </DropdownButton>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </InfiniteScroll>
            </div>

            {/* Form Modal */}
            <Modal
                id='kt_modal_create_app'
                tabIndex={-1}
                aria-hidden='true'
                dialogClassName='modal-dialog modal-dialog-centered mw-624px'
                show={formModal}
                onHide={toggleFormModal}
                backdrop={true}
                size='xl'
            >
                <Modal.Body>
                    <div className=''>
                        <div
                            // ref={stepperRef}
                            ref={(ref) => setStepperElement(ref)}
                            className='stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid etenant-stepper-container'
                            id='kt_modal_create_app_stepper'
                        >
                            <div className='stepper-nav ps-lg-10 etenant-stepper-nav'>
                                <div
                                    className='stepper-item current etenant-stepper-item'
                                    data-kt-stepper-element='nav'
                                >
                                    <div className='stepper-wrapper etenant-stepper-nav'>
                                        <div className='stepper-icon w-40px h-40px'>
                                            <i className='stepper-check fas fa-check'></i>
                                            <span className='stepper-number'>1</span>
                                        </div>
                                        <div className='stepper-label'>
                                            <h3 className='stepper-title'>Select tenant</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className='stepper-item etenant-stepper-item' data-kt-stepper-element='nav'>
                                    <div className='stepper-wrapper'>
                                        <div className='stepper-icon w-40px h-40px'>
                                            <i className='stepper-check fas fa-check'></i>
                                            <span className='stepper-number'>2</span>
                                        </div>
                                        <div className='stepper-label'>
                                            <h3 className='stepper-title'>Generate Contract</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className='stepper-item etenant-stepper-item' data-kt-stepper-element='nav'>
                                    <div className='stepper-wrapper'>
                                        <div className='stepper-icon w-40px h-40px'>
                                            <i className='stepper-check fas fa-check'></i>
                                            <span className='stepper-number'>3</span>
                                        </div>
                                        <div className='stepper-label'>
                                            <h3 className='stepper-title'>Preview Contract</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className='stepper-item etenant-stepper-item' data-kt-stepper-element='nav'>
                                    <div className='stepper-wrapper'>
                                        <div className='stepper-icon w-40px h-40px'>
                                            <i className='stepper-check fas fa-check'></i>
                                            <span className='stepper-number'>4</span>
                                        </div>
                                        <div className='stepper-label'>
                                            <h3 className='stepper-title'>Preview Form</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 1 */}
                            <div className='flex-row-fluid py-lg-5 px-lg-15'>
                                <form id='kt_modal_create_app_form'>
                                    <div className='current' data-kt-stepper-element='content'>
                                        <Formik
                                            enableReinitialize
                                            initialValues={initialValues1}
                                            validationSchema={validationSchema1}
                                            onSubmit={async (values, { setSubmitting }) => {
                                                setSubmitting(false)
                                                nextStep()
                                            }}
                                        >
                                            {(props) => {
                                                const {
                                                    values,
                                                    touched,
                                                    errors,
                                                    dirty,
                                                    isSubmitting,
                                                    handleChange,
                                                    handleBlur,
                                                    handleSubmit,
                                                    handleReset,
                                                    setFieldValue,
                                                } = props


                                                return (
                                                    <div div className=''>
                                                        <Form.Group className="mb-3" controlId="propertyRoomName">
                                                            <Form.Label md="3" className='required'>Rental Room │ Tenant Name</Form.Label>:
                                                            <AsyncSelect
                                                                name='roomTenantInfo'
                                                                styles={asyncSelectStyles}
                                                                onChange={(room, { action }) => {
                                                                    if (room) {
                                                                        setFieldValue('roomName', room.name)
                                                                        // setFieldValue('tenantName', room.tenant?.personal?.name)


                                                                        let newFormData = {
                                                                            tenantId1: room.tenant._id,
                                                                            tenantName1: room.tenant.personal.name,
                                                                            tenantIdentityNo1: room.tenant?.personal?.identity.number,
                                                                            tenantIdentityType1: room.tenant?.personal?.identity.type,
                                                                            tenantGender1: room.tenant?.personal?.gender,
                                                                            tenantMobile1: room.tenant?.personal?.mobile,
                                                                            tenantEmail1: room.tenant?.personal?.email,

                                                                            propertyUnit: room.propertyUnit._id,
                                                                            propertyCode: `${room.name}`,
                                                                            propertyAddress: room.propertyUnit?.address?.full,
                                                                            propertyRoom: room._id,
                                                                            propertyRoomName: room.name,
                                                                            basicMonthlyRental: room.rental,
                                                                        }

                                                                        if (userSlice.role === "Operator") {
                                                                            newFormData.hostId = userSlice._id
                                                                            // newFormData.hostName = userSlice.personal.name
                                                                        }

                                                                        handleSetFormData(newFormData)
                                                                    } else {
                                                                        setFieldValue('roomName', '')
                                                                        setFieldValue('tenantName', '')
                                                                        setFormData({})
                                                                    }
                                                                }}
                                                                loadOptions={promiseOptions}
                                                                placeholder={'Type to search room or tenant'}
                                                                components={{ DropdownIndicator, MenuList, SingleValue }}
                                                                formatOptionLabel={formatOptionLabel}
                                                                isClearable={true}
                                                                isSearchable={true}
                                                                noOptionsMessage={NoOptionsMessage}
                                                                onBlur={handleBlur}
                                                                value={
                                                                    formData?.tenantName1
                                                                        ? {
                                                                            //   name: values.propertyRoomName,
                                                                            name: formData?.propertyRoomName,
                                                                            tenant: { personal: { name: formData?.tenantName1 } },
                                                                        }
                                                                        : null
                                                                }
                                                                isDisabled={formMode === modeEdit}
                                                            />
                                                        </Form.Group>
                                                        {(!values.propertyRoomName || touched.propertyRoomName) && <p className="formik-error-msg">{errors.propertyRoomName}</p>}

                                                        <div>
                                                            <button
                                                                type='button'
                                                                className='btn btn-lg btn-primary'
                                                                data-kt-stepper-action='next'
                                                                onClick={handleSubmit}
                                                            >
                                                                Next Step
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            }}
                                        </Formik>
                                    </div>

                                    {/* Step 2 */}
                                    <div data-kt-stepper-element='content' className=''>
                                        <Formik
                                            enableReinitialize
                                            initialValues={initialValues2} //selectedFormData
                                            validationSchema={validationSchema2}
                                            onSubmit={async (values, { setSubmitting }) => {
                                                setSubmitting(false)
                                                setLoading(true)

                                                const newValues = [
                                                    'carParkRental',
                                                    'advanceRental',
                                                    'securityDeposit',
                                                    'utilityDeposit',
                                                    'accessCardDeposit',
                                                    'assuranceAgreement',
                                                    'tenantPaidAmount'
                                                ];

                                                const depositValues = {};
                                                newValues.forEach(field => {
                                                    depositValues[field] = String(values[field])?.replace(/,/g, '');
                                                });

                                                // const tenancyStartDateISO = new Date (values.tenancyStartDate).toISOString().substring(0, 10)

                                                values.dateOfAgreement = values.tenancyStartDate
                                                values.hostName = userSlice.personal.name
                                                values.hostSignDate = values.tenancyStartDate
                                                values.tenantSignDate1 = values.tenancyStartDate

                                                values.depositTotalToBePaid =
                                                    parseFloat(depositValues.advanceRental) +
                                                    parseFloat(depositValues.securityDeposit) +
                                                    parseFloat(depositValues.utilityDeposit) +
                                                    parseFloat(depositValues.accessCardDeposit) +
                                                    parseFloat(depositValues.assuranceAgreement)

                                                values.balanceAmount = values?.depositTotalToBePaid - parseFloat(depositValues.tenantPaidAmount ? depositValues.tenantPaidAmount : 0)

                                                values.tenantOtherRace1 =
                                                    values.tenantRace1 !== 'Other' ? '' : values.tenantOtherRace1
                                                values.tenantOtherRace2 =
                                                    values.tenantRace2 !== 'Other' ? '' : values.tenantOtherRace2
                                                values.tenancyOtherPeriod =
                                                    values.tenancyPeriod !== 'Other' ? '' : values.tenancyOtherPeriod

                                                const updatedValues = {
                                                    ...values, ...depositValues
                                                }

                                                try {
                                                    const result = await eTenanciesBiz.previewAgreement({
                                                        ...formData,
                                                        ...updatedValues
                                                    })

                                                    if (result) {
                                                        // Convert Uint8Array to Blob
                                                        const pdfBlob = new Blob([result], { type: 'application/pdf' })
                                                        // Create a Blob URL
                                                        const blobUrl = URL.createObjectURL(pdfBlob)
                                                        // Set the Blob URL to the state
                                                        setAgreementPDF(blobUrl)

                                                        handleSetFormData(updatedValues)
                                                    }
                                                } catch (err) {
                                                    lib.log(err)
                                                } finally {
                                                    setLoading(false)
                                                }
                                                nextStep()
                                            }}
                                        >
                                            {(props) => {
                                                const {
                                                    values,
                                                    touched,
                                                    errors,
                                                    dirty,
                                                    isSubmitting,
                                                    handleChange,
                                                    handleBlur,
                                                    handleSubmit,
                                                    handleReset,
                                                    setFieldValue,
                                                } = props

                                                let totalToBePaid = parseFloat(values?.advanceRental?.replace(/[,]/g, "") || 0) +
                                                    parseFloat(values?.securityDeposit?.replace(/[,]/g, "") || 0) +
                                                    parseFloat(values?.utilityDeposit?.replace(/[,]/g, "") || 0) +
                                                    parseFloat(values?.accessCardDeposit?.replace(/[,]/g, "") || 0) +
                                                    parseFloat(values?.assuranceAgreement?.replace(/[,]/g, "") || 0)

                                                let balanceAmount = totalToBePaid - parseFloat(values?.tenantPaidAmount ? values?.tenantPaidAmount?.replace(/[,]/g, "") : 0)

                                                return (
                                                    <div className='w-100'>
                                                        {loading && (
                                                            <span className='indicator-progress' style={{ display: 'block' }}>
                                                                Please wait...
                                                                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                            </span>
                                                        )}
                                                        {!loading && (<>
                                                            <Row>
                                                                <h2>Property Details</h2>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='propertyAddress'
                                                                    >
                                                                        {/* lai focus */}
                                                                        <Form.Label column md='4'>
                                                                            Property Address<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                as='textarea'
                                                                                rows='3'
                                                                                size='sm'
                                                                                placeholder='Property Address'
                                                                                defaultValue={
                                                                                    values.propertyAddress
                                                                                }
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled
                                                                            />
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='propertyRoomType'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Room Type<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Room Type'
                                                                                defaultValue={values.propertyRoomType}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            {touched.propertyRoomType && errors.propertyRoomType &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.propertyRoomType}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='propertyCode'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Property Code<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Property Code'
                                                                                defaultValue={values.propertyCode}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled
                                                                            />
                                                                            {touched.propertyCode && errors.propertyCode &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.propertyCode}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='basicMonthlyRental'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Basic Monthly Rental (RM)<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Basic Monbthly Rental (RM)'
                                                                                defaultValue={values.basicMonthlyRental}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled
                                                                            />
                                                                        </Col>
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col>
                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='numberOfTenant'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Number of Tenant<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='number'
                                                                                size='sm'
                                                                                placeholder='Number of Tenant'
                                                                                defaultValue={values.numberOfTenant || null}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            {touched.numberOfTenant &&
                                                                                errors.numberOfTenant &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.numberOfTenant}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='numberOfCarpark'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Number of Car Park :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='number'
                                                                                size='sm'
                                                                                placeholder='Number of Car Park'
                                                                                defaultValue={values.numberOfCarpark || null}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='carParkRental'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Car Park Rental (RM) :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Car Park Rental (RM)'
                                                                                value={lib.numberFormatter(values.carParkRental, 2)}
                                                                                onChange={(e) => setFieldValue('carParkRental', lib.numberFormatter(e.target.value, 2))}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                        </Col>
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                            <hr />
                                                            <Row>
                                                                <Col>
                                                                    <h2>Tenant 1 Details (required) </h2>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='tenantName1'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Name<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Name'
                                                                                defaultValue={values.tenantName1 || formData?.tenantName1}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled
                                                                            />
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='tenantTitle1'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Title<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Select
                                                                                size='sm'
                                                                                placeholder='Title'
                                                                                defaultValue={values.tenantTitle1}
                                                                                name='tenantTitle1'
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            >
                                                                                {SetupData.nameTitle.map((obj) => {
                                                                                    return <option value={obj.value}>{obj.label}</option>
                                                                                })}
                                                                            </Form.Select>
                                                                            {touched.tenantTitle1 &&
                                                                                errors.tenantTitle1 &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.tenantTitle1}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='tenantIdentityNo1'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            NRIC / Passport No.<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='NRIC/Passport No.'
                                                                                defaultValue={
                                                                                    values.tenantIdentityNo1 || formData?.tenantIdentityNo1
                                                                                }
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled
                                                                            />
                                                                            <div className='profile-ic-passport-radio-container'>
                                                                                <div className='form-check'>
                                                                                    <input
                                                                                        className='form-check-input'
                                                                                        type='radio'
                                                                                        name='tenantIdentityType1'
                                                                                        value='NRIC'
                                                                                        checked={values?.tenantIdentityType1 === 'NRIC'}
                                                                                        // onChange={(event) => {
                                                                                        //     identityRadioTypeValidation(event, handleChange, 1)
                                                                                        // }}
                                                                                        onChange={handleChange}
                                                                                        disabled
                                                                                    />
                                                                                    <label htmlFor='NRIC'>NRIC</label>
                                                                                </div>
                                                                                <div className='form-check'>
                                                                                    <input
                                                                                        className='form-check-input'
                                                                                        type='radio'
                                                                                        name='tenantIdentityType1'
                                                                                        value='Passport'
                                                                                        checked={values?.tenantIdentityType1 === 'Passport'}
                                                                                        // onChange={(event) => {
                                                                                        //     identityRadioTypeValidation(event, handleChange, 1)
                                                                                        // }}
                                                                                        onChange={handleChange}
                                                                                        disabled
                                                                                    />
                                                                                    <label htmlFor='Passport'>Passport</label>
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='tenantGender1'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Gender<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Select
                                                                                size='sm'
                                                                                placeholder='Gender'
                                                                                defaultValue={'Male'}
                                                                                value={values.tenantGender1}
                                                                                name='tenantGender1'
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled
                                                                            >
                                                                                {SetupData.gender.map((obj) => {
                                                                                    return <option key={obj.value} value={obj.value}>{obj.label}</option>
                                                                                })}
                                                                            </Form.Select>
                                                                            {touched.tenantGender1 && errors.tenantGender1 &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.tenantGender1}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='tenantMobile1'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Contact No.<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Contact No'
                                                                                defaultValue={
                                                                                    values.tenantMobile1 || formData?.tenant?.personal?.mobile
                                                                                }
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled
                                                                            />
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='tenantEmail1'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Email Address<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Email Address'
                                                                                defaultValue={
                                                                                    values.tenantEmail1 || formData?.tenant?.personal?.email
                                                                                }
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled
                                                                            />
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='tenantRace1'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Race<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Select
                                                                                size='sm'
                                                                                placeholder='Race'
                                                                                defaultValue={values.tenantRace1}
                                                                                name='tenantRace1'
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            >
                                                                                {SetupData.race.map((obj) => {
                                                                                    return <option value={obj.value}>{obj.label}</option>
                                                                                })}
                                                                            </Form.Select>
                                                                            {touched.tenantRace1 && errors.tenantRace1 &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.tenantRace1}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>

                                                                    {values.tenantRace1 === 'Other' && (
                                                                        <Form.Group
                                                                            as={Row}
                                                                            className='mb-3 align-items-center'
                                                                            controlId='tenantOtherRace1'
                                                                        >
                                                                            <Form.Label column md='4'></Form.Label>
                                                                            <Col column md='8'>
                                                                                <Form.Control
                                                                                    type='text'
                                                                                    size='sm'
                                                                                    placeholder='Other Race'
                                                                                    defaultValue={values.tenantOtherRace1}
                                                                                    onChange={handleChange}
                                                                                    disabled={disable.field}
                                                                                />
                                                                            </Col>
                                                                            {touched.tenantOtherRace1 && errors.tenantOtherRace1 &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.tenantOtherRace1}
                                                                                </span>}
                                                                        </Form.Group>
                                                                    )}
                                                                </Col>
                                                                <Col>
                                                                    <h2>Tenant 2 Details (if any) </h2>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='tenantName2'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Name :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Name'
                                                                                defaultValue={values.tenantName2}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            {touched.tenantName2 && errors.tenantName2 &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.tenantName2}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='tenantTitle2'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Title :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Select
                                                                                size='sm'
                                                                                placeholder='Title'
                                                                                defaultValue={values.tenantTitle2}
                                                                                onChange={handleChange}
                                                                                disabled={disable.field}
                                                                            >
                                                                                {SetupData.nameTitle.map((obj) => {
                                                                                    return <option value={obj.value}>{obj.label}</option>
                                                                                })}
                                                                            </Form.Select>
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='tenantIdentityNo2'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            NRIC / Passport No. :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='NRIC/Passport No.'
                                                                                defaultValue={values.tenantIdentityNo2}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            {errors.tenantIdentityNo2 &&
                                                                                touched.tenantIdentityNo2 &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.tenantIdentityNo2}
                                                                                </span>}
                                                                            <div className='profile-ic-passport-radio-container'>
                                                                                <div className='form-check'>
                                                                                    <input
                                                                                        className='form-check-input'
                                                                                        type='radio'
                                                                                        name='tenantIdentityType2'
                                                                                        value='NRIC'
                                                                                        checked={values?.tenantIdentityType2 === 'NRIC'}
                                                                                        onChange={handleChange}
                                                                                        disabled={disable.field}
                                                                                    />
                                                                                    <label htmlFor='NRIC'>NRIC</label>
                                                                                </div>
                                                                                <div className='form-check'>
                                                                                    <input
                                                                                        className='form-check-input'
                                                                                        type='radio'
                                                                                        name='tenantIdentityType2'
                                                                                        value='Passport'
                                                                                        checked={values?.tenantIdentityType2 === 'Passport'}
                                                                                        onChange={handleChange}
                                                                                        disabled={disable.field}
                                                                                    />
                                                                                    <label htmlFor='Passport'>Passport</label>
                                                                                </div>
                                                                                {(touched.tenantIdentityType2 && errors.tenantIdentityType2) &&
                                                                                    <span className="formik-error-msg">{errors.tenantIdentityType2}</span>
                                                                                }
                                                                            </div>
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='tenantGender2'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Gender :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Select
                                                                                size='sm'
                                                                                placeholder='Gender'
                                                                                defaultValue={'Male'}
                                                                                value={values.tenantGender2}
                                                                                onChange={handleChange}
                                                                                disabled={disable.field}
                                                                            >
                                                                                {SetupData.gender.map((obj) => {
                                                                                    return <option value={obj.value}>{obj.label}</option>
                                                                                })}
                                                                            </Form.Select>
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='tenantMobile2'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Contact No. :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Contact No'
                                                                                defaultValue={values.tenantMobile2}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            {(touched.tenantMobile2 && errors.tenantMobile2) &&
                                                                                <span className="formik-error-msg">{errors.tenantMobile2}</span>}
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='tenantEmail2'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Email Address :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Email Address'
                                                                                defaultValue={values.tenantEmail2}
                                                                                onChange={handleChange}
                                                                                disabled={disable.field}
                                                                            />
                                                                            {touched.tenantEmail2 && errors.tenantEmail2 &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.tenantEmail2}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='tenantRace2'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Race :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Select
                                                                                size='sm'
                                                                                placeholder='Race'
                                                                                defaultValue={values.tenantRace2}
                                                                                onChange={handleChange}
                                                                                disabled={disable.field}
                                                                            >
                                                                                {SetupData.race.map((obj) => {
                                                                                    return <option value={obj.value}>{obj.label}</option>
                                                                                })}
                                                                            </Form.Select>
                                                                        </Col>
                                                                    </Form.Group>

                                                                    {values.tenantRace2 === 'Other' && (
                                                                        <Form.Group
                                                                            as={Row}
                                                                            className='mb-3 align-items-center'
                                                                            controlId='tenantOtherRace2'
                                                                        >
                                                                            <Form.Label column md='4'></Form.Label>
                                                                            <Col column md='8'>
                                                                                <Form.Control
                                                                                    type='text'
                                                                                    size='sm'
                                                                                    placeholder='Other Race'
                                                                                    defaultValue={values.tenantOtherRace2}
                                                                                    onChange={handleChange}
                                                                                    disabled={disable.field}
                                                                                />
                                                                            </Col>
                                                                        </Form.Group>
                                                                    )}
                                                                </Col>
                                                            </Row>
                                                            <hr />
                                                            <Row>
                                                                <Col>
                                                                    <h2>Tenancy Details</h2>
                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='tenancyPeriod'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Tenancy Period<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Select
                                                                                size='sm'
                                                                                placeholder='Tenancy period'
                                                                                defaultValue={values.tenancyPeriod}
                                                                                name='tenancyPeriod'
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            >
                                                                                {SetupData.tenancyPeriod.map((obj) => {
                                                                                    return <option value={obj.value}>{obj.label}</option>
                                                                                })}
                                                                            </Form.Select>
                                                                            {touched.tenancyPeriod && errors.tenancyPeriod &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.tenancyPeriod}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>

                                                                    {values.tenancyPeriod === 'Other' && (
                                                                        <Form.Group
                                                                            as={Row}
                                                                            className='mb-3 align-items-center'
                                                                            controlId='tenancyOtherPeriod'
                                                                        >
                                                                            <Form.Label column md='4'></Form.Label>
                                                                            <Col column md='8'>
                                                                                <Form.Control
                                                                                    type='text'
                                                                                    size='sm'
                                                                                    placeholder='Other Tenancy Period'
                                                                                    defaultValue={values.tenancyOtherPeriod}
                                                                                    onChange={handleChange}
                                                                                    disabled={disable.field}
                                                                                />
                                                                            </Col>
                                                                        </Form.Group>
                                                                    )}

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='tenancyStartDate'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Tenancy Commencement Date<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <DatePicker
                                                                                className='form-control form-control-sm'
                                                                                wrapperClassName='custom-date-picker-wrapper'
                                                                                dateFormat="dd/MM/yyyy"
                                                                                name="tenancyStartDate"
                                                                                placeholderText='dd/mm/yyyy'
                                                                                selected={values?.tenancyStartDate ? new Date(values?.tenancyStartDate) : ''}
                                                                                onChange={(date) => { setFieldValue('tenancyStartDate', date) }}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            {touched.tenancyStartDate && errors.tenancyStartDate &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.tenancyStartDate}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='tenancyEndDate'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Tenancy End Date<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <DatePicker
                                                                                className='form-control form-control-sm'
                                                                                wrapperClassName='custom-date-picker-wrapper'
                                                                                dateFormat="dd/MM/yyyy"
                                                                                name="tenancyEndDate"
                                                                                placeholderText='dd/mm/yyyy'
                                                                                selected={values?.tenancyEndDate ? new Date(values?.tenancyEndDate) : ''}
                                                                                onChange={(date) => setFieldValue('tenancyEndDate', date)}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field} />
                                                                            {touched.tenancyEndDate && errors.tenancyEndDate &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.tenancyEndDate}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col>
                                                                    <h2>Access Card Details</h2>
                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='accessCardNo'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Access Card No. :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Access Card No'
                                                                                defaultValue={values.accessCardNo}
                                                                                name='accessCardNo'
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            {touched.accessCardNo && errors.accessCardNo &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.accessCardNo}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                            <hr />
                                                            <Row>
                                                                <h2>Rental and Deposit Details</h2>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='advanceRental'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Advance Rental for
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Month'
                                                                                value={values.advanceRentalMonth || ''}
                                                                                name='advanceRentalMonth'
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            Month (RM)<span className='required'></span>  :
                                                                        </Form.Label>

                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Advanced Rental for 2 Month (RM)'
                                                                                // defaultValue={values.advanceRental || null}
                                                                                value={lib.numberFormatter(values.advanceRental, 2)}
                                                                                name='advanceRental'
                                                                                onChange={(e) => setFieldValue('advanceRental', lib.numberFormatter(e.target.value, 2))}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            {touched.advanceRental && errors.advanceRental &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.advanceRental}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='securityDeposit'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Security Deposit
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Month'
                                                                                value={values.securityDepositMonth || ''}
                                                                                name='securityDepositMonth'
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            Month (RM)<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Security Deposit 1 Month (RM)'
                                                                                value={lib.numberFormatter(values.securityDeposit, 2)}
                                                                                name='securityDeposit'
                                                                                onChange={(e) => setFieldValue('securityDeposit', lib.numberFormatter(e.target.value, 2))}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            {touched.securityDeposit && errors.securityDeposit &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.securityDeposit}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='utilityDeposit'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Utility Deposit
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Month'
                                                                                value={values.utilityDepositMonth || ''}
                                                                                name='utilityDepositMonth'
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            Month (RM)<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Utility Deposit 1 Month (RM)'
                                                                                value={lib.numberFormatter(values.utilityDeposit, 2)}
                                                                                onChange={(e) => setFieldValue('utilityDeposit', lib.numberFormatter(e.target.value, 2))}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            {touched.utilityDeposit && errors.utilityDeposit &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.utilityDeposit}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col>
                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='accessCardDeposit'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Access Card Deposit (RM)<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Access Card Deposit (RM)'
                                                                                value={lib.numberFormatter(values.accessCardDeposit, 2)}
                                                                                onChange={(e) => setFieldValue('accessCardDeposit', lib.numberFormatter(e.target.value, 2))}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            {touched.accessCardDeposit && errors.accessCardDeposit &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.accessCardDeposit}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='assuranceAgreement'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Assurance + Agreement (RM)<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Assurance + Agreement (RM)'
                                                                                value={lib.numberFormatter(values.assuranceAgreement, 2)}
                                                                                onChange={(e) => setFieldValue('assuranceAgreement', lib.numberFormatter(e.target.value, 2))}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            {touched.assuranceAgreement && errors.assuranceAgreement &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.assuranceAgreement}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <div>
                                                                        <h4 className='text-end'>
                                                                            Total to be paid: RM
                                                                            {/* compute w/o delay */}
                                                                            {lib.numberFormatter(totalToBePaid, 2)}
                                                                        </h4>
                                                                    </div>
                                                                    <br />
                                                                    <p className='note text-end'>
                                                                        Please take note that all Payment shall bank in to{' '}
                                                                        <strong>I ROOMZ SDN. BHD 2563058252 (UOB)</strong>
                                                                    </p>
                                                                </Col>
                                                            </Row>
                                                            <hr />

                                                            <Row>
                                                                <h2>Tenant Payment Details</h2>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='tenantPaidDate'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Tenant Paid Date :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            {/* <Form.Control
                                                                            type='date'
                                                                            size='sm'
                                                                            placeholder='Tenant Paid Date'
                                                                            value={values.tenantPaidDate}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                        /> */}
                                                                            <DatePicker
                                                                                className='form-control form-control-sm'
                                                                                wrapperClassName='custom-date-picker-wrapper'
                                                                                dateFormat="dd/MM/yyyy"
                                                                                placeholderText='dd/mm/yyyy'
                                                                                selected={values.tenantPaidDate ? new Date(values?.tenantPaidDate) : ''}
                                                                                onChange={(date) => setFieldValue('tenantPaidDate', date)}
                                                                                disabled={disable.field}
                                                                            />
                                                                            {/* {touched.tenantPaidDate && errors.tenantPaidDate &&
                                                                            <span className='formik-error-msg'>
                                                                                {errors.tenantPaidDate}
                                                                            </span>} */}
                                                                        </Col>
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col>
                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='tenantPaidAmount'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Tenant Paid Amount :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Tenant Paid Amount'
                                                                                value={lib.numberFormatter(values.tenantPaidAmount, 2)}
                                                                                onChange={(e) => setFieldValue('tenantPaidAmount', lib.numberFormatter(e.target.value, 2))}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            {/* {touched.tenantPaidAmount && errors.tenantPaidAmount &&
                                                                            <span className='formik-error-msg'>
                                                                                {errors.tenantPaidAmount}
                                                                            </span>} */}
                                                                        </Col>
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                            <div>
                                                                {/* compute w/o delay */}
                                                                <h4 className='text-end'>
                                                                    Balance Amount: RM
                                                                    {lib.numberFormatter(balanceAmount, 2)}
                                                                </h4>
                                                            </div>

                                                            <hr />
                                                            <Row>
                                                                <h2>Emergency Contact Details</h2>
                                                                <Col>
                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='emergencyContactName'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Name<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Name'
                                                                                defaultValue={values.emergencyContactName}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            {touched.emergencyContactName && errors.emergencyContactName &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.emergencyContactName}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='emergencyContactTitle'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Title<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Select
                                                                                size='sm'
                                                                                placeholder='Title'
                                                                                defaultValue={values.emergencyContactTitle}
                                                                                name='emergencyContactTitle'
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            >
                                                                                {SetupData.nameTitle.map((obj) => {
                                                                                    return <option value={obj.value}>{obj.label}</option>
                                                                                })}
                                                                            </Form.Select>
                                                                            {touched.emergencyContactTitle && errors.emergencyContactTitle &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.emergencyContactTitle}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col>
                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='emergencyContactMobile'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Contact No.<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Contact No'
                                                                                defaultValue={values.emergencyContactMobile}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            {touched.emergencyContactMobile && errors.emergencyContactMobile &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.emergencyContactMobile}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='emergencyContactRelationWithTenant'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Relationship with tenant<span className='required'></span>  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Relationship with tenant'
                                                                                defaultValue={values.emergencyContactRelationWithTenant}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            {touched.emergencyContactRelationWithTenant && errors.emergencyContactRelationWithTenant &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.emergencyContactRelationWithTenant}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                            <hr />
                                                            <Row>
                                                                <h2>Referee Details</h2>
                                                                <Col>
                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='refereeName'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Name :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Name'
                                                                                defaultValue={values.refereeName}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            {touched.refereeName && errors.refereeName &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.refereeName}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='refereeTitle'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Title :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Select
                                                                                size='sm'
                                                                                placeholder='Title'
                                                                                defaultValue={values.refereeTitle}
                                                                                name='refereeTitle'
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            >
                                                                                {SetupData.nameTitle.map((obj) => {
                                                                                    return <option value={obj.value}>{obj.label}</option>
                                                                                })}
                                                                            </Form.Select>
                                                                            {touched.refereeTitle && errors.refereeTitle &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.refereeTitle}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col>
                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='refereeMobile'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Contact No.  :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Contact No'
                                                                                defaultValue={values.refereeMobile}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            {touched.refereeMobile && errors.refereeMobile &&
                                                                                <span className="formik-error-msg">{errors.refereeMobile}</span>}
                                                                        </Col>
                                                                    </Form.Group>

                                                                    <Form.Group
                                                                        as={Row}
                                                                        className='mb-3 align-items-center'
                                                                        controlId='refereeRelationWithTenant'
                                                                    >
                                                                        <Form.Label column md='4'>
                                                                            Relationship with tenant :
                                                                        </Form.Label>
                                                                        <Col column md='8'>
                                                                            <Form.Control
                                                                                type='text'
                                                                                size='sm'
                                                                                placeholder='Relationship with tenant'
                                                                                defaultValue={values.refereeRelationWithTenant}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                disabled={disable.field}
                                                                            />
                                                                            {touched.refereeRelationWithTenant && errors.refereeRelationWithTenant &&
                                                                                <span className='formik-error-msg'>
                                                                                    {errors.refereeRelationWithTenant}
                                                                                </span>}
                                                                        </Col>
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                        </>)}

                                                        <div className='d-flex pt-10'>
                                                            <div className='me-2'>
                                                                <button
                                                                    type='button'
                                                                    className='btn btn-lg btn-light-primary me-3'
                                                                    data-kt-stepper-action='previous'
                                                                    onClick={prevStep}
                                                                >
                                                                    Previous
                                                                </button>
                                                                <button
                                                                    type='button'
                                                                    className='btn btn-lg btn-primary'
                                                                    data-kt-stepper-action='next'
                                                                    onClick={handleSubmit}
                                                                >
                                                                    Next Step
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }}
                                        </Formik>
                                    </div>

                                    {/* Step 3 */}
                                    <div data-kt-stepper-element='content'>
                                        <Formik
                                            enableReinitialize
                                            initialValues={initialValues2}
                                            // validationSchema={validationSchema2}
                                            onSubmit={async (values, { setSubmitting }) => {
                                                // setSubmitting(true)
                                                setLoading(true)
                                                try {
                                                    const result = await eTenanciesBiz.previewReservationForm(formData)
                                                    // console.log(result)
                                                    if (result) {
                                                        // Convert Uint8Array to Blob
                                                        const pdfBlob = new Blob([result], { type: 'application/pdf' })

                                                        // Create a Blob URL
                                                        const blobUrl = URL.createObjectURL(pdfBlob)

                                                        // Set the Blob URL to the state
                                                        setReservationPDF(blobUrl)
                                                        // handleSetFormData(values)
                                                    }
                                                } catch (err) {
                                                    lib.log(err)
                                                } finally {
                                                    setLoading(false)
                                                }
                                            }}
                                        >
                                            {(props) => {
                                                const {
                                                    values,
                                                    touched,
                                                    errors,
                                                    dirty,
                                                    isSubmitting,
                                                    handleChange,
                                                    handleBlur,
                                                    handleSubmit,
                                                    handleReset,
                                                    setFieldValue,
                                                } = props

                                                const handlePreviousStep = () => {
                                                    setAgreementPDF('')
                                                    prevStep()
                                                }

                                                const handleNextStep = () => {
                                                    handleSubmit()
                                                    nextStep()
                                                }

                                                return (
                                                    <div className='e-tenancy-pdf-preview-wrapper'>
                                                        {loading && (
                                                            <span className='indicator-progress' style={{ display: 'block' }}>
                                                                Please wait...
                                                                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                            </span>
                                                        )}
                                                        {!loading && (
                                                            <iframe
                                                                title='PDF Viewer'
                                                                src={agreementPDF}
                                                                width='100%'
                                                                height='800px'
                                                                frameBorder='0'
                                                            ></iframe>
                                                        )}

                                                        <div className='d-flex pt-10'>
                                                            <div className='me-2'>
                                                                <button
                                                                    type='button'
                                                                    className='btn btn-lg btn-light-primary me-3'
                                                                    data-kt-stepper-action='previous'
                                                                    onClick={handlePreviousStep}
                                                                >
                                                                    Previous
                                                                </button>
                                                            </div>
                                                            <div>
                                                                <button
                                                                    type='button'
                                                                    className='btn btn-lg btn-primary'
                                                                    data-kt-stepper-action='next'
                                                                    onClick={handleNextStep}
                                                                >
                                                                    Next
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }}
                                        </Formik>
                                    </div>

                                    {/* Step 4 */}
                                    <div data-kt-stepper-element='content'>
                                        <Formik
                                            enableReinitialize
                                            initialValues={initialValues1}
                                            // validationSchema={validationSchema1}
                                            onSubmit={async (values, { setSubmitting }) => {
                                                let result
                                                // console.log(formMode)
                                                // console.log(formData)
                                                if (formMode === modeEdit) {
                                                    // lib.log('I AM EDITING')
                                                    result = await eTenanciesBiz.update(formData)
                                                    toast.success(`E-tenancy (${formData.propertyCode}) info updated successfully`)

                                                } else {
                                                    // lib.log('I AM SAVING')
                                                    result = await eTenanciesBiz.save(formData)
                                                    toast.success('New e-tenancy saved successfully')
                                                }
                                                lib.log(result)
                                                getFilteredETenancies()
                                                toggleFormModal()
                                            }}
                                        >
                                            {(props) => {
                                                const {
                                                    values,
                                                    touched,
                                                    errors,
                                                    dirty,
                                                    isSubmitting,
                                                    handleChange,
                                                    handleBlur,
                                                    handleSubmit,
                                                    handleReset,
                                                    setFieldValue,
                                                } = props

                                                const handlePreviousStep = () => {
                                                    setReservationPDF(null)
                                                    prevStep()
                                                }

                                                return (
                                                    <div className='e-tenancy-pdf-preview-wrapper'>
                                                        {loading && (
                                                            <span className='indicator-progress' style={{ display: 'block' }}>
                                                                Please wait...
                                                                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                            </span>
                                                        )}
                                                        {!loading && (
                                                            <iframe
                                                                title='PDF Viewer'
                                                                src={reservationPDF}
                                                                width='100%'
                                                                height='800px'
                                                                frameBorder='0'
                                                            ></iframe>
                                                        )}

                                                        <div className='d-flex pt-10'>
                                                            <div className='me-2'>
                                                                <button
                                                                    type='button'
                                                                    className='btn btn-lg btn-light-primary me-3'
                                                                    data-kt-stepper-action='previous'
                                                                    onClick={handlePreviousStep}
                                                                >
                                                                    Previous
                                                                </button>
                                                            </div>
                                                            {disable.field === false &&
                                                                <div>
                                                                    <button
                                                                        type='button'
                                                                        className='btn btn-lg btn-primary'
                                                                        data-kt-stepper-action='submit'
                                                                        onClick={handleSubmit}
                                                                    >
                                                                        Submit
                                                                    </button>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            }}
                                        </Formik>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </Modal.Body >
            </Modal >

            {/* Signature Modal */}
            <Modal
                id='kt_modal_create_app'
                tabIndex={-1}
                aria-hidden='true'
                dialogClassName='modal-dialog modal-dialog-centered mw-624px'
                show={signModal}
                onHide={toggleSignModal}
                backdrop={true}
                size='md'
            >
                <Modal.Body>
                    {signData.role === 'Manager' ? <ManagerModalContent /> : <TenantModalContent />}
                </Modal.Body>
            </Modal>
        </div >
    )
}

export default ETenanciesPage;




































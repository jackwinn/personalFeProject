//packages
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Dropdown, DropdownButton, Col, Row, Modal, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { Formik } from 'formik'
import DatePicker from 'react-datepicker'
import InfiniteScroll from 'react-infinite-scroll-component'
import SignatureCanvas from 'react-signature-canvas'

//metronic components
import { StepperComponent } from '../../_metronic/assets/ts/components'
import { KTIcon } from '../../_metronic/helpers'

//setup data
import { setupData } from '../data/setupData'

//biz
import { lib } from '../biz/lib'
import { regex } from '../biz/regex'
import { etenancyBiz } from '../biz/etenancyBiz'

export default function ETenancyPage() {
  const userSlice = useSelector((state) => state.user)

  //search
  const [search, setSearch] = useState({})
  const [prevSearch, setPrevSearch] = useState({})
  const [page, setPage] = useState(0)
  const [pageSummary, setPageSummary] = useState({})

  //filter
  const statusRef = useRef('')
  const inputRef = useRef('')

  //e-tenancy
  const [etenancyList, setEtenancyList] = useState([])
  const [etenancyFormData, setEtenancyFormData] = useState({})
  const newEtenancyFormData = {
    propertyAddress: '',
    monthlyRental: '',
    tenantName: '',
    tenantIdentityNo: '',
    tenantEmail: '',
    tenantMobile: '',
    tenancyPeriod: '',
    tenancyStartDate: '',
    tenancyEndDate: '',
    securityDeposit: '',
    utilityDeposit: '',
    parkingCardDeposit: '',
    accessCardDeposit: '',
    hostName: '',
    hostIdentityNo: '',
  }
  const [eTenancyFormModal, setEtanancyFormModal] = useState(false)
  const modeNew = 'New'
  const modeEdit = 'Edit'
  const [eTenancyFormMode, setEtanancyFormMode] = useState('')
  const validationSchema = Yup.object().shape({
    propertyAddress: Yup.string()
      .required(setupData.requiredFieldMsg),
    monthlyRental: Yup.string()
      .required(setupData.requiredFieldMsg)
      .test('', 'Only numbers are allowed', regex.isNumeric),
    tenantName: Yup.string()
      .required(setupData.requiredFieldMsg)
      .test("", "Only alphabetic characters, /, @, and . are allowed", (value) => {
        if (value) {
          return regex.isName(value)
        }
        return true
      }),
    tenantIdentityNo: Yup.string()
      .required(setupData.requiredFieldMsg)
      .test("", "Please enter in format 01xxxx-xx-xxxx", (value) => {
        if (value) {
          return regex.isMalaysianIC(value)
        }
        return true
      }),
    tenantEmail: Yup.string()
      .required(setupData.requiredFieldMsg)
      .test("", "Please enter in format name@example.com", (value) => {
        if (value) {
          return regex.isValidEmail(value)
        }
        return true
      }),
    tenantMobile: Yup.string()
      .required(setupData.requiredFieldMsg)
      .test("", "Please enter in format 01x-xxxxxxx", (value) => {
        if (value) {
          return regex.isValidPhone(value)
        }
        return true
      }),
    tenancyPeriod: Yup.string().required(setupData.requiredFieldMsg),
    tenancyStartDate: Yup.string().required(setupData.requiredFieldMsg),
    tenancyEndDate: Yup.string().required(setupData.requiredFieldMsg),
    securityDeposit: Yup.string()
      .required(setupData.requiredFieldMsg)
      .test('', 'Only numbers are allowed', regex.isNumeric),
    utilityDeposit: Yup.string()
      .required(setupData.requiredFieldMsg)
      .test('', 'Only numbers are allowed', (value) => {
        if (value) {
          return regex.isNumeric(value)
        }
        return true
      }),
    accessCardDeposit: Yup.string()
      .test('', 'Only numbers are allowed', (value) => {
        if (value) {
          return regex.isNumeric(value)
        }
        return true
      }),
    parkingCardDeposit: Yup.string()
      .test('', 'Only numbers are allowed', (value) => {
        if (value) {
          return regex.isNumeric(value)
        }
        return true
      }),
  })

  //sign
  const [signModal, setSignModal] = useState(false)
  const [signRef, setSignatureImage] = useState('')
  const [etenancyId, setEtenancyId] = useState(null)

  //stepper
  const [stepper, setStepper] = useState(null)
  const [stepperElement, setStepperElement] = useState(null)

  //loading
  const [loading, setLoading] = useState(false)

  //pdf preview
  const [agreementPDF, setAgreementPDF] = useState(null)

  useEffect(() => {
    getEtenancyList()
  }, [search])

  //get all etenancy records
  const getEtenancyList = async () => {
    window.scrollTo(0, 0)
    setEtenancyList([])
    setPrevSearch(search)

    const result = await etenancyBiz.search(search, page)
    setEtenancyList(result?.data)
    setPageSummary(result?.summary)
    setPage(1)
  }

  //load more by scrolling
  useEffect(() => {
    if (page > 1) {
      const fetchMore = async () => {
        const result = await etenancyBiz.search(prevSearch, page)

        if (result && result.data) {
        }
        setEtenancyList((eTenancies) => [...eTenancies, ...result.data])
      }

      fetchMore()
    }
  }, [page])

  const handleLoadMore = () => {
    setPage((page) => page + 1)
  }

  useEffect(() => {
    // Create an instance of the stepper when the component mounts
    const loadStepper = () => {
      const newStepper = StepperComponent.createInsance(stepperElement)
      setStepper(newStepper)
    }

    loadStepper()

    // Cleanup: Destroy the stepper instance when the component unmounts
    return () => {
      if (stepper) {
        stepper.destroy()
      }
    }
  }, [stepperElement])

  const prevStep = () => {
    if (stepper) {
      stepper.goPrev()
    }
  }

  const nextStep = () => {
    if (stepper) {
      stepper.goNext()
    }
  }

  const toggleEtancyFormModal = () => {
    setEtanancyFormModal(!eTenancyFormModal)
  }

  const createNewEtenancy = () => {
    setEtanancyFormMode(modeNew)
    setEtenancyFormData({})
    toggleEtancyFormModal()
  }

  const populateEtenancyData = async (etenancyId) => {
    const result = await etenancyBiz.getById(etenancyId)
    console.log('populate Etenancy data:')
    console.log(result)
    let selectedFormData = {
      _id: result._id,
      propertyAddress: result?.property?.address,
      monthlyRental: String(result?.property?.monthlyRental),

      tenantName: result?.tenant?.name,
      tenantIdentityNo: result?.tenant?.identityNo,
      tenantMobile: result?.tenant?.mobile,
      tenantEmail: result?.tenant?.email,

      securityDeposit: String(result?.deposit?.security),
      utilityDeposit: String(result?.deposit?.utility),
      accessCardDeposit: String(result?.deposit?.accessCard),
      parkingCardDeposit: String(result?.deposit?.parkingCard),

      tenancyPeriod: result.tenancy.period,
      tenancyStartDate: result.tenancy.startDate,
      tenancyEndDate: result.tenancy.endDate,

      hostName: result.host.name,
      hostIdentityNo: result.host.identityNo,
      hostSignatureImage: result.host?.signatureImage,
      hostSignDate: result.host?.signDate,

      dateOfAgreement: result.dateOfAgreement,
    }
    if (result) {
      setEtenancyFormData(selectedFormData)
    } else {
      setEtenancyFormData({})
    }
    return selectedFormData
  }

  const handleSelectedEtenancy = async (etanancyId) => {
    setEtanancyFormMode(modeEdit)
    const selectedFormData = await populateEtenancyData(etanancyId)
    if (selectedFormData) setEtenancyFormData(selectedFormData)
    toggleEtancyFormModal()
  }

  const handleDownloadPDF = async (id) => {
    // setSelectedId(id)
    const selectedformData = await populateEtenancyData(id)
    // console.log(type)
    const result = await etenancyBiz.previewAgreement(selectedformData)

    const fileBlob = new Blob([result], { type: 'application/pdf' })
    const fileURL = window.URL.createObjectURL(fileBlob)

    window.open(fileURL)
  }

  const toggleSignModal = () => {
    setSignModal(!signModal)
  }

  const handleSignModal = (etenancyId) => {
    setEtenancyId(etenancyId)
    toggleSignModal()
  }

  const handleSignAgreement = async () => {
    if (!signRef.isEmpty()) {
      const signatureImg = signRef.getTrimmedCanvas().toDataURL('image/png')

      if (etenancyId) {
        const result = await etenancyBiz.signAgreement(
          etenancyId,
          userSlice.personal.name,
          signatureImg
        )
        if (result) {
          toast.success(`Manager signature updated successfully`)
          getEtenancyList()
          toggleSignModal()
        }
      }
    } else {
      toast.error(`Manager signature is required`)
    }
  }

  // search functions start
  const assignSearchValue = (name, value) => {
    setSearch((searchs) => ({
      ...searchs,
      [name]: value,
    }))
  }

  const handleSearch = async () => {
    assignSearchValue('status', statusRef ? statusRef.current?.value : null)
    assignSearchValue('custom', inputRef ? inputRef.current?.value : null)
  }

  const handleSearchEnter = (e) => {
    if (e.key.toLowerCase() === 'enter') handleSearch()
  }
  // search functions end

  return (
    <div className='etenant-page'>
      <div className='td-filter-group'>
        <select
          defaultValue={setupData.etenancyStatus[0]}
          className='form-select td-filter-select'
          ref={statusRef}
        >
          {setupData.etenancyStatus.map((status, index) => {
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
          placeholder='tenant name, email or mobile'
          type='text'
          ref={inputRef}
          onKeyDown={handleSearchEnter}
        />
        <div className='form-control td-filter-search-group'>
          <button
            className='td-filter-search-btn'
            type='submit'
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      <div className='td-header-btn-group'>
        <span>{pageSummary.records} records</span>
        <button className='btn btn-primary' onClick={createNewEtenancy}>
          New E-Tenancy
        </button>
      </div>

      {/* table data start */}
      <div className='table-overflow'>
        <InfiniteScroll
          dataLength={etenancyList.length}
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
                <th>Property Info</th>
                <th>Tenant Info</th>
                <th>Tenancy Period</th>
                <th>Created</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {etenancyList.map((agreement) => {
                return (
                  <tr key={agreement._id}>
                    <td>
                      Address: {agreement?.property?.address} <br />
                      Month Rental : RM{agreement?.property?.monthlyRental}
                    </td>
                    <td>
                      Name: {agreement?.tenant?.name} <br />
                      Mobile: {agreement?.tenant?.mobile} <br />
                      Email: {agreement?.tenant?.email}
                    </td>
                    <td>
                      Start date: {lib.formatDateDDMMYYYY(agreement?.tenancy?.startDate)} <br />
                      End date: {lib.formatDateDDMMYYYY(agreement?.tenancy?.endDate)}
                    </td>
                    <td>{lib.formatDateDDMMYYYY(agreement?.created)}</td>
                    <td>{agreement.status}</td>
                    <td>
                      <DropdownButton variant='primary' id='dropdown-basic-button' title='Action'>
                        <Dropdown.Item onClick={() => handleSelectedEtenancy(agreement?._id)}>
                          Edit Form
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSignModal(agreement?._id)}>
                          Manager Sign
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDownloadPDF(agreement?._id)}>
                          Download Agreement
                        </Dropdown.Item>
                      </DropdownButton>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
      {/* table data end */}

      {/* e-Tenancy form start*/}
      <Modal
        id='kt_modal_create_app'
        tabIndex={-1}
        aria-hidden='true'
        dialogClassName='modal-dialog modal-dialog-centered mw-624px'
        show={eTenancyFormModal}
        onHide={toggleEtancyFormModal}
        backdrop={true}
        size='xl'
      >
        <Modal.Body>
          <div className=''>
            <div
              ref={(ref) => setStepperElement(ref)}
              className='stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid etenant-stepper-container'
              id='kt_modal_create_app_stepper'
            >
              {/* Stepper nagivation */}
              <div className='stepper-nav ps-lg-10 etenant-stepper-nav '>
                <div
                  className='stepper-item etenant-stepper-item current'
                  data-kt-stepper-element='nav'
                >
                  <div className='stepper-wrapper'>
                    <div className='stepper-icon w-40px h-40px'>
                      <i className='stepper-check fas fa-check'></i>
                      <span className='stepper-number'>1</span>
                    </div>
                    <div className='stepper-label'>
                      <h3 className='stepper-title'>Tenancy Agreement</h3>
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
                      <h3 className='stepper-title'>Preview e-Tenancy</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stepper contents */}
              <div className='flex-row-fluid py-lg-5 px-lg-15'>
                <form id='kt_modal_create_app_form'>
                  {/* step 1 begin */}
                  <div className='current' data-kt-stepper-element='content'>
                    <Formik
                      enableReinitialize
                      initialValues={
                        eTenancyFormMode === modeNew ? newEtenancyFormData : etenancyFormData
                      }
                      validationSchema={validationSchema}
                      onSubmit={async (values, { setSubmitting }) => {
                        setSubmitting(false)
                        setLoading(true)

                        let updatedValues = {             
                        }                        

                        if (eTenancyFormMode === modeNew) {
                          updatedValues = {
                            ...values,
                            hostName: userSlice.personal.name,
                            hostIdentityNo: userSlice.personal.identity.number,
                            dateOfAgreement: new Date(),
                          }
                        } else {
                          updatedValues = {
                            ...values,                          
                          }
                        }

                        setEtenancyFormData(updatedValues)

                        try {
                          const result = await etenancyBiz.previewAgreement({
                            ...updatedValues,
                          })

                          if (result) {
                            // Convert Uint8Array to Blob
                            const pdfBlob = new Blob([result], { type: 'application/pdf' })
                            // Create a Blob URL
                            const blobUrl = URL.createObjectURL(pdfBlob)
                            // Set the Blob URL to the state
                            setAgreementPDF(blobUrl)
                          }
                        } catch (err) {
                          throw err
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

                        return (
                          <div className='w-100'>
                            <div className='etenancy-property-details'>
                              <h2>Property Details</h2>
                              <Row>
                                <Col>
                                  <Form.Group
                                    as={Row}
                                    className='mb-3 align-items-center'
                                    controlId='propertyAddress'
                                  >
                                    <Form.Label column md='4'>
                                      <span className='required'>Address</span> :
                                    </Form.Label>
                                    <Col column md='8'>
                                      <Form.Control
                                        as='textarea'
                                        rows='3'
                                        size='sm'
                                        placeholder='Property Address'
                                        defaultValue={values.propertyAddress}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {touched.propertyAddress && errors.propertyAddress && (
                                        <span className='formik-error-msg'>
                                          {errors.propertyAddress}
                                        </span>
                                      )}
                                    </Col>
                                  </Form.Group>
                                </Col>

                                <Col>
                                  <Form.Group
                                    as={Row}
                                    className='mb-3 align-items-center'
                                    controlId='monthlyRental'
                                  >
                                    <Form.Label column md='4'>
                                      <span className='required'>Monthly Rental (RM)</span> :
                                    </Form.Label>
                                    <Col column md='8'>
                                      <Form.Control
                                        type='text'
                                        size='sm'
                                        placeholder='Monthly Rental (RM)'
                                        defaultValue={values.monthlyRental}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {touched.monthlyRental && errors.monthlyRental && (
                                        <span className='formik-error-msg'>
                                          {errors.monthlyRental}
                                        </span>
                                      )}
                                    </Col>
                                  </Form.Group>
                                </Col>

                              </Row>
                            </div>
                            <hr />
                            <div>
                              <h2>Tenant Details</h2>
                              <Row>
                                <Col>
                                  <Form.Group
                                    as={Row}
                                    className='mb-3 align-items-center'
                                    controlId='tenantName'
                                  >
                                    <Form.Label column md='4'>
                                      <span className='required'>Name</span> :
                                    </Form.Label>
                                    <Col column md='8'>
                                      <Form.Control
                                        type='text'
                                        size='sm'
                                        placeholder='Tenant Name'
                                        defaultValue={values.tenantName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {touched.tenantName && errors.tenantName && (
                                        <span className='formik-error-msg'>
                                          {errors.tenantName}
                                        </span>
                                      )}
                                    </Col>
                                  </Form.Group>

                                  <Form.Group
                                    as={Row}
                                    className='mb-3 align-items-center'
                                    controlId='tenantIdentityNo'
                                  >
                                    <Form.Label column md='4'>
                                      <span className='required'>NRIC</span> :
                                    </Form.Label>
                                    <Col column md='8'>
                                      <Form.Control
                                        type='text'
                                        size='sm'
                                        placeholder='NRIC'
                                        defaultValue={values.tenantIdentityNo}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {touched.tenantIdentityNo && errors.tenantIdentityNo && (
                                        <span className='formik-error-msg'>
                                          {errors.tenantIdentityNo}
                                        </span>
                                      )}
                                    </Col>
                                  </Form.Group>
                                </Col>

                                <Col>
                                  <Form.Group
                                    as={Row}
                                    className='mb-3 align-items-center'
                                    controlId='tenantEmail'
                                  >
                                    <Form.Label column md='4'>
                                      <span className='required'>Email Address</span> :
                                    </Form.Label>
                                    <Col column md='8'>
                                      <Form.Control
                                        type='text'
                                        size='sm'
                                        placeholder='Email Address'
                                        defaultValue={values.tenantEmail}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {touched.tenantEmail && errors.tenantEmail && (
                                        <span className='formik-error-msg'>
                                          {errors.tenantEmail}
                                        </span>
                                      )}
                                    </Col>
                                  </Form.Group>

                                  <Form.Group
                                    as={Row}
                                    className='mb-3 align-items-center'
                                    controlId='tenantMobile'
                                  >
                                    <Form.Label column md='4'>
                                      <span className='required'>Contact No.</span> :
                                    </Form.Label>
                                    <Col column md='8'>
                                      <Form.Control
                                        type='text'
                                        size='sm'
                                        placeholder='Contact No'
                                        defaultValue={values.tenantMobile}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {touched.tenantMobile && errors.tenantMobile && (
                                        <span className='formik-error-msg'>
                                          {errors.tenantMobile}
                                        </span>
                                      )}
                                    </Col>
                                  </Form.Group>
                                </Col>
                              </Row>
                            </div>
                            <hr />

                            <Row>
                              <h2>Tenancy Details</h2>
                              <Col>
                                <Form.Group
                                  as={Row}
                                  className='mb-3 align-items-center'
                                  controlId='tenancyStartDate'
                                >
                                  <Form.Label column md='4'>
                                    <span className='required'>Tenancy Start Date</span> :
                                  </Form.Label>
                                  <Col column md='8'>
                                    <DatePicker
                                      className='form-control form-control-sm'
                                      wrapperClassName='custom-date-picker-wrapper'
                                      dateFormat='dd/MM/yyyy'
                                      name='tenancyStartDate'
                                      placeholderText='dd/mm/yyyy'
                                      selected={
                                        values?.tenancyStartDate
                                          ? new Date(values?.tenancyStartDate)
                                          : ''
                                      }
                                      onChange={(date) => {
                                        setFieldValue('tenancyStartDate', date)
                                      }}
                                      onBlur={handleBlur}
                                      autoComplete='off'
                                    />
                                    {touched.tenancyStartDate && errors.tenancyStartDate && (
                                      <span className='formik-error-msg'>
                                        {errors.tenancyStartDate}
                                      </span>
                                    )}
                                  </Col>
                                </Form.Group>

                                <Form.Group
                                  as={Row}
                                  className='mb-3 align-items-center'
                                  controlId='tenancyPeriod'
                                >
                                  <Form.Label column md='4'>
                                    <span className='required'>Tenancy Period</span> :
                                  </Form.Label>
                                  <Col column md='8'>
                                    <Form.Select
                                      size='sm'
                                      placeholder='Tenancy period'
                                      defaultValue={values.tenancyPeriod}
                                      name='tenancyPeriod'
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    >
                                      {setupData.tenancyPeriod.map((obj, i) => {
                                        return (
                                          <option key={i} value={obj.value}>
                                            {obj.label}
                                          </option>
                                        )
                                      })}
                                    </Form.Select>
                                    {touched.tenancyPeriod && errors.tenancyPeriod && (
                                      <span className='formik-error-msg'>
                                        {errors.tenancyPeriod}
                                      </span>
                                    )}
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
                                      />
                                    </Col>
                                  </Form.Group>
                                )}
                              </Col>
                              <Col>
                                <Form.Group
                                  as={Row}
                                  className='mb-3 align-items-center'
                                  controlId='tenancyEndDate'
                                >
                                  <Form.Label column md='4'>
                                    <span className='required'>Tenancy End Date</span> :
                                  </Form.Label>
                                  <Col column md='8'>
                                    <DatePicker
                                      className='form-control form-control-sm'
                                      wrapperClassName='custom-date-picker-wrapper'
                                      dateFormat='dd/MM/yyyy'
                                      name='tenancyEndDate'
                                      placeholderText='dd/mm/yyyy'
                                      selected={
                                        values?.tenancyEndDate
                                          ? new Date(values?.tenancyEndDate)
                                          : ''
                                      }
                                      onChange={(date) => setFieldValue('tenancyEndDate', date)}
                                      onBlur={handleBlur}
                                      autoComplete='off'
                                    />
                                    {touched.tenancyEndDate && errors.tenancyEndDate && (
                                      <span className='formik-error-msg'>
                                        {errors.tenancyEndDate}
                                      </span>
                                    )}
                                  </Col>
                                </Form.Group>
                              </Col>
                            </Row>
                            <hr />

                            <Row>
                              <h2>Rental and Deposit Details</h2>
                              <Col>
                                <Form.Group
                                  as={Row}
                                  className='mb-3 align-items-center'
                                  controlId='securityDeposit'
                                >
                                  <Form.Label column md='4'>
                                    <span className='required'>Security Deposit (RM)</span> :
                                  </Form.Label>
                                  <Col column md='8'>
                                    <Form.Control
                                      type='text'
                                      size='sm'
                                      placeholder='Security Deposit (RM)'
                                      value={values.securityDeposit}
                                      name='securityDeposit'
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                    {touched.securityDeposit && errors.securityDeposit && (
                                      <span className='formik-error-msg'>
                                        {errors.securityDeposit}
                                      </span>
                                    )}
                                  </Col>
                                </Form.Group>

                                <Form.Group
                                  as={Row}
                                  className='mb-3 align-items-center'
                                  controlId='utilityDeposit'
                                >
                                  <Form.Label column md='4'>
                                    <span className='required'>Utility Deposit (RM)</span> :
                                  </Form.Label>
                                  <Col column md='8'>
                                    <Form.Control
                                      type='text'
                                      size='sm'
                                      placeholder='Utility Deposit'
                                      value={values.utilityDeposit}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                    {touched.utilityDeposit && errors.utilityDeposit && (
                                      <span className='formik-error-msg'>
                                        {errors.utilityDeposit}
                                      </span>
                                    )}
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
                                    <span className=''>Access Card Deposit (RM)</span> :
                                  </Form.Label>
                                  <Col column md='8'>
                                    <Form.Control
                                      type='text'
                                      size='sm'
                                      placeholder='Access Card Deposit'
                                      value={values.accessCardDeposit}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                    {touched.accessCardDeposit && errors.accessCardDeposit && (
                                      <span className='formik-error-msg'>
                                        {errors.accessCardDeposit}
                                      </span>
                                    )}
                                  </Col>
                                </Form.Group>

                                <Form.Group
                                  as={Row}
                                  className='mb-3 align-items-center'
                                  controlId='parkingCardDeposit'
                                >
                                  <Form.Label column md='4'>
                                    <span className=''>Parking Card Deposit (RM)</span> :
                                  </Form.Label>
                                  <Col column md='8'>
                                    <Form.Control
                                      type='text'
                                      size='sm'
                                      placeholder='Parking Card Deposit'
                                      value={values.parkingCardDeposit}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                    {touched.parkingCardDeposit && errors.parkingCardDeposit && (
                                      <span className='formik-error-msg'>
                                        {errors.parkingCardDeposit}
                                      </span>
                                    )}
                                  </Col>
                                </Form.Group>

                                <br />
                                <div>
                                  <h4 className='text-'>Total to be paid: RM</h4>
                                </div>
                              </Col>
                            </Row>
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
                  {/* step 1 end */}

                  {/* step 2 start */}
                  <div className='' data-kt-stepper-element='content'>
                    <Formik
                      enableReinitialize
                      initialValues={{}}
                      // validationSchema={}
                      onSubmit={async (values) => {
                        let result
                        // console.log(etenancyFormData)
                        try {
                          if (eTenancyFormMode === modeEdit) {                            
                            result = await etenancyBiz.edit(etenancyFormData)
                            if (result) toast.success(`e-Tenancy updated successfully`)
                          } else {                           
                            result = await etenancyBiz.create(etenancyFormData)
                            if (result) toast.success('New e-tenancy saved successfully')
                          }
                        } catch (err) {
                          toast.error(setupData.systemErrorMsg)
                        } finally {
                          getEtenancyList()
                          toggleEtancyFormModal()
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
                          setAgreementPDF(null)
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
                                src={agreementPDF}
                                width='100%'
                                height='800px'
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
                                  data-kt-stepper-action='submit'
                                  onClick={handleSubmit}
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      }}
                    </Formik>
                  </div>
                  {/* step 2 end */}
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* e-Tenancy form end*/}

      {/* sign form start  */}
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
          <h2>Manager Signature</h2>
          <br />

          <div className='eSign-canvas-wrap'>
            <SignatureCanvas
              ref={(ref) => {
                setSignatureImage(ref)
              }}
              minWidth={1}
              maxWidth={1.3}
              canvasProps={{ className: 'signature-canvas' }}
            />
          </div>

          <div className='d-flex justify-content-center flex-wrap gap-3 fs-base fw-semibold mb-8'>
            <span></span>
            <button
              className='auth-forgot-button'
              type='button'
              onClick={() => signRef.clear()}
            >
              clear
            </button>
          </div>

          <div className='mb-10 d-flex justify-content-center'>
            <button type='button' className='btn btn-lg btn-primary' onClick={handleSignAgreement}>
              <span className='indicator-label'>Confirm</span>
            </button>
          </div>
        </Modal.Body>
      </Modal>
      {/* sign form end  */}
    </div>
  )
}

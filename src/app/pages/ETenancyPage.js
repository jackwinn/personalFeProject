//packages
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { Dropdown, DropdownButton, Col, Row, Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import DatePicker from "react-datepicker";
import InfiniteScroll from 'react-infinite-scroll-component';

//metronic components
import { StepperComponent } from "../../_metronic/assets/ts/components";
import { KTIcon } from "../../_metronic/helpers";

//setup data
import { setupData } from '../data/SetupData';

//biz
import { lib } from '../biz/lib'
import { etenancyBiz } from '../biz/etenancyBiz'


export default function ETenancyPage() {
  const userSlice = useSelector((state) => state.user)

  //search
  const [search, setSearch] = useState({});
  const [prevSearch, setPrevSearch] = useState({});
  const [page, setPage] = useState(0);
  const [pageSummary, setPageSummary] = useState({})

  //e-tenancy
  const [etenancyList, setEtenancyList] = useState([]);
  const [etenancyForm, setEtenancyForm] = useState([]);
  const [eTenancyFormModal, setEtanancyFormModal] = useState(false)

  //stepper
  const [stepper, setStepper] = useState(null);
  const [stepperElement, setStepperElement] = useState(null);

  //loading
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getEtenancyList()
  }, [search])

  //get all etenancy records
  const getEtenancyList = async () => {
    window.scrollTo(0, 0)
    setEtenancyList([])
    setPrevSearch(search)

    let searchParams
    searchParams = {
      search: search,
      paging: { page: 0 }
    }

    const result = await etenancyBiz.search(searchParams)
    setEtenancyList(result?.data)
    setPageSummary(result?.summary)
    setPage(1)
  }

  //load more by scrolling
  useEffect(() => {
    if (page > 1) {
      const fetchMore = async () => {
        let searchParams = {
          search: prevSearch,
          paging: {
            page: page
          }
        }

        const result = await etenancyBiz.search(searchParams)

        if (result && result.data) { }
        setEtenancyList((eTenancies) => [
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

  useEffect(() => {
    // Create an instance of the stepper when the component mounts
    const loadStepper = () => {
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

  const toggleFormModal = () => {
    setEtanancyFormModal(!eTenancyFormModal)
  }

  const createETenancy = () => {
    setEtenancyForm({})
    toggleFormModal()
  }

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
    assignSearchValue("custom", inputRef ? inputRef.current?.value : null)
  }

  const handleSearchEnter = (e) => {
    if (e.key.toLowerCase() === 'enter')
      handleSearch()
  }

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
        {/* <input
            className='form-control td-filter-input'
            placeholder='Search Property Code / Tenant Name'
            type='text'
            ref={inputRef}
            onKeyDown={handleSearchEnter}
          /> */}
        <div className='form-control td-filter-search-group'>
          <button className='td-filter-search-btn' type='submit'
          // onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      <div className='td-header-btn-group'>
        <span>{pageSummary.records} records</span>
        <button className='btn btn-primary' onClick={createETenancy}>
          New E-Tenancy
        </button>
      </div>

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
              {etenancyList.map((obj) => {
                return (
                  <tr key={obj._id}>
                    <td>{(obj.contract?.isHostSigned && obj.contract?.isTenantSigned) ? obj?.propertyUnit?.code : obj?.propertyRoom?.name}</td>
                    <td>
                      {(obj.contract?.isHostSigned && obj.contract?.isTenantSigned) ? obj?.mainTenant?.name : obj?.mainTenant?.personal?.name}<br />
                      {(obj.contract?.isHostSigned && obj.contract?.isTenantSigned) ? obj?.mainTenant?.email : obj?.mainTenant?.personal?.email}<br />
                      {(obj.contract?.isHostSigned && obj.contract?.isTenantSigned) ? obj?.mainTenant?.mobile : obj?.mainTenant?.personal?.mobile}
                    </td>
                    <td>
                      {lib.formatDateDMY(obj?.tenancy?.startDate)} -{' '}
                      {lib.formatDateDMY(obj?.tenancy?.endDate)}
                    </td>
                    <td>{lib.formatDateDMY(obj?.created)}</td>
                    <td>
                      {/* {getSignatureStatus(obj?.status, obj?.contract)}                     */}
                    </td>
                    <td>
                      <DropdownButton variant='primary' id="dropdown-basic-button" title="Action">
                        {/* <Dropdown.Item onClick={() => handleSelected(obj?._id, obj?.contract)}>Edit E-Tenancy</Dropdown.Item>
                        {action.sign &&
                          <Dropdown.Item
                            onClick={() => handleSignModal(obj?._id, 'Manager')}
                            disabled={obj?.contract.isHostSigned}
                          >
                            Manager Signature
                          </Dropdown.Item>} */}
                        {/* {action.sign &&
                          <Dropdown.Item
                            onClick={() => handleSignModal(obj?._id, 'Tenant', obj?.mainTenant?.personal.name, obj?.mainTenant?.personal.mobile)}
                            disabled={obj?.contract.isTenantSigned}
                          >
                            Send Signature Link To Tenant
                          </Dropdown.Item>} */}
                        {/* <Dropdown.Item onClick={() => handleDownloadPDF(obj?._id, 'Tenancy Agreement')}>Download Tenancy Agreement</Dropdown.Item> */}
                      </DropdownButton>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>


      {/* e-Tenancy form */}
      <Modal
        id='kt_modal_create_app'
        tabIndex={-1}
        aria-hidden='true'
        dialogClassName='modal-dialog modal-dialog-centered mw-624px'
        show={eTenancyFormModal}
        onHide={toggleFormModal}
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
              <div className='stepper-nav ps-lg-10 etenant-stepper-nav'>
                <div className='stepper-item etenant-stepper-item' data-kt-stepper-element='nav'>
                  <div className='stepper-wrapper'>
                    <div className='stepper-icon w-40px h-40px'>
                      <i className='stepper-check fas fa-check'></i>
                      <span className='stepper-number'>1</span>
                    </div>
                    <div className='stepper-label'>
                      <h3 className='stepper-title'>Agreement Form</h3>
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
                      <h3 className='stepper-title'>Preview Agreement</h3>
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
                      initialValues={{}}
                      // validationSchema={validationSchema1}
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
                          <div>
                            <div>
                              CONTENT PAGE 1 HERE
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
                      // validationSchema={validationSchema1}
                      onSubmit={async (values, { setSubmitting }) => {
                        setLoading(true)

                        const updatedValues = {
                          ...values,
                        }

                        try {
                          const result = await etenancyBiz.previewAgreement({
                            ...updatedValues
                          })

                          if (result) {
                            // Convert Uint8Array to Blob
                            const pdfBlob = new Blob([result], { type: 'application/pdf' })
                            // Create a Blob URL
                            const blobUrl = URL.createObjectURL(pdfBlob)
                            // Set the Blob URL to the state
                            // setAgreementPDF(blobUrl)

                            // handleSetFormData(updatedValues)
                          }
                        } catch (err) {
                          // lib.log(err)
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
                          // setAgreementPDF('')
                          prevStep()
                        }

                        const handleNextStep = () => {
                          handleSubmit()
                          nextStep()
                        }

                        return (
                          <div>
                            <div>
                              CONTENT PAGE 2 HERE

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
        </Modal.Body >
      </Modal >
    </div>
  )
}






































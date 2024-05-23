//packages
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { Dropdown, DropdownButton, Col, Row, Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import DatePicker from "react-datepicker";

//metronic components
import { StepperComponent } from "../../_metronic/assets/ts/components";
import { KTIcon } from "../../_metronic/helpers";

//setup data
import { setupData } from '../data/SetupData';

//biz
import { etenancyBiz } from '../biz/etenancyBiz'

export default function ETenancyPage() {
  const userSlice = useSelector((state) => state.user)

  //search
  const [search, setSearch] = useState({});
  const [prevSearch, setPrevSearch] = useState({});
  const [page, setPage] = useState(0);
  const [pageSummary, setPageSummary] = useState({})

  const [etenancyList, setEtenancyList] = useState([]);
  const [formModal, setFormModal] = useState(false)

  //stepper
  const [stepper, setStepper] = useState(null);
  const [stepperElement, setStepperElement] = useState(null);


  //loading
  const [loading, setLoading] = useState(false);

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
        // setEtenancyList((eTenancies) => [
        //     ...eTenancies,
        //     ...result.data,
        // ]);
      };

      fetchMore();
    }
  }, [page]);

  const handleLoadMore = () => {
    setPage((page) => page + 1);
  }

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

  const toggleFormModal = () => {
    setFormModal(!formModal)
  }

  const createETenancy = () => {

    toggleFormModal()
  }

  return (
    <>


      <div className='td-header-btn-group'>
        <button className='btn btn-primary' onClick={createETenancy}>
          New E-Tenancy
        </button>
      </div>

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
                      <h3 className='stepper-title'>Generate Contract</h3>
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
                      <h3 className='stepper-title'>Preview Contract</h3>
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
    </>
  )
}






































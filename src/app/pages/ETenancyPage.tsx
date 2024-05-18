//packages
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { Dropdown, DropdownButton, Col, Row, Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import DatePicker from "react-datepicker";
import { RootState } from '../redux/store'

//metronic components
import { StepperComponent } from "../../_metronic/assets/ts/components";
import { KTIcon } from "../../_metronic/helpers";

//setup data
import {setupData} from '../data/SetupData';

//biz
import {etenancyBiz} from '../biz/etenancyBiz'

export default function ETenancyPage() {
    const userSlice = useSelector((state:RootState) => state.user)

     //search
     const [search, setSearch] = useState({});
     const [prevSearch, setPrevSearch] = useState({});
     const [page, setPage] = useState(0);
     const [pageSummary, setPageSummary] = useState({})

     const [etenancyList, setEtenancyList] = useState([]);
     const [formModal, setFormModal] = useState(false)
    //stepper
    // const [stepper, setStepper] = useState(null);
    // // Use state to manage the stepper element reference
    // const [stepperElement, setStepperElement] = useState<HTMLDivElement | null>(null);

    const stepperRef = useRef<HTMLDivElement | null>(null)
    const stepper = useRef<StepperComponent | null>(null)


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

                if (result && result.data){}
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

    // useEffect(() => {
    //     const loadStepper = () => {
    //         // Create an instance of the stepper when the component mounts
    //         stepper.current = StepperComponent.createInsance(stepperRef.current as HTMLDivElement);
    //     };

    //     loadStepper();

    //     // Cleanup: Destroy the stepper instance when the component unmounts
    //     return () => {
    //         if (stepper.current) {
    //             stepper.current.destroy();
    //         }
    //     };
    // }, [stepper]);

    const loadStepper = () => {
        stepper.current = StepperComponent.createInsance(stepperRef.current as HTMLDivElement)
      }

    const prevStep = () => {
        if (!stepper.current) {
          return
        }
    
        stepper.current.goPrev()
      }

    const nextStep = () => {
        if (!stepper.current) {
            return
          }

        if (stepper) {
            stepper.current.goNext()
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
               <Modal
      id='kt_modal_create_app'
      tabIndex={-1}
      aria-hidden='true'
      dialogClassName='modal-dialog modal-dialog-centered mw-900px'
      show={formModal}
      onHide={toggleFormModal}
      onEntered={loadStepper}
      backdrop={true}
    >
      <div className='modal-header'>
        <h2>Create App</h2>
        {/* begin::Close */}
        {/* <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={handleClose}> */}
          
          <button onClick={toggleFormModal}> <KTIcon className='fs-1' iconName='cross' /></button>
         
        {/* </div> */}
        {/* end::Close */}
      </div>

      <div className='modal-body py-lg-10 px-lg-10'>
        {/*begin::Stepper */}
        <div
          ref={stepperRef}
          className='stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid'
          id='kt_modal_create_app_stepper'
        >
          {/* begin::Aside*/}
          <div className='d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px'>
            {/* begin::Nav*/}
            <div className='stepper-nav ps-lg-10'>
              {/* begin::Step 1*/}
              <div className='stepper-item current' data-kt-stepper-element='nav'>
                {/* begin::Wrapper*/}
                <div className='stepper-wrapper'>
                  {/* begin::Icon*/}
                  <div className='stepper-icon w-40px h-40px'>
                    <i className='stepper-check fas fa-check'></i>
                    <span className='stepper-number'>1</span>
                  </div>
                  {/* end::Icon*/}

                  {/* begin::Label*/}
                  <div className='stepper-label'>
                    <h3 className='stepper-title'>Details</h3>

                    <div className='stepper-desc'>Name your App</div>
                  </div>
                  {/* end::Label*/}
                </div>
                {/* end::Wrapper*/}

                {/* begin::Line*/}
                <div className='stepper-line h-40px'></div>
                {/* end::Line*/}
              </div>
              {/* end::Step 1*/}

              {/* begin::Step 2*/}
              <div className='stepper-item' data-kt-stepper-element='nav'>
                {/* begin::Wrapper*/}
                <div className='stepper-wrapper'>
                  {/* begin::Icon*/}
                  <div className='stepper-icon w-40px h-40px'>
                    <i className='stepper-check fas fa-check'></i>
                    <span className='stepper-number'>2</span>
                  </div>
                  {/* begin::Icon*/}

                  {/* begin::Label*/}
                  <div className='stepper-label'>
                    <h3 className='stepper-title'>Frameworks</h3>

                    <div className='stepper-desc'>Define your app framework</div>
                  </div>
                  {/* begin::Label*/}
                </div>
                {/* end::Wrapper*/}

                {/* begin::Line*/}
                <div className='stepper-line h-40px'></div>
                {/* end::Line*/}
              </div>
              {/* end::Step 2*/}

              {/* begin::Step 3*/}
              <div className='stepper-item' data-kt-stepper-element='nav'>
                {/* begin::Wrapper*/}
                <div className='stepper-wrapper'>
                  {/* begin::Icon*/}
                  <div className='stepper-icon w-40px h-40px'>
                    <i className='stepper-check fas fa-check'></i>
                    <span className='stepper-number'>3</span>
                  </div>
                  {/* end::Icon*/}

                  {/* begin::Label*/}
                  <div className='stepper-label'>
                    <h3 className='stepper-title'>Database</h3>

                    <div className='stepper-desc'>Select the app database type</div>
                  </div>
                  {/* end::Label*/}
                </div>
                {/* end::Wrapper*/}

                {/* begin::Line*/}
                <div className='stepper-line h-40px'></div>
                {/* end::Line*/}
              </div>
              {/* end::Step 3*/}

              {/* begin::Step 4*/}
              <div className='stepper-item' data-kt-stepper-element='nav'>
                {/* begin::Wrapper*/}
                <div className='stepper-wrapper'>
                  {/* begin::Icon*/}
                  <div className='stepper-icon w-40px h-40px'>
                    <i className='stepper-check fas fa-check'></i>
                    <span className='stepper-number'>4</span>
                  </div>
                  {/* end::Icon*/}

                  {/* begin::Label*/}
                  <div className='stepper-label'>
                    <h3 className='stepper-title'>Storage</h3>

                    <div className='stepper-desc'>Provide storage details</div>
                  </div>
                  {/* end::Label*/}
                </div>
                {/* end::Wrapper*/}

                {/* begin::Line*/}
                <div className='stepper-line h-40px'></div>
                {/* end::Line*/}
              </div>
              {/* end::Step 4*/}

              {/* begin::Step 5*/}
              <div className='stepper-item' data-kt-stepper-element='nav'>
                {/* begin::Wrapper*/}
                <div className='stepper-wrapper'>
                  {/* begin::Icon*/}
                  <div className='stepper-icon w-40px h-40px'>
                    <i className='stepper-check fas fa-check'></i>
                    <span className='stepper-number'>5</span>
                  </div>
                  {/* end::Icon*/}

                  {/* begin::Label*/}
                  <div className='stepper-label'>
                    <h3 className='stepper-title'>Completed</h3>

                    <div className='stepper-desc'>Review and Submit</div>
                  </div>
                  {/* end::Label*/}
                </div>
                {/* end::Wrapper*/}
              </div>
              {/* end::Step 5*/}
            </div>
            {/* end::Nav*/}
          </div>
          {/* begin::Aside*/}

          {/*begin::Content */}
          <div className='flex-row-fluid py-lg-5 px-lg-15'>
            {/*begin::Form */}
            <form noValidate id='kt_modal_create_app_form'>
            <div data-kt-stepper-element='content'>
        <div className='w-100 text-center'>
          {/* begin::Heading */}
          <h1 className='fw-bold text-dark mb-3'>Release!</h1>
          {/* end::Heading */}

          {/* begin::Description */}
          <div className='text-muted fw-semibold fs-3'>
            Submit your app to kickstart your project.
          </div>
          {/* end::Description */}

          {/* begin::Illustration */}
          <div className='text-center px-4 py-15'>
            yrtyrt
          </div>
          {/* end::Illustration */}
        </div>
      </div>

      <div data-kt-stepper-element='content'>
        <div className='w-100 text-center'>
          {/* begin::Heading */}
          <h1 className='fw-bold text-dark mb-3'>Release!</h1>
          {/* end::Heading */}

          {/* begin::Description */}
          <div className='text-muted fw-semibold fs-3'>
            Submit your app to kickstart your project.
          </div>
          {/* end::Description */}

          {/* begin::Illustration */}
          <div className='text-center px-4 py-15'>
            tryrtyrt
          </div>
          {/* end::Illustration */}
        </div>
      </div>

              {/*begin::Actions */}
              <div className='d-flex flex-stack pt-10'>
                <div className='me-2'>
                  <button
                    type='button'
                    className='btn btn-lg btn-light-primary me-3'
                    data-kt-stepper-action='previous'
                    onClick={prevStep}
                  >
                    <KTIcon iconName='arrow-left' className='fs-3 me-1' /> Previous
                  </button>
                </div>
                <div>
                  <button
                    type='button'
                    className='btn btn-lg btn-primary'
                    data-kt-stepper-action='submit'
                    // onClick={submit}
                  >
                    Submit <KTIcon iconName='arrow-right' className='fs-3 ms-2 me-0' />
                  </button>

                  <button
                    type='button'
                    className='btn btn-lg btn-primary'
                    data-kt-stepper-action='next'
                    onClick={nextStep}
                  >
                    Next Step <KTIcon iconName='arrow-right' className='fs-3 ms-1 me-0' />
                  </button>
                </div>
              </div>
              {/*end::Actions */}
            </form>
            {/*end::Form */}
          </div>
          {/*end::Content */}
        </div>
        {/* end::Stepper */}
      </div>
    </Modal>

    <div className='td-header-btn-group'>
                <button className='btn btn-primary' onClick={createETenancy}>
                    New E-Tenancy
                </button>
            </div>
        </>
    )
}






































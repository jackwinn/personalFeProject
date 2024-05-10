// plugin
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toAbsoluteUrl } from '../../_metronic/helpers'
import { useLayout } from '../../_metronic/layout/core';

// package 
import { useDispatch, useSelector } from 'react-redux'
import ReactSelect, { components } from 'react-select'
import { DropdownButton, Dropdown, Row, Col, Modal, Accordion } from 'react-bootstrap';

// business 

// lib
import lib from '../biz/lib';


export default function DashboardPage() {
  const userSlice = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    // console.log(userSlice)
  }, [])

  const Header = () => {

    return (
      <>
        <div className='dashboard-header'>
          {/* <img src={toAbsoluteUrl('/media/dashboard/dashboard_header_bg.png')} alt='' /> */}
          <div>
            <div id='kt_drawer_example_basic_button'  className='name-cursor dashboard-header-greating'>
              <button className='dashboard-header-btn'>Hi, {userSlice.personal.name}</button>
              {/* <p className='dashboard-header-greating-text'>Hi, {userSlice.personal.name}</p> */}
            </div>
            <div className='.dashboard-header-breadcrum'>
              <p className='dashboard-header-breadcrum-text'>Dashboard</p>
            </div>
          </div>
        </div>
        <div className='dashboard-welcome'>
          <p className='dashboard-welcome-text'>Welcome, {userSlice.role}!</p>
          <p className='dashboard-lastlogin-text'>Account last logged in at {lib.formatDateDMYAM(userSlice.lastLogin)} </p>
        </div>
      </>
    )
  }

  const QuickActions = () => {
    return (
      <Row className='dashboard-quick-actions'>
        <Col className='dashboard-vector-card' style={{ background: "#FFF5F8" }}>
          <div >
            <img className="dashboard-vector-icon" src={toAbsoluteUrl('/media/dashboard/vector1.png')} alt='' />
            <div className='dashboard-vector-card-divider'>
              <p>-</p>
              <p>Outstanding Bill</p>
            </div>
            <p>-</p>
            <p>Overdue Bills</p>
          </div>
        </Col>
        <Col className='dashboard-vector-card' style={{ background: "#FFFDE8" }} >
          <div >
            <img className="dashboard-vector-icon" src={toAbsoluteUrl('/media/dashboard/vector2.png')} alt='' />
            <div className='dashboard-vector-card-divider'>
              <p>-</p>
              <p>Vacant / Total Units</p>
            </div>
            <p>-</p>
            <p>Tenancy Rate</p>
          </div>
        </Col>
        <Col className='dashboard-vector-card' style={{ background: "#EDFFE9" }} >
          <div>
            <img className="dashboard-vector-icon" src={toAbsoluteUrl('/media/dashboard/vector3.png')} alt='' />
            <div className='dashboard-vector-card-divider'>
              <p>-</p>
              <p>Rental Start in 30 Days</p>
            </div>
            <p>-</p>
            <p>Due Check In</p>
          </div>
        </Col>
        <Col className='dashboard-vector-card' style={{ background: "#F4FBFF" }} >
          <div>
            <img className="dashboard-vector-icon" src={toAbsoluteUrl('/media/dashboard/vector4.png')} alt='' />
            <div className='dashboard-vector-card-divider'>
              <p>-</p>
              <p>Rental End In 30 Days</p>
            </div>
            <p>-</p>
            <p>Due Check Out</p>
          </div>
        </Col>
        <Col className='dashboard-vector-card' style={{ background: "#F9F9FF" }}>
          <div  >
            <img className="dashboard-vector-icon" src={toAbsoluteUrl('/media/dashboard/vector5.png')} alt='' />
            <div className='dashboard-vector-card-divider'>
              <p>-</p>
              <p>E-Tenancy<br />Signing In Progress</p>
            </div>
            <div className='divider w-95'></div>
            <p>-</p>
            <p>Expired E-Tenancy</p>
          </div>
        </Col>
        <Col className='dashboard-vector-card' style={{ background: "#F6F6F6" }}>
          <div  >
            <img className="dashboard-vector-icon" src={toAbsoluteUrl('/media/dashboard/vector6.png')} alt='' />
            <div className='dashboard-vector-card-divider'>
              <p>-</p>
              <p>Online / Total Smart Meters</p>
            </div>
            <p>-</p>
            <p>Forced Power Off</p>
          </div>
        </Col>
      </Row>
    )
  }

  const OtherActions = () => {
    return (
      <div className='dashboard-other-actions'>
        <p className='dashboard-other-actions-title'>What Would You Like To Do Today ?</p>
        <Row>
          <Col className='dashboard-vector-card'>
            <img className="dashboard-vector-icon" src={toAbsoluteUrl('/media/dashboard/unit.png')} alt='' />
            <Link to="/property/unit">Unit</Link>
          </Col>
          <Col className='dashboard-vector-card'>
            <img className="dashboard-vector-icon" src={toAbsoluteUrl('/media/dashboard/room.png')} alt='' />
            <Link to="/property/room">Room</Link>
          </Col>
          <Col className='dashboard-vector-card'>
            <img className="dashboard-vector-icon" src={toAbsoluteUrl('/media/dashboard/tenant.png')} alt='' />
            <Link to="/tenant/data">Tenant</Link>
          </Col>
        </Row>
      </div>
    )
  }

  const Footer = () => {
    const currentYear = new Date().getFullYear().toString()
    return (
      <div className='dashboard-footer'>
        <span className=''>
          Copyright © {currentYear}. iRoomz Sdn. Bhd. All rights
          reserved.
        </span>
      </div>
    )
  }

  return (
    <div className='dashboard-page-wrapper'>
      <Header />
      {/* <QuickActions /> */}
      <OtherActions />
      {/* <Footer /> */}
    </div>
  )
}


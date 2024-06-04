/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'
import {useLayout} from '../../core'
import {Header} from './Header'
import {Navbar} from './Navbar'
import {useDispatch} from 'react-redux'


export function HeaderWrapper() {
  const dispatch = useDispatch()
  const {config, classes} = useLayout()
  if (!config.app?.header?.display) {
    return null
  }

  const handleLogout = () => {
    dispatch({type: 'USER_LOGOUT'})
  }

  return (
    // <div id='kt_app_header' className='app-header'>
    <div id='kt_app_header' className='custom-app-header'>
      <div
        id='kt_app_header_container'
        className={clsx(
          'app-container flex-lg-grow-1',
          classes.headerContainer.join(' '),
          config.app?.header?.default?.containerClass
        )}
      >
        {config.app.sidebar?.display && (
          <>
            <div
              className='d-flex align-items-center d-lg-none ms-n2 me-2'
              title='Show sidebar menu'
            >
              <div
                className='btn btn-icon btn-active-color-primary w-35px h-35px'
                id='kt_app_sidebar_mobile_toggle'
              >
                {/* <KTIcon iconName='abstract-14' className=' fs-1' /> */}
                <KTIcon iconName='text-align-left' className=' fs-1' />
              </div>
              <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0'>
                <Link to='/dashboard' className='d-lg-none'>
                  <img
                    alt='Logo'
                    src={toAbsoluteUrl('/media/sidebar/portal_logo_mini.svg')}
                    className='h-30px'
                  />
                </Link>
              </div>
            </div>
          </>
        )}

        <div className='mobile-logout-btn d-flex align-items-center' onClick={handleLogout}>
          <svg
            className='dashboard-logout-icon'
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='19'
            viewBox='0 0 22.414 20'
          >
            <path
              id='Path_9214'
              data-name='Path 9214'
              d='M626,684l4,4m0,0-4,4m4-4H617m6-7.8a8.382,8.382,0,0,0-4.333-1.2,9.006,9.006,0,0,0,0,18A8.382,8.382,0,0,0,623,695.8'
              transform='translate(-609 -678)'
              fill='none'
              stroke='#a7a9ac'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='1.5'
            />
          </svg>
        </div>

        {/* {!(config.layoutType === 'dark-sidebar' || config.layoutType === 'light-sidebar') && (
          <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-lg-15'>
            <Link to='/dashboard'>
              {config.layoutType !== 'dark-header' ? (
                <img
                  alt='Logo'
                  src={toAbsoluteUrl('/media/logos/default.svg')}
                  className='h-20px h-lg-30px app-sidebar-logo-default'
                />
              ) : (
                <>
                  <img
                    alt='Logo'
                    src={toAbsoluteUrl('/media/logos/default-dark.svg')}
                    className='h-20px h-lg-30px app-sidebar-logo-default theme-light-show'
                  />
                  <img
                    alt='Logo'
                    src={toAbsoluteUrl('/media/logos/default-small-dark.svg')}
                    className='h-20px h-lg-30px app-sidebar-logo-default theme-dark-show'
                  />
                </>
              )}
            </Link>
          </div>
        )} */}
        {/* <div
          id='kt_app_header_wrapper'
          className='d-flex align-items-stretch justify-content-between flex-lg-grow-1'
        >
          {config.app.header.default?.content === 'menu' &&
            config.app.header.default.menu?.display && (
              <div
                className='app-header-menu app-header-mobile-drawer align-items-stretch'
                data-kt-drawer='true'
                data-kt-drawer-name='app-header-menu'
                data-kt-drawer-activate='{default: true, lg: false}'
                data-kt-drawer-overlay='true'
                data-kt-drawer-width='225px'
                data-kt-drawer-direction='end'
                data-kt-drawer-toggle='#kt_app_header_menu_toggle'
                data-kt-swapper='true'
                data-kt-swapper-mode="{default: 'append', lg: 'prepend'}"
                data-kt-swapper-parent="{default: '#kt_app_body', lg: '#kt_app_header_wrapper'}"
              >
                <Header />
              </div>
            )}
          <Navbar />
        </div> */}
      </div>
    </div>
  )
}

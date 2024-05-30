import { SidebarMenuMain } from './SidebarMenuMain'
import { SidebarMenuItem } from './SidebarMenuItem'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../../app/redux/store'
import { setupData } from '../../../../../app/data/setupData'

const SidebarMenu = () => {
  const agentSlice = useSelector((state: RootState) => state.user)
  // const trrAgent = (agentSlice?.companyName?.trim() === SetupData.trrCompany);

  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch({ type: 'USER_LOGOUT' })
  }

  return (
    <>
      <div className='app-sidebar-menu overflow-hidden flex-column-fluid'>
        <div
          id='kt_app_sidebar_menu_wrapper'
          className='app-sidebar-wrapper hover-scroll-overlay-y my-5'
          data-kt-scroll='true'
          data-kt-scroll-activate='true'
          data-kt-scroll-height='auto'
          data-kt-scroll-dependencies='#kt_app_sidebar_logo, #kt_app_sidebar_footer'
          data-kt-scroll-wrappers='#kt_app_sidebar_menu'
          data-kt-scroll-offset='5px'
          data-kt-scroll-save-state='true'
        >
          <div
            className='menu menu-column menu-rounded menu-sub-indention px-3'
            id='#kt_app_sidebar_menu'
            data-kt-menu='true'
            data-kt-menu-expand='false'
          >
            <SidebarMenuMain />
          </div>
        </div>
      </div>
      <div className='app-sidebar-menu overflow-hidden' id='kt_app_sidebar_footer'>
        <div className='app-sidebar-wrapper'>
          {/* <SidebarMenuItem to='/about' icon='element-11' title='About' fontIcon='bi-app-indicator' /> */}
          {/* <div className='menu menu-column menu-rounded menu-sub-indention px-3'>
            <SidebarMenuItem
              to='/tnc'
              // icon='element-11'
              title='Terms of Use'
              path='termsofuse'
            />
          </div> */}
          <div>
            <div className='menu-item'>
              <div className='menu-link' onClick={handleLogout}>
                <svg className='menu-icon' width='18' height='18' viewBox='0 0 22.414 20'>
                  <path
                    className='custom-svg'
                    xmlns='http://www.w3.org/2000/svg'
                    id='Path_9214'
                    data-name='Path 9214'
                    d='M626,684l4,4m0,0-4,4m4-4H617m6-7.8a8.382,8.382,0,0,0-4.333-1.2,9.006,9.006,0,0,0,0,18A8.382,8.382,0,0,0,623,695.8'
                    transform='translate(-609 -678)'
                    fill='none'
                    stroke='#bcbcc4'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='1.5'
                  />
                </svg>
                <span className='menu-title menu-gap'>Logout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { SidebarMenu }

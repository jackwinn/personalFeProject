/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
// import {useIntl} from 'react-intl'
// import {KTIcon} from '../../../../helpers'
import { SidebarMenuItem } from './SidebarMenuItem'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../../app/redux/store'
// import SidebarSubItem from './SidebarSubItem'

type Props = {
  trrAgent?: boolean
}

const SidebarMenuMain: React.FC<Props> = () => {
  // const userSlice = useSelector((state: RootState) => state.user)


  return (
    <>
      {/* <SidebarMenuItem
        to='/dashboard'       
        title='Dashboard'      
        path='dashboard'
      /> */}
      <SidebarMenuItem
        to='/e-tenancy'      
        title='e-Tenancy'     
        path='etenancy'
      />
    </>
  )
}

export { SidebarMenuMain }

/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
// import {useIntl} from 'react-intl'
// import {KTIcon} from '../../../../helpers'
import { SidebarMenuItem } from './SidebarMenuItem'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../../app/redux/store'
import SidebarSubItem from './SidebarSubItem'
import { access } from 'fs'

type Props = {
  trrAgent?: boolean
}

const SidebarMenuMain: React.FC<Props> = () => {

  interface UserModule {
    name: string;
    read: boolean;
    // Add other properties as needed
  }
  
  // Assuming userSlice.access.modules is of type UserModule[]
  
  const userSlice = useSelector((state: RootState) => state.user)
  const userModules: UserModule[] = userSlice.access.modules;

  // const getAccessModule = (title: string) => {
  //   const accessModule = userModules.some((module) => module.name === title && module.read);
  //   return accessModule
  // }

  // const accessObject = {
  //   unit: getAccessModule('Unit'),
  //   room: getAccessModule('Room'),
  //   tenantData: getAccessModule('Tenant Data'),
  //   etenancies: getAccessModule('E-Tenancies'),
  //   activeTenant: getAccessModule('Active Tenant'),
  //   landlordData: getAccessModule('Landlord Data'),
  //   activeLandlord: getAccessModule('Active Landlord'),
  //   operatorData: getAccessModule('Operator Data'),
  //   activeOperator: getAccessModule('Operator Data'),
  //   smartMeter: getAccessModule('Smart Meter'),
  //   billing: getAccessModule('Billing'),
  //   depositRefund: getAccessModule('Deposit Refund'),
  //   receipt: getAccessModule('Receipts'),
  //   tenantDashboard: getAccessModule('Tenant Dashboard'),
  //   dashboard: getAccessModule('Dashboard')
  // }

  return (
    <SidebarMenuItem
    to='/dashboard'
    // icon='element-11'
    // title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
    title='Dashboard'
    // fontIcon='bi-app-indicator'
    path='dashboard'
  />
          // <>
          //     {/* Dashboard */}
          //     {accessObject.dashboard &&
          //     <SidebarMenuItem 
          //       to='dashboard'
          //       title='Dashboard'
          //       path='dashboard'
          //     />
          //     }

          //     {/* Tenant Dashboard */}
          //     {accessObject.tenantDashboard && 
          //       <SidebarMenuItem 
          //           to='/tenant-dashboard'
          //           title='Dashboard'
          //           path='dashboard'
          //       />
          //     }     

          //     {/* Property */}
          //     <SidebarSubItem
          //       to='property'
          //       title='Property'
          //       fontIcon='bi-archive'
          //       icon='element-plus'
          //     >
          //       {accessObject.unit && 
          //        <SidebarMenuItem 
          //         to='property/unit'
          //         title='Unit'
          //         path='propertyunit'
          //       />
          //       }
          //       {accessObject.room && 
          //       <SidebarMenuItem 
          //         to='property/room'
          //         title='Room'
          //         path='propertyroom'
          //       />
          //       }
          //     </SidebarSubItem>

          //     {/* Tenant */}
          //     <SidebarSubItem
          //       to='tenant'
          //       title='Tenant'
          //       fontIcon='bi-archive'
          //       icon='element-plus'
          //     >
          //       {accessObject.tenantData &&
          //       <SidebarMenuItem 
          //         to='tenant/data'
          //         title='Tenant Data'
          //         path='tenant'
          //       />
          //       }
          //       {accessObject.etenancies &&
          //       <SidebarMenuItem 
          //         to='tenant/e-tenancies'
          //         title='E-Tenancies'
          //         path='etenancies'  
          //       />
          //       }
          //       {accessObject.activeTenant &&
          //       <SidebarMenuItem 
          //         to='tenant/active'
          //         title='Active Tenant'
          //         path='activetenant'
          //       />
          //       }
          //     </SidebarSubItem>
          
          //     {/* Landlord */}
          //     <SidebarSubItem
          //       to='landlord'
          //       title='Landlord'
          //       fontIcon='bi-archive'
          //       icon='element-plus'
          //     >
          //       {accessObject.landlordData &&
          //        <SidebarMenuItem 
          //           to='landlord/data'
          //           title='Landlord Data'
          //           path='landlorddata'
          //       />
          //       }
          //       {accessObject.activeLandlord &&
          //       <SidebarMenuItem 
          //           to='landlord/active'
          //           title='Active Landlord'
          //           path='activelandlord'
          //       />
          //       }
          //     </SidebarSubItem>

          //     {/* Operator */}
          //     <SidebarSubItem
          //       to='operator'
          //       title='Operator'
          //       fontIcon='bi-archive'
          //       icon='element-plus'
          //     >
          //       {accessObject.operatorData &&
          //       <SidebarMenuItem 
          //           to='operator/data'
          //           title='Operator Data'
          //           path='operatordata'    
          //       />
          //       }
          //       {accessObject.activeOperator &&
          //        <SidebarMenuItem 
          //           to='operator/active'
          //           title='Active Operator'
          //           path='activeoperator'
          //       />
          //       }
          //     </SidebarSubItem>

          //     {/* Smart Meter */}
          //     {accessObject.smartMeter && 
          //     <SidebarMenuItem
          //       to='smart-meter'
          //       title='Smart Meter'
          //       path='smartmeter'
          //     />
          //     }

          //     {process.env.REACT_APP_QC_MODE === 'true' &&
          //       <>
          //         <SidebarSubItem
          //           to='accounting'
          //           title='Accounting'
          //           fontIcon='bi-archive'
          //           icon='element-plus'
          //         >
          //           {accessObject.billing && 
          //           <SidebarMenuItem
          //             to='accounting/bill'
          //             title='Billings'
          //             path='billing'
          //           />
          //           }
          //           {accessObject.receipt &&
          //           <SidebarMenuItem
          //             to='accounting/receipt'
          //             title='Receipts'
          //             path='receipt'
          //           />
          //           }
          //           {accessObject.depositRefund &&
          //           <SidebarMenuItem
          //             to='accounting/deposit-refund'
          //             title='Deposit Refund'
          //             path='depsoit-refund'
          //           />
          //           }
          //         </SidebarSubItem>
          //       </>
          //     }
          // </>
        )
}

export { SidebarMenuMain }

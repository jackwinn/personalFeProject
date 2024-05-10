import { lazy, FC, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils'
import { WithChildren } from '../../_metronic/helpers'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import ProtectedRoute from './ProtectedRoutes'

const PrivateRoutes = () => {
  const DashboardPage = lazy(() => import('../pages/DashboardPage'))
  // const PropertyUnitPage = lazy(() => import('../pages/PropertyUnitPage'))
  // const PropertyRoomPage = lazy(() => import('../pages/PropertyRoomPage'))
  // const TenantDataPage = lazy(() => import('../pages/TenantDataPage'))
  // const ActiveTenantPage = lazy(() => import('../pages/ActiveTenantPage'))
  const ETenanciesPage = lazy(() => import('../pages/ETenanciesPage'))
  // const LandlordDataPage = lazy(() => import('../pages/LandLordDataPage'))
  // const OperatorDataPage = lazy(() => import('../pages/OperatorDataPage'))
  // const ActiveOperatorPage = lazy(() => import('../pages/ActiveOperatorPage'))
  // const ActiveLanlordPage = lazy(() => import('../pages/ActiveLandlordPage'))
  // const TenantDashboardPage = lazy(() => import('../pages/TenantDashboardPage'))
  const UserProfilePage = lazy(() => import('../pages/UserProfilePage'))
  const ChangePasswordPage = lazy(() => import('../pages/ChangePasswordPage'))
  // const BillingPage = lazy(() => import('../pages/BillingPage'))
  // const RecordPaymentPage = lazy(() => import('../pages/RecordPaymentPage'))
  // const ReceiptPage = lazy(() => import('../pages/ReceiptPage'))
  // const DepositRefundPage = lazy(() => import('../pages/DepositRefundPage'))
  // const SmartMeterPage = lazy(() => import('../pages/SmartMeterPage'))
  // const PaymentPage = lazy(() => import('../pages/PaymentPage'))

  const userSlice = useSelector((state: RootState) => state.user)
  const userModule = userSlice?.access?.modules

  return (
    <Routes>
      <Route element={<MasterLayout />}>

        {userSlice.role !== 'Tenant' ?
          <Route path='*' element={<Navigate to={'/dashboard'} />} /> :
          <Route path='*' element={<Navigate to={'/tenant-dashboard'} />} />
        }



        <Route
          path='dashboard'
          element={
            <SuspensedView>
              <ProtectedRoute
                component={DashboardPage}
                moduleName="Dashboard"
                userModules={userModule}
              />
            </SuspensedView>
          }
        />


        <Route
          path='profile'
          element={
            <SuspensedView>
              <ProtectedRoute
                component={UserProfilePage}
                moduleName="User Profile"
                userModules={userModule}
              />
            </SuspensedView>
          }
        />
        <Route
          path='change-password'
          element={
            <SuspensedView>
              <ProtectedRoute
                component={ChangePasswordPage}
                moduleName="Change Password"
                userModules={userModule}
              />
            </SuspensedView>
          }
        />




        <Route
          path='tenant/e-tenancies'
          element={
            <SuspensedView>
              <ProtectedRoute
                component={ETenanciesPage}
                moduleName="E-Tenancies"
                userModules={userModule}
              />
            </SuspensedView>
          }
        />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export { PrivateRoutes }

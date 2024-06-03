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
  const userSlice = useSelector((state: RootState) => state.user)
  // const userModule = userSlice?.access?.modules

  //dynamically imports a component and only loads it when it is needed AKA code-splitting
  const DashboardPage = lazy(() => import('../pages/DashboardPage'))
  const ETenancyPage = lazy(() => import('../pages/ETenancyPage'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* default redirect or fallback if route doesnot match */}
        <Route path='*' element={<Navigate to={'/e-tenancy'} />} />

        <Route
          path='/dashboard'
          element={
            <SuspensedView>
              <DashboardPage />
            </SuspensedView>
          }
        />
        <Route
          path='/e-tenancy'
          element={
            <SuspensedView>
              <ETenancyPage />
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

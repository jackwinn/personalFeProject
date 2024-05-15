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
  const ETenanciesPage = lazy(() => import('../pages/ETenanciesPage'))


  const userSlice = useSelector((state: RootState) => state.user)
  const userModule = userSlice?.access?.modules

  return (
    <Routes>
      <Route element={<MasterLayout />}>
      
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

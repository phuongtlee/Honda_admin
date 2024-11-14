import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

import { ChatProvider } from './ChatContext'
import ProtectedRoute from './ProtectedRoute'
import { AuthProvider } from './views/pages/login/AuthContext'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const AddUser = React.lazy(() => import('./views/Customer/AddCustomer'))
const UserDetail = React.lazy(() => import('./views/Customer/UserDetail'))
const VehicleDetail = React.lazy(() => import('./views/Vehicles/VehicleDetail'))
const UpdateUser = React.lazy(() => import('./views/Customer/UpdateUser'))
const AddService = React.lazy(() => import('./views/Services/AddService'))
const ServiceDetail = React.lazy(() => import('./views/Services/ServiceDetail'))
const UpdateService = React.lazy(() => import('./views/Services/UpdateService'))
const RepairDetail = React.lazy(() => import('./views/RepairSchedules/RepairSchedulesDetail'))
const UpdateRepair = React.lazy(() => import('./views/RepairSchedules/UpdaterRepairSchedule'))
const AddProduct = React.lazy(() => import('./views/Product/AddProduct'))
const ProductDetail = React.lazy(() => import('./views/Product/DetailProduct'))
const ProductUpdate = React.lazy(() => import('./views/Product/UpdateProduct'))
const AddBanner = React.lazy(() => import('./views/Banner/AddBanner'))
const BannerDetail = React.lazy(() => import('./views/Banner/BannerDetail'))
const BannerUpdate = React.lazy(() => import('./views/Banner/UpdateBanner'))
const ChatAdmin = React.lazy(() => import('./views/Chat/Chat'))
const ReviewDetail = React.lazy(() => import('./views/Reviews/ReviewsDetail'))
const BillingDetailPage = React.lazy(() => import('./views/Bill/BillingDetailPage'))
const TestDriveUpdate = React.lazy(
  () => import('./views/TestDriveSchedules/UpdateTestDriveSchedules'),
)
const TestDriveDetail = React.lazy(
  () => import('./views/TestDriveSchedules/TestDriveSchedulesDetail'),
)

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)
  const loggedIn = useSelector((state) => state.auth.loggedIn)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, [])

  return (
    <AuthProvider>
      <ChatProvider>
        <HashRouter>
          <Suspense
            fallback={
              <div className="pt-3 text-center">
                <CSpinner color="primary" variant="grow" />
              </div>
            }
          >
            <Routes>
              <Route exact path="/login" name="Login Page" element={<Login />} />
              <Route exact path="/register" name="Register Page" element={<Register />} />
              <Route exact path="/404" name="Page 404" element={<Page404 />} />
              <Route exact path="/500" name="Page 500" element={<Page500 />} />
              {/* Protected routes */}
              {/* <Route element={<ProtectedRoute loggedIn={loggedIn} />}> */}
              <Route path="*" name="Home" element={<DefaultLayout />} />
              <Route path="/addUser" name="AddUser" element={<AddUser />} />
              <Route path="/userDetail" name="UserDetail" element={<UserDetail />} />
              <Route path="/updateUser" name="UpdateUser" element={<UpdateUser />} />
              <Route path="/vehicleDetail" name="VehicleDetail" element={<VehicleDetail />} />
              <Route path="/addService" name="AddService" element={<AddService />} />
              <Route path="/serviceDetail" name="ServiceDetail" element={<ServiceDetail />} />
              <Route path="/updateService" name="UpdateService" element={<UpdateService />} />
              <Route path="/repairDetail" name="RepairSchedulesDetail" element={<RepairDetail />} />
              <Route path="/updateRepair" name="UpdaterRepairSchedule" element={<UpdateRepair />} />
              <Route path="/addProduct" name="AddProduct" element={<AddProduct />} />
              <Route path="/productDetail" name="ProductDetail" element={<ProductDetail />} />
              <Route path="/productUpdate" name="ProductUpdate" element={<ProductUpdate />} />
              <Route path="/addBanner" name="AddBanner" element={<AddBanner />} />
              <Route path="/bannerDetail" name="BannerDetail" element={<BannerDetail />} />
              <Route path="/bannerUpdate" name="BannerUpdate" element={<BannerUpdate />} />
              <Route path="/chatAdmin" name="ChatAdmin" element={<ChatAdmin />} />
              <Route path="/testDriveDetail" name="TestDriveDetail" element={<TestDriveDetail />} />
              <Route path="/testDriveUpdate" name="TestDriveUpdate" element={<TestDriveUpdate />} />
              <Route path="/reviewDetail" name="ReviewDetail" element={<ReviewDetail />} />
              <Route
                path="/billingDetailPage"
                name="BillingDetailPage"
                element={<BillingDetailPage />}
              />
              {/* </Route> */}
            </Routes>
          </Suspense>
        </HashRouter>
      </ChatProvider>
    </AuthProvider>
  )
}

export default App

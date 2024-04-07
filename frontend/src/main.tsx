import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  
} from "react-router-dom";

import { Provider } from 'react-redux';
import {store,persistor} from './redux/store.ts'
import { PersistGate } from 'redux-persist/integration/react';

//admin
import AdminApp from './pages/admin/AdminApp.tsx'
import Dashboard from './pages/admin/Dahboard.tsx';
import AdminLogin from './components/admin/Login.tsx'
import AdminPrivateRoute from './components/admin/AdminPrivateRoute.tsx';
import Wallet from './pages/admin/Wallet.tsx';

//common routes
import HomePage from './pages/HomePage.tsx'
import ForgotPassword from './components/Common/ForgotPassword.tsx';
import ResetPassword from './components/Common/ResetPassword.tsx'
import AboutPage from './pages/AboutPage.tsx';
//user
import UserLoginForm from './components/user/Login.tsx';
import UserSignupForm from './components/user/Signup.tsx'
import VerifyEmail from './components/Common/VerifyEmail.tsx';
import UsersList from './pages/admin/UsersList.tsx';
import UserPrivateRoute from './components/user/UserPrivateRoute.tsx';
import UserVendorProfile from './pages/user/UserVendorProfile.tsx';
//vendor
import VendorApp from './pages/vendor/VendorApp.tsx';
import VendorsList from './pages/admin/VendorsList.tsx';
import VendorTypes from './pages/admin/VendorTypes.tsx';
import VendorProfile from './components/admin/vendorList/VendorProfile.tsx';
import VendorListing from './pages/VendorListing.tsx';
import Profile from './pages/user/Profile.tsx';
import BookEventForm from './pages/BookEventForm.tsx';
import PaymentSuccess from './pages/PaymentSuccess.tsx';






const router = createBrowserRouter(
  createRoutesFromElements(
  <>
    <Route path="/" element={<App/>}>
              <Route index={true}  path="/" element={<HomePage />} />
              <Route path="/login" element={<UserLoginForm />} />
              <Route path="/signup" element={<UserSignupForm />} />
              <Route path="/verify" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path='/about' element={<AboutPage/>} />
              <Route path="/viewVendor" element={<UserVendorProfile/>}/>
              <Route path="/vendors" element={<VendorListing/>}/>
            
              
           {/* User Private Routes */}
          <Route path="" element={<UserPrivateRoute/>}>
              <Route path="/profile/*" element={<Profile/>}/>
              <Route path="/bookevent" element={<BookEventForm/>}/>
              <Route path="/payment-success" element={<PaymentSuccess/>}/>
          </Route>
    </Route>

    <Route path="/admin" element={<AdminApp/>}>
            <Route index={true} path="/admin" element={<AdminLogin />} />
      {/* Admin Private Routes */}
       <Route path="" element={<AdminPrivateRoute/>}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/vendors" element={<VendorsList />} />
            <Route path="/admin/vendor-types" element={<VendorTypes />} />
            <Route path="/admin/users" element={<UsersList />} />
            <Route path="/admin/vendor" element={<VendorProfile />} />
            <Route path="/admin/wallet" element={<Wallet />} />
       </Route>
    </Route>


 
    
    <Route path="" element={<VendorApp/>}>
      <Route path="/vendor/*" element={<VendorApp/>} />
    </Route>

    
    </>
  )
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
     <PersistGate persistor={persistor}>
  {/* <React.StrictMode> */}
   <RouterProvider router={router} />
  {/* </React.StrictMode> */}
  </PersistGate>
  </Provider>
)

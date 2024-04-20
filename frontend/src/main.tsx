
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
import {store ,persistor} from './Redux/store.ts';
import { PersistGate } from 'redux-persist/integration/react';


//admin
import AdminApp from './Pages/admin/AdminApp.tsx'
import Dashboard from './Pages/admin/Dahboard.tsx';
import AdminLogin from './Components/admin/Login.tsx'
import AdminPrivateRoute from './Components/admin/AdminPrivateRoute.tsx';
import Wallet from './Pages/admin/Wallet.tsx';
import AdminNotifications from './Pages/admin/AdminNotifications.tsx';
//common routes
import HomePage from './Pages/HomePage.tsx'
import ForgotPassword from './Components/common/ForgotPassword.tsx';
import ResetPassword from './Components/common/ResetPassword.tsx'
import AboutPage from './Pages/AboutPage.tsx';
//user
import UserLoginForm from './Components/user/Login.tsx';
import UserSignupForm from './Components/user/Signup.tsx'
import VerifyEmail from './Components/common/VerifyEmail.tsx';
import UsersList from './Pages/admin/UsersList.tsx';
import UserPrivateRoute from './Components/user/UserPrivateRoute.tsx';
import UserVendorProfile from './Pages/user/UserVendorProfile.tsx';
import LiveStreaming from './Pages/user/LiveStream.tsx';
//vendor
import VendorApp from './Pages/vendor/VendorApp.tsx';
import VendorsList from './Pages/admin/VendorsList.tsx';
import VendorTypes from './Pages/admin/VendorTypes.tsx';
import VendorProfile from './Components/admin/vendorList/VendorProfile.tsx';
import VendorListing from './Pages/VendorListing.tsx';
import Profile from './Pages/user/Profile.tsx';
import BookEventForm from './Pages/BookEventForm.tsx';
import PaymentSuccess from './Pages/PaymentSuccess.tsx';
import Messenger from './Pages/user/messenger/Messenger.tsx';

import NotFound from './Components/Error/NotFound.tsx';
import Room from './Components/Live/Room.tsx';




const router = createBrowserRouter(
  createRoutesFromElements(
  <>
   
    <Route path="/" element={<App/>}>
              <Route index={true}  path="/" element={<HomePage/>} />
              <Route path="/login" element={<UserLoginForm />} />
              <Route path="/signup" element={<UserSignupForm />} />
              <Route path="/verify" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path='/about'        element={<AboutPage/>} />
              <Route path="/viewVendor" element={<UserVendorProfile/>}/>
              <Route path="/vendors" element={<VendorListing/>}/>
              <Route path="/chat" element={<Messenger/>}/>
              <Route path="*" element={<NotFound role={"user"}/>}/>
           {/* User Private Routes */}
          <Route path="" element={<UserPrivateRoute/>}>
              <Route path="/profile/*" element={<Profile/>}/>
              <Route path="/bookevent" element={<BookEventForm/>}/>
              <Route path="/payment-success" element={<PaymentSuccess/>}/> 
              <Route path="/live" element={<LiveStreaming/>}/>
              <Route path="/room/:roomId/:role_str" element={<Room/>}/>
          </Route>
    </Route>



    
    <Route path="/admin" element={<AdminApp/>}>
            <Route index={true} path="/admin" element={<AdminLogin />} />
            <Route path="*" element={<NotFound role={"admin"}/>}/>
      {/* Admin Private Routes */}
       <Route path="" element={<AdminPrivateRoute/>}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/vendors" element={<VendorsList />} />
            <Route path="/admin/vendor-types" element={<VendorTypes />} />
            <Route path="/admin/users" element={<UsersList />} />
            <Route path="/admin/vendor" element={<VendorProfile />} />
            <Route path="/admin/wallet" element={<Wallet />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
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

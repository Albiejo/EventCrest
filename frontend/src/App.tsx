// App.tsx

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import MyNavbar from './components/user/Navbar';




const App: React.FC = () => {
  const role = 'user'; 
  const { pathname } = useLocation();

  return (
    
    <>

      <Layout role={role}>
        <ToastContainer/>
    {!(pathname == '/login' || pathname == '/signup' || pathname=='/forgot-password' || pathname=='/reset-password' || pathname=='/verify') && (
        
        <div className="container fixed left-2/4 z-10  mx-auto -translate-x-2/4 pt-4">
          <MyNavbar />
        </div>
      )}
        <Outlet />
      </Layout>
    </>
  );
};

export default App;

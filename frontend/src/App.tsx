// App.tsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import MyNavbar from './components/user/Navbar';




const App: React.FC = () => {
  const role = 'user'; 


  return (
    
    <>

      <Layout role={role}>
        <ToastContainer/>
          <MyNavbar />
        <Outlet />
      </Layout>
    </>
  );
};

export default App;

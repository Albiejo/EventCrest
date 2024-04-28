// AdminApp.tsx

import { Outlet } from "react-router-dom";
import AdminNavbar from '../../Components/Admin/Navbar';
import Layout from "../../Components/Layout";
import Sidebar from "../../Components/Admin/Sidebar";
import { useSelector } from 'react-redux';
import AdminState  from '../../Redux/rootstate/AdminState';
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"


const AdminApp: React.FC = () => {
  const role = 'admin';
  const isAdminSignedIn = useSelector((state: AdminState) => state.admin.isAdminSignedIn);

  return (
    <>
    
      <Layout role={role}>
        <ToastContainer/>
        <AdminNavbar />
        {isAdminSignedIn && <Sidebar />}
        <div style={{ marginLeft: isAdminSignedIn ? '7%' : '35%', transition: 'margin 0.3s' }}>
          <Outlet />
        </div>
      </Layout>
      
    </>
  );
};

export default AdminApp;

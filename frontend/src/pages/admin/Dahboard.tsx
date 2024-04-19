import { useEffect, useState } from 'react'
import '../../../public/css/vendor-unauth.css'
import { axiosInstance } from '../../Api/axiosinstance';
import { axiosInstanceAdmin } from '../../Api/axiosinstance';
import { useSelector } from 'react-redux';
import AdminRootState from '../../Redux/rootstate/AdminState';
import RevenueChart from '../../Components/admin/RevenueChart ';


function Dashboard() {

  const [vendorcount , SetvendorCount] = useState(0);
  const [usercount , SetuserCount] = useState(0);
  const admin = useSelector((state:AdminRootState)=>state.admin.admindata)

  useEffect(()=>{
  
    fetchData();


  },[])

  const fetchData = async()=>{
    await axiosInstance.get('/getvendors').then((res)=>{
      SetvendorCount(res.data.vendors.length)
    })
    await axiosInstanceAdmin.get('/users').then((res)=>{
      SetuserCount(res.data.users.length);
    })
  }


  return (
    <>
   <div className="container mt-10">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-lg p-6 " style={{background:'gray'}}>
          <h2 className="text-lg font-semibold mb-2 text-white">Total Users</h2>
          <p className="text-gray-700 text-white">{usercount}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6" style={{background:'gray'}}>
          <h2 className="text-lg font-semibold mb-2 text-white">Total Vendors</h2>
          <p className="text-gray-700 text-white">{vendorcount}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6" style={{background:'gray'}}>
          <h2 className="text-lg font-semibold mb-2 text-white">Total Revenue</h2>
          <p className="text-gray-700 text-white">${admin?.Wallet}</p>
        </div>
      </div>
     
    </div>

    <RevenueChart/>
    </>
  )
}

export default Dashboard

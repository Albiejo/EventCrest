
import FullNotification from '../Components/common/FullNotification'
import { useSelector } from 'react-redux';
import UserRootState from '../Redux/rootstate/UserState';
import { useEffect } from 'react';
import AdminRootState from '../Redux/rootstate/AdminState';
import { useLocation } from 'react-router-dom';
import VendorRootState from '../Redux/rootstate/VendorState';
import DefaultLayout from '../Layout/DefaultLayout';

const NotificationPage = () => {
    
    const user=useSelector((state: UserRootState) => state.user.userdata);

    const admin = useSelector((state: AdminRootState) => state.admin.admindata)

    const vendor  = useSelector((state: VendorRootState) => state.vendor.vendordata)
    let isVendor=false;

    const location = useLocation();
    let propsToSend = {};

    if (location.pathname === '/profile/notifications') {
      isVendor = false;
      propsToSend = {
        notifications: user?.notifications,
        id: user?._id,
      };
    } else if (location.pathname === '/admin/notifications') {
      isVendor = false;
      propsToSend = {
        notifications: admin?.notifications,
        id: admin?._id,
      };
    } else if (location.pathname === '/vendor/notifications') {
      isVendor = true;
      propsToSend = {
        notifications: vendor?.notifications,
        id: vendor?._id,
      };
    }


    useEffect(()=>{
      console.log("user  updated")
    },[user])

    return (
      <>
        {isVendor ? (
          <DefaultLayout>
            <span className='font-bold'>Notifications</span>
            <FullNotification {...propsToSend}/>   
          </DefaultLayout>
        ) : (
          <>
            <span className='font-bold'>Notifications</span>
            <FullNotification {...propsToSend}/>   
          </>
        )}
      </>
    );
    
}

export default NotificationPage
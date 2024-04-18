
import FullNotification from '../../Components/common/FullNotification'
import { useSelector } from 'react-redux';
import AdminRootState from '../../Redux/rootstate/AdminState';


const AdminNotifications = () => {

  const admin = useSelector((state: AdminRootState) => state.admin.admindata)

  const notifications = admin?.notifications
  return (
    <>
    <span className='font-bold'>Notifications</span>
    <FullNotification notifications={notifications} id={admin?._id}/>
    </>
  )
}

export default AdminNotifications
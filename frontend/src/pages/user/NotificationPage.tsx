
import FullNotification from '../../Components/common/FullNotification'
import { useSelector } from 'react-redux';
import UserRootState from '../../Redux/rootstate/UserState';


const NotificationPage = () => {
    
    const user=useSelector((state: UserRootState) => state.user.userdata);

    const notifications = user?.notifications

  return (
    <>
    <span className='font-bold'>Notifications</span>
    <FullNotification notifications={notifications} id={user?._id}/>
    </>
  )
}

export default NotificationPage
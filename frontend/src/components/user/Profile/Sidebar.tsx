import { Card, Typography, List, ListItem, ListItemPrefix} from '@material-tailwind/react';
import {   InboxIcon, PowerIcon, HomeIcon, PencilIcon    } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../../../api/axiosinstance';
import { logout } from '../../../redux/slices/UserSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';


function UserSidebar() {

  const navigate =useNavigate();
  const dispatch= useDispatch();
  const handleLogout=(e: React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault();
    axiosInstance.get("/logout")
      .then(() => {
        dispatch(logout());
        navigate("/login");
      })
      .catch((error) => {
        console.log('here', error);
      });
  }

  return ( <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 border" placeholder={undefined}>
      
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray"  placeholder={undefined}>
          Event Crest
        </Typography>
      </div>


      <List  placeholder={undefined}>
       
       <Link to='/profile'>
        <ListItem  placeholder={undefined}>
          <ListItemPrefix  placeholder={undefined}>
            <PencilIcon className="h-5 w-5" />
          </ListItemPrefix>
          Edit Profile
        </ListItem>
        </Link>


        <Link to='/profile/change-password'>
        <ListItem
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <ListItemPrefix
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <i className="fa-solid fa-lock"></i>
            </ListItemPrefix>
            Change Password
          </ListItem>
        </Link>

        <Link to='/profile/Favorites'>
        <ListItem
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <ListItemPrefix
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <i className="fa-solid fa-heart"></i>
            </ListItemPrefix>
            Favorite Vendors
          </ListItem>
        </Link>


        <Link to='/profile/Bookings'>
        <ListItem
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
           </svg>

            Vendor Bookings
          </ListItem>
        </Link>



        <ListItem  placeholder={undefined}>
          <ListItemPrefix  placeholder={undefined}>
            <InboxIcon className="h-5 w-5" />
          </ListItemPrefix>
          Inbox
          {/* <ListItemSuffix  placeholder={undefined} children={undefined}>
            <Chip
              value="14"
              size="sm"
              variant="ghost"
              color="blue-gray"
              className="rounded-full"
            />
          </ListItemSuffix> */}
        </ListItem>


        <Link to="/"> <ListItem  placeholder={undefined}>
          <ListItemPrefix  placeholder={undefined}>
            <HomeIcon className="h-5 w-5" />
          </ListItemPrefix>
        Home
        </ListItem></Link>

       
        <ListItem  placeholder={undefined} onClick={handleLogout}>
          <ListItemPrefix  placeholder={undefined}>
            <PowerIcon className="h-5 w-5" />
          </ListItemPrefix>
          Log Out
        </ListItem>


      </List>
    </Card>)
}



export default UserSidebar;


import React from "react";
import {
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Drawer,
  Card,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import {
  Bars3Icon,
  BookmarkIcon,
  HeartIcon,
  LockClosedIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { axiosInstance } from "../../../api/axiosinstance";
import { logout } from "../../../redux/slices/UserSlice";


export default function Sidebar() {
  
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

  
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
 
 
 
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
 
  return (
    <>
      <IconButton variant="text" size="lg" onClick={openDrawer} className="mt-20 fixed" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        {isDrawerOpen ? (
          <XMarkIcon className="h-8 w-8 stroke-2" />
        ) : (
          <Bars3Icon className="h-8 w-8 stroke-2" />
        )}
      </IconButton>


      <Drawer open={isDrawerOpen} onClose={closeDrawer} className="fixed"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <Card
         style={{background:"#002F5E" , border:'10px solid white' }}
          shadow={false}
          className="h-[calc(100vh-2rem)] w-full h-full p-4 rounded-none"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          <div className="mb-2 flex items-center gap-4 p-4 bg-white">
            <Typography variant="h5" color="black"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Event Crest
            </Typography>
          </div>
          
          <List  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            
         
            <hr className="my-2 border-blue-gray-50" />
            
            <Link to="/profile" >
            <ListItem  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <ListItemPrefix  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <UserCircleIcon className="h-5 w-5" />
              </ListItemPrefix>
              Profile
            </ListItem>
            </Link>

            <Link to="/profile/change-password">
            <ListItem  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <ListItemPrefix  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <LockClosedIcon className="h-5 w-5" />
              </ListItemPrefix>
              Change Password
            </ListItem>
            </Link>

            <Link to="/profile/Favorites">
            <ListItem  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <ListItemPrefix  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <HeartIcon className="h-5 w-5" />
              </ListItemPrefix>
              Favourites
            </ListItem>
            </Link>

            <Link to="/profile/Bookings">
            <ListItem  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <ListItemPrefix  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <BookmarkIcon className="h-5 w-5" />
              </ListItemPrefix>
              Vendor Bookings
            </ListItem>
            </Link>

            <ListItem  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <ListItemPrefix  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <InboxIcon className="h-5 w-5 " />
              </ListItemPrefix>
              Inbox
              <ListItemSuffix  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Chip
                  value="14"
                  size="sm"
                  variant="ghost"
                  color="blue-gray"
                  className="rounded-full"
                />
              </ListItemSuffix>
            </ListItem>
        
           
            <hr className="my-2 border-blue-gray-50" />
            <ListItem  placeholder={undefined} onClick={handleLogout}>
                <ListItemPrefix  placeholder={undefined}>
                  <PowerIcon className="h-5 w-5" />
                </ListItemPrefix>
                Log Out
            </ListItem>


          </List>
      
        </Card>
      </Drawer>
    </>
  );
}
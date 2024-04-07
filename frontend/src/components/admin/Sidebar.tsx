// import React from "react";
// import {
//   Button,
//   Card,
//   List,
//   ListItem,
//   ListItemPrefix
// } from "@material-tailwind/react";
// import {
//   PowerIcon,
// } from "@heroicons/react/24/solid";
// import { Link, useNavigate } from "react-router-dom";
// import { axiosInstanceAdmin } from "../../api/axiosinstance"; 
// import { logout } from "../../redux/slices/AdminSlice";
// import {  useDispatch } from "react-redux";


// const Sidebar=() =>{
//   const [open, setOpen] = React.useState(0);
 
//   const navigate = useNavigate();
//   const dispatch= useDispatch();

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const handleOpen = (value: React.SetStateAction<number>) => {
//     setOpen(open === value ? 0 : value);
//   };
 

//   const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     axiosInstanceAdmin.get("/logout")
//       .then(() => {
//         dispatch(logout());
//         navigate("/admin/login");
//       })
//       .catch((error) => {
//         console.log('here', error);
//       });
//   };



//   return (
//     <div style={{ position: 'fixed', top: 50, left: 0, height: '100%', zIndex: 100 }}>
//     <Card className="h-[calc(100vh-2rem)] fixed-sidebar w-full max-w-[16rem] shadow-xl shadow-blue-gray-900/5"  style={{ borderRadius: 0,border:0,backgroundColor:'#36454F' }} placeholder={undefined}>
//       <List  placeholder={undefined}>

//         <Link to="/admin/dashboard">
//         <ListItem  placeholder={undefined} style={{ color: 'white' }}>
//           <ListItemPrefix  placeholder={undefined}>
//           <i className="fa-solid fa-table-columns" color="white"></i>
//           </ListItemPrefix>
//           Dashboard
//         </ListItem>
//         </Link>

//         <Link to="/admin/users">
//         <ListItem  placeholder={undefined} style={{ color: 'white' }}>
//           <ListItemPrefix  placeholder={undefined}>
//           <i className="fa-solid fa-users"></i>
//           </ListItemPrefix>
//           Users
//         </ListItem>
//         </Link>


//         <Link to="/admin/vendors">
//         <ListItem  placeholder={undefined} style={{ color: 'white' }}>
//           <ListItemPrefix  placeholder={undefined}>
//           <i className="fa-solid fa-user-tie"></i>
//           </ListItemPrefix>
//             Vendors
//         </ListItem>
//         </Link>

//         <Link to="/admin/wallet">
//         <ListItem  placeholder={undefined} style={{ color: 'white' }}>
//           <ListItemPrefix  placeholder={undefined}>
//           <i className="fa-solid fa-wallet"></i>
//           </ListItemPrefix>
//             Wallet        
//         </ListItem>
//         </Link>


//         <hr className="my-2 border-blue-gray-50" />
       
//         <ListItem  placeholder={undefined} style={{ color: 'white' }}>
//           <ListItemPrefix  placeholder={undefined}>
//             <PowerIcon className="h-5 w-5" />
//           </ListItemPrefix>
//           <Button variant="outlined" color="white" size="sm" className="" placeholder={undefined} onClick={handleLogout} style={{border:"none"}}>
//           <span>Logout</span>
//         </Button>
//         </ListItem>
      
//       </List>
//     </Card>
//     </div>
//   );
// }


// export default Sidebar






import React from "react";
import {
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Drawer,
  Card,
  Button,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import {
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { axiosInstanceAdmin } from "../../api/axiosinstance"; 
import { logout } from "../../redux/slices/AdminSlice";
import {  useDispatch } from "react-redux";

export default function Sidebar() {
  
  const navigate =useNavigate();
  const dispatch= useDispatch();

  const handleLogout=(e: React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault();
    axiosInstanceAdmin.get("/logout")
      .then(() => {
        dispatch(logout());
        navigate("/admin/login");
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



      <Drawer open={isDrawerOpen} onClose={closeDrawer} className="fixed"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
        <Card
          shadow={false}
          className="h-[calc(100vh-2rem)] w-full p-4"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          <div className="mb-2 flex items-center gap-4 p-4">
            <img
              src="https://docs.material-tailwind.com/img/logo-ct-dark.png"
              alt="brand"
              className="h-8 w-8"
            />
            <Typography variant="h5" color="blue-gray"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
             Admin panel
            </Typography>
          </div>
          
          <List  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            
         
            <hr className="my-2 border-blue-gray-50" />
            
            <Link to="/admin/dashboard">
            <ListItem style={{ color: 'black' }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <ListItemPrefix  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <UserCircleIcon className="h-5 w-5" />
              </ListItemPrefix>
              Dashboard
            </ListItem>
            </Link>

            <Link to="/admin/users">
            <ListItem  placeholder={undefined} style={{ color: 'black' }}>
              <ListItemPrefix  placeholder={undefined}>
              <i className="fa-solid fa-users"></i>
              </ListItemPrefix>
              Users
            </ListItem>
            </Link>

            <Link to="/admin/vendors">
            <ListItem  placeholder={undefined} style={{ color: 'black' }}>
              <ListItemPrefix  placeholder={undefined}>
              <i className="fa-solid fa-user-tie"></i>
              </ListItemPrefix>
                Vendors
            </ListItem>
            </Link>


            <Link to="/admin/wallet">
              <ListItem  placeholder={undefined} style={{ color: 'black' }}>
              <ListItemPrefix  placeholder={undefined}>
              <i className="fa-solid fa-wallet"></i>
              </ListItemPrefix>
                Wallet        
            </ListItem>
            </Link>

            <hr className="my-2 border-blue-gray-50" />


          
        
           
            <ListItem  placeholder={undefined} style={{ color: 'black' }}>
          <ListItemPrefix  placeholder={undefined}>
            <PowerIcon className="h-5 w-5" />
          </ListItemPrefix>
          <Button variant="outlined" color="white" size="sm" className="" placeholder={undefined} onClick={handleLogout} style={{border:"none"}}>
          <span className="text-black">Logout</span>
        </Button>
        </ListItem>

          </List>
      
        </Card>
      </Drawer>
    </>
  );
}
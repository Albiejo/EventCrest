import React from 'react';
import { Card, Typography, List, ListItem, ListItemPrefix, ListItemSuffix, Chip } from '@material-tailwind/react';
import {   InboxIcon, PowerIcon, HomeIcon, PencilIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';




function UserSidebar() {
  return ( <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5"  placeholder={undefined}>
      
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray"  placeholder={undefined}>
          Sidebar
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

       
        <ListItem  placeholder={undefined}>
          <ListItemPrefix  placeholder={undefined}>
            <PowerIcon className="h-5 w-5" />
          </ListItemPrefix>
          Log Out
        </ListItem>


      </List>
    </Card>)
}



export default UserSidebar;
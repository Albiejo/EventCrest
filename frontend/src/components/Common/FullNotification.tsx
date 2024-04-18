import React, {  useState } from 'react'
import { Button, Card, Typography } from "@material-tailwind/react";
import Pagination from './Pagination';
import { axiosInstance } from '../../Api/axiosinstance';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { axiosInstanceAdmin } from '../../Api/axiosinstance';


// interface FullNotificationProps {
//   notifications: any[]; 
//   id: string | undefined; 
// }



  const FullNotification= ({ notifications , id}) => {



    let isUser;
    if(location.pathname === '/profile/notifications'){
      isUser=true;
    }else{
      isUser=false;
    }

    const sortedNotifications = notifications.slice().sort((a: { timestamp: string | number | Date; }, b: { timestamp: string | number | Date; }) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateB - dateA;
      });

      
    const [currentPage, setCurrentPage] = useState(1);
    const notificationsPerPage = 5;
    const totalPages = Math.ceil(notifications.length / notificationsPerPage);
    const startIndex = (currentPage - 1) * notificationsPerPage;
    const rowsForPage = sortedNotifications.slice(startIndex, startIndex + notificationsPerPage);
    const [read , setRead] = useState(false)
        const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
        setCurrentPage(pageNumber);
        };
    



        const handleClick = async(id: any ,notifiID: any ) => {
        const axiosInstanceToUse = isUser ? axiosInstance : axiosInstanceAdmin;
        try {
          await axiosInstanceToUse.patch( isUser ? `/MarkAsRead?userId=${id}&notifiId=${notifiID}` : `/MarkasRead?id=${id}&notifid=${notifiID}` ,{ withCredentials: true } )
          .then((res) => {
            
              if(res.data.data.message ==="Notification marked as read"){
                 setRead(true)
               

              }else if(res.data.data.message ==="Notification marked as unread"){
                  setRead(false)
                 
              }
          })
        } catch (error) {
          toast.success(error.message);
        }
      }




    return (
       <Card className="h-full overflow-scroll mr-36  border-4 border-gray-700 " placeholder={undefined}>
         <table className="w-full min-w-max table-auto text-left">
           <thead>
           <tr>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70" placeholder={undefined}>
                Message
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70" placeholder={undefined}>
                Time
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70" placeholder={undefined}>
                Action
              </Typography>
            </th>
          </tr>
           </thead>
           <tbody>
             {notifications.length > 0 ? (
               rowsForPage.map((notification: { message: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; timestamp: string | number | Date; _id: any; }, index: React.Key | null | undefined) => (
                
                 <tr key={index} className="p-4 border-b border-blue-gray-50">
                   <td className="flex items-center  ">
                    <Typography variant="small" color="blue-gray" className="font-normal flex-grow" placeholder={undefined}>
                       {notification.message}
                    </Typography>
                   </td>

                   <td className="flex items-center  ">
                    <Typography variant="small" color="blue-gray" className="font-normal flex-grow" placeholder={undefined}>
                    {format(new Date(notification.timestamp), 'MMMM dd, yyyy h:mm a')}
                    </Typography>
                   </td>

                   <td className="flex items-center justify-end">

                    {
                        read ?  <Button color="blue-gray" className="font-bold " placeholder={undefined} onClick={() => handleClick(id, notification._id)} style={{background:'green'}}>
                                    Mark Unread
                                </Button> :
                                 <Button color="blue-gray" className="font-bold" placeholder={undefined} onClick={() => handleClick(id, notification._id)}style={{background:'blue'}}>
                                    Mark Read
                               </Button>
                    }
                  
                   </td>
                 </tr>
               ))
             ) : (
               <tr>
                 <td colSpan="2" className="p-4">
                   No new notifications.
                 </td>
               </tr>
             )}
           </tbody>
         </table>
         {/* Assuming Pagination is a custom component that you've implemented */}
         <Pagination
           currentPage={currentPage}
           totalPages={totalPages}
           onPageChange={handlePageChange}
         />
       </Card>
    );
   };


export default FullNotification
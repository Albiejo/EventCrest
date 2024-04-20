import React, {  useState } from 'react'
import { Button, Card } from "@material-tailwind/react";
import Pagination from './Pagination';
import { axiosInstance } from '../../Api/axiosinstance';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { axiosInstanceAdmin } from '../../Api/axiosinstance';



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
    const [userdata , setuserdata] = useState([])
const read = true

    const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
        setCurrentPage(pageNumber);
        };
    



        const handleClick = async(id: any ,notifiID: any ) => {
        const axiosInstanceToUse = isUser ? axiosInstance : axiosInstanceAdmin;
        try {
          await axiosInstanceToUse.patch( isUser ? `/MarkAsRead?userId=${id}&notifiId=${notifiID}` : `/MarkasRead?id=${id}&notifid=${notifiID}` ,{ withCredentials: true } )
          .then((res) => {
            setuserdata(res.data.data.data)
          })
        } catch (error) {
          toast.success(error.message);
        }
      }




    return (
       <Card className="h-full overflow-scroll mr-36  border-4 border-gray-700 " placeholder={undefined}>
       
       <div className="overflow-x-auto">
         <table  className="min-w-full divide-y divide-gray-200" >
          
         <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Notification
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Times
            </th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>


        <tbody className="bg-white divide-y divide-gray-200">
      {notifications.length > 0 ? 
      <>
      
      {rowsForPage.map((notification: { message: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; timestamp: string | number | Date; _id: any; }, index: React.Key | null | undefined)  => (
           
           <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{notification.message}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{format(new Date(notification.timestamp), 'MMMM dd, yyyy h:mm a')}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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

          ))}
      </> :
      <>
        <tr>
                 <td colSpan="2" className="p-4">
                   No new notifications.
                 </td>
               </tr>

      </>}

      
          
    </tbody>
         </table>
        </div>
        
         <Pagination
           currentPage={currentPage}
           totalPages={totalPages}
           onPageChange={handlePageChange}
         />
       </Card>
    );
   };


export default FullNotification
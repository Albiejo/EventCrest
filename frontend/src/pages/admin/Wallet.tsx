import {
  Card,
  
  CardBody,

  Typography,
 
 
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { axiosInstanceAdmin } from "../../api/axiosinstance";


interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
}
interface Vendor {
  _id: string;
  name: string;
  email: string;
  phone: number;
  city:string;
  password:string;
  isActive: boolean;
  isVerified:boolean;
  verificationRequest:boolean;
  totalBooking:number;
  coverpicUrl:string;
  logoUrl:string;
}

interface booking{
  date:string;
  name:string;
  eventName:string;
  city:string;
  pin:number;
  mobile:number;
  createdAt:Date;
  vendorId:string;
  userId:string;
  status:string;
  payment_status:string;
  amount:number;
}

interface payment{
  _id:string;
    amount:number;
    vendorId:Vendor;
    userId:User;
    bookingId:booking;
    createdAt:Date
}

function Wallet() {

  const formatDate = (createdAt:Date) => {
  const date = new Date(createdAt);

    const formattedDate = date.toLocaleDateString("en-US");
    return formattedDate;
  };


  const [payments,setPayments]=useState<payment[]>([])

  useEffect(()=>{
    axiosInstanceAdmin
      .get(`/all-payment-details`, { withCredentials: true })
      .then((response) => {
        setPayments(response.data.payment);
        console.log(response.data.payment);
      })
      .catch((error) => {
        console.log('here', error);
      });
  },[])

  
  return (


    <>
    <div className="flex justify-between bg-green-100 p-6 mr-20 mt-20">
      <Card className="w-80"  placeholder={undefined}>
        <CardBody  placeholder={undefined}>
          <Typography variant="h5" color="blue-gray"  placeholder={undefined} className="mb-2">
            Admin Wallet Amount
          </Typography>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

          1000
        </CardBody>
      </Card>


      <Card className="h-full w-full overflow-scroll"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                  Payment_ID
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                  User
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                  Vendor
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                  Event
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                  Date
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                  Amount
                </Typography>
              </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((item, index) => (
            <tr key={index} className="even:bg-blue-gray-50/50">
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                {item._id}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              {item.userId.name}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            {item.vendorId.name}
                </Typography>
              </td>
              <td className="p-4">
                <Typography as="a" href="#" variant="small" color="blue-gray" className="font-medium"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  {item.bookingId.eventName}
                </Typography>
              </td>
              <td className="p-4">
                <Typography as="a" href="#" variant="small" color="blue-gray" className="font-medium"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  {formatDate(item.createdAt)}
                </Typography>
              </td>
              <td className="p-4">
                <Typography as="a" href="#" variant="small" color="blue-gray" className="font-medium"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  {item.amount}
                </Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>

      </div>

      
       </>
  );
}

export default Wallet

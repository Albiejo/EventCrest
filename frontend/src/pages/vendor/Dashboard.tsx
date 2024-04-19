import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../Layout/DefaultLayout';
import { useSelector } from 'react-redux';
import VendorRootState from '../../Redux/rootstate/VendorState';
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Bar } from 'react-chartjs-2';
import { axiosInstanceVendor } from '../../Api/axiosinstance';

const Dashboard: React.FC = () => {

  const vendor = useSelector((state:VendorRootState)=>state.vendor.vendordata)
  const [bookingData, setBookingData] = useState(null);

    useEffect(()=>{
      fetchData(); 
    },[])

    const fetchData =async()=>{
      await axiosInstanceVendor.get('/getallBookings').then((response)=>{
        const formattedData = {
          labels: response.data.bookings.map(item => item.createdAt),
          datasets: [
            {
              label: 'Number of Bookings',
              data: response.data.bookings.map(item => item.count),
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        };
        setBookingData(formattedData)
      })
    }

   

  return (
    <DefaultLayout>
    <div className="grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
      
      <div className="md:col-span-2 2xl:col-span-1 ">
        <Card className="mt-6 w-full  bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 " placeholder={undefined}>
          <CardBody placeholder={undefined}>
            <Typography variant="h5" color="blue-gray" className="mb-2" placeholder={undefined}>
           TOTAL BOOKING
            </Typography>
            <Typography placeholder={undefined}>
             {vendor?.totalBooking}
            </Typography>
          </CardBody>
          <CardFooter className="pt-0 " placeholder={undefined}>
            <Button placeholder={undefined}>Read More</Button>
          </CardFooter>
        </Card>
      </div>
      
      
      <div className="md:col-span-2 2xl:col-span-1">
        <Card className="mt-6 w-full  bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600" placeholder={undefined}>
          <CardBody placeholder={undefined}>
            <Typography variant="h5" color="blue-gray" className="mb-2" placeholder={undefined}>
             OVERALL RATING
            </Typography>
            <Typography placeholder={undefined}>
              <div className='flex'>
              {vendor?.OverallRating}
              <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="green"
              className="h-5 w-5 text-yellow-700"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
              </div>
          
            </Typography>
          </CardBody>
          <CardFooter className="pt-0" placeholder={undefined}>
            <Button placeholder={undefined}>Read More</Button>
          </CardFooter>
        </Card>
      </div>
      
      
      <div className="md:col-span-2 2xl:col-span-1">
        <Card className="mt-6 w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 " placeholder={undefined}>
          <CardBody placeholder={undefined}>
            <Typography variant="h5" color="blue-gray" className="mb-2" placeholder={undefined}>
             TOTAL POST
            </Typography>
            <Typography placeholder={undefined}>
            {vendor?.OverallRating}
            </Typography>
          </CardBody>
          <CardFooter className="pt-0" placeholder={undefined}>
            <Button placeholder={undefined}>Read More</Button>
          </CardFooter>
        </Card>
      </div>
  
    </div>

{/* 
    <div  className='mt-10 ml-4'>
      <h2>Bookings Chart</h2>
      <div style={{ height: '400px', width: '800px' }}>
        <Bar
          data={bookingData}
          options={{
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </div> */}


  </DefaultLayout>
  
  
  );
};

export default Dashboard;

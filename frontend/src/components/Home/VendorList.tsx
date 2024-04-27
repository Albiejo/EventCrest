import { axiosInstance } from "../../Api/axiosinstance";
import {useState ,useEffect} from "react"

import {
    Typography,
  } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import VendorCard from "./VendorListingCard";
import LiveEvents from "./LiveEvents";



interface Vendors {
    _id: string;
    name: string;
    email: string;
    phone: string;
    city:string;
    isActive: boolean;
    totalBooking:number;
    logoUrl:string;
    coverpicUrl:string;
    OverallRating:number;
  }


const VendorList=()=> {

    const [vendors,setVendors]=useState<Vendors[]>([])

    useEffect(()=>{
        axiosInstance
      .get('/getvendors',{withCredentials:true})
      .then((response) => {
        console.log(response.data)
        const sortedVendors = response.data.vendors.sort((a, b) => b.OverallRating - a.OverallRating);
        setVendors(sortedVendors);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
    },[])



    return (
        <>
        <div style={{ padding:"40px"}} className="bg-white sm-flex ">
            <section className="mt-10 mb-32 mx-20 items-center">
                <h1 style={{ fontFamily: 'playfair display', fontSize: '30px' }} className="text-center mb-10">
                EXPLORE &nbsp;LIVE &nbsp;EVENTS
                </h1>
              <LiveEvents />
            </section>  
       
            <Typography
                variant="h5"
                color="black"
                className="mx-auto w-full leading-snug text-center lg:max-w-xl lg:text-3xl mb-5 font-bold"
                placeholder={undefined}
                style={{ fontFamily: 'playfair display'}} 
              >
                 TOP RATED VENDORS
            </Typography>

        <div style={{ display: 'flex',flexWrap:"wrap"}}> 
        {vendors.map((vendor, index) => (
          <>    
          <Link key={index} to={`/viewVendor?vid=${vendor._id}`}>   
          <div className="ml-4 mr-4 mb-4">
            <VendorCard {...vendor} key={index}/>
          </div> 
          </Link> 
          </>
        ))}
         </div>
        </div>
        </>
    );
  }


  export default VendorList;




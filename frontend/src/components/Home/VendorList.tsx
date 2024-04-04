import { axiosInstance } from "../../api/axiosinstance";
import {useState ,useEffect} from "react"
import VendorCard from "./VendorCard";
import {
    Typography,
  } from "@material-tailwind/react";
import { Link } from "react-router-dom";

interface Vendors {
    _id: string;
    name: string;
    email: string;
    phone: string;
    city:string;
    isActive: boolean;
    totalBooking:number;
  }


const VendorList=()=> {

    const [vendors,setVendors]=useState<Vendors[]>([])

    useEffect(()=>{
        axiosInstance
      .get('/getvendors',{withCredentials:true})
      .then((response) => {
        console.log(response.data)
        setVendors(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
    },[])



    return (
        <>
        <div style={{ padding:"40px"}} className="bg-white sm-flex">
        <Typography
        variant="h5"
        color="black"
        className="mx-5 w-full leading-snug !text-3xl lg:max-w-xl lg:!text-3xl mb-5 font-serif"
        placeholder={undefined}>
            TOP RATED VENDORS
      </Typography>
      
        <div style={{ display: 'flex',flexWrap:"wrap"}}> 
        {vendors.map((vendor, index) => (
          <>    
          <Link key={index} to={`/viewVendor?vid=${vendor._id}`}>    
            <VendorCard {...vendor} key={index}/>
          </Link> 
          </>
        ))}
         </div>
        </div>
        </>
    );
  }


  export default VendorList;




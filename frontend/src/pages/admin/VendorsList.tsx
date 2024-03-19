import VendorCard from "../../components/admin/vendorList/VendorCard"
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstanceAdmin } from "../../api/axiosinstance";


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

}



function VendorsList() {


  const [vendors,setVendors]=useState<Vendor[]>([]);

  useEffect(()=>{
    axiosInstanceAdmin
    .get("/getvendors", { withCredentials: true })
    .then((response) => {
      setVendors(response.data)
    })
    .catch((error) => {
      console.log("error occurred", error);
    })
  },[vendors])

  
  return (
    <div className="m-20">
      <div className="mb-5 flex justify-between items-center">

        <h3 className="block font-sans text-3xl font-semibold leading-snug text-inherit">
          Vendors List
        </h3>

        <Button variant="gradient" className="rounded-full"  placeholder={undefined}>
          <Link to="/admin/vendor-types">
            View Vendor Types
          </Link>
        </Button>

      </div>

      <div className="flex flex-wrap">
        {vendors.map((vendor, index) => (
          <Link key={index} to={`/admin/vendor?Id=${vendor._id}`} className="m-3">
            <VendorCard {...vendor} className="max-w-xs" />
          </Link>
        ))}
      </div>
      
    </div>
  );
}

export default VendorsList

import { useEffect, useState } from "react";
import VendorListingCard from "../../Home/VendorListingCard";
import { axiosInstance } from "../../../api/axiosinstance";
import UserRootState from "../../../redux/rootstate/UserState";
import { useSelector } from "react-redux";

interface Vendors {
    _id: string;
    name: string;
    email: string;
    phone: string;
    city:string;
    isActive: boolean;
    totalBooking:number;
  }

  
function Favorites() {

    const [vendors,setVendors]=useState<Vendors[]>([])
    const user = useSelector(
      (state: UserRootState) => state.user.userdata)


    useEffect(()=>{
        axiosInstance
      .get(`/get-favorite-vendor?userid=${user?._id}`,{withCredentials:true})
      .then((response) => {
        console.log("data is :",response.data);
        setVendors(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
    },[])
  return (
    <div className="m-10 flex flex-row flex-wrap gap-4">
         {vendors.map((vendor, index) => (
            <VendorListingCard {...vendor} key={index}/>
        ))}    </div>
  )
}

export default Favorites

   
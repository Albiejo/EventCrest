import mongoose from "mongoose";
import Booking, { bookingDocument } from "../Model/Booking"
import vendor from "../Model/Vendor"
import user from "../Model/User";


export const createNewBooking=async(  bookingData: Partial<bookingDocument> ): Promise<bookingDocument> =>{
    try {
        const result = await Booking.create(bookingData);
        let vendorId = bookingData.vendorId;

        await vendor.findByIdAndUpdate(vendorId, {
          $push: { bookedDates: bookingData.date },
        }); 
        
        console.log("date added to booked dates")
        const vendorData  = await vendor.findById(vendorId);
        if(!vendorData){
          throw Error;
        }
        vendorData.notifications.push({
          _id: new mongoose.Types.ObjectId(),
          message:"New Event Booked!",
          timestamp: new Date() ,
          Read:false
        })
        console.log("notifications added for vendor since booking happened successfully");
        return result;
      } catch (error) {
        throw error;
      }
}



export const findBookingsByUserId=async (
    userId: string,
    skip: number, limit: number
  ): Promise<bookingDocument[]> => {
    try {
      const result = await Booking.find({ userId: userId }).populate('vendorId').skip(skip).limit(limit);
      return result;
    } catch (error) {
      throw error;
    }
};


export const findBookingsByVendorId = async (
    vendorId: string
  ): Promise<bookingDocument[]> => {
    try {
      const result = await Booking.find({ vendorId: vendorId });
      
      return result;
    } catch (error) {
      throw error;
    }
  };


  export const findBookingsByBookingId=async (
    bookingId: string
  ): Promise<bookingDocument|{}> => {
    try {
      const result = await Booking.find({ _id: bookingId }).populate('userId').populate('vendorId');
      return result;
    } catch (error) {
      throw error;
    }
  };



  export const updateBookingStatusById=async (
    bookingId: string,
    status:string,
    vid:string,
    userId:string
  ) => {
    try {
      const result = await Booking.findByIdAndUpdate(bookingId,{$set:{status:status}});


      const vendordata = await vendor.findById(vid)
      if (vendordata) {
        if (!vendordata.totalBooking) {
            vendordata.totalBooking = 1;
        } else {
            vendordata.totalBooking += 1; 
        }
     }
      await vendordata?.save();


      const userData = await user.findById(userId);
      userData?.notifications.push({
        _id: new mongoose.Types.ObjectId(),
        message:"Your Booking Status has been updated!",
        timestamp: new Date(),
        Read:false
      })
      await userData?.save();

      return result;
      
    } catch (error) {
      throw error;
    }
  };


  export const updatebookingCancel = async(bookingId:string):Promise<void>=>{
    try {
      const bookingData = await Booking.findById(bookingId);
      if (!bookingData) {
        throw new Error('Booking not found');
      }

      bookingData.status = 'Cancelled'; 
      bookingData.payment_status = 'Cancelled'; 
      await bookingData.save();
    } catch (error) {
      throw error;
    }
  }
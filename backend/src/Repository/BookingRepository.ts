import mongoose from "mongoose";
import Booking, { bookingDocument } from "../Model/Booking"
import vendor from "../Model/Vendor"
import user from "../Model/User";




export const checkDate = async (vendorId:string , date:string): Promise<boolean> => {
try {
  const vendorData = await vendor.findById(vendorId);
    if (!vendorData) {
      throw new Error('Vendor not found');
    }
    const isBooked = vendorData.bookedDates.includes(date);
    return isBooked? true : false;
} catch (error) {
  throw error;
}

}




export const createNewBooking=async(  bookingData: Partial<bookingDocument> ): Promise<bookingDocument> =>{
    try {

         let vendorId = bookingData.vendorId;
         const result = await Booking.create(bookingData);
       

        await vendor.findByIdAndUpdate(vendorId, {
          $push: { bookedDates: bookingData.date },
        }); 
        
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
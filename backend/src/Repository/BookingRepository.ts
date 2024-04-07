import Booking, { bookingDocument } from "../Model/Booking"
import vendor from "../Model/vendor"



export const createNewBooking=async(  bookingData: Partial<bookingDocument> ): Promise<bookingDocument> =>{
    try {
        const result = await Booking.create(bookingData);
        let vendorId = bookingData.vendorId;
        await vendor.findByIdAndUpdate(vendorId, {
          $push: { bookedDates: bookingData.date },
        });
    
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
    status:string
  ) => {
    try {
      const result = await Booking.findByIdAndUpdate(bookingId,{$set:{status:status}});
      return result
      
    } catch (error) {
      throw error;
    }
  };
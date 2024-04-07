import Booking from "../Model/Booking";
import Payment , {paymentDocument} from "../Model/Payment";


export const createNewPaymnet = async (
    paymentData: Partial<paymentDocument>
  ): Promise<paymentDocument> => {
    try {
      const existingPayment = await Payment.findOne({ bookingId: paymentData.bookingId });
    
      if (existingPayment) {
        return existingPayment;
      }
      const result = await Payment.create(paymentData);
      await Booking.findByIdAndUpdate(paymentData.bookingId,{$set:{payment_status:"Completed"}})
      
      return result;
    } catch (error) {
      throw error;
    }
  };

  export const findAllPayments=async():Promise<paymentDocument[]>=>{
    try {
      const result=await Payment.find().populate('userId').populate('vendorId').populate('bookingId');
      return result
    } catch (error) {
      throw error;
    }
  }
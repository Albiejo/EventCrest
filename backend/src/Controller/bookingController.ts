import { Request, Response } from "express";
import { addABooking , getAllBookingsByUser , getAllBookingsByVendor , getAllBookingsById , updateStatusById , countTotalBookingsByUser,
  MarkBookingCancel,checkIfDatePresent,acquireLockForDate,releaseLockForDate,getAllBookings
} from "../Service/bookingService";

import moment from 'moment';
import { ErrorMessages } from "../Util/enums";






class BookingController{

    async bookAnEvent(req: Request, res: Response): Promise<Response>{
        try {
            const vendorId: string = req.query.vendorId as string;
            const userId: string = req.query.userId as string;
            const eventName=req.body.eventName;
            const name=req.body.name;
            const city=req.body.city;
            const date = moment(req.body.date).format('DD-MM-YYYY');
            const pin=parseInt(req.body.pin);
            const mobile=parseInt(req.body.mobile);

            const DateAlreadyBooked  = await checkIfDatePresent(vendorId , date );
            
            if(DateAlreadyBooked){
               return res.status(400).json({ message: "Sorry this date is not available!" });
            }else{
              try {
                    
                    await acquireLockForDate(vendorId, date);

                    const booking = await addABooking(eventName, name, city,date,pin,mobile,vendorId,userId);
                    
                    await releaseLockForDate(vendorId, date);

                    return res.status(201).json({booking:booking,message:"Booking done Successfully"});
              } catch (error) {
                    console.error("Error acquiring lock:", error);
                    return res.status(400).json({ message: "Sorry, this date is currently not available." });
              }        
            }
          } catch (error) {
            console.error(error);
            return res.status(500).json({ message:ErrorMessages.ServerError});
          }
    }


    async getBookingsByUser(req: Request, res: Response): Promise<Response> {
        try {
        
          const userId: string = req.query.userId as string;

          const page: number = parseInt(req.query.page as string) || 1; 
          const pageSize: number = parseInt(req.query.pageSize as string) || 10; 
          const skip = (page - 1) * pageSize; 
          
          const totalBookings = await countTotalBookingsByUser(userId);
          const totalPages = Math.ceil(totalBookings / pageSize);


          const bookings = await getAllBookingsByUser(userId , skip, pageSize);
          
         return res.status(201).json({bookings , totalPages });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message:ErrorMessages.ServerError});
        }
      }



      async getAllBookings(req: Request, res: Response): Promise<Response> {
        try {
          const vendorId: string = req.query.vendorId as string;
          const bookings = await getAllBookingsByVendor(vendorId);
          console.log("bookings are ",bookings)
          return res.status(201).json({bookings});
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message:ErrorMessages.ServerError});
        }
      }



      async getBookingsById(req: Request, res: Response): Promise<Response> {
        try {
          const bookingId: string = req.query.bookingId as string;
          const bookings = await getAllBookingsById(bookingId);
          return res.status(201).json({bookings});
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message:ErrorMessages.ServerError});
        }
      }
   

      async updateStatus(req: Request, res: Response): Promise<Response> {
        try {
          const userId  :string = req.query.userId as string;
          const bookingId: string = req.query.bookingId as string;
          const vendorid : string = req.query.vid as string;
          const status=req.body.status

          const bookings = await updateStatusById(bookingId,status ,vendorid , userId);
          return res.status(201).json(bookings);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message:ErrorMessages.ServerError});
        }
      }


      async MarkasCancel(req: Request, res: Response): Promise<Response>{
        try {
          const date:string = req.body.date as string; 
          const {bookingId ,vendorId } =  req.query;
          const data = await MarkBookingCancel(bookingId as string , vendorId as string , date);
          return  res.status(200).json({data:data});
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message:ErrorMessages.ServerError});
        }
      }


      async getallBookings(req: Request, res: Response): Promise<Response>{
        try {
          const bookings = await getAllBookings();
          return res.status(201).json({bookings});
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message:ErrorMessages.ServerError});
        }
      }
}

export default new BookingController();

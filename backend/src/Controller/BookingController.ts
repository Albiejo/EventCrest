import { Request, Response } from "express";
import { addABooking , getAllBookingsByUser , getAllBookingsByVendor , getAllBookingsById , updateStatusById , countTotalBookingsByUser} from "../Service/BookingService";
import moment from 'moment';

export const BookingController={

    async bookAnEvent(req: Request, res: Response): Promise<void>{
        try {
            const vendorId: string = req.query.vendorId as string;
            const userId: string = req.query.userId as string;
            const eventName=req.body.eventName;
            const name=req.body.name;
            const city=req.body.city;
            const date = moment(req.body.date).format('DD-MM-YYYY');
            const pin=parseInt(req.body.pin);
            const mobile=parseInt(req.body.mobile);
            
            const booking = await addABooking(eventName, name, city,date,pin,mobile,vendorId,userId);
            res.status(201).json({booking:booking,message:"Booking done Successfully"});
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server Error" });
          }
    },


    async getBookingsByUser(req: Request, res: Response): Promise<void> {
        try {
        
          const userId: string = req.query.userId as string;

          const page: number = parseInt(req.query.page as string) || 1; 
          const pageSize: number = parseInt(req.query.pageSize as string) || 10; 
          const skip = (page - 1) * pageSize; 
          
          const totalBookings = await countTotalBookingsByUser(userId);
          const totalPages = Math.ceil(totalBookings / pageSize);


          const bookings = await getAllBookingsByUser(userId , skip, pageSize);
          
          res.status(201).json({bookings , totalPages });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Server Error" });
        }
      },



      async getAllBookings(req: Request, res: Response): Promise<void> {
        try {
          const vendorId: string = req.query.vendorId as string;
          const bookings = await getAllBookingsByVendor(vendorId);
          res.status(201).json({bookings});
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Server Error" });
        }
      },



      async getBookingsById(req: Request, res: Response): Promise<void> {
        try {
          const bookingId: string = req.query.bookingId as string;
          const bookings = await getAllBookingsById(bookingId);
          res.status(201).json({bookings});
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Server Error" });
        }
      },
   

      async updateStatus(req: Request, res: Response): Promise<void> {
        try {
          const bookingId: string = req.query.bookingId as string;
          const vendorid : string = req.query.vid as string;
          console.log("vendorid:",vendorid);
          const status=req.body.status
          const bookings = await updateStatusById(bookingId,status ,vendorid);
          res.status(201).json({bookings});
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Server Error" });
        }
      },
}
import express, { RequestHandler } from  'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.config';
import adminRoutes from "./Routes/adminRoutes"
import userRoutes from "./Routes/userRoutes"
import vendorRoutes from "./Routes/vendorRoutes"
import cors from 'cors';
import session from 'express-session';
import cookieParser from "cookie-parser";
import { userEmailVerifyOtp, userOtpExpiration, vendorOtpExpiration } from './middleware/otpExpiration';



dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin:'http://localhost:5000',
  credentials:true
}))


app.use(bodyParser.json());
// app.use(userOtpExpiration)
// app.use(vendorOtpExpiration)
// app.use(userEmailVerifyOtp)



const sessionMiddleware :RequestHandler=session({
  secret: process.env.SESSION_SECRET!, 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false , 
  maxAge:1000 * 60 * 60* 24  , 
  sameSite:'lax'}
})

app.use(sessionMiddleware);
app.use(cookieParser());

app.use('/api/admin' , adminRoutes);
app.use('/api/user' , userRoutes);
app.use('/api/vendor',vendorRoutes)



const PORT = process.env.PORT;
app.listen(PORT , ()=>{
    console.log(`Server running on ${PORT}...`);
    
});

import express, { RequestHandler } from  'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './files/config/db.config';
import adminRoutes from "./Admin/Routes/adminRoutes"
import userRoutes from "./User/Routes/userRoutes"
import vendorRoutes from "./Vendor/Routes/vendorRoutes"
import cors from 'cors';
import session from 'express-session';
import cookieParser from "cookie-parser";


dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin:'http://localhost:5000',
  credentials:true
}))

app.use(bodyParser.json());

const sessionMiddleware :RequestHandler =  session({
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

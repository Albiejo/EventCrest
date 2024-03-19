import { Request , Response } from "express";
import { signup , login, getUsers,toggleUserBlock ,generateOtpForPassword , ResetPassword , CheckExistingUSer , gLogin , googleSignup , FavoriteVendor } from "../Service/userService";
import generateOtp from "../../files/util/generateOtp";
import { CustomError } from "../../files/Error/CustomError";
import user from "../Model/user";
import Jwt from "jsonwebtoken";


interface UserSession {
  otpSetTimestamp: number | undefined;
  email: string;
  password: string;
  name: string;
  phone: number;
  otpCode: string | undefined;
} 

interface OTP {
  otp: string | undefined;
  email:string;
  otpSetTimestamp: number | undefined;
}


//for google login
interface DecodedData {
  name: string;
  email: string;
  picture: string;
  jti: string;
}




declare module 'express-session' {
  interface Session {
    user: UserSession | undefined;
    otp:OTP,
  }
}


export const  UserController = {


async UserSignup(req: Request, res: Response): Promise<void> {
  try {

    const { email , password , name , phone } = req.body;
   
    const otpCode = await generateOtp(email);
 
    if (otpCode !== undefined) {
      req.session.user = {
        email: email,
        password: password,
        name: name,
        phone: parseInt(phone),
        otpCode: otpCode,
        otpSetTimestamp: Date.now() 
      }
    
      
      res.status(200).json({ "message":"OTP send to email for verification.." , "email":email });   
    
    }
      else{
         console.log("couldn't generate otp, error occcured ,please fix !!");
         res.status(500).json({ message: `Server Error couldn't generate otp, error occcured ,please fix !!` });
      }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
},


async verifyOtp(req:Request , res: Response):Promise<void>{
  try {
    const otp = req.body.otp;
    const userData: UserSession | undefined = req.session.user;
    
    if (!userData) {
      res.status(400).json({ error: "Session data not found. Please sign up again." });
      return;
    }

    const email = userData.email;
    const password = userData.password;
    const name = userData.name;
    const phone = userData.phone;
    if(!userData.otpCode){
      throw new CustomError("OTP Expired...Try again with new OTP !!",400)
    }
    const otpCode = userData.otpCode;

    if(otp === otpCode){
        const user = await signup(email , password , name , phone );
        if(user){
          delete req.session.user;
          console.log("signup data in session after storing in DB: " ,req.session)
          res.status(201).json(user);
        }
        }else{
          res.status(400).json({ message:"Invalid otp !!"});
        }
  } catch (error:any) {
    if (error.code === 11000 && error.keyPattern && error.keyValue) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      const duplicateValue = error.keyValue[duplicateField];
      res.status(500).json({message:`The ${duplicateField} '${duplicateValue}' is already in use.`})
    } else if (error instanceof CustomError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
   
  }},







  async UserLogin(req:Request , res: Response): Promise <void>{
        try {
            const {email,password} = req.body;
            const { token, userData, message } = await login(email, password);
            localStorage.setItem('jwtToken', token);
            res.cookie('jwtToken', token, { httpOnly: true, });
            res.status(200).json({token, userData, message });
        } catch (error) {
          if (error instanceof CustomError) {
            res.status(error.statusCode).json({ message: error.message });
          } else {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
          }
        }
 } ,
    
     
      async UserLogout(req:Request , res: Response): Promise <void> {
        try {
          res.clearCookie('jwtToken');
          res.status(200).json({ message: 'User logged out successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({message:"Server Error"})
            
        }
      },

      async allUsers(req: Request, res: Response): Promise<void>{
        try{
          const { page = 1, limit = 10, search = '' } = req.query;
          const pageNumber = parseInt(page as string, 10);
          const limitNumber = parseInt(limit as string, 10);
          const users = await getUsers(pageNumber, limitNumber, search.toString());
          res.status(200).json({users , pageNumber});
        }catch(error){
          console.log(error);
          res.status(500).json({ message: "server error..." });
        }
      } ,

      async Toggleblock(req:Request , res: Response):Promise<void>{
        try {
          const userId: string | undefined = req.query.userId as string | undefined;
          if (!userId) {
              throw new Error('User ID is missing or invalid.');
          } 
          
          await toggleUserBlock(userId);
          const User = await user.findById(userId);

          if (!User || !User.isActive) {
            res.clearCookie('jwtToken');
            localStorage.removeItem('jwtToken');
          }
          
          res.status(200).json({ message: "User block status updated." });
      } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Server Error" });
      }
      },
 

      async UserForgotPassword(req:Request , res: Response):Promise<void>{

        try {
          const email = req.body.email;
          const user = await CheckExistingUSer(email);
          if(user){
            const otp = await generateOtpForPassword(email);
            req.session.otp = { otp: otp  , email:email , otpSetTimestamp:Date.now()};
            res.status(200).json({ "message":"otp sent to email for password updation request " , "email":email });
          }else{
            res.status(400).json({error:'Email not Registered with us !!'})            
          }
          
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Server Error" });
        }
      },


      async VerifyOtpForPassword(req:Request , res: Response):Promise<void>{
        try {
          const ReceivedOtp = req.body.otp;    
          const generatedOtp = req.session.otp?.otp;    
             
          if(!req.session.otp){
            throw new CustomError("OTP Expired...Try to resend OTP !!",400)
          }

          if(ReceivedOtp === generatedOtp){
            console.log("otp is correct , navigating user to update password.");
            res.status(200).json({data:"otp is correct"})
          }else{
            throw new CustomError("Invalid OTP !!",400)
          }
        } catch (error) {
          if (error instanceof CustomError) {
            res.status(error.statusCode).json({ message: error.message });
          } else {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
          }
        }
      } , 


      async ResetUserPassword(req:Request , res: Response):Promise<void>{
        
       try {
        const password = req.body.password;
        const confirmPassword = req.body.confirm_password;       
            if(password === confirmPassword){             
              const email=req.session.otp.email;
              await ResetPassword(password , email);                          
              res.status(200).json({ message: "Password reset successfully." });
            }else{
              res.status(400).json({ error: "Passwords do not match." });
            }
       } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
       }
      },

      async ResendOtp(req:Request , res: Response):Promise<void>{
       try {
  
        const userData: UserSession | undefined = req.session.user;
        if (!userData) {
          res.status(400).json({ error: "Session data not found. Please sign up again." });
          console.log("no session data found")
          return;
         
        }
        const email = userData.email
        const newOtp = await generateOtp(email);
        if (!email) {
          res.status(400).json({ error: "Email not found in session data." });
          return; 
        }
       
        if (req.session.user) {
          req.session.user.otpCode = newOtp;
        } else {
          console.error("Session user data is unexpectedly undefined.");
          res.status(500).json({ message: "Server Error: Session user data is unexpectedly undefined." });
          return;
        }
        res.status(200).json({ "message": "New OTP sent to email" });
       } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
       }
      },

 
      async UseGoogleLogin(req: Request, res: Response){
        try {
          const decodeInfo = Jwt.decode(req.body.credential) as DecodedData | null;
          if(!decodeInfo){
            return res.status(400).json({ error: "Invalid credentials" });
          }
          const {email , jti}= decodeInfo;
          const password = jti;
          const {token , userData , message } = await gLogin(email,password)
          req.session.user=userData._id;
          res.cookie('jwtToken' , token , {httpOnly:true , secure:process.env.NODE_ENV === 'production'})
          res.status(200).json({token , userData , message});
        } catch (error) {
          if (error instanceof CustomError) {
            res.status(error.statusCode).json({ message: error.message });
          } else {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
          }
        }
      },


      async UseGoogleRegister(req: Request, res: Response){
        try {
          const token = req.body.credential;
          const decodedInfo = Jwt.decode(req.body.credential);

          const {name , email , jti}:DecodedData = decodedInfo as DecodedData;
          const user = await googleSignup(email , jti , name )
          if(user){
            res.status(200).json({message:"User account registered .."})
          }
        } catch (error) {
          res.status(400).json({ error: "User already exists" });
        }
      } , 

      async passwordResendOtp(req:Request , res: Response):Promise<void>{
        try {
          const otp:OTP | undefined =req.session.otp;
          if(!otp){
            res.status(400).json({ error: "Session data not found. Please sign up again." });
            return;
          }
          const email = otp.email;
          const newOtp = await generateOtp(email);
          if(req.session.otp){
            req.session.otp.otp = newOtp;
          }else{
            console.error("session data is undefined..")
            res.status(500).json({message:"Server Error , session data is undefined.. "})
            return;
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Server Error" });
        }
      },

      async AddFavVendor(req:Request , res: Response):Promise<void>{
        try {
        const vendorId: string = req.query.vendorId ? String(req.query.vendorId) : "";
        const userId: string = req.query.userId ? String(req.query.userId) : "";
          if(!vendorId){
            res.status(400).json({error:"Invalid vendor id."})
          }
          if(!userId){
            res.status(400).json({error:"Invalid user id."})
          }

          const data = await FavoriteVendor(vendorId , userId);
          if(data){
            res.status(200).json({message:"vendor added to Favorite list.."});
          }else{
            res.status(400).json({message:"vendor already added to favorites."});
          }

        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Server Error" });
        }
      },

     
     
     
      
};


import { Request, Response } from "express";
import {
  signup,
  login,
  getUsers,
  toggleUserBlock,
  generateOtpForPassword,
  ResetPassword,
  CheckExistingUSer,
  gLogin,
  googleSignup,
  FavoriteVendor,
  checkCurrentPassword,
  UpdatePasswordService,
  UpdateUserProfile,FavoriteVendors,createRefreshToken,findUser,updateNotification
} from "../Service/userService";

import generateOtp from "../util/generateOtp";
import { CustomError } from "../Error/CustomError";
import user from "../Model/User";
import Jwt from "jsonwebtoken";
import { json } from "body-parser";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp from "sharp";
import crypto from "crypto";
import dotenv from 'dotenv';
import { UserSession } from "../util/Interfaces";
import { OTP } from "../util/Interfaces";
import { DecodedData } from "../util/Interfaces";
import { Data } from "emoji-mart";
dotenv.config();




declare module "express-session" {
  interface Session {
    user: UserSession | undefined;
    otp: OTP;
  }
}

const s3 = new S3Client({
  credentials: {
    accessKeyId:process.env.ACCESS_KEY!,
    secretAccessKey:process.env.SECRET_ACCESS_KEY!,
  },
  region:process.env.BUCKET_REGION!,
});


const randomImage = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");


class UserController{

  async UserSignup(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name, phone } = req.body;

      const otpCode = await generateOtp(email);
  
      if (otpCode !== undefined) {
        req.session.user = {
          email: email,
          password: password,
          name: name,
          phone: parseInt(phone),
          otpCode: otpCode,
          otpSetTimestamp: Date.now(),
        };
        res.status(200).json({ message: "OTP send to email for verification..", email: email });
      } else {
        console.log("couldn't generate otp, error occcured ,please fix !!");
        res
          .status(500)
          .json({
            message: `Server Error couldn't generate otp, error occcured ,please fix !!`,
          });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }




  
  async verifyOtp(req: Request, res: Response): Promise<void> {
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
      if (!userData.otpCode) {
        throw new CustomError("OTP Expired...Try again with new OTP !!", 400);
      }
      const otpCode = userData.otpCode;

      if (otp === otpCode) {
        const user = await signup(email, password, name, phone);

        if (user) {
          delete req.session.user;
        //signup data in session deleted  after storing in DB
          res.status(201).json(user);
        }
      } else {
        res.status(400).json({ message: "Invalid otp !!" });
      }
    } catch (error: any) {
      if (error.code === 11000 && error.keyPattern && error.keyValue) {
        const duplicateField = Object.keys(error.keyPattern)[0];
        const duplicateValue = error.keyValue[duplicateField];
        res
          .status(500)
          .json({
            message: `The ${duplicateField} '${duplicateValue}' is already in use.`,
        });
      } else if (error instanceof CustomError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
      }
    }
  }



  async UserLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const {refreshToken,  token, userData, message } = await login(email, password);
      res.cookie("jwtToken", token, { httpOnly: true });
      res.status(200).json({ token, userData, message , refreshToken });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
      }
    }
  }


  async getUser(req: Request, res: Response): Promise<void>{
    try {
      
      const userId:string = req.query.userId as string;

      const data = await findUser(userId);
      res.status(200).json(data);
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  }


  async UserLogout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("jwtToken");
      res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  }



  async createRefreshToken(req: Request, res: Response):Promise<void>{
    try {
     
      const { refreshToken } = req.body;
      
      const token = await createRefreshToken(refreshToken);
    
      res.status(200).json({ token });

    } catch (error) {
      console.error('Error refreshing token:', error);
      res.status(401).json({ message: 'Failed to refresh token' });
    }
  }





  async allUsers(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);
      const users = await getUsers(pageNumber, limitNumber, search.toString());
      res.status(200).json({ users, pageNumber });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "server error..." });
    }
  }




  async Toggleblock(req: Request, res: Response): Promise<void> {
    try {
      const userId: string | undefined = req.query.userId as string | undefined;
      if (!userId) {
        throw new Error("User ID is missing or invalid.");
      }

      await toggleUserBlock(userId);
      const User = await user.findById(userId);

      res.status(200).json({ message: "User block status updated." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  }



  async UserForgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const email = req.body.email;
      const user = await CheckExistingUSer(email);
      if (user) {
        const otp = await generateOtpForPassword(email);
        req.session.otp = {
          otp: otp,
          email: email,
          otpSetTimestamp: Date.now(),
        };
        res.status(200).json({ message: "OTP sent to email",email: email});
      } else {
        res.status(400).json({ error: "Email not Registered with us !!" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  }




  async VerifyOtpForPassword(req: Request, res: Response): Promise<void> {
    try {
      const ReceivedOtp = req.body.otp;
      const generatedOtp = req.session.otp?.otp;

      if (!req.session.otp) {
        throw new CustomError("OTP Expired.Try again.", 400);
      }

      if (ReceivedOtp === generatedOtp) {
        console.log("otp is correct , navigating user to update password.");
        res.status(200).json({ data: "otp is correct" });
      } else {
        throw new CustomError("Invalid OTP !!", 400);
      }
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
      }
    }
  }



  async ResetUserPassword(req: Request, res: Response): Promise<void> {
    try {
      const password = req.body.password;
      const confirmPassword = req.body.confirm_password;
      if (password === confirmPassword) {
        const email = req.session.otp.email;
        await ResetPassword(password, email);
        res.status(200).json({ message: "Password reset successfully." });
      } else {
        res.status(400).json({ error: "Passwords do not match." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }



  async ResendOtp(req: Request, res: Response): Promise<void> {
    try {
      
      const userData: UserSession | undefined = req.session.user;
      console.log("userData", userData);

      
      if (!userData) {
        res.status(400).json({ error: "Session data not found. Please sign up again." });
        console.log("no session data found");
        return;
      }
      const email = userData.email;
      const newOtp = await generateOtp(email);
      if (!email) {
        res.status(400).json({ error: "Email not found in session data." });
        return;
      }

      if (req.session.user) {
        req.session.user.otpCode = newOtp;
      } else {
        console.error("Session user data is unexpectedly undefined.");
        res.status(500).json({ message:"Server Error: Session user data is unexpectedly undefined." });
        return;
      }
      console.log("user session after resend" , req.session.user);
      res.status(200).json({ message: "New OTP sent to email" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }



  async UseGoogleLogin(req: Request, res: Response) {
    try {
      const decodeInfo = Jwt.decode(req.body.credential) as DecodedData | null;
      if (!decodeInfo) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      const { email, jti } = decodeInfo;
      const password = jti;
      const { token, userData, message } = await gLogin(email, password);
      req.session.user = userData._id;
      res.cookie("jwtToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      res.status(200).json({ token, userData, message });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
      }
    }
  }



  async UseGoogleRegister(req: Request, res: Response) {
    try {
      const token = req.body.credential;
      const decodedInfo = Jwt.decode(req.body.credential);

      const { name, email, jti }: DecodedData = decodedInfo as DecodedData;
      const user = await googleSignup(email, jti, name);
      if (user) {
        res.status(200).json({ message: "User account registered .." });
      }
    } catch (error) {
      res.status(400).json({ error: "User already exists" });
    }
  }



  async passwordResendOtp(req: Request, res: Response): Promise<void> {
    try {
      const otp: OTP | undefined = req.session.otp;
      if (!otp) {
        res
          .status(400)
          .json({ error: "Session data not found. Please sign up again." });
        return;
      }
      const email = otp.email;
      const newOtp = await generateOtp(email);
      if (req.session.otp) {
        req.session.otp.otp = newOtp;
      } else {
        console.error("session data is undefined..");
        res
          .status(500)
          .json({ message: "Server Error , session data is undefined.. " });
        return;
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }



  async AddFavVendor(req: Request, res: Response): Promise<void> {
    try {

      const vendorId: string = req.query.vendorId as string;
      const userId: string = req.query.userId as string;

      if (!vendorId) {
        res.status(400).json({ error: "Invalid vendor id." });
      }
      if (!userId) {
        res.status(400).json({ message: "Invalid user id." });
      }
    
      
      const data = await FavoriteVendor(vendorId, userId);

     
        res.status(200).json({ data: data});
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }

  async getFavoriteVendors(req: Request, res: Response): Promise<void>{
    try {
      const userId: string = req.query.userid as string;
      const page: number = parseInt(req.query.page as string) || 1; 
      const pageSize: number = parseInt(req.query.pageSize as string) || 8;

      if (!userId) {
        res.status(400).json({ error: "Invalid user id." });
      }
      const {favoriteVendors , totalFavVendorsCount} = await FavoriteVendors( userId , page, pageSize);
      const totalPages = Math.ceil(totalFavVendorsCount / pageSize);

      if (favoriteVendors) {
        res.status(200).json({ data:favoriteVendors ,totalPages:totalPages });
      } else {
        res.status(400).json({ message: "No vendors in favorites." });
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }

  async UpdatePasswordController(req: Request, res: Response): Promise<void> {
    
    try {

      const currentPassword = req.body.current_password;
      const newPassword = req.body.new_password;

      const userId: string = req.query.userid as string;


      let status = await checkCurrentPassword(currentPassword, userId);

      if (!status) {
        res.status(400).json({ error: `Current password doesn't match` });
        return;
      }      
      const data = await UpdatePasswordService(newPassword , userId);

      if(!data){
        res.status(400).json({error:"couldn't update password..internal error."})
      }
      res.status(200).json({message:"password updated successfully.."})

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }


  async UpdateProfileDetails(req: Request, res: Response): Promise<void> {
  try {
    const name = req.body.name;
    const phone = parseInt(req.body.phone);
    const userid:string = req.query.userid as string;

  
    let imageName = "";
    let imageUrl="";

    if (req.file) {
      const buffer = await sharp(req.file?.buffer)
        .resize({ height: 1200, width: 1200, fit: "contain" })
        .toBuffer();

        imageName = randomImage();

      const params = {
        Bucket: process.env.BUCKET_NAME!,
        Key: imageName,
        Body: buffer,
        ContentType: req.file?.mimetype,
      };

      const command2 = new PutObjectCommand(params);
      await s3.send(command2);


      const getObjectParams={
        Bucket: process.env.BUCKET_NAME!,
        Key:imageName
      }

      const command = new GetObjectCommand(getObjectParams);

      imageUrl = await getSignedUrl(s3, command , {
          expiresIn: 86400 * 3,
        });
      
    }


    const data = await UpdateUserProfile(userid, name, phone, imageName,imageUrl,);
    
    if(!data){
      res.status(400).json({error:`couldn't update details..try after soem time`});
    }
    res.status(200).json({message:"Profile details updated successfully" , data:data})
    
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
  }

  async MarkRead(req: Request, res: Response): Promise<void> {
    try {
      
      const userId:string  = req.query.userId as string;
      const notifiID:string = req.query.notifiId as string;
      const data  = await updateNotification(userId ,notifiID );
      if(data){
        res.status(200).json({data:data});
      }
    } catch (error) {
      res.status(500).json({message: "server error"});
    }

  }
};

export default new UserController();


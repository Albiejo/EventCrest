import { Request , Response } from "express";
import { signup , login , CheckExistingVendor , getVendors , toggleVendorBlock , getSingleVendor , ResetVendorPasswordService ,
  PushVendorReview,checkVendorCurrentPassword,changeVerifyStatus ,UpdateVendorPasswordService , updateVendorprof ,verificationRequest , addReviewReplyController ,
  createRefreshToken , updateNotification ,clearalldata} from "../Service/vendorService";


import generateOtp from "../Util/generateOtp";
import { CustomError } from "../Error/CustomError";
import { ObjectId } from "mongoose";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import { vendorSession } from "../util/Interfaces";
import { ErrorMessages } from "../Util/enums";
const sharp = require('sharp');


interface OTP {
  otp: string | undefined;
  email: string;
}

declare module "express-session" {
  interface Session {
    vendor: vendorSession | undefined;
    votp: OTP;
   
  }
}


const s3 = new S3Client({
  credentials: {
    accessKeyId:process.env.ACCESS_KEY!,
    secretAccessKey:process.env.SECRET_ACCESS_KEY!,
  },
  region:process.env.BUCKET_REGION!,
});



class VendorController{

  async vendorSignup(req: Request, res: Response): Promise<Response> {

    try {
      const { email , password , name , phone , city,vendor_type } = req.body;

      const otpCode = await generateOtp(email);
     
      if(otpCode !== undefined){
        req.session.vendor={
          email: email,
          password: password,
          name: name,
          phone: parseInt(phone),
          city:city,
          otpCode: otpCode,
          otpSetTimestamp: Date.now(),
          vendor_type:vendor_type
        }
      
    
    
      return res.status(200).json({ "message":"OTP send to vendor's email for verification.." , "email":email });   

      }else{

        console.log("couldn't generate otp, error occcured ,please fix !!");
        return res.status(500).json({ message: `Server Error couldn't generate otp, error occcured ,please fix !!` });
      }
    } catch (error) {
      if (error instanceof CustomError) {
        return  res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error(error);
        return res.status(500).json({ message: ErrorMessages.ServerError});
      }
    }
  }


  async createRefreshToken(req: Request, res: Response):Promise<Response>{
    try {
     
      const { refreshToken } = req.body;

      const token = await createRefreshToken(refreshToken);
      
      return res.status(200).json({ token });

    } catch (error) {
      console.error('Error refreshing token:', error);
      return res.status(401).json({ message: 'Failed to refresh token' });
    }
  }

      async VendorLogin(req:Request , res: Response): Promise <Response> {
        try {
            const {email,password} = req.body;
            const {refreshToken, token, vendorData, message } = await login(email, password);
            res.cookie('jwtToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            return  res.status(200).json({refreshToken , token, vendorData, message });
        } catch (error) {
          if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
          } else {
            console.error(error);
            return res.status(500).json({ message: ErrorMessages.ServerError});
          }
            
        }
      } 
    

      async VendorLogout(req:Request , res: Response): Promise <void> {
        try {
          res.clearCookie('jwtToken');
          res.status(200).json({ message: 'vendor logged out successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: ErrorMessages.ServerError});
            
        }
      }

      async verifyOtp(req:Request , res: Response):Promise<Response>{
        try {

          const otp = req.body.otp;
          const vendorData:vendorSession | undefined = req.session.vendor;

          if(!vendorData){
            return  res.status(400).json({ error: "Session data not found. Please sign up again." });
          
          }

          const email = vendorData.email;
          const password = vendorData.password;
          const name = vendorData.name;
          const phone = vendorData.phone;
          const city = vendorData.city;
          if (!vendorData.otpCode) {
            throw new CustomError("OTP Expired...Try again with new OTP !!", 400);
          }
          
          const otpCode = vendorData.otpCode
          const vendor_type=vendorData.vendor_type
          if(otp === otpCode){
           const vendor = await signup(email , password , name , phone , city,vendor_type);
           return  res.status(201).json({ "message" : "vendor created" });
          }else{
           return  res.status(400).json({ error:"Invalid otp !!"});
          }

        } catch (error) {
          if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
          } else {
            console.error(error);
            return res.status(500).json({ message: ErrorMessages.ServerError});
          }
        }
      }

      
      async VendorForgotPassword(req:Request , res: Response):Promise<void>{

        try {
          const email = req.body.email;
          const vendor = await CheckExistingVendor(email);
          if(vendor){
            const otp = await generateOtp(email);
            req.session.votp = {otp:otp ,email:email};
            res.status(200).json({ "message":"otp sent to vendor email for password updation request " , "email":email });
          }else{
            res.status(400).json({error:'Email not Registered with us !!'})            
          }
          
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: ErrorMessages.ServerError});
        }
      }


      async VerifyOtpForPassword(req:Request , res: Response):Promise<Response>{
        try {
          const ReceivedOtp = req.body.otp;
          const generatedOtp = req.session.votp?.otp;

          if (!req.session.votp) {
            throw new CustomError("OTP Expired.Try again.", 400);
          }

          if(ReceivedOtp === generatedOtp){
            console.log("otp is correct , navigating vendor to update password.");
            return res.status(200).json({data:"otp is correct, please update password now"})
          }else{
           throw new CustomError("Invalid OTP !!", 400);
          }
        } catch (error) {
          if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
          } else {
            console.error(error);
            return res.status(500).json({ message: ErrorMessages.ServerError});
          }
        }
      }

      async getAllVendors(req: Request, res: Response): Promise<Response>{
        try{
          
          const page: number = parseInt(req.query.page as string) || 1; 
          const search = req.query.search || ""; 
          const sortBy: string | null = req.query.sortBy as string | null;
          const pageSize: number = parseInt(req.query.pageSize as string) || 8; 
          let sortCriteria: string | null = null; 
          const category: string  = req.query.category as string 
          
         
          switch (sortBy) {
            case 'rating':
              sortCriteria = 'OverallRating'; 
              break;
            case '-rating':
              sortCriteria = '-OverallRating'; 
              break;
            default:
              break;
          }

          const { vendors, totalVendorsCount } = await getVendors(page, pageSize , search.toString(),sortCriteria ,category.toString());
          const totalPages = Math.ceil(totalVendorsCount / pageSize);


          return res.status(200).json({ vendors:vendors, totalPages:totalPages });
        }catch(error){
          console.log(error);
          return res.status(500).json({ message: ErrorMessages.ServerError});
        }
      } 

      async Toggleblock(req:Request , res: Response):Promise<Response>{
        try {
          const VendorId: string | undefined = req.query.VendorId as string | undefined;
          if (!VendorId) {
              throw new Error('Vendor ID is missing or invalid.');
          } 
          
          await toggleVendorBlock(VendorId);
          return res.status(200).json({ message: "vendor block status toggled successfully." });
      } catch (error) {
          console.log(error);
          return  res.status(500).json({ message: ErrorMessages.ServerError});
      }
      }


      async getVendor(req:Request , res: Response):Promise<Response>{
        try {
          const vendorId: string = req.query.Id as string; 
    
          if (!vendorId) {
            return res.status(400).json({ error: "Vendor ID is required." });
          }

          const data = await getSingleVendor(vendorId);
          if(!data){
            return res.status(400).json({error:'Vendor not found , error occured'})
          }else{
            return res.status(200).json({data:data})
          }
        } catch (error) {
          console.log(error);
         return res.status(500).json({ message: ErrorMessages.ServerError});
        }
      }

      async ResetVendorPassword(req:Request , res: Response):Promise<Response>{
        try {
         const password = req.body.password;
         const confirmPassword = req.body.confirmPassword;
             if(password === confirmPassword){
               const email=req.session.votp.email;
               const status = await ResetVendorPasswordService(password , email); 
               return res.status(200).json({ message: "Password reset successfully." });
             }else{
               return res.status(400).json({ error: "Passwords do not match." });
             }
        } catch (error) {
         console.error(error);
         return res.status(500).json({ message: ErrorMessages.ServerError});
        }
       }




       async addVendorReview(req:Request , res: Response):Promise<Response>{
        try {
          
          const content = req.body.content;
          const rating :number = req.body.rate as number;
          const {vendorid , username } = req.query;

          const status = await PushVendorReview(content,rating,username as string ,vendorid as string);
          if(!status){
            return res.status(400).json({error:`couldn't add reviews, some error occured`})
          }
           return res.status(200).json({message:"review added for vendor.."})
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: ErrorMessages.ServerError});
        }
       }



       async UpdateProfilePassword(req:Request , res: Response):Promise<Response>{
        try {
          
          const currentPassword = req.body.current_password;
          const newPassword = req.body.new_password;
          const vendorId: string = req.query.vendorid as string;

          let status = await checkVendorCurrentPassword(currentPassword, vendorId);

          if (!status) {
            throw new CustomError(`Current password doesn't match!` ,400);
          }      
      
      
          const data = await UpdateVendorPasswordService(newPassword , vendorId); 
          if(!data){ 
           return res.status(400).json({error:"couldn't update password..internal error."})
          }

          return res.status(200).json({message:"password updated successfully.."})
        } catch (error) {
          if (error instanceof CustomError) {
            return  res.status(error.statusCode).json({ message: error.message });
          } else {
            console.error(error);
            return  res.status(500).json({ message: ErrorMessages.ServerError});
          }
        }
       }
      

       async resendOtp(req: Request, res: Response): Promise<Response>{
               try {
                const vendorData: vendorSession | undefined = req.session.vendor;

                if (!vendorData) {
                  return res.status(400).json({ error: "Session data not found. Please sign up again." });
                  
                } 

                const email = vendorData.email;
                const newOtp = await generateOtp(email);

                if (!email) {
                  return res.status(400).json({ error: "Email not found in session data." });
                }

                if (req.session.vendor) {
                  req.session.vendor.otpCode = newOtp;
                } else {
                  console.error("Session vendor data is unexpectedly undefined.");
                  return res.status(500).json({ message:"Server Error: Session vendor data is unexpectedly undefined." });

                }
                
                return res.status(200).json({ message: "New OTP sent to email" });
               } catch (error) {
                console.error(error);
                return res.status(500).json({ message: ErrorMessages.ServerError});
               }                                                                                                                                                                  
       }


       async updateProfiledetails(req: Request, res: Response): Promise<void>{
        try {
          
          const vendorId: string = req.query.vendorid as string;
          const formData = req.body;
          
          let coverpicFile,coverpicUrl;
          let logoFile,logoUrl;

        
      if (req.files) {
        if (
          typeof req.files === "object" &&
          "coverpic" in req.files &&
          Array.isArray(req.files["coverpic"])
        ) {
          coverpicFile = req.files["coverpic"][0];
        }

        if (
          typeof req.files === "object" &&
          "logo" in req.files &&
          Array.isArray(req.files["logo"])
        ) {
          logoFile = req.files["logo"][0];
        }

        const resizedCoverpicBuffer = await sharp(coverpicFile?.buffer)
        .resize({ width: 1920, height: 1080, fit: 'cover' })
        .toBuffer();


        const coverpicUploadParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: coverpicFile?.originalname,
          Body: resizedCoverpicBuffer,
          ContentType: coverpicFile?.mimetype,
        };

        const covercommand = new PutObjectCommand(coverpicUploadParams);
        await s3.send(covercommand);

        const covercommand2 = new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME!,
          Key: coverpicFile?.originalname,
        });
        coverpicUrl = await getSignedUrl(s3, covercommand2, {
          expiresIn: 86400 * 3,
        });



        // Upload logo to S3
        const logoUploadParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: logoFile?.originalname,
          Body: logoFile?.buffer,
          ContentType: logoFile?.mimetype,
        };

        const logocommand = new PutObjectCommand(logoUploadParams);
        await s3.send(logocommand);

        const logocommand2 = new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME!,
          Key: logoFile?.originalname,
        });
        logoUrl = await getSignedUrl(s3, logocommand2, {
          expiresIn: 86400 * 3,
        });
      }
      
       

       const updatedVendor = await updateVendorprof(
        vendorId,
        formData,
        coverpicUrl,
        logoUrl,
        logoFile?.originalname,
        coverpicFile?.originalname
      );
    res.status(200).json(updatedVendor)
      } 
       catch (error) {
        console.error(error);
        res.status(500).json({ message: ErrorMessages.ServerError});
       }
      }



    async addReviewReply(req: Request, res: Response): Promise<Response>{
      try {
        const content=req.body.content
        const {vendorId , reviewId} = req.query;
        const vendorData=await addReviewReplyController(vendorId as string,content,reviewId as string)
        return res.status(200).json({vendorData:vendorData});
      } catch (error) {
        if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
        } else {
          console.error(error);
        return  res.status(500).json({ message: ErrorMessages.ServerError});
        }
    }
    
  }


  async sendVerifyRequest(req: Request, res: Response): Promise<void> {
    try {
      const vendorId:string=req.body.vendorId as string;
      const result=await verificationRequest(vendorId);
      res.status(200).json(result)
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: ErrorMessages.ServerError});
      }
    }
  }
    

  async updateVerifyStatus(req: Request, res: Response): Promise<Response> {
    try {
      const vendorId:string=req.body.vendorId as string;
      const status=req.body.status;
      const result=await changeVerifyStatus(vendorId,status)
      return  res.status(200).json({result,message:"Status updated successfully!"})
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error(error);
        return res.status(500).json({ message: ErrorMessages.ServerError});
      }
    }
  }


  async MarkasRead(req: Request, res: Response): Promise<void> {
    try {
      const {Id ,notifiId } = req.query;
      const data  = await updateNotification(Id as string,notifiId as string);
      if(data){
        res.status(200).json({data:data});
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ErrorMessages.ServerError});
    }
  }



  
  async clearAllNotifications(req: Request, res: Response): Promise<void>{
    try {
      const vendorid:string  = req.query.userId as string; 
      const data  = await clearalldata(vendorid)
      res.status(200).json(data)
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: ErrorMessages.ServerError});
      }
    }
  }
  
}

export default new VendorController();
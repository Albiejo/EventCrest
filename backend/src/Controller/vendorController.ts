import { Request , Response } from "express";
import { signup , login , CheckExistingVendor , getVendors , toggleVendorBlock , getSingleVendor , ResetVendorPasswordService ,
  PushFavoriteVendor,checkVendorCurrentPassword,changeVerifyStatus ,UpdateVendorPasswordService , updateVendorprof ,verificationRequest , addReviewReplyController ,
  createRefreshToken } from "../Service/vendorService";
import generateOtp from "../util/generateOtp";
import { CustomError } from "../Error/CustomError";
import { ObjectId } from "mongoose";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import { vendorSession } from "../util/Interfaces";


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

export const VendorController = {



  async vendorSignup(req: Request, res: Response): Promise<void> {

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
      
    
      console.log("vendor signup data stored in session :" ,req.session.vendor)
      res.status(200).json({ "message":"OTP send to vendor's email for verification.." , "email":email });   

      }else{

        console.log("couldn't generate otp, error occcured ,please fix !!");
        res.status(500).json({ message: `Server Error couldn't generate otp, error occcured ,please fix !!` });
      }
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
      }
    }
  },


  async createRefreshToken(req: Request, res: Response):Promise<void>{
    try {
     
      const { refreshToken } = req.body;

      const token = await createRefreshToken(refreshToken);
      
      res.status(200).json({ token });

    } catch (error) {
      console.error('Error refreshing token:', error);
      res.status(401).json({ message: 'Failed to refresh token' });
    }
  },

      async VendorLogin(req:Request , res: Response): Promise <void> {
        try {
            const {email,password} = req.body;
            const {refreshToken, token, vendorData, message } = await login(email, password);
            res.cookie('jwtToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            res.status(200).json({refreshToken , token, vendorData, message });
        } catch (error) {
          if (error instanceof CustomError) {
            res.status(error.statusCode).json({ message: error.message });
          } else {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
          }
            
        }
      } ,
    

      async VendorLogout(req:Request , res: Response): Promise <void> {
        try {
          res.clearCookie('jwtToken');
          res.status(200).json({ message: 'vendor logged out successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({message:"Server Error"})
            
        }
      },

      async verifyOtp(req:Request , res: Response):Promise<void>{
        try {

          const otp = req.body.otp;
          const vendorData:vendorSession | undefined = req.session.vendor;

          if(!vendorData){
            res.status(400).json({ error: "Session data not found. Please sign up again." });
          return;
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
          res.status(201).json({ "message" : "vendor created" });
          }else{
            res.status(400).json({ error:"Invalid otp !!"});
          }

        } catch (error) {
          if (error instanceof CustomError) {
            res.status(error.statusCode).json({ message: error.message });
          } else {
            console.error(error);
            res.status(500).json({ message: "Server Error" });
          }
        }
      },

      
      async VendorForgotPassword(req:Request , res: Response):Promise<void>{

        try {
          const email = req.body.email;
          const vendor = await CheckExistingVendor(email);
          if(vendor){
            const otp = await generateOtp(email);
            req.session.votp = {otp:otp ,email:email};
            console.log("session data for password reset:",req.session.votp);
            res.status(200).json({ "message":"otp sent to vendor email for password updation request " , "email":email });
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
          const generatedOtp = req.session.votp?.otp;

          if (!req.session.votp) {
            throw new CustomError("OTP Expired.Try again.", 400);
          }

          if(ReceivedOtp === generatedOtp){
            console.log("otp is correct , navigating vendor to update password.");
            res.status(200).json({data:"otp is correct, please update password now"})
          }else{
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
      },

      async getAllVendors(req: Request, res: Response): Promise<void>{
        try{
          const page: number = parseInt(req.query.page as string) || 1; // Default to page 1 if not provided
          const pageSize: number = parseInt(req.query.pageSize as string) || 8; // Default page size

          const { vendors, totalVendorsCount } = await getVendors(page, pageSize);
          const totalPages = Math.ceil(totalVendorsCount / pageSize);
  
         
          res.status(200).json({ vendors:vendors, totalPages:totalPages });
        }catch(error){
          console.log(error);
          res.status(500).json({ message: "server error..." });
        }
      } ,

      async Toggleblock(req:Request , res: Response):Promise<void>{
        try {
          const VendorId: string | undefined = req.query.VendorId as string | undefined;
          if (!VendorId) {
              throw new Error('Vendor ID is missing or invalid.');
          } 
          
          await toggleVendorBlock(VendorId);
          res.status(200).json({ message: "vendor block status toggled successfully." });
      } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Server Error" });
      }
      },


      async getVendor(req:Request , res: Response):Promise<void>{
        try {
          const vendorId: string = req.query.Id as string; // or req.query.Id?.toString()
    
          if (!vendorId) {
            res.status(400).json({ error: "Vendor ID is required." });
            return;
          }

          const data = await getSingleVendor(vendorId);
          if(!data){
            res.status(400).json({error:'Vendor not found , error occured'})
          }else{
            res.status(200).json({data:data})
          }
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Server Error" });
        }
      },

      async ResetVendorPassword(req:Request , res: Response):Promise<void>{
        
        try {
         const password = req.body.password;
         const confirmPassword = req.body.confirmPassword;
             if(password === confirmPassword){
              console.log("session data for password reset:",req.session.votp);
              
               const email=req.session.votp.email;;
               const status = await ResetVendorPasswordService(password , email); 
               res.status(200).json({ message: "Password reset successfully." });
             }else{
               res.status(400).json({ error: "Passwords do not match." });
             }
        } catch (error) {
         console.error(error);
         res.status(500).json({ message: "Server Error" });
        }
       },




       async addVendorReview(req:Request , res: Response):Promise<void>{
        try {
          
          const content = req.body.content;
          const rating :number = req.body.rate as number;
          let username :string | undefined = req.query.username as string | undefined;
          const vendorid :string=req.query.vendorid as string;
          if(username===undefined){
            username="GuestUser"
          }
          const status = await PushFavoriteVendor(content,rating,username,vendorid);
          if(!status){
            res.status(400).json({error:`couldn't add reviews, some error occured`})
          }
          res.status(200).json({message:"review added for vendor.."})
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Server Error" });
        }
       },



       async UpdateProfilePassword(req:Request , res: Response):Promise<void>{
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
            res.status(400).json({error:"couldn't update password..internal error."})
          }

          res.status(200).json({message:"password updated successfully.."})
        } catch (error) {
          if (error instanceof CustomError) {
            res.status(error.statusCode).json({ message: error.message });
          } else {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
          }
        }
       },
      

       async resendOtp(req: Request, res: Response): Promise<void>{
               try {
                const vendorData: vendorSession | undefined = req.session.vendor;
                console.log("vendordata", vendorData);

                if (!vendorData) {
                  res.status(400).json({ error: "Session data not found. Please sign up again." });
                  console.log("no session data found");
                  return;
                } 

                const email = vendorData.email;
                const newOtp = await generateOtp(email);

                if (!email) {
                  res.status(400).json({ error: "Email not found in session data." });
                  return;
                }

                if (req.session.vendor) {
                  req.session.vendor.otpCode = newOtp;
                } else {
                  console.error("Session vendor data is unexpectedly undefined.");
                  res.status(500).json({ message:"Server Error: Session vendor data is unexpectedly undefined." });
                  return;
                }
                console.log("vendor session after resend" , req.session.vendor);
                res.status(200).json({ message: "New OTP sent to email" });
               } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Server Error" });
               }                                                                                                                                                                  
       },


       async updateProfiledetails(req: Request, res: Response): Promise<void>{
        try {
          
          const vendorId: string = req.query.vendorid as string;
          const formData = req.body;

          
          let coverpicFile,coverpicUrl;
          let logoFile,logoUrl;

      console.log("before re.files");
        
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

        const coverpicUploadParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: coverpicFile?.originalname,
          Body: coverpicFile?.buffer,
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
      
       console.log("after re.files");

       const updatedVendor = await updateVendorprof(
        vendorId,
        formData,
        coverpicUrl,
        logoUrl,
        logoFile?.originalname,
        coverpicFile?.originalname
      );
    console.log("after service updated" , updatedVendor);

    res.status(200).json(updatedVendor)

      } 
       catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
       }
      },



    async addReviewReply(req: Request, res: Response): Promise<void>{
      try {
        const vendorId:string=req.query.vendorId as string;
        const reviewId:string=req.query.reviewId as string;
        const content=req.body.content
        
        const vendorData=await addReviewReplyController(vendorId,content,reviewId)
        res.status(200).json({vendorData:vendorData});
      } catch (error) {
        if (error instanceof CustomError) {
          res.status(error.statusCode).json({ message: error.message });
        } else {
          console.error(error);
          res.status(500).json({ message: "Server Error" });
        }
    }
    
  },


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
        res.status(500).json({ message: "Server Error" });
      }
    }
  },
    

  async updateVerifyStatus(req: Request, res: Response): Promise<void> {
    try {
      const vendorId:string=req.body.vendorId as string;
      const status=req.body.status;
      const result=await changeVerifyStatus(vendorId,status)
      res.status(200).json({result,message:"Status updated successfully!"})
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
      }
    }
  },
  
}


import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createVendor , findvendorByEmail ,updateVerificationStatus, getTotalVendorsCount,findAllVendors ,UpdateVendorPassword ,AddVendorReview,findVerndorId , updateVendorprofData  , addReviewReplyById , requestForVerification} from '../Repository/vendorRepository';
import { ObjectId } from 'mongoose';
import vendor , { VendorDocument } from '../Model/vendor';
import { findVerndorIdByType } from '../Repository/vendorTypeRepository';
import { CustomError } from '../Error/CustomError';

interface LoginResponse {
  token: string;
  vendorData: object; 
  message: string;
  refreshToken:string
}

export const signup = async (email:string ,password:string, name:string , phone:number, city:string,vendor_type:string): Promise<string> => {
    try {
      const existingVendor = await findvendorByEmail(email);
      if (existingVendor) {
        throw new Error('vendor already exists');
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const isActive:boolean = true;
      const isVerified:boolean=false;
      const verificationRequest:boolean=false;
      const totalBooking:number=0;

      const vendorType=await findVerndorIdByType(vendor_type);

      const newVendor = await createVendor({ email , password: hashedPassword , name , phone , city , isActive , isVerified , verificationRequest , totalBooking ,vendor_type:vendorType?._id});
  
      return "vendor created";

    } catch (error) {
      throw error;
    }
  };




  export const login = async (email:string , password : string): Promise<LoginResponse> =>{
    try {
        const existingVendor = await findvendorByEmail(email);
        if (!existingVendor) {
          throw new CustomError('Vendor not exists..', 404);
        }
        if(!existingVendor.isActive){
          throw new CustomError(`Vendor is Blocked, can't login`, 401);
        }
    
        const passwordMatch = await bcrypt.compare( password, existingVendor.password);

        if (!passwordMatch) {
          throw new CustomError('Incorrect password..', 401);
        }

        const vendorData = await findvendorByEmail(email);

        // If the password matches, generate and return a JWT token
        const token = jwt.sign({ _id: existingVendor._id }, process.env.JWT_SECRET!, { expiresIn: "1h"});

        let refreshToken = existingVendor.refreshToken;

   
        if (!refreshToken) {
         
          refreshToken = jwt.sign({ _id: existingVendor._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
        }
    
    
        existingVendor.refreshToken = refreshToken;
        await existingVendor.save();

        return {refreshToken , token,vendorData:existingVendor,message:"Successfully logged in.."};
        
      } catch (error) {
        throw error;
      }
}


export const CheckExistingVendor = async(email:string)=>{
  try {
    const existingVendor = await findvendorByEmail(email);
    return existingVendor;
  } catch (error) {
    throw error
  }
}



export const createRefreshToken = async (refreshToken:string)=>{
  try {

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { _id: string };
    const Vendor = await vendor.findById(decoded._id);

    if (!Vendor || Vendor.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

    const accessToken = jwt.sign({ _id: Vendor._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    return accessToken;

  } catch (error) {
    
  }
}


export const getVendors=async(page: number, pageSize: number)=>{
  try {
    const vendors=await findAllVendors(page ,pageSize);
    const totalVendorsCount = await getTotalVendorsCount();
    return { vendors, totalVendorsCount };
  } catch (error) {
    throw error;
  }
}



export const toggleVendorBlock = async(vendorId:string): Promise<void> =>{
  try {
    const Vendor = await vendor.findById(vendorId)
    if (!Vendor) {
        throw new Error('Vendor not found');
    }
    
    Vendor.isActive = !Vendor.isActive; // Toggle the isActive field
    await Vendor.save();
} catch (error) {
    throw error;
}

}



export const getSingleVendor = async(vendorId:string): Promise<VendorDocument> =>{
  try {
    const Vendor = await vendor.findById(vendorId)
    if (!Vendor) {
        throw new Error('Vendor not found');
    }
   return Vendor;
} catch (error) {
    throw error;
}

}


export const ResetVendorPasswordService = async(password:string , email:string)=>{
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const status = await UpdateVendorPassword(hashedPassword , email);
    if(!status.success){
      throw new Error(status.message)
    }
  } catch (error) {
    throw error;
  }
}


export const PushFavoriteVendor = async(content:string , rating:number , username:string , vendorid:string)=>{
  try {
    const data = await AddVendorReview(content , rating, username , vendorid)
    return  data;
  } catch (error) {
    throw error;
  }
}





export const checkVendorCurrentPassword= async(Currentpassword:string , vendorid:string)=>{
try {
    const existingVendor = await findVerndorId(vendorid);
  
    if(!existingVendor){
      throw new CustomError("Vendor not found",404)
    }

    const passwordMatch = await bcrypt.compare( Currentpassword, existingVendor.password);

    
    if (!passwordMatch) {
      throw new CustomError("Password doesn't match",401)
    }

    return passwordMatch; 
} catch (error) {
  throw error;
}
}


 


export const UpdateVendorPasswordService=async(newPassword:string , vendorid:string)=>{

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const existingVendor = await findVerndorId(vendorid);
    if(!existingVendor){
      throw new CustomError("user not found",404)
    }
    const email = existingVendor.email;

    const updatedValue = await UpdateVendorPassword(hashedPassword , email);
    if(updatedValue){
      return true;
    }
    return false
  } catch (error) {
    
  }
}

export const updateVendorprof=async(vendorId: string, formData: any, coverpicUrl: string|undefined, logoUrl: string|undefined,logo:string|undefined,coverpic:string|undefined): Promise<any> =>{
  try {
    console.log("inside update service");
    
    await updateVendorprofData(vendorId, formData, coverpicUrl, logoUrl,logo,coverpic);
   
    const updatedVendor = await findVerndorId(vendorId);

    return updatedVendor;
} catch (error) {
    throw new Error('Failed to update vendor data');
}
}



export const addReviewReplyController=async(vendorId:string,content:string,reviewId:string): Promise<any>=>{
  try {
    const vendordata=await addReviewReplyById(vendorId,content,reviewId)
    return vendordata;
  } catch (error) {
    throw error
  }
}



export const  verificationRequest=async(vendorId:string)=>{
  try {
    const data=await requestForVerification(vendorId)
    return data
  } catch (error) {
    
  }
}


export async function changeVerifyStatus(vendorId:string,status:string){
  try {
    const data=await updateVerificationStatus(vendorId,status)
    return data
  } catch (error) {
    
  }
}
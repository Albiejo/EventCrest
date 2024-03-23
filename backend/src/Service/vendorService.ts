import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createVendor , findvendorByEmail , findAllVendors ,UpdateVendorPassword ,AddVendorReview,findVerndorId } from '../Repository/vendorRepository';
import { ObjectId } from 'mongoose';
import vendor , { VendorDocument } from '../Model/vendor';
import { findVerndorIdByType } from '../Repository/vendorTypeRepository';
import { CustomError } from '../Error/CustomError';

interface LoginResponse {
  token: string;
  vendorData: object; 
  message: string;
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
  
      const token = jwt.sign({ _id: newVendor._id }, process.env.JWT_SECRET!);
     
      return token;

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
        const token = jwt.sign({ _id: existingVendor._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        return {token,vendorData:existingVendor,message:"Successfully logged in.."};
        
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



export const getVendors=async()=>{
  try {
    const vendors=await findAllVendors();
    return vendors;
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

const CheckPasswordMatch=()=>{
  
}
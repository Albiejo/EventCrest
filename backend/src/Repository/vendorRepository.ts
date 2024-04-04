import Vendor , {VendorDocument , Review} from "../Model/vendor";
import { CustomError } from "../Error/CustomError";
import mongoose from "mongoose";

export const createVendor = async (vendorData : Partial<VendorDocument>): Promise<VendorDocument> => {
    try {
      return await Vendor.create(vendorData);
    } catch (error) {
      throw error;
    }
  };


export const findvendorByEmail = async (email: string): Promise<VendorDocument | null> => {
    try {
      return await Vendor.findOne({ email });
    } catch (error) {
      throw error;
    }
};



export const findAllVendors = async (): Promise<VendorDocument[] | null> => {
  try {
    return await Vendor.find({}).exec();
  } catch (error) {
    throw error;
  }
};


export const UpdateVendorPassword = async(password:string , mail:string) =>{
  try {
    const result = await Vendor.updateOne({ email: mail }, { password: password });
    if (result.modifiedCount === 1) {
      return { success: true, message: "Vendor Password updated successfully." };
    } else {
      return { success: false, message: "Vendor not found or password not updated." };
    }
  } catch (error) {
    throw error;
  }
}


export const AddVendorReview = async(content: string, rating: number, username: string, vendorId: string)=>{
 try {
    const vendorData = await Vendor.findById(vendorId);
      if (!vendorData) {
        throw new Error('Vendor not found');
      }
    const reviewId = new mongoose.Types.ObjectId();
    vendorData.reviews.push({
      _id: reviewId,
      content,rating,username,
      date: new Date(),
      reply:[]
    });

    await vendorData.save();
    return true;
 } catch (error) {
   throw error;
 }
}

export const findVerndorId= async(vendorid:string):Promise<VendorDocument | null>=>{
  try {
    return await Vendor.findById( vendorid );
  } catch (error) {
    throw error;
  }
}


export const updateVendorprofData=async(vendorId: string, formData: any, coverpicUrl: string|undefined, logoUrl: string|undefined,logo:string|undefined,coverpic:string|undefined): Promise<void>=>{
  try {
    
      const update = {
        name:formData.name,
        city:formData.city,
        phone:parseInt(formData.phone),
        about:formData.about,
        coverpicUrl: coverpicUrl,
        logoUrl: logoUrl,
        logo: logo,
        coverpic: coverpic
      };
  
      // Use the $set operator to update the document
      await Vendor.updateOne({ _id: vendorId }, { $set: update });
       
    
    
  } catch (error) {
      throw new Error('Failed to update vendor data');
  }
}


export const addReviewReplyById = async(vendorId: string, content: string, reviewId: string)=>{
  try {
   
    const vendorData = await Vendor.findById(vendorId);
    if (!vendorData) {
      console.log('Vendor not found')
      throw new CustomError('Vendor not found', 404);
    }
    const review = vendorData.reviews.find((review: Review) => review._id.toString() === reviewId);
  
    if (!review) {
      console.log('Review not found')
      throw new CustomError('Review not found', 404);
    }
    const result = await Vendor.findByIdAndUpdate(
      vendorId,
      { $push: { 'reviews.$[review].reply': content } },
      {
        arrayFilters: [{ 'review._id': { $eq: new mongoose.Types.ObjectId(reviewId) } }],
        new: true 
      }
    );
   
   const newvendordata = await Vendor.findById(vendorId);
   return newvendordata;
  } catch (error) {
    throw new Error('Failed to add reply');
  }
}
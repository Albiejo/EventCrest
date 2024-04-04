import User, { UserDocument } from "../Model/user";
import { Document } from "mongoose";
import vendor from "../Model/vendor";
import mongoose from 'mongoose';




export const createUser = async (
  userData: Partial<UserDocument>
): Promise<UserDocument> => {
  try {
    return await User.create(userData);
  } catch (error) {
    throw error;
  }
};




export const findUserByEmail = async (
  email: string
): Promise<UserDocument | null> => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    throw error;
  }
};




export const findUserById = async (
  userId: string
): Promise<UserDocument | null> => {
  try {
    return await User.findById( userId );
  } catch (error) {
    throw error;
  }
};


export const findbyIdandUpdate = async( userId: string , refreshToken:string):Promise<UserDocument | null> =>{
  try {
    return await User.findByIdAndUpdate({_id:userId},{$set:{refreshToken:refreshToken}});

  } catch (error) {
    throw error;
  }
}



const UpdateUserPassword=async(password:string , userid:string)=>{
try {
  
} catch (error) {
  throw error;
}
}




export const findAllUsers = async (
  page: number,
  limit: number,
  search: string
): Promise<Document[] | null> => {
  try {
    let query: any = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    return users;
  } catch (error) {
    throw error;
  }
};

export const UpdatePassword = async (password: string, mail: string) => {
  try {
    const result = await User.updateOne(
      { email: mail },
      { password: password }
    );
    if (result.modifiedCount === 1) {
      return { success: true, message: "Password updated successfully." };
    } else {
      return {
        success: false,
        message: "User not found or password not updated.",
      };
    }
  } catch (error) {
    throw error;
  }
};


export const addVendorToFavorites = async (
  userId: string,
  vendorId: string
) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    if (user.favorite.includes(vendorId)) {
      return false; // Vendor already in favorites
    }

    user.favorite.push(vendorId);
    await user.save();

    return true;
  } catch (error) {
    console.error("Error in addVendorToFavorites repository:", error);
    throw new Error("Failed to add vendor to favorites.");
  }
};




export const UpdateUserProfileDetails = async(userId:string , name:string , phone:number,image:string,imageUrl:string)=>{
  try {

    const userData = await User.findOne({ _id:userId});
    
    const update = {
      name:"",
      phone:0,
      image:"",
      imageUrl:""
    };
    if (name) {
      update.name = name;
    } else if (userData?.name) {
      update.name = userData?.name;
    }
    if (phone) {
      update.phone = phone;
    } else if (userData?.phone) {
      update.phone = userData?.phone;
    }
    if (image) {
      update.image = image;
    } else if (userData?.image) {
      update.image = userData?.image;
    }
    if (imageUrl) {
      update.imageUrl = imageUrl;
    } else if (userData?.imageUrl) {
      update.imageUrl = userData.imageUrl;
    }
    const result = await User.updateOne({ _id: userId }, { $set: update });
    const NewUserData = await User.findOne({ _id: userId});
    if (result.modifiedCount === 1) {
      return {NewUserData:NewUserData };
    } else {
      return false
    }
  } catch (error) {
    console.error("Error in updating profile", error);
    throw new Error("Failed to update user Profile..");
  }
}


export const getfavVendors=async( userid:string)=>{
try {
  const userData = await User.findById(userid);
  if (!userData) {
    throw new Error('User not found');
  }

  const favoriteVendorIds = userData.favorite;

  if (!favoriteVendorIds || favoriteVendorIds.length === 0) {
    throw new Error('No favorite vendors found for this user');
  }

  const favoriteVendors = await vendor.find({ _id: { $in: favoriteVendorIds } });

  return favoriteVendors;
  
} catch (error) {
 throw error; 
}
}
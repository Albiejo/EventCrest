import User, { UserDocument } from "../Model/user";
import { Document } from "mongoose";

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
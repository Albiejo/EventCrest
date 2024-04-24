import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findAdminByEmail , updateNotificationstatus ,getdata} from "../Repository/adminRepository";
import admin from "../Model/Admin";

interface LoginResponse {
    token: string;
    adminData: object; 
    message: string;
    refreshToken:string;

  }

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const existingAdmin = await findAdminByEmail(email);
    if (!existingAdmin) {
      throw new CustomError('Admin not exists..', 404);
    }

    const passwordMatch = await bcrypt.compare(password, existingAdmin.password);
    if (!passwordMatch) {
      throw new CustomError('Incorrect password..', 404);
    }

    let refreshToken = existingAdmin.refreshToken;

   
    if (!refreshToken) {
     
      refreshToken = jwt.sign({ _id: existingAdmin._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
    }


    existingAdmin.refreshToken = refreshToken;
    await existingAdmin.save();

    const token = jwt.sign({ _id: existingAdmin._id }, process.env.JWT_SECRET!, { expiresIn: '24h'});

    return {refreshToken , token, adminData: existingAdmin, message: "Successfully logged in.." };
  } catch (error) {
    throw error;
  }
};



export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}


export const createRefreshTokenAdmin = async (refreshToken:string)=>{
  try {

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { _id: string };
    const Admin = await admin.findById(decoded._id);

    if (!Admin || Admin.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

    const accessToken = jwt.sign({ _id: Admin._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    return accessToken;

  } catch (error) {
    
  }
}


export const updateNotification = async(adminId:string ,notifiID:string ):Promise<object>=>{
  try {
 
    const data = await updateNotificationstatus(adminId ,notifiID)
    return data
  } catch (error) {
    throw error;
  }
}

export const findadmindetails = async ()=>{
  try {
    const data  = await getdata();
    return data;
  } catch (error) {
    throw error;
  }
}
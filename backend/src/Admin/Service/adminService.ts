import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findAdminByEmail} from "../Repository/adminRepository";
import { CustomError } from "../Controller/adminController";


interface LoginResponse {
    token: string;
    adminData: object; 
    message: string;
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
    const token = jwt.sign({ _id: existingAdmin._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return { token, adminData: existingAdmin, message: "Successfully logged in.." };
  } catch (error) {
    throw error;
  }
};




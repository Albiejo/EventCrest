import { Request, Response } from "express";
import { login , createRefreshTokenAdmin ,updateNotification , findadmindetails} from "../Service/adminService";
import { CustomError } from "../Error/CustomError";
import { ErrorMessages } from "../Util/enums";




class AdminController {
  
  async Adminlogin(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const {refreshToken ,  token, adminData, message } = await login(email, password);
      
      res.cookie('jwtToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      return res.status(200).json({token, refreshToken , adminData, message });
      
    } catch (error) {
      if (error instanceof CustomError) {
        return  res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error(error);
        return  res.status(500).json({ message: ErrorMessages.ServerError });
      }
    }
  }

  async Adminlogout(req: Request, res: Response): Promise<Response> {
    try {
      res.clearCookie('jwtToken');
      return  res.status(200).json({ message: "admin logged out successfully.." });
    } catch (error) {
      console.log(error);
      return   res.status(500).json({ message:  ErrorMessages.ServerError });
    }
  }


  async createRefreshToken(req: Request, res: Response):Promise<Response>{
    try {
     
      const { refreshToken } = req.body;

      const token = await createRefreshTokenAdmin(refreshToken);
      
      return  res.status(200).json({ token });
    } catch (error) {
      console.error('Error refreshing token:', error);
      return res.status(401).json({ message:  ErrorMessages.TokenRefreshError  });
    }
  }
  

  async MarkasRead(req: Request, res: Response):Promise<Response>{
    try {
      const {id ,notifid} = req.query;
      const data  = await updateNotification(id as string,notifid as string);
      return res.status(200).json({data:data});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message:  ErrorMessages.ServerError  });
    }
  }


  async getFulldetails (req: Request, res: Response):Promise<Response>{
    try {
      
      const data = await findadmindetails();
      return res.status(200).json({data:data});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message:  ErrorMessages.ServerError  });
    }
  }
  
};


export default new AdminController();




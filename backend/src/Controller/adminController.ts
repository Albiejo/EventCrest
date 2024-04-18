import { Request, Response } from "express";
import { login , createRefreshTokenAdmin ,updateNotification} from "../Service/adminService";
import { CustomError } from "../Error/CustomError";





class AdminController {
  
  async Adminlogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const {refreshToken ,  token, adminData, message } = await login(email, password);
      
      res.cookie('jwtToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      res.status(200).json({token, refreshToken , adminData, message });
      
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    }
  }

  async Adminlogout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie('jwtToken');
      res.status(200).json({ message: "admin logged out successfully.." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "server error..." });
    }
  }


  async createRefreshToken(req: Request, res: Response):Promise<void>{
    try {
     
      const { refreshToken } = req.body;

      const token = await createRefreshTokenAdmin(refreshToken);
      
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error refreshing token:', error);
      res.status(401).json({ message: 'Failed to refresh token' });
    }
  }
  

  async MarkasRead(req: Request, res: Response):Promise<void>{

    try {
      const adminId:string  = req.query.id as string;
      const notifiID:string = req.query.notifid as string;
      
      const data  = await updateNotification(adminId ,notifiID );
      if(data){
        res.status(200).json({data:data});
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "server error..." });
    }
  }
  
};


export default new AdminController();





import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import  dotenv from 'dotenv';
dotenv.config()


interface UserRequest extends Request {
  user?: any; 
}




export default function (req: Request, res: Response, next: NextFunction){
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      // req.user = decoded;
      next();
    });
}








export const refreshToken = (req: Request, res: Response, next: NextFunction) => {
 
};



  
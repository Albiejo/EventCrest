import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


interface AuthenticatedRequest extends Request {
  Vendor?: any;
}

export default function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  // Extract token from header string (Bearer <token>)
  const accessToken = token.split(' ')[1];

  jwt.verify(accessToken, process.env.JWT_SECRET!, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    // Attach the decoded user information to the request object
    req.Vendor = decoded;
    next();
  });
}

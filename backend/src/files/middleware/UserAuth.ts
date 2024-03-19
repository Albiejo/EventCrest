
import { Request, Response, NextFunction } from 'express';
import user from '../../User/Model/user';
import jwt from 'jsonwebtoken';

export default async function isBlocked(req: Request, res: Response, next: NextFunction) {
   
    try {
        const userId:string | undefined = req.query.userId as string | undefined;

        if (!userId) {
            return res.status(400).json({ message: "Invalid user Id" });
          }
        
        
        const User = await user.findById(userId);

        if (!User) {
            return res.status(404).json({ message: "User not found" });
          }

        if (!User.isActive) {
            res.clearCookie("jwtToken");
            return res.status(401).json({ message: "User is blocked" }); // Return 401 status to indicate blocked user
          }
          
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }

}

  
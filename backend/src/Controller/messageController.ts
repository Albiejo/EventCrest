import { Request, Response } from "express";
import messageModel from '../Model/MessageModel';
import { ErrorMessages } from "../Util/enums";




class messageController{


    async createMessage (req: Request, res: Response):Promise<void>{

        const {conversationId , senderId , text } = req.body;
    
        const message = new messageModel({
            conversationId,
            senderId,
            text
        })   
        try {
            const response = await message.save();
            res.status(200).json(response);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message:ErrorMessages.ServerError });
        }
    }



    async getMessages (req: Request, res: Response):Promise<Response>{
        const conversationId = req.query.conversationId;
        try {
            const messages = await messageModel.find({conversationId: conversationId});
            return res.status(200).json(messages);
        } catch (error) {
            console.log(error);
            return  res.status(500).json({ message: ErrorMessages.ServerError});
            
        }
    }


}

export default new messageController();



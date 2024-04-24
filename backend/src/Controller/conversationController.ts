import ConversationModel from '../Model/Conversation';
import { Request, Response } from "express";
import { ErrorMessages } from '../Util/enums';




class conversationController{

  
  async createChat(req: Request, res: Response): Promise<Response>{

    const {senderId , receiverId} = req.body;
   
    try {
      let chat = await ConversationModel.findOne({ members: [senderId, receiverId] });
      if (!chat) {
        const newChat = new ConversationModel({ members: [senderId, receiverId] });
        chat = await newChat.save();
      }
     return res.status(200).json(chat);
    } catch (error) {
      console.log(error);
      return  res.status(500).json({ message:ErrorMessages.ServerError });
    }
}




  async findUserchats(req: Request, res: Response):Promise<Response>{

    let userId  = req.query.userId;

    try {
        const chats  = await ConversationModel.find({members:{$in :[userId]}})
        
        return res.status(200).json(chats);
    } catch (error) {
        console.log(error);
        return  res.status(500).json({ message:ErrorMessages.ServerError});
    }

}

};

export default new conversationController();













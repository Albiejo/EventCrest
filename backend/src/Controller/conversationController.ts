import ConversationModel from '../Model/Conversation';
import { Request, Response } from "express";
import { ErrorMessages } from '../Util/enums';




class conversationController{

  
  async createChat(req: Request, res: Response): Promise<Response>{

    const {senderId , receiverId} = req.body;
    console.log("sender id",typeof senderId);
    console.log("receiver id",typeof receiverId);
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

    const {userId , search}  = req.query;
    console.log("search",search)
    try {

      let chats;

      if (search) { 
        // chats = await ConversationModel.find({ members: { $in: [userId] } }).populate('members');

     
        // chats = chats.map(chat => {
        //     chat.members = chat.members.filter(member => member._id.toString() !== userId);
        //     return chat;
        // });

       
        // chats = chats.filter(chat => chat.members.some(member => member.name.includes(search)));
    }  else {
        chats = await ConversationModel.find({ members: { $in: [userId] } });
    }
        return res.status(200).json(chats);
    } catch (error) {
        console.log(error);
        return  res.status(500).json({ message:ErrorMessages.ServerError});
    }

}


};

export default new conversationController();













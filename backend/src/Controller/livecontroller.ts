import { Request, Response } from "express";
import { CustomError } from "../Error/CustomError";
import { addNewLive, changeStatus, getAllLive } from "../Service/liveService";

class LiveController{

  async getLive(req: Request, res: Response): Promise<Response> {

    try {
      const data = await getAllLive();
      console.log("data",data);
      return res.status(200).json({ live: data });
    } catch (error) {
      if (error instanceof CustomError) {
        return  res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error(error);
        return  res.status(500).json({ message: "Server Error" });
      }
    }
  }


  
  async addLive(req: Request, res: Response): Promise<Response> {
    try {
      console.log("inside live controller 2 and adding live to db")
      const { url } = req.body;
      const data = await addNewLive(url);
      return res.status(200).json({ live: data });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error(error);
        return  res.status(500).json({ message: "Server Error" });
      }
    }
  }


  async changeLiveStatus(req: Request, res: Response): Promise<Response> {
    try {
      console.log("inside live controller 3")
      const { url } = req.body;
      console.log(url)
      const data = await changeStatus(url);
      return res.status(200).json({ live: data });
    } catch (error) {
      if (error instanceof CustomError) {
        return   res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
      }
    }
  }
};

export default new LiveController();
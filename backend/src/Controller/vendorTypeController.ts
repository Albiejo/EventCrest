import { Request, Response } from "express";
import {
  addType,
  getTypes,
  deleteVendorType,
  getSingleVendordata,
  updateVendorType
} from "../Service/vendorTypeService";
import { ErrorMessages } from "../Util/enums";






class VendorTypeController  {



  async addVendorType(req: Request, res: Response): Promise<Response> {
    try {
      let { type, status } = req.body;
      const vendor = await addType(type, status);
      return res.status(201).json(vendor);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: ErrorMessages.ServerError});
    }
  }

  async getVendorTypes(req: Request, res: Response): Promise<Response> {
    try {
      const vendorTypes = await getTypes();
      return  res.status(200).json(vendorTypes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: ErrorMessages.ServerError});
    }
  }

  async DeleteVendorType(req: Request, res: Response): Promise<Response> {
    try {
      const Id: string = req.query.Id as string;

      if (!Id) {
        return res.status(400).json({ error: "Vendor ID is required." });
      }

      await deleteVendorType(Id);
      return res.status(200).json({ message: "vendor deleted" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: ErrorMessages.ServerError});
    }
  }

  async getSingleVendor(req: Request, res: Response): Promise<Response> {
    try {
      const vendorTypeId: string | undefined = req.query?.id as
        | string
        | undefined;

      if (!vendorTypeId) {
       return res.status(400).json({ message: "Invalid vendor type Id" });
      }

      const result = await getSingleVendordata(vendorTypeId);
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: ErrorMessages.ServerError});
    }
  }

  async typeUpdate(req: Request, res: Response): Promise<Response> {
    try {
      const vendorTypeId: string | undefined = req.query?.id as
        | string
        | undefined;
      if (!vendorTypeId) {
        return res.status(400).json({ message: "Invalid vendor id.." });

      }
      const { type, status } = req.body;
      const result = await updateVendorType(vendorTypeId, type, status);
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: ErrorMessages.ServerError});
    }
  }

};


export default new VendorTypeController();

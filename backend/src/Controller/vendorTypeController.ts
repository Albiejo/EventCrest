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

  async addVendorType(req: Request, res: Response): Promise<void> {
    try {
      let { type, status } = req.body;
      console.log(req.body);

      const vendor = await addType(type, status);
      res.status(201).json(vendor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ErrorMessages.ServerError});
    }
  }

  async getVendorTypes(req: Request, res: Response): Promise<void> {
    try {
      const vendorTypes = await getTypes();
      res.status(200).json(vendorTypes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ErrorMessages.ServerError});
    }
  }

  async DeleteVendorType(req: Request, res: Response): Promise<void> {
    try {
      console.log("inside delete function ");

      const Id: string = req.query.Id as string;

      console.log(Id);

      if (!Id) {
        res.status(400).json({ error: "Vendor ID is required." });
        return;
      }
      await deleteVendorType(Id);
      res.status(200).json({ message: "vendor deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: ErrorMessages.ServerError});
    }
  }

  async getSingleVendor(req: Request, res: Response): Promise<void> {
    try {
      const vendorTypeId: string | undefined = req.query?.id as
        | string
        | undefined;

      if (!vendorTypeId) {
        res.status(400).json({ message: "Invalid vendor type Id" });
        return;
      }

      const result = await getSingleVendordata(vendorTypeId);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ErrorMessages.ServerError});
    }
  }

  async typeUpdate(req: Request, res: Response): Promise<void> {
    try {
      const vendorTypeId: string | undefined = req.query?.id as
        | string
        | undefined;
      if (!vendorTypeId) {
        res.status(400).json({ message: "Invalid vendor id.." });
        return;
      }

      const { type, status } = req.body;

      const result = await updateVendorType(vendorTypeId, type, status);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ErrorMessages.ServerError});
    }
  }

};


export default new VendorTypeController();

import express from "express";
import { AdminController } from "../Controller/adminController";
import { UserController } from "../Controller/userController";
import { VendorTypeController } from "../Controller/vendorTypeController";
import { VendorController } from "../Controller/vendorController";
import { PaymentController } from "../Controller/PaymentController";


const router = express.Router();


router.post('/login' , AdminController.Adminlogin);
router.get('/logout' , AdminController.Adminlogout);

router.get('/users' , UserController.allUsers);
router.patch('/block-unblock' , UserController.Toggleblock)
router.post('/refresh-token' , AdminController.createRefreshToken)

router.get('/getvendors' ,VendorController.getAllVendors )
router.get('/getVendor', VendorController.getVendor)
router.patch('/vendorblock-unblock' , VendorController.Toggleblock)


router.post('/add-type' , VendorTypeController.addVendorType);
router.get('/vendor-types' ,VendorTypeController.getVendorTypes);
router.delete('/deleteType' ,VendorTypeController.DeleteVendorType)
router.get('/singleVendor' , VendorTypeController.getSingleVendor)
router.put('/updateType' , VendorTypeController.typeUpdate)


router.put('/update-verify-status',VendorController.updateVerifyStatus);

router.get('/all-payment-details',PaymentController.getAllPayments);
export default router;



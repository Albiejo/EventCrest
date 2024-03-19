import express from 'express';
import { VendorController } from '../Controller/vendorController';
import { VendorTypeController } from '../../VendorType/Controller/vendorTypeController';  

const router = express.Router();


router.post('/signup' , VendorController.vendorSignup);
router.post('/verifyotp' ,VendorController.verifyOtp)
router.post('/login' , VendorController.VendorLogin)
router.get('/logout' , VendorController.VendorLogout)
router.get('/vendor-types' , VendorTypeController.getVendorTypes);
router.post('/vgetotp' , VendorController.VendorForgotPassword)
router.post('/verifyVendorotp' , VendorController.VerifyOtpForPassword)
router.post('/resetVendorPassword' , VendorController.ResetVendorPassword)
router.get('/getvendors' ,VendorController.getAllVendors )



export default router;
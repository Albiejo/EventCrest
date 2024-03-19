import express from 'express';
import { UserController } from '../Controller/userController';
import isBlocked from '../../files/middleware/UserAuth';
import { VendorController } from '../../Vendor/Controller/vendorController';


const router = express.Router();


router.post('/signup', UserController.UserSignup );
router.post('/verify' ,UserController.verifyOtp);
router.post('/resendOtp' ,UserController.ResendOtp)
router.post('/login', UserController.UserLogin );
router.get('/logout' , UserController.UserLogout);
router.post('/getotp' , UserController.UserForgotPassword)
router.post('/verify-otp' , UserController.VerifyOtpForPassword)
router.post('/resetpassword' , UserController.ResetUserPassword)
router.get('/getvendors' ,VendorController.getAllVendors )
router.post('/google/login' , UserController.UseGoogleLogin)
router.post('/google/register' , UserController.UseGoogleRegister)
router.post('/add-Favorite-Vendor' , UserController.AddFavVendor)






export default router;
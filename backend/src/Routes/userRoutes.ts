import express from 'express';
import { UserController } from '../Controller/userController';
import isBlocked from '../middleware/UserAuth';
import { VendorController } from '../Controller/vendorController';
import multer from 'multer';
import { BookingController } from '../Controller/BookingController';

const router = express.Router();


const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


router.post('/signup', UserController.UserSignup );
router.post('/verify' ,UserController.verifyOtp);
router.get('/resendOtp' ,UserController.ResendOtp)
router.post('/login', UserController.UserLogin );
router.get('/logout' , UserController.UserLogout);



router.post('/getotp' , UserController.UserForgotPassword)
router.post('/verify-otp' , UserController.VerifyOtpForPassword)
router.post('/resetpassword' , UserController.ResetUserPassword)


router.get('/getvendors' ,VendorController.getAllVendors )
router.get('/getVendor', VendorController.getVendor)

router.post('/google/login' , UserController.UseGoogleLogin)
router.post('/google/register' , UserController.UseGoogleRegister)


router.post('/add-Favorite-Vendor' , UserController.AddFavVendor)
router.get('/get-favorite-vendor' , UserController.getFavoriteVendors)

router.patch('/updatePassword' , UserController.UpdatePasswordController)

router.post('/addVendorReview' , VendorController.addVendorReview)

router.put('/updateProfile' ,upload.single('image'), UserController.UpdateProfileDetails)





export default router;
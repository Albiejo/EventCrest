import express from 'express';
import  UserController  from '../Controller/userController';
import  VendorController  from '../Controller/vendorController';
import multer from 'multer';
import BookingController  from '../Controller/bookingController';
import PaymentController  from '../Controller/paymentController';
import vendorTypeController from '../Controller/vendorTypeController';


//middleware
import authenticate from '../Middleware/userAuth';

const router = express.Router();


const storage = multer.memoryStorage()
const upload = multer({ storage: storage })




router.post('/signup', UserController.UserSignup );
router.post('/verify' ,UserController.verifyOtp);
router.get('/resendOtp' ,UserController.ResendOtp)
router.post('/login', UserController.UserLogin );
router.get('/logout' ,  UserController.UserLogout);
router.get('/getUser', UserController.getUser)


router.post('/getotp' , UserController.UserForgotPassword)
router.post('/verify-otp' , UserController.VerifyOtpForPassword)
router.post('/resetpassword' , UserController.ResetUserPassword)

router.post('/refresh-token' , UserController.createRefreshToken)

router.get('/getvendors' ,VendorController.getAllVendors )
router.get('/getVendor', VendorController.getVendor)

router.post('/google/login' , UserController.UseGoogleLogin)
router.post('/google/register' , UserController.UseGoogleRegister)


router.post('/add-Favorite-Vendor' , authenticate , UserController.AddFavVendor)
router.get('/get-favorite-vendor' , authenticate , UserController.getFavoriteVendors)

router.patch('/updatePassword' ,authenticate ,  UserController.UpdatePasswordController)

router.post('/addVendorReview' ,authenticate ,VendorController.addVendorReview)

router.put('/updateProfile' ,upload.single('image'),authenticate , UserController.UpdateProfileDetails)

router.post('/bookevent',authenticate ,BookingController.bookAnEvent)
router.get('/get-bookings',authenticate ,BookingController.getBookingsByUser)

router.post('/create-checkout-session',authenticate ,PaymentController.makePayment);
router.post('/add-payment', authenticate , PaymentController.addPayment);
router.get('/single-booking', authenticate ,BookingController.getBookingsById);

router.patch('/MarkAsRead' ,authenticate, UserController.MarkRead)
router.patch('/markCancel' , authenticate,BookingController.MarkasCancel)

router.get('/getVendorTypes'  ,vendorTypeController.getVendorTypes);

router.post('/subscribe',UserController.subscribe)

export default router;
import express from 'express';
import { VendorController } from '../Controller/vendorController';
import { VendorTypeController } from '../Controller/vendorTypeController';  
import { PostController } from '../Controller/PostController';
import multer from 'multer';



const router = express.Router();


const storage = multer.memoryStorage()
const upload = multer({ storage: storage })






router.post('/signup' , VendorController.vendorSignup);
router.post('/verifyotp' ,VendorController.verifyOtp)

router.post('/login' , VendorController.VendorLogin)
router.get('/logout' , VendorController.VendorLogout)



router.get('/vendor-types' , VendorTypeController.getVendorTypes);
router.post('/vgetotp' , VendorController.VendorForgotPassword);

router.post('/verifyVendorotp' , VendorController.VerifyOtpForPassword);
router.post('/resetVendorPassword' , VendorController.ResetVendorPassword);


router.get('/getvendors' ,VendorController.getAllVendors );

router.patch('/updateProfilePassword' , VendorController.UpdateProfilePassword);

router.post('/add-post' ,upload.single('image') ,PostController.addNewPost);
router.get('/posts',PostController.getPosts);
router.delete('/posts/:id',PostController.deletePost);




export default router;
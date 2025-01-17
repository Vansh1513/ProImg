import  express from 'express';
import { followAndUnfollow, forgetPassword, loginUser, logOutUser, myProfile, registerWithOtp, resetPassword, userProfile, verifyOtpAndRegister } from '../controllers/userControllers.js';
import { isAuth } from '../middlewares/isAuth.js';

const router=express.Router();

router.post("/register",registerWithOtp);
// router.post("/getOtp",otpGenerator);
router.post("/verifyOtp/:token",verifyOtpAndRegister);
router.post("/login",loginUser);
router.post("/forget",forgetPassword);
router.post("/reset-password/:token",resetPassword);
router.get("/logout",isAuth,logOutUser);
router.get("/me",isAuth,myProfile);
router.get("/:id",isAuth,userProfile);
router.post("/follow/:id",isAuth,followAndUnfollow);

export default router;
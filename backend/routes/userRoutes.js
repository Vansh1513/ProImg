import  express from 'express';
import { followAndUnfollow, forgetPassword, loginUser, logOutUser, myProfile, registerUser, resetPassword, userProfile } from '../controllers/userControllers.js';
import { isAuth } from '../middlewares/isAuth.js';

const router=express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/forget",forgetPassword);
router.post("/reset-password/:token",resetPassword);
router.get("/logout",isAuth,logOutUser);
router.get("/me",isAuth,myProfile);
router.get("/:id",isAuth,userProfile);
router.post("/follow/:id",isAuth,followAndUnfollow);

export default router;
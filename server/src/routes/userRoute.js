import express from 'express';
import { registerUser, userLogin, verifyOtp, resendOtp } from '../controllers/userController.js';
export const userRouter = express.Router();
userRouter.post('/register', registerUser);
userRouter.post('/verify-otp', verifyOtp);
userRouter.post('/resend-otp', resendOtp);
userRouter.post('/login', userLogin);
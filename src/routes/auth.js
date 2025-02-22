import { Router } from 'express';
import { createUser, loginUser, verifyOtp, resendOTP } from '../controllers/user.js';


const AuthRoutes = Router();


AuthRoutes.post('/login' , loginUser);
AuthRoutes.post('/register' , createUser);
AuthRoutes.post('/otp/verify' , verifyOtp);
AuthRoutes.post('/otp/resend', resendOTP);

export default AuthRoutes;
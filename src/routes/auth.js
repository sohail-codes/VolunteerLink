import { Router } from 'express';
import { createUser, loginUser, verifyOtp, resendOTP, setPassword } from '../controllers/user.js';
import { authMiddleware } from '../middlewares/auth.js';


const AuthRoutes = Router();


AuthRoutes.post('/login', loginUser);
AuthRoutes.post('/register', createUser);
AuthRoutes.post('/otp/verify', verifyOtp);
AuthRoutes.post('/otp/resend', resendOTP);
AuthRoutes.post('/password/reset', authMiddleware, setPassword);

export default AuthRoutes;
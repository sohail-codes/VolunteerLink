import { Router } from 'express';
import { createUser, loginUser, verifyOtp, resendOTP, setPassword , deleteAccount} from '../controllers/user.js';
import { authMiddleware } from '../middlewares/auth.js';


const AuthRoutes = Router();


AuthRoutes.post('/login', loginUser);
AuthRoutes.post('/register', createUser);
AuthRoutes.post('/otp/verify', verifyOtp);
AuthRoutes.post('/otp/resend', resendOTP);
AuthRoutes.post('/password/reset', authMiddleware, setPassword);
AuthRoutes.post('/account/delete', authMiddleware, deleteAccount);

export default AuthRoutes;
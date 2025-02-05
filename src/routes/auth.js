import { Router } from 'express';
import { createUser, loginUser } from '../controllers/user.js';


const AuthRoutes = Router();


AuthRoutes.post('/login' , loginUser);
AuthRoutes.post('/register' , createUser);


export default AuthRoutes;
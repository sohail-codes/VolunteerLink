import { Router } from 'express';
import AuthRoutes from './auth.js';
import UserRoutes from './user.js';
import EventRoutes from './event.js';


const router = Router();


router.use('/auth' , AuthRoutes);
router.use('/user' , UserRoutes);
router.use('/event' , EventRoutes);


export default router;
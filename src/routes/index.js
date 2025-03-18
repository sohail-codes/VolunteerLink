import { Router } from 'express';
import AuthRoutes from './auth.js';
import UserRoutes from './user.js';
import EventRoutes from './event.js';
import AssetRoutes from './asset.js';


const router = Router();


router.use('/auth' , AuthRoutes);
router.use('/user' , UserRoutes);
router.use('/event' , EventRoutes);
router.use('/asset' , AssetRoutes);


export default router;
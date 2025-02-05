import { Router } from 'express';
import { getUser } from '../controllers/user.js';
import { authMiddleware } from '../middlewares/auth.js';


const UserRoutes = Router();


UserRoutes.get('/me' , authMiddleware, getUser);
// UserRoutes.post('/', createAddress);
// UserRoutes.get('/', getAddresses);
// UserRoutes.get('/:uuid', getAddress);
// UserRoutes.put('/:uuid', updateAddress);
// UserRoutes.delete('/:uuid', deleteAddress);


export default UserRoutes;
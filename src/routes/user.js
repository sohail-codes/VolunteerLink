import { Router } from 'express';
import { getUser, updateUser } from '../controllers/user.js';
import { authMiddleware } from '../middlewares/auth.js';


const UserRoutes = Router();


UserRoutes.get('/me' , authMiddleware, getUser);
UserRoutes.post('/me' , authMiddleware, updateUser);
// UserRoutes.post('/', createAddress);
// UserRoutes.get('/', getAddresses);
// UserRoutes.get('/:uuid', getAddress);
// UserRoutes.put('/:uuid', updateAddress);
// UserRoutes.delete('/:uuid', deleteAddress);


export default UserRoutes;
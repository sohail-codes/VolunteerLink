import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { GetEvents, syncVolunteerConnector, createEvent, joinEvent , joinedEvents, exitEvent} from '../controllers/event.js';


const EventRoutes = Router();

EventRoutes.get('/upcoming/list', authMiddleware, GetEvents)
EventRoutes.get('/joined/list', authMiddleware, joinedEvents)
EventRoutes.get('/sync/volunteerconnector', syncVolunteerConnector);
EventRoutes.post('/create', createEvent);
EventRoutes.post('/join', authMiddleware, joinEvent);
EventRoutes.post('/exit', authMiddleware, exitEvent);

export default EventRoutes;
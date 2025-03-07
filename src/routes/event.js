import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { GetEvents, syncVolunteerConnector, createEvent, joinEvent } from '../controllers/event.js';


const EventRoutes = Router();

EventRoutes.get('/upcoming/list', authMiddleware, GetEvents)
EventRoutes.get('/sync/volunteerconnector', syncVolunteerConnector);
EventRoutes.post('/create', createEvent);
EventRoutes.post('/join', authMiddleware, joinEvent);

export default EventRoutes;
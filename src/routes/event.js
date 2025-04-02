import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { GetEvents, syncVolunteerConnector, createEvent, joinEvent, joinedEvents, exitEvent, getParticipations, updateParticipation, createEventNGO , ngoEvents} from '../controllers/event.js';


const EventRoutes = Router();

EventRoutes.get('/upcoming/list', authMiddleware, GetEvents)
EventRoutes.get('/joined/list', authMiddleware, joinedEvents)
EventRoutes.get('/ngo/list', authMiddleware, ngoEvents)
EventRoutes.get('/sync/volunteerconnector', syncVolunteerConnector);
EventRoutes.post('/create', createEvent);
EventRoutes.post('/ngo/create', authMiddleware, createEventNGO);
EventRoutes.post('/join', authMiddleware, joinEvent);
EventRoutes.post('/participant/update/status', authMiddleware, updateParticipation);
EventRoutes.get('/participants/:id', authMiddleware, getParticipations);
EventRoutes.post('/exit', authMiddleware, exitEvent);

export default EventRoutes;
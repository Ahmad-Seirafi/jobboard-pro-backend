import { Router } from 'express';
import { register, login, refresh, me } from '../controllers/authController.js';
import { auth } from '../middlewares/auth.js';

const r = Router();
r.post('/register', register);
r.post('/login', login);
r.post('/refresh', refresh);
r.get('/me', auth(true), me);
export default r;

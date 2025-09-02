import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { updateMe } from '../controllers/userController.js';

const r = Router();
r.patch('/me', auth(true), updateMe);
export default r;

import { Router } from 'express';
import { auth, requireRole } from '../middlewares/auth.js';
import { stats } from '../controllers/adminController.js';

const r = Router();
r.get('/stats', auth(true), requireRole(['admin']), stats);
export default r;

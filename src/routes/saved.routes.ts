import { Router } from 'express';
import { auth, requireRole } from '../middlewares/auth.js';
import { saveJob, unsaveJob, listSaved } from '../controllers/savedController.js';

const r = Router();
r.get('/mine', auth(true), requireRole(['user']), listSaved);
r.post('/:jobId', auth(true), requireRole(['user']), saveJob);
r.delete('/:jobId', auth(true), requireRole(['user']), unsaveJob);
export default r;

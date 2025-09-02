import { Router } from 'express';
import { auth, requireRole } from '../middlewares/auth.js';
import { createJob, listJobs, getJob, updateJob, deleteJob, publishJob, closeJob } from '../controllers/jobController.js';

const r = Router();
r.get('/', listJobs);
r.get('/:id', getJob);
r.post('/', auth(true), requireRole(['employer','admin']), createJob);
r.patch('/:id', auth(true), requireRole(['employer','admin']), updateJob);
r.delete('/:id', auth(true), requireRole(['employer','admin']), deleteJob);
r.post('/:id/publish', auth(true), requireRole(['employer','admin']), publishJob);
r.post('/:id/close', auth(true), requireRole(['employer','admin']), closeJob);
export default r;

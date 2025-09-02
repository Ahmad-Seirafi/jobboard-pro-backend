import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { auth, requireRole } from '../middlewares/auth.js';
import { applyToJob, listMyApplications, listJobApplications, updateApplicationStatus } from '../controllers/applicationController.js';
import { env } from '../config/env.js';

const uploadDir = env.UPLOAD_DIR;
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const r = Router();
r.post('/:jobId/apply', auth(true), requireRole(['user']), upload.single('resume'), applyToJob);
r.get('/mine', auth(true), requireRole(['user']), listMyApplications);
r.get('/job/:jobId', auth(true), requireRole(['employer','admin']), listJobApplications);
r.patch('/:id/status', auth(true), requireRole(['employer','admin']), updateApplicationStatus);
export default r;

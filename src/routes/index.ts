import { Router } from 'express';
import auth from './auth.routes.js';
import companies from './companies.routes.js';
import jobs from './jobs.routes.js';
import applications from './applications.routes.js';
import saved from './saved.routes.js';
import admin from './admin.routes.js';
import users from './users.routes.js';

const r = Router();
r.use('/auth', auth);
r.use('/companies', companies);
r.use('/jobs', jobs);
r.use('/applications', applications);
r.use('/saved', saved);
r.use('/admin', admin);
r.use('/users', users);
export default r;

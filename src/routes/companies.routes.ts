import { Router } from 'express';
import { auth, requireRole } from '../middlewares/auth.js';
import { createCompany, listCompanies, getCompany, updateCompany, deleteCompany } from '../controllers/companyController.js';

const r = Router();
r.get('/', listCompanies);
r.get('/:id', getCompany);
r.post('/', auth(true), requireRole(['employer','admin']), createCompany);
r.patch('/:id', auth(true), requireRole(['employer','admin']), updateCompany);
r.delete('/:id', auth(true), requireRole(['employer','admin']), deleteCompany);
export default r;

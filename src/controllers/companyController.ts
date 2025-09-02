import { Request, Response } from 'express';
import { z } from 'zod';
import { Company } from '../models/Company.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { HttpError } from '../middlewares/errorHandler.js';

const upsertSchema = z.object({
  name: z.string().min(2),
  website: z.string().url().optional(),
  location: z.string().optional(),
  description: z.string().optional()
});

export const createCompany = asyncHandler(async (req: Request, res: Response) => {
  const data = upsertSchema.parse(req.body);
  const company = await Company.create({ ...data, owner: req.user!.id });
  res.status(201).json({ company });
});

export const listCompanies = asyncHandler(async (_req: Request, res: Response) => {
  const companies = await Company.find().sort({ createdAt: -1 });
  res.json({ items: companies });
});

export const getCompany = asyncHandler(async (req: Request, res: Response) => {
  const company = await Company.findById(req.params.id);
  if (!company) throw new HttpError(404, 'Company not found');
  res.json({ company });
});

export const updateCompany = asyncHandler(async (req: Request, res: Response) => {
  const data = upsertSchema.partial().parse(req.body);
  const company = await Company.findById(req.params.id);
  if (!company) throw new HttpError(404, 'Company not found');
  if (String(company.owner) !== req.user!.id && req.user!.role !== 'admin') throw new HttpError(403, 'Forbidden');
  Object.assign(company, data);
  await company.save();
  res.json({ company });
});

export const deleteCompany = asyncHandler(async (req: Request, res: Response) => {
  const company = await Company.findById(req.params.id);
  if (!company) throw new HttpError(404, 'Company not found');
  if (String(company.owner) !== req.user!.id && req.user!.role !== 'admin') throw new HttpError(403, 'Forbidden');
  await company.deleteOne();
  res.status(204).send();
});

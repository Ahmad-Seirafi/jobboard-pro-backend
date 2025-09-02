import { Request, Response } from 'express';
import { z } from 'zod';
import { Job } from '../models/Job.js';
import { Company } from '../models/Company.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { HttpError } from '../middlewares/errorHandler.js';
import { buildPagination } from '../utils/pagination.js';

const createJobSchema = z.object({
  title: z.string().min(3),
  // كان min(10)
  description: z.string().min(8),
  location: z.string().min(2),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  type: z.enum(['full-time','part-time','contract','internship','remote']).default('full-time'),
  tags: z.array(z.string()).default([]),
  remote: z.boolean().optional(),
  benefits: z.array(z.string()).default([]),
  closesAt: z.coerce.date().optional(),
  companyId: z.string().min(1)
});

export const createJob = asyncHandler(async (req: Request, res: Response) => {
  const data = createJobSchema.parse(req.body);
  const company = await Company.findById(data.companyId);
  if (!company) throw new HttpError(404, 'Company not found');
  if (String(company.owner) !== req.user?.id && req.user?.role !== 'admin') {
    throw new HttpError(403, 'You are not allowed to post for this company');
  }
  const job = await Job.create({
    ...data,
    company: company._id,
    createdBy: req.user?.id
  });
  res.status(201).json({ job });
});

export const listJobs = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = buildPagination(req.query);
  const filters: any = {};
  if (req.query.q) filters.$text = { $search: String(req.query.q) };
  if (req.query.type) filters.type = req.query.type;
  if (req.query.location) filters.location = req.query.location;
  if (req.query.status) filters.status = req.query.status;
  if (req.query.tags) {
    const tags = String(req.query.tags).split(',').map(t => t.trim()).filter(Boolean);
    if (tags.length) filters.tags = { $all: tags };
  }
  if (req.query.remote) filters.remote = req.query.remote === 'true';
  const sort = req.query.sort === 'salary' ? '-salaryMax' : '-createdAt';

  const [items, total] = await Promise.all([
    Job.find(filters).sort(sort).skip(skip).limit(limit),
    Job.countDocuments(filters)
  ]);
  res.json({ page, limit, total, items });
});

export const getJob = asyncHandler(async (req: Request, res: Response) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new HttpError(404, 'Job not found');
  res.json({ job });
});

const updateJobSchema = createJobSchema.partial();

export const updateJob = asyncHandler(async (req: Request, res: Response) => {
  const data = updateJobSchema.parse(req.body);
  const job = await Job.findById(req.params.id);
  if (!job) throw new HttpError(404, 'Job not found');
  if (String(job.createdBy) !== req.user?.id && req.user?.role !== 'admin') {
    throw new HttpError(403, 'You are not allowed to edit this job');
  }
  Object.assign(job, data);
  await job.save();
  res.json({ job });
});

export const deleteJob = asyncHandler(async (req: Request, res: Response) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new HttpError(404, 'Job not found');
  if (String(job.createdBy) !== req.user?.id && req.user?.role !== 'admin') {
    throw new HttpError(403, 'You are not allowed to delete this job');
  }
  await job.deleteOne();
  res.status(204).send();
});

export const publishJob = asyncHandler(async (req: Request, res: Response) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new HttpError(404, 'Job not found');
  if (String(job.createdBy) !== req.user?.id && req.user?.role !== 'admin') {
    throw new HttpError(403, 'Forbidden');
  }
  job.status = 'open';
  await job.save();
  res.json({ job });
});

export const closeJob = asyncHandler(async (req: Request, res: Response) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new HttpError(404, 'Job not found');
  if (String(job.createdBy) !== req.user?.id && req.user?.role !== 'admin') {
    throw new HttpError(403, 'Forbidden');
  }
  job.status = 'closed';
  await job.save();
  res.json({ job });
});

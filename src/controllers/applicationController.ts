import { Request, Response } from 'express';
import { z } from 'zod';
import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { HttpError } from '../middlewares/errorHandler.js';

const applySchema = z.object({
  coverLetter: z.string().optional()
});

export const applyToJob = asyncHandler(async (req: Request, res: Response) => {
  const { coverLetter } = applySchema.parse(req.body);
  const jobId = req.params.jobId;
  const job = await Job.findById(jobId);
  if (!job) throw new HttpError(404, 'Job not found');
  const resumeUrl = (req as any).file ? `/uploads/${(req as any).file.filename}` : undefined;
  const application = await Application.create({
    job: job._id,
    applicant: req.user!.id,
    resumeUrl,
    coverLetter
  });
  res.status(201).json({ application });
});

export const listMyApplications = asyncHandler(async (req: Request, res: Response) => {
  const items = await Application.find({ applicant: req.user!.id }).sort({ createdAt: -1 });
  res.json({ items });
});

export const listJobApplications = asyncHandler(async (req: Request, res: Response) => {
  const items = await Application.find({ job: req.params.jobId }).sort({ createdAt: -1 });
  res.json({ items });
});

const updateStatusSchema = z.object({ status: z.enum(['reviewed','accepted','rejected']) });
export const updateApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = updateStatusSchema.parse(req.body);
  const app = await Application.findById(req.params.id);
  if (!app) throw new HttpError(404, 'Application not found');
  app.status = status;
  await app.save();
  res.json({ application: app });
});

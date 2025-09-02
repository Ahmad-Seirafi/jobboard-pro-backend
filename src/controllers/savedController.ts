import { Request, Response } from 'express';
import { SavedJob } from '../models/SavedJob.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { HttpError } from '../middlewares/errorHandler.js';

export const saveJob = asyncHandler(async (req: Request, res: Response) => {
  const doc = await SavedJob.create({ user: req.user!.id, job: req.params.jobId });
  res.status(201).json({ saved: doc });
});

export const unsaveJob = asyncHandler(async (req: Request, res: Response) => {
  const doc = await SavedJob.findOneAndDelete({ user: req.user!.id, job: req.params.jobId });
  if (!doc) throw new HttpError(404, 'Not saved');
  res.status(204).send();
});

export const listSaved = asyncHandler(async (req: Request, res: Response) => {
  const items = await SavedJob.find({ user: req.user!.id }).sort({ createdAt: -1 }).populate('job');
  res.json({ items });
});

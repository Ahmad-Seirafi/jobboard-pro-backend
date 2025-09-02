import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

export const stats = asyncHandler(async (_req: Request, res: Response) => {
  const [users, jobs, applications] = await Promise.all([
    User.countDocuments(),
    Job.countDocuments(),
    Application.countDocuments()
  ]);
  res.json({ users, jobs, applications });
});

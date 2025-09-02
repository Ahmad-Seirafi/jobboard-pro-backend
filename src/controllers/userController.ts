import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { User } from '../models/User.js';
import { z } from 'zod';

const updateSchema = z.object({
  name: z.string().min(2).optional()
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const data = updateSchema.parse(req.body);
  const user = await User.findById(req.user!.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  Object.assign(user, data);
  await user.save();
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

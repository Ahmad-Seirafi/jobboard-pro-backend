import { Request, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { HttpError } from '../middlewares/errorHandler.js';
import { signAccessToken, issueRefreshToken, rotateRefreshToken } from '../services/tokenService.js';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['user','employer']).default('user')
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new HttpError(409, 'Email already in use');
  const user = await User.create(data);
  const access = signAccessToken({ sub: user.id, role: user.role });
  const refresh = await issueRefreshToken(user.id);
  res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, tokens: { access, refresh } });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);
  const user = await User.findOne({ email: data.email }).select('+password');
  if (!user) throw new HttpError(401, 'Invalid credentials');
  const ok = await user.comparePassword(data.password);
  if (!ok) throw new HttpError(401, 'Invalid credentials');
  const access = signAccessToken({ sub: user.id, role: user.role });
  const refresh = await issueRefreshToken(user.id);
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, tokens: { access, refresh } });
});

const refreshSchema = z.object({ refreshToken: z.string().min(10) });
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = refreshSchema.parse(req.body);
  const { userId, newToken } = await rotateRefreshToken(refreshToken);
  const user = await User.findById(userId);
  if (!user) throw new HttpError(401, 'Invalid refresh token');
  const access = signAccessToken({ sub: user.id, role: user.role });
  res.json({ tokens: { access, refresh: newToken } });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) throw new HttpError(404, 'User not found');
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

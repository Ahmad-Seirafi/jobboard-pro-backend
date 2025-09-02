import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function auth(required: boolean = true) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
      if (required) return res.status(401).json({ error: 'No token provided' });
      return next();
    }
    const token = header.replace('Bearer ', '');
    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as any;
      req.user = { id: decoded.sub ?? decoded.id, role: decoded.role ?? 'user' };
      next();
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

export function requireRole(roles: Array<'user'|'employer'|'admin'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }
    next();
  };
}

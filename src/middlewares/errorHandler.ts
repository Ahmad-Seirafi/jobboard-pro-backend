import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: 'NotFound' });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  // ✅ Zod -> 400
  if (err instanceof ZodError || err?.name === 'ZodError') {
    return res.status(400).json({ error: 'ValidationError', details: err.errors });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || undefined;
  res.status(status).json({ error: message, details });
}

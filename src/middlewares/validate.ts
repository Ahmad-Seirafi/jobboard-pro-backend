import { AnyZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';
export function validate(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (e: any) {
      res.status(400).json({ error: 'ValidationError', details: e.errors });
    }
  };
}

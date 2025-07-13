import { Request, Response } from 'express';
import { logError } from './logError';

export const successResponse = (
  res: Response,
  statusCode: number,
  data: any,
  message: string
) => {
  return res.status(statusCode).json({ success: true, message, data });
};

export const errorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  error?: any,
  req?: Request // ✅ Add this optional 5th argument
) => {
  if (req) {
    logError(message, error, req);
  } else {
    logError(message, error);
  }

  return res.status(statusCode).json({ success: false, message, error });
};

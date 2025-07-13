// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import HttpStatus from '../utils/constants/httpStatus';
import Messages from '../utils/constants/messages';
import { errorResponse } from '../utils/apiResponse';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, HttpStatus.UNAUTHORIZED, '⚠️ No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (err) {
    return errorResponse(res, HttpStatus.UNAUTHORIZED, '⚠️ Invalid or expired token', err, req);
  }
};

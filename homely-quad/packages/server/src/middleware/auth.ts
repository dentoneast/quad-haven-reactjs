import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    const error = new Error('Access token required') as ApiError;
    error.statusCode = 401;
    return next(error);
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      const error = new Error('Invalid or expired token') as ApiError;
      error.statusCode = 403;
      return next(error);
    }

    req.user = user as any;
    next();
  });
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const error = new Error('Authentication required') as ApiError;
      error.statusCode = 401;
      return next(error);
    }

    if (!roles.includes(req.user.role)) {
      const error = new Error('Insufficient permissions') as ApiError;
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
};

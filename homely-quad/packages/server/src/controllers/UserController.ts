import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // In a real app, you would get user profile from the database
      const profile = {
        id: req.user?.id,
        email: req.user?.email,
        firstName: 'John',
        lastName: 'Doe',
        role: req.user?.role,
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      res.json({
        success: true,
        data: profile,
        message: 'Profile retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error('Validation failed') as ApiError;
        error.statusCode = 400;
        return next(error);
      }

      // In a real app, you would update the user profile in the database
      const updatedProfile = {
        id: req.user?.id,
        email: req.user?.email,
        ...req.body,
        updatedAt: new Date().toISOString(),
      };

      logger.info(`Profile updated for user ${req.user?.id}`);

      res.json({
        success: true,
        data: updatedProfile,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // In a real app, you would soft delete the user profile
      logger.info(`Profile deleted for user ${req.user?.id}`);

      res.json({
        success: true,
        message: 'Profile deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // In a real app, you would get all users from the database
      const users = [];

      res.json({
        success: true,
        data: users,
        message: 'Users retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // In a real app, you would get user by ID from the database
      const user = {
        id,
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        isActive: true,
      };

      res.json({
        success: true,
        data: user,
        message: 'User retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error('Validation failed') as ApiError;
        error.statusCode = 400;
        return next(error);
      }

      const { id } = req.params;

      // In a real app, you would update the user in the database
      const updatedUser = {
        id,
        ...req.body,
        updatedAt: new Date().toISOString(),
      };

      logger.info(`User ${id} updated by admin`);

      res.json({
        success: true,
        data: updatedUser,
        message: 'User updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // In a real app, you would soft delete the user
      logger.info(`User ${id} deleted by admin`);

      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { role } = req.body;

      // In a real app, you would update the user role in the database
      const updatedUser = {
        id,
        role,
        updatedAt: new Date().toISOString(),
      };

      logger.info(`User ${id} role updated to ${role} by admin`);

      res.json({
        success: true,
        data: updatedUser,
        message: 'User role updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

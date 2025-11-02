import { Router, Response, NextFunction } from 'express';
import { param, body, query } from 'express-validator';
import { UserController } from '../controllers/UserController';
import { MaintenanceController } from '../controllers/MaintenanceController';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();
const userController = new UserController();
const maintenanceController = new MaintenanceController();

// Validation middleware
const validateUserUpdate = [
  body('firstName').optional().trim().isLength({ min: 1 }),
  body('lastName').optional().trim().isLength({ min: 1 }),
  body('phone').optional().isMobilePhone('any'),
  body('avatar').optional().isURL(),
];

// All routes require authentication
router.use(authenticateToken);

// Public user profile routes (any authenticated user can access their own profile)
router.get('/profile', (req: AuthRequest, res: Response, next: NextFunction) => userController.getProfile(req, res, next));
router.put('/profile', validateUserUpdate, (req: AuthRequest, res: Response, next: NextFunction) => userController.updateProfile(req, res, next));
router.delete('/profile', (req: AuthRequest, res: Response, next: NextFunction) => userController.deleteProfile(req, res, next));

// Workmen list endpoint (accessible to landlords and admins for maintenance requests)
router.get('/workmen', requireRole(['landlord', 'admin']), (req: AuthRequest, res: Response, next: NextFunction) => maintenanceController.getWorkmen(req, res, next));

// Admin-only routes for user management
router.use(requireRole(['admin']));

router.get('/', (req: AuthRequest, res: Response, next: NextFunction) => userController.getAllUsers(req, res, next));
router.get('/:id', param('id').isInt(), (req: AuthRequest, res: Response, next: NextFunction) => userController.getUserById(req, res, next));
router.put('/:id', param('id').isInt(), validateUserUpdate, (req: AuthRequest, res: Response, next: NextFunction) => userController.updateUser(req, res, next));
router.delete('/:id', param('id').isInt(), (req: AuthRequest, res: Response, next: NextFunction) => userController.deleteUser(req, res, next));
router.put('/:id/role', param('id').isInt(), (req: AuthRequest, res: Response, next: NextFunction) => userController.updateUserRole(req, res, next));

export default router;

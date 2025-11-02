import { Router, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { MaintenanceController } from '../controllers/MaintenanceController';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const maintenanceController = new MaintenanceController();

// All maintenance routes require authentication
router.use(authenticateToken);

// Validation middleware
const validateCreateRequest = [
  body('unitId').notEmpty().withMessage('Unit ID is required'),
  body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Title must be between 1 and 255 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('category').optional().isIn(['plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'pest_control', 'general', 'other']).withMessage('Invalid category'),
];

const validateUpdateStatus = [
  body('status').isIn(['pending', 'approved', 'in_progress', 'completed', 'rejected']).withMessage('Invalid status'),
];

const validateAssignWorkman = [
  body('workmanId').notEmpty().withMessage('Workman ID is required'),
];

// Routes
router.get('/stats', (req: AuthRequest, res: Response, next: NextFunction) => maintenanceController.getStats(req, res, next));
router.get('/workmen', (req: AuthRequest, res: Response, next: NextFunction) => maintenanceController.getWorkmen(req, res, next));
router.get('/', (req: AuthRequest, res: Response, next: NextFunction) => maintenanceController.getAllRequests(req, res, next));
router.get('/:id', param('id').isInt(), (req: AuthRequest, res: Response, next: NextFunction) => maintenanceController.getRequestById(req, res, next));
router.post('/', validateCreateRequest, (req: AuthRequest, res: Response, next: NextFunction) => maintenanceController.createRequest(req, res, next));
router.put('/:id/status', param('id').isInt(), validateUpdateStatus, (req: AuthRequest, res: Response, next: NextFunction) => maintenanceController.updateStatus(req, res, next));
router.put('/:id/assign', param('id').isInt(), validateAssignWorkman, (req: AuthRequest, res: Response, next: NextFunction) => maintenanceController.assignWorkman(req, res, next));

export default router;

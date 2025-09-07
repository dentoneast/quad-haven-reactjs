import { Router } from 'express';
import { param, body } from 'express-validator';
import { UserController } from '../controllers/UserController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();
const userController = new UserController();

// Validation middleware
const validateUserUpdate = [
  body('firstName').optional().trim().isLength({ min: 1 }),
  body('lastName').optional().trim().isLength({ min: 1 }),
  body('phone').optional().isMobilePhone(),
  body('avatar').optional().isURL(),
];

// All routes require authentication
router.use(authenticateToken);

// User routes
router.get('/profile', userController.getProfile);
router.put('/profile', validateUserUpdate, userController.updateProfile);
router.delete('/profile', userController.deleteProfile);

// Admin routes
router.use(requireRole(['admin']));

router.get('/', userController.getAllUsers);
router.get('/:id', param('id').isUUID(), userController.getUserById);
router.put('/:id', param('id').isUUID(), validateUserUpdate, userController.updateUser);
router.delete('/:id', param('id').isUUID(), userController.deleteUser);
router.put('/:id/role', param('id').isUUID(), userController.updateUserRole);

export default router;

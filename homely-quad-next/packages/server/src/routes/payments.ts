import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { PaymentController } from '../controllers/PaymentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/stats', PaymentController.getStats);
router.get('/pending', PaymentController.getPending);
router.get('/overdue', PaymentController.getOverdue);

router.get(
  '/',
  query('status').optional().isString(),
  query('leaseId').optional().isInt(),
  PaymentController.getAll
);

router.get(
  '/:id',
  param('id').isInt().withMessage('Payment ID must be a valid integer'),
  PaymentController.getById
);

router.post(
  '/',
  body('leaseId').isInt().withMessage('Lease ID is required'),
  body('amount').isDecimal().withMessage('Amount must be a valid number'),
  body('dueDate').isISO8601().withMessage('Due date must be a valid date'),
  body('notes').optional().isString(),
  PaymentController.create
);

router.post(
  '/:id/record',
  param('id').isInt().withMessage('Payment ID must be a valid integer'),
  body('paymentMethod').optional().isString(),
  body('transactionId').optional().isString(),
  body('paidDate').optional().isISO8601(),
  body('notes').optional().isString(),
  PaymentController.recordPayment
);

router.delete(
  '/:id',
  param('id').isInt().withMessage('Payment ID must be a valid integer'),
  PaymentController.delete
);

export default router;

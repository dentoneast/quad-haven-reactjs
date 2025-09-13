import { Router } from 'express';
import { query, param, body } from 'express-validator';
import { PropertyController } from '../controllers/PropertyController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();
const propertyController = new PropertyController();

// Validation middleware
const validateProperty = [
  body('title').trim().isLength({ min: 1 }),
  body('description').trim().isLength({ min: 10 }),
  body('price').isNumeric().isFloat({ min: 0 }),
  body('currency').isLength({ min: 3, max: 3 }),
  body('location.address').trim().isLength({ min: 1 }),
  body('location.city').trim().isLength({ min: 1 }),
  body('location.state').trim().isLength({ min: 1 }),
  body('location.country').trim().isLength({ min: 1 }),
  body('location.postalCode').trim().isLength({ min: 1 }),
  body('type').isIn(['apartment', 'house', 'condo', 'studio', 'townhouse']),
];

const validateSearch = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('minPrice').optional().isNumeric(),
  query('maxPrice').optional().isNumeric(),
  query('propertyType').optional().isArray(),
  query('location').optional().trim(),
];

// Public routes
router.get('/', validateSearch, propertyController.getProperties);
router.get('/featured', propertyController.getFeaturedProperties);
router.get('/search', validateSearch, propertyController.searchProperties);
router.get('/:id', param('id').isUUID(), propertyController.getPropertyById);

// Protected routes
router.use(authenticateToken);

router.post('/', validateProperty, propertyController.createProperty);
router.put('/:id', param('id').isUUID(), validateProperty, propertyController.updateProperty);
router.delete('/:id', param('id').isUUID(), propertyController.deleteProperty);
router.post('/:id/favorite', param('id').isUUID(), propertyController.toggleFavorite);
router.get('/favorites', propertyController.getFavorites);
router.get('/:id/stats', param('id').isUUID(), propertyController.getPropertyStats);

// Owner-only routes
router.get('/owner/:ownerId', param('ownerId').isUUID(), propertyController.getPropertiesByOwner);

// Admin routes
router.use(requireRole(['admin']));
router.get('/admin/all', propertyController.getAllProperties);
router.put('/:id/status', param('id').isUUID(), propertyController.updatePropertyStatus);

export default router;

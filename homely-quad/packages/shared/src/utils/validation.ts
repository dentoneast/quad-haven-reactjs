import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
export const phoneSchema = z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number');

// User validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export const profileUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  phone: phoneSchema.optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
});

// Property validation schemas
export const propertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  location: z.object({
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    coordinates: z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    }),
  }),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  features: z.array(z.object({
    name: z.string().min(1, 'Feature name is required'),
    value: z.union([z.string(), z.number(), z.boolean()]),
    category: z.enum(['basic', 'amenities', 'utilities', 'safety']),
  })),
  type: z.enum(['apartment', 'house', 'condo', 'studio', 'townhouse']),
  status: z.enum(['available', 'rented', 'maintenance', 'unavailable']).optional(),
});

// Search validation schemas
export const searchFiltersSchema = z.object({
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  propertyType: z.array(z.enum(['apartment', 'house', 'condo', 'studio', 'townhouse'])).optional(),
  location: z.string().optional(),
  features: z.array(z.string()).optional(),
  availability: z.date().optional(),
});

// Form validation helper
export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
}

// Field validation helper
export function validateField<T>(
  schema: z.ZodSchema<T>,
  value: unknown,
  fieldName: string
): { isValid: boolean; error?: string } {
  try {
    schema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldError = error.errors.find((err) => err.path.includes(fieldName));
      return { isValid: false, error: fieldError?.message || 'Invalid value' };
    }
    return { isValid: false, error: 'Invalid value' };
  }
}

import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { eq, and, sql, desc } from 'drizzle-orm';
import { db } from '../db';
import { maintenanceRequests, units, properties, users } from '../../../shared/schema';
import { ApiError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

export class MaintenanceController {
  async getStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        const error = new Error('Unauthorized') as ApiError;
        error.statusCode = 401;
        return next(error);
      }

      // Build query based on role
      let whereCondition;
      if (userRole === 'tenant') {
        whereCondition = eq(maintenanceRequests.tenantId, userId);
      } else if (userRole === 'workman') {
        whereCondition = eq(maintenanceRequests.assignedTo, userId);
      }
      // Landlords can see all requests

      // Get counts for each status
      const baseQuery = db
        .select({
          status: maintenanceRequests.status,
          count: sql<number>`count(*)::int`,
        })
        .from(maintenanceRequests);

      const results = await (whereCondition 
        ? baseQuery.where(whereCondition).groupBy(maintenanceRequests.status)
        : baseQuery.groupBy(maintenanceRequests.status));

      // Transform results into stats object
      const stats = {
        pending: 0,
        approved: 0,
        in_progress: 0,
        completed: 0,
        total: 0,
      };

      results.forEach((row) => {
        const count = Number(row.count);
        stats.total += count;
        
        if (row.status === 'pending') stats.pending = count;
        else if (row.status === 'approved') stats.approved = count;
        else if (row.status === 'in_progress') stats.in_progress = count;
        else if (row.status === 'completed') stats.completed = count;
      });

      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  async getAllRequests(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;
      const { status, priority } = req.query;

      if (!userId || !userRole) {
        const error = new Error('Unauthorized') as ApiError;
        error.statusCode = 401;
        return next(error);
      }

      // Build conditions array
      const conditions = [];

      // Apply role-based filtering
      if (userRole === 'tenant') {
        conditions.push(eq(maintenanceRequests.tenantId, userId));
      } else if (userRole === 'workman') {
        conditions.push(eq(maintenanceRequests.assignedTo, userId));
      } else if (userRole === 'landlord') {
        conditions.push(eq(properties.ownerId, userId));
      }

      // Apply status filter
      if (status && typeof status === 'string') {
        conditions.push(eq(maintenanceRequests.status, status));
      }

      // Apply priority filter
      if (priority && typeof priority === 'string') {
        conditions.push(eq(maintenanceRequests.priority, priority));
      }

      // Build query with conditions
      const query = db
        .select({
          id: maintenanceRequests.id,
          unitId: maintenanceRequests.unitId,
          tenantId: maintenanceRequests.tenantId,
          assignedTo: maintenanceRequests.assignedTo,
          title: maintenanceRequests.title,
          description: maintenanceRequests.description,
          priority: maintenanceRequests.priority,
          status: maintenanceRequests.status,
          category: maintenanceRequests.category,
          createdAt: maintenanceRequests.createdAt,
          updatedAt: maintenanceRequests.updatedAt,
          resolvedAt: maintenanceRequests.resolvedAt,
          propertyName: properties.name,
          unitNumber: units.unitNumber,
          tenantFirstName: users.firstName,
          tenantLastName: users.lastName,
        })
        .from(maintenanceRequests)
        .innerJoin(units, eq(maintenanceRequests.unitId, units.id))
        .innerJoin(properties, eq(units.propertyId, properties.id))
        .innerJoin(users, eq(maintenanceRequests.tenantId, users.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(maintenanceRequests.createdAt));

      const requests = await query;

      // Get workman info separately for assigned requests
      const requestsWithWorkmen = await Promise.all(
        requests.map(async (request) => {
          let workmanName = null;
          if (request.assignedTo) {
            const workmanResults = await db
              .select({ firstName: users.firstName, lastName: users.lastName })
              .from(users)
              .where(eq(users.id, request.assignedTo))
              .limit(1);
            if (workmanResults.length > 0) {
              workmanName = `${workmanResults[0].firstName} ${workmanResults[0].lastName}`;
            }
          }
          return {
            ...request,
            tenantName: `${request.tenantFirstName} ${request.tenantLastName}`,
            workmanName,
          };
        })
      );

      res.json(requestsWithWorkmen);
    } catch (error) {
      logger.error('Error fetching maintenance requests:', error);
      next(error);
    }
  }

  async getRequestById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        const error = new Error('Unauthorized') as ApiError;
        error.statusCode = 401;
        return next(error);
      }

      const requestId = parseInt(id, 10);
      if (isNaN(requestId)) {
        const error = new Error('Invalid request ID') as ApiError;
        error.statusCode = 400;
        return next(error);
      }

      const results = await db
        .select({
          id: maintenanceRequests.id,
          unitId: maintenanceRequests.unitId,
          tenantId: maintenanceRequests.tenantId,
          assignedTo: maintenanceRequests.assignedTo,
          title: maintenanceRequests.title,
          description: maintenanceRequests.description,
          priority: maintenanceRequests.priority,
          status: maintenanceRequests.status,
          category: maintenanceRequests.category,
          createdAt: maintenanceRequests.createdAt,
          updatedAt: maintenanceRequests.updatedAt,
          resolvedAt: maintenanceRequests.resolvedAt,
          propertyName: properties.name,
          propertyId: properties.id,
          ownerId: properties.ownerId,
          unitNumber: units.unitNumber,
          tenantFirstName: sql<string>`tenant.first_name`,
          tenantLastName: sql<string>`tenant.last_name`,
          workmanFirstName: sql<string>`workman.first_name`,
          workmanLastName: sql<string>`workman.last_name`,
        })
        .from(maintenanceRequests)
        .innerJoin(units, eq(maintenanceRequests.unitId, units.id))
        .innerJoin(properties, eq(units.propertyId, properties.id))
        .leftJoin(sql`users AS tenant`, sql`maintenance_requests.tenant_id = tenant.id`)
        .leftJoin(sql`users AS workman`, sql`maintenance_requests.assigned_to = workman.id`)
        .where(eq(maintenanceRequests.id, requestId))
        .limit(1);

      if (!results || results.length === 0) {
        const error = new Error('Maintenance request not found') as ApiError;
        error.statusCode = 404;
        return next(error);
      }

      const request = results[0];

      // Check authorization
      const isAuthorized = 
        userRole === 'admin' ||
        request.tenantId === userId ||
        request.assignedTo === userId ||
        (userRole === 'landlord' && request.ownerId === userId);

      if (!isAuthorized) {
        const error = new Error('Forbidden') as ApiError;
        error.statusCode = 403;
        return next(error);
      }

      // Format the response
      const formattedRequest = {
        ...request,
        tenantName: request.tenantFirstName && request.tenantLastName
          ? `${request.tenantFirstName} ${request.tenantLastName}`
          : null,
        workmanName: request.workmanFirstName && request.workmanLastName
          ? `${request.workmanFirstName} ${request.workmanLastName}`
          : null,
      };

      res.json(formattedRequest);
    } catch (error) {
      logger.error('Error fetching maintenance request:', error);
      next(error);
    }
  }

  async createRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error('Validation failed') as ApiError;
        error.statusCode = 400;
        error.details = errors.array();
        return next(error);
      }

      const userId = req.user?.id;
      if (!userId) {
        const error = new Error('Unauthorized') as ApiError;
        error.statusCode = 401;
        return next(error);
      }

      const { unitId, title, description, priority, category } = req.body;

      // Validate unit exists
      const unitIdInt = parseInt(unitId, 10);
      if (isNaN(unitIdInt)) {
        const error = new Error('Invalid unit ID') as ApiError;
        error.statusCode = 400;
        return next(error);
      }

      const unitResults = await db
        .select()
        .from(units)
        .where(eq(units.id, unitIdInt))
        .limit(1);

      if (!unitResults || unitResults.length === 0) {
        const error = new Error('Unit not found') as ApiError;
        error.statusCode = 404;
        return next(error);
      }

      // Create maintenance request
      const newRequest = await db
        .insert(maintenanceRequests)
        .values({
          unitId: unitIdInt,
          tenantId: userId,
          title,
          description,
          priority: priority || 'medium',
          category: category || 'general',
          status: 'pending',
        })
        .returning();

      logger.info(`Maintenance request created by user ${userId}`);

      res.status(201).json(newRequest[0]);
    } catch (error) {
      logger.error('Error creating maintenance request:', error);
      next(error);
    }
  }

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error('Validation failed') as ApiError;
        error.statusCode = 400;
        error.details = errors.array();
        return next(error);
      }

      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        const error = new Error('Unauthorized') as ApiError;
        error.statusCode = 401;
        return next(error);
      }

      const requestId = parseInt(id, 10);
      if (isNaN(requestId)) {
        const error = new Error('Invalid request ID') as ApiError;
        error.statusCode = 400;
        return next(error);
      }

      // Get existing request with property owner info
      const existing = await db
        .select({
          request: maintenanceRequests,
          ownerId: properties.ownerId,
        })
        .from(maintenanceRequests)
        .innerJoin(units, eq(maintenanceRequests.unitId, units.id))
        .innerJoin(properties, eq(units.propertyId, properties.id))
        .where(eq(maintenanceRequests.id, requestId))
        .limit(1);

      if (!existing || existing.length === 0) {
        const error = new Error('Maintenance request not found') as ApiError;
        error.statusCode = 404;
        return next(error);
      }

      const existingRequest = existing[0].request;
      const ownerId = existing[0].ownerId;

      // Check authorization for status updates
      const canUpdate =
        (userRole === 'landlord' && ownerId === userId) ||
        (userRole === 'workman' && existingRequest.assignedTo === userId) ||
        userRole === 'admin';

      if (!canUpdate) {
        const error = new Error('Forbidden') as ApiError;
        error.statusCode = 403;
        return next(error);
      }

      // Validate status transitions
      const validStatuses = ['pending', 'approved', 'in_progress', 'completed', 'rejected'];
      if (!validStatuses.includes(status)) {
        const error = new Error('Invalid status') as ApiError;
        error.statusCode = 400;
        return next(error);
      }

      // Update the request
      const updateData: any = {
        status,
        updatedAt: new Date(),
      };

      if (status === 'completed') {
        updateData.resolvedAt = new Date();
      }

      const updated = await db
        .update(maintenanceRequests)
        .set(updateData)
        .where(eq(maintenanceRequests.id, requestId))
        .returning();

      logger.info(`Maintenance request ${requestId} status updated to ${status} by user ${userId}`);

      res.json(updated[0]);
    } catch (error) {
      logger.error('Error updating maintenance request status:', error);
      next(error);
    }
  }

  async assignWorkman(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error('Validation failed') as ApiError;
        error.statusCode = 400;
        error.details = errors.array();
        return next(error);
      }

      const { id } = req.params;
      const { workmanId } = req.body;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        const error = new Error('Unauthorized') as ApiError;
        error.statusCode = 401;
        return next(error);
      }

      const requestId = parseInt(id, 10);
      const workmanIdInt = parseInt(workmanId, 10);
      
      if (isNaN(requestId) || isNaN(workmanIdInt)) {
        const error = new Error('Invalid ID') as ApiError;
        error.statusCode = 400;
        return next(error);
      }

      // Only landlords can assign workmen
      if (userRole !== 'landlord' && userRole !== 'admin') {
        const error = new Error('Forbidden') as ApiError;
        error.statusCode = 403;
        return next(error);
      }

      // Verify workman exists and has correct role
      const workmanResults = await db
        .select()
        .from(users)
        .where(and(
          eq(users.id, workmanIdInt),
          eq(users.role, 'workman')
        ))
        .limit(1);

      if (!workmanResults || workmanResults.length === 0) {
        const error = new Error('Workman not found') as ApiError;
        error.statusCode = 404;
        return next(error);
      }

      // Get request with property owner info
      const requestResults = await db
        .select({
          request: maintenanceRequests,
          ownerId: properties.ownerId,
        })
        .from(maintenanceRequests)
        .innerJoin(units, eq(maintenanceRequests.unitId, units.id))
        .innerJoin(properties, eq(units.propertyId, properties.id))
        .where(eq(maintenanceRequests.id, requestId))
        .limit(1);

      if (!requestResults || requestResults.length === 0) {
        const error = new Error('Maintenance request not found') as ApiError;
        error.statusCode = 404;
        return next(error);
      }

      const ownerId = requestResults[0].ownerId;

      // Check if landlord owns the property
      if (userRole === 'landlord' && ownerId !== userId) {
        const error = new Error('Forbidden') as ApiError;
        error.statusCode = 403;
        return next(error);
      }

      // Assign workman
      const updated = await db
        .update(maintenanceRequests)
        .set({
          assignedTo: workmanIdInt,
          updatedAt: new Date(),
        })
        .where(eq(maintenanceRequests.id, requestId))
        .returning();

      logger.info(`Workman ${workmanIdInt} assigned to maintenance request ${requestId} by user ${userId}`);

      res.json(updated[0]);
    } catch (error) {
      logger.error('Error assigning workman:', error);
      next(error);
    }
  }

  async getWorkmen(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const workmen = await db
        .select({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          phone: users.phone,
        })
        .from(users)
        .where(eq(users.role, 'workman'));

      res.json(workmen);
    } catch (error) {
      logger.error('Error fetching workmen:', error);
      next(error);
    }
  }
}

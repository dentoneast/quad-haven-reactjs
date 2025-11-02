import { Request, Response } from 'express';
import { eq, and, gte, lte, desc, sql, or } from 'drizzle-orm';
import { db } from '../db';
import { payments, leases, units, properties, users } from '@homely-quad/shared/schema';

export class PaymentController {
  static async getStats(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      
      let stats;
      
      if (user.role === 'tenant') {
        stats = await db
          .select({
            status: payments.status,
            count: sql<number>`count(*)::int`,
            totalAmount: sql<string>`COALESCE(sum(${payments.amount}), 0)`,
          })
          .from(payments)
          .leftJoin(leases, eq(payments.leaseId, leases.id))
          .where(eq(leases.tenantId, user.id))
          .groupBy(payments.status);
      } else if (user.role === 'landlord') {
        stats = await db
          .select({
            status: payments.status,
            count: sql<number>`count(*)::int`,
            totalAmount: sql<string>`COALESCE(sum(${payments.amount}), 0)`,
          })
          .from(payments)
          .leftJoin(leases, eq(payments.leaseId, leases.id))
          .leftJoin(units, eq(leases.unitId, units.id))
          .leftJoin(properties, eq(units.propertyId, properties.id))
          .where(eq(properties.ownerId, user.id))
          .groupBy(payments.status);
      } else {
        stats = await db
          .select({
            status: payments.status,
            count: sql<number>`count(*)::int`,
            totalAmount: sql<string>`COALESCE(sum(${payments.amount}), 0)`,
          })
          .from(payments)
          .groupBy(payments.status);
      }

      const today = new Date();
      let overdueResult;

      if (user.role === 'tenant') {
        [overdueResult] = await db
          .select({
            count: sql<number>`count(*)::int`,
            totalAmount: sql<string>`COALESCE(sum(${payments.amount}), 0)`,
          })
          .from(payments)
          .leftJoin(leases, eq(payments.leaseId, leases.id))
          .where(and(
            eq(leases.tenantId, user.id),
            eq(payments.status, 'pending'),
            lte(payments.dueDate, today)
          ));
      } else if (user.role === 'landlord') {
        [overdueResult] = await db
          .select({
            count: sql<number>`count(*)::int`,
            totalAmount: sql<string>`COALESCE(sum(${payments.amount}), 0)`,
          })
          .from(payments)
          .leftJoin(leases, eq(payments.leaseId, leases.id))
          .leftJoin(units, eq(leases.unitId, units.id))
          .leftJoin(properties, eq(units.propertyId, properties.id))
          .where(and(
            eq(properties.ownerId, user.id),
            eq(payments.status, 'pending'),
            lte(payments.dueDate, today)
          ));
      } else {
        [overdueResult] = await db
          .select({
            count: sql<number>`count(*)::int`,
            totalAmount: sql<string>`COALESCE(sum(${payments.amount}), 0)`,
          })
          .from(payments)
          .where(and(
            eq(payments.status, 'pending'),
            lte(payments.dueDate, today)
          ));
      }

      const formattedStats = {
        pending: 0,
        paid: 0,
        overdue: 0,
        cancelled: 0,
        total: 0,
        totalAmount: '0',
        paidAmount: '0',
        overdueAmount: '0',
        pendingAmount: '0',
      };

      stats.forEach((stat) => {
        const status = stat.status as string;
        const count = Number(stat.count);
        const amount = stat.totalAmount;
        
        if (status === 'pending') {
          formattedStats.pending = count;
          formattedStats.pendingAmount = amount;
        } else if (status === 'paid') {
          formattedStats.paid = count;
          formattedStats.paidAmount = amount;
        } else if (status === 'cancelled') {
          formattedStats.cancelled = count;
        }
        
        formattedStats.total += count;
        formattedStats.totalAmount = (parseFloat(formattedStats.totalAmount) + parseFloat(amount)).toFixed(2);
      });

      formattedStats.overdue = Number(overdueResult?.count || 0);
      formattedStats.overdueAmount = overdueResult?.totalAmount || '0';

      res.json(formattedStats);
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      res.status(500).json({ error: 'Failed to fetch payment stats' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { status, leaseId } = req.query;

      const conditions = [];

      if (user.role === 'tenant') {
        conditions.push(eq(leases.tenantId, user.id));
      } else if (user.role === 'landlord') {
        conditions.push(eq(properties.ownerId, user.id));
      }

      if (status) {
        conditions.push(eq(payments.status, status as string));
      }

      if (leaseId) {
        conditions.push(eq(payments.leaseId, parseInt(leaseId as string)));
      }

      const baseSelect = db
        .select({
          payment: payments,
          lease: {
            id: leases.id,
            monthlyRent: leases.monthlyRent,
            startDate: leases.startDate,
            endDate: leases.endDate,
            status: leases.status,
          },
          unit: {
            id: units.id,
            unitNumber: units.unitNumber,
          },
          property: {
            id: properties.id,
            name: properties.name,
            address: properties.address,
          },
          tenant: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
          },
        })
        .from(payments)
        .leftJoin(leases, eq(payments.leaseId, leases.id))
        .leftJoin(units, eq(leases.unitId, units.id))
        .leftJoin(properties, eq(units.propertyId, properties.id))
        .leftJoin(users, eq(leases.tenantId, users.id));

      const results = conditions.length > 0
        ? await baseSelect.where(and(...conditions)).orderBy(desc(payments.dueDate))
        : await baseSelect.orderBy(desc(payments.dueDate));

      const formattedPayments = results.map((r) => ({
        ...r.payment,
        lease: r.lease,
        unit: r.unit,
        property: r.property,
        tenant: r.tenant,
      }));

      res.json(formattedPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ error: 'Failed to fetch payments' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      const [result] = await db
        .select({
          payment: payments,
          lease: {
            id: leases.id,
            monthlyRent: leases.monthlyRent,
            startDate: leases.startDate,
            endDate: leases.endDate,
            status: leases.status,
            deposit: leases.deposit,
            terms: leases.terms,
          },
          unit: {
            id: units.id,
            unitNumber: units.unitNumber,
            bedrooms: units.bedrooms,
            bathrooms: units.bathrooms,
            rent: units.rent,
          },
          property: {
            id: properties.id,
            name: properties.name,
            address: properties.address,
            city: properties.city,
            state: properties.state,
          },
          tenant: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            phone: users.phone,
          },
        })
        .from(payments)
        .leftJoin(leases, eq(payments.leaseId, leases.id))
        .leftJoin(units, eq(leases.unitId, units.id))
        .leftJoin(properties, eq(units.propertyId, properties.id))
        .leftJoin(users, eq(leases.tenantId, users.id))
        .where(eq(payments.id, parseInt(id)));

      if (!result) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      if (user.role === 'tenant' && result.tenant?.id !== user.id) {
        return res.status(403).json({ error: 'Access denied' });
      } else if (user.role === 'landlord') {
        const [propertyOwner] = await db
          .select({ ownerId: properties.ownerId })
          .from(properties)
          .where(eq(properties.id, result.property?.id || 0));
        
        if (propertyOwner?.ownerId !== user.id) {
          return res.status(403).json({ error: 'Access denied' });
        }
      }

      const formattedPayment = {
        ...result.payment,
        lease: result.lease,
        unit: result.unit,
        property: result.property,
        tenant: result.tenant,
      };

      res.json(formattedPayment);
    } catch (error) {
      console.error('Error fetching payment:', error);
      res.status(500).json({ error: 'Failed to fetch payment' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { leaseId, amount, dueDate, notes } = req.body;

      if (user.role !== 'landlord' && user.role !== 'admin') {
        return res.status(403).json({ error: 'Only landlords can create payment records' });
      }

      const [lease] = await db
        .select({
          id: leases.id,
          unitId: units.id,
          propertyId: properties.id,
          ownerId: properties.ownerId,
        })
        .from(leases)
        .leftJoin(units, eq(leases.unitId, units.id))
        .leftJoin(properties, eq(units.propertyId, properties.id))
        .where(eq(leases.id, leaseId));

      if (!lease) {
        return res.status(404).json({ error: 'Lease not found' });
      }

      if (user.role === 'landlord' && lease.ownerId !== user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const [newPayment] = await db
        .insert(payments)
        .values({
          leaseId,
          amount,
          dueDate: new Date(dueDate),
          status: 'pending',
          notes,
        })
        .returning();

      res.status(201).json(newPayment);
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ error: 'Failed to create payment' });
    }
  }

  static async recordPayment(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { id } = req.params;
      const { paymentMethod, transactionId, paidDate, notes } = req.body;

      const [payment] = await db
        .select({
          payment: payments,
          lease: leases,
          unit: units,
          property: properties,
        })
        .from(payments)
        .leftJoin(leases, eq(payments.leaseId, leases.id))
        .leftJoin(units, eq(leases.unitId, units.id))
        .leftJoin(properties, eq(units.propertyId, properties.id))
        .where(eq(payments.id, parseInt(id)));

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      if (user.role === 'tenant' && payment.lease?.tenantId !== user.id) {
        return res.status(403).json({ error: 'Access denied' });
      } else if (user.role === 'landlord' && payment.property?.ownerId !== user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const [updatedPayment] = await db
        .update(payments)
        .set({
          status: 'paid',
          paidDate: paidDate ? new Date(paidDate) : new Date(),
          paymentMethod,
          transactionId,
          notes: notes || payment.payment.notes,
          updatedAt: new Date(),
        })
        .where(eq(payments.id, parseInt(id)))
        .returning();

      res.json(updatedPayment);
    } catch (error) {
      console.error('Error recording payment:', error);
      res.status(500).json({ error: 'Failed to record payment' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      if (user.role !== 'landlord' && user.role !== 'admin') {
        return res.status(403).json({ error: 'Only landlords can delete payment records' });
      }

      const [payment] = await db
        .select({
          payment: payments,
          property: properties,
        })
        .from(payments)
        .leftJoin(leases, eq(payments.leaseId, leases.id))
        .leftJoin(units, eq(leases.unitId, units.id))
        .leftJoin(properties, eq(units.propertyId, properties.id))
        .where(eq(payments.id, parseInt(id)));

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      if (user.role === 'landlord' && payment.property?.ownerId !== user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      await db.delete(payments).where(eq(payments.id, parseInt(id)));

      res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
      console.error('Error deleting payment:', error);
      res.status(500).json({ error: 'Failed to delete payment' });
    }
  }

  static async getPending(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      const conditions = [eq(payments.status, 'pending')];

      if (user.role === 'tenant') {
        conditions.push(eq(leases.tenantId, user.id));
      } else if (user.role === 'landlord') {
        conditions.push(eq(properties.ownerId, user.id));
      }

      const results = await db
        .select({
          payment: payments,
          lease: {
            id: leases.id,
            monthlyRent: leases.monthlyRent,
          },
          unit: {
            id: units.id,
            unitNumber: units.unitNumber,
          },
          property: {
            id: properties.id,
            name: properties.name,
            address: properties.address,
          },
          tenant: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
          },
        })
        .from(payments)
        .leftJoin(leases, eq(payments.leaseId, leases.id))
        .leftJoin(units, eq(leases.unitId, units.id))
        .leftJoin(properties, eq(units.propertyId, properties.id))
        .leftJoin(users, eq(leases.tenantId, users.id))
        .where(and(...conditions))
        .orderBy(payments.dueDate);

      const formattedPayments = results.map((r) => ({
        ...r.payment,
        lease: r.lease,
        unit: r.unit,
        property: r.property,
        tenant: r.tenant,
      }));

      res.json(formattedPayments);
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      res.status(500).json({ error: 'Failed to fetch pending payments' });
    }
  }

  static async getOverdue(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const today = new Date();

      const conditions = [
        eq(payments.status, 'pending'),
        lte(payments.dueDate, today),
      ];

      if (user.role === 'tenant') {
        conditions.push(eq(leases.tenantId, user.id));
      } else if (user.role === 'landlord') {
        conditions.push(eq(properties.ownerId, user.id));
      }

      const results = await db
        .select({
          payment: payments,
          lease: {
            id: leases.id,
            monthlyRent: leases.monthlyRent,
          },
          unit: {
            id: units.id,
            unitNumber: units.unitNumber,
          },
          property: {
            id: properties.id,
            name: properties.name,
            address: properties.address,
          },
          tenant: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
          },
        })
        .from(payments)
        .leftJoin(leases, eq(payments.leaseId, leases.id))
        .leftJoin(units, eq(leases.unitId, units.id))
        .leftJoin(properties, eq(units.propertyId, properties.id))
        .leftJoin(users, eq(leases.tenantId, users.id))
        .where(and(...conditions))
        .orderBy(payments.dueDate);

      const formattedPayments = results.map((r) => ({
        ...r.payment,
        lease: r.lease,
        unit: r.unit,
        property: r.property,
        tenant: r.tenant,
      }));

      res.json(formattedPayments);
    } catch (error) {
      console.error('Error fetching overdue payments:', error);
      res.status(500).json({ error: 'Failed to fetch overdue payments' });
    }
  }
}

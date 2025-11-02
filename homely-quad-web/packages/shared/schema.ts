import { pgTable, serial, text, varchar, timestamp, boolean, integer, decimal, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  role: varchar('role', { length: 50 }).notNull().default('tenant'),
  isActive: boolean('is_active').notNull().default(true),
  emailVerified: boolean('email_verified').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Properties table
export const properties = pgTable('properties', {
  id: serial('id').primaryKey(),
  ownerId: integer('owner_id').notNull().references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 50 }).notNull(),
  zipCode: varchar('zip_code', { length: 20 }).notNull(),
  country: varchar('country', { length: 100 }).notNull().default('USA'),
  description: text('description'),
  propertyType: varchar('property_type', { length: 50 }).notNull(),
  totalUnits: integer('total_units').notNull().default(1),
  amenities: jsonb('amenities'),
  images: jsonb('images'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Units table
export const units = pgTable('units', {
  id: serial('id').primaryKey(),
  propertyId: integer('property_id').notNull().references(() => properties.id),
  unitNumber: varchar('unit_number', { length: 50 }).notNull(),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: decimal('bathrooms', { precision: 3, scale: 1 }).notNull(),
  squareFeet: integer('square_feet'),
  rent: decimal('rent', { precision: 10, scale: 2 }).notNull(),
  deposit: decimal('deposit', { precision: 10, scale: 2 }),
  status: varchar('status', { length: 50 }).notNull().default('available'),
  description: text('description'),
  amenities: jsonb('amenities'),
  images: jsonb('images'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Leases table
export const leases = pgTable('leases', {
  id: serial('id').primaryKey(),
  unitId: integer('unit_id').notNull().references(() => units.id),
  tenantId: integer('tenant_id').notNull().references(() => users.id),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  monthlyRent: decimal('monthly_rent', { precision: 10, scale: 2 }).notNull(),
  deposit: decimal('deposit', { precision: 10, scale: 2 }),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  terms: text('terms'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Maintenance Requests table
export const maintenanceRequests = pgTable('maintenance_requests', {
  id: serial('id').primaryKey(),
  unitId: integer('unit_id').notNull().references(() => units.id),
  tenantId: integer('tenant_id').notNull().references(() => users.id),
  assignedTo: integer('assigned_to').references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  priority: varchar('priority', { length: 50 }).notNull().default('medium'),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  category: varchar('category', { length: 100 }),
  images: jsonb('images'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at'),
});

// Payments table
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  leaseId: integer('lease_id').notNull().references(() => leases.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp('due_date').notNull(),
  paidDate: timestamp('paid_date'),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  paymentMethod: varchar('payment_method', { length: 50 }),
  transactionId: varchar('transaction_id', { length: 255 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Messages table
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  senderId: integer('sender_id').notNull().references(() => users.id),
  recipientId: integer('recipient_id').notNull().references(() => users.id),
  propertyId: integer('property_id').references(() => properties.id),
  subject: varchar('subject', { length: 255 }),
  body: text('body').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedProperties: many(properties),
  leases: many(leases),
  maintenanceRequests: many(maintenanceRequests),
  assignedMaintenanceRequests: many(maintenanceRequests),
  sentMessages: many(messages),
  receivedMessages: many(messages),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  owner: one(users, {
    fields: [properties.ownerId],
    references: [users.id],
  }),
  units: many(units),
}));

export const unitsRelations = relations(units, ({ one, many }) => ({
  property: one(properties, {
    fields: [units.propertyId],
    references: [properties.id],
  }),
  leases: many(leases),
  maintenanceRequests: many(maintenanceRequests),
}));

export const leasesRelations = relations(leases, ({ one, many }) => ({
  unit: one(units, {
    fields: [leases.unitId],
    references: [units.id],
  }),
  tenant: one(users, {
    fields: [leases.tenantId],
    references: [users.id],
  }),
  payments: many(payments),
}));

export const maintenanceRequestsRelations = relations(maintenanceRequests, ({ one }) => ({
  unit: one(units, {
    fields: [maintenanceRequests.unitId],
    references: [units.id],
  }),
  tenant: one(users, {
    fields: [maintenanceRequests.tenantId],
    references: [users.id],
  }),
  assignedWorker: one(users, {
    fields: [maintenanceRequests.assignedTo],
    references: [users.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  lease: one(leases, {
    fields: [payments.leaseId],
    references: [leases.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  recipient: one(users, {
    fields: [messages.recipientId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [messages.propertyId],
    references: [properties.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;
export type Unit = typeof units.$inferSelect;
export type InsertUnit = typeof units.$inferInsert;
export type Lease = typeof leases.$inferSelect;
export type InsertLease = typeof leases.$inferInsert;
export type MaintenanceRequest = typeof maintenanceRequests.$inferSelect;
export type InsertMaintenanceRequest = typeof maintenanceRequests.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

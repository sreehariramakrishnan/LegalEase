import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with role-based access
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { length: 20 }), // "user" or "lawyer"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Lawyer profiles - extended information for users with role="lawyer"
export const lawyerProfiles = pgTable("lawyer_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  specialization: text("specialization").notNull(),
  location: text("location").notNull(),
  country: varchar("country", { length: 2 }).notNull(), // IN, US, UK, etc.
  experience: integer("experience").notNull(), // years
  barNumber: text("bar_number"), // Bar association number
  languages: text("languages").array().notNull().default(sql`ARRAY['en']::text[]`),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  bio: text("bio"),
  verified: boolean("verified").notNull().default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").notNull().default(0),
  hearings: integer("hearings").notNull().default(0),
  eloRating: integer("elo_rating").notNull().default(1500),
  isOnline: boolean("is_online").notNull().default(false),
  status: varchar("status", { length: 20 }).notNull().default("offline"), // available, busy, offline
  whatsapp: varchar("whatsapp"),
  email: varchar("email"),
  phone: varchar("phone"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLawyerProfileSchema = createInsertSchema(lawyerProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  rating: true,
  reviewCount: true,
  hearings: true,
  eloRating: true,
});

export type InsertLawyerProfile = z.infer<typeof insertLawyerProfileSchema>;
export type LawyerProfile = typeof lawyerProfiles.$inferSelect;

// Bookings - consultation appointments
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  lawyerId: varchar("lawyer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, accepted, rejected, completed, cancelled
  caseTitle: text("case_title").notNull(),
  caseDescription: text("case_description").notNull(),
  preferredDate: timestamp("preferred_date"),
  preferredTime: varchar("preferred_time"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  contactPreference: varchar("contact_preference", { length: 20 }).default("in-app"), // in-app, whatsapp, email, phone
  externalContactInfo: text("external_contact_info"), // WhatsApp/email/phone shared by user
  acceptedAt: timestamp("accepted_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  status: true,
  acceptedAt: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// Messages - in-app chat between users and lawyers
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  senderId: varchar("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  read: true,
  createdAt: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
